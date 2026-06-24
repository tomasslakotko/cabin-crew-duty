import { create } from 'zustand';
import { localCateringRepository } from '../db/repositories/localCateringRepository';
import type { ChecklistItemState } from '../types/catering';

interface ChecklistState {
  items: Record<string, boolean>;
  loadedFlightId: string | null;
  loadChecklist: (flightId: string) => Promise<void>;
  toggleItem: (flightId: string, itemKey: string) => Promise<void>;
  isDone: (itemKey: string) => boolean;
  phaseProgress: (phase: string, total: number) => { done: number; total: number };
}

function itemKeyForPhase(phase: string, index: number): string {
  return `phase:${phase}:${index}`;
}

export function checklistKeyForPhaseStep(phase: string, index: number): string {
  return itemKeyForPhase(phase, index);
}

export function checklistKeyForBob(dutyId: string): string {
  return `bob:${dutyId}`;
}

export const useChecklistStore = create<ChecklistState>((set, get) => ({
  items: {},
  loadedFlightId: null,

  loadChecklist: async (flightId) => {
    const rows = await localCateringRepository.getChecklistItems(flightId);
    const items: Record<string, boolean> = {};
    for (const row of rows) {
      if (row.completed) items[row.itemKey] = true;
    }
    set({ items, loadedFlightId: flightId });
  },

  toggleItem: async (flightId, itemKey) => {
    const wasDone = get().items[itemKey] ?? false;
    const completed = !wasDone;
    const record: ChecklistItemState = {
      flightId,
      itemKey,
      completed,
      completedAt: completed ? Date.now() : undefined,
    };
    await localCateringRepository.saveChecklistItem(record);
    set((state) => {
      const next = { ...state.items };
      if (completed) next[itemKey] = true;
      else delete next[itemKey];
      return { items: next };
    });
  },

  isDone: (itemKey) => get().items[itemKey] ?? false,

  phaseProgress: (phase, total) => {
    const items = get().items;
    let done = 0;
    for (let i = 0; i < total; i++) {
      if (items[itemKeyForPhase(phase, i)]) done++;
    }
    return { done, total };
  },
}));

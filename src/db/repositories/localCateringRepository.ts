import { db } from '../schema';
import type {
  BobDutyCheck,
  CateringCart,
  CateringLineItem,
  CateringPhaseState,
  CateringSignoff,
  ChecklistItemState,
  SealGroup,
} from '../../types/catering';

export const localCateringRepository = {
  async getSealGroups(flightId: string): Promise<SealGroup[]> {
    return db.sealGroups.where('flightId').equals(flightId).toArray();
  },

  async saveSealGroup(group: SealGroup): Promise<void> {
    await db.sealGroups.put(group);
  },

  async getCarts(flightId: string): Promise<CateringCart[]> {
    const carts = await db.cateringCarts.where('flightId').equals(flightId).toArray();
    return carts.sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async saveCart(cart: CateringCart): Promise<void> {
    await db.cateringCarts.put(cart);
  },

  async deleteCart(cartId: string): Promise<void> {
    await db.cateringLineItems.where('cartId').equals(cartId).delete();
    await db.cateringCarts.delete(cartId);
  },

  async getLineItems(cartId: string): Promise<CateringLineItem[]> {
    return db.cateringLineItems.where('cartId').equals(cartId).toArray();
  },

  async saveLineItem(item: CateringLineItem): Promise<void> {
    await db.cateringLineItems.put(item);
  },

  async deleteLineItem(itemId: string): Promise<void> {
    await db.cateringLineItems.delete(itemId);
  },

  async getSignoff(flightId: string): Promise<CateringSignoff | undefined> {
    return db.cateringSignoffs.get(flightId);
  },

  async saveSignoff(signoff: CateringSignoff): Promise<void> {
    await db.cateringSignoffs.put(signoff);
  },

  async getBobChecks(flightId: string): Promise<BobDutyCheck[]> {
    return db.bobDutyChecks.where('flightId').equals(flightId).toArray();
  },

  async saveBobCheck(check: BobDutyCheck): Promise<void> {
    await db.bobDutyChecks.put(check);
  },

  async getPhases(flightId: string): Promise<CateringPhaseState[]> {
    return db.cateringPhases.where('flightId').equals(flightId).toArray();
  },

  async savePhase(phase: CateringPhaseState): Promise<void> {
    await db.cateringPhases.put(phase);
  },

  async getChecklistItems(flightId: string): Promise<ChecklistItemState[]> {
    return db.checklistItems.where('flightId').equals(flightId).toArray();
  },

  async saveChecklistItem(item: ChecklistItemState): Promise<void> {
    await db.checklistItems.put(item);
  },

  async deleteAllForFlight(flightId: string): Promise<void> {
    const carts = await db.cateringCarts.where('flightId').equals(flightId).toArray();
    for (const cart of carts) {
      await db.cateringLineItems.where('cartId').equals(cart.id).delete();
    }
    await db.sealGroups.where('flightId').equals(flightId).delete();
    await db.cateringCarts.where('flightId').equals(flightId).delete();
    await db.cateringSignoffs.delete(flightId);
    await db.bobDutyChecks.where('flightId').equals(flightId).delete();
    await db.cateringPhases.where('flightId').equals(flightId).delete();
    await db.checklistItems.where('flightId').equals(flightId).delete();
  },
};

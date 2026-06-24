import type { FlightBand } from './flightBands';

/** JC / BC menu service codes — extend as more menus are added. */
export type MenuServiceId =
  | 'jc_breakfast_ob'
  | 'jc_breakfast_ib'
  | 'jc_lunch_ob'
  | 'jc_lunch_ib';

export interface MenuCourseOption {
  name: string;
  vegetarian?: boolean;
}

export interface MenuCourse {
  courseLabel: string;
  items: MenuCourseOption[];
}

export interface BandMenuSection {
  id: MenuServiceId;
  /** e.g. JC BREAKFAST OB */
  label: string;
  courses: MenuCourse[];
}

/**
 * Band-specific catering menus from the manual.
 * Band 2 — breakfast & lunch OB/IB; Band 3 — breakfast & lunch OB/IB; more to follow.
 */
export const BAND_MENUS: Partial<Record<FlightBand, BandMenuSection[]>> = {
  2: [
    {
      id: 'jc_breakfast_ob',
      label: 'JC BREAKFAST OB',
      courses: [
        {
          courseLabel: 'Main course',
          items: [
            { name: 'Omelette with aivar, bacon, grilled tomato' },
            { name: 'Pancakes with blueberry preserve and honey' },
            { name: 'Vegetable risotto', vegetarian: true },
          ],
        },
      ],
    },
    {
      id: 'jc_breakfast_ib',
      label: 'JC BREAKFAST IB',
      courses: [
        {
          courseLabel: 'Main course',
          items: [
            { name: 'Frittata, Njeguška prosciutto, grilled cherry tomatoes' },
            { name: 'Zucchini pancakes, smoked roast pork and cream cheese with dill' },
            { name: 'Pasta with vegetables, parmesan cheese', vegetarian: true },
          ],
        },
      ],
    },
    {
      id: 'jc_lunch_ob',
      label: 'JC LUNCH OB',
      courses: [
        {
          courseLabel: 'Main course',
          items: [
            {
              name: 'Stuffed chicken with cheese and spinach, dollar potatoes, cheese sauce, cherry tomatoes',
            },
            { name: 'Pork fillet in aivar sauce, mashed potatoes, broccoli' },
            {
              name: 'Spring rolls with vegetables and noodles in sweet and spicy sauce',
              vegetarian: true,
            },
          ],
        },
        {
          courseLabel: 'Dessert',
          items: [{ name: 'Chili chocolate truffles' }],
        },
      ],
    },
    {
      id: 'jc_lunch_ib',
      label: 'JC LUNCH IB',
      courses: [
        {
          courseLabel: 'Main course',
          items: [
            { name: 'Bacon wrapped pork fillet, aivar sauce, mashed potatoes, mushrooms' },
            { name: 'Farfalle Bolognese, parmesan' },
            {
              name: 'Couscous with vegetables, chickpeas and saffron',
              vegetarian: true,
            },
          ],
        },
        {
          courseLabel: 'Dessert',
          items: [{ name: 'Lemon cheesecake' }],
        },
      ],
    },
  ],
  3: [
    {
      id: 'jc_breakfast_ob',
      label: 'JC BREAKFAST OB',
      courses: [
        {
          courseLabel: 'Main course',
          items: [
            { name: 'Omelette with beef prosciutto, grilled cheese, cherry tomatoes' },
            { name: 'Sweet stuffed French toast and vanilla sauce' },
            { name: 'Fried zucchini with grilled vegetables, tartar sauce', vegetarian: true },
          ],
        },
      ],
    },
    {
      id: 'jc_breakfast_ib',
      label: 'JC BREAKFAST IB',
      courses: [
        {
          courseLabel: 'Main course',
          items: [
            { name: 'Fried eggs in hollandaise sauce with grilled asparagus' },
            { name: 'Cheese pie, smoked roast pork, aivar' },
            { name: 'Vegetable risotto', vegetarian: true },
          ],
        },
      ],
    },
    {
      id: 'jc_lunch_ob',
      label: 'JC LUNCH OB',
      courses: [
        {
          courseLabel: 'Main course',
          items: [
            { name: 'Chicken in sweet and spicy sauce, rice with vegetables and soy sauce' },
            { name: 'Sea bass fillet, boiled potatoes, spinach and baby carrots' },
            {
              name: 'Stuffed pasta with tomatoes in Neapolitan sauce, parmesan',
              vegetarian: true,
            },
          ],
        },
        {
          courseLabel: 'Dessert',
          items: [{ name: 'Chocolate cake' }],
        },
      ],
    },
    {
      id: 'jc_lunch_ib',
      label: 'JC LUNCH IB',
      courses: [
        {
          courseLabel: 'Main course',
          items: [
            { name: 'Tagliata steak, dollar potatoes, sauteed vegetables' },
            { name: 'Sea bream fillet, mashed potatoes, broccoli' },
            { name: 'Orzo pasta with vegetables', vegetarian: true },
          ],
        },
        {
          courseLabel: 'Dessert',
          items: [{ name: 'Fruit cake' }],
        },
      ],
    },
  ],
};

export function getBandMenus(band: FlightBand): BandMenuSection[] {
  return BAND_MENUS[band] ?? [];
}

export function hasBandMenus(band: FlightBand): boolean {
  return getBandMenus(band).length > 0;
}

export interface StockableMealOption {
  key: string;
  menuId: MenuServiceId;
  menuLabel: string;
  name: string;
  vegetarian?: boolean;
}

/** Main-course lines from all JC menus for a band — used on the stocking screen. */
export function getStockableMeals(band: FlightBand): StockableMealOption[] {
  const options: StockableMealOption[] = [];
  for (const section of getBandMenus(band)) {
    for (const course of section.courses) {
      if (!course.courseLabel.toLowerCase().includes('main')) continue;
      for (const item of course.items) {
        options.push({
          key: `${section.id}::${item.name}`,
          menuId: section.id,
          menuLabel: section.label,
          name: item.name,
          vegetarian: item.vegetarian,
        });
      }
    }
  }
  return options;
}

export function getBandMenuLabels(band: FlightBand): string[] {
  return getBandMenus(band).map((s) => s.label);
}

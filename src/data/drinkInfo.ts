export interface DrinkInfo {
  image?: string;
  productName?: string;
  description?: string;
}

type DrinkInfoEntry = DrinkInfo | Record<string, DrinkInfo>;

const DRINK_INFO_MAP: Record<string, DrinkInfoEntry> = {
  Whiskey: {
    image: '/drinks/whiskey.webp',
    productName: "Jack Daniel's Tennessee Whiskey",
    description:
      'Smooth nose with woody and fruity undertones. Flavour of caramel, vanilla, oak and fruit from charred oak barrels.',
  },
  Vodka: {
    image: '/drinks/vodka.webp',
    productName: 'Finlandia Vodka',
    description:
      'Premium vodka from Finland — golden Finnish barley and glacial spring water. Dry, light and smooth.',
  },
  Gin: {
    image: '/drinks/gin.webp',
    productName: 'Gin Twin Tigers',
    description:
      'Premium craft gin with wild juniper from Mount Golija. Fresh pine aroma with chamomile, wood and almond notes.',
  },
  Prosecco: {
    productName: 'Le Contesse Prosecco – Extra dry',
    description:
      'Straw yellow with fruit and floral notes. Serve chilled 6–8°C.',
  },
  Wine: {
    White: {
      image: '/drinks/wine-white.webp',
      productName: 'White wine 100 žena Tamjanika',
      description:
        'Dry white with tropical grapefruit and lime aromas, subtle floral and spicy notes.',
    },
    Red: {
      image: '/drinks/wine-red.webp',
      productName: "Red wine FLEUR D'ORANGER",
      description:
        'Frankovka — full-bodied red with good persistence and characteristic red-fruit aroma.',
    },
  },
  Brandy: {
    Plum: {
      image: '/drinks/brandy.webp',
      productName: 'Rakia Bar — Plum (Šljivovica)',
      description:
        'Fruit brandy popular in the Balkans. Plum rakija — colorless unless aged in wooden barrels.',
    },
    Quince: {
      image: '/drinks/brandy.webp',
      productName: 'Rakia Bar — Quince',
      description:
        'Fruit brandy from quince. May be mixed with herbs, honey or walnuts after distillation.',
    },
    Pear: {
      image: '/drinks/brandy.webp',
      productName: 'Rakia Bar — Williams Pear',
      description:
        'Pear rakija — colorless spirit unless herbs or barrel aging are added.',
    },
  },
};

export function getDrinkInfo(name: string, variant?: string): DrinkInfo | null {
  const entry = DRINK_INFO_MAP[name];
  if (!entry) return null;

  if (variant) {
    const nested = (entry as Record<string, DrinkInfo>)[variant];
    if (nested && (nested.image || nested.productName)) return nested;
  }

  const direct = entry as DrinkInfo;
  if (direct.image || direct.productName) return direct;

  return null;
}

export function getDrinkDisplayName(name: string, variant?: string): string {
  const info = getDrinkInfo(name, variant);
  if (info?.productName) return info.productName;
  return variant ? `${name} (${variant})` : name;
}

import { BlogCategory } from "@/types/enums";

/**
 * Translations for blog categories in Chilean Spanish
 */
export const categoryTranslations: Record<BlogCategory, string> = {
  [BlogCategory.RECYCLING]: "Reciclaje",
  [BlogCategory.POLLUTION]: "Contaminación",
  [BlogCategory.SUSTAINABILITY]: "Sustentabilidad",
  [BlogCategory.CIRCULAR_ECONOMY]: "Economía Circular",
  [BlogCategory.USED_PRODUCTS]: "Productos Usados",
  [BlogCategory.REUSE]: "Reutilización",
  [BlogCategory.ENVIRONMENT]: "Medio Ambiente",
  [BlogCategory.UPCYCLING]: "Upcycling",
  [BlogCategory.RESPONSIBLE_CONSUMPTION]: "Consumo Responsable",
  [BlogCategory.ECO_TIPS]: "Tips Ecológicos",
  [BlogCategory.ENVIRONMENTAL_IMPACT]: "Impacto Ambiental",
  [BlogCategory.SUSTAINABLE_LIVING]: "Vida Sustentable",
  [BlogCategory.SECURITY]: "Seguridad",
  [BlogCategory.OTHER]: "Otro",
};

/**
 * Get the Spanish translation for a blog category
 */
export const getCategoryLabel = (category: BlogCategory): string => {
  return categoryTranslations[category] || category;
};

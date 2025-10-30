import { BlogType } from "@/types/enums";

/**
 * Translations for blog categories in Chilean Spanish
 */
export const categoryTranslations: Record<BlogType, string> = {
  RECYCLING: "Reciclaje",
  POLLUTION: "Contaminación",
  SUSTAINABILITY: "Sustentabilidad",
  CIRCULAR_ECONOMY: "Economía Circular",
  USED_PRODUCTS: "Productos Usados",
  REUSE: "Reutilización",
  ENVIRONMENT: "Medio Ambiente",
  UPCYCLING: "Upcycling",
  RESPONSIBLE_CONSUMPTION: "Consumo Responsable",
  ECO_TIPS: "Tips Ecológicos",
  ENVIRONMENTAL_IMPACT: "Impacto Ambiental",
  SUSTAINABLE_LIVING: "Vida Sustentable",
  SECURITY: "Seguridad",
  OTHER: "Otro",
};

/**
 * Get the Spanish translation for a blog category
 */
export const getCategoryLabel = (category: BlogType): string => {
  return categoryTranslations[category] || category;
};

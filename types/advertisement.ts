import { type AdvertisementType } from "./enums";

export type Advertisement = {
  id: number;
  adType: AdvertisementType;
  price: number;
  content: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  sellerId: string;
  productId?: number | null;
  storeProductId?: number | null;
  serviceId?: number | null;
  createdAt: Date;
  updatedAt: Date;
};

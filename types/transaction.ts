import { type TransactionKind, type ExchangeStatus } from "./enums";

export type Transaction = {
  id: number;
  kind: TransactionKind;
  pointsCollected: number;
  createdAt: Date;
  sellerId: string;
  transactionFeeId?: number | null;
};

export type Exchange = {
  id: number;
  transactionId: number;
  offeredProductId: number;
  requestedProductId: number;
  status: ExchangeStatus;
  notes?: string | null;
  createdAt: Date;
  completedAt?: Date | null;
};

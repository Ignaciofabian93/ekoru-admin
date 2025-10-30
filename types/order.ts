import {
  type ShippingStage,
  type PaymentStatus,
  type RefundStatus,
  type ChileanPaymentProvider,
  type PaymentEnvironment,
  type PaymentType,
} from "./enums";

export type Order = {
  id: number;
  sellerId: string;
  createdAt: Date;
  shippingStatusId: number;
  updatedAt: Date;
  version: number;
};

export type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  createdAt: Date;
};

export type ShippingStatus = {
  id: number;
  status: ShippingStage;
};

export type Payment = {
  id: number;
  orderId?: number | null;
  quotationId?: number | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentProvider: ChileanPaymentProvider;
  externalId?: string | null;
  externalToken?: string | null;
  description?: string | null;
  fees?: number | null;
  netAmount?: number | null;
  payerId: string;
  receiverId: string;
  failureReason?: string | null;
  metadata?: string | null;
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date | null;
  refundedAt?: Date | null;
  chileanConfigId: number;
  paymentType: PaymentType;
};

export type PaymentRefund = {
  id: number;
  paymentId: number;
  amount: number;
  reason: string;
  status: RefundStatus;
  externalId?: string | null;
  createdAt: Date;
  processedAt?: Date | null;
};

export type PaymentWebhook = {
  id: number;
  paymentId?: number | null;
  provider: ChileanPaymentProvider;
  eventType: string;
  externalId: string;
  payload: string;
  processed: boolean;
  processingError?: string | null;
  createdAt: Date;
  processedAt?: Date | null;
};

export type PaymentTransaction = {
  id: number;
  paymentId: number;
  action: string;
  amount?: number | null;
  status: string;
  description?: string | null;
  metadata?: string | null;
  createdAt: Date;
  createdBy?: string | null;
};

export type ChileanPaymentConfig = {
  id: number;
  sellerId: string;
  provider: ChileanPaymentProvider;
  merchantId?: string | null;
  apiKey?: string | null;
  secretKey?: string | null;
  environment: PaymentEnvironment;
  isActive: boolean;
  webhookUrl?: string | null;
  returnUrl?: string | null;
  cancelUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

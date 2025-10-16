export type Match = {
  id: number;
  senderId: string;
  receiverId: string;
  createdAt: Date;
  isMatched: boolean;
  updatedAt: Date;
};

export type Chat = {
  id: number;
  senderId: string;
  receiverId: string;
  productId?: number | null;
  isExchange: boolean;
  createdAt: Date;
};

export type Message = {
  id: number;
  chatId: number;
  senderId: string;
  content: string;
  createdAt: Date;
};

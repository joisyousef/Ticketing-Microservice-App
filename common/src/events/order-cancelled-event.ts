import { Subjects } from "./subjects.js";
import type { OrderStatus } from "./types/order-status.js";

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled;
  data: {
    id: string;
    ticket: {
      id: string;
    };
  };
}
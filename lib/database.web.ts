import type { Order } from './database.native';

let orders: Order[] = [];
let nextId = 1;

export type { Order } from './database.native';

export async function getDatabase() { return null; }

export async function getOrders(): Promise<Order[]> {
  return [...orders].sort((a, b) => b.id - a.id);
}

export async function createOrder(order: Omit<Order, 'id'>) {
  orders.push({ ...order, id: nextId++ });
}

export async function updateOrder(order: Order) {
  const idx = orders.findIndex((o) => o.id === order.id);
  if (idx >= 0) orders[idx] = { ...order };
}

export async function removeOrder(id: number) {
  orders = orders.filter((o) => o.id !== id);
}

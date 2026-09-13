import * as SQLite from 'expo-sqlite';

export type Order = {
  id: number;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  furnitureName: string;
  furnitureType: string;
  quantity: number;
  dimensions: string;
  description: string;
  totalPrice: number;
  paidAmount: number;
  dueAmount: number;
  orderDate: string;
  deliveryDate: string;
  paymentDueDate: string;
  note: string;
  status: string;
  paymentStatus: string;
  deliveryCompleted: number;
};

let database: SQLite.SQLiteDatabase | null = null;

export async function getDatabase() {
  if (database) return database;
  database = await SQLite.openDatabaseAsync('victor-app.db');
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderNumber TEXT NOT NULL UNIQUE,
      customerName TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL DEFAULT '',
      furnitureName TEXT NOT NULL,
      furnitureType TEXT NOT NULL DEFAULT '',
      quantity INTEGER NOT NULL DEFAULT 1,
      dimensions TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      totalPrice REAL NOT NULL DEFAULT 0,
      paidAmount REAL NOT NULL DEFAULT 0,
      dueAmount REAL NOT NULL DEFAULT 0,
      orderDate TEXT NOT NULL,
      deliveryDate TEXT NOT NULL DEFAULT '',
      paymentDueDate TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'নতুন অর্ডার',
      paymentStatus TEXT NOT NULL DEFAULT 'টাকা দেওয়া হয়নি',
      deliveryCompleted INTEGER NOT NULL DEFAULT 0
    );
  `);
  return database;
}

export async function getOrders(): Promise<Order[]> {
  const db = await getDatabase();
  return db.getAllAsync<Order>('SELECT * FROM orders ORDER BY id DESC');
}

export async function createOrder(order: Omit<Order, 'id'>) {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO orders (orderNumber, customerName, phone, address, furnitureName, furnitureType, quantity, dimensions, description, totalPrice, paidAmount, dueAmount, orderDate, deliveryDate, paymentDueDate, note, status, paymentStatus, deliveryCompleted)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    order.orderNumber, order.customerName, order.phone, order.address, order.furnitureName, order.furnitureType, order.quantity, order.dimensions, order.description, order.totalPrice, order.paidAmount, order.dueAmount, order.orderDate, order.deliveryDate, order.paymentDueDate, order.note, order.status, order.paymentStatus, order.deliveryCompleted,
  );
}

export async function updateOrder(order: Order) {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE orders SET customerName=?, phone=?, address=?, furnitureName=?, furnitureType=?, quantity=?, dimensions=?, description=?, totalPrice=?, paidAmount=?, dueAmount=?, orderDate=?, deliveryDate=?, paymentDueDate=?, note=?, status=?, paymentStatus=?, deliveryCompleted=? WHERE id=?`,
    order.customerName, order.phone, order.address, order.furnitureName, order.furnitureType, order.quantity, order.dimensions, order.description, order.totalPrice, order.paidAmount, order.dueAmount, order.orderDate, order.deliveryDate, order.paymentDueDate, order.note, order.status, order.paymentStatus, order.deliveryCompleted, order.id,
  );
}

export async function removeOrder(id: number) {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM orders WHERE id = ?', id);
}

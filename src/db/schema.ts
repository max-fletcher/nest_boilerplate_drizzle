import { sql } from 'drizzle-orm';
import { bigint, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
  name: varchar('name', { length: 300 }),
  email: varchar('email', { length: 300 }),
  password: varchar('password', { length: 300 }),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).$defaultFn(() => sql`ON UPDATE CURRENT_TIMESTAMP`),
});
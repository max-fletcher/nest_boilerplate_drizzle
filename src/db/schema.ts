import { relations, sql } from 'drizzle-orm';
import { bigint, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

// npx drizzle-kit generate:mysql
// npx drizzle-kit push:mysql

export const users = mysqlTable('users', {
  id: bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
  name: varchar('name', { length: 300 }).notNull().unique(),
  email: varchar('email', { length: 300 }).notNull().unique(),
  password: varchar('password', { length: 300 }).notNull(),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const posts = mysqlTable('posts', {
  id: bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
  user_id: bigint('user_id', { mode: 'number', unsigned: true }).references(() => users.id, {onDelete: 'cascade'}).notNull(),
  title: varchar('title', { length: 100 }).notNull(),
  text: varchar('text', { length: 300 }).notNull(),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.user_id],
    references: [users.id]
  }),
  comments: many(comments),
}));

export const comments = mysqlTable('comments', {
  id: bigint('id', { mode: 'number', unsigned: true }).primaryKey().autoincrement(),
  post_id: bigint('post_id', { mode: 'number', unsigned: true }).references(() => posts.id, {onDelete: 'cascade'}).notNull(),
  text: varchar('text', { length: 300 }).notNull(),
  created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.post_id],
    references: [posts.id]
  }),
}));
import type { Config } from 'drizzle-kit';

// npx drizzle-kit generate:mysql
// npx drizzle-kit push:mysql

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'mysql2',
  dbCredentials: {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    database: "nest_boilerplate_drizzle",
  }
} satisfies Config
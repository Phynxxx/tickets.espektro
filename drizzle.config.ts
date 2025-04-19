import { defineConfig } from 'drizzle-kit';


export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DB_URL!,
    authToken: process.env.TURSO_DB_TOKEN!,
  },
});

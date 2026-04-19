import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// ── Admin-managed projects ────────────────────────────────────────────────────
// Built-in projects (unity, sham, tameeni, wiqaya) are defined in code.
// This table holds CUSTOM projects added via the master dashboard.
export const adminProjectsTable = pgTable("admin_projects", {
  id:        serial("id").primaryKey(),
  key:       text("key").unique().notNull(),
  label:     text("label").notNull(),
  apiBase:   text("api_base").notNull(),
  sitePath:  text("site_path").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type InsertAdminProject = typeof adminProjectsTable.$inferInsert;
export type AdminProject       = typeof adminProjectsTable.$inferSelect;

import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  publicId: text("public_id").notNull().unique(), // The auto-generated Order ID
  fill: text("fill").notNull(),
  info: text("info").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRecipeSchema = createInsertSchema(recipes).pick({
  fill: true,
  info: true,
});

export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;

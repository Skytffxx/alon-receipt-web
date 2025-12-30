import { db } from "./db";
import { recipes, type InsertRecipe, type Recipe } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export interface IStorage {
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  getRecipes(): Promise<Recipe[]>;
  getRecipe(publicId: string): Promise<Recipe | undefined>;
  deleteReceipt(publicId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    // Generate a simple readable ID, e.g., ALON-12345
    // Using nanoid for uniqueness, but keeping it short for "Order ID" feel if desired, 
    // or just a standard UUID. Let's use a custom format for "Alon Hosting".
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const publicId = `ALON-${randomSuffix}`;

    const [recipe] = await db
      .insert(recipes)
      .values({ 
        ...insertRecipe, 
        publicId,
        ram: insertRecipe.ram || null,
        cpu: insertRecipe.cpu || null,
        disk: insertRecipe.disk || null,
        price: insertRecipe.price || null,
        discordId: insertRecipe.discordId || null,
        discordName: insertRecipe.discordName || null
      })
      .returning();
    return recipe;
  }

  async getRecipes(): Promise<Recipe[]> {
    return await db.select().from(recipes).orderBy(desc(recipes.createdAt));
  }

  async getRecipe(publicId: string): Promise<Recipe | undefined> {
    const [recipe] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.publicId, publicId));
    return recipe;
  }

  async deleteReceipt(publicId: string): Promise<boolean> {
    const result = await db.delete(recipes).where(eq(recipes.publicId, publicId)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();

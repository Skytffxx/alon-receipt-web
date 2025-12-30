import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

async function seed() {
  const existing = await storage.getRecipes();
  if (existing.length === 0) {
    console.log("Seeding database...");
    await storage.createRecipe({
      fill: "Sample Hosting Plan",
      info: "Basic VPS - 2GB RAM, 1 vCPU, 40GB SSD"
    });
    await storage.createRecipe({
      fill: "Premium Dedicated",
      info: "Dedicated Server - 64GB RAM, 16 vCPU, 2TB NVMe"
    });
    console.log("Seeding complete.");
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await seed();

  app.get(api.recipes.list.path, async (req, res) => {
    const recipes = await storage.getRecipes();
    res.json(recipes);
  });

  app.post(api.recipes.create.path, async (req, res) => {
    try {
      const input = api.recipes.create.input.parse(req.body);
      const recipe = await storage.createRecipe(input);
      res.status(201).json(recipe);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.recipes.get.path, async (req, res) => {
    const recipe = await storage.getRecipe(req.params.publicId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  });

  return httpServer;
}

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../../shared/schema";
import { recipes, type InsertRecipe } from "../../shared/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { insertRecipeSchema, api } from "../../shared/routes";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function seed() {
  const existing = await db.select().from(recipes);
  if (existing.length === 0) {
    console.log("Seeding database...");
    await db.insert(recipes).values([
      {
        fill: "Sample Hosting Plan",
        info: "Basic VPS - 2GB RAM, 1 vCPU, 40GB SSD",
        publicId: `ALON-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      },
      {
        fill: "Premium Dedicated",
        info: "Dedicated Server - 64GB RAM, 16 vCPU, 2TB NVMe",
        publicId: `ALON-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      },
    ]);
    console.log("Seeding complete.");
  }
}

export default async (req: any, context: any) => {
  const url = new URL(req.url);
  const pathname = url.pathname.replace("/.netlify/functions/recipes", "");

  try {
    // GET /api/recipes - list all recipes
    if (req.method === "GET" && pathname === "") {
      const allRecipes = await db.select().from(recipes).orderBy(desc(recipes.createdAt));
      return new Response(JSON.stringify(allRecipes), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // POST /api/recipes - create new recipe
    if (req.method === "POST" && pathname === "") {
      try {
        const body = await req.json();
        const input = insertRecipeSchema.parse(body);
        const publicId = `ALON-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        const [recipe] = await db
          .insert(recipes)
          .values({
            ...input,
            publicId,
            ram: input.ram || null,
            cpu: input.cpu || null,
            disk: input.disk || null,
            price: input.price || null,
            discordId: input.discordId || null,
            discordName: input.discordName || null,
          })
          .returning();

        return new Response(JSON.stringify(recipe), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        if (err instanceof z.ZodError) {
          return new Response(
            JSON.stringify({
              message: err.errors[0].message,
              field: err.errors[0].path.join("."),
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
        throw err;
      }
    }

    // GET /api/recipes/:publicId - get single recipe
    if (req.method === "GET" && pathname.startsWith("/")) {
      const publicId = pathname.substring(1);
      const [recipe] = await db
        .select()
        .from(recipes)
        .where(eq(recipes.publicId, publicId));

      if (!recipe) {
        return new Response(JSON.stringify({ message: "Recipe not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(recipe), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // DELETE /api/recipes/:publicId - delete recipe
    if (req.method === "DELETE" && pathname.startsWith("/")) {
      const publicId = pathname.substring(1);
      const result = await db.delete(recipes).where(eq(recipes.publicId, publicId)).returning();

      if (result.length === 0) {
        return new Response(JSON.stringify({ message: "Recipe not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(null, { status: 204 });
    }

    return new Response(JSON.stringify({ message: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ message: error instanceof Error ? error.message : "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

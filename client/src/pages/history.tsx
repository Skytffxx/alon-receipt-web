import { useRecipes } from "@/hooks/use-recipes";
import { Layout } from "@/components/layout";
import { RecipeCard } from "@/components/recipe-card";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useState } from "react";

export default function History() {
  const { data: recipes, isLoading } = useRecipes();
  const [search, setSearch] = useState("");

  const filteredRecipes = recipes?.filter(recipe => 
    recipe.fill.toLowerCase().includes(search.toLowerCase()) || 
    recipe.publicId.toLowerCase().includes(search.toLowerCase()) ||
    recipe.info.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Receipt History
          </h1>
          <p className="text-muted-foreground">
            Browse through all previously generated receipts and orders.
          </p>
        </div>

        <div className="mb-8 relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Search by ID, content, or info..."
            className="pl-10 h-12 rounded-xl border-border bg-card shadow-sm focus:border-primary focus:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading history...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredRecipes && filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe, index) => (
                <div 
                  key={recipe.id} 
                  className="animate-enter"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <RecipeCard recipe={recipe} variant="full" />
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-muted/50 rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground text-lg font-medium">No receipts found</p>
                <p className="text-muted-foreground/60 mt-2">Try adjusting your search or generate a new receipt.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

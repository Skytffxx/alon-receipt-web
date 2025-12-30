import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type RecipeInput } from "@shared/routes";

export function useRecipes() {
  return useQuery({
    queryKey: [api.recipes.list.path],
    queryFn: async () => {
      const res = await fetch(api.recipes.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch recipes");
      return api.recipes.list.responses[200].parse(await res.json());
    },
  });
}

export function useRecipe(publicId: string) {
  return useQuery({
    queryKey: [api.recipes.get.path, publicId],
    queryFn: async () => {
      if (!publicId) return null;
      const url = buildUrl(api.recipes.get.path, { publicId });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch recipe");
      return api.recipes.get.responses[200].parse(await res.json());
    },
    enabled: !!publicId,
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: RecipeInput) => {
      const validated = api.recipes.create.input.parse(data);
      const res = await fetch(api.recipes.create.path, {
        method: api.recipes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.recipes.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create recipe");
      }
      
      return api.recipes.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.recipes.list.path] });
    },
  });
}

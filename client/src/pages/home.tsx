import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateRecipe, useRecipes } from "@/hooks/use-recipes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/layout";
import { RecipeCard } from "@/components/recipe-card";
import { Loader2, Sparkles, History, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  fill: z.string().min(1, "Fill details are required"),
  info: z.string().min(1, "Information is required"),
  ram: z.string().optional(),
  cpu: z.string().optional(),
  disk: z.string().optional(),
  price: z.string().optional(),
  discordId: z.string().optional(),
  discordName: z.string().optional(),
});

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Home() {
  const { toast } = useToast();
  const createRecipe = useCreateRecipe();
  const { data: recentRecipes, isLoading: isLoadingHistory } = useRecipes();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fill: "",
      info: "",
      ram: "",
      cpu: "",
      disk: "",
      price: "",
      discordId: "",
      discordName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createRecipe.mutateAsync(values);
      toast({
        title: "Success!",
        description: "Recipe generated successfully.",
      });
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  }

  // Show the most recently created recipe if exists, otherwise show null
  const latestRecipe = createRecipe.data;

  // Get last 3 recipes for the sidebar
  const sidebarRecipes = recentRecipes?.slice(0, 3) || [];

  return (
    <Layout>
      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="text-center lg:text-left mb-8 animate-enter">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
              Generate New Recipe
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Create professional order recipes for your hosting clients instantly. 
              All generated recipes are automatically archived.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {latestRecipe ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Generated Recipe
                  </h2>
                  <Button variant="ghost" onClick={() => createRecipe.reset()} className="hover-elevate">
                    Create Another
                  </Button>
                </div>
                <RecipeCard recipe={latestRecipe} />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-card rounded-2xl border border-border shadow-xl p-6 md:p-8"
              >
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="fill"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-semibold">Service/Plan Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. Premium Hosting Package" 
                              className="h-12 text-lg bg-background border-border focus:ring-primary transition-all" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-semibold">RAM (GB)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select RAM" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 100 }, (_, i) => i + 1).map((val) => (
                                  <SelectItem key={val} value={`${val}GB`}>
                                    {val} GB
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cpu"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-semibold">CPU (Cores)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select CPU" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 100 }, (_, i) => i + 1).map((val) => (
                                  <SelectItem key={val} value={`${val} Cores`}>
                                    {val} Cores
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="disk"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-semibold">Disk (GB)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Disk" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[...Array.from({ length: 100 }, (_, i) => (i + 1) * 10)].map((val) => (
                                  <SelectItem key={val} value={`${val}GB`}>
                                    {val} GB
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-semibold">Price</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. $19.99/mo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="discordName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-semibold">Discord Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="discordId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground font-semibold">Discord ID</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 123456789" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="info"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-semibold">Information & Notes</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter detailed specifications, client requirements, or server configuration notes..." 
                              className="min-h-[160px] text-base resize-y bg-background border-border focus:ring-primary transition-all" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full h-14 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                      disabled={createRecipe.isPending}
                    >
                      {createRecipe.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Recipe"
                      )}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Recent History */}
        <div className="lg:col-span-1 mt-8 lg:mt-0 animate-enter delay-200">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
                <History className="w-5 h-5 text-muted-foreground" />
                Recent Activity
              </h2>
              <Link href="/history" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-4">
              {isLoadingHistory ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
                ))
              ) : sidebarRecipes.length > 0 ? (
                sidebarRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} variant="compact" />
                ))
              ) : (
                <div className="text-center py-12 bg-muted/50 rounded-xl border border-dashed border-border">
                  <p className="text-muted-foreground text-sm">No recipes generated yet</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-2xl border border-primary/10">
              <h3 className="font-semibold text-primary mb-2">Pro Tip</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Use detailed descriptions in the "Info" field. All generated IDs are unique and can be used for tracking orders in your system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

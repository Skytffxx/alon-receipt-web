import { type RecipeResponse } from "@shared/routes";
import { format } from "date-fns";
import { Download, Copy, Check, FileText, Cpu, HardDrive, Zap, CreditCard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

interface RecipeCardProps {
  recipe: RecipeResponse;
  variant?: "full" | "compact";
}

export function RecipeCard({ recipe, variant = "full" }: RecipeCardProps) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true
      });
      const link = document.createElement("a");
      link.download = `Alon-Receipt-${recipe.publicId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to download image", err);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(recipe.publicId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === "compact") {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow group"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="bg-primary/5 text-primary px-2.5 py-1 rounded-md text-xs font-mono font-medium border border-primary/10">
            #{recipe.publicId}
          </div>
          <span className="text-xs text-muted-foreground">
            {format(new Date(recipe.createdAt || new Date()), "MMM d, yyyy")}
          </span>
        </div>
        <h3 className="font-semibold text-foreground mb-1 truncate">{recipe.fill}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{recipe.info}</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden"
    >
      <div className="bg-muted/30 border-b border-border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
              Receipt
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              {format(new Date(recipe.createdAt || new Date()), "MMMM d, yyyy 'at' h:mm a")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-mono font-bold text-foreground tracking-tight">
              {recipe.publicId}
            </h2>
            <button 
              onClick={handleCopyId}
              className="text-muted-foreground hover:text-primary transition-colors p-1"
              title="Copy ID"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <Button onClick={handleDownload} variant="outline" className="gap-2 border-border hover:bg-card hover:text-primary hover:border-primary/30 shadow-sm no-default-hover-elevate">
          <Download className="w-4 h-4" />
          Download Receipt
        </Button>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Service Name
              </h3>
              <div className="bg-muted/50 rounded-xl p-4 border border-border text-lg text-foreground font-medium">
                {recipe.fill}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase font-bold mb-1">
                  <Zap className="w-3 h-3" /> RAM
                </div>
                <div className="font-semibold text-foreground">{recipe.ram || "N/A"}</div>
              </div>
              <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase font-bold mb-1">
                  <Cpu className="w-3 h-3" /> CPU
                </div>
                <div className="font-semibold text-foreground">{recipe.cpu || "N/A"}</div>
              </div>
              <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase font-bold mb-1">
                  <HardDrive className="w-3 h-3" /> Disk
                </div>
                <div className="font-semibold text-foreground">{recipe.disk || "N/A"}</div>
              </div>
              <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase font-bold mb-1">
                  <CreditCard className="w-3 h-3" /> Price
                </div>
                <div className="font-semibold text-primary">{recipe.price || "N/A"}</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {(recipe.discordName || recipe.discordId) && (
              <div>
                <h3 className="text-sm uppercase tracking-wider text-muted-foreground font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Client Information
                </h3>
                <div className="bg-muted/30 rounded-xl p-4 border border-border space-y-2">
                  {recipe.discordName && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Discord:</span>
                      <span className="text-sm font-medium text-foreground">{recipe.discordName}</span>
                    </div>
                  )}
                  {recipe.discordId && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">ID:</span>
                      <span className="text-sm font-mono text-foreground">{recipe.discordId}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm uppercase tracking-wider text-muted-foreground font-semibold mb-3">
                Additional Notes
              </h3>
              <div className="prose dark:prose-invert max-w-none text-muted-foreground bg-muted/20 p-4 rounded-xl border border-border/50">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{recipe.info}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-muted/50 p-4 border-t border-border text-center text-[10px] text-muted-foreground">
        Generated by Alon Hosting PH • {recipe.publicId}
      </div>
    </motion.div>
  );
}

import { Link } from "wouter";
import { Cloud, Menu, X, Github } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Cloud className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-xl leading-none tracking-tight text-slate-900">
                    Alon Hosting PH
                  </h1>
                  <p className="text-xs text-slate-500 font-medium tracking-wide">RECIPE GENERATOR</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              Generator
            </Link>
            <Link href="/history" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              History
            </Link>
            <div className="h-4 w-px bg-slate-200"></div>
            <Button variant="ghost" size="sm" className="gap-2" onClick={() => window.open('https://github.com', '_blank')}>
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white p-4 space-y-2 absolute w-full shadow-lg">
            <Link href="/" className="block px-4 py-2 text-sm font-medium hover:bg-slate-50 rounded-md text-slate-700">
              Generator
            </Link>
            <Link href="/history" className="block px-4 py-2 text-sm font-medium hover:bg-slate-50 rounded-md text-slate-700">
              History
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {children}
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Alon Hosting PH. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

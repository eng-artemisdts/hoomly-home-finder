"use client";

import { useState } from "react";
import { MessageSquare, X, Sparkles } from "lucide-react";
import AISearchChat from "./AISearchChat";

const AISearchModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all group"
      >
        <Sparkles className="h-5 w-5" />
        <span className="font-medium">Busca AI</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-fade-in">
          <div
            className="absolute inset-0"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-2xl h-[600px] animate-fade-in">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-2 -right-2 z-10 p-2 rounded-full bg-card border border-border/50 shadow-md hover:bg-secondary transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>

            <AISearchChat />
          </div>
        </div>
      )}
    </>
  );
};

export default AISearchModal;

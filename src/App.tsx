import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Snowfall from "./components/Snowfall";
import BackgroundPhotoPlaceholders from "./components/BackgroundPhotoPlaceholders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Snowfall />
      {/* Wrap content to allow full-height overlays that follow page height */}
      <div className="relative min-h-screen overflow-x-hidden">
        <BackgroundPhotoPlaceholders />
        {/* Stronger scrim for higher contrast that spans the entire page height */}
        <div className="pointer-events-none absolute inset-0 z-[5] bg-black/55 h-full" aria-hidden />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

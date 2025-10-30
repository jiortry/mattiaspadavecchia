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
      <BackgroundPhotoPlaceholders />
      {/* Stronger scrim for higher contrast between background images and text */}
      <div className="pointer-events-none fixed inset-0 z-[5] bg-black/55" aria-hidden />
      {/* Bottom fade to blend background images smoothly with page background during long scrolls */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[6] h-[32vh]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(8,8,8,0.75) 60%, rgba(0,0,0,0.98) 100%)",
        }}
        aria-hidden
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

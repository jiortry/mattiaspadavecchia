import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Snowfall from "./components/Snowfall";
import BackgroundPhotoPlaceholders from "./components/BackgroundPhotoPlaceholders";
import MobileScrim from "./components/MobileScrim";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Snowfall />
      <BackgroundPhotoPlaceholders />
      {/* Scrim: mobile full-page absolute, desktop/tablet fixed */}
      <MobileScrim />
      <div className="pointer-events-none hidden md:block fixed inset-0 z-[5] bg-black/55" aria-hidden />
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

import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SobreNos from "./pages/SobreNos";
import NotFound from "./pages/NotFound";
import swManager from '@/utils/swRegistration';
import performanceMonitor from '@/utils/performanceMonitor';
import { preloadCriticalImages } from '@/utils/performance';

const queryClient = new QueryClient();

const App = () => {
  // Initialize performance systems
  useEffect(() => {
    // Start performance monitoring
    performanceMonitor.startTransaction('app_initialization')();
    
    // Register service worker
    swManager.register({
      enableBackgroundSync: true,
      onReady: () => console.log('✅ Service Worker ready'),
      onUpdate: () => console.log('🔄 App update available')
    });
    
    // Preload critical images
    preloadCriticalImages().catch(console.warn);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sobre-nos" element={<SobreNos />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

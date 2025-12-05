import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { Skeleton } from "@/components/ui/skeleton";
import LazySection from "@/components/LazySection";

// Lazy load components below the fold
const VehicleConsultationSection = lazy(() => import("@/components/VehicleConsultationSection"));
const VehicleInfoSection = lazy(() => import("@/components/VehicleInfoSection"));
const VideoExplainerSection = lazy(() => import("@/components/VideoExplainerSection"));
const SocialProofSection = lazy(() => import("@/components/SocialProofSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const Footer = lazy(() => import("@/components/Footer"));

// Fallback component for lazy loading
const SectionFallback = () => (
  <div className="w-full py-20">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <Skeleton className="h-12 w-96 mx-auto mb-4" />
        <Skeleton className="h-6 w-2/3 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <LazySection fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <VehicleConsultationSection />
          </Suspense>
        </LazySection>
        <LazySection fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <VehicleInfoSection />
          </Suspense>
        </LazySection>
        <LazySection fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <VideoExplainerSection />
          </Suspense>
        </LazySection>
        <LazySection fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <SocialProofSection />
          </Suspense>
        </LazySection>
        <LazySection fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <FAQSection />
          </Suspense>
        </LazySection>
      </main>
      <LazySection fallback={<SectionFallback />}>
        <Suspense fallback={<SectionFallback />}>
          <Footer />
        </Suspense>
      </LazySection>
    </div>
  );
};

export default Index;

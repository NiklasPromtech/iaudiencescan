import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CaseStudies from "./pages/CaseStudies";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogPostTutorials from "./pages/BlogPostTutorials";
import BlogPostAddressableAudiences from "./pages/BlogPostAddressableAudiences";
import BlogPostGuarantee from "./pages/BlogPostGuarantee";
import BlogPostROI from "./pages/BlogPostROI";
import BlogPostAudienceScanAds from "./pages/BlogPostAudienceScanAds";
import BlogPostTracking from "./pages/BlogPostTracking";
import BlogPostAgencyDifferentiation from "./pages/BlogPostAgencyDifferentiation";
import BlogPostWhatAmILookingAt from "./pages/BlogPostWhatAmILookingAt";
import ProposedFeatures from "./pages/ProposedFeatures";
import NotFound from "./pages/NotFound";
import Sitemap from "./pages/Sitemap";
import DMAssistant from "./pages/DMAssistant";
import ManagedService from "./pages/ManagedService";
import CreateScan from "./pages/CreateScan";
import SalesPitch from "./pages/SalesPitch";
import SDTerms from "./pages/SDTerms";
import Sample1 from "./pages/Sample1";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/personal-letter" element={<BlogPost />} />
          <Route path="/blog/tutorials" element={<BlogPostTutorials />} />
          <Route path="/blog/addressable-audiences" element={<BlogPostAddressableAudiences />} />
          <Route path="/blog/guaranteed-results" element={<BlogPostGuarantee />} />
          <Route path="/blog/roi" element={<BlogPostROI />} />
          <Route path="/blog/audiencescan-ads" element={<BlogPostAudienceScanAds />} />
          <Route path="/blog/tracking" element={<BlogPostTracking />} />
          <Route path="/blog/agency-differentiation" element={<BlogPostAgencyDifferentiation />} />
          <Route path="/blog/what-am-i-looking-at" element={<BlogPostWhatAmILookingAt />} />
          <Route path="/proposed-features" element={<ProposedFeatures />} />
          <Route path="/sitemap.xml" element={<Sitemap />} />
          <Route path="/dm-assistant" element={<DMAssistant />} />
          <Route path="/managed-service" element={<ManagedService />} />
          <Route path="/create-scan" element={<CreateScan />} />
          <Route path="/sales-pitch" element={<SalesPitch />} />
          <Route path="/sdterms" element={<SDTerms />} />
          <Route path="/sample1" element={<Sample1 />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Sample1 from "./pages/Sample1";
import Sitemap from "./pages/Sitemap";
import CaseStudies from "./pages/CaseStudies";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogPostTracking from "./pages/BlogPostTracking";
import BlogPostROI from "./pages/BlogPostROI";
import BlogPostGuarantee from "./pages/BlogPostGuarantee";
import BlogPostTutorials from "./pages/BlogPostTutorials";
import BlogPostWhatAmILookingAt from "./pages/BlogPostWhatAmILookingAt";
import BlogPostAddressableAudiences from "./pages/BlogPostAddressableAudiences";
import BlogPostAgencyDifferentiation from "./pages/BlogPostAgencyDifferentiation";
import BlogPostFoundersLetter from "./pages/BlogPostFoundersLetter";
import BlogPostAudienceScanAds from "./pages/BlogPostAudienceScanAds";
import Video from "./pages/Video";
import Video1 from "./pages/Video1";
import VideoWhite from "./pages/VideoWhite";
import SalesPitch from "./pages/SalesPitch";
import Pricing from "./pages/Pricing";
import ManagedService from "./pages/ManagedService";
import SDTerms from "./pages/SDTerms";
import StrategyPlaybook from "./pages/StrategyPlaybook";
import DMAssistant from "./pages/DMAssistant";
import CreateScan from "./pages/CreateScan";
import ProposedFeatures from "./pages/ProposedFeatures";
import Creation from "./pages/Creation";
import Artifact from "./pages/Artifact";
import Network from "./pages/Network";
import NetworkAgency from "./pages/NetworkAgency";
import Wizard from "./pages/Wizard";
import WizardMobile from "./pages/WizardMobile";
import WizardV2 from "./pages/WizardV2";
import NoNiche from "./pages/NoNiche";

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
          <Route path="/strategy-playbook" element={<StrategyPlaybook />} />
          <Route path="/video" element={<Video />} />
          <Route path="/video1" element={<Video1 />} />
          <Route path="/video/white" element={<VideoWhite />} />
          <Route path="/creation" element={<Creation />} />
          <Route path="/artifact/:studyId" element={<Artifact />} />
          <Route path="/network/:studyId" element={<Network />} />
          <Route path="/network/agency/:studyId" element={<NetworkAgency />} />
          <Route path="/wizard" element={<Wizard />} />
          <Route path="/wizard/mobile" element={<WizardMobile />} />
          <Route path="/wizard/v2" element={<WizardV2 />} />
          <Route path="/no-niche" element={<NoNiche />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

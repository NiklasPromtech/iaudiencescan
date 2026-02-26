import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./components/auth/RequireAuth";
import NotFound from "./pages/NotFound";
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
import Auth from "./pages/Auth";
import Install from "./pages/Install";
import Overview from "./pages/Overview";
import Events from "./pages/Events";
import Audiences from "./pages/Audiences";
import Costs from "./pages/Costs";
import Settings from "./pages/Settings";
import ApiKeys from "./pages/ApiKeys";
import Bots from "./pages/Bots";
import Scans from "./pages/Scans";
import ScanDetail from "./pages/ScanDetail";
import ScanResults from "./pages/ScanResults";
import Wallets from "./pages/Wallets";
import Contracts from "./pages/Contracts";
import Touchpoints from "./pages/Touchpoints";
import Change from "./pages/Change";
import Tools from "./pages/Tools";
import Queries from "./pages/Queries";
import QueryEditor from "./pages/QueryEditor";
import LandingPageV3 from "./pages/LandingPageV3";
import HowItWorksPage from "./pages/HowItWorksPage";
import ResourcesPage from "./pages/ResourcesPage";
import FAQPage from "./pages/FAQPage";
import { SelectedWebsiteProvider } from "./hooks/use-selected-website";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: 'always',
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SelectedWebsiteProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPageV3 />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/faq" element={<FAQPage />} />
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
          <Route path="/sitemap.xml" element={<Sitemap />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/install" element={<RequireAuth><Install /></RequireAuth>} />
          <Route path="/overview" element={<RequireAuth><Overview /></RequireAuth>} />
          <Route path="/change" element={<RequireAuth><Change /></RequireAuth>} />
          <Route path="/events" element={<RequireAuth><Events /></RequireAuth>} />
          <Route path="/audiences" element={<RequireAuth><Audiences /></RequireAuth>} />
          <Route path="/wallets" element={<RequireAuth><Wallets /></RequireAuth>} />
          <Route path="/scans" element={<RequireAuth><Scans /></RequireAuth>} />
          <Route path="/scans/:scanId" element={<RequireAuth><ScanDetail /></RequireAuth>} />
          <Route path="/scans/:scanId/results" element={<RequireAuth><ScanResults /></RequireAuth>} />
          <Route path="/costs" element={<RequireAuth><Costs /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
          <Route path="/settings/api-keys" element={<RequireAuth><ApiKeys /></RequireAuth>} />
          <Route path="/bots" element={<RequireAuth><Bots /></RequireAuth>} />
          <Route path="/touchpoints" element={<RequireAuth><Touchpoints /></RequireAuth>} />
          <Route path="/contracts" element={<RequireAuth><Contracts /></RequireAuth>} />
          <Route path="/tools" element={<RequireAuth><Tools /></RequireAuth>} />
          <Route path="/queries" element={<RequireAuth><Queries /></RequireAuth>} />
          <Route path="/queries/:id" element={<RequireAuth><QueryEditor /></RequireAuth>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </SelectedWebsiteProvider>
  </QueryClientProvider>
);

export default App;

import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./components/auth/RequireAuth";
import { SelectedWebsiteProvider } from "./hooks/use-selected-website";
import { Loader2 } from "lucide-react";

// Lazy-loaded pages
const LandingPageV3 = lazy(() => import("./pages/LandingPageV3"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogPostTracking = lazy(() => import("./pages/BlogPostTracking"));
const BlogPostROI = lazy(() => import("./pages/BlogPostROI"));
const BlogPostGuarantee = lazy(() => import("./pages/BlogPostGuarantee"));
const BlogPostTutorials = lazy(() => import("./pages/BlogPostTutorials"));
const BlogPostWhatAmILookingAt = lazy(() => import("./pages/BlogPostWhatAmILookingAt"));
const BlogPostAddressableAudiences = lazy(() => import("./pages/BlogPostAddressableAudiences"));
const BlogPostAgencyDifferentiation = lazy(() => import("./pages/BlogPostAgencyDifferentiation"));
const BlogPostFoundersLetter = lazy(() => import("./pages/BlogPostFoundersLetter"));
const BlogPostAudienceScanAds = lazy(() => import("./pages/BlogPostAudienceScanAds"));
const Auth = lazy(() => import("./pages/Auth"));
const Install = lazy(() => import("./pages/Install"));
const Overview = lazy(() => import("./pages/Overview"));
const Events = lazy(() => import("./pages/Events"));
const Audiences = lazy(() => import("./pages/Audiences"));
const Costs = lazy(() => import("./pages/Costs"));
const Settings = lazy(() => import("./pages/Settings"));
const ApiKeys = lazy(() => import("./pages/ApiKeys"));
const Bots = lazy(() => import("./pages/Bots"));
const Scans = lazy(() => import("./pages/Scans"));
const ScanDetail = lazy(() => import("./pages/ScanDetail"));
const ScanResults = lazy(() => import("./pages/ScanResults"));
const Wallets = lazy(() => import("./pages/Wallets"));
const Contracts = lazy(() => import("./pages/Contracts"));
const Touchpoints = lazy(() => import("./pages/Touchpoints"));
const Change = lazy(() => import("./pages/Change"));
const Tools = lazy(() => import("./pages/Tools"));
const Queries = lazy(() => import("./pages/Queries"));
const QueryEditor = lazy(() => import("./pages/QueryEditor"));
const QueryDashboard = lazy(() => import("./pages/QueryDashboard"));
const DataExplorer = lazy(() => import("./pages/DataExplorer"));
const SDTerms = lazy(() => import("./pages/SDTerms"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
  </div>
);

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
        <Suspense fallback={<PageLoader />}>
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
            <Route path="/blog/founders-letter" element={<BlogPostFoundersLetter />} />
            <Route path="/sd-terms" element={<SDTerms />} />
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
            <Route path="/query-dashboard" element={<RequireAuth><QueryDashboard /></RequireAuth>} />
            <Route path="/data-explorer" element={<RequireAuth><DataExplorer /></RequireAuth>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
    </SelectedWebsiteProvider>
  </QueryClientProvider>
);

export default App;

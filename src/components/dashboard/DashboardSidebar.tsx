import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  Users,
  DollarSign,
  Search,
  Megaphone,
  Settings,
  ChevronDown,
  FileCode2,
  TrendingUp,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import audiencescanIcon from "@/assets/audiencescan-icon.png";
import audiencescanLogo from "@/assets/audiencescan-logo-dark.png";

// Client logos
import logoBitmex from "@/assets/client-logos/bitmex.png";
import logoFlare from "@/assets/client-logos/flare.png";
import logoLuxy from "@/assets/client-logos/luxy.png";
import logoMantra from "@/assets/client-logos/mantra.png";
import logoMintlayer from "@/assets/client-logos/mintlayer.png";
import logoOkx from "@/assets/client-logos/okx.png";
import logoSoma from "@/assets/client-logos/soma.png";
import logoSynesis from "@/assets/client-logos/synesis.png";
import logoSyscoin from "@/assets/client-logos/syscoin.png";
import logoVent from "@/assets/client-logos/vent.png";

const clientLogos = [
  logoBitmex, logoFlare, logoLuxy, logoMantra, logoMintlayer,
  logoOkx, logoSoma, logoSynesis, logoSyscoin, logoVent,
];


const insightsItems = [
  {
    title: "Overview",
    url: "/overview",
    icon: LayoutDashboard,
  },
  {
    title: "Change",
    url: "/change",
    icon: TrendingUp,
  },
  {
    title: "Wallet Data",
    url: "/wallets",
    icon: Wallet,
  },
];

const enrichmentItems = [
  {
    title: "Cost Sources",
    url: "/costs",
    icon: DollarSign,
  },
  {
    title: "Wallet Groups",
    url: "/audiences",
    icon: Users,
  },
  {
    title: "Touchpoints",
    url: "/touchpoints",
    icon: Megaphone,
  },
  {
    title: "Token Contracts",
    url: "/contracts",
    icon: FileCode2,
  },
];

const strategyItems = [
  {
    title: "Scans",
    url: "/scans",
    icon: Search,
  },
];

const settingsItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

interface NavItemProps {
  item: {
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  collapsed: boolean;
}

const NavItem = ({ item, collapsed }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === item.url;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link
          to={item.url}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50",
            isActive && "bg-primary/10 text-primary font-medium",
            collapsed && "justify-center px-0"
          )}
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {!collapsed && <span>{item.title}</span>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

interface NavGroupProps {
  label: string;
  items: {
    title: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  collapsed: boolean;
  defaultOpen?: boolean;
}

const NavGroup = ({ label, items, collapsed, defaultOpen = true }: NavGroupProps) => {
  const location = useLocation();
  const hasActiveChild = items.some((item) => location.pathname === item.url);

  if (collapsed) {
    // In collapsed mode, just show icons without group labels
    return (
      <SidebarGroup className="px-1">
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <NavItem key={item.url} item={item} collapsed={collapsed} />
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <Collapsible defaultOpen={defaultOpen || hasActiveChild} className="group/collapsible">
      <SidebarGroup>
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="cursor-pointer hover:bg-muted/30 rounded-md px-2 py-1 flex items-center justify-between text-xs text-muted-foreground uppercase tracking-wider">
            {label}
            <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <NavItem key={item.url} item={item} collapsed={collapsed} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
};

export const DashboardSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
      <SidebarHeader className={cn("p-4", collapsed && "p-2 flex items-center justify-center")}>
        <Link to="/overview" className="flex items-center gap-2">
          {collapsed ? (
            <img
              src={audiencescanIcon}
              alt="AudienceScan"
              className="h-6 w-auto"
            />
          ) : (
            <img
              src={audiencescanLogo}
              alt="AudienceScan"
              className="h-6 w-auto"
            />
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className={cn("px-2", collapsed && "px-1")}>
        
        <NavGroup label="Insights" items={insightsItems} collapsed={collapsed} />
        <NavGroup label="Enrichment" items={enrichmentItems} collapsed={collapsed} />
        <NavGroup label="Strategy" items={strategyItems} collapsed={collapsed} />
      </SidebarContent>

      <SidebarFooter className={cn("px-2 pb-4", collapsed && "px-1")}>
        <SidebarGroup className={cn(collapsed && "px-1")}>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <NavItem key={item.url} item={item} collapsed={collapsed} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Trusted By logos */}
        {!collapsed && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 px-2">Trusted by</p>
            <div className="grid grid-cols-5 gap-2 px-2">
              {clientLogos.map((logo, i) => (
                <img
                  key={i}
                  src={logo}
                  alt="Client"
                  className="h-5 w-auto object-contain opacity-40 hover:opacity-70 transition-opacity grayscale"
                />
              ))}
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

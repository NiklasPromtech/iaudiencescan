import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Zap,
  Globe,
  Wallet,
  Users,
  DollarSign,
  Search,
  Settings,
  ChevronDown,
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

// Navigation structure organized by user journey
const trackingItems = [
  {
    title: "Websites",
    url: "/install",
    icon: Globe,
  },
  {
    title: "Event Manager",
    url: "/events",
    icon: Zap,
  },
];

const insightsItems = [
  {
    title: "Overview",
    url: "/overview",
    icon: LayoutDashboard,
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
          {/* Logo with dark text for visibility on light background */}
          <div className={cn(
            "font-bold text-foreground transition-all",
            collapsed ? "text-lg" : "text-xl"
          )}>
            {collapsed ? "AS" : "AudienceScan"}
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className={cn("px-2", collapsed && "px-1")}>
        <NavGroup label="Tracking" items={trackingItems} collapsed={collapsed} />
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
      </SidebarFooter>
    </Sidebar>
  );
};

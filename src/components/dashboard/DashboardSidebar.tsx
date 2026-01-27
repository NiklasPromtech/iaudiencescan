import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Zap,
  Users,
  DollarSign,
  Settings,
  ChevronDown,
  Wallet,
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
import audiencescanLogo from "@/assets/audiencescan-logo-white.png";

const mainNavItems = [
  {
    title: "Overview",
    url: "/overview",
    icon: LayoutDashboard,
  },
];

const trackingItems = [
  {
    title: "Event Manager",
    url: "/events",
    icon: Zap,
  },
];

const audienceItems = [
  {
    title: "Wallet Data",
    url: "/wallets",
    icon: Wallet,
  },
  {
    title: "Audiences",
    url: "/audiences",
    icon: Users,
  },
];

const attributionItems = [
  {
    title: "Cost Sources",
    url: "/costs",
    icon: DollarSign,
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
            isActive && "bg-primary/10 text-primary font-medium"
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
      <SidebarGroup>
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
      <SidebarHeader className="p-4">
        <Link to="/overview" className="flex items-center gap-2">
          <img
            src={audiencescanLogo}
            alt="AudienceScan"
            className={cn("h-6 transition-all", collapsed && "h-5")}
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Main nav - no group label */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <NavItem key={item.url} item={item} collapsed={collapsed} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <NavGroup label="Tracking" items={trackingItems} collapsed={collapsed} />
        <NavGroup label="Audiences" items={audienceItems} collapsed={collapsed} />
        <NavGroup label="Attribution" items={attributionItems} collapsed={collapsed} />
      </SidebarContent>

      <SidebarFooter className="px-2 pb-4">
        <SidebarGroup>
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

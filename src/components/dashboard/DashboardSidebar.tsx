import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  Users,
  DollarSign,
  Search,
  Megaphone,
  Wrench,
  Settings,
  ChevronDown,
  FileCode2,
  TrendingUp,
  LogOut,
  Terminal,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
import audiencescanIcon from "@/assets/audiencescan-icon-large.png";
import audiencescanLogo from "@/assets/audiencescan-logo-wide.png";




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
  {
    title: "Queries",
    url: "/queries",
    icon: Terminal,
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

const toolsItems = [
  {
    title: "UTM Generator",
    url: "/tools",
    icon: Wrench,
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
          {!collapsed && <span className="font-mono text-xs uppercase tracking-wider">{item.title}</span>}
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
          <SidebarGroupLabel className="cursor-pointer hover:bg-muted/30 rounded-md px-2 py-1 flex items-center justify-between font-mono text-xs text-muted-foreground uppercase tracking-wider">
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
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setUserEmail(user.email);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("selectedWebsiteId");
    localStorage.removeItem("selectedWebsite");
    navigate("/auth");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
      <SidebarHeader className={cn("p-4", collapsed && "p-2 flex items-center justify-center")}>
        <Link to="/overview" className="flex items-center gap-2">
          <img
            src={audiencescanIcon}
            alt="AudienceScan"
            className="h-6 w-6 rounded-md shrink-0"
          />
          {!collapsed && (
            <span className="font-semibold text-foreground text-sm tracking-tight">AudienceScan</span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className={cn("px-2", collapsed && "px-1")}>
        
        <NavGroup label="Insights" items={insightsItems} collapsed={collapsed} />
        <NavGroup label="Enrichment" items={enrichmentItems} collapsed={collapsed} />
        <NavGroup label="Strategy" items={strategyItems} collapsed={collapsed} />
        <NavGroup label="Tools" items={toolsItems} collapsed={collapsed} />
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

        {/* User + Sign out */}
        <div className={cn("border-t border-border pt-3 mt-2", collapsed && "flex flex-col items-center")}>
          {!collapsed && userEmail && (
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground truncate px-3 mb-2">
              {userEmail}
            </p>
          )}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button
                  onClick={handleSignOut}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10 w-full",
                    collapsed && "justify-center px-0"
                  )}
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="font-mono text-xs uppercase tracking-wider">Sign out</span>}
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

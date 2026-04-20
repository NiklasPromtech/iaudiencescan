import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Globe, Settings } from "lucide-react";
import { listWebsites, Website } from "@/lib/api";
import { useSelectedWebsite, SelectedWebsite } from "@/hooks/use-selected-website";

export function WebsiteSelector() {
  const navigate = useNavigate();
  const { selectedWebsite, selectWebsite } = useSelectedWebsite();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const response = await listWebsites();
        setWebsites(response.websites || []);
      } catch (error) {
        console.error("Failed to fetch websites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsites();
  }, []);

  const handleSelect = (website: Website) => {
    const selected: SelectedWebsite = {
      id: website.id,
      name: website.name,
      base_url: website.base_url,
      tag_id: website.tag_id,
      status: website.status,
    };
    selectWebsite(selected);
    // Stay on the current route after switching websites; only redirect from root.
    const path = window.location.pathname;
    if (path === "/" || path === "") {
      navigate("/overview");
    }
  };

  if (!selectedWebsite) {
    return (
      <Button variant="ghost" size="sm" onClick={() => navigate("/install")}>
        <Globe className="h-4 w-4 mr-2" />
        Select Website
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="max-w-[150px] truncate">{selectedWebsite.name}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {loading ? (
          <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
        ) : (
          <>
            {websites.map((website) => (
              <DropdownMenuItem
                key={website.id}
                onClick={() => handleSelect(website)}
                className="flex items-center justify-between"
              >
                <span className="truncate">{website.name}</span>
                {website.id === selectedWebsite.id && (
                  <Badge variant="secondary" className="text-xs ml-2">
                    Active
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/install")}>
              <Settings className="h-4 w-4 mr-2" />
              Manage Websites
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { listWebsites } from "@/lib/api";

export interface SelectedWebsite {
  id: string;
  name: string;
  base_url: string;
  tag_id: string;
  status: string;
}

interface SelectedWebsiteContextValue {
  selectedWebsite: SelectedWebsite | null;
  selectWebsite: (website: SelectedWebsite) => Promise<void>;
  loading: boolean;
}

const SelectedWebsiteContext = createContext<SelectedWebsiteContextValue | null>(null);

export function SelectedWebsiteProvider({ children }: { children: ReactNode }) {
  const [selectedWebsite, setSelectedWebsite] = useState<SelectedWebsite | null>(null);
  const [loading, setLoading] = useState(true);

  const applySelection = useCallback((website: SelectedWebsite) => {
    localStorage.setItem("selectedWebsite", JSON.stringify(website));
    localStorage.setItem("selectedWebsiteId", website.id);
    setSelectedWebsite(website);
  }, []);

  useEffect(() => {
    const loadSelectedWebsite = async () => {
      try {
        const stored = localStorage.getItem("selectedWebsite");
        if (stored) {
          setSelectedWebsite(JSON.parse(stored));
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("last_selected_website_id")
          .eq("user_id", user.id)
          .maybeSingle();

        const storedId = stored ? JSON.parse(stored).id : null;
        const needsFetch = !stored || (profile?.last_selected_website_id && storedId !== profile.last_selected_website_id);

        if (needsFetch) {
          try {
            const { websites } = await listWebsites();
            if (websites && websites.length > 0) {
              const targetId = profile?.last_selected_website_id;
              const match = targetId ? websites.find(w => w.id === targetId) : null;
              const pick = match || websites[0];
              applySelection({
                id: pick.id,
                name: pick.name,
                base_url: pick.base_url,
                tag_id: pick.tag_id,
                status: pick.status,
              });
            }
          } catch (err) {
            console.error("Failed to fetch websites for auto-select:", err);
          }
        }
      } catch (error) {
        console.error("Failed to load selected website:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSelectedWebsite();
  }, [applySelection]);

  const selectWebsite = useCallback(async (website: SelectedWebsite) => {
    localStorage.setItem("selectedWebsite", JSON.stringify(website));
    localStorage.setItem("selectedWebsiteId", website.id);
    setSelectedWebsite(website);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ last_selected_website_id: website.id })
          .eq("user_id", user.id);
      }
    } catch (error) {
      console.error("Failed to persist website selection:", error);
    }
  }, []);

  return (
    <SelectedWebsiteContext.Provider value={{ selectedWebsite, selectWebsite, loading }}>
      {children}
    </SelectedWebsiteContext.Provider>
  );
}

export function useSelectedWebsite() {
  const context = useContext(SelectedWebsiteContext);
  if (!context) {
    throw new Error("useSelectedWebsite must be used within a SelectedWebsiteProvider");
  }
  return context;
}

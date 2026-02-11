import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

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

        if (profile?.last_selected_website_id) {
          const storedId = stored ? JSON.parse(stored).id : null;
          if (storedId !== profile.last_selected_website_id) {
            // The Install/Websites pages will handle the full sync
          }
        }
      } catch (error) {
        console.error("Failed to load selected website:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSelectedWebsite();
  }, []);

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

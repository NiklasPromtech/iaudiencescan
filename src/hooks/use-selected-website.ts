import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Website } from "@/lib/api";

export interface SelectedWebsite {
  id: string;
  name: string;
  base_url: string;
  tag_id: string;
  status: string;
}

export function useSelectedWebsite() {
  const [selectedWebsite, setSelectedWebsite] = useState<SelectedWebsite | null>(null);
  const [loading, setLoading] = useState(true);

  // Load selected website on mount
  useEffect(() => {
    const loadSelectedWebsite = async () => {
      try {
        // First check localStorage for immediate display
        const stored = localStorage.getItem("selectedWebsite");
        if (stored) {
          setSelectedWebsite(JSON.parse(stored));
        }

        // Then check the database for persisted preference
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
          // If we have a saved preference, fetch that website's details
          const storedId = stored ? JSON.parse(stored).id : null;
          
          // Only update if different from localStorage
          if (storedId !== profile.last_selected_website_id) {
            // We need to fetch the website details - for now use what's in storage
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

  // Save selection to both localStorage and database
  const selectWebsite = useCallback(async (website: SelectedWebsite) => {
    // Update localStorage immediately for fast UI
    localStorage.setItem("selectedWebsite", JSON.stringify(website));
    localStorage.setItem("selectedWebsiteId", website.id);
    setSelectedWebsite(website);

    // Persist to database
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

  return {
    selectedWebsite,
    selectWebsite,
    loading,
  };
}

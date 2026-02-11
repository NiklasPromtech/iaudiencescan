import { useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const NoWebsiteState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <Card className="max-w-md w-full p-12 text-center border border-dashed border-border">
        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
          <Globe className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Add your first website
        </h2>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Connect a website to start tracking visitors, wallet activity, and conversions — all in real time.
        </p>
        <Button onClick={() => navigate("/install")} className="w-full">
          Get Started
        </Button>
      </Card>
    </div>
  );
};

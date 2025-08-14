import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const DMAssistant = () => {
  const [delay, setDelay] = useState(30);
  const [status, setStatus] = useState("Loaded 5 rows from \"S7cDSwvcZS7bMInjy3Jc_xDM\".");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">AudienceScan DM Assistant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                value="162VUGJFmM2YYvC9XkzmTHFkTjAYcqDYZkVAcsFVSiZg"
                readOnly
                className="text-xs"
              />
              <Input
                value="S7cDSwvcZS7bMInjy3Jc_xDM"
                readOnly
                className="text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">Apps Script Web App URL</Label>
              <Input id="url" placeholder="Enter URL..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delay">Delay (sec):</Label>
              <Input
                id="delay"
                type="number"
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
                className="w-20"
              />
            </div>

            <div className="text-sm text-muted-foreground">
              <p>auto-send ON | Hotkeys: S start, P pause, N next, V toggle visibility</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">Load from Sheet</Button>
              <Button variant="default" size="sm">Start</Button>
              <Button variant="outline" size="sm">Next</Button>
              <Button variant="outline" size="sm">Pause</Button>
              <Button variant="outline" size="sm">Clear</Button>
              <Button variant="outline" size="sm">Toggle Panel</Button>
            </div>

            <div className="text-sm text-muted-foreground">
              {status}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DMAssistant;
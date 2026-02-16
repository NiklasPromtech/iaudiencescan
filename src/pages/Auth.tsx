import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, User, ArrowLeft, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import InspirationPanel from "@/components/auth/InspirationPanel";
import icon from "@/assets/audiencescan-icon-large.png";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const message = searchParams.get("message");
  const showSignInRequired = message === "signin_required";

  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "true") {
      setEmailVerified(true);
      toast({
        title: "Email verified!",
        description: "Your email has been verified. You can now sign in.",
      });

      // Google Ads conversion – Sign up
      if (typeof (window as any).gtag === "function") {
        (window as any).gtag("event", "conversion", {
          send_to: "AW-443807859/82g4CPGXgvYbEPPwz9MB",
          value: 1.0,
          currency: "GBP",
        });
      }

      // AudienceScan conversion – Sign up
      if (typeof (window as any).AudienceScan?.trackEvent === "function") {
        const userEmail = searchParams.get("email") || "";
        (window as any).AudienceScan.trackEvent("Sign up", userEmail);
      }
    }

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/install");
      }
      setCheckingSession(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/install");
      }
    });

    checkSession();
    return () => subscription.unsubscribe();
  }, [navigate, searchParams, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back!", description: "You have successfully signed in." });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth?verified=true`,
            data: { display_name: displayName },
          },
        });
        if (error) throw error;
        toast({ title: "Account created!", description: "Please check your email to verify your account." });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Left: Form */}
      <div className="flex flex-col min-h-screen bg-background">
        <div className="p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground rounded-none"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 lg:px-16">
          <div className="w-full max-w-sm space-y-8">
            <div className="flex items-center gap-2 justify-center mb-2">
              <img src={icon} alt="AudienceScan" className="h-6 w-6 rounded-md" />
              <span className="font-semibold text-foreground text-sm tracking-tight">
                AudienceScan
              </span>
            </div>

            <div className="text-center">
              <h1 className="font-mono text-h3 text-foreground">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="mt-2 text-p3 text-muted-foreground font-bai">
                {isLogin
                  ? "Sign in to your account to continue"
                  : "Sign up to get started with AudienceScan"}
              </p>
            </div>

            {showSignInRequired && !emailVerified && (
              <Alert className="border-muted bg-muted/50 rounded-none">
                <Lock className="h-4 w-4 text-foreground" />
                <AlertTitle className="text-foreground">Sign in required</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  Please sign in to access your dashboard.
                </AlertDescription>
              </Alert>
            )}

            {emailVerified && (
              <Alert className="border-primary bg-primary/10 rounded-none">
                <CheckCircle className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary">Email Verified!</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  Your email has been successfully verified. You can now sign in.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-foreground font-mono text-p4 uppercase tracking-widest">
                    Display Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Your name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="pl-10 rounded-none"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-mono text-p4 uppercase tracking-widest">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 rounded-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-mono text-p4 uppercase tracking-widest">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 rounded-none"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full rounded-none" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-p3 text-primary hover:underline font-bai"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Inspiration */}
      <InspirationPanel isLogin={isLogin} />
    </div>
  );
};

export default Auth;

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, Twitter, Calendar, DollarSign, Target, FileText, Loader2, CheckCircle2, AlertCircle, Heart, Repeat, MessageCircle } from "lucide-react";

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    screen_name: string;
  } | null;
  metrics: {
    retweets: number;
    likes: number;
    replies: number;
  };
}

interface Objective {
  id: string;
  name: string;
  product_type: string;
}

const OBJECTIVES: Objective[] = [
  { id: "FOLLOWERS", name: "Followers", product_type: "PROMOTED_ACCOUNT" },
  { id: "REACH", name: "Reach", product_type: "PROMOTED_TWEETS" },
  { id: "ENGAGEMENTS", name: "Engagements", product_type: "PROMOTED_TWEETS" },
  { id: "VIDEO_VIEWS", name: "Video Views", product_type: "PROMOTED_TWEETS" },
  { id: "WEBSITE_CLICKS", name: "Website Clicks", product_type: "PROMOTED_TWEETS" },
  { id: "APP_INSTALLS", name: "App Installs", product_type: "PROMOTED_TWEETS" },
  { id: "APP_ENGAGEMENTS", name: "App Engagements", product_type: "PROMOTED_TWEETS" },
];

const colors = {
  background: "#0a0a0f",
  cardBg: "#12121a",
  accentPrimary: "#6366f1",
  accentSecondary: "#8b5cf6",
  textPrimary: "#ffffff",
  textSecondary: "#94a3b8",
  border: "#1e1e2e",
  success: "#22c55e",
  error: "#ef4444",
  warning: "#f59e0b",
};

export default function XAdsAgency() {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get("uid") || "";
  const title = searchParams.get("title") || "Campaign";
  const account = searchParams.get("account") || "";

  // Tweet state
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [tweetsLoading, setTweetsLoading] = useState(true);
  const [tweetsError, setTweetsError] = useState<string | null>(null);

  // Selected tweets for campaign
  const [selectedTweetIds, setSelectedTweetIds] = useState<string[]>([]);

  // Campaign form state
  const [objective, setObjective] = useState<string>("FOLLOWERS");
  const [dailyBudget, setDailyBudget] = useState<number>(10);
  const [totalBudget, setTotalBudget] = useState<number | undefined>(undefined);
  const [bidAmount, setBidAmount] = useState<number>(0.5);
  const [startDate, setStartDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState<string>("");
  const [status, setStatus] = useState<"DRAFT" | "ACTIVE">("DRAFT");

  // Campaign creation state
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<any>(null);

  // Fetch tweets
  useEffect(() => {
    const fetchTweets = async () => {
      if (!account) {
        setTweetsError("No account ID provided");
        setTweetsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://token-analysis-final.nw.r.appspot.com/x/tweet/${account}`
        );
        const data = await response.json();

        if (!response.ok || data.error) {
          throw new Error(data.error || "Failed to fetch tweets");
        }

        setTweets(data.tweets || []);
      } catch (err) {
        setTweetsError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setTweetsLoading(false);
      }
    };

    fetchTweets();
  }, [account]);

  // Check if objective requires tweets
  const requiresTweets = objective !== "FOLLOWERS";

  // Toggle tweet selection
  const toggleTweetSelection = (tweetId: string) => {
    setSelectedTweetIds((prev) =>
      prev.includes(tweetId)
        ? prev.filter((id) => id !== tweetId)
        : [...prev, tweetId]
    );
  };

  // Create campaign
  const handleCreateCampaign = async () => {
    if (requiresTweets && selectedTweetIds.length === 0) {
      setCreateError("Please select at least one tweet for this objective");
      return;
    }

    setCreating(true);
    setCreateError(null);
    setCreateSuccess(null);

    try {
      const payload: any = {
        account_id: account,
        objective,
        daily_budget: dailyBudget,
        bid_amount: bidAmount,
        start_date: new Date(startDate).toISOString(),
        status,
      };

      if (totalBudget) {
        payload.total_budget = totalBudget;
      }

      if (endDate) {
        payload.end_date = new Date(endDate).toISOString();
      }

      if (requiresTweets) {
        payload.tweet_ids = selectedTweetIds;
      }

      const response = await fetch(
        "https://token-analysis-final.nw.r.appspot.com/x/create-adgroup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to create campaign");
      }

      setCreateSuccess(data);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setCreating(false);
    }
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-xl"
        style={{
          backgroundColor: `${colors.background}ee`,
          borderColor: colors.border,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" style={{ color: colors.textSecondary }} />
            </button>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${colors.accentPrimary}22` }}
              >
                <Twitter className="w-5 h-5" style={{ color: colors.accentPrimary }} />
              </div>
              <div>
                <h1
                  className="text-lg font-semibold"
                  style={{ color: colors.textPrimary }}
                >
                  {title || "X Ads Campaign"}
                </h1>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  Account: {account}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Tweets List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2
                className="text-xl font-semibold"
                style={{ color: colors.textPrimary }}
              >
                Available Tweets
              </h2>
              {selectedTweetIds.length > 0 && (
                <span
                  className="text-sm px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: `${colors.accentPrimary}22`,
                    color: colors.accentPrimary,
                  }}
                >
                  {selectedTweetIds.length} selected
                </span>
              )}
            </div>

            {tweetsLoading ? (
              <div
                className="rounded-xl p-12 text-center"
                style={{ backgroundColor: colors.cardBg }}
              >
                <Loader2
                  className="w-8 h-8 animate-spin mx-auto mb-3"
                  style={{ color: colors.accentPrimary }}
                />
                <p style={{ color: colors.textSecondary }}>Loading tweets...</p>
              </div>
            ) : tweetsError ? (
              <div
                className="rounded-xl p-8 text-center"
                style={{ backgroundColor: colors.cardBg }}
              >
                <AlertCircle
                  className="w-8 h-8 mx-auto mb-3"
                  style={{ color: colors.error }}
                />
                <p style={{ color: colors.error }}>{tweetsError}</p>
              </div>
            ) : tweets.length === 0 ? (
              <div
                className="rounded-xl p-8 text-center"
                style={{ backgroundColor: colors.cardBg }}
              >
                <Twitter
                  className="w-8 h-8 mx-auto mb-3"
                  style={{ color: colors.textSecondary }}
                />
                <p style={{ color: colors.textSecondary }}>No tweets found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tweets.map((tweet) => {
                  const isSelected = selectedTweetIds.includes(tweet.id);
                  return (
                    <div
                      key={tweet.id}
                      onClick={() => toggleTweetSelection(tweet.id)}
                      className="rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.01]"
                      style={{
                        backgroundColor: colors.cardBg,
                        border: `2px solid ${isSelected ? colors.accentPrimary : colors.border}`,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-1 transition-colors ${
                            isSelected ? "" : "border"
                          }`}
                          style={{
                            backgroundColor: isSelected
                              ? colors.accentPrimary
                              : "transparent",
                            borderColor: isSelected ? colors.accentPrimary : colors.border,
                          }}
                        >
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          {tweet.user && (
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className="font-medium"
                                style={{ color: colors.textPrimary }}
                              >
                                {tweet.user.name}
                              </span>
                              <span
                                className="text-sm"
                                style={{ color: colors.textSecondary }}
                              >
                                @{tweet.user.screen_name}
                              </span>
                            </div>
                          )}
                          <p
                            className="text-sm mb-3 whitespace-pre-wrap"
                            style={{ color: colors.textSecondary }}
                          >
                            {tweet.text}
                          </p>
                          <div className="flex items-center gap-6 text-xs">
                            <span
                              className="flex items-center gap-1"
                              style={{ color: colors.textSecondary }}
                            >
                              <Heart className="w-3.5 h-3.5" />
                              {tweet.metrics?.likes?.toLocaleString() || 0}
                            </span>
                            <span
                              className="flex items-center gap-1"
                              style={{ color: colors.textSecondary }}
                            >
                              <Repeat className="w-3.5 h-3.5" />
                              {tweet.metrics?.retweets?.toLocaleString() || 0}
                            </span>
                            <span
                              className="flex items-center gap-1"
                              style={{ color: colors.textSecondary }}
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              {tweet.metrics?.replies?.toLocaleString() || 0}
                            </span>
                            <span style={{ color: colors.textSecondary }}>
                              {formatDate(tweet.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Campaign Creation Panel */}
          <div className="lg:col-span-1">
            <div
              className="sticky top-24 rounded-xl p-6 space-y-6"
              style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}` }}
            >
              <div>
                <h2
                  className="text-xl font-semibold mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  Create Campaign
                </h2>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Configure and launch your X Ads campaign
                </p>
              </div>

              {/* Objective */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium flex items-center gap-2"
                  style={{ color: colors.textPrimary }}
                >
                  <Target className="w-4 h-4" style={{ color: colors.accentPrimary }} />
                  Objective
                </label>
                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                  }}
                >
                  {OBJECTIVES.map((obj) => (
                    <option key={obj.id} value={obj.id}>
                      {obj.name} ({obj.product_type})
                    </option>
                  ))}
                </select>
                {requiresTweets && (
                  <p className="text-xs" style={{ color: colors.warning }}>
                    ⚠️ This objective requires tweet selection
                  </p>
                )}
              </div>

              {/* Daily Budget */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium flex items-center gap-2"
                  style={{ color: colors.textPrimary }}
                >
                  <DollarSign className="w-4 h-4" style={{ color: colors.accentPrimary }} />
                  Daily Budget ($)
                </label>
                <input
                  type="number"
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(parseFloat(e.target.value) || 0)}
                  min={1}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              {/* Total Budget (Optional) */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium flex items-center gap-2"
                  style={{ color: colors.textPrimary }}
                >
                  <DollarSign className="w-4 h-4" style={{ color: colors.accentSecondary }} />
                  Total Budget ($)
                  <span className="text-xs" style={{ color: colors.textSecondary }}>
                    (optional)
                  </span>
                </label>
                <input
                  type="number"
                  value={totalBudget || ""}
                  onChange={(e) =>
                    setTotalBudget(e.target.value ? parseFloat(e.target.value) : undefined)
                  }
                  min={1}
                  placeholder="No limit"
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              {/* Bid Amount */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium flex items-center gap-2"
                  style={{ color: colors.textPrimary }}
                >
                  <DollarSign className="w-4 h-4" style={{ color: colors.accentPrimary }} />
                  Bid Amount ($)
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(parseFloat(e.target.value) || 0)}
                  min={0.01}
                  step={0.01}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium flex items-center gap-2"
                  style={{ color: colors.textPrimary }}
                >
                  <Calendar className="w-4 h-4" style={{ color: colors.accentPrimary }} />
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              {/* End Date (Optional) */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium flex items-center gap-2"
                  style={{ color: colors.textPrimary }}
                >
                  <Calendar className="w-4 h-4" style={{ color: colors.accentSecondary }} />
                  End Date
                  <span className="text-xs" style={{ color: colors.textSecondary }}>
                    (optional)
                  </span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary,
                  }}
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label
                  className="text-sm font-medium flex items-center gap-2"
                  style={{ color: colors.textPrimary }}
                >
                  <FileText className="w-4 h-4" style={{ color: colors.accentPrimary }} />
                  Status
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStatus("DRAFT")}
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor:
                        status === "DRAFT" ? colors.accentPrimary : colors.background,
                      border: `1px solid ${status === "DRAFT" ? colors.accentPrimary : colors.border}`,
                      color: status === "DRAFT" ? "#fff" : colors.textSecondary,
                    }}
                  >
                    Draft
                  </button>
                  <button
                    onClick={() => setStatus("ACTIVE")}
                    className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor:
                        status === "ACTIVE" ? colors.success : colors.background,
                      border: `1px solid ${status === "ACTIVE" ? colors.success : colors.border}`,
                      color: status === "ACTIVE" ? "#fff" : colors.textSecondary,
                    }}
                  >
                    Active
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {createError && (
                <div
                  className="p-3 rounded-lg text-sm"
                  style={{ backgroundColor: `${colors.error}22`, color: colors.error }}
                >
                  {createError}
                </div>
              )}

              {/* Success Message */}
              {createSuccess && (
                <div
                  className="p-3 rounded-lg text-sm"
                  style={{ backgroundColor: `${colors.success}22`, color: colors.success }}
                >
                  <p className="font-medium mb-1">Campaign created successfully!</p>
                  <p className="text-xs opacity-80">
                    Campaign ID: {createSuccess.campaign_id || createSuccess.id || "N/A"}
                  </p>
                </div>
              )}

              {/* Create Button */}
              <button
                onClick={handleCreateCampaign}
                disabled={creating || (requiresTweets && selectedTweetIds.length === 0)}
                className="w-full py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.accentSecondary})`,
                  color: "#fff",
                }}
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Twitter className="w-4 h-4" />
                    Create Campaign
                  </>
                )}
              </button>

              {requiresTweets && selectedTweetIds.length === 0 && !creating && (
                <p className="text-xs text-center" style={{ color: colors.textSecondary }}>
                  Select tweets from the left to enable campaign creation
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

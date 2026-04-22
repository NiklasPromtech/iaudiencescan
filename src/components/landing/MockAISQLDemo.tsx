import { useEffect, useRef, useState } from "react";
import { Sparkles, Play, Loader2 } from "lucide-react";

type Step = {
  prompt: string;
  sql: string;
  result: "chart" | "table";
};

const steps: Step[] = [
  {
    prompt: "Show me new users on the deposit page over the last 14 days",
    sql: `SELECT
  DATE(created_at) AS day,
  COUNT(DISTINCT visitor_id) AS new_users
FROM pageviews
WHERE path = '/deposit'
  AND DATE(created_at) >= CURRENT_DATE() - 14
GROUP BY day
ORDER BY day;`,
    result: "chart",
  },
  {
    prompt: "How many of those connected a wallet, and the median balance?",
    sql: `SELECT
  DATE(p.created_at) AS day,
  COUNT(DISTINCT w.wallet_address) AS wallets,
  APPROX_QUANTILES(w.usd_balance, 2)[OFFSET(1)] AS median_usd
FROM pageviews p
JOIN wallets w USING (visitor_id)
WHERE p.path = '/deposit'
  AND DATE(p.created_at) >= CURRENT_DATE() - 14
GROUP BY day
ORDER BY day;`,
    result: "table",
  },
];

const chartBars = [12, 18, 14, 22, 28, 19, 31, 24, 35, 29, 41, 38, 47, 42];
const tableRows = [
  ["Apr 14", "12", "$1,840"],
  ["Apr 15", "18", "$2,210"],
  ["Apr 16", "14", "$1,920"],
  ["Apr 17", "22", "$2,640"],
  ["Apr 18", "28", "$3,100"],
];

type Phase =
  | "typing"
  | "loading"
  | "sql"
  | "running"
  | "result"
  | "pause";

export const MockAISQLDemo = () => {
  const [stepIdx, setStepIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [typedChars, setTypedChars] = useState(0);
  const [history, setHistory] = useState<{ step: Step; phase: Phase }[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setActive(true);
      },
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!active || reduced) return;
    const current = steps[stepIdx];
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (typedChars < current.prompt.length) {
        timer = setTimeout(() => setTypedChars((c) => c + 1), 35);
      } else {
        timer = setTimeout(() => setPhase("loading"), 500);
      }
    } else if (phase === "loading") {
      timer = setTimeout(() => setPhase("sql"), 900);
    } else if (phase === "sql") {
      timer = setTimeout(() => setPhase("running"), 1400);
    } else if (phase === "running") {
      timer = setTimeout(() => setPhase("result"), 700);
    } else if (phase === "result") {
      timer = setTimeout(() => {
        if (stepIdx < steps.length - 1) {
          setHistory((h) => [...h, { step: current, phase: "result" }]);
          setStepIdx((i) => i + 1);
          setTypedChars(0);
          setPhase("typing");
        } else {
          setPhase("pause");
        }
      }, 2200);
    } else if (phase === "pause") {
      timer = setTimeout(() => {
        setHistory([]);
        setStepIdx(0);
        setTypedChars(0);
        setPhase("typing");
      }, 2500);
    }

    return () => clearTimeout(timer);
  }, [active, phase, typedChars, stepIdx, reduced]);

  const renderResult = (step: Step) => {
    if (step.result === "chart") {
      const max = Math.max(...chartBars);
      return (
        <div className="border border-border bg-card p-4 animate-fade-in">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
            new_users · last 14 days
          </p>
          <div className="flex items-end gap-1 h-20">
            {chartBars.map((v, i) => (
              <div
                key={i}
                className="flex-1 bg-primary"
                style={{ height: `${(v / max) * 100}%` }}
              />
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="border border-border bg-card overflow-hidden animate-fade-in">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["day", "wallets", "median_usd"].map((h) => (
                <th
                  key={h}
                  className="text-left px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((r, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                {r.map((c, j) => (
                  <td key={j} className="px-3 py-2 font-mono text-foreground tabular-nums">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderStep = (step: Step, currentPhase: Phase, isCurrent: boolean) => {
    const promptDisplay = isCurrent && currentPhase === "typing"
      ? step.prompt.slice(0, typedChars) + (typedChars < step.prompt.length ? "▍" : "")
      : step.prompt;

    const showSql = !isCurrent || ["sql", "running", "result"].includes(currentPhase);
    const showResult = !isCurrent || currentPhase === "result";
    const showLoading = isCurrent && currentPhase === "loading";

    return (
      <div className="space-y-3">
        {/* Prompt input */}
        <div className="border border-border bg-card flex items-center gap-2 px-3 py-2.5">
          <Sparkles className="w-4 h-4 text-primary shrink-0" />
          <span className="font-mono text-xs text-foreground flex-1 min-h-[1.25rem]">
            {promptDisplay || (
              <span className="text-muted-foreground">Enter prompt to generate SQL…</span>
            )}
          </span>
        </div>

        {showLoading && (
          <div className="flex items-center gap-2 px-3 text-muted-foreground animate-fade-in">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="font-mono text-[10px] uppercase tracking-widest">
              Generating SQL…
            </span>
          </div>
        )}

        {showSql && (
          <div className="border border-border bg-card overflow-hidden animate-fade-in">
            <div className="px-3 py-1.5 bg-foreground/[0.03] border-b border-border flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                generated.sql
              </span>
              <button
                className={`flex items-center gap-1 px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${
                  isCurrent && currentPhase === "running"
                    ? "bg-primary text-primary-foreground animate-pulse"
                    : "border border-border text-muted-foreground"
                }`}
              >
                <Play className="w-2.5 h-2.5" /> Run
              </button>
            </div>
            <pre className="p-3 text-[11px] font-mono text-foreground whitespace-pre overflow-x-auto leading-relaxed">
              {step.sql}
            </pre>
          </div>
        )}

        {showResult && renderResult(step)}
      </div>
    );
  };

  // Reduced motion: render all steps statically
  if (reduced) {
    return (
      <div ref={ref} className="border border-border bg-background p-4 md:p-6 space-y-6">
        {steps.map((s, i) => (
          <div key={i}>{renderStep(s, "result", false)}</div>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className="border border-border bg-background p-4 md:p-6 space-y-6">
      {history.map((h, i) => (
        <div key={`h-${i}`} className="opacity-70">
          {renderStep(h.step, "result", false)}
        </div>
      ))}
      {phase !== "pause" && renderStep(steps[stepIdx], phase, true)}
    </div>
  );
};

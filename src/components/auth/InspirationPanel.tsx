import NetworkAnimation from "./NetworkAnimation";

interface InspirationPanelProps {
  isLogin: boolean;
}

const InspirationPanel = ({ isLogin }: InspirationPanelProps) => (
  <div className="hidden lg:flex flex-col items-center justify-center bg-muted relative overflow-hidden p-12 gap-12">
    <NetworkAnimation />
    <div className="text-center max-w-md space-y-4 z-10">
      <h2 className="font-mono text-h3 text-foreground tracking-tight">
        {isLogin
          ? "Your data is waiting."
          : "Your on-chain audience, decoded."}
      </h2>
      <p className="font-bai text-p2 text-muted-foreground">
        {isLogin
          ? "Actionable insights from every wallet, every transaction, every community."
          : "From raw wallets to real communities — in minutes, not months."}
      </p>
    </div>
  </div>
);

export default InspirationPanel;

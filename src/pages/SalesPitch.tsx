import { Shield, Target, Zap, BarChart3, CheckCircle, TrendingUp } from "lucide-react";
const SalesPitch = () => {
  return <div className="min-h-screen bg-white print:bg-white">
      {/* Print-friendly single page sales pitch */}
      <div className="max-w-[8.5in] mx-auto p-12 print:p-8">
        
        {/* Header */}
        <div className="text-center mb-8 border-b-4 border-purple-600 pb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AudienceScan
          </h1>
          <p className="text-xl text-purple-600 font-semibold">
            Data-Backed Crypto Audiences. Guaranteed Results.
          </p>
        </div>

        {/* Value Proposition */}
        <div className="mb-8">
          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-lg mb-6">
            <p className="text-lg text-gray-800 font-medium">
              Turn any token into a targetable audience for X, Telegram, Google, and Reddit ads – <span className="text-purple-600 font-bold">cutting costs by 50% or more</span>. If it doesn't, you get your money back.
            </p>
          </div>
        </div>

        {/* The Problem & Solution */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">✗</span>
              </div>
              The Problem
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Wasting budget on broad "crypto enthusiast" targeting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Guesswork instead of data-driven decisions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>High cost-per-acquisition with poor results</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              The Solution
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <span>Target <strong>real wallets</strong> with verified on-chain behavior</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <span>Discover communities with <strong>actual token overlap</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                <span>50%+ cost reduction, <strong>guaranteed or refund</strong></span>
              </li>
            </ul>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">How It Works (3 Steps)</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-1">Scan Any Token</h3>
              <p className="text-xs text-gray-600">Analyze real wallet transactions</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-1">Find Audience Overlap</h3>
              <p className="text-xs text-gray-600">Discover similar token holders</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h3 className="font-bold text-sm text-gray-900 mb-1">Target With Precision</h3>
              <p className="text-xs text-gray-600">Run high-performance campaigns</p>
            </div>
          </div>
        </div>

        {/* Proven Results */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Proven Results</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-xs text-gray-600 mb-1">DV360 Campaign</div>
              <div className="text-2xl font-bold text-purple-600 mb-1">84%</div>
              <div className="text-xs text-gray-700">lower CPA</div>
              <div className="text-xs text-gray-500 mt-2">$6.09 vs $37.83</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-xs text-gray-600 mb-1">Telegram Campaign</div>
              <div className="text-2xl font-bold text-purple-600 mb-1">66%</div>
              <div className="text-xs text-gray-700">more efficient</div>
              <div className="text-xs text-gray-500 mt-2">€0.21 vs €0.62</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-xs text-gray-600 mb-1">X Campaign</div>
              <div className="text-2xl font-bold text-purple-600 mb-1">3×</div>
              <div className="text-xs text-gray-700">more conversions</div>
              <div className="text-xs text-gray-500 mt-2">€13.11 vs €31.25</div>
            </div>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-3 bg-gray-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">847K+</div>
              <div className="text-xs text-gray-600">Wallets Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">2.1M+</div>
              <div className="text-xs text-gray-600">Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">125K+</div>
              <div className="text-xs text-gray-600">Tokens Indexed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">$4.2B+</div>
              <div className="text-xs text-gray-600">On-Chain Activity</div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Platform Features</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-sm text-gray-900">Wallet Overlap Analysis</h3>
                <p className="text-xs text-gray-600">Discover which communities share holders with your token</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-sm text-gray-900">On-Chain Behavior Data</h3>
                <p className="text-xs text-gray-600">Real transactions, not assumptions or keywords</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BarChart3 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-sm text-gray-900">Multi-Platform Support</h3>
                <p className="text-xs text-gray-600">X, Telegram, Google, and Reddit campaign tools</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-sm text-gray-900">Partnership Outreach</h3>
                <p className="text-xs text-gray-600">DM templates highlighting community overlap</p>
              </div>
            </div>
          </div>
        </div>

        {/* Money-Back Guarantee */}
        <div className="mb-8">
          <div className="bg-purple-600 text-white p-6 rounded-lg">
            <div className="flex items-start gap-4">
              <Shield className="w-10 h-10 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-bold mb-2">Money-Back Guarantee</h2>
                <p className="text-sm opacity-95">
                  If your AudienceScan campaign doesn't cut costs by at least 50% under fair test conditions, we'll refund your Pro subscription. <strong>Zero risk.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ROI Calculation */}
        <div className="mb-8">
          <div className="bg-green-50 border-2 border-green-600 p-5 rounded-lg">
            <h2 className="text-lg font-bold text-gray-900 mb-3 text-center">ROI Example</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-600 mb-1">Monthly Ad Spend</div>
                <div className="text-xl font-bold text-gray-900">$800</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Cost Reduction</div>
                <div className="text-xl font-bold text-green-600">50%+</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Savings</div>
                <div className="text-xl font-bold text-green-600">$400/mo</div>
              </div>
            </div>
            <p className="text-xs text-gray-700 text-center mt-3 font-medium">
              If you spend $400/month or more on ads, AudienceScan pays for itself in saved costs.
            </p>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="border-t-2 border-purple-600 pt-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Ready to Turn Blockchain Data Into Your Unfair Advantage?
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Stop wasting budget on broad targeting. Reach real wallets, guaranteed results or your money back.
            </p>
            
          </div>
        </div>

      </div>
    </div>;
};
export default SalesPitch;
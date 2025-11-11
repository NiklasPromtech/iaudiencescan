import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SDTerms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/5">
      <Header />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-card rounded-lg shadow-elegant p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            SD Marketing Ltd – Terms & Conditions
          </h1>
          <p className="text-lg text-muted-foreground mb-8">(AudienceScan)</p>
          <p className="text-sm text-muted-foreground mb-12">Last Updated: 3 January 2025</p>

          <div className="prose prose-slate max-w-none space-y-8">
            <p className="text-foreground leading-relaxed">
              These Terms & Conditions apply to all invoices, campaigns, and services delivered by SD Marketing Ltd. 
              By submitting payment, the Client acknowledges full acceptance of these terms.
            </p>

            <div className="bg-accent/10 rounded-lg p-6 border border-border">
              <p className="mb-2">
                <strong className="text-foreground">Company:</strong> SD Marketing Ltd ("SD Marketing", "we", "us", or "our"), trading as AudienceScan.
              </p>
              <p>
                <strong className="text-foreground">Client:</strong> The organization ("Client", "you") purchasing media, data, or related marketing services from SD Marketing Ltd.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                AudienceScan is the proprietary marketing technology and brand operated by SD Marketing Ltd. 
                All contracts, invoices, and financial transactions are issued by SD Marketing Ltd.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Scope of Work</h2>
              <p className="text-foreground mb-4">
                SD Marketing provides digital marketing, wallet-intelligence, and on-chain audience analysis services 
                for Web3 and blockchain-related projects under its trading name AudienceScan.
              </p>
              <p className="text-foreground mb-2">Deliverables may include:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Token and wallet data analysis</li>
                <li>Campaign planning and strategy</li>
                <li>Media activation across approved platforms (e.g. X Ads, DV360, Telegram Ads, etc.)</li>
                <li>Performance reporting and optimization</li>
              </ul>
              <p className="text-foreground mt-4">
                Specific deliverables are outlined in the corresponding Campaign Proposal.
              </p>
              <p className="text-foreground mt-4">
                SD Marketing Ltd may, at its discretion, subcontract or partner with third-party vendors for specific 
                services (e.g., ad operations, data processing, or creative). SD Marketing Ltd remains the contracting 
                and billing entity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Term and Completion</h2>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>All campaigns must be completed within three (3) months from the agreed start date, unless otherwise specified in writing by SD Marketing.</li>
                <li>Campaigns inactive for more than 14 consecutive days without written approval are deemed paused.</li>
                <li>Campaigns inactive for more than 90 days are deemed completed, and any remaining budgets are forfeited.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Payments and Fees</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Payment Terms:</h3>
                  <ul className="list-disc pl-6 space-y-2 text-foreground">
                    <li>All campaign and platform fees are payable 100% upfront prior to campaign activation or access to AudienceScan analytics.</li>
                    <li>SD Marketing Ltd does not operate on credit or post-payment terms.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Agency Fee:</h3>
                  <ul className="list-disc pl-6 space-y-2 text-foreground">
                    <li>The Agency Fee covers planning, setup, token analysis, audience research, campaign management, optimization, and reporting.</li>
                    <li>The Agency Fee is non-refundable under all circumstances once work has commenced or data analysis has begun.</li>
                    <li>This fee applies even if the Client later chooses to delay, modify, or cancel their campaign.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Media Budget:</h3>
                  <ul className="list-disc pl-6 space-y-2 text-foreground">
                    <li>Where SD Marketing Ltd controls or deploys paid media budgets (e.g. via X Ads, DV360, Telegram, or other networks), any campaign cancelled by the Client before completion will be subject to the following:</li>
                    <li className="ml-6">50% of any remaining unspent media budget will be refunded.</li>
                    <li className="ml-6">The remaining 50% is retained to cover vendor commitments, ad platform fees, setup, data processing, and operational time already allocated.</li>
                    <li>Media budgets that have already been committed to ad networks or vendor deposits are non-refundable once executed.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Paused Campaigns:</h3>
                  <ul className="list-disc pl-6 space-y-2 text-foreground">
                    <li>Campaigns paused for more than 14 consecutive days without written notice will be considered on hold.</li>
                    <li>Campaigns paused for 90 days or more will be deemed completed, and all remaining budgets (media or otherwise) will be forfeited.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">No Liability for Unused Spend:</h3>
                  <p className="text-foreground">
                    In cases where the Client fails to provide timely creative materials, approval, wallet data, or 
                    technical access, SD Marketing Ltd will not be liable for delays or unused media budget resulting 
                    from such omissions.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Invoices & Acceptance:</h3>
                  <p className="text-foreground">
                    Payment of any invoice issued by SD Marketing Ltd constitutes full acceptance of these terms and conditions.
                  </p>
                  <p className="text-foreground mt-2">
                    Due to the nature of cryptocurrency markets and third-party data dependencies, SD Marketing Ltd 
                    does not guarantee minimum impression, click, or conversion volumes.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Cancellations, Changes & Delays</h2>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Campaigns paused, postponed, or cancelled by the Client after launch follow the refund structure outlined above.</li>
                <li>Any campaign paused beyond 14 consecutive days without written approval may be deemed terminated.</li>
                <li>Material changes (creative, audience, targeting, etc.) requested mid-flight may affect performance and delivery timelines.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Force Majeure / External Factors</h2>
              <p className="text-foreground mb-4">SD Marketing is not liable for campaign delays or performance issues caused by:</p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Market volatility or token price fluctuations</li>
                <li>Ad platform restrictions or account verification delays</li>
                <li>Third-party vendor availability or data access limitations</li>
                <li>Broader network outages or blockchain-related instability</li>
              </ul>
              <p className="text-foreground mt-4">
                Where possible, SD Marketing will provide alternative solutions, but performance cannot be guaranteed 
                under such conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Performance Disclaimer</h2>
              <p className="text-foreground mb-4">
                AudienceScan operates within the emerging Web3 advertising landscape, where market conditions, token 
                prices, and third-party restrictions may impact campaign outcomes.
              </p>
              <p className="text-foreground">
                All campaign metrics, forecasts, and KPIs are directional, indicative, and not guaranteed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Compliance & Responsibility</h2>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>The Client is responsible for ensuring all advertising materials comply with local laws, ad-platform guidelines, and crypto-asset regulations (including restrictions by Google, X, Meta, and regional regulators).</li>
                <li>SD Marketing reserves the right to reject or remove any creative or message deemed non-compliant, misleading, or high-risk.</li>
                <li>The Client warrants that it holds all necessary rights to advertise the promoted project, token, or service.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Confidentiality</h2>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>Both parties agree to keep all proprietary information, campaign data, and wallet analytics confidential.</li>
                <li>SD Marketing may use aggregated, anonymized data for internal benchmarking or marketing purposes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Limitation of Liability</h2>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>SD Marketing shall not be liable for indirect, incidental, or consequential losses, including loss of profit, goodwill, or token value.</li>
                <li>Total liability shall not exceed the total amount paid by the Client under the applicable campaign.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">10. Intellectual Property</h2>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>All reports, analytics, and campaign data produced by SD Marketing (trading as AudienceScan) remain the property of SD Marketing Ltd unless otherwise agreed in writing.</li>
                <li>Clients are granted a limited, non-exclusive license to use such materials for internal purposes only.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">11. Governing Law</h2>
              <p className="text-foreground">
                These Terms are governed by and construed in accordance with the laws of England and Wales, and any 
                disputes shall be subject to the exclusive jurisdiction of the English courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">12. Acceptance</h2>
              <p className="text-foreground font-semibold">
                By submitting payment, the Client acknowledges and agrees to these Terms & Conditions in full.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SDTerms;

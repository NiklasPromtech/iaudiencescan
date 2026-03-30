import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/5">
      <Header />

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-card rounded-lg shadow-elegant p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground mb-8">SD Marketing Ltd — AudienceScan</p>
          <p className="text-sm text-muted-foreground mb-12">Last Updated: 30 March 2026</p>

          <div className="prose prose-slate max-w-none space-y-8">
            {/* 1. Who We Are */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">1. Who We Are</h2>
              <p className="text-foreground leading-relaxed">
                AudienceScan is operated by SD Marketing Ltd ("we", "us", "our"), a company registered in the United Kingdom.
                We provide Web3 analytics services that connect website visitor data with on-chain wallet intelligence.
              </p>
            </section>

            {/* 2. What We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
              <div className="bg-accent/10 rounded-lg p-6 border border-border space-y-3">
                <p className="text-foreground">
                  <strong>Account Information:</strong> When you sign up, we collect your email address and any profile details you provide. Authentication is managed via our cloud infrastructure.
                </p>
                <p className="text-foreground">
                  <strong>Website Analytics:</strong> Our tracking script (<code className="text-sm bg-muted px-1.5 py-0.5 rounded font-mono">vtag-ai-js</code>) collects anonymous visitor data from websites where it is installed, including page views, referrers, browser metadata, and IP-derived country information.
                </p>
                <p className="text-foreground">
                  <strong>Wallet Addresses:</strong> We collect publicly available on-chain wallet addresses that interact with tracked websites. These are public blockchain data and do not constitute personal data in most jurisdictions.
                </p>
                <p className="text-foreground">
                  <strong>Cookies & Local Storage:</strong> We use essential cookies and local storage to maintain your session and preferences. We do not use advertising cookies.
                </p>
              </div>
            </section>

            {/* 3. Why We Collect It */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 text-foreground">
                <li>To provide, maintain, and improve the AudienceScan analytics platform</li>
                <li>To authenticate your account and manage access</li>
                <li>To generate aggregated analytics reports for our clients</li>
                <li>To communicate service updates and respond to support requests</li>
              </ul>
            </section>

            {/* 4. Third-Party Services */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">4. Third-Party Services</h2>
              <p className="text-foreground leading-relaxed mb-3">
                We use the following third-party services to operate AudienceScan:
              </p>
              <div className="bg-accent/10 rounded-lg p-6 border border-border space-y-3">
                <p className="text-foreground">
                  <strong>Cloud Infrastructure:</strong> Authentication, database, and serverless functions are hosted on secure cloud infrastructure with data encrypted at rest and in transit.
                </p>
                <p className="text-foreground">
                  <strong>Hosting:</strong> The application is served via globally distributed CDN and hosting providers.
                </p>
              </div>
              <p className="text-foreground leading-relaxed mt-3">
                We do not sell, rent, or share your personal data with third parties for their marketing purposes.
              </p>
            </section>

            {/* 5. Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">5. Data Retention</h2>
              <p className="text-foreground leading-relaxed">
                We retain your account data and analytics data for as long as your account is active.
                If you request account deletion, we will remove your personal data within 30 days.
                Aggregated, anonymised analytics data may be retained indefinitely.
              </p>
            </section>

            {/* 6. Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">6. Your Rights</h2>
              <p className="text-foreground leading-relaxed mb-3">
                Depending on your jurisdiction, you may have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict certain processing</li>
                <li>Request a copy of your data in a portable format</li>
              </ul>
              <p className="text-foreground leading-relaxed mt-3">
                To exercise any of these rights, contact us at{" "}
                <a href="mailto:support@audiencescan.io" className="text-primary hover:underline">
                  support@audiencescan.io
                </a>.
              </p>
            </section>

            {/* 7. Security */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">7. Security</h2>
              <p className="text-foreground leading-relaxed">
                We implement appropriate technical and organisational measures to protect your data,
                including encryption in transit (TLS) and at rest, access controls, and regular security reviews.
              </p>
            </section>

            {/* 8. Contact */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">8. Contact</h2>
              <div className="bg-accent/10 rounded-lg p-6 border border-border">
                <p className="text-foreground mb-2">
                  <strong>SD Marketing Ltd</strong> (trading as AudienceScan)
                </p>
                <p className="text-foreground">
                  Email:{" "}
                  <a href="mailto:support@audiencescan.io" className="text-primary hover:underline">
                    support@audiencescan.io
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;

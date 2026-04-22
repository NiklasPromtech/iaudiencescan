import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SDTerms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/5">
      <Header />

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-card rounded-lg shadow-elegant p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            SD Marketing Ltd (trading as AudienceScan)
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Terms &amp; Conditions, Privacy Notice and Data Processing Terms
          </p>
          <p className="text-sm text-muted-foreground mb-2">Effective date: 12 October 2025</p>
          <p className="text-sm text-muted-foreground mb-2">Version: 1.0</p>
          <p className="text-sm text-muted-foreground mb-12">
            Published at: audiencescan.io/sdterms
          </p>

          <div className="prose prose-slate max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                1. About us and these terms
              </h2>
              <p className="text-foreground mb-4 leading-relaxed">
                SD Marketing Ltd (registered in England and Wales) trades under the name
                "AudienceScan" and operates the AudienceScan service available at audiencescan.io
                (the "<strong>Service</strong>"). In these terms, "<strong>SD Marketing</strong>",
                "<strong>we</strong>", "<strong>us</strong>" or "<strong>our</strong>" means SD
                Marketing Ltd. "<strong>Customer</strong>", "<strong>you</strong>" or "
                <strong>your</strong>" means the organisation that has entered into an order,
                statement of work, campaign agreement or other contract with us ("
                <strong>Order</strong>") that incorporates these terms by reference.
              </p>
              <p className="text-foreground mb-4 leading-relaxed">
                These terms, together with your Order, form the agreement between you and SD
                Marketing (the "<strong>Agreement</strong>") and govern your use of the Service
                and any related campaigns, data, tags, dashboards, browser extensions, Telegram
                bots and other components we make available. By executing an Order that references
                audiencescan.io/sdterms, you agree to be bound by this document.
              </p>
              <p className="text-foreground leading-relaxed">
                We may update this page from time to time. Material changes will be communicated to
                you by email or through the Service at least 30 days before they take effect.
                Non-material changes (for example, clarifications, typos, contact details, adding a
                new sub-processor in the same jurisdiction) take effect when posted.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                2. The Service in plain English
              </h2>
              <p className="text-foreground leading-relaxed">
                AudienceScan is a <strong>cookieless</strong> web3-aware analytics product. The
                AudienceScan tag does not set cookies on visitors' devices and does not read or
                write to browser storage (<code>localStorage</code>/<code>sessionStorage</code>)
                for the purpose of identifying visitors. Customers install a lightweight tag (a
                JavaScript snippet or Chrome extension) on their website or dapp. The tag collects
                pageview, session, click and interaction data from visitors, and — where visitors
                voluntarily connect a browser wallet — associates that activity with a public
                blockchain wallet address and its publicly observable on-chain balances. Visitors
                are identified by an anonymised <code>visitor_hash</code> computed server-side from
                a small set of device signals (see section 10), never by a persistent identifier
                stored on the visitor's device. Customers access the resulting data through
                dashboards, ad-hoc AI-generated SQL queries, a live feed and other reporting tools.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                3. Your account, tags and acceptable use
              </h2>
              <p className="text-foreground leading-relaxed">
                You are responsible for (a) anything done through your account or with your API
                key, (b) deploying our tag only on websites and properties you own or control or
                are authorised to instrument, (c) making sure the website that carries our tag has
                a lawful basis for the processing we carry out on your behalf, (d) providing the
                end-user-facing disclosures and, where required, consent mechanisms (for example, a
                cookie banner compliant with the UK Privacy and Electronic Communications
                Regulations ("PECR") and UK GDPR). You must not use the Service to process
                special-category data, children's data, payment card data, or any data you are not
                authorised to process. You must not attempt to de-anonymise, re-identify or combine
                AudienceScan data with external personal data in a way not permitted by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                4. Fees, term and termination
              </h2>
              <p className="text-foreground leading-relaxed">
                Fees, invoicing cadence and term are set out in your Order. Unless the Order says
                otherwise, we invoice monthly in arrears, payment is due 14 days from invoice date,
                and either party may terminate the Agreement for convenience on 30 days' written
                notice. Either party may terminate immediately for material breach not cured within
                14 days of written notice, or on the other party's insolvency. On termination, your
                right to access the Service ends; we will, on written request made within 30 days
                of termination, export your analytics data in a commonly used format and then
                delete it from our production systems in accordance with section 11.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Intellectual property</h2>
              <p className="text-foreground leading-relaxed">
                The Service, our tag, our code, our documentation and any aggregate, de-identified
                analytics we derive from operating the Service remain our property. You keep all
                rights in your website content, your branding, and the analytics data we process on
                your behalf ("<strong>Customer Data</strong>"). You grant us a non-exclusive
                licence to process Customer Data solely to operate, secure, support and improve the
                Service, and to comply with law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                6. Warranties and liability
              </h2>
              <p className="text-foreground leading-relaxed">
                We will provide the Service with reasonable skill and care. The Service is
                otherwise provided "as is" and we disclaim all implied warranties to the fullest
                extent permitted by law. Nothing in this Agreement limits liability for death or
                personal injury caused by negligence, fraud, or any other liability that cannot be
                limited under English law. Subject to that, (a) neither party is liable to the
                other for indirect, consequential or special losses, loss of profits, loss of
                revenue, loss of anticipated savings or loss of data, and (b) each party's total
                aggregate liability under this Agreement in any 12-month period is capped at the
                fees paid or payable by you to us in that 12-month period.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Confidentiality</h2>
              <p className="text-foreground leading-relaxed">
                Each party will keep the other's confidential information confidential, use it only
                to perform this Agreement, and protect it with at least the same care it uses for
                its own confidential information of a similar kind (and never less than a
                reasonable standard of care). This section does not apply to information that is
                public through no fault of the receiving party, is independently developed, is
                lawfully received from a third party, or must be disclosed by law (in which case
                the receiving party will, where lawful, give prompt notice).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                8. Governing law and disputes
              </h2>
              <p className="text-foreground leading-relaxed">
                This Agreement is governed by the laws of England and Wales. The parties submit to
                the exclusive jurisdiction of the courts of England and Wales, except that either
                party may seek injunctive relief in any court of competent jurisdiction to protect
                its intellectual property or confidential information.
              </p>
            </section>

            <hr className="border-border my-12" />

            <h2 className="text-3xl font-bold text-foreground mb-2">
              Part B — Privacy Notice and Data Processing Terms
            </h2>
            <p className="text-foreground leading-relaxed mb-8">
              This part explains how SD Marketing handles personal data. It is written to satisfy
              the transparency requirements of the UK GDPR and the Data Protection Act 2018, and
              also operates as the data processing addendum (the "<strong>DPA</strong>") between
              SD Marketing (as processor) and you (as controller) for personal data we process on
              your behalf through the Service. If you require a separately executed DPA, we are
              happy to countersign one — this DPA has equivalent effect on execution of the Order.
            </p>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Roles and scope</h2>
              <p className="text-foreground leading-relaxed">
                For most Customer Data processed through the Service — pageviews, clicks, device
                metadata, session identifiers, truncated or hashed IP addresses, wallet addresses
                that a visitor has voluntarily connected, and the on-chain balances we associate
                with those wallet addresses — <strong>you are the data controller and SD Marketing
                is the data processor</strong>. For a limited set of data — your account
                information, your staff's login credentials, billing contact details, and
                server/application logs we need to run and secure the platform — we are the data
                controller.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                10. Categories of personal data and purposes
              </h2>
              <p className="text-foreground leading-relaxed">
                When acting as your processor, we process the following categories of personal data
                on your behalf: an anonymised online identifier (<code>visitor_hash</code>) and a
                per-session identifier, where the <code>visitor_hash</code> is a truncated SHA-256
                hash computed on our server from the visitor's IP address, the WebGL renderer
                string reported by the browser, the <code>navigator.platform</code> string, the{" "}
                <code>navigator.hardwareConcurrency</code> value and a secret salt held only by us
                — no cookies, <code>localStorage</code> or <code>sessionStorage</code> values are
                set on the visitor's device for identification; technical data (user agent,
                viewport, referrer, approximate geo derived from IP at country/region level);
                behavioural data (URLs visited, timestamps, clicks and the CSS selector of clicked
                elements, scroll and interaction events); and — only where a visitor chooses to
                connect a wallet on your site — the public blockchain address of that wallet and
                the on-chain balances and activity we are able to associate with it from public
                chain data. We process this data solely to provide the Service to you: ingesting
                tag events, storing them for your retrieval, running dashboards and AI-generated
                SQL queries on your behalf, computing aggregate metrics, securing the platform, and
                providing support.
              </p>
            </section>

            <section id="storage">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                11. Where we store and process data
              </h2>
              <div className="bg-accent/10 rounded-lg p-6 border border-border mb-4">
                <p className="text-foreground font-semibold">
                  This section answers the most frequent question we receive from customers and
                  procurement teams.
                </p>
              </div>
              <p className="text-foreground leading-relaxed mb-4">
                Visitor events collected by the AudienceScan tag on your website are ingested by
                our API on <strong>Google Cloud Run</strong> and stored in{" "}
                <strong>Google BigQuery</strong>, both within our Google Cloud project (
                <code>audiencescan</code>) in the <code>us-central1</code> region (Iowa, United
                States).
              </p>
              <p className="text-foreground leading-relaxed">
                Data retention: raw event data is retained for 24 months from collection, after
                which it is deleted or aggregated into non-personal statistics. You may request
                earlier deletion at any time by emailing support@audiencescan.io.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                12. International transfers
              </h2>
              <div className="bg-accent/10 rounded-lg p-6 border border-border mb-4">
                <p className="text-foreground font-semibold">
                  This section answers the second most frequent question we receive.
                </p>
              </div>
              <p className="text-foreground leading-relaxed mb-4">
                Because our primary processing infrastructure is located in the United States,
                personal data collected from visitors in the United Kingdom or the European
                Economic Area is transferred to the United States in the course of providing the
                Service. SD Marketing relies on the following safeguards for those transfers:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>
                  <strong>UK to US:</strong> the UK International Data Transfer Agreement ("
                  <strong>IDTA</strong>") issued by the Information Commissioner's Office, or,
                  where applicable, the UK Addendum to the European Commission's Standard
                  Contractual Clauses (SCCs, Module 2 — controller to processor), together with any
                  technical and organisational measures described in section 13. On request, we
                  will execute the IDTA or the UK Addendum with you as part of this Agreement.
                </li>
                <li>
                  <strong>EEA to US:</strong> the European Commission's Standard Contractual
                  Clauses (Module 2 — controller to processor), supplemented as above.
                </li>
                <li>
                  Where our US sub-processors are self-certified to the{" "}
                  <strong>EU-US Data Privacy Framework</strong> and its UK Extension, we also rely
                  on that framework as a further safeguard. Google LLC is currently self-certified
                  under the DPF and its UK Extension.
                </li>
              </ul>
              <p className="text-foreground leading-relaxed mt-4">
                We carry out transfer risk assessments in line with ICO guidance before engaging
                any new sub-processor in a third country and keep those assessments under review.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">13. Security measures</h2>
              <p className="text-foreground leading-relaxed">
                We protect Customer Data with a combination of provider-managed and
                application-level controls, including: TLS 1.2+ in transit for all ingress and
                egress; encryption at rest for BigQuery and Supabase using AES-256
                (provider-managed keys); API-key authentication for customer access, with keys
                scoped per website and revocable; role-based access control within our team on a
                least-privilege basis; short-lived session tokens for dashboard access; centralised
                audit logging of administrative actions in Google Cloud; network-level isolation
                between production and non-production environments; vulnerability scanning of
                container images at build time; and access to production systems restricted to
                named personnel from approved devices. We do not store payment card data. We
                maintain an internal information security policy and review controls at least
                annually.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">14. Sub-processors</h2>
              <p className="text-foreground leading-relaxed mb-4">
                We use the following sub-processors to deliver the Service:
              </p>
              <div className="overflow-x-auto mb-4">
                <table className="w-full border border-border">
                  <thead className="bg-accent/10">
                    <tr>
                      <th className="text-left p-3 border-b border-border text-foreground font-semibold">
                        Sub-processor
                      </th>
                      <th className="text-left p-3 border-b border-border text-foreground font-semibold">
                        Purpose
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border-b border-border text-foreground align-top">
                        Google LLC / Google Cloud EMEA Ltd
                      </td>
                      <td className="p-3 border-b border-border text-foreground">
                        Hosting (Cloud Run), storage (BigQuery), logging and monitoring for the
                        AudienceScan tag data pipeline (US, <code>us-central1</code> — see section
                        11)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 text-foreground align-top">Supabase Inc.</td>
                      <td className="p-3 text-foreground">
                        Application control-plane database (account, website configuration, API
                        keys)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-foreground leading-relaxed">
                We will give you at least 30 days' prior written notice (which may be by email,
                in-product notification or an update to this page) before adding a new
                sub-processor or replacing an existing one. You may object on reasonable
                data-protection grounds; if we cannot accommodate your objection, either of us may
                terminate the affected portion of the Service on written notice without penalty.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                15. Processor obligations (contractual terms required by Article 28 UK GDPR)
              </h2>
              <p className="text-foreground leading-relaxed mb-4">
                When we act as processor on your behalf, we will:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground">
                <li>
                  process personal data only on your documented instructions, including as set out
                  in this Agreement, your configuration of the Service and your Orders, unless we
                  are required by UK or EU law to process otherwise (in which case we will notify
                  you where legally permitted);
                </li>
                <li>
                  ensure that persons authorised to process personal data are bound by a duty of
                  confidentiality;
                </li>
                <li>
                  implement the technical and organisational measures described in section 13, and
                  assist you with your security obligations taking into account the nature of
                  processing and the information available to us;
                </li>
                <li>
                  assist you, by appropriate technical and organisational measures and insofar as
                  possible, to respond to requests from data subjects exercising their rights under
                  the UK GDPR;
                </li>
                <li>
                  notify you without undue delay, and in any event within 72 hours of becoming
                  aware, of any personal data breach affecting Customer Data, with the information
                  available to us at that point and updates as the investigation continues;
                </li>
                <li>
                  on termination of the Agreement or on your written request, delete or return all
                  Customer Data and delete existing copies, except to the extent we are required to
                  retain them by law (and in that case we will continue to protect them under this
                  Agreement);
                </li>
                <li>
                  make available to you all information reasonably necessary to demonstrate
                  compliance with Article 28 UK GDPR, and allow for and contribute to audits,
                  including inspections, conducted by you or an auditor you mandate, subject to
                  reasonable notice and confidentiality obligations and at your cost unless
                  non-compliance is identified;
                </li>
                <li>only engage sub-processors on the terms of section 14;</li>
                <li>
                  not transfer personal data outside the UK other than as described in section 12.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">16. Data subject rights</h2>
              <p className="text-foreground leading-relaxed">
                If an individual contacts SD Marketing directly to exercise rights in relation to
                Customer Data we process on your behalf (right of access, rectification, erasure,
                restriction, portability or objection), we will, without undue delay, forward the
                request to you and will not respond to it ourselves except to acknowledge receipt,
                unless you instruct us in writing to do so or we are legally required to respond.
                We will provide you with reasonable assistance to fulfil the request.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">17. Contact</h2>
              <p className="text-foreground leading-relaxed">
                Questions about this page, privacy, security or data protection should be sent to{" "}
                <a
                  href="mailto:support@audiencescan.io"
                  className="text-primary hover:underline"
                >
                  support@audiencescan.io
                </a>
                . SD Marketing Ltd is registered in England and Wales; our registered office is
                available on the Companies House register.
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

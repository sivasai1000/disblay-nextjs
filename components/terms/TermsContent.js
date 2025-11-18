export default function TermsContent() {
  return (
    <div className="terms-container py-5">
      <div className="container">
        <div className="text-center mb-4">
          <h2 className="terms-title">Disblay Legal</h2>
          <h1 className="terms-heading">Terms & Conditions</h1>
          <p className="terms-updated">Last Updated: SEP 29, 2025</p>
        </div>

        <div
            className="terms-body-section"
            style={{ marginTop: "70px", marginBottom: "100px" }}
          >
            <section className="terms-section mt-4">
              <h3 className="terms-subheading">Acceptance of Terms</h3>
              <p>
                By accessing or using Disblay (“the Platform”), you agree to
                these Terms & Conditions. If you do not agree, please stop using
                the Platform immediately.
              </p>
            </section>

            <section className="terms-section">
              <h3 className="terms-subheading">Eligibility</h3>
              <p>
                You must be 18 years or older to use the Platform, or have
                parental/guardian consent. By registering, you confirm that the
                information you provide is accurate and complete.
              </p>
            </section>

            <section className="terms-section">
              <h3 className="terms-subheading">User Responsibilities</h3>
              <p>
                You are responsible for maintaining the confidentiality of your
                account and password. You agree to use the Platform only for
                lawful purposes. You must not:
              </p>
              <ul>
                <li>
                  Upload or share illegal, fraudulent, defamatory, or harmful
                  content.
                </li>
                <li>
                  Attempt to reverse-engineer, hack, or disrupt the Platform.
                </li>
                <li>
                  Use the Platform to impersonate others or misrepresent your
                  identity.
                </li>
              </ul>
            </section>

            <section className="terms-section">
              <h3 className="terms-subheading">Intellectual Property</h3>
              <p>
                All software, logos, trademarks, and content on Disblay are the
                property of Topiko Business Solutions Pvt. Ltd. You may not
                copy, modify, distribute, or reuse these assets without prior
                written consent.
              </p>
            </section>

            <section className="terms-section">
              <h3 className="terms-subheading">Service Availability</h3>
              <p>
                We strive to keep the Platform available at all times, but we do
                not guarantee uninterrupted or error-free service. Planned
                maintenance or unforeseen downtime may affect availability.
              </p>
            </section>

            <section className="terms-section">
              <h3 className="terms-subheading">Payment & Subscription</h3>
              <p>
                Pricing and subscription fees are displayed on the Platform. By
                purchasing a plan, you agree to our Refund Policy.
              </p>
            </section>

            <section className="terms-section">
              <h3 className="terms-subheading">Limitation of Liability</h3>
              <p>
                Disblay’s provision of use is “as is”. We are not responsible
                for business losses, missed opportunities, or damages resulting
                from use of the Platform.
              </p>
            </section>

            <section className="terms-section">
              <h3 className="terms-subheading">Governing Law</h3>
              <p>
                These Terms shall be governed by the laws of India, with
                exclusive jurisdiction in the courts of Hyderabad.
              </p>
            </section>
          </div>
      </div>
    </div>
  );
}

export default function PrivacyContent() {
  return (
     <div className="landing-page">
    <div className="terms-container" style={{ marginTop: "70px" }}>
        <div className="terms-header text-center">
          <h6 className="terms-title">Disblay Legal</h6>
          <h1 className="terms-heading">Privacy Policy</h1>
          <p className="terms-updated">Last Updated: SEP 29, 2025</p>
        </div>

        {/* CONTENT */}
        <div
          className="terms-body-section"
          style={{ marginTop: "70px", marginBottom: "100px" }}
        >
          <div className="terms-section">
            <h4 className="terms-subheading">Information We Collect</h4>
            <p>We may collect the following information when you use Dislpay:</p>
            <ul>
              <li>Personal data: name, email, phone number, business name.</li>
              <li>Transaction data: payments, subscriptions, invoices.</li>
              <li>Technical data: IP address, device/browser type, usage logs.</li>
              <li>Optional data: when you contact support or provide feedback.</li>
            </ul>
          </div>

          <div className="terms-section">
            <h4 className="terms-subheading">How We Use Your Information</h4>
            <ul>
              <li>To provide and manage your Dislpay account.</li>
              <li>To process payments and subscriptions.</li>
              <li>To improve features, security, and performance.</li>
              <li>To communicate updates, promotions, or support messages.</li>
              <li>To comply with legal requirements.</li>
            </ul>
          </div>

          <div className="terms-section">
            <h4 className="terms-subheading">Sharing of Information</h4>
            <p>We do not sell or rent your data to third parties. Data may be shared with:</p>
            <ul>
              <li>Service providers (hosting, analytics, payment gateways).</li>
              <li>Legal or regulatory authorities if required.</li>
            </ul>
          </div>

          <div className="terms-section">
            <h4 className="terms-subheading">Data Security</h4>
            <p>
              We apply industry-standard security measures (encryption, access controls).
              However, no system can be guaranteed 100% secure.
            </p>
          </div>

          <div className="terms-section">
            <h4 className="terms-subheading">User Rights</h4>
            <p>
              You may request access, correction, or deletion of your personal data at any
              time. You may also opt-out of marketing communications.
            </p>
          </div>

          <div className="terms-section">
            <h4 className="terms-subheading">Data Retention</h4>
            <p>
              We retain your information as long as required to offer services or comply
              with legal obligations.
            </p>
          </div>
        </div>
      </div>
      </div>
  );
}

export default function CookiesContent() {
  return (
    <div className="terms-container">
      <div className="terms-header text-center" style={{ marginTop: "70px" }}>
        <h6 className="terms-title">Disblay Legal</h6>
        <h1 className="terms-heading">Cookies Policy</h1>
        <p className="terms-updated">Last Updated: SEP 29, 2025</p>
      </div>

      <div className="terms-body-section" style={{ marginTop: "70px", marginBottom: "100px" }}>

        <div className="terms-section">
          <h4 className="terms-subheading">What Are Cookies</h4>
          <p>
            Cookies are small text files stored on your device to improve your browsing experience.
          </p>
        </div>

        <div className="terms-section">
          <h4 className="terms-subheading">How We Use Cookies</h4>
          <ul>
            <li><strong>Essential Cookies:</strong> Enable login, security, and account features.</li>
            <li><strong>Analytics Cookies:</strong> Understand how users interact with Disblay.</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences.</li>
            <li><strong>Advertising Cookies:</strong> If used, personalize ads.</li>
          </ul>
        </div>

        <div className="terms-section">
          <h4 className="terms-subheading">Managing Cookies</h4>
          <p>You may disable cookies from browser settings, but some features may stop working.</p>
        </div>

      </div>
    </div>
  );
}

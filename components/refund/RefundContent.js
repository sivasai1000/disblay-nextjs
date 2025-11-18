export default function RefundContent() {
  return (
    <div className="terms-container">
      <div className="terms-header text-center" style={{ marginTop: "70px" }}>
        <h6 className="terms-title">Disblay Legal</h6>
        <h1 className="terms-heading">Refund Policy</h1>
        <p className="terms-updated">Last Updated: SEP 29, 2025</p>
      </div>

      <div className="terms-body-section" style={{ marginTop: "70px", marginBottom: "100px" }}>
        <div className="terms-section">
          <h4 className="terms-subheading">General Policy</h4>
          <p>
            Subscription fees are non-refundable once services are activated.
            Certain exceptions apply (see below).
          </p>
        </div>

        <div className="terms-section">
          <h4 className="terms-subheading">Eligible Refunds</h4>
          <p className="refunds-name mt-3">Refunds may be approved only in cases of:</p>
          <ul className="ms-3 mt-2">
            <li>Duplicate charges due to a payment error.</li>
            <li>Technical issues preventing access to the service, unresolved within 7 days.</li>
            <li>Cancellation during a trial period (if applicable).</li>
          </ul>
        </div>

        <div className="terms-section">
          <h4 className="terms-subheading">Refund Process</h4>
          <p>
            Submit a refund request to <strong>legal@topiko.com</strong> with payment details.
            Refund requests must be made within 7 days of payment.
            Approved refunds will be credited within 7–10 business days through the original payment method.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DigitBoxes({
  label,
  arr,
  setter,
  prefix,
  mt = 50,
  handleDigitChange,
  handleLogin,
  handleVerifyOtp,
  handleSetNewMpin,
}) {
  return (
    <>
      <p
        className="creditionals-text text-start"
        style={{ marginTop: mt, marginBottom: 30 }}
      >
        {label}
      </p>

      <div className="d-flex justify-content-start gap-3 mb-4">
        {arr.map((digit, index) => (
          <input
            key={index}
            id={`${prefix}-${index}`}
            type="password"
            maxLength={1}
            value={digit}
            onChange={(e) =>
              handleDigitChange(e.target.value, index, setter, arr, prefix)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (prefix === "mpin") handleLogin();
                if (prefix === "otp") handleVerifyOtp();
                if (prefix === "newmpin" || prefix === "confirmmpin")
                  handleSetNewMpin();
              }
            }}
            className="form-control text-center"
            style={{
              width: "72px",
              height: "72px",
              fontSize: "20px",
              borderRadius: "8px",
              border: "1.5px solid #E2E4E9",
            }}
          />
        ))}
      </div>
    </>
  );
}

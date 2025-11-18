
import DigitBoxes from "./DigitBoxes";
import Link from "next/link";
export default function LoginContent({
  username,
  setUsername,
  validateMobile,
  error,
  mpin,
  setMpin,
  handleLogin,
  setForgotMode,
   handleDigitChange,  
}) {
  return (
    <>
      <div className="creditionals-header mb-4">Login</div>

      <label className="form-label creditionals-text mb-3 mt-4 text-start w-100">
        Mobile Number
      </label>

      <div
        className="mt-1 mb-2"
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: "50px",
          border: "1px solid #ced4da",
          borderRadius: "10px",
          padding: "0 8px",
          background: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            padding: "0 10px",
            height: "34px",
            background: "#F4F4F4",
            borderRadius: "6px",
            minWidth: "70px",
          }}
        >
          <img
            src="https://flagcdn.com/w20/in.png"
            alt="India flag"
            style={{
              width: "20px",
              height: "14px",
              objectFit: "cover",
              borderRadius: "2px",
            }}
          />
          <span style={{ fontSize: "14px", fontWeight: "500" }}>+91</span>
        </div>

        <input
          type="tel"
          value={username}
          className="creditionals-input"
          onChange={(e) =>
            setUsername(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
          onBlur={validateMobile}
          placeholder="Enter mobile number"
          maxLength={10}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: "14px",
            padding: "0px 10px",
            background: "transparent",
          }}
        />
      </div>

      {error && <p className="text-danger small mb-2">{error}</p>}

      <DigitBoxes
        label="Enter your M-Pin"
        arr={mpin}
        setter={setMpin}
        prefix="mpin"
       handleDigitChange={handleDigitChange}

        handleLogin={handleLogin}
        handleVerifyOtp={() => {}}
        handleSetNewMpin={() => {}}
      />

      <button
        className="creditional-accountcreate w-100 mb-4 mt-4"
        onClick={handleLogin}
      >
        <span className="creditionals-btntext">Login</span>
      </button>

      <div className="text-end mt-2 mb-4">
        <span
          className="text-primary"
          style={{ cursor: "pointer", fontSize: 14 }}
          onClick={() => setForgotMode(true)}
        >
          Forgot Password / M-PIN?
        </span>
      </div>

      <div className="d-flex align-items-center my-3">
        <hr className="flex-grow-1" />
        <span className="mx-2">Or</span>
        <hr className="flex-grow-1" />
      </div>

      <div className="text-center creditonals-already mb-3">
        Don’t have an account?{" "}
      <Link
  href="/SignUp"
  style={{
    cursor: "pointer",
    color: "var(--bs-primary)",
    textDecoration: "none",
    display: "inline"
  }}
>
  Create account
</Link>

      </div>
    </>
  );
}

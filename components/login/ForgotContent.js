import DigitBoxes from "./DigitBoxes";

export default function ForgotContent({
  username,
  setUsername,
  stage,
  setStage,
  otp,
  setOtp,
  newMpin,
  setNewMpin,
  confirmMpin,
  setConfirmMpin,
  error,
  handleSendOtp,
  handleVerifyOtp,
  handleResendOtp,
  handleSetNewMpin,
  setForgotMode,
  handleDigitChange,
}) {
  return (
    <>
      <div className="creditionals-header mb-4">Forgot M-PIN</div>

      {/* STEP 1 */}
      {stage === "mobile" && (
        <>
          <label className="form-label creditionals-text mb-3 mt-4 text-start w-100">
            Mobile Number
          </label>

           <div className="mt-1 mb-2" style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      height: "50px",
                      border: "1px solid #ced4da",
                      borderRadius: "10px",
                      padding: "0 8px",
                      background: "#fff",
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "0 10px",
                        height: "34px",
                        background: "#F4F4F4",
                        borderRadius: "6px",
                        minWidth: "70px",
                      }}>
                        <img src="https://flagcdn.com/w20/in.png" alt="India flag"
                          style={{
                            width: "20px",
                            height: "14px",
                            objectFit: "cover",
                            borderRadius: "2px",
                          }} />
                        <span style={{ fontSize: "14px", fontWeight: "500" }}>+91</span>
                      </div>

                      <input
                        type="tel"
                        value={username}
                        className="creditionals-input"
                        onChange={(e) =>
                          setUsername(e.target.value.replace(/\D/g, "").slice(0, 10))
                        }
                        onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
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

          <button className="creditional-accountcreate w-100 mt-3" onClick={handleSendOtp}>
            Send OTP
          </button>

          <span className="text-secondary mt-2" onClick={() => setForgotMode(false)}>
            ← Back to Login
          </span>
        </>
      )}

      {/* STEP 2 */}
      {stage === "otp" && (
        <>
          <label className="form-label creditionals-text mb-3 mt-4 text-start w-100">
            Mobile Number
          </label>

           <div className="mt-1 mb-2" style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      height: "50px",
                      border: "1px solid #ced4da",
                      borderRadius: "10px",
                      padding: "0 8px",
                      background: "#fff",
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "0 10px",
                        height: "34px",
                        background: "#F4F4F4",
                        borderRadius: "6px",
                        minWidth: "70px",
                      }}>
                        <img src="https://flagcdn.com/w20/in.png" alt="India flag"
                          style={{
                            width: "20px",
                            height: "14px",
                            objectFit: "cover",
                            borderRadius: "2px",
                          }} />
                        <span style={{ fontSize: "14px", fontWeight: "500" }}>+91</span>
                      </div>

                      <input
                        type="tel"
                        value={username}
                        className="creditionals-input"
                        onChange={(e) =>
                          setUsername(e.target.value.replace(/\D/g, "").slice(0, 10))
                        }
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


          <DigitBoxes
            label="Enter OTP"
            arr={otp}
            setter={setOtp}
            prefix="otp"
            handleDigitChange={handleDigitChange}
            handleLogin={() => {}}
            handleVerifyOtp={handleVerifyOtp}
            handleSetNewMpin={() => {}}
          />

          <button className="creditional-accountcreate w-100 mt-3" onClick={handleVerifyOtp}>
            Verify OTP
          </button>

          <div className="d-flex justify-content-between mt-3">
            <span onClick={() => setStage("mobile")}>← Change Number</span>
            <span onClick={handleResendOtp}>Resend OTP</span>
          </div>
        </>
      )}

      {/* STEP 3 */}
      {stage === "setmpin" && (
        <>
          <label className="form-label creditionals-text mb-3 mt-4 text-start w-100">
            Mobile Number
          </label>

        <div className="mt-1 mb-2" style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      height: "50px",
                      border: "1px solid #ced4da",
                      borderRadius: "10px",
                      padding: "0 8px",
                      background: "#fff",
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "0 10px",
                        height: "34px",
                        background: "#F4F4F4",
                        borderRadius: "6px",
                        minWidth: "70px",
                      }}>
                        <img src="https://flagcdn.com/w20/in.png" alt="India flag"
                          style={{
                            width: "20px",
                            height: "14px",
                            objectFit: "cover",
                            borderRadius: "2px",
                          }} />
                        <span style={{ fontSize: "14px", fontWeight: "500" }}>+91</span>
                      </div>

                      <input
                        type="tel"
                        value={username}
                        className="creditionals-input"
                        onChange={(e) =>
                          setUsername(e.target.value.replace(/\D/g, "").slice(0, 10))
                        }
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

          <DigitBoxes
            label="Set New M-PIN"
            arr={newMpin}
            setter={setNewMpin}
            prefix="newmpin"
            handleDigitChange={handleDigitChange}
            handleLogin={() => {}}
            handleVerifyOtp={() => {}}
            handleSetNewMpin={handleSetNewMpin}
          />

          <DigitBoxes
            label="Confirm New M-PIN"
            arr={confirmMpin}
            setter={setConfirmMpin}
            prefix="confirmmpin"
            mt={20}
            handleDigitChange={handleDigitChange}
            handleSetNewMpin={handleSetNewMpin}
          />

          <button className="creditional-accountcreate w-100 mt-3" onClick={handleSetNewMpin}>
            Save M-PIN
          </button>

          <span className="text-secondary mt-2" onClick={() => setForgotMode(false)}>
            ← Back to Login
          </span>
        </>
      )}
    </>
  );
}

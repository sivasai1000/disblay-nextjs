
"use client";

import DigitBoxes from "./DigitBoxes";

export default function SignupStep3({
  mpin,
  setMpin,
  confirmMpin,
  setConfirmMpin,
  handleDigitChange,
  handleSubmitMpin,
  mpinLoading,
}) {
  return (
    <>
      <h2 className="creditionals-mpin mb-4">Create your M-Pin</h2>

      <DigitBoxes
        
        arr={mpin}
        setter={setMpin}
        prefix="mpin"
        handleDigitChange={handleDigitChange}
        handleSubmit={handleSubmitMpin}
      />

      <div className="creditionals-mpin mb-3">Confirm your M-Pin</div>

      <DigitBoxes
        arr={confirmMpin}
        setter={setConfirmMpin}
        prefix="confirm"
        handleDigitChange={handleDigitChange}
        handleSubmit={handleSubmitMpin}
      />

      <button
        className="creditional-accountcreate w-100"
        onClick={handleSubmitMpin}
        disabled={mpinLoading}
      >
        <span className="creditionals-btntext">
          {mpinLoading ? "Saving..." : "Submit"}
        </span>
      </button>
    </>
  );
}

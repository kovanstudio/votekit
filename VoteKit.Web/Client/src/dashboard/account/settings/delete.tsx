import * as React from "react";

//TODO: actually delete the account

export function DeleteAccountSettings() {
  const [confirmation, setConfirmation] = React.useState("");

  return (
    <div className="account-settings-delete">
      <div className="panel-title">Delete Account</div>

      <form className="w-60 flex-no-shrink">
        <p className="text-danger m-gap-t-def">
          Once you delete your user account,{" "}
          <b>there is no way to recover it</b>. Please be certain.
        </p>

        <div className="flex flex-col m-gap-t-def">
          <label htmlFor="account-settings-delete">
            Please type "DELETE ACCOUNT" in the field below:
          </label>

          <input
            className="input-control"
            id="account-settings-delete"
            type="text"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
          />
        </div>

        <div className="flex m-gap-t-def m-gap-t-def">
          <input
            disabled={confirmation != "DELETE ACCOUNT"}
            type="submit"
            className="btn-danger"
            value="I'm Sure, Delete My Account"
          />
        </div>
      </form>
    </div>
  );
}

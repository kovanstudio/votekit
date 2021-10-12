import * as React from "react";
import { schema } from "../../gql/client";

export function PasswordSettings() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [
    savePassword,
    { error, loading, data },
  ] = schema.useSavePasswordMutation();

  return (
    <div className="account-settings-password">
      {loading ? <div className="spinner-overlay"/> : null}
      <div className="panel-title">Change Password</div>
      <div className="flex">
        <form
          className="w-60 flex-no-shrink"
          onSubmit={async (e) => {
            e.preventDefault();

            try {
              await savePassword({
                variables: {
                  input: {
                    currentPassword,
                    password,
                  },
                },
              });

              setCurrentPassword("");
              setPassword("");
            } catch (e) {}
          }}
          onReset={(e) => {
            setCurrentPassword("");
            setPassword("");
          }}
        >
          <div className="flex flex-col m-gap-t-def">
            <label htmlFor="account-settings-password-currentpassword">
              Current Password
            </label>

            <input
              className="input-control"
              id="account-settings-password-currentpassword"
              type="password"
              value={currentPassword}
              placeholder="*************"
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col m-gap-t-def">
            <label htmlFor="account-settings-password-password">
              New Password
            </label>

            <input
              className="input-control"
              id="account-settings-password-password"
              type="password"
              value={password}
              placeholder="*************"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {data?.savePassword == schema.OperationResult.Success ? (
            <p className="m-gap-t-def alert alert-success">
              Password changed successfully
            </p>
          ) : null}

          {error ? (
            <p className="m-gap-t-def alert alert-error">{error.message}</p>
          ) : null}

          <div className="flex m-gap-t-def m-t-40">
            <input
              disabled={!currentPassword || !password}
              type="submit"
              className="btn-primary"
              value="Save"
            />
            <input
              disabled={!currentPassword || !password}
              type="reset"
              className="btn-light m-l-def"
              value="Cancel"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

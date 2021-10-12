import * as React from "react";
import { useMe } from "../state";
import { Redirect, Link } from "react-router-dom";
import { useOverrides } from "../../lib/useOverrides";
import { schema } from "../gql/client";

export function AccountSettings() {
  const me = useMe();

  if (!me) {
    return <Redirect to="/" />;
  }

  return (
    <section className="main">
      <div className="container">
        <div className="panel group-board">
          <header className="panel-header">
            User Account Settings
            <div className="header-addons">
              <Link to="/account/logout" className="btn">
                Sign Out
              </Link>
            </div>
          </header>

          <div className="panel-body">
            <GeneralSettings />
            <hr />
            <PasswordSettings />
          </div>
        </div>
      </div>
    </section>
  );
}

function GeneralSettings() {
  const me = useMe();
  const [saved, setSaved] = React.useState(false);

  const [data, update] = useOverrides(me, [me]);
  const [saveMember, { error, loading }] = schema.useSaveUserMutation();

  return (
    <div className="account-settings-general">
      {loading ? <div className="spinner-overlay" /> : null}
      <div className="flex">
        <form
          className="w-60 flex-no-shrink"
          onSubmit={async (e) => {
            e.preventDefault();

            try {
              await saveMember({
                variables: {
                  input: {
                    email: data.email,
                    displayName: data.displayName,
                  },
                },
              });

              setSaved(true);
            } catch (e) {
              setSaved(false);
            }
          }}
          onReset={(e) => {
            update(null);
            setSaved(false);
          }}
        >
          <div className="flex flex-col m-gap-t-def">
            <label htmlFor="account-settings-general-email">Email Address</label>

            <input
              className="input-control"
              id="account-settings-general-email"
              type="email"
              value={data.email}
              placeholder="me@example.com"
              onChange={(e) => update({ email: e.target.value })}
            />
          </div>

          <div className="flex flex-col m-gap-t-def">
            <label htmlFor="account-settings-general-displayName">Display Name</label>

            <input
              className="input-control"
              id="account-settings-general-displayName"
              type="text"
              value={data.displayName}
              placeholder="John Doe"
              onChange={(e) => update({ displayName: e.target.value })}
            />
          </div>

          {saved ? <p className="m-gap-t-def alert alert-success">Account settings saved successfully</p> : null}
          {error ? <p className="m-gap-t-def alert alert-error">{error.message}</p> : null}

          <div className="flex m-gap-t-def m-t-40">
            <input type="submit" className="btn-primary" value="Update User Details" />
            <input type="reset" className="btn-light m-l-def" value="Cancel" />
          </div>
        </form>
      </div>
    </div>
  );
}

function PasswordSettings() {
  const me = useMe();

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [savePassword, { error, loading, data }] = schema.useSavePasswordMutation();

  return (
    <div className="account-settings-password">
      {loading ? <div className="spinner-overlay" /> : null}

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
          {me.hasPassword ? (
            <div className="flex flex-col m-gap-t-def">
              <label htmlFor="account-settings-password-currentpassword">Current Password</label>

              <input
                className="input-control"
                id="account-settings-password-currentpassword"
                type="password"
                value={currentPassword}
                placeholder="*************"
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
          ) : null}

          <div className="flex flex-col m-gap-t-def">
            <label htmlFor="account-settings-password-password">New Password</label>

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
            <p className="m-gap-t-def alert alert-success">Password changed successfully</p>
          ) : null}

          {error ? <p className="m-gap-t-def alert alert-error">{error.message}</p> : null}

          <div className="flex m-gap-t-def m-t-40">
            <input disabled={!currentPassword || !password} type="submit" className="btn-primary" value="Change Password" />
            <input disabled={!currentPassword || !password} type="reset" className="btn-light m-l-def" value="Cancel" />
          </div>
        </form>
      </div>
    </div>
  );
}

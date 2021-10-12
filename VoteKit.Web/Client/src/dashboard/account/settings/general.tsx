import * as React from "react";
import { useMe } from "../../state";
import { schema } from "../../gql/client";
import { useOverrides } from "../../../lib/useOverrides";

export function GeneralSettings() {
  const me = useMe();
  const [saved, setSaved] = React.useState(false);

  const [data, update] = useOverrides(me, [me]);
  const [saveMember, { error, loading }] = schema.useSaveMemberMutation();

  return (
    <div className="account-settings-general">
      {loading ? <div className="spinner-overlay"/> : null}
      <div className="panel-title">Account Settings</div>
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
            <input type="submit" className="btn-primary" value="Save" />
            <input type="reset" className="btn-light m-l-def" value="Cancel" />
          </div>
        </form>
      </div>
    </div>
  );
}

import { useProject } from "../../state";
import { useOverrides } from "../../../lib/useOverrides";
import { Link } from "react-router-dom";
import { schema } from "../../gql/client";

export function ProjectSsoSettings() {
  let project = useProject();
  const [data, update] = useOverrides(project.ssoConfig);

  const [saveSsoConfig, saveSsoConfigRes] = schema.useSaveSsoConfigMutation();

  return <div className="project-settings-sso group-settings-content">
    {saveSsoConfigRes.loading ? <div className="spinner-overlay"/> : null}
    <div className="panel-title">Single Sign On Settings</div>

    <form className="w-60 flex-no-shrink"
          onSubmit={async (e) => {
            e.preventDefault();

            try {
              let res = await saveSsoConfig({
                variables: {
                  input: {
                    loginUrl: data.loginUrl || null,
                    logoutUrl: data.logoutUrl || null
                  },
                },
              });

              update(null);
            } catch (e) {
            }
          }}
          onReset={(e) => {
            update(null);
          }}>
      <div className="flex-col m-gap-t-def">
        <label htmlFor="generalsettings-name">SSO Secret</label>

        <p className="m-y-10 text-muted">Please sign your user information using this secret as a JWT. See <Link to={"/settings/widget"}>Widget
          Setup</Link> for details. </p>

        <input
          className="input-control"
          id="generalsettings-name"
          type="text"
          readOnly={true}
          value={data.ssoKey || ""}
          onChange={(e) => undefined}
        />
      </div>

      <div className="flex-col m-gap-t-def">
        <label htmlFor="generalsettings-name">Login URL (optional)</label>

        <p className="m-y-10 text-muted">If you specify a login URL, we will redirect users to this URL when they are required to be authenticated</p>

        <input
          className="input-control"
          id="generalsettings-name"
          type="url"
          value={data.loginUrl || ""}
          placeholder="http://myproject.com/login"
          onChange={(e) => update({ loginUrl: e.target.value })}
        />
      </div>

      <div className="flex-col m-gap-t-def">
        <label htmlFor="generalsettings-name">Logout URL (optional)</label>

        <input
          className="input-control"
          id="generalsettings-name"
          type="url"
          value={data.logoutUrl || ""}
          placeholder="http://myproject.com/login"
          onChange={(e) => update({ logoutUrl: e.target.value })}
        />
      </div>

      {saveSsoConfigRes.called && !saveSsoConfigRes.error ?
        <p className="m-gap-t-def alert alert-success">Single sign on settings saved successfully</p> : null}
      {saveSsoConfigRes.error ? <p className="m-gap-t-def alert alert-error">{saveSsoConfigRes.error.message}</p> : null}

      <div className="flex m-gap-t-def m-t-40">
        <input type="submit" className="btn-primary" value="Save"/>
        <input type="reset" className="btn-light m-l-def" value="Cancel"/>
      </div>
    </form>
  </div>
}

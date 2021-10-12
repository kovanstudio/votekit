import * as React from "react";
import { schema } from "../../gql/client";
import { useMe, useProject } from "../../state";
import { confirmDialog } from "../../../lib/dialog";

export function ProjectTeamSettings() {
  const project = useProject();
  const me = useMe();

  const projectMembers = schema.useProjectMembersAndInvitesQuery();

  const [removeUser, removeUserRes] = schema.useRemoveUserMutation({
    refetchQueries: ["projectMembersAndInvites"],
  });

  const [removeInvite, removeInviteRes] = schema.useRemoveInviteMutation({
    refetchQueries: ["projectMembersAndInvites"],
  });

  return (
    <div className="flex-col">
      {projectMembers.loading || removeUserRes.loading || removeInviteRes.loading ? <div className="spinner-overlay"></div> : null}

      <div className="project-settings-team group-settings-content">
        <header className="panel-title">Team Management</header>

        {removeUserRes.error ? <p className="alert alert-error">{removeUserRes.error.message}</p> : null}
        {removeInviteRes.error ? <p className="alert alert-error">{removeInviteRes.error.message}</p> : null}
        {removeUserRes.data?.removeUser == "SUCCESS" ? <p className="alert alert-success">Member removed from project</p> : null}
        {removeInviteRes.data?.removeInvite == "SUCCESS" ? <p className="alert alert-success">Invitation removed</p> : null}

        <table className="table-inverted team-list">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {projectMembers.data?.members.map((m) => (
              <tr key={m.id}>
                <td>
                  <img src={m.avatar} className="avatar"/> {m.displayName}
                </td>
                <td>{m.email}</td>
                <td>Admin</td>
                <td className="text-right">
                  {me.id != m.id ? (
                    <a
                      href="#"
                      onClick={async (e) => {
                        e.preventDefault();

                        if (!(await confirmDialog("Are you sure?"))) return;

                        await removeUser({
                          variables: {
                            input: {
                              userId: m.id,
                            },
                          },
                        });
                      }}
                    >
                      Remove
                    </a>
                  ) : null}
                </td>
              </tr>
            ))}

            {projectMembers.data?.invites.map((m) => (
              <tr key={m.id}>
                <td>
                  <img src="/images/logo-placeholder.jpg" className="avatar"/> Invited Member
                </td>
                <td>{m.email}</td>
                <td>Admin</td>
                <td className="text-right">
                  {me.id != m.id ? (
                    <a
                      href="#"
                      onClick={async (e) => {
                        e.preventDefault();

                        if (!(await confirmDialog("Are you sure?"))) return;

                        await removeInvite({
                          variables: {
                            input: {
                              inviteId: m.id,
                            },
                          },
                        });
                      }}
                    >
                      Delete
                    </a>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Invite/>
    </div>
  );
}

function Invite() {
  const project = useProject();
  const [email, setEmail] = React.useState("");

  const [addInvite, { loading, error, data }] = schema.useAddInviteMutation({
    refetchQueries: ["projectMembersAndInvites"],
  });

  return (
    <div className="project-settings-team m-t-30 group-settings-content">
      {loading ? <div className="spinner-overlay"></div> : null}

      <header className="panel-title">Invite Team Member</header>

      {error ? <p className="alert alert-error">{error.message}</p> : null}

      {data?.addInvite ? <p className="alert alert-success">Invitation sent</p> : null}

      <form
        className="w-60 flex-no-shrink"
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            await addInvite({
              variables: {
                input: {
                  email,
                },
              },
            });

            setEmail("");
          } catch (e) {
          }
        }}
        onReset={(e) => {
          setEmail("");
        }}
      >
        <div className="flex flex-col m-gap-t-def">
          <label htmlFor="teamsettings-invite-email">Email Address</label>

          <input
            className="input-control"
            id="teamsettings-invite-email"
            type="email"
            value={email}
            placeholder="foo@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {error ? <p className="m-gap-t-def color-danger ws-pre">{error.message}</p> : null}

        <div className="flex m-gap-t-def">
          <input disabled={!email} type="submit" className="btn-primary" value="Send Invite"/>
          <input disabled={!email} type="reset" className="btn-light m-l-def" value="Cancel"/>
        </div>
      </form>
    </div>
  );
}

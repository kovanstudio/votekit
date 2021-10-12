import * as React from "react";
import { NavLink, Redirect, Route, Switch, useParams } from "react-router-dom";
import { TimeAgo } from "../../../components/time";
import "../../css/modules/user.scss";
import { schema } from "../../gql/client";
import { UserFragment } from "../../gql/schema";
import { useProject } from "../../state";
import { EntriesList } from "../entries/entries";

export function User() {
  const project = useProject();
  const { userId } = useParams();

  const user = schema.useUserQuery({
    variables: {
      id: userId,
    },
  });

  if (user.loading) return <div className="spinner-overlay"/>;

  if (!user.data?.user) return <Redirect to="/people" />;

  return (
    <div className="container container-main group-user">
      <div className="group-user-content">
        <div className="panel">
          <div className="panel-header">
            <ul className="tab-bar basic m-b-0">
              <li>
                <NavLink to={`/people/${userId}`} exact>
                  Feedback
                </NavLink>
              </li>

              <li>
                <NavLink to={`/people/${userId}/upvotes`}>Upvotes</NavLink>
              </li>
            </ul>
          </div>

          <Switch>
            <Route path="/people/:userId" exact render={() => <Entries user={user.data.user} />} />

            <Route path="/people/:userId/upvotes" exact render={() => <Upvotes user={user.data.user} />} />
          </Switch>
        </div>
      </div>

      <UserNav user={user.data.user} />
    </div>
  );
}

function Entries({ user }: { user: UserFragment }) {
  const project = useProject();

  return (
    <EntriesList
      variables={{
        input: { userIds: [user.id] },
      }}
    />
  );
}

function Upvotes({ user }: { user: UserFragment }) {
  const project = useProject();

  return (
    <EntriesList
      variables={{
        input: { voterUserIds: [user.id] },
      }}
    />
  );
}

function UserNav({ user }: { user: UserFragment }) {
  return (
    <div className="group-user-nav">
      <div className="panel-narrow">
        <div className="panel-header user-header">
          <img src={user.avatar} alt="User avatar" className="avatar" />
          <span className="name">{user.displayName}</span>
          <aside className="footer">
            Last seen: <TimeAgo value={user.seenAt} />
          </aside>
        </div>
        <ul className="property-list">
          <li>
            <label>Email</label>
            <span>{user.email}</span>
          </li>
          <li>
            <label>First Seen</label>
            <span>
              <TimeAgo value={user.createdAt} />
            </span>
          </li>
          <li>
            <label>User ID</label>
            <span>{user.id}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

import "../../css/modules/people.scss";

import * as React from "react";
import { useHistory, Switch, Route, Redirect } from "react-router-dom";
import { Checkbox, Radio } from "../../../components/form";
import { schema } from "../../gql/client";
import { OrderBy, UsersInput, UsersOrderByInput } from "../../gql/schema";
import { useProject } from "../../state";
import { TimeAgo } from "../../../components/time";
import { ChevronRightIcon } from "../../../components/icon";
import { User } from "./user";
import { PaginationFooter } from "../../components/pagination";
import { SearchIcon } from "../../../components/icon";

type PeopleState = {
  input: UsersInput;
  orderBy: UsersOrderByInput;
  after?: string;
  before?: string;
};

export function PeopleRoutes() {
  const project = useProject();

  return (
    <Switch>
      <Route path={`/people`} exact component={People} />
      <Route path={`/people/:userId`} component={User} />
      <Route render={() => <Redirect to="/people" />} />
    </Switch>
  );
}

function People() {
  const project = useProject();
  OrderBy;
  const [state, dispatch] = React.useReducer(
    (s: PeopleState, a: any): PeopleState => {
      switch (a.type) {
        case "after":
          return { ...s, before: null, after: a.payload };
        case "before":
          return { ...s, after: null, before: a.payload };
        case "input/update":
          return { ...s, input: { ...s.input, ...a.payload } };
        case "orderBy/set":
          return { ...s, orderBy: a.payload };
        default:
          return s;
      }
    },
    {
      orderBy: { seenAt: OrderBy.Desc },
      input: {},
    }
  );

  const projectUsers = schema.useUsersQuery({
    variables: {
      input: state.input,
      orderBy: state.orderBy,
      after: state.after,
      before: state.before,
    },
    fetchPolicy: "network-only",
  });

  const users = projectUsers.data?.users;

  const handlePaginate = React.useCallback(
    (delta: number) => {
      if (delta > 0 && users.pageInfo?.hasNextPage) {
        dispatch({ type: "after", payload: users.pageInfo.endCursor });
      } else if (delta < 0 && users.pageInfo?.hasPreviousPage) {
        dispatch({ type: "before", payload: users.pageInfo.startCursor });
      }
    },
    [users?.pageInfo]
  );

  return (
    <div className="container container-main group-people">
      {projectUsers.loading ? <div className="spinner-overlay"></div> : null}

      <nav className="nav group-people-nav">
        <PeopleFilters state={state} dispatch={dispatch} />
      </nav>

      <div className="group-people-content">
        <div className="panel">
          <div className="panel-flush">
            {users ? <PeopleTable users={users} /> : null}

            {users && !users?.nodes.length ? (
              <div className="p-20">
                <p className="alert alert-notice m-0">There are no users matching your filters...</p>
              </div>
            ) : null}

            {users ? (
              <PaginationFooter connection={users} onChange={handlePaginate} />
            ) : (
              <aside>
                <span>Loading...</span>
              </aside>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PeopleTable({ users }: { users: schema.UsersConnectionFragment }) {
  const history = useHistory();

  return (
    <table className="table-grid people">
      <thead>
        <tr>
          <th>NAME</th>
          <th>EMAIL</th>
          <th>LAST SEEN</th>
          <th className="justify-end">VOTES</th>
          <th className="justify-end">COMMENTS</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {users.nodes.map((u) => (
          <tr
            key={u.id}
            onClick={(e) => {
              e.preventDefault();
              history.push(`/people/${u.id}`);
            }}
          >
            <td>
              <img src={u.avatar} alt="Usaer avatar" className="avatar" />
              {u.displayName}
            </td>
            <td>
              <a href={`mailto:${u.email}`}>{u.email}</a>
            </td>
            <td>
              <TimeAgo value={u.createdAt} />
            </td>
            <td className="justify-end">{u.stats.votes}</td>
            <td className="justify-end">{u.stats.comments}</td>
            <td className="justify-end">
              <ChevronRightIcon />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PeopleFilters({ state, dispatch }: { state: Pick<PeopleState, "input" | "orderBy">; dispatch: any }) {
  const [query, setQuery] = React.useState("");

  const setOrderBy = React.useCallback(
    (orderBy) =>
      dispatch({
        type: "orderBy/set",
        payload: orderBy,
      }),
    [dispatch]
  );

  const updateInput = React.useCallback(
    (input) =>
      dispatch({
        type: "input/update",
        payload: input,
      }),
    [dispatch]
  );

  return (
    <section className="nav-section">
      <header className="nav-header">FILTER</header>

      <form
        className="nav-form"
        onSubmit={(e) => {
          e.preventDefault();
          updateInput({ query });
        }}
      >
        <div className="flex flex-col m-gap-t-def">
          <div className="input-text">
            <span className="input-addon">
              <SearchIcon className="m-r-10" />
            </span>

            <input
              id="createproject-slug"
              className="input-control"
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </form>

      <form className="nav-form m-t-20">
        <div className="flex flex-col m-gap-t-def">
          <label>Sort By</label>

          <div className="m-t-5">
            <Radio checked={state.orderBy.seenAt == "DESC"} onChange={(e) => setOrderBy({ seenAt: OrderBy.Desc })} label="Last Activity" />
          </div>

          <div className="m-t-10">
            <Radio checked={state.orderBy.entries == "DESC"} onChange={(e) => setOrderBy({ entries: OrderBy.Desc })} label="Top Posters" />
          </div>

          <div className="m-t-10">
            <Radio checked={state.orderBy.votes == "DESC"} onChange={(e) => setOrderBy({ votes: OrderBy.Desc })} label="Top Voters" />
          </div>
        </div>

        <div className="flex flex-col m-gap-t-def">
          <label>Activity</label>

          <div className="m-t-5">
            <Checkbox checked={!!state.input.hasEntry} onChange={(e) => updateInput({ hasEntry: e.target.checked })} label="Has given feedback" />
          </div>

          <div className="m-t-10">
            <Checkbox checked={!!state.input.hasComment} onChange={(e) => updateInput({ hasComment: e.target.checked })} label="Has commented" />
          </div>
        </div>
      </form>
    </section>
  );
}

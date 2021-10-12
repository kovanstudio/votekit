import * as React from "react";
import { NavLink, Redirect, Route, Switch, useParams } from "react-router-dom";
import { schema } from "../gql/client";
import { EntryComments } from "./section-comments";
import { EntryUpvotes } from "./section-upvotes";

export function EntrySections({ entry }: { entry: schema.EntryFragment }) {
  let dashboardPathname = `/entries${entry.pathname}`;
  
  return (
    <div className="entry-sections">
      <ul className="tab-bar basic">
        <li>
          <NavLink to={`${dashboardPathname}`} exact>
            Comments {entry.stats.comments ? <>({entry.stats.comments})</> : null}
          </NavLink>
        </li>

        <li>
          <NavLink to={`${dashboardPathname}/upvotes`}>Upvotes {entry.stats.votes ? <>({entry.stats.votes})</> : null}</NavLink>
        </li>
      </ul>

      <Switch>
        <Route path={`${dashboardPathname}/upvotes`} render={() => <EntryUpvotes entry={entry} />} />
        <Route path={dashboardPathname} exact render={() => <EntryComments entry={entry} />} />
        <Redirect to={dashboardPathname} />
      </Switch>
    </div>
  );
}

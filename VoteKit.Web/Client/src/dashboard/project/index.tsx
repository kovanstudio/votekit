import * as React from "react";
import { ProjectProvider, useMe } from "../state";
import { Redirect, Route, Switch } from "react-router-dom";
import { schema } from "../gql/client";
import { ProjectEntries } from "./entries/entries";
import { PeopleRoutes } from "./people/people";
import { UserRole } from "../../gql/dashboard/schema";

const ProjectSettings = React.lazy(() => import("./settings/settings"));

export function ProjectRoutes() {
  const me = useMe();
  const { data, loading } = schema.useProjectQuery({ variables: { includeDetails: me.role == UserRole.Admin } });

  if (loading) {
    return <div className="spinner-overlay"/>;
  }

  if (!data?.project) {
    return <Redirect to="/"/>;
  }

  return (
    <ProjectProvider value={data.project}>
      <Switch>
        <Route path={`/`} exact component={ProjectEntries}/>
        <Route path={`/people`} component={PeopleRoutes}/>
        <Route path={`/settings`} component={ProjectSettings}/>
        <Route render={() => <Redirect to="/"/>}/>
      </Switch>
    </ProjectProvider>
  );
}

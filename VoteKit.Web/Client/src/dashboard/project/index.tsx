import * as React from "react";
import { BoardProvider, ProjectProvider, useProject } from "../state";
import { Redirect, Route, Switch, useParams } from "react-router-dom";
import { schema } from "../gql/client";
import { ProjectEntries } from "./entries/entries";
import { ProjectSelector } from "./selector";
import CreateProject from "./create";
import { PeopleRoutes } from "./people/people";

const ProjectSettings = React.lazy(() => import("./settings/settings"));

export function ProjectRoutes() {
  const { data, loading } = schema.useProjectQuery();

  if (loading) {
    return <div className="spinner-overlay" />;
  }

  if (!data?.project) {
    return <Redirect to="/" />;
  }

  return (
    <ProjectProvider value={data.project}>
      <Switch>
        <Route path={`/`} exact component={ProjectEntries} />
        <Route path={`/people`} component={PeopleRoutes} />
        <Route path={`/settings`} component={ProjectSettings} />
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </ProjectProvider>
  );
}

export function ProjectsRoutes() {
  return (
    <Switch>
      <Route path="/projects" exact component={ProjectSelector} />
      <Route path="/projects/create" exact component={CreateProject} />

      <Route render={() => <Redirect to="/" />} />
    </Switch>
  );
}

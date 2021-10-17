import "../../css/modules/settings.scss";

import * as React from "react";
import { NavLink, Redirect, Route, Switch } from "react-router-dom";
import { useMe, useProject } from "../../state";
import { ProjectGeneralSettings } from "./general";
import { ProjectTeamSettings } from "./team";
import { CreateBoard } from "./boards/create";
import { ProjectStatusesSettings } from "./statuses";
import { PlusIcon } from "../../../components/icon";
import { schema } from "../../gql/client";
import { UserRole } from "../../../gql/feed/schema";
import { ProjectWidgetSettings } from "./widget";

const BoardSettings = React.lazy(() => import("./boards/boards"));

export default ProjectSettings;

export function ProjectSettings() {
  const project = useProject();
  const me = useMe();

  if (me.role != UserRole.Admin)
    return <Redirect to="/"/>

  return (
    <div className="container container-main group-settings">
      <nav className="group-settings-nav nav">
        <section className="nav-section">
          <header className="nav-header">PROJECT SETTINGS</header>
          <ul className="nav-items">
            <li className="nav-item">
              <NavLink exact to={`/settings`}>
                General
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to={`/settings/team`}>
                Team Management
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to={`/settings/statuses`}>
                Entry Statuses
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to={`/settings/widget`}>
                Widget Setup
              </NavLink>
            </li>
          </ul>
        </section>

        <ProjectSettingsBoards/>
      </nav>

      <Switch>
        <Route path={`/settings`} exact component={ProjectGeneralSettings}/>
        <Route path={`/settings/team`} component={ProjectTeamSettings}/>
        <Route path={`/settings/widget`} component={ProjectWidgetSettings}/>
        <Route path={`/settings/statuses`} component={ProjectStatusesSettings}/>
        <Route path={`/settings/boards/create`} component={CreateBoard}/>
        <Route path={`/settings/boards/:boardSlug`} component={BoardSettings}/>
        <Route render={() => <Redirect to="/settings"/>}/>
      </Switch>
    </div>
  );
}

function ProjectSettingsBoards() {
  let boards = schema.useBoardsQuery();

  if (boards.loading)
    return null;

  return (
    <section className="nav-section m-t-40">
      <header className="nav-header">BOARD SETTINGS</header>
      <ul className="nav-items">
        {boards.data.boards.map((b) => (
          <li key={b.id} className="nav-item">
            <NavLink to={`/settings/boards/${b.slug}`}>{b.name}</NavLink>
          </li>
        ))}

        <li className="nav-item">
          <NavLink className="text-primary flex place-center" exact to="/settings/boards/create">
            <PlusIcon/>
            <span className="m-l-5">Create New Board</span>
          </NavLink>
        </li>
      </ul>
    </section>
  );
}

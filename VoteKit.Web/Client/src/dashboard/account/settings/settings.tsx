import "../../css/modules/settings.scss";

import * as React from "react";
import { Redirect, Route, Switch, NavLink, Link } from "react-router-dom";
import { GeneralSettings } from "./general";
import { PasswordSettings } from "./password";
import { DeleteAccountSettings } from "./delete";
import { useMe } from "../../state";
import { PlusIcon } from "../../../components/icon";

export function AccountSettings() {
  const me = useMe();

  return (
    <div className="container container-main group-settings">
      <nav className="group-settings-nav nav">
        <section className="nav-section">
          <header className="nav-header">ACCOUNT SETTINGS</header>
          <ul className="nav-items">
            <li className="nav-item">
              <NavLink exact to={`/account/settings`}>
                General
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink exact to={`/account/settings/password`}>
                Password & Security
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink exact to={`/account/settings/disable`}>
                Delete Account
              </NavLink>
            </li>
            <li className="nav-item">
              <Link to={`/logout`}>
                Sign Out
              </Link>
            </li>
          </ul>
        </section>

        {/*<section className="nav-section m-t-40">*/}
        {/*  <header className="nav-header">PROJECTS</header>*/}
        {/*  <ul className="nav-items">*/}
        {/*    {me.projects.map((p) => (*/}
        {/*      <li className="nav-item" key={p.id}>*/}
        {/*        <NavLink exact to={`/p/${p.slug}/settings`}>*/}
        {/*          {p.name}*/}
        {/*        </NavLink>*/}
        {/*      </li>*/}
        {/*    ))}*/}
        
        {/*    <li className="nav-item">*/}
        {/*      <NavLink className="text-primary flex" exact to={`/projects/create`}>*/}
        {/*        <PlusIcon />*/}
        {/*        <span className="m-l-5">Create New Project</span>*/}
        {/*      </NavLink>*/}
        {/*    </li>*/}
        {/*  </ul>*/}
        {/*</section>*/}
      </nav>
      <div className="group-settings-content">
        <Switch>
          <Route path={`/account/settings`} exact component={GeneralSettings} />
          <Route path={`/account/settings/password`} exact component={PasswordSettings} />
          <Route path={`/account/settings/disable`} exact component={DeleteAccountSettings} />
          <Route render={() => <Redirect to={`/account`} />} />
        </Switch>
      </div>
    </div>
  );
}

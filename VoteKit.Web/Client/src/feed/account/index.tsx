import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Logout from "./logout";
import { AccountSettings } from "./settings";

export default function AccountRoutes() {
  return (
    <Switch>
      <Route path={`/account/settings`} component={AccountSettings} />
      <Route path={`/account/logout`} component={Logout} />
      <Route render={() => <Redirect to="/" />} />
    </Switch>
  );
}

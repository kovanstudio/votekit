import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { AccountSettings } from "./settings/settings";

export default AccountRoutes;

export function AccountRoutes() {
  return (
    <Switch>
      <Route path={`/account/settings`} component={AccountSettings} />
      <Route render={() => <Redirect to="/" />} />
    </Switch>
  );
}

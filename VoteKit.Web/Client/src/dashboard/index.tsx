import "./css/index.scss";

import * as React from "react";
import * as ReactDom from "react-dom";
import { BrowserRouter as Router, Redirect, Route, Switch, useLocation } from "react-router-dom";
import { Provider, schema } from "./gql/client";
import { MainHeader } from "./header";
import { ConfigProvider, MeProvider } from "./state";
import { ProjectRoutes } from "./project";
import AccountRoutes from "./account";
import { EntryRoutes } from "./entries/entry";

const Login = React.lazy(() => import("./account/login"));
const Logout = React.lazy(() => import("./account/logout"));
const Register = React.lazy(() => import("./account/register"));

function Root() {
  return (
    <Provider>
      <Router basename="/dashboard">
        <React.Suspense fallback={<div className="spinner-overlay" />}>
          <App />
        </React.Suspense>
      </Router>
    </Provider>
  );
}

function App() {
  const { data, loading } = schema.useConfigQuery();

  if (loading) {
    return <div className="spinner-overlay" />;
  }

  return (
    <ConfigProvider value={data.config}>
      <MainHeader />

      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/logout" exact component={Logout} />
        <Route path="/register" exact component={Register} />

        <Route component={AuthorizedRoutes} />
      </Switch>
    </ConfigProvider>
  );
}

function AuthorizedRoutes() {
  const location = useLocation();

  const { data, loading } = schema.useMeQuery();

  if (loading) {
    return <div className="spinner-overlay" />;
  }

  if (!data?.me) {
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: {
            afterauth: location.pathname,
          },
        }}
      />
    );
  }

  return (
    <MeProvider value={data.me}>
      <Switch>
        <Route path="/entries/:boardSlug/:entrySlug" component={EntryRoutes} />
        <Route path="/account" component={AccountRoutes} />
        <Route component={ProjectRoutes} />
      </Switch>
    </MeProvider>
  );
}

function Error404() {
  return <div>Not Found</div>;
}

ReactDom.render(<Root />, document.getElementById("app"));

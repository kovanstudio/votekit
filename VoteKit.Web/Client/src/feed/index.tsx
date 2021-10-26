import "./css/index.scss";
import React from "react";
import ReactDom from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider, schema } from "./gql/client";
import { ConfigProvider, MeProvider, ProjectProvider } from "./state";
import { Board } from "./board/board";
import { MainHeader } from "./header";
import { LoginHandler, LoginProvider } from "./account/login";
import { AddEntry } from "./entry/add";
import { Roadmap } from "./roadmap";

const AccountSettings = React.lazy(() => import("./account/index"))
const WidgetController = React.lazy(() => import("./widget/controller"))

function Root({ id, basename, mode }) {
  return (
    <Provider>
      <Router basename={basename}>
        <React.Suspense fallback={<div className="spinner-overlay"/>}>
          <App mode={mode}/>
        </React.Suspense>
      </Router>
    </Provider>
  );
}

function App({ mode }) {
  const config = schema.useConfigQuery();
  const project = schema.useProjectQuery();
  const me = schema.useMeQuery();

  if (config.loading || project.loading || me.loading) {
    return <div className="spinner-overlay"/>;
  }

  if (!project.data?.project) {
    return <Error404/>;
  }

  return (
    <ConfigProvider value={config.data.config}>
      <ProjectProvider value={project.data.project}>
        <MeProvider value={me.data.me}>
          <LoginProvider>
            {mode == "widget" ? <WidgetController/> : null}

            <LoginHandler/>
            <MainHeader/>
            
            <Switch>
              <Route path="/" exact component={Roadmap}/>
              <Route path="/account" component={AccountSettings}/>
              <Route path="/entries/add" exact component={AddEntry}/>
              <Route path="/:boardSlug" component={Board}/>
              <Route component={Error404}/>
            </Switch>
          </LoginProvider>
        </MeProvider>
      </ProjectProvider>
    </ConfigProvider>
  );
}

function Error404() {
  return <div>Not Found</div>;
}

const fcelem = document.querySelector<HTMLInputElement>("#votekit-feed-config");

if (fcelem) {
  let feedConfig;

  try {
    feedConfig = JSON.parse(fcelem.value);
  } catch (e) {
  }

  if (feedConfig) {
    ReactDom.render(<Root {...feedConfig} />, document.getElementById("app"));
  }
}

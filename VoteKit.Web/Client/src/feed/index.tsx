import "./css/index.scss";
import React from "react";
import ReactDom from "react-dom";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { Provider, schema } from "./gql/client";
import { ConfigProvider, MeProvider, ProjectProvider } from "./state";
import { PlusIcon, SearchIcon } from "../components/icon";
import { Board } from "./board/board";
import { MainHeader } from "./header";
import { LoginHandler } from "./account/login";
import { AddEntry } from "./entry/add";
import { Roadmap } from "./roadmap";

const AccountSettings = React.lazy(() => import("./account/index"))

function Root({ id, basename }) {
  return (
    <Provider>
      <Router basename={basename}>
        <React.Suspense fallback={<div className="spinner-overlay" />}>
          <App />
        </React.Suspense>
      </Router>
    </Provider>
  );
}

function App() {
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
          <LoginHandler/>

          <MainHeader/>
          <Switch>
            <Route path="/" exact component={Roadmap}/>
            <Route path="/account" component={AccountSettings}/>
            <Route path="/entries/add" exact component={AddEntry}/>
            <Route path="/:boardSlug" component={Board}/>
            <Route component={Error404}/>
          </Switch>
        </MeProvider>
      </ProjectProvider>
    </ConfigProvider>
  );
}

function Error404() {
  return <div>Not Found</div>;
}

const piElement = document.querySelector<HTMLInputElement>("#votekit-project");

if (piElement) {
  let projectInfo;

  try {
    projectInfo = JSON.parse(piElement.value);
  } catch (e) {}

  if (projectInfo) {
    ReactDom.render(<Root {...projectInfo} />, document.getElementById("app"));
  }
}

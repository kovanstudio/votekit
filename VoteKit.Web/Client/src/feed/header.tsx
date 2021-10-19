import { NavLink, Link } from "react-router-dom";
import * as React from "react";
import { schema } from "./gql/client";
import { useProject } from "./state";

export function MainHeader() {
  const project = useProject();
  const boards = schema.useBoardsQuery();

  return (
    <header className="main">
      <div className="container">
        <img className="logo" src={project.logoURL == "/images/logo-placeholder.jpg" ? "/images/feed/header-logo.svg" : project.logoURL}
             alt="Project Logo"/>

        <div className="navigation">
          <NavLink to="/" exact>Roadmap</NavLink>

          {boards.data?.boards.filter(b => b.isListed).map(b => <NavLink to={`/${b.slug}`} key={b.id}>{b.name}</NavLink>)}
        </div>

        <UserNavigation/>
      </div>
    </header>
  );
}

function UserNavigation() {
  const { data, loading } = schema.useMeQuery();

  if (!data?.me) {
    return null;
  }

  return (
    <div className="m-l-auto flex">
      <div className="avatar">
        <Link to={"/account/settings"}>
          <img src={data.me.avatar} alt="Member Avatar"/>
        </Link>
      </div>
    </div>
  );
}

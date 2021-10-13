import "./css/modules/header.scss";

import * as React from "react";
import { Link, NavLink, Route, useLocation } from "react-router-dom";
import { schema } from "./gql/client";
import { useMe } from "./state";
import { UserRole } from "../gql/feed/schema";

export function MainHeader() {
  return (
    <header className="main-header">
      <div className="container place-center">
        <Link to="/" className="brand flex">
          <img src="/images/dashboard/header-logo.svg" alt="VoteKit Logo"/>
        </Link>

        <ProjectNavigation/>
        <MemberNavigation/>
      </div>
    </header>
  );
}

function ProjectNavigation() {
  const { data } = schema.useMeQuery();
  const { pathname } = useLocation();

  return (
    <>
      {!["/login", "/register"].includes(pathname) ? <div className="m-l-30 flex flex-row navigation">
        <NavLink exact to="/">
          Feedback
        </NavLink>
        <NavLink to="/people">People</NavLink>
        {data?.me?.role == UserRole.Admin ? <NavLink to="/settings">Settings</NavLink> : null}
      </div> : null}
      <div className="m-l-auto flex flex-row navigation">
        <a href="/" target="_blank" className="m-l-auto text-muted">View Public Feed</a>
      </div>
    </>
  );
}

function MemberNavigation() {
  const { data, loading } = schema.useMeQuery();

  if (!data?.me) {
    return null;
  }

  return (
    <div className="m-l-20 flex">
      <div className="avatar">
        <Link to={"/account/settings"}>
          <img src={data.me.avatar} alt="Member Avatar"/>
        </Link>
      </div>
    </div>
  );
}

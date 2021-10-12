import "./css/modules/header.scss";

import * as React from "react";
import { Link, NavLink, Route, useParams } from "react-router-dom";
import { schema } from "./gql/client";

export function MainHeader() {
  return (
    <header className="main-header">
      <div className="container place-center">
        <Link to="/" className="brand flex">
          <img src="/images/dashboard/header-logo.svg" />
        </Link>
        
        <ProjectNavigation />
        <MemberNavigation />

        <Route path="/login" component={LoginNotice} />
        <Route path="/register" component={RegisterNotice} />
      </div>
    </header>
  );
}

function ProjectNavigation() {
  const { slug } = useParams();

  return (
    <div className="m-l-30 flex flex-row navigation">
      <NavLink exact to="/">
        Feedback
      </NavLink>
      <NavLink to="/people">People</NavLink>
      <NavLink to="/settings">Settings</NavLink>
    </div>
  );
}

function MemberNavigation() {
  const { data, loading } = schema.useMeQuery();

  if (!data?.me) {
    return null;
  }

  return (
    <div className="m-l-auto flex">
      <div className="avatar">
        <Link to={"/account/settings"}>
          <img src={data.me.avatar} alt="Member Avatar" />
        </Link>
      </div>
    </div>
  );
}

function LoginNotice() {
  return (
    <div className="m-l-auto flex">
      <h3>
        Don't have an account?
        <Link className="m-l-10" to="/register">
          Sign Up!
        </Link>
      </h3>
    </div>
  );
}

function RegisterNotice() {
  return (
    <div className="m-l-auto flex">
      <h3>
        Already have an account?
        <Link className="m-l-10" to="/login">
          Log In!
        </Link>
      </h3>
    </div>
  );
}

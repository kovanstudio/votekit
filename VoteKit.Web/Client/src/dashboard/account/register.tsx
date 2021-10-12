import * as React from "react";
import { Redirect, useLocation } from "react-router-dom";
import { schema } from "../gql/client";

export default Register;

export function Register() {
  const location = useLocation();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");

  const [register, { error }] = schema.useRegisterMutation({
    refetchQueries: ["me"],
    awaitRefetchQueries: true,
  });

  const { data, loading } = schema.useMeQuery();

  if (loading) {
    return <div className="spinner-overlay"/>;
  } else if (data.me) {
    return <Redirect to={location.state?.afterauth || "/"} />;
  }

  return (
    <section className="container container-main place-center justify-center flex-col">
      <form
        className="panel login-form w-50"
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            await register({
              variables: { input: { email, password, displayName } },
            });
          } catch (e) {}
        }}
      >
        <header className="panel-title">Create a new user account</header>

        <div className="flex flex-col m-gap-t-def">
          <label htmlFor="login-email">Email</label>
          <input id="login-email" className="input-control" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="flex flex-col m-gap-t-def">
          <label htmlFor="login-name">Name</label>
          <input id="login-name" className="input-control" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </div>

        <div className="flex flex-col m-gap-t-def">
          <label htmlFor="login-password">Password</label>
          <input id="login-password" className="input-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {error ? <p className="m-gap-t-def alert alert-error">{error.message}</p> : null}

        <div className="flex flex-col m-gap-t-def">
          <input type="submit" className="bg-primary" value="Create Account" />
        </div>
      </form>
    </section>
  );
}

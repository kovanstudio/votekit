import { useState } from "react";
import { Redirect, useLocation } from "react-router-dom";
import { Checkbox } from "../../components/form";
import { formatError, hasErrorCode, schema } from "../gql/client";

export default Login;

export function Login() {
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [login, { error }] = schema.useLoginMutation({
    refetchQueries: ["me"],
    awaitRefetchQueries: true,
  });

  const { data, loading, error: meError } = schema.useMeQuery();
  
  if (loading) {
    return <div className="spinner-overlay"/>;
  } else if (hasErrorCode(meError, "AUTH_NOT_AUTHORIZED")) {
    document.location.href = "/"
    return null;
  } else if (data?.me) {
    return <Redirect to={location.state?.afterauth || "/"} />;
  }

  return (
    <section className="container container-main place-center justify-center flex-col">
      <form
        className="panel login-form w-50"
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            await login({
              variables: { input: { email, password, remember } },
            });
          } catch (e) {}
        }}
      >
        <header className="panel-title">Log in to your account</header>
        <div className="flex flex-col m-gap-t-def">
          <label htmlFor="login-email">Email</label>
          <input id="login-email" className="input-control" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="flex flex-col m-gap-t-def">
          <label htmlFor="login-password">Password</label>
          <input id="login-password" className="input-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="flex flex-row place-center m-gap-t-def">
          <Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} label="Remember Me" />
          <a href="#" className="m-l-auto">
            Forgot Password
          </a>
        </div>

        {error ? <p className="m-gap-t-def alert alert-error">{formatError(error)}</p> : null}

        <div className="flex flex-col m-gap-t-def">
          <input type="submit" className="bg-primary" value="Log In" />
        </div>
      </form>
    </section>
  );
}

import { schema } from "../gql/client";
import { Redirect } from "react-router-dom";
import * as React from "react";

export default function Logout() {
  const [logout, { data }] = schema.useLogoutMutation({
    refetchQueries: [{ query: schema.MeDocument }],
    awaitRefetchQueries: true,
  });

  React.useEffect(() => {
    logout().then((r) => {});
  }, []);

  if (data?.logout) {
    return <Redirect to="/" />;
  }

  return <div className="spinner-overlay" />;
}

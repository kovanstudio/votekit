import * as React from "react";

import { ApolloClient, ApolloError, ApolloProvider, from, gql, InMemoryCache, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

import * as schema from "./schema";

let loginHandler: () => Promise<Record<string, any>>;

export function setLoginHandler(handler: () => Promise<any>) {
  loginHandler = handler;
}

const checkAuthErrorLink = onError(({ graphQLErrors, operation, forward }) => {
  let hasError = graphQLErrors?.some((e) => e.extensions?.code == "AUTH_NOT_AUTHENTICATED");

  if (loginHandler && !operation.getContext()["try-login"] && hasError) {
    operation.setContext({ "try-login": true });
    return forward(operation);
  }
});

const authCtx = setContext(async (op, prevContext) => {
  if (loginHandler && prevContext["try-login"]) {
    return await loginHandler();
  }

  return {};
});

const requestLink = new HttpLink({
  uri: "/gql",
  credentials: "include",
});

const link = from([checkAuthErrorLink, authCtx, requestLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export { useQuery, useLazyQuery, useMutation, gql, schema };

export function Provider({ children = null }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export function formatError(err: ApolloError): string {
  if (err.graphQLErrors != null) {
    return err.graphQLErrors.map(e => e.message).join(", ");
  }

  return err.message;
}

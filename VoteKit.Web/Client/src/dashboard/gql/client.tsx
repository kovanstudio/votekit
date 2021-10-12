import * as React from "react";

import { ApolloClient, ApolloError, ApolloProvider, from, gql, InMemoryCache, useLazyQuery, useMutation, useQuery, } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

import * as schema from "./schema";
import { HttpLink } from "@apollo/client/link/http";

const checkAuthErrorLink = onError(({ graphQLErrors, operation, forward }) => {
  return forward(operation);
});

const requestLink = new HttpLink({
  uri: "/gql",
  credentials: "include",
});

const link = from([checkAuthErrorLink, requestLink]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export { useQuery, useLazyQuery, useMutation, gql, schema };

export function Provider({ children = null }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export function formatError(err: ApolloError) : string {
  if (err.graphQLErrors != null) {
    return err.graphQLErrors.map(e => e.message).join(", ");
  }
  
  return err.message;
}

export function hasErrorCode(err: ApolloError, code: string) : boolean {
  return err?.graphQLErrors?.some((e) => e.extensions?.code == code);
}

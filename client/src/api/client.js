import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } from '@apollo/client';

const graphqlEndpoint = import.meta.env.VITE_HASURA_GRAPHQL_ENDPOINT || 'http://10.141.234.198:8080/v1/graphql';

const httpLink = createHttpLink({
  uri: graphqlEndpoint,
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('tafach_token');

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }));

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  // ApolloLink.from() is great, or you can use authLink.concat(httpLink)
  link: ApolloLink.from([authLink, httpLink]), 
  cache: new InMemoryCache(),
});

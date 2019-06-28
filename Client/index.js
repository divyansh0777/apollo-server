import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from "graphql-tag";
import { HttpLink } from 'apollo-link-http';

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:4000/'
})

const client = new ApolloClient({
  cache,
  link
})

const result = await client.query({ query: gql`
  mutation createUser(id: 9, name: "abc", role: "skipper"){
    id
    name
    role{
      id
      role
    }
  }
`})
console.log(result);

import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    id: Int!
    name: String
    role: Roles
  }

  type Roles {
    id: Int!
    role: String
    user: [User]
  }

  type Error {
    errorArgs: String
    errorField: String
  }

  type Query {
    user(id: Int!): [User]
    role(role: String!): [Roles]
    users: [User]
    roles: [Roles]
    getError: Error
  }

  type Mutation {
    createUser(id: Int!, name: String!, role: String!): User!
    deleteUser(id: Int!): User!
    updateUser(id: Int!, name: String!): User!
  }

  type Subscription {
    userCreated: User!
    userDeleted: User!
  }
`;

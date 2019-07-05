import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    _id: String!
    name: String
    email: String
    role: String
    createdAt: String
  }

  type Query {
    user(_id: String!): [User]
    users: [User]
  }

  type Mutation {
    createUser(_id: String!, name: String!, role: String!, email: String!, createdAt: String!): User!
    deleteUser(_id: String!): User!
    updateUser(_id: String!, name: String!): User!
    getUser(_id: String!): User!
  }

  type Subscription {
    userCreated: User!
    userDeleted: User!
    getUser(_id: String!): User!
  }
`;

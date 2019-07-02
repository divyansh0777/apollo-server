import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    _id: String!
    name: String
    role: String
    createdAt: String
    email: String
  }

  type Query {
    user(id: String!): [User]
    users: [User]
  }

  type Mutation {
    createUser(_id: String!, name: String!, role: String!): User!
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

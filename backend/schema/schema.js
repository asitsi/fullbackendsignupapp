const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    username: String!
  }

  type Token {
    token: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    signUp(
      firstName: String!
      lastName: String!
      email: String!
      phoneNumber: String!
      username: String!
      password: String!
    ): User
    signIn(email: String!, password: String!): Token
  }
`;

module.exports = { typeDefs };

import { ApolloServer } from 'apollo-server-express';
import * as express from 'express';
import { createServer } from 'http';
import { makeExecutableSchema } from 'graphql-tools';
import { typeDefs } from './schema'
import { resolvers } from './resolvers'

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      return connection.context;
    } else {
      const token = req.headers.authorization || "";
      return { token };
    }
  },
});

const server = new ApolloServer({ schema });

const app = express();
server.applyMiddleware({app});

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({port: 4000});

import { ApolloServer } from 'apollo-server-express';
import * as BodyParser from "body-parser";
import * as express from 'express';
import { createServer } from 'http';
import { typeDefs } from './Schema'
import { resolvers } from './Resolvers'
import checkAuthorization from './CheckAuthorization';

const server = new ApolloServer({
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
  subscriptions: {
    onConnect: async (connectionParams, webSocket) => {
      if (connectionParams.authorization) {
        return await checkAuthorization(connectionParams.authorization)
      }
      throw new Error('Missing auth token!');
    }
  }
 });

const bodyParser = BodyParser;
const app = express();
initBodyParser;
function initBodyParser() {
  app.use(bodyParser.text({ type: "text/html" }));
  app.use(bodyParser.urlencoded({ extended: false }));
}

server.applyMiddleware({app});

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({port: 4000});

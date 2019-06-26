import { ApolloServer } from 'apollo-server-express';
import * as BodyParser from "body-parser";
import * as express from 'express';
import { createServer } from 'http';
import { typeDefs } from './Schema'
import { resolvers } from './Resolvers'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    return { token };
  },
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

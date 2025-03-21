require("dotenv").config();
import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/schemas";
import { Request, Response } from "express";
import cookieParser from "cookie-parser";
import connectToMongoDB from "./connectToMongoDB";

const app: Application = express();
const PORT = process.env.PORT || 5000;

connectToMongoDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Required middleware for Apollo
app.use(express.json());

app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

// Create Apollo Server
async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }),
  });

  await server.start(); // Ensure Apollo Server is started before applying middleware
  server.applyMiddleware({ app: app as any, path: "/graphql" });

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer();

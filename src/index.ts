require("dotenv").config();
import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/schemas";
import { Request, Response } from "express";
import cookieParser from "cookie-parser";
import connectToMongoDB from "./config/connectToMongoDB";

const app: Application = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

connectToMongoDB();

app.use(cors({ origin: "*" }));

// Required middleware for Apollo
app.use(express.json({ limit: "20mb" }));

app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

// Create Apollo Server
async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // Add this to increase the Apollo Server payload limit
    context: ({ req }) => ({ req }),
  });

  await server.start();
  server.applyMiddleware({
    bodyParserConfig: { limit: "20mb" },
    app: app as any,
    path: "/graphql",
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer();

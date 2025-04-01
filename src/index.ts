require("dotenv").config();
import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/schemas";
import { Request, Response } from "express";
import cookieParser from "cookie-parser";
import connectToMongoDB from "./config/connectToMongoDB";
import { createContext } from "./middleware/authMiddleware";

const app: Application = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL;
if (!FRONTEND_URL) {
  throw new Error("FRONTEND_URL is not defined in .env file");
}

connectToMongoDB();

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Set-Cookie"],
    exposedHeaders: ["Set-Cookie"],
  })
);

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
    context: createContext, // Use our authentication context middleware
  });

  await server.start();
  server.applyMiddleware({
    bodyParserConfig: { limit: "20mb" },
    app: app as any,
    path: "/graphql",
    cors: {
      origin: FRONTEND_URL,
      credentials: true,
      optionsSuccessStatus: 200,
      exposedHeaders: ["Set-Cookie"],
    }, // Override default cors to ensure credentials are supported
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer();

import express from "express";
import dotenv from "dotenv";
dotenv.config();
import testRoute from "./routes/testRoute.js";

const PORT = process.env.PORT || 8080;

const app = express();

//middleware json
app.use(express.json());

app.use("/api", testRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

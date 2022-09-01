
import connectDB from "./config/db";

import bodyParser from "body-parser";
import express from "express";
const app = express();

// configure the app to use bodyParser()

app.use(bodyParser.json());

connectDB();

app.get("/", (req, res) => res.send("API Running"));

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));

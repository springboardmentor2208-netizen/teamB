const express = require("express");
const cors = require("cors");


const app = express();
const errorMiddleware = require("./middleware/error.middleware")

app.use(cors());
app.use(express.json());


const userRoutes = require("./routes/user.routes");
app.use("/api", userRoutes);

app.use(errorMiddleware);



module.exports = app;

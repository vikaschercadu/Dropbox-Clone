const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes/index");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", routes);
app.use(cors());

//Listening to port
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});

//Logging all api request to the console
app.all("*", (req, res, next) => {
  const { method, originalUrl } = req;
  console.log(`=>request received: ${method}: ${originalUrl}`);
  next();
});

//DB connection to MongoDB
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

// Create mongo connection
mongoose.connect(
  process.env.MONGO_URI,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    if (!err) {
      console.log("MongoDB connected");
    }
  }
);

//setting up for production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
module.exports = app;

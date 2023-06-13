require("dotenv").config();
const PORT = process.env.PORT || 5000;
const express = require("express");

const usersRoutes = require("./routes/users.js");
const loginsRoutes = require("./routes/logins.js");
const outputsRoutes = require("./routes/outputs.js");

const middlewareLogRequest = require("./middleware/logs.js");

const app = express();

app.use(middlewareLogRequest);
app.use(express.json());

app.use("/users", usersRoutes);
app.use("/logins", loginsRoutes);
app.use("/outputs", outputsRoutes);

app.get("/beranda", (req, res) => {
  res.send("Selamat Datang di Aplikasi Animal_Recognition");
});

app.listen(PORT, () => {
  console.log(`Server berhasil di running di port ${PORT}`);
});

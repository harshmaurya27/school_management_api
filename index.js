const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const addSchool = require("./routes/addSchool");
const listSchools = require("./routes/listSchools");

const app = express();
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("This is only for the testing");
});

app.use("/", addSchool);
app.use("/", listSchools);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

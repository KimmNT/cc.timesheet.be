require("dotenv").config();
const express = require("express");
const cors = require("cors");
const customerRoutes = require("./routes/customerRoutes");
const staffRoutes = require("./routes/staffRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/staffs", staffRoutes);
app.use("/customers", customerRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

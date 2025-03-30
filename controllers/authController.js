const { db } = require("../config/firebase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const staffsCollection = db.collection("staffs");
const SECRET_KEY = process.env.SECRET_KEY_FOR_AUTH || "";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email and password are required" });
    }

    // Query Firestore to find staff by email
    const staffQuery = await staffsCollection.where("email", "==", email).get();

    if (staffQuery.empty) {
      return res.status(404).json({ success: false, error: "Staff not found" });
    }

    const staffDoc = staffQuery.docs[0]; // Get first matching document
    const staffData = staffDoc.data();

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, staffData.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: staffDoc.id, email: staffData.email, role: staffData.role },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Return user info & token
    res.json({
      success: true,
      token,
      user: { id: staffDoc.id, email: staffData.email, role: staffData.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { login };

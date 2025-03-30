const { db } = require("../config/firebase");
const bcrypt = require("bcrypt");

const staffsCollection = db.collection("staffs");

// GET ALL STAFFS
const getAllStaff = async (req, res) => {
  try {
    const snapshot = await staffsCollection.get();
    const staffs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(staffs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff list", error });
  }
};

// GET STAFF BY ID
const getStaffByID = async (req, res) => {
  try {
    const { id } = req.params;
    const staffDoc = await staffsCollection.doc(id).get();

    if (!staffDoc.exists) {
      return res.status(404).json({ success: false, error: "Staff not found" });
    }

    res.json({ success: true, id: staffDoc.id, ...staffDoc.data() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// CREATE STAFF
const createNewStaff = async (req, res) => {
  try {
    const { role, bank, contact, email, name, password, salary, team } =
      req.body;

    if (!name || !email || !role || !password || !salary || !team) {
      return res
        .status(400)
        .json({ error: "Please enter all required information" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaffData = {
      name,
      email,
      role,
      bank: bank || "",
      contact: contact || "",
      password: hashedPassword,
      salary,
      team,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await staffsCollection.add(newStaffData);

    res
      .status(201)
      .json({ success: true, id: docRef.id, response: newStaffData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE STAFF
const updateStaffByID = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, bank, contact, email, name, salary, team } = req.body;

    const staffDoc = await staffsCollection.doc(id).get();
    if (!staffDoc.exists) {
      return res.status(404).json({ success: false, error: "Staff not found" });
    }

    const updatedData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
      ...(bank && { bank }),
      ...(contact && { contact }),
      ...(salary !== undefined && { salary }),
      ...(team && { team }),
      updatedAt: new Date().toISOString(),
    };

    await staffsCollection.doc(id).update(updatedData);

    res.json({ success: true, id, updatedData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE STAFF
const deleteStaffByID = async (req, res) => {
  try {
    const { id } = req.params;

    const staffDoc = await staffsCollection.doc(id).get();
    if (!staffDoc.exists) {
      return res.status(404).json({ success: false, error: "Staff not found" });
    }

    await staffsCollection.doc(id).delete();

    res.json({ success: true, message: `Staff ${id} deleted successfully` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllStaff,
  getStaffByID,
  createNewStaff,
  updateStaffByID,
  deleteStaffByID,
};

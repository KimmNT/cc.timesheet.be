import pool from "../config/db.js";

// 🔹 Get all customers
export const getCustomers = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute("SELECT * FROM customer");
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error("Database query failed:", err);
    res.status(500).json({ error: "Database query failed" });
  }
};

// 🔹 Get a single customer by ID
export const getCustomerById = async (req, res) => {
  const { customer_id } = req.params;
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(
      "SELECT * FROM customer WHERE customer_id=?",
      [customer_id]
    );
    conn.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching customer:", err);
    res.status(500).json({ error: "Error fetching customer" });
  }
};

// 🔹 Create a new customer
export const createCustomer = async (req, res) => {
  const { customer_id, name, email, phone, address, created_invoice_count } =
    req.body;
  const created_at = new Date().toISOString(); // Set current timestamp

  try {
    const conn = await pool.getConnection();
    const [result] = await conn.execute(
      "INSERT INTO customer (name, email, phone, address, created_invoice_count) VALUES ( ?, ?, ?, ?, ?)",
      [name, email, phone, address || null, created_invoice_count || 0]
    );
    conn.release();

    res.status(201).json({ message: "Customer created", id: customer_id });
  } catch (err) {
    console.error("Error creating customer:", err);
    res.status(500).json({ error: "Error creating customer" });
  }
};

// 🔹 Update a customer by ID
export const updateCustomer = async (req, res) => {
  const { customer_id } = req.params;
  const { name, email, phone, address, created_invoice_count } = req.body;

  try {
    const conn = await pool.getConnection();
    const [result] = await conn.execute(
      `UPDATE customer 
       SET name=?, email=?, phone=?, address=?, created_invoice_count=? 
       WHERE customer_id=?`,
      [name, email, phone, address || null, created_invoice_count, customer_id]
    );
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ message: "Customer updated successfully" });
  } catch (err) {
    console.error("Error updating customer:", err);
    res.status(500).json({ error: "Error updating customer" });
  }
};

// 🔹 Delete a customer by ID
export const deleteCustomer = async (req, res) => {
  const { customer_id } = req.params;
  try {
    const conn = await pool.getConnection();
    const [result] = await conn.execute(
      "DELETE FROM customer WHERE customer_id=?",
      [customer_id]
    );
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({ message: "Customer deleted" });
  } catch (err) {
    console.error("Error deleting customer:", err);
    res.status(500).json({ error: "Error deleting customer" });
  }
};

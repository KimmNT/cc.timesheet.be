import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Customer = sequelize.define(
  "Customer",
  {
    customer_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Auto-generate UUIDs
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true, // Ensure valid email format
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true, // Address can be null
    },
    created_invoice_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // Default value for invoice count
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Set current timestamp
    },
  },
  {
    tableName: "customer",
    timestamps: false, // Disable Sequelize timestamps (use `created_at` instead)
  }
);

export default Customer;

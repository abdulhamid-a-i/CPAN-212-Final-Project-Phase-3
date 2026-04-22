import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import { Role } from "../models/Role.js";
import { ROLES } from "../constants/roles.js";
import { Cart } from "../models/Cart.js";
import { Checkout } from "../models/Checkout.js";

const roles = [
  {
    name: ROLES.CUSTOMER
  },

  {
    name: ROLES.EMPLOYEE
  },
  {
    name: ROLES.MANAGER
  },

  {
    name: ROLES.ADMIN
  }
];

async function seedRoles() {
  try {
    await connectDatabase();

    await Role.deleteMany({});
      console.log("Clearing out old checkouts and Carts");
        await Checkout.deleteMany({});
        await Cart.deleteMany({});
    await Role.insertMany(roles);

    console.log("Roles seeded successfully.");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Failed to seed roles:", error);
    process.exit(1);
  }
}

seedRoles();
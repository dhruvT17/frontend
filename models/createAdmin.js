const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const Credentials = require("./models/Credentials");

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("MongoDB Connected");

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new Credentials({
      username: "admin",
      password: hashedPassword,
      role: "Admin",
      is_online: false,
      status: { is_active: true, suspended: false }
    });

    await admin.save();
    console.log("Admin user created successfully");
    mongoose.connection.close();
  })
  .catch(err => console.error("MongoDB Connection Error:", err));

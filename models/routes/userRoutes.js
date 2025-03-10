
const express = require("express");
const {
  getAllUsers,
  getUserById,
  createUser,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/", verifyToken, isAdmin, getAllUsers);
router.get("/:id", verifyToken, getUserById);
router.post("/create", verifyToken, isAdmin, createUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, isAdmin, deleteUser);

module.exports = router;








// const express = require("express");
// const { createUser, getUsers } = require("../controllers/userController");
// const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");

// const router = express.Router();

// router.post("/create", authenticateUser, authorizeRoles("Admin"), createUser);
// router.get("/", authenticateUser, authorizeRoles("Admin"), getUsers);

// module.exports = router;

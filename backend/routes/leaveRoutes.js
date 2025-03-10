// const express = require('express');
// const router = express.Router();
// const { applyLeave, getLeaves } = require('../controllers/leaveController');

// router.post('/', applyLeave);
// router.get('/:userId', getLeaves);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getAllLeaves,
  createLeave,
  updateLeave,
  deleteLeave,
} = require("../controllers/leaveController");

// ✅ Apply for leave
router.post("/", createLeave);

// ✅ Get all leave requests
router.get("/", getAllLeaves);

// ✅ Update leave request (by leave ID)
router.put("/:id", updateLeave);

// ✅ Delete leave request (by leave ID)
router.delete("/:id", deleteLeave);

module.exports = router;

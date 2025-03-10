

const Leave = require("../models/Leave");

// ✅ Get all leave requests
exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find(); // Fetch leave requests without populating references
    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({ success: false, message: "Failed to fetch leave requests" });
  }
};

// ✅ Create a new leave request
exports.createLeave = async (req, res) => {
  try {
    const leave = new Leave(req.body);
    await leave.save();
    res.status(201).json({ success: true, message: "Leave request submitted", data: leave });
  } catch (error) {
    console.error("Error submitting leave request:", error);
    res.status(400).json({ success: false, message: "Failed to submit leave request" });
  }
};

// ✅ Update an existing leave request
exports.updateLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!leave) return res.status(404).json({ success: false, message: "Leave request not found" });

    res.status(200).json({ success: true, message: "Leave request updated", data: leave });
  } catch (error) {
    console.error("Error updating leave request:", error);
    res.status(400).json({ success: false, message: "Failed to update leave request" });
  }
};

// ✅ Delete a leave request
exports.deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) return res.status(404).json({ success: false, message: "Leave request not found" });

    res.status(200).json({ success: true, message: "Leave request deleted successfully" });
  } catch (error) {
    console.error("Error deleting leave request:", error);
    res.status(500).json({ success: false, message: "Failed to delete leave request" });
  }
};


// const Leave = require('../models/Leave');

// // Get leave records for a user
// exports.getLeaves = async (req, res) => {
//   try {
//     const leaves = await Leave.find({ user_id: req.params.userId });
//     res.status(200).json(leaves);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Apply for leave
// exports.applyLeave = async (req, res) => {
//   try {
//     const leave = new Leave(req.body);
//     await leave.save();
//     res.status(201).json(leave);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

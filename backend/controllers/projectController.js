
const Project = require("../models/Project");

// ✅ Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find(); // Fetch projects without populating references
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ success: false, message: "Failed to fetch projects" });
  }
};

// ✅ Create a new project
exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ success: true, message: "Project created successfully", data: project });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(400).json({ success: false, message: "Failed to create project" });
  }
};

// ✅ Update an existing project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    res.status(200).json({ success: true, message: "Project updated successfully", data: project });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(400).json({ success: false, message: "Failed to update project" });
  }
};

// ✅ Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    res.status(200).json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ success: false, message: "Failed to delete project" });
  }
};




// const Project = require('../models/Project');

// // Get all projects
// exports.getAllProjects = async (req, res) => {
//   try {
//     const projects = await Project.find().populate('client_id').populate('kanban.epics.tasks.task_id');
//     res.status(200).json(projects);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Create a new project
// exports.createProject = async (req, res) => {
//   try {
//     const project = new Project(req.body);
//     await project.save();
//     res.status(201).json(project);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Update a project
// exports.updateProject = async (req, res) => {
//   try {
//     const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.status(200).json(updatedProject);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Delete a project
// exports.deleteProject = async (req, res) => {
//   try {
//     await Project.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Project deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
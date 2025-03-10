
const Client = require('../models/Client');

// Get all clients
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().populate('projects');
    res.status(200).json({
      success: true,
      message: "Clients fetched successfully",
      data: clients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching clients",
      error: error.message
    });
  }
};

// Create a new client
exports.createClient = async (req, res) => {
  try {
    const { client_name, client_contact } = req.body;
    
    if (!client_name || !client_contact?.phone || !client_contact?.email) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: client_name, phone, or email."
      });
    }

    const client = new Client(req.body);
    await client.save();
    res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: client
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating client",
      error: error.message
    });
  }
};

// Update a client
exports.updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedClient) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: updatedClient
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating client",
      error: error.message
    });
  }
};

// Delete a client
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Client deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting client",
      error: error.message
    });
  }
};

// const Client = require('../models/Client');

// // Get all clients
// exports.getAllClients = async (req, res) => {
//   try {
//     const clients = await Client.find().populate('projects');
//     res.status(200).json(clients);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Create a new client
// exports.createClient = async (req, res) => {
//   try {
//     const client = new Client(req.body);
//     await client.save();
//     res.status(201).json(client);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Update a client
// exports.updateClient = async (req, res) => {
//   try {
//     const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.status(200).json(updatedClient);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Delete a client
// exports.deleteClient = async (req, res) => {
//   try {
//     await Client.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Client deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

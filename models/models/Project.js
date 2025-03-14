const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  project_details: {
    name: { type: String, required: true },
    description: { type: String },
    start_date: { type: Date },
    end_date: { type: Date },
    status: { type: String },
    priority: { type: String },
    progress: { type: Number },
    additional_fields: { type: Map, of: String }
  },
  kanban: {
    epics: [{
      name: { type: String },
      team_lead_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      team_members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      technologies: [{
        name: { type: String },
        version: { type: String },
        type: { type: String }
      }],
      start_date: { type: Date },
      end_date: { type: Date },
      tasks: [{ task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' } }],
      status: { type: String }
    }]
  },
  project_leads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attachments: [{
    file_name: { type: String },
    file_url: { type: String },
    uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    upload_date: { type: Date }
  }],
  additional_fields: { type: Map, of: String }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);

const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  from_date: { type: Date, required: true },
  to_date: { type: Date, required: true },
  leave_type: { type: String },
  reason: { type: String },
  status: { type: String },
  date_of_request: { type: Date },
  admin_remarks: { type: String },
  status_updated_at: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Leave', LeaveSchema);

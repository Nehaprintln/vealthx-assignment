const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  claimType: String,
  policyNumber: String,
  claimAmount: Number,
  incidentDate: Date,
  description: String,
  email: String,
  alternameEmaile: String,
  phone: String,
  filePath: String,
});

module.exports = mongoose.model("Claim", claimSchema);

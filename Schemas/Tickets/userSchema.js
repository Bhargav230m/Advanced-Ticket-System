const { model, Schema } = require("mongoose");
const userTicketOptions = new Schema({
  guildId: String, 
  ticketId: String,
  claimed: Boolean,
  claimer: String,
  closed: Boolean,
  closer: String,
  creatorId: String,
});

module.exports = model("userTickets", userTicketOptions, "userTicketSchema");
const { Schema, model } = require("mongoose");
const ticketOptionsSchema = new Schema({
 Guild: String,
 TranscriptLogChannel: String,
 CategoryID: String,
 SupportID: String,
 TicketDescription: String,
 Types: Array
});

module.exports = model("ticketSchema", ticketOptionsSchema);
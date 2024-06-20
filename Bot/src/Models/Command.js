const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let command = new Schema({
    serverID: { type: String },
    perms: { type: Array, default: [] },
})

module.exports = mongoose.model("tk-command", command)
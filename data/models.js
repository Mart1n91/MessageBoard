const mongoose = require('mongoose');

let replySchema = new mongoose.Schema({
    text: {type: String, required: true},
    delete_password: {type: String, required: true},
    createdon_ : {type: Date, required: true},
    reported: {type: Boolean, required: true}
})

let threadSchema = new mongoose.Schema({
    text: {type: String, required: true},
    delete_password: {type: String, required: true},
    board: {type: String, required: true},
    createdon_: {type: Date, required: true},
    bumpedon_: {type: Date, required: true},
    reported: {type: Boolean, required: true},
    replies: [replySchema]
})

// Stringen er modelnavnet og bliver collection navn i mongoDB
let reply = mongoose.model('reply', replySchema);
let thread = mongoose.model('thread', threadSchema);

module.exports ={reply, thread}


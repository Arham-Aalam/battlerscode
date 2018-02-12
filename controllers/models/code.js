const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
var codeSchema = new Schema({
    creator : { type : Schema.Types.ObjectId, ref : 'User' },
    content : String,
    created : { type : String, default : utc }
});

module.exports = mongoose.model('Code', codeSchema);

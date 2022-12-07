// load mongoose since we need it to define a model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
UserSchema = new Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    apiKey: { type: String }
});
module.exports = mongoose.model('User', UserSchema);

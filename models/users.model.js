const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

/**
 * User schema
 */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: 'User name is required',
    minlength: [5, 'The value of path `{PATH}` (`{VALUE}`) is shorter than the minimum allowed length ({MINLENGTH})'],
    validate: [validateUsername, 'Please supply a valid user name'],
  },
    email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please supply a valid email address']
  }
  }, { timestamps: true });

function validateUsername(username) {
  // we just require the user name begins with a letter (only for demomstration purposes ...)
  var re = /^[A-Z,a-z].*$/;
  return re.test(username);
}

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * List users in ascending order of 'username'
   */
  list({ skip = "0", limit = "0" } = {}) {
    return this.find()
      .sort({ username: 1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .exec();
  }
};

module.exports = mongoose.model('User', UserSchema);
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name:String,
  email:String,
  password:String,
  isActive: {
    type: Boolean,
    default: true,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
}, { timestamps: true });

const User = mongoose.model("User",userSchema);

export default User;
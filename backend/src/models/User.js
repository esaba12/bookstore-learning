import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
    unique: true
  },
  email:{
    type: String, 
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlegnth: 8
  },
  profileImage: {
    type: String,
    default:""
  }
}, { timestamps: true });

// hash pwd before saving user to db
userSchema.pre("save", async function(next){

  // don't hash password if password isnt being updated
  if(!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// compare password func
userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password) 

}

const User = mongoose.model("User", userSchema);

export default User;
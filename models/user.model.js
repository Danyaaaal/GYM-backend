import { Schema, model } from "mongoose";

// username and password

const userSchema = new Schema({
  username: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  role: {
    type: String,
    enum: ["user", "admin", "trainer"],
    default: "user",
  },
}, { timestamps: true });

const User = model("user", userSchema);

export default User;

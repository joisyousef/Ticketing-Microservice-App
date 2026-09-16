import mongoose from "mongoose";

// An interface that describes the properties
// that are required to create a new user
interface UserAtters {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.build = (atters: UserAtters) => {
  return new User(atters);
};

const User = mongoose.model("User", userSchema);

const buildUser = (atters: UserAtters) => {
  return new User(atters);
};

export { User, buildUser };

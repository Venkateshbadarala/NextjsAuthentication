import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Anonymous',
      minlength: 5,
      maxlength: 100,
      required: [true, 'Name must be provided'],
    },
    email: {
      type: String,
      match: /.+\@.+\..+/,
      unique: true,
      minlength: 5,
      maxlength: 100,
      required: [true, 'Email must be provided'],
    },
    password: {
      type: String,
      minlength: 5,
      required: [true, 'Password must be provided'],
    },
    uid: {
      type: String,
      unique: true,
    },
    roles: {
      type: [Number],
      default: [],
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
    softDelete: {
      type: Boolean,
      default: false,
    },
    LastLoginAt: {
      type: Date,
      default: Date.now,
    },
    refreshToken: {
      type: String,
    },
    sAccessToken: {
      type: String,
    },
    issueAt: {
      type: Number,
      default: 101010,
    },
    occupation: {
      type: String,
    },
    deleteAt: {
      type: String,
    },
    provider: {
      type: String,
    },
    image: {
      type: String,
    },
    bio: {
      type: String,
    },
    LastLoginIp: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordTokenExpiry: {
      type: String,
    },
    verifyToken: {
      type: String,
    },
    verifyTokenExpiry: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;

import mongoose, { Document, Model, Schema } from 'mongoose';

// Shape of a User document (what exists in the DB)
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Shape returned to API consumers — password is never included
export interface IUserPublic {
  id: string;
  name: string;
  email: string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true, // normalize on write
      trim: true,
    },
    // select: false ensures password is NEVER returned unless explicitly requested
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Returns a safe public representation of the user (no password).
 * Use this whenever you need to send user data to a client.
 */
userSchema.methods.toPublic = function (): IUserPublic {
  return {
    id: (this._id as mongoose.Types.ObjectId).toString(),
    name: this.name as string,
    email: this.email as string,
  };
};

export interface IUserMethods {
  toPublic(): IUserPublic;
}

export type UserModel = Model<IUser, object, IUserMethods>;

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;

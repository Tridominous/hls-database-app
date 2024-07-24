import { Schema, models, model, Document} from 'mongoose';


// Define the main IUser interface
export interface IUser extends Document {
   clerkId: string;
   name: string;
   username: string;
   email: string;
   password?: string;
   bio?: string;
   picture?: string;
   role?: string;
   createdAt: Date;
   saved: Schema.Types.ObjectId[];
   joinedAt: Date;
}



// Define the UserSchema
const UserSchema: Schema = new Schema({
    clerkId: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, },
    email: { type: String, required: true, },
    password: { type: String },
    bio: { type: String },
    picture: { type: String},
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now },
    saved: [{ type: Schema.Types.ObjectId, ref: 'EquipmentCard', max: 1000 }],
    joinedAt: { type: Date, default: Date.now }
});



// Create the EquipmentCard model
const User = models.User || model('User', UserSchema);


export default User;
  
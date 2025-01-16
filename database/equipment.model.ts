import { Schema, models, model, Document, Types} from 'mongoose';



// Define the Subunit interface
export interface ISubunit {
  title: string;
  brandname?: string;
  modelname?: string;
  serialNumber?: string;
  assetTag?: string;
  serviceDate?: Date;
}

// Define the main EquipmentCard interface
export interface IEquipmentCard extends Document {
    title: string;
    brandname?: string;
    modelname?: string;
    serialNumber?: string;
    assetTag?: string;
    subunits?: ISubunit[]; // Array of Subunit IDs
    labNumber?: string;
    labName?: string;
    team: string;
    serviceDate?: Date;
    comment?: string;
    tag: Schema.Types.ObjectId | string;
    imgUrl: string;
  author: Schema.Types.ObjectId | string;
  views: number;
  createdAt: Date;
}

// Define the Subunit schema
const SubunitSchema: Schema = new Schema({
  title: { type: String, required: true, minlength: 2, maxlength: 100 },
  brandname: { type: String, minlength: 2, maxlength: 100 },
  modelname: { type: String, minlength: 2, maxlength: 100 },
  serialNumber: { type: String, minlength: 2, maxlength: 25 },
  assetTag: { type: String, minlength: 2, maxlength: 25 },
  serviceDate: { type: Date }
});

// Define the EquipmentCard schema
const EquipmentCardSchema: Schema = new Schema({
  imgUrl: { type: String, required: true },
  title: { type: String, required: true, minlength: 2, maxlength: 100 },
  brandname: { type: String, minlength: 2, maxlength: 100},
  modelname: { type: String, minlength: 2, maxlength: 100},
  serialNumber: { type: String, minlength: 2, maxlength: 25  },
  assetTag: { type: String, minlength: 2, maxlength: 25},
  subunits: [SubunitSchema],
  labNumber: { type: String, minlength: 2, maxlength: 100 },
  labName: { type: String, minlength: 2, maxlength: 100 },
  team: { type: String, required: true, minlength: 2, maxlength: 25 },
  serviceDate: { type: Date },
  comment: { type: String, minlength: 2, maxlength: 150},
  tag: { type: Schema.Types.ObjectId, ref: 'Tag' },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Create the EquipmentCard model
const EquipmentCard = models.EquipmentCard || model('EquipmentCard', EquipmentCardSchema)

export default EquipmentCard;

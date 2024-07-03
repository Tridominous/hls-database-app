import { Schema, models, model, Document} from 'mongoose';

export interface ITag extends Document {
    name: string;
    description: string;
    Equipment: Schema.Types.ObjectId[];
    createdAt: Date;
}

const TagSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    Equipment: [{ type: Schema.Types.ObjectId, ref: 'Equipment' }],
    createdAt: { type: Date, default: Date.now }
})

const Tag = models.tag || model('Tag', TagSchema);

export default Tag;
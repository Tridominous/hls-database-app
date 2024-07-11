import { Schema, models, model, Document} from 'mongoose';

export interface ITag extends Document {
    name: {type: string, required: true};
    Equipment: Schema.Types.ObjectId[];
    createdAt: Date;
}

const TagSchema: Schema = new Schema({
    name: { type: String, required: true},
    Equipment: [{ type: Schema.Types.ObjectId, ref: 'EquipmentCard', max: 1000 }],
    createdAt: { type: Date, default: Date.now }
})

const Tag = models.Tag || model('Tag', TagSchema);

export default Tag;
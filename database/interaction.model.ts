import { Schema, models, model, Document} from 'mongoose';

export interface IInteraction extends Document {
    user: Schema.Types.ObjectId;
    action: string;
    equipment: Schema.Types.ObjectId;
    tags: Schema.Types.ObjectId[];
    createdAt: Date;
}

const InteractionSchema: Schema = new Schema({
   user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
   action: {type: String, required: true},
   equipment: {type: Schema.Types.ObjectId, ref: 'EquipmentCard'},
   tags: [{type: Schema.Types.ObjectId, ref: 'Tag'}],
   createdAt: {type: Date, default: Date.now}

})

const Interaction = models.Interaction || model('Interaction', InteractionSchema);

export default Interaction;
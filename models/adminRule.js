import { Schema, model } from "mongoose";

const rulesSchema = new Schema({
    rulesName: {
        type: String,
        required: true,
     
      },
      description: {
        type: String,
        required: true
      },
      image: {
        type: String,
      },
    }, { timestamps: true });

const Rules = model("Rules", rulesSchema);

export default Rules;

import { Schema, model } from "mongoose";

const exerciseSchema = new Schema({
    exercise: {
        type: String,
        required: true,
        unique: true
      },
      description: {
        type: String,
        required: true
      },
    }, { timestamps: true });

const Exercise = model("Exercise", exerciseSchema);

export default Exercise;
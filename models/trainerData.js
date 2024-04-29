import { Schema, model } from "mongoose";

const dataSchema = new Schema({
    dataName: {
        type: String,
        required: true,
        unique: true
      },
      description: {
        type: String,
        required: true
      },
      image: {
        type: String,
      },
    }, { timestamps: true });

const Data = model("Data", dataSchema);

export default Data;
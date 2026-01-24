import mongoose, { mongo } from "mongoose";

const chatHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },

    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },

        content: {
          type: String,
          required: true,
        },

        relevantChunks: {
          type: [Number],
          default: [],
        }
      },
    ],
  },
  { timestamps: true }
);

//index for faster queries 

chatHistorySchema.index({userId: 1, document: 1});

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

export default mongoose.model("ChatHistory", chatHistorySchema);

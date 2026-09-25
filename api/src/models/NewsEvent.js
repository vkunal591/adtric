import mongoose from "mongoose";

const newsEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    category: {
      type: String,
      enum: ["News", "Event", "Achievement"],
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    image: {
      type: String,
      default: null
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true
    },

    content: {
      type: String,
      required: true
    },

    published: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

newsEventSchema.index({ published: 1, date: -1, createdAt: -1 });

const NewsEvent = mongoose.model("NewsEvent", newsEventSchema);

export default NewsEvent;

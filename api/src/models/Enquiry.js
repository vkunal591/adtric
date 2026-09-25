import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    parentName: {
      type: String,
      required: true,
      trim: true
    },

    studentName: {
      type: String,
      required: true,
      trim: true
    },

    classApplyingFor: {
      type: String,
      required: true,
      trim: true
    },

    mobile: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null
    },

    message: {
      type: String,
      trim: true,
      default: null
    },

    status: {
      type: String,
      enum: ["New", "Contacted", "Closed"],
      default: "New"
    },

    crmStatus: {
      type: String,
      enum: ["Sent", "Failed"],
      default: null
    },

    crmResponse: {
      type: String,
      default: null
    },

    crmSentAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

enquirySchema.index({ mobile: 1, classApplyingFor: 1, createdAt: -1 });

const Enquiry = mongoose.model("Enquiry", enquirySchema);

export default Enquiry;

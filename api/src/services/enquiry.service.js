import Enquiry from "../models/Enquiry.js";
import { sendEnquiryToCRM } from "./crm.service.js";

export const createEnquiry = async (enquiryData) => {
  try {
    const enquiry = new Enquiry(enquiryData);
    await enquiry.save();

    const crmResponse = await sendEnquiryToCRM(enquiry);

    enquiry.crmStatus = crmResponse.status;
    enquiry.crmResponse = crmResponse.response;
    enquiry.crmSentAt = crmResponse.status === "Sent" ? new Date() : null;
    await enquiry.save();

    return { enquiry, crmResponse };
  } catch (error) {
    console.error("Error creating enquiry:", error);
    throw error;
  }
};



export const getAllEnquiries = async ({ page = 1, limit = 20, status } = {}) => {
  try {
    const safePage = Math.max(Number(page) || 1, 1);
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const skip = (safePage - 1) * safeLimit;
    const filter = status ? { status } : {};

    const [items, total] = await Promise.all([
      Enquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      Enquiry.countDocuments(filter)
    ]);

    return {
      data: items,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit)
      }
    };
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    throw error;
  }
};



export const getEnquiryById = async (id) => {
  try {
    const item = await Enquiry.findById(id).lean();
    return item;
  } catch (error) {
    console.error("Error fetching enquiry by id:", error);
    throw error;
  }
};

export const deleteEnquiryById = async (id) => {
  try {
    const item = await Enquiry.findByIdAndDelete(id).lean();
    return item;
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    throw error;
  }
};

export const updateEnquiryStatus = async (id, status) => {
  try {
    const item = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).lean();

    return item;
  } catch (error) {
    console.error("Error updating enquiry status:", error);
    throw error;
  }
};







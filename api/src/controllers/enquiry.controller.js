import Enquiry from "../models/Enquiry.js";
import { pushToCRM } from "../utils/crm.js";

export const createEnquiry = async (req, res, next) => {
  try {
    const {
      parentName,
      studentName,
      classApplyingFor,
      mobile,
      email,
      message
    } = req.body;

    const now = new Date();
    const twentyFourHoursAgo = new Date(
      now.getTime() - 24 * 60 * 60 * 1000
    );

    const duplicate = await Enquiry.findOne({
      mobile,
      classApplyingFor,
      createdAt: {
        $gte: twentyFourHoursAgo,
        $lte: now
      }
    });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "We have already received your enquiry."
      });
    }

    const enquiry = await Enquiry.create({
      parentName,
      studentName,
      classApplyingFor,
      mobile,
      email: email || null,
      message: message || null
    });

    const crmResult = await pushToCRM(enquiry);

    enquiry.crmStatus = crmResult.status;
    enquiry.crmResponse = crmResult.response;
    enquiry.crmSentAt =
      crmResult.status === "Sent"
        ? new Date()
        : null;

    await enquiry.save();

    return res.status(201).json({
      success: true,
      message: "Your enquiry has been submitted successfully."
    });
  } catch (error) {
    next(error);
  }
};

export const sendEnquiryToCRM = async (enquiry) => {
  const webhookUrl = process.env.CRM_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      status: "Failed",
      response: "CRM_WEBHOOK_URL is not configured."
    };
  }

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  try {
    const payload = {
      enquiryId: enquiry._id.toString(),
      parentName: enquiry.parentName,
      studentName: enquiry.studentName,
      classApplyingFor: enquiry.classApplyingFor,
      mobile: enquiry.mobile,
      email: enquiry.email || null,
      message: enquiry.message || null,
      status: enquiry.status,
      createdAt: enquiry.createdAt
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!response.ok) {
      return {
        status: "Failed",
        response: `CRM returned HTTP ${response.status}`
      };
    }

    return {
      status: "Sent",
      response: `CRM returned HTTP ${response.status}`
    };
  } catch (error) {
    if (error.name === "AbortError") {
      return {
        status: "Failed",
        response: "CRM request timed out after 5 seconds."
      };
    }

    return {
      status: "Failed",
      response: error.message || "CRM request failed."
    };
  } finally {
    clearTimeout(timeout);
  }
};

export const pushToCRM = async (enquiry) => {
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
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        enquiryId: enquiry._id.toString(),
        parentName: enquiry.parentName,
        studentName: enquiry.studentName,
        classApplyingFor: enquiry.classApplyingFor,
        mobile: enquiry.mobile,
        email: enquiry.email || null,
        message: enquiry.message || null,
        status: enquiry.status,
        createdAt: enquiry.createdAt
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(
        `CRM returned status ${response.status}`
      );
    }

    return {
      status: "Sent",
      response: `CRM returned HTTP ${response.status}`
    };
  } catch (error) {
    return {
      status: "Failed",
      response: error.name === "AbortError"
        ? "CRM request timed out."
        : error.message
    };
  } finally {
    clearTimeout(timeout);
  }
};

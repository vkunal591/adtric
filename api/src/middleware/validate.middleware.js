import fs from "node:fs/promises";

const validate = (schema) => {
  return (req, res, next) => {
    const body = { ...req.body };

    if (req.file && body.image === undefined) {
      body.image = {
        originalname: req.file.originalname,
        size: req.file.size
      };
    }

    const result = schema.safeParse(body);

    if (!result.success) {
      if (req.file?.path) {
        fs.unlink(req.file.path).catch(() => {});
      }

      const errors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (field) {
          errors[field] = issue.message;
        }
      });

      return res.status(400).json({
        success: false,
        errors
      });
    }

    req.body = result.data;

    next();
  };
};

export default validate;

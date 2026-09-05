// const validate = (schema) => (req, res, next) => {
//     const { error } = schema.validate(req.body, { abortEarly: false });

//     if (error) {
//         const messages = error.details.map((d) => d.message);
//         return res.status(400).json({
//             success: false,
//             message: "Validation failed",
//             errors: messages,
//         });
//     }
//     next();
// };

// module.exports = validate;


// middlewares/validate.middleware.js — updated

const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true, // silently removes any field not in the schema (like a sneaky "role")
    });

    if (error) {
        const messages = error.details.map((d) => d.message);
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: messages,
        });
    }

    req.body = value; // controller now only ever sees the cleaned, validated data
    next();
};

module.exports = validate;
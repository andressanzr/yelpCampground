const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});
const Joi = BaseJoi.extend(extension);

const CampgroundJoiSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().min(3).max(20).required().escapeHTML(),
    price: Joi.number().min(0).required(),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().allow("").escapeHTML(),
    image: Joi.array().allow(""),
    campId: Joi.string().allow("").escapeHTML(),
  }),
});
const ReviewJoiSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required().escapeHTML(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});
module.exports = { CampgroundJoiSchema, ReviewJoiSchema };

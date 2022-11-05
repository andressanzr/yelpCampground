const Joi = require("Joi");

const CampgroundJoiSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().min(3).max(20).required(),
    price: Joi.number().min(0).required(),
    location: Joi.string().required(),
    description: Joi.string().allow(""),
    image: Joi.string().allow(""),
    campId: Joi.string().allow(""),
  }),
});
const ReviewJoiSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});
module.exports = { CampgroundJoiSchema, ReviewJoiSchema };

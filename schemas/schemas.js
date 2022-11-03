const Joi = require("Joi");

const CampgroundJoiSchema = Joi.object({
  title: Joi.string().min(3).max(20).required(),
  price: Joi.number().required().min(0),
  location: Joi.string().required(),
  description: Joi.string(),
  image: Joi.string(),
  campId: Joi.string(),
});
module.exports = CampgroundJoiSchema;

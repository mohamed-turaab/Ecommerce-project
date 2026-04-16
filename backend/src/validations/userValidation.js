const Joi = require('joi');

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80),
  phone: Joi.string().trim().allow(''),
  address: Joi.object({
    street: Joi.string().trim().allow(''),
    city: Joi.string().trim().allow(''),
    country: Joi.string().trim().allow(''),
    postalCode: Joi.string().trim().allow(''),
  }),
});

module.exports = { updateProfileSchema };

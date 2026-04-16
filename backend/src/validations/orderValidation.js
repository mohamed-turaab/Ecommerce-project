const Joi = require('joi');

const createOrderSchema = Joi.object({
  shippingAddress: Joi.object({
    street: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    postalCode: Joi.string().trim().allow(''),
  }).required(),
  paymentMethod: Joi.string()
    .valid('card', 'paypal', 'cash_on_delivery')
    .required(),
});

module.exports = { createOrderSchema };

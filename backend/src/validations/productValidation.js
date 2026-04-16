const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().trim().min(10).required(),
  price: Joi.number().min(0).required(),
  discountPrice: Joi.number().min(0),
  category: Joi.string().trim().required(),
  brand: Joi.string().trim().allow(''),
  countInStock: Joi.number().integer().min(0).required(),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().uri().required(),
      publicId: Joi.string().allow(''),
    })
  ),
});

const updateProductSchema = productSchema.fork(
  ['name', 'description', 'price', 'category', 'countInStock'],
  (schema) => schema.optional()
);

const reviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().trim().max(1000).allow(''),
});

module.exports = { productSchema, updateProductSchema, reviewSchema };

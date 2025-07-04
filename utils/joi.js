const Joi = require('joi');

const postJoiSchema = Joi.object({
    username: Joi.string().required().trim(),
    title: Joi.string().required().trim().min(3).max(100),
    content: Joi.string().required().min(10),
});

module.exports = postJoiSchema;

const userJoiSchema = Joi.object({
    username: Joi.string().required().trim().min(3).max(15),
    email : Joi.string().required().max(20),
    password : Joi.string().required().min(4).max(15),
})

module.exports = userJoiSchema;

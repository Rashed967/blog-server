import Joi from 'joi'
import User from './user.interface'
import { join } from 'path'

export const userJoiValidationSchema = Joi.object<User>({
    id: Joi.string().required().messages({
        'string.empty': 'id field cannot be empty',
        'any.required': 'id field is required',
    }),
    name: Joi.string().required().messages({
        'string.empty': 'name field cannot be empty',
        'any.required': 'name field is required',
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'email field cannot be empty',
        'any.required': 'email field is required',
        'string.email': 'Valid email is required',
    }),
    imageUrl: Joi.string().uri().messages({
        'string.uri' : "valid url needed"
    }),
    password: Joi.string().required().min(12).messages({
        'string.empty': 'password field cannot be empty',
        'any.required': 'password field is required',
        'string.min': 'valid password needs at least 12 character',
    }),
    role: Joi.string()
        .valid('admin', 'editor', 'author')
        .messages({
            'string.empty': 'Role field cannot be empty',
            'any.only': 'Role must be one of: admin, editor, author, user',
        }),
})

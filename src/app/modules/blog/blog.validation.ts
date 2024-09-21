import Joi from 'joi'

// Joi schema for validating BlogPost
const blogPostValidationSchema = Joi.object({
    id: Joi.string().uuid().required().messages({
        'string.uuid': 'ID must be a valid UUID string.',
        'any.required': 'ID is a required field.',
    }),

    title: Joi.string().min(3).max(255).required().messages({
        'string.empty': 'Title cannot be empty.',
        'string.min': 'Title should be at least 3 characters long.',
        'string.max': 'Title should not exceed 255 characters.',
        'any.required': 'Title is a required field.',
    }),

    authorId: Joi.string(),
    imageUrl: Joi.string().uri().required().messages({
        'string.uri': 'Image must be a valid URL.',
        'any.required': 'Image URL is a required field.',
    }),

    content: Joi.string().min(10).required().messages({
        'string.empty': 'Content cannot be empty.',
        'string.min': 'Content should be at least 10 characters long.',
        'any.required': 'Content is a required field.',
    }),

    tags: Joi.array().items(Joi.string()).required().messages({
        'array.base': 'Tags must be an array of strings.',
        'any.required': 'Tags is a required field.',
    }),

    categories: Joi.array().items(Joi.string()).messages({
        'array.base': 'Categories must be an array of strings.',
    }),

    status: Joi.string()
        .valid('pending', 'published', 'draft', 'scheduled')
        .default('draft')
        .required()
        .messages({
            'string.empty': 'status field cannot be empty',
            'any.only':
                'field must be on of [pending, published, draft , schedule]',
            'any.required': 'status is required',
        }),

    isDeleted: Joi.boolean().messages({
        'boolean.base': 'IsDeleted must be a boolean value.',
    }),
})

export default blogPostValidationSchema

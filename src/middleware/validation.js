import Joi from 'joi';
import { AppError } from './errorHandler.js';

// User registration validation schema
export const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Username must only contain alphanumeric characters',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username must not exceed 30 characters'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long'
    })
});

// User login validation schema
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  
  password: Joi.string()
    .required()
});

// Task creation/update validation schema
export const taskSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.min': 'Task title cannot be empty',
      'string.max': 'Task title must not exceed 200 characters'
    }),
  
  description: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Task description must not exceed 1000 characters'
    })
});

// Task update validation schema (all fields optional)
export const taskUpdateSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .messages({
      'string.min': 'Task title cannot be empty',
      'string.max': 'Task title must not exceed 200 characters'
    }),
  
  description: Joi.string()
    .max(1000)
    .allow('')
    .messages({
      'string.max': 'Task description must not exceed 1000 characters'
    }),
  
  completed: Joi.boolean()
});

// Validation middleware factory
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      return next(error);
    }
    
    next();
  };
};
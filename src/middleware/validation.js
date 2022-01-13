import { checkSchema } from "express-validator"

export const blogBodyValidator = checkSchema({
    category: {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'You must provide a category'
        }
    },
    title: {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'You must provide a title'
        }
    },
    cover: {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'You must provide a cover'
        }
    },
    'readTime.value': {
        in: ['body'],
        isInt: true,
        toInt: true,
        errorMessage: 'You must provide a value as a number'
    },
    'readTime.unit': {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'You must provide a value a unit'
        }
    },
    // 'author.name': {
    //     in: ['body'],
    //     isLength: {
    //         options: { min: 1 },
    //         errorMessage: 'You must provide a name'
    //     }
    // },
    // 'author.avatar': {
    //     in: ['body'],
    //     isLength: {
    //         options: { min: 1 },
    //         errorMessage: 'You must provide an avatar'
    //     }
    // },
    content: {
        in: ['body'],
        isLength: {
            options: { min: 1 },
            errorMessage: 'You must provide some content'
        }
    }
})
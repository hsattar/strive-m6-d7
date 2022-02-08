export const errorHandlers = (err, req, res, next) => {
    switch(err.name) {
        case 'ValidationError': 
        case 'BadRequestError': 
        case 'CastError': 
        case 'TypeError': 
        case 'ObjectParameterError': 
            res.status(400).send(err)
        case 'NotFoundError': 
            res.status(404).send(err)        
        default: 
            res.status(500).send('Server Error')
    }
}
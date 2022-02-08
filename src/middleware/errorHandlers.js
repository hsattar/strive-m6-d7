export const errorHandlers = (err, req, res, next) => {
    console.log('THE ERROR', err.name)
    switch(err.name) {
        case 'ValidationError': 
        case 'BadRequestError': 
            res.status(400).send(err)
        case 'UnauthorizedError': 
            res.status(401).send(err.message)
        case 'ForbiddenError': 
            res.status(403).send(err.message)
        case 'NotFoundError': 
            res.status(404).send(err)        
        default: 
            console.log(err);
            res.status(500).send('Server Error')
    }
}
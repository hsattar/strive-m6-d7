export const errorHandlers = (err, req, res, next) => {
    switch(err.name) {
        case 'ValidationError': 
            res.status(400).send(err)
            break
        case 'BadRequestError': 
            res.status(400).send(err)
            break
        case 'CastError': 
            res.status(400).send(err)
            break
        case 'TypeError': 
            res.status(400).send(err)
            break
        case 'NotFoundError': 
            res.status(404).send(err)        
            break
        default: 
            res.status(500).send('Server Error')
    }
}
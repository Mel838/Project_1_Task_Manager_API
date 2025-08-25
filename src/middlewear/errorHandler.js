// import {logger} from '../utils/logger.js'

// export class AppError extends Error{
//     constructor(message, statusCode, isOperational: true){
//         super(meassage)
//         this.statusCode = statusCode
//         this.isOperational = isOperational
//         this.status = `${statusCode}`.startsWith("4") ? 'fail :'error'

//         Error.captureStackTrace(this, this.constructor)
        
//     }

//     const errorHandler = (err, req, res, next) => {
//         let error = {
//             let error = {...err}
//             error.meassage


//             logger.error(`${req.method ${req.originalUrl} - ${err.message}`, {
//                 }})
//         }
//     }
// }
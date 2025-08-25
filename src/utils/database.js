// setup postgres

import {pool} from 'pg'
import {config} from "../config/env.js"

export const pool = new pool({
    user, host, db, port, max, idleTimeoutMillis, connectionTimeoutMillis
})

export const initializeDB = async () => {
    try {
        
    } catch (error) {
        logger.error("Error ooccured")
    }
}
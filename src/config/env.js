import dotenv from "dotenv"

dotenv.config()

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  logging: {
    level: process.env.LOG_LEVEL || "info"
  }
}
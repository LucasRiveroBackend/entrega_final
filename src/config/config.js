import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const SECRET = process.env.SECRET;
const CLIENTID = process.env.CLIENTID;
const CLIENTSECRET = process.env.CLIENTSECRET;
const CALLBACKURL = process.env.CALLBACKURL;
const ENVIRONMENT = process.env.NODE_ENV;

export const config = {
    server: {
        port: PORT,
        secret: SECRET
    },
    ambiente: {
        entorno: ENVIRONMENT
    },
    mongo: {
        url: MONGO_URL
    },
    github: {
      clientID: CLIENTID,
      clientSecret: CLIENTSECRET,
      callBackUrl: CALLBACKURL
    }
}
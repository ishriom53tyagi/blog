const jwt = require("jsonwebtoken");
const { TokenExpiredError } = jwt;
const config = require("../config.json")


async function generateToken ()  {

    try {
        const token = jwt.sign( { date : Date.now()} , config.encryption.jwt.jwt_token_secret, { expiresIn: config.encryption.jwt.jwt_expires_in } );
        console.log(token);
        return token
    }
    catch ( error) {
        console.log(error);
        throw error ;
    }
}

generateToken();
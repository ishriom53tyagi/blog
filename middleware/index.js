const jwt = require("jsonwebtoken");
const { TokenExpiredError } = jwt;
const config = require("../config.json")

const  verifyToken = async (req, res, next) => {

	let host = req.headers.host;
	host = host.split(':')[0];

	// if (host == 'localhost') {
	// 	return next();
	// }

	const token = req.headers['authorization']?.split(' ')[1];

	if (!token) {
		return res.status(403).send({
			success: false,
			error: "A token is required for authentication"
		});
	}

	try {

		const decoded = jwt.verify( token, config.encryption.jwt.jwt_token_secret );
        console.log(decoded);


	}
	catch (err) {

		if(err instanceof TokenExpiredError) {

            console.log( err  , "Error value is here ");

			return res.status(401).send({
				success: false,
				error: "Unauthorized! Access Token was expired!"
			});
		}

		return res.status(401).send({
			success: false,
			error: "Invalid Token"
		});
	}

	return next();
};



module.exports = { verifyToken };
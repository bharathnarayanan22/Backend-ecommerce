const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    //const token = req.header('Authorization').replace("Bearer", "");
    //or
    const token = req.header('Authorization').split(" ")[1]
    if (!token) return res.status(401).json({ error: "Token Required" });
    try {
        const decoded = jwt.verify(token, "secret_key");
        req.user = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid Token" });
    }
};

module.exports = auth;

import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from "./constants";

export const verifyToken = (req, res, next) => {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
        res.status(401).send({ message: 'Access denied!' });
        return;
    }

    try {
        const token = bearerToken.split(' ')[1];
        req.body._decoded = jwt.verify(token, TOKEN_SECRET);

        next();
    } catch (err) {
        console.error(err);
        res.status(400).send({ message: 'Invalid token' });
    }
};

import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) return res.status(401).json({ message: 'Acceso denegado' });

    try {
        // Remove 'Bearer ' prefix if present
        const actualToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

        const verified = jwt.verify(actualToken, process.env.JWT_SECRET || 'medalla_secret_key_123');
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido' });
    }
};

import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
export interface AuthenticatedRequest extends Request {
    userId?: string;
}

/**
 * check Firebase ID Token
 */
export const authMiddleware = async (
    req: AuthenticatedRequest, 
    res: Response, 
    next: NextFunction
) => {
    const headerToken = req.headers.authorization;

    if (!headerToken || !headerToken.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No or invalid token format.' });
    }

    const idToken = headerToken.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.userId = decodedToken.uid;

        next();

    } catch (error) {
        console.error('Error verifying Firebase ID token:', error);
        res.status(403).json({ message: 'Forbidden: Invalid or expired token.' });
    }
};
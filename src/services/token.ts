import jwt from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your_default_secret';

export type ApiDatatype = {
    id: string;
    user_id: number;
    name: string;
    email: string;
    password_hash: string;
    role: string;
    created_at: string;
    iat: number;
    exp: number;
}

export function generateToken(
    payload: object,
    expiresIn: any = '1h'
): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export const decodeToken = (token: string): any => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        console.error("Failed to decode token:", err);
        return null;
    }
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        console.error('Invalid token:', err);
        return null;
    }
}

export const getUserDataWithToken = (token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            resolve(decoded);
        } catch (error) {
            console.error("Token verification failed:", error);
            reject(null);
        }
    });
};

export const checkIfTokenIsNotExpired = (token: string): boolean => {
    try {
        const decoded: any = jwt.decode(token);
        if (!decoded || !decoded.exp) return false;
        return decoded.exp * 1000 > Date.now();
    } catch (error) {
        return false;
    }
};

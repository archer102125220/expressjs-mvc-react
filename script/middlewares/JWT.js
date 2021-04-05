import jwt from 'express-jwt';
import jwtEncode from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'secret12345';/* PublicKey */

class JWTMiddleware {
    unless = (path = {}) => {/* path:不需token */
        return jwt({ secret, requestProperty: 'auth' }).unless(path);// requestProperty → 解析完儲存token的欄位名稱
    }
    encode = (payload = {}) => {
        return 'Bearer ' + jwtEncode.sign(payload, secret, { expiresIn: 3600 * 24 * 3 });
    }
}

export default new JWTMiddleware();

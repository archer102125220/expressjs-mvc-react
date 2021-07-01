import jwt from 'express-jwt';
import jwtEncode from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'secret12345';/* PublicKey */

class JWTMiddleware {
  unless = (path = []) => {/* path:不需token */
    return jwt({ secret, requestProperty: 'auth', getToken: this.fromHeaderOrQuerystring }).unless(path);// requestProperty → 解析完儲存token的欄位名稱
  }
  encode = (payload = {}) => {
    return 'Bearer ' + jwtEncode.sign(payload, secret, { expiresIn: 3600 * 24 * 3 });
  }

  // https://ithelp.ithome.com.tw/articles/10187343
  // https://www.npmjs.com/package/express-jwt
  fromHeaderOrQuerystring(req) {
    const { cookies } = req;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    } else if (typeof (cookies.token) === 'string' && cookies.token !== '') {
      return req.cookies.token.split(' ')[1];
    }
    return null;
  }
}

export default new JWTMiddleware();

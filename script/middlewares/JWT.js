import jwt from 'express-jwt';
import jwtEncode from 'jsonwebtoken';
import createError from 'http-errors';
import videoService from '@services/server/videoService';

const secret = process.env.JWT_SECRET || 'secret12345';/* PublicKey */

class JWTMiddleware {
  unless = (unlessPath = []) => {/* path:不需token */
    return jwt({ secret, requestProperty: 'auth', getToken: this.fromHeaderOrQuerystring }).unless(unlessPath);// requestProperty → 解析完儲存token的欄位名稱
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
      return req.query.token.split(' ')[1];
    } else if (typeof (cookies.token) === 'string' && cookies.token !== '') {
      return req.cookies.token.split(' ')[1];
    }
    return null;
  }

  staticAccessProtect = (pathArray = []) => {
    return async (req, res, next) => {
      const url = req?.url || '';
      if (pathArray.find(path => url?.match(path))) {
        const userId = req.auth.id;
        const urlArray = url.split('/');
        const videoName = urlArray[urlArray.length - 1];
        // const videoNameArray = videoName.split('.');
        // const extname = videoNameArray[videoNameArray.length - 1];
        try {
          const video = await videoService.findVideo({ videoName: decodeURI(videoName) }, userId);
          if (video.video === null) {
            next(createError(401));
          }
        } catch (error) {
          console.log({ error });
        }
      }
      next();
    }
  }
}

export default new JWTMiddleware();

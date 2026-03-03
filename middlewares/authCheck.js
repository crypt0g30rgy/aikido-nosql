// Middleware for authentication
const adminAuth = (req, res, next) => {
    const auth = { login: process.env.API_USER, password: process.env.API_PASS }; 

    console.log(auth)
  
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
  
    if (login && password && login === auth.login && password === auth.password) {
      return next();
    }
  
    res.set('WWW-Authenticate', 'Basic realm="401"'); 
    res.status(401).json({status: 'error', message: 'Authentication required.'});
  };

  module.exports = adminAuth;
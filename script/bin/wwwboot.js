/**
 * Module dependencies.
 */

import 'dotenv/config';
import App from './../app';
import debuger from 'debug';
import http from 'http';
import fs from 'fs';
import https from 'https';
import Socket from './../socketIo';

const debug = debuger('expressjs-mvc:server');
const rootPath = process.cwd();

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.APP_PORT || '3000');
const sslPort = normalizePort(process.env.SSL_APP_PORT);
if (process.env.HTTPS && process.env.HTTP) {
  App.set('port', [port, sslPort]);
} else if (process.env.HTTP) {
  App.set('port', port);
} else if (process.env.HTTPS) {
  App.set('port', sslPort);
}

if (process.env.HTTP) {
  const server = http.createServer(App); //Create HTTP server.
  Socket.init(server); //Create socket server.
  server.listen(port, process.env.APP_HOST || '0.0.0.0'); //Listen on provided port, on all network interfaces.
  server.on('error', onError);
  server.on('listening', () => onListening(server));
  server.on('request', (request, response) => ipLog(request, response));
}

if (process.env.HTTPS) {
  //https://medium.com/@savemuse/node-js-%E5%BB%BA%E7%AB%8Bhttps%E4%BC%BA%E6%9C%8D%E5%99%A8-46442e9cd433
  //https://dev.twsiyuan.com/2017/10/openssl-unable-to-load-config.html
  const privateKey = fs.readFileSync(rootPath + '/sslcert/server-key.pem', 'utf8');
  const certificate = fs.readFileSync(rootPath + '/sslcert/server-cert.pem', 'utf8');
  const ca = fs.readFileSync(rootPath + '/sslcert/cert.pem', 'utf8');
  const credentials = { key: privateKey, cert: certificate, ca, passphrase: '??' };
  const httpsServer = https.createServer(credentials, App);
  if (Socket.state !== 'connected' && Socket.state !== 'connection') {
    Socket.init(httpsServer);
  }
  httpsServer.listen(sslPort, process.env.APP_HOST || '0.0.0.0');
  httpsServer.on('error', onError);
  httpsServer.on('listening', () => onListening(httpsServer));
  httpsServer.on('request', (request, response) => ipLog(request, response));
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = val;

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return parseInt(port, 10);
  }

  return false;
}

/**
 * Event listener for HTTP server 'error' event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.log('EACCES');
      console.log(error);
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.log('EADDRINUSE');
      console.log(error);
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      console.log('default');
      console.log(error);
      throw error;
  }
}

/**
 * Event listener for HTTP server 'listening' event.
 */

function onListening(services) {
  const addr = services.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  let outPut = '✅  The ';
  if (services.key) {
    outPut += 'https';
  } else {
    outPut += 'http';
  }
  console.log(`${outPut} server is listen on ${bind}`); // eslint-disable-line no-console
}

function ipLog(request, response){
  console.log('-------------ip log---------------');
  console.log('a user from :');
  console.log(`${request.connection.remoteAddress}:${request.connection.remotePort}`);
  //console.log('connection:');
  //console.log(request.connection);
  //console.log(request.headers["x-forwarded-for"],request.headers["X-Forwarded-Port"]);
  console.log('headers:');
  console.log(request.headers);
  //console.log(request.connection);
  console.log('-------------ip log end---------------');
}

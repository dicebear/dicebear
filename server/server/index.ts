import * as express from 'express';
import * as next from 'next';
import * as apicache from 'apicache';
import * as socketio from 'socket.io';

import privateConfig from '../config/private';

import v2 from './actions/v2';
import meta from './actions/meta';
import { getStats } from './helper/mongodb';

const ms = require('ms');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const cache = apicache.middleware;

let connectedClients = 0;
const socketInterval = async (socket: socketio.Namespace) => {
  if (connectedClients > 0) {
    socket.emit('data', await getStats());
  }

  setTimeout(() => socketInterval(socket), privateConfig.socketInterval);
};

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(v2);
    server.use(meta);

    server.get('*', cache(ms(privateConfig.memoryCaching)), (req, res) => {
      res.setHeader('Cache-Control', 'public, max-age=' + ms(privateConfig.httpCaching) / 1000);

      handle(req, res);
    });

    const httpServer = server.listen(privateConfig.port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${privateConfig.port}`);
    });

    if (privateConfig.mongodbUri) {
      const io = socketio(httpServer);

      socketInterval(io.sockets);

      io.on('connection', socket => {
        ++connectedClients;

        socket.on('disconnect', () => {
          --connectedClients;
        });
      });
    }
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });

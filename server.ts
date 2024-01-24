import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { getAllCourses } from './src/app/server/courses.route';
import { addPushSubscriber } from './src/app/server/add-push-subscriber.route';
import { sendNewsletter } from './src/app/server/send-newsletter.route';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  const webPushKeys = {
    publicKey:
      'BG7qSwfay7Bwn-gpfi3WszImt7XDtqyzYQLuQNTVfDqP-dJ4nEf80c9kCnAo8DpQD5QKdPd2t6ambpQn4NRdWdM',

    privateKey: 'DqVDdoVXJlEqujS420FpVLRcZ2E0_-qjwKUu4NiVAVM',
  };
  const webpush = require('web-push');

  webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    webPushKeys.publicKey,
    webPushKeys.privateKey
  );
  const cors = require('cors');

  const bodyParser = require('body-parser');

  server.use(cors({ origin: true }));
  server.use(bodyParser.json());

  server.route('/api/courses').get(getAllCourses);
  server.route('/api/notifications').post(addPushSubscriber);
  server.route('/api/send-newsletter').post(sendNewsletter);
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(browserDistFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();

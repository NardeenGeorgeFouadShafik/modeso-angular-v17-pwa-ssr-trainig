import * as express from 'express';
import { Application } from 'express';
import { getAllCourses } from './courses.route';
import { addPushSubscriber } from './add-push-subscriber.route';
import { sendNewsletter } from './send-newsletter.route';
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

const app: Application = express.default();

app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.route('/api/courses').get(getAllCourses);
app.route('/api/notifications').post(addPushSubscriber);
app.route('/api/send-newsletter').post(sendNewsletter);

const httpServer = app.listen(9000, () => {
  console.log('HTTP REST API Server running at http://localhost:9000');
});

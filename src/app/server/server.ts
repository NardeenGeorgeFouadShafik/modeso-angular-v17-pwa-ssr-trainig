import * as express from 'express';
import { Application } from 'express';
import { getAllCourses } from './courses.route';

const cors = require('cors');

const bodyParser = require('body-parser');

const app: Application = express.default();

app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.route('/api/courses').get(getAllCourses);


const httpServer = app.listen(9000, () => {
  console.log(
    'HTTP REST API Server running at http://localhost:9000'
  );
});

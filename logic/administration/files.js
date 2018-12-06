import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { WebApp } from 'meteor/webapp';
import AWS from 'aws-sdk';
import Settings from '../core/settings';

// Multipart Form Data Support in WebApp middleware
const BusBoy = require('connect-busboy');
const miss = require('mississippi');
const crypto = require('crypto');

Meteor.startup(() => {
  // Get AWS settings from settings.json or environment variable
  const { region, accessKeyId, secretAccessKey } = Settings.get('aws');

  // Configure region and keys
  AWS.config.update({ region, accessKeyId, secretAccessKey });
});

Meteor.methods({
  /**
   * Add an item to S3
   * @param {Object} file
   */
  async uploadFile(file) {
    check(file, Object);

    // Only admins allowed to upload files
    if (!Meteor.user() || !Meteor.user().admin) throw new Meteor.Error('[not authorized]');

    // File name and data are required
    if (!file.name || !file.data) throw new Meteor.Error('Missing filename or data');

    // Settings and options
    const Bucket = Settings.get('aws').bucket;
    const params = { Bucket, Key: file.name, Body: Buffer.from(file.data) };

    console.log(params);

    const s3 = new AWS.S3();
    const data = await s3.upload(params);

    console.log(JSON.stringify(data));
    return data;
  },
});

WebApp.connectHandlers
  .use(BusBoy())
  .use('/uploadFile', (req, res) => {
    const user = req.headers['x-user-id'];
    const hash = crypto.createHash('sha256');
    hash.update(req.headers['x-auth-token']);

    // Only admins should be able to upload reports
    if (!Meteor.users.findOne({
      _id: user,
      'services.resume.loginTokens.hashedToken': hash.digest('base64'),
    })) {
      // User not logged in; 401 Unauthorized
      res.writeHead(401);
      res.end();
      return;
    }

    if (!Meteor.users.findOne({ _id: user }).admin) {
      // User is not an admin; 403 Forbidden
      res.writeHead(403);
      res.end();
      return;
    }

    if (req.busboy) {
      req.busboy.on('file', Meteor.bindEnvironment((name, fileStream) => {
        console.log(`Receiving ${name}`);

        let file;

        const concatStream = miss.concat(Meteor
          .bindEnvironment((buffer) => { file = buffer; }));

        miss.pipe(fileStream, concatStream, (error) => {
          if (error) {
            console.log(error);
          }
        });

        miss.finished(fileStream, Meteor.bindEnvironment(async (error) => {
          if (error) {
            console.log(error);
          } else {
            console.log(`Received ${name}`);

            // Settings and options
            const Bucket = Settings.get('aws').bucket;
            const params = { Bucket, Key: `resources/${name}`, Body: file };

            console.log(`Params: ${params.Bucket}, ${params.Key}`);

            const s3 = new AWS.S3();
            s3.upload(params, (err, data) => {
              if (err) throw new Meteor.Error(err);
              res.writeHead(200);
              res.end(data.Location);
            });
          }
        }));
      }));
      req.busboy.on('finish', () => {
        console.log('Finished receiving file');
      });
      req.busboy.on('error', (error) => {
        throw new Meteor.Error(error);
      });
      req.pipe(req.busboy);
    } else {
      // Something went wrong
      res.writeHead(500);
      res.end();
    }
  });

import { Picker } from 'meteor/meteorhacks:picker';
import Files from './files';
import Settings from './settings';

/**
 * @summary Route to support antiquated file_open.php from old website
 *   to continue to allow old download links to work
 */
Picker.route('/file_open.php', (params, req, res) => {
  const fileId = params.query.id;
  const file = Files.collection.findOne({ fileId });

  if (file) {
    const { bucket, region } = Settings.get('aws');

    // HTTP 301 Permanent Redirect
    res.writeHead(
      301,
      { Location: `https://s3.${region}.amazonaws.com/${bucket}/old-website-resources/${file.fileName}` },
    );
    res.end();
  } else { res.end('This file does not exist.'); }
});

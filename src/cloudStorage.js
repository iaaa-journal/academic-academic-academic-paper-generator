const { Storage } = require("@google-cloud/storage");
const path = require("path");

const gc = new Storage();

const paperBucket = gc.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);

module.exports = paperBucket;

const fs = require('fs')
const {
  S3Client,
  PutObjectCommand
} = require('@aws-sdk/client-s3')

const REGION = 'eu-west-2'
// Set the bucket parameters
const bucketName = 'events254'

// Create an S3 client service object
const s3 = new S3Client({ region: REGION })

const upload = async (file, folder = '/') => {
  if (!file) {
    return 'https://placeimg.com/640/500/null?30219'
  }
  // Destructure to get original name and path
  const { originalname, filename, path, mimetype } = file

  // Read the teporary upload
  const fileStream = fs.createReadStream(path)

  // Log any errors that may happen during the read
  fileStream.on('error', function (err) {
    fs.writeFileSync('error.log', `${new Date().toUTCString()} | FileStream error ${new Error(err).message} \n`, { flag: 'a' })
  })

  const uploadFolder = `${folder}/${filename}${originalname}`
  // Do not upload to S3 in test environmets
  if (process.env.NODE_ENV === 'testing' || process.env.NODE_ENV === 'development') {
    // return a random image from placeimg
    return `https://placeimg.com/640/500/any?${Math.floor(Math.random() * 100000)}`
  }
  // Object params for the upload
  const objectParams = {
    ContentType: mimetype,
    ACL: 'public-read',
    Bucket: bucketName,
    Key: uploadFolder,
    Body: fileStream
  }
  try {
    await s3.send(new PutObjectCommand(objectParams))
    // The upload was successful
    fs.unlinkSync(path)
    return `https://${bucketName}.s3.${REGION}.amazonaws.com/${uploadFolder}`
  } catch (error) {
    fs.writeFileSync('error.log', `${new Date().toUTCString()} | S3 ${new Error(error).message} \n`, { flag: 'a' })
    return 'https://placeimg.com/640/500/null?30219'
  }
}

module.exports = upload

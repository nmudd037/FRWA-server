const fetch = require('node-fetch');

exports.verifyImageUrl = async (imageUrl) => {
  const request = await fetch(imageUrl);
  const contentHeader = await request.headers.get('content-type');

  return contentHeader.includes('image');
};

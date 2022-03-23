const core = require('@actions/core');
const fs = require('fs')
const request = require('request');

const updateFileModuleApiCall = (url) => {

  let filePath = core.getInput('file_path');
  const fileStream = fs.readFileSync(filePath);

  const options = {
    'method': 'PUT',
    url: `${url}`,
    body: fileStream,
    headers: {
      'Content-Type': 'application/octet-stream'
    }
  };

  return request(options, (error, response, body) => {
    if (error) {
      return { error }
    }
  })
}

exports.modules = {
  updateFileModuleApiCall
}

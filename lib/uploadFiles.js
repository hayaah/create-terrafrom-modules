const core = require('@actions/core');
const fs = require('fs')
const request = require('request');

const updateFileModuleApiCall = (url) => {
  try {
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
  
    return request(options, (errors, response, body) => {
      if (errors) {
        return { errors }
      }
    })

  } catch(error) { 
    return { errors: error }
  }
}

exports.modules = {
  updateFileModuleApiCall
}

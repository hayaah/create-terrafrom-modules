const core = require('@actions/core');
const request = require('request');

const getParams = () => {
  const moduleName = core.getInput('module_name');
  const provider = core.getInput('provider');
  const registryName = core.getInput('registry_name');
  const organization = core.getInput('organization');
  const version = core.getInput('version');

  return {
    moduleName,
    provider,
    registryName,
    organization,
    version
  }
}

const getToken = () => {
  return core.getInput('token')
}
const updateVersionModuleApiCall = (callback) => {
  const params = getParams()
  const { moduleName, provider, registryName, organization, version } = params

  const data = {
    "data": {
      "type": "registry-module-versions",
      "attributes": {
        "version": version
      }
    }
  }

  const headers = {
    'Content-Type': 'application/vnd.api+json',
    'Authorization': `Bearer ${getToken()}`
  }

  var options = {
    'method': 'POST',
    'url': `https://app.terraform.io/api/v2/organizations/${organization}/registry-modules/${registryName}/${organization}/${moduleName}/${provider}/versions`,
    'headers': headers,
    body: JSON.stringify(data)
  };

  request(options, (errors, response) => { 
    if (errors) { 
      return callback({ errors: errors.errors});
    } 
    return callback(JSON.parse(response.body))
  });
}

exports.modules = {
  updateVersionModuleApiCall,
  getParams,
  getToken
}
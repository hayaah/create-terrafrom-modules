const core = require('@actions/core');
const request = require('request');

const getParams = () => {
  const moduleName = core.getInput('module_name');
  const provider = core.getInput('provider');
  const registryName = core.getInput('registry_name');
  const organization = core.getInput('organization');

  return {
    moduleName,
    provider,
    registryName,
    organization
  }
}

const getToken = () => {
  return core.getInput('token')
}

const createModuleApiCall = (callback) => {

  const params =  getParams()

  const { moduleName, provider, registryName, organization } = params
    const data = {
      "data": {
        "type": "registry-modules",
        "attributes": {
          "name": moduleName,
          "provider": provider,
          "registry-name": registryName
        }
      }
    }
  const headers = {
    'Content-Type': 'application/vnd.api+json',
    'Authorization': `Bearer ${getToken()}`
  }

  var options = {
    'method': 'POST',
    'url': `https://app.terraform.io/api/v2/organizations/${organization}/registry-modules`,
    'headers': headers,
    body: JSON.stringify(data)
  };

  request(options, (errors, response) => {
    if (response && response.statusCode == 404) {
      return callback({ errors: "one or more parametere is missing, please check ( module name, organazation )", status: 404  });
    } 
    if (errors != null ) {
      return callback({ errors: errors.errors });
    } 
    return callback(JSON.parse(response.body))
  });
}

exports.modules = {
  createModuleApiCall,
  getParams,
  getToken
}
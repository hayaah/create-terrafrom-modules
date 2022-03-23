const core = require('@actions/core');
const createModule = require('./createModule')
const createVersion = require('./createVersion')
const uploadModule = require('./uploadFiles')

// const setGithubInput = (name, value) =>
//   process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] = value;

async function run() {

  try {
    createModule.modules.createModuleApiCall(createModuleResponse => {
      if (createModuleResponse) {
        setModuleVersion()
      }
    })
  }
  catch (error) {
    if (error.response) {
      const getModuleDuplicationError = error.response.data.filter(error => error.meta.duplicate_module && error.status == 422)
      if (getModuleDuplicationError.length > 0) {
        setModuleVersion()
        return
      }
      core.setFailed({ status: error.response.status, data: error.response.data });
    }
  }
}

function setModuleVersion() {
  try {
    createVersion.modules.updateVersionModuleApiCall((createVersionResponse) => {
      if (createVersionResponse.errors) {
        return core.setOutput("response", JSON.stringify(createVersionResponse.errors));
      }

      if (createVersionResponse.data) {
        const uploadModuleResponse = uploadModule.modules.updateFileModuleApiCall(createVersionResponse.data.links.upload)
        if (!uploadModuleResponse.error) {
          return core.setOutput("response", JSON.stringify(createVersionResponse.data));
        }
        return core.setFailed({ error: uploadModuleResponse.error });
      }

    })
  }
  catch (error) {
    console.log(error)
    return core.setFailed({ error });
  }
}


run()
const core = require('@actions/core');
const createModule = require('./createModule')
const createVersion = require('./createVersion')
const uploadModule = require('./uploadFiles')
 
async function run() {
  createModule.modules.createModuleApiCall((createModuleResponse) => {
    if (createModuleResponse.data) {
      setModuleVersion()
    }
    if (createModuleResponse.errors) {
      const getModuleDuplicationError = createModuleResponse.errors.filter(error => error.meta.duplicate_module && error.status == 422)
      if (getModuleDuplicationError.length > 0) {
        setModuleVersion()
        return
      }
      core.setFailed({ data: createModuleResponse.errors });
      return
    }
  })
}

function setModuleVersion() {
  createVersion.modules.updateVersionModuleApiCall((createVersionResponse) => {
    if (createVersionResponse.errors) {
      return core.setFailed({ data: createVersionResponse.errors });
    }
    if (createVersionResponse.data) {
      const uploadModuleResponse = uploadModule.modules.updateFileModuleApiCall(createVersionResponse.data.links.upload)
      if (!uploadModuleResponse.errors) {
        return core.setOutput("response", JSON.stringify(createVersionResponse.data));
      }
      return core.setFailed({ error: uploadModuleResponse.errors });
    }

  })
}

run()
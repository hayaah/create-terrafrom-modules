const request = require('request');
const createVersion = require('../lib/createVersion');

const mockedUpdateUrl = `https://app.terraform.io/api/v2/organizations/infragod-test/registry-modules/private/infragod-test/module_name/gcp/versions`
const mockedSuccessRes = {
  "data": {
    "id": "modver-2YB8p2aLtnwPHum8",
    "type": "registry-module-versions",
    "attributes": {
      "source": "tfe-api",
      "status": "pending",
      "version": "2.0.99",
      "created-at": "2022-02-08T07:23:37.186Z",
      "updated-at": "2022-02-08T07:23:37.186Z"
    },
    "relationships": {
      "registry-module": {
        "data": {
          "id": "mod-MZQr4XaAZ7i1bPiw",
          "type": "registry-modules"
        }
      }
    },
    "links": {
      "upload": ""
    }
  }
}

const mockedFailerRes = {
  "errors": {
    "errors": [
      "Not found"
    ],
    "success": false
  }
}
const mockedToken = 'token'

jest.mock('request')

const mockUpdateVersionApi = () => {
  request.mockImplementation((req, callback) => {
    if (req.url == mockedUpdateUrl) {
      return callback(null, { body: JSON.stringify(mockedSuccessRes) })
    }
    return callback(mockedFailerRes, null)

  });
}

const setGithubInput = (name, value) =>
  process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] = value;

describe("test getting variables from github action", () => {
  test('check if module_name was set successfully / should succeed', (done) => {
    setGithubInput("module_name", "module_name")
    const params = createVersion.modules.getParams()
    expect(params.moduleName).toStrictEqual("module_name")
    done()
  })

  test('check if token is missing / should return an error', (done) => {
    const token = createVersion.modules.getToken()
    expect(token).not.toBe(mockedToken)
    done()
  })

  test('check if token is set', (done) => {
    setGithubInput("token", mockedToken)
    const token = createVersion.modules.getToken()
    expect(token).toStrictEqual(mockedToken)
    done()
  })

  test('check if provider was not set / should return error', (done) => {
    const params = createVersion.modules.getParams()
    expect(params.provider).not.toBe("aws")
    done()
  })
})

describe("test calling update module version api", () => {

  test('check if the url is params are not set / should return error', async (done) => {
    mockUpdateVersionApi()
    createVersion.modules.updateVersionModuleApiCall((res) => {
      expect(res).toEqual(mockedFailerRes)
    })
    done()
  })

  test('check if the url is set correctly', async (done) => {
    setGithubInput("organization", "infragod-test")
    setGithubInput("registry_name", "private")
    setGithubInput("provider", "gcp")
    mockUpdateVersionApi()
    createVersion.modules.updateVersionModuleApiCall((res) => {
      expect(res).toEqual(mockedSuccessRes)
    })
    done()
  })
})

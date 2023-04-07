import {
  changeVMState,
  gatherDetailsFromEditVM,
  getCSRFToken,
  requestChange,
} from '../utils/Unraid'

export default function (req, res, next) {
  const body = [] as any[]
  let data
  req
    .on('data', (chunk) => {
      body.push(chunk)
    })
    .on('end', async () => {
      data = JSON.parse(Buffer.concat(body).toString())
      if (data) {
        const response = {} as any
        response.message = await editVM(data)
        response.status = 200
        res.send(response)
      }
    })
}

async function editVM(data) {
  const existingVMObject = await gatherDetailsFromEditVM(
    data.server,
    data.id,
    undefined,
    data.auth
  )
  Object.keys(data.edit).forEach((key) => {
    existingVMObject.edit[key] = data.edit[key]
  })

  const token = await getCSRFToken(data.server, data.auth)

  await changeVMState(data.id, 'domain-stop', data.server, data.auth, token)
  const result = await requestChange(
    data.server,
    data.id,
    data.auth,
    existingVMObject.edit
  )
  await changeVMState(data.id, 'domain-start', data.server, data.auth, token)
  return result
}

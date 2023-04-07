import { changeVMState, getCSRFToken, requestChange } from '../utils/Unraid'

const defaultVM = {
  gpus: [
    {
      id: 'vnc',
      model: 'qxl',
      keymap: 'en-us',
    },
  ],
}

export default function (req, res, next) {
  const body = []
  let data
  req
    .on('data', (chunk) => {
      // @ts-ignore
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
  const defaultVMObject = {} as any
  defaultVMObject.edit = Object.assign({}, defaultVM)
  defaultVMObject.edit.domain_uuid =
    /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/ // todo generate a mac
  Object.keys(data.edit).forEach((key) => {
    defaultVMObject.edit[key] = data.edit[key]
  })

  const token = await getCSRFToken(data.server, data.auth)

  await changeVMState(data.id, 'domain-stop', data.server, data.auth, token)
  const result = await requestChange(
    data.server,
    data.id,
    data.auth,
    defaultVMObject.edit,
    // @ts-ignore
    create
  )
  await changeVMState(data.id, 'domain-start', data.server, data.auth, token)
  return result
}

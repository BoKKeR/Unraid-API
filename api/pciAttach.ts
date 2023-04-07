import fs from 'fs'
import {
  addPCICheck,
  changeVMState,
  gatherDetailsFromEditVM,
  getCSRFToken,
  removePCICheck,
  requestChange,
} from '../utils/Unraid'

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
        if (!data.option) {
          response.message = await attachPCI(data)
        } else if (data.option === 'detach') {
          response.message = await detachPCI(data)
        }
        response.status = 200
        res.send(response)
      }
    })
}

async function attachPCI(data) {
  if (data.pciId && !data.pciIds) {
    data.pciIds = [data.pciId]
  }

  const vmObject = await gatherDetailsFromEditVM(
    data.server,
    data.id,
    undefined,
    data.auth
  )
  const rawdata = fs.readFileSync('config/servers.json')
  // @ts-ignore
  const servers = JSON.parse(rawdata)
  const attached = [] as any[]

  data.pciIds.forEach((pciId) => {
    Object.keys(servers[data.server].vm.details).forEach((vmId) => {
      const vm = servers[data.server].vm.details[vmId]
      if (vm.edit && vm.edit.pcis && vm.status === 'started') {
        vm.edit.pcis.forEach((pciDevice) => {
          if (
            pciDevice.id.split('.')[0] === pciId.split('.')[0] &&
            vmId !== data.id &&
            pciDevice.checked
          ) {
            attached.push({ pciId: pciDevice.id, vmId, vm })
          }
        })
      }
    })
    addPCICheck(vmObject.edit, pciId)
  })

  const token = await getCSRFToken(data.server, data.auth)
  const stopped = {} as any
  if (attached) {
    for (const vmWithPciDevice of attached) {
      removePCICheck(vmWithPciDevice.vm.edit, vmWithPciDevice.pciId)
      if (!stopped[vmWithPciDevice.vmId]) {
        await changeVMState(
          vmWithPciDevice.vmId,
          'domain-stop',
          data.server,
          data.auth,
          token
        )
      }
      await requestChange(
        data.server,
        vmWithPciDevice.vmId,
        servers[data.server].authToken,
        vmWithPciDevice.vm.edit
      )
      stopped[vmWithPciDevice.vmId] = true
    }
  }

  await Promise.all(
    Object.keys(stopped).map((stoppedVMId) =>
      changeVMState(stoppedVMId, 'domain-start', data.server, data.auth, token)
    )
  )

  await changeVMState(data.id, 'domain-stop', data.server, data.auth, token)
  const result = await requestChange(
    data.server,
    data.id,
    data.auth,
    vmObject.edit
  )
  await changeVMState(data.id, 'domain-start', data.server, data.auth, token)
  return result
}

async function detachPCI(data) {
  if (data.pciId && !data.pciIds) {
    data.pciIds = [data.pciId]
  }

  const vmObject = await gatherDetailsFromEditVM(
    data.server,
    data.id,
    undefined,
    data.auth
  )

  data.pciIds.forEach((pciId) => {
    removePCICheck(vmObject.edit, pciId)
  })

  const token = await getCSRFToken(data.server, data.auth)
  await changeVMState(data.id, 'domain-stop', data.server, data.auth, token)
  const result = await requestChange(
    data.server,
    data.id,
    data.auth,
    vmObject.edit
  )
  await changeVMState(data.id, 'domain-start', data.server, data.auth, token)
  return result
}

import fs from 'fs'
import {
  addPCICheck,
  changeVMState,
  flipPCICheck,
  gatherDetailsFromEditVM,
  getCSRFToken,
  removePCICheck,
  requestChange,
} from '../utils/Unraid'

export default function (req, res, next) {
  const body = [] as any
  let data
  req
    .on('data', (chunk) => {
      body.push(chunk)
    })
    .on('end', async () => {
      data = JSON.parse(Buffer.concat(body).toString())
      if (data) {
        const response = {} as any
        response.message = await gpuSwap(data)
        response.status = 200
        res.send(response)
      }
    })
}

async function gpuSwap(data) {
  const vm1 = await gatherDetailsFromEditVM(
    data.server,
    data.id1,
    undefined,
    data.auth
  )
  const vm2 = await gatherDetailsFromEditVM(
    data.server,
    data.id2,
    undefined,
    data.auth
  )

  const token = await getCSRFToken(data.server, data.auth)

  const vm1PrimaryGPU = vm1.edit.pcis.filter(
    (device) => device.gpu && device.checked
  )[0]
  const vm2PrimaryGPU = vm2.edit.pcis.filter(
    (device) => device.gpu && device.checked
  )[0]

  removePCICheck(vm1.edit, vm1PrimaryGPU.id)
  removePCICheck(vm2.edit, vm2PrimaryGPU.id)
  addPCICheck(vm1.edit, vm2PrimaryGPU.id)
  addPCICheck(vm2.edit, vm1PrimaryGPU.id)

  const temp = Object.assign(
    '',
    vm1.edit.pcis.filter((device) => device.id === vm2PrimaryGPU.id)[0].bios
  )
  vm1.edit.pcis.filter((device) => device.id === vm2PrimaryGPU.id)[0].bios =
    Object.assign(
      '',
      vm2.edit.pcis.filter((device) => device.id === vm1PrimaryGPU.id)[0].bios
    )
  vm2.edit.pcis.filter((device) => device.id === vm1PrimaryGPU.id)[0].bios =
    temp

  if (data.pciIds) {
    data.pciIds.forEach((pciId) => {
      flipPCICheck(vm1.edit, pciId)
      flipPCICheck(vm2.edit, pciId)
    })
  }

  await Promise.all([
    changeVMState(data.id1, 'domain-stop', data.server, data.auth, token),
    changeVMState(data.id2, 'domain-stop', data.server, data.auth, token),
  ])

  const result1 = await requestChange(
    data.server,
    data.id1,
    data.auth,
    vm1.edit
  )
  const result2 = await requestChange(
    data.server,
    data.id2,
    data.auth,
    vm2.edit
  )

  await Promise.all([
    changeVMState(data.id1, 'domain-start', data.server, data.auth, token),
    changeVMState(data.id2, 'domain-start', data.server, data.auth, token),
  ])

  return { vm1: result1, vm2: result2 }
}

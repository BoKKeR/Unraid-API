<template>
  <v-container fluid grid-list-md text-xs-center>
    <v-layout
      row
      wrap
      pa-3
      mb-3
      align-content-space-around
      justify-space-around
      fill-height
    >
      <v-flex text-xs-left grow>
        <v-card>
          <v-card-title> Connect a server </v-card-title>
          <v-card-text>
            Request
            <v-text-field value="POST: api/login" solo readonly light />
            Data
            <v-textarea
              value="{ ip: Server Ip Address, authToken: Base64(User:Password) }"
              solo
              readonly
              light
            />
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex text-xs-left grow>
        <v-card>
          <v-card-title> Get Server Details </v-card-title>
          <v-card-text>
            Request
            <v-text-field value="GET: api/getServers" solo readonly light />
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex text-xs-left>
        <v-card>
          <v-card-title> VM Controls </v-card-title>
          <v-card-text>
            Request
            <v-text-field value="POST: api/vmStatus" solo readonly light />
            Data
            <v-textarea
              value="{ id: Virtual Machine ID, action: action (see bellow), server: Server IP Address, auth: Base64(User:Password) }"
              solo
              readonly
              light
              auto-grow
              rows="1"
            />
            Actions
            <v-container fluid grid-list-md text-xs-center>
              <v-layout
                row
                wrap
                pa-3
                mb-3
                align-content-space-around
                justify-space-around
                fill-height
              >
                <v-flex>
                  <v-card>
                    Start
                    <v-text-field value="domain-start" solo readonly light />
                  </v-card>
                </v-flex>
                <v-flex>
                  <v-card>
                    Stop
                    <v-text-field value="domain-stop" solo readonly light />
                  </v-card>
                </v-flex>
                <v-flex>
                  <v-card>
                    Pause
                    <v-text-field value="domain-pause" solo readonly light />
                  </v-card>
                </v-flex>
                <v-flex>
                  <v-card>
                    UnPause
                    <v-text-field value="domain-resume" solo readonly light />
                  </v-card>
                </v-flex>
                <v-flex>
                  <v-card>
                    Force Stop
                    <v-text-field value="domain-destroy" solo readonly light />
                  </v-card>
                </v-flex>
                <v-flex>
                  <v-card>
                    Restart
                    <v-text-field value="domain-restart" solo readonly light />
                  </v-card>
                </v-flex>
                <v-flex>
                  <v-card>
                    Hibernate
                    <v-text-field
                      value="domain-pmsuspend"
                      solo
                      readonly
                      light
                    />
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex text-xs-left grow>
        <v-card>
          <v-card-title> USB Controls </v-card-title>
          <v-card-text>
            Request
            <v-text-field value="POST: api/usbAttach" solo readonly light />
            Data
            <v-textarea
              value="{ id: Virtual Machine ID, usbId: USB Identifier (address), server: Server IP Address, auth: Base64(User:Password) }"
              solo
              readonly
              light
            />
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex text-xs-left grow>
        <v-card>
          <v-card-title> PCI Controls </v-card-title>
          <v-card-text>
            Request
            <v-text-field value="POST: api/pciAttach" solo readonly light />
            Data
            <v-textarea
              value="{ id: Virtual Machine ID, pciIds: Array of PCI Identifiers (address), server: Server IP Address, auth: Base64(User:Password) }"
              solo
              readonly
              light
            />
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex text-xs-left grow>
        <v-card>
          <v-card-title> GPU Swap </v-card-title>
          <v-card-text>
            Request
            <v-text-field value="POST: api/gpuSwap" solo readonly light />
            Data
            <v-textarea
              value="{ id1: Virtual Machine 1 ID, id2: Virtual Machine 2 ID, server: Server IP Address, pciIds: (Optional) List of pci ids to move as well (must be attached to one of these vms), auth: Base64(User:Password) }"
              solo
              readonly
              light
            />
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex text-xs-left grow>
        <v-card>
          <v-card-title> VM Edit </v-card-title>
          <v-card-text>
            Request
            <v-text-field value="POST: api/editVM" solo readonly light />
            Data
            <v-textarea
              value="{ id: Virtual Machine ID, server: Server IP Address, edit: Object containing fields to edit, options bellow, auth: Base64(User:Password) }"
              solo
              readonly
              light
            />
            Edit Options (all optional)
            <v-container fluid grid-list-md text-xs-center>
              <v-layout
                row
                wrap
                pa-3
                mb-3
                align-content-space-around
                justify-space-around
                fill-height
              >
                <EditDetail
                  title="template_name"
                  text-content="Which of unraids templates to use for the VM"
                  default-value="Windows+10"
                />
                <EditDetail
                  title="template_icon"
                  text-content="Unraid template icon"
                  default-value="windows.png"
                />
                <EditDetail
                  title="template_os"
                  text-content="Unraid template os"
                  default-value="windows10"
                />
                <EditDetail
                  title="template_name"
                  text-content="Which of unraids templates to use for the VM"
                  default-value="Windows+10"
                />
                <EditDetail
                  title="media_cdrom"
                  text-content="The path to the install iso"
                />
                <EditDetail
                  title="media_cdrombus"
                  text-content="The bus for the install iso"
                  default-value="sata"
                />
                <EditDetail
                  title="media_drivers"
                  text-content="The path to the drivers iso"
                />
                <EditDetail
                  title="media_driversbus"
                  text-content="The bus for the drivers iso"
                  default-value="sata"
                />
                <EditDetail
                  title="domain_persistent"
                  text-content="Whether to persist vm"
                  default-value="1"
                />
                <EditDetail
                  title="domain_type"
                  text-content="VM type (not sure if unraid supports anything else?)"
                  default-value="kvm"
                />
                <EditDetail
                  title="domain_uuid"
                  text-content="Not sure if this would work, but used to change the id of the VM"
                />
                <EditDetail
                  title="domain_clock"
                  text-content="The time zone for the VM"
                  default-value="localtime"
                />
                <EditDetail
                  title="domain_arch"
                  text-content="The VM architecture"
                  default-value="x86_64"
                />
                <EditDetail
                  title="domain_oldname"
                  text-content="I think this is the previous name of the VM if it changes? Best not to touch it"
                />
                <EditDetail
                  title="domain_name"
                  text-content="The name of the VM"
                />
                <EditDetail
                  title="domain_desc"
                  text-content="The VM description"
                />
                <EditDetail
                  title="domain_cpumode"
                  text-content="The CPU Mode"
                  default-value="host-passthrough"
                />
                <EditDetail
                  title="domain_vcpu"
                  text-content="An Array of threads to passthrough"
                  default-value="[0]"
                />
                <EditDetail
                  title="domain_mem"
                  text-content="Number of kilobytes of RAM to allocate this VM"
                />
                <EditDetail
                  title="domain_maxmem"
                  text-content="Maximum number of kilobytes of RAM to allocate this VM"
                />
                <EditDetail
                  title="domain_machine"
                  text-content="Machine type of VM (see Unraid GUI for options)"
                  default-value="pc-i440fx-3.1"
                />
                <EditDetail
                  title="domain_ovmf"
                  text-content="Bios type (OVMF (1) or SeaBios (0))"
                  default-value="1"
                />
                <EditDetail
                  title="domain_hyperv"
                  text-content="Whether to enable HyperV"
                  default-value="1"
                />
                <EditDetail
                  title="domain_usbmode"
                  text-content="USB Mode"
                  default-value="usb2"
                />
                <EditDetail
                  title="domain_password"
                  text-content="VNC password"
                />
                <v-flex>
                  <v-card>
                    <EditDetail
                      title="disks"
                      text-content="Array of disks, each an object containing:"
                    />
                    <EditDetail
                      title="image"
                      text-content="Path to disk image"
                    />
                    <EditDetail
                      title="select"
                      text-content="Manual or auto disk location (same as drop down values to the left of path in UI)"
                      default-value="manual"
                    />
                    <EditDetail
                      title="size"
                      text-content="Size of disk"
                      default-value="30G"
                    />
                    <EditDetail
                      title="driver"
                      text-content="Vdisk type (raw or qcow2)"
                    />
                    <EditDetail
                      title="bus"
                      text-content="Vdisk Bus"
                      default-value="sata"
                    />
                  </v-card>
                </v-flex>
                <v-flex>
                  <v-card>
                    <EditDetail
                      title="shares"
                      text-content="Array of sources, each an object containing:"
                    />
                    <EditDetail
                      title="source"
                      text-content="Path to source share"
                    />
                    <EditDetail
                      title="target"
                      text-content="Path to target folder"
                    />
                  </v-card>
                </v-flex>
                <v-flex>
                  <v-card>
                    <EditDetail
                      title="nics"
                      text-content="Array of network controllers, each an object containing:"
                    />
                    <EditDetail title="mac" text-content="Mac Address" />
                    <EditDetail
                      title="network"
                      text-content="Nic network"
                      default-value="br0"
                    />
                  </v-card>
                </v-flex>
                <EditDetail
                  title="OTHER"
                  text-content="For PCI, GPU, Audio and USB attach please usb pci or usb unless you really know what you are doing"
                />
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex text-xs-left grow>
        <v-card>
          <v-card-title> VM Create </v-card-title>
          <v-card-text>
            Request
            <v-text-field value="POST: api/createVM" solo readonly light />
            Same fields as edit but with the extra
            <EditDetail
              title="domain_startnow"
              default-value="1"
              text-content="Whether to start the VM after creation"
            />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import EditDetail from '../components/documentation/EditDetail'

export default {
  components: { EditDetail },
}
</script>

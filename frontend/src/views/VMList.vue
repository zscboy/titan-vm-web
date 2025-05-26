<template>
  <v-card class="page-container">
    <v-card-title>
      Virtual Machines
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="vms"
      :search="search"
      disable-pagination
      hide-default-footer
    >
      <template v-slot:item.name="{ item, index }">
        <span class="fa-stack">
          <i class="fas fa-desktop fa-stack-2x"></i>
          <i
            v-if="item.state === 'Running'"
            class="fas fa-play fa-stack-1x stacked-icon success--text"
          ></i>
          <i
            v-else
            class="fas fa-pause fa-stack-1x stacked-icon grey--text text--darken-1"
          ></i>
        </span>

        <span class="ml-2">{{ item.name }}</span>
      </template>
      <!-- <template v-slot:item.memory="{ item }">
        {{ formatMemory(item.memory) }} GB
      </template> -->
      <template v-slot:item.action="{ item }">
        <vm-action
          :running="item.state === 'Running'"
          :name="item.name"
          :host="$route.params.host"
          @vm-action="(action) => onVMAction(item, action)"
        />
      </template>
    </v-data-table>
    <create-vm-dialog 
      :host="$route.params.host"
      @created="load" 
    />

    <v-overlay :value="loading" absolute opacity="0.1">
      <v-progress-circular indeterminate size="64" color="primary">
        {{ loadingText }}
      </v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import CreateVMDialog from "../components/CreateVMDialog.vue";
import VMAction from "../components/VMAction.vue";
import { authFetch } from "@/utils/fetch";

@Component({
  components: {
    "create-vm-dialog": CreateVMDialog,
    "vm-action": VMAction
  }
})
export default class VMList extends Vue {
  readonly headers = [
    { text: "Name", value: "name" },
    { text: "State", value: "state" },
    { text: "Actions", value: "action", sortable: false, width: "150px" }
  ];

  vms = [];
  search = "";
  interval = null;
  loading = false;
  loadingText = "";

  async mounted() {
    await this.load();
    // window.setInterval(this.load, 3000);
  }

  async load() {
    const hostId = this.$route.params.host;
    const response = await authFetch(`/api/vm/list?id=${hostId}`);
    if (response === undefined) {
      return;
    }

    if (!response.ok) {
      const data = await response.text(); //
      alert(`登录失败，状态码：${response.status}, 错误:${data}`);
      return;
    }

    console.log(response);
    var resp = await response.json();
    this.vms = resp.vm_infos;
    console.log("resp:", resp.vm_infos);
    // this.hosts = resp.nodes;
  }

  async onVMAction(vm: any, action: string) {
    console.log(`item:${vm}, action:${action}`);
    this.loading = true;
    this.loadingText = `${action} vm`;
    try {
      await this.vmOperation(vm, action);
    } finally {
      this.loading = false;
      this.loadingText = "";
    }
  }

  async vmOperation(vm: any, action: string) {
    const payload = {
      id: this.$route.params.host,
      vm_name: vm.name
    };
    const response = await authFetch(`/api/vm/${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (response === undefined) {
      return;
    }

    if (!response.ok) {
      const data = await response.text(); //
      alert(`start vm failed, status code:${response.status}, message:${data}`);
      return;
    }

    vm.state = "Shut off";
    if (action === "start") {
      vm.state = "Running";
    } else if (action === "delete") {
      this.vms = this.vms.filter(item => item !== vm);
    }
  }

  async vmCreate(vm: any) {
    console.log(`vmCreate:${vm}`)
  }
}
</script>

<style lang="sass" scoped>
.stacked-icon
  font-size: 0.8em
  line-height: 2.0em
.page-container
  margin-bottom: 80px
</style>

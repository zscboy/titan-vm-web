<template>
  <v-card class="page-container">
    <v-card-title>
      host list
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
      :items="hosts"
      :search="search"
      disable-pagination
      hide-default-footer
      @click:row="goToHostDetail"
    >
      <template v-slot:item.id="{ item }">
        <span class="fa-stack">
          <i class="fas fa-desktop fa-stack-2x"></i>
          <i
            v-if="item.online"
            class="fas fa-play fa-stack-1x stacked-icon success--text"
          ></i>
          <i
            v-else
            class="fas fa-pause fa-stack-1x stacked-icon grey--text text--darken-1"
          ></i>
        </span>

        <span class="ml-2">{{ item.id }}</span>
      </template>
      <!-- <template v-slot:item.memory="{ item }">
        {{ formatMemory(item.memory) }} GB
      </template> -->
      <!-- <template v-slot:item.action="{ item }">
        <vm-action :running="item.running" :name="item.name" />
      </template> -->
    </v-data-table>
    <!-- <create-vm-dialog @created="load" /> -->
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { authFetch } from "@/utils/fetch";

@Component({
  //   components: {
  //     "create-vm-dialog": CreateVMDialog,
  //     "vm-action": VMAction
  //   }
})
export default class HostList extends Vue {
  readonly headers = [
    { text: "Id", value: "id" },
    { text: "OS", value: "os" },
    { text: "VMType", value: "vm_type" },
    { text: "cpu", value: "total_cpu" },
    { text: "memory", value: "total_memory" },
    { text: "IP", value: "ip" },
    { text: "Online", value: "online" }
    // { text: "Actions", value: "action", sortable: false, width: "150px" }
  ];

  hosts = [];
  search = "";
  interval = null;

  async mounted() {
    await this.load();
    // window.setInterval(this.load, 3000);
  }

  async load() {
    const response = await authFetch("/api/node/list?start=0&end=20");
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
    console.log("resp:", resp);
    this.hosts = resp.nodes;
  }

  formatMemory(memory: number) {
    return +(memory / 1024 / 1024).toFixed(2);
  }

  goToHostDetail(item: any) {
      this.$router.push({ name: 'vmlist', params: { host: item.id } });
    // this.$router.push("/vms")
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

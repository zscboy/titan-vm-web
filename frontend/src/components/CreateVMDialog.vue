<template>
  <div>
    <v-btn bottom right color="primary" dark fab fixed @click="show">
      <v-icon>fa-plus</v-icon>
    </v-btn>
    <v-dialog max-width="600px" v-model="open">
      <v-card :loading="loading">
        <v-card-title>
          <span class="headline">Create Virtual Machine</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
             <v-text-field label="Host Id" disabled :value="host"></v-text-field>
            <v-text-field
              label="VM Name"
              v-model="vmName"
              :rules="rules.vmName"
            ></v-text-field>
            <v-text-field
              label="CPU"
              v-model="cpu"
              :rules="rules.cpu"
              placeholder="123"
            ></v-text-field>
            <v-text-field
              label="RAM"
              v-model="ram"
              suffix="MB"
              :rules="rules.ram"
            ></v-text-field>
            <v-text-field
              label="Disk space"
              v-model="diskSpace"
              suffix="GB"
              :rules="rules.diskSpace"
            ></v-text-field>
            <v-text-field
              label="Image path"
              v-model="image"
              :rules="rules.image"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="open = false">Cancel</v-btn>
          <v-btn color="primary" text @click="create">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="statusOK" color="success">
      Successfully created virtual machine.
      <v-btn dark text @click="statusOK = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-snackbar v-model="statusError" color="error">
      Failed to created virtual machine: {{ error }}
      <v-btn dark text @click="statusError = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

		<!-- Id       string `json:"id"`
		VmName   string `json:"vm_name"`
		Cpu      int32  `json:"cpu"`
		Memory   int32  `json:"memory"`
		DiskSize int32  `json:"disk_size"`
		Image    string `json:"image"` -->

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { authFetch } from "@/utils/fetch";

@Component
export default class CreateVMDialog extends Vue {
   @Prop(String) readonly host!: string;
  // form values
  cpu = "";
  vmName = "";
  ram = "";
  diskSpace = "";
  image = "";

  // readonly cpuPrefix = "192.168.0.";

  // form validation

  isInteger(num: string) {
    return /^(0|[1-9]\d*)$/.test(num);
  }

  readonly rules = {
    vmName: [(v: string) => v.length != 0 || "vmName is required"],
    cpu: [
      (v: string) => v.length != 0 || "cpu is required",
      (v: string) => this.isInteger(v) || "cpu is not a number",
      (v: string) =>
        (parseInt(v) < 128 && parseInt(v) > 0) || "Invalid cpu"
    ],
    ram: [
      (v: string) => v.length != 0 || "RAM is required",
      (v: string) => this.isInteger(v) || "IP address is not a positive number",
      (v: string) => parseInt(v) >= 1024 || "RAM must be at least 1024 MB"
    ],
    diskSpace: [
      (v: string) => v.length != 0 || "Disk space is required",
      (v: string) => this.isInteger(v) || "Disk space is not a positive number",
      (v: string) => parseInt(v) >= 5 || "Disk space must be at least 5 GB"
    ],
    image: [(v: string) => v.length != 0 || "image is required"]
  };

  // ui state
  open = false;
  statusOK = false;
  statusError = false;
  error = "";
  loading = false;

  show() {
    if (this.$refs.form) {
      (this.$refs.form as any).resetValidation();
    }
    this.open = true;
  }

  async create() {
    // console.log(`payload ${payload}`)
    // this.$emit("created", payload);
    // this.open = false

    // 		Id       string `json:"id"`
		// VmName   string `json:"vm_name"`
		// Cpu      int32  `json:"cpu"`
		// Memory   int32  `json:"memory"`
		// DiskSize int32  `json:"disk_size"`
		// Image    string `json:"image"`
    this.loading = true;
    const response = await authFetch("/api/vm/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: this.host,
        vm_name: this.vmName,
        cpu: parseInt(this.cpu),
        memory: parseInt(this.ram),
        disk_size: parseInt(this.diskSpace),
        image: this.image
      })
    });
    this.loading = false;

    if (response === undefined) {
      return
    }

    if (!response.ok) {
      const data = await response.text(); //
      alert(`create vm failed, status code:${response.status}, message:${data}`);
      return;
    }
    var resp = await response.json();
    console.log("resp:", resp);
    this.$emit("created");
  }

  // get name() {
  //   if (this.cpu && this.vmName) {
  //     return `${this.cpu}_${this.vmName}`;
  //   } else {
  //     return "";
  //   }
  // }
}
</script>

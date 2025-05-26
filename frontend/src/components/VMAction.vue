<template>
  <div>
    <template v-if="running === false">
      <v-btn icon text @click="action('start')">
        <v-icon small>fa-play</v-icon>
      </v-btn>
    </template>
    <template v-else>
      <v-btn icon text @click="action('stop')">
        <v-icon small>fa-power-off</v-icon>
      </v-btn>

      <!-- <v-btn icon text @click="action('restart')">
        <v-icon small>fa-sync</v-icon>
      </v-btn> -->
    </template>
    <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn text icon color="primary" dark v-on="on">
            ...
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="action('delete')">
            <v-list-item-icon>
               <v-icon small>fa-trash</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              delete
            </v-list-item-content>
          </v-list-item>
        </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { authFetch } from "@/utils/fetch";

@Component
export default class VMAction extends Vue {
  @Prop(Boolean) readonly running!: boolean;
  @Prop(String) readonly name!: string;
  @Prop(String) readonly host!: string; // 如果你也传了 host

  statusOK = false;
  statusError = false;
  messageOK = "";
  messageError = "";
  error = "";


  async action(action: string) {
    this.$emit("vm-action", action);
  }
}
</script>

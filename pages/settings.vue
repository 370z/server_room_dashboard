<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex sm6 xs12 md6 lg6>
        <v-card>
          <v-card-text>
            Line Token: {{ this.$auth.user.line_token }}
            <form @submit.prevent="updateLineToken()" class="d-flex">
              <v-text-field
                type="text"
                placeholder="Enter Line Token"
                outlined
                clearable
                v-model="line_token"
              ></v-text-field>
              <v-btn type="submit" color="green"> Submit </v-btn>
            </form>
            Temp Notify Setting: {{ this.$auth.user.notify_setting }}
            <v-slider
              v-model="tempNotifyValue"
              max="50"
              step="0.1"
              thumb-label
              ticks
            ></v-slider>
            {{ updateErrorMsg }}
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import materialCard from "~/components/material/AppCard";
export default {
  middleware: ["auth"],
  layout: "dashboard",
  components: {
    materialCard,
  },
  data() {
    return {
      tempNotifyValue: this.$auth.user.notify_setting,
      line_token: "",
      updateErrorMsg: "",
    };
  },
  created() {},
  methods: {
    async updateLineToken() {
      try {
        const response = await this.$axios.$put(
          "http://itdev.cmtc.ac.th:2002/api/v1/updateToken/1",
          {
            line_token: this.line_token,
          }
        );
        if (response.success) {
          this.$auth.fetchUser();
          this.updateErrorMsg = "";
        }
        if (response.status == 404) {
          return this.updateErrorMsg = "กรุณากรอก Line Token";
        }
      } catch (error) {
        if (!error.success) {
          return this.updateErrorMsg = "Line token ไม่ถูกต้อง";
        }
      }
    },
  },
  watch: {
    async tempNotifyValue(value) {
      await this.$axios
        .$put("http://itdev.cmtc.ac.th:2002/api/v1/updateNotify/1", {
          notify_setting: value,
        })
        .then((response) => {
          //   console.log(response);
          this.$auth.fetchUser();
          this.$store.dispatch("sensor/setNotify", value);
          // this.$store.dispatch("app/retrieveLineData");
        });
      //   console.log(value);
    },
  },
};
</script>

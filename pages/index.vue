<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <material-card color="success" elevation="12" title="Login">
            <v-card-text>
              <v-form>
                <v-text-field
                  type="text"
                  v-model="username"
                  prepend-icon="person"
                  name="username"
                  label="Login"
                  placeholder="Enter Username"
                ></v-text-field>
                <v-text-field
                  type="password"
                  v-model="password"
                  prepend-icon="lock"
                  name="password"
                  label="Password"
                  placeholder="Enter Password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-layout justify-center align-center>
                <v-btn color="success" @click.prevent="handleLoginClicked"
                  >Login</v-btn
                >
              </v-layout>
            </v-card-actions>
            {{ loginStatus }}
          </material-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { mapActions } from "vuex";
import materialCard from "~/components/material/AppCard";

export default {
  layout: "auth",
  middleware: 'guest',
  components: {
    materialCard,
  },
  data() {
    return {
      username: "",
      password: "",
      loginStatus: "",
    };
  },
  computed: {
    // isDisabled() {
    //   return (
    //     this.username !== this.defaultUserPassword ||
    //     this.password !== this.defaultUserPassword
    //   );
    // },
  },
  methods: {
    ...mapActions({
      setUsername: "user/setUsername",
    }),
    async handleLoginClicked() {
      try {
        const response = await this.$auth.loginWith("local", {
          data: { username: this.username, password: this.password },
        });
        // console.log(response)
        if (response.data.success) {
          await this.$auth.fetchUser();
          await this.$router.push({ path: "dashboard" });
        }
      } catch (err) {
        if (!err.response.data.success) {
          this.loginStatus = err.response.data.message;
        } else {
          this.loginStatus = err.response.data;
        }
        //console.log(err.response.data.success)
      }
    },
  },
};
</script>

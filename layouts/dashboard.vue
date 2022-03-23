<template>
  <v-app>
    <core-toolbar />

    <core-drawer />

    <core-view />
  </v-app>
</template>

<script>
import coreToolbar from "~/components/core/AppToolbar";
import coreDrawer from "~/components/core/AppDrawer";
import coreView from "~/components/core/AppView";

export default {
  components: {
    coreToolbar,
    coreDrawer,
    coreView,
  },
  data() {
    return {
    };
  },

  methods: {},
};
</script>

<style lang="scss">
/* Remove in 1.2 */
.v-datatable thead th.column.sortable i {
  vertical-align: unset;
}
</style>

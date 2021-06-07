<template>
  <div class="smart-table-header">


    <header-column :columns='$headerLeftColumns' :setting='setting'> </header-column>
    <header-column :columns='$headerCenterColumns' :setting='setting'> </header-column>
    <header-column :columns='$headerRightColumns' :setting='setting'> </header-column>
    
  </div>
</template>

<script>

import utils from './js/utils';
import HeaderColumn from './headerColumn.vue';

export default {

  name: 'smartTableHeader',
  
  props: {
  },

  inject: ['columns', 'setting'],

  components: { HeaderColumn },

  data() {
    return {};
  },

  computed: {

    $headerLeftColumns() {
      return this.columns.leftColumns;
    },

    $headerCenterColumns() {
      return this.columns.centerColumns;
    },

    $headerRightColumns() {
      return this.columns.rightColumns;
    },
  },

  created() {
    this.initHeader();
  },

  methods: {

    initHeader() {
      console.log("table-header------columns-------", this.$headerCenterColumns);
      console.log("table-header------setting-------", this.setting);
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

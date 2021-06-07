<template>
  <div class="smart-table-header">

    <table v-if="$bodyLeftColumns.length > 0" class="table-center" border="0" cellspacing="0" cellpadding="0" style="width: 100%;">
      <col-group :columns="$bodyLeftColumns"></col-group>
      <tbody>
      </tbody>
    </table>

    <table v-if="$bodyCenterColumns.length > 0" class="table-center" border="0" cellspacing="0" cellpadding="0" style="width: 100%;">
      <col-group :columns="$bodyLeftColumns"></col-group>
      <tbody>
      </tbody>
    </table>

    <table v-if="$bodyRightColumns.length > 0" class="table-center" border="0" cellspacing="0" cellpadding="0" style="width: 100%;">
      <col-group :columns="$bodyLeftColumns"></col-group>
      <tbody>
      </tbody>
    </table>
    
  </div>
</template>

<script>

import utils from './js/utils';
import ColGroup from './components/colGroup.vue';
export default {

  name: 'SmartTableBody',
  
  props: {
  },

  inject: ['columns', 'setting'],

  components: { ColGroup },

  data() {
    return {};
  },

  computed: {

    $bodyLeftColumns() {
      return this.columns.leftColumns;
    },

    $bodyCenterColumns() {
      return this.columns.centerColumns;
    },

    $bodyRightColumns() {
      return this.columns.rightColumns;
    },
  },

  created() {
  },

  methods: {

  }
};
</script>
<style lang="scss" scoped>
</style>

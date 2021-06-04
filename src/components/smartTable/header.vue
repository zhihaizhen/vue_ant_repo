<template>
  <div class="smart-table-header">

    <table class="table-center" border="0" cellspacing="0" cellpadding="0" style="width: 100%;">
      <colgroup>
        <col width="127.46666666666667">
        <col width="266.2">
        <col width="266.2">
        <col width="157.46666666666667">
        <col width="266.2">
        <col width="137.46666666666667">
      </colgroup>
      <thead>

        <tr :style="{height: setting.headerHeight+ 'px'}">
          <template v-for="(item, i) in columns">
            <th v-if="item.sorter" class="header-cell sortable-column" :key="i">

              <span class="header-text">{{ item.title }}</span>

              <span class="sorting">
                <i class="top layui-edge layui-table-sort-asc"></i>
                <i class="bottom layui-edge layui-table-sort-desc"></i>
              </span>
            </th>

            <th v-else class="header-cell" :key="i">
              <span class="header-text">{{ item.title }}</span>
            </th>
          </template>
      </tr>
      </thead>
    </table>
    
    
  </div>
</template>

<script>
import utils from './js/utils';
export default {

  name: 'smartTableHeader',
  
  props: {
  },

  inject: ['columns', 'setting'],

  data() {
    return {

      $headerLeftColumns: [],
      $headerCenterColumns: [],
      $headerRightColumns: [],

    };
  },

  created() {
    console.log("table-header------init-------", this.columns, this.setting);
    this.initHeader();
  },

  methods: {

    initHeader() {
      // 
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

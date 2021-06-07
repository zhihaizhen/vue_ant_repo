<template>
  <div class="smart-table-header">

    <table v-if="columns.length > 0" class="table-center" border="0" cellspacing="0" cellpadding="0" style="width: 100%;">
      
      <col-group :columns="columns"></col-group>
      <thead>

        <tr :style="{height: setting.headerHeight+ 'px'}">
          <template v-for="(item, i) in columns">
            <th v-if="item.sortable" class="header-cell sortable-column" :key="i" :style="{ 'text-align': item.align }"> 

              <span class="header-text">{{ item.headerText }}</span>

              <span class="sorting">
                <i class="top layui-edge layui-table-sort-asc"></i>
                <i class="bottom layui-edge layui-table-sort-desc"></i>
              </span>
            </th>

            <th v-else-if="item.isCheckCol" class="header-cell column-check" :key="i"  :style="{ 'text-align': item.align }">

              <span class="header-text">{{ item.headerText }}</span>
              <span >
                <input type="checkbox" title="全选/全不选"/>
              </span>
            </th>

            <th v-else class="header-cell" :key="i"  :style="{ 'text-align': item.align }">
              <span class="header-text">{{ item.headerText }}</span>
            </th>
          </template>
      </tr>
      </thead>
    </table>
    
    
  </div>
</template>

<script>

import ColGroup from './components/colGroup.vue';
export default {

  name: 'SmartTableHeaderColumn',
  props: {

    columns: {

      type: Array,
      default: () => {
        return [];
      }
    },

    setting: {

      type: Object,
      default: () => {
        return {};
      }
    }

  },

  components: { ColGroup },
  data() {
    return {};
  },
  computed: {
  },
  created() {
  },
  methods: {

  }
};
</script>

<style lang="scss" scoped>
  .smart-table-header {

    &.fixed-header {

      position: absolute;
      top: 0;
      z-index: 2;
      width: 100%;
    }

    &.scroll-moving {

      .table-center {
          box-shadow: #191919 0 -3px 15px 2px;
      }
    }

    tr {
      background-color: #d9ecff;
    }

    th.header-cell {

      line-height: 1px;

      .header-text {
          line-height: 12px;
      }
    }
  }
</style>

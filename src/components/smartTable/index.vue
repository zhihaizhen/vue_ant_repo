<template>
  <div class="smart-table-container">

    <table-header></table-header>
    <table-body></table-body>

</div>
</template>

<script>

const config = {

    defaults: { pageSize: 30, headerHeight: 24, rowHeight: 24, footerHeight: 24 },
    direction: { sortingAttrName: 'lay-sort', ascending: 'ASC', ascendingClass: 'asc', descending: 'DESC', descendingClass: 'desc' },
    clsname: {
        component: 'smart-table',
        header: 'smart-table-header',
        headerFixed: 'fixed-header',
        headerCell: 'header-cell',
        body: 'smart-table-body',
        bodyCell: 'body-cell',
        footer: 'smart-table-footer',
        footerCell: 'footer-cell',
        table: { left: 'table-fixed-left', center: 'table-center', right: 'table-fixed-right' },
        sortableCol: 'sortable-column',
        selectedRow: 'selected-row',
        checkedRow: 'checked-row',
        hoverRow: 'hover-row',
        scrollMoving: 'scroll-moving',
    },
    noValue: '---',
    indexCol: 'column-index',
    checkCol: 'column-check',
    tableAreaName: {
        left: 'left',
        center: 'center',
        right: 'right',
    },
    colType: {
        index: 'index',
        check: 'check',
        template: 'template',
        program: 'program',
    },
};

import TableHeader from "./header";
import TableBody from "./body";
import TableColumn from "./js/TableColumn";
import utils from "./js/utils";
export default {

  name: 'SmartTable',
  props: {

    columns: {
      type: Array,
      required: true
    },

    option: {
      type: Object,
      default: () => {
        return config.defaults;
      }
    },

    rowKey: {
      type: String|Function,
      default: () => {
        return '';
      }
    },

    tableData: {
      type: Array,
      default: () => {
        return [];
      }

    }


  },

  computed: {

    setting() {

      const options = this.option;
      const dftConfig = config.defaults;
      return {

        pageSize: options.pageSize >= 1 ? parseInt(options.pageSize) : dftConfig.pageSize,
        headerHeight: options.headerHeight >= 5 ? parseInt(options.headerHeight) : dftConfig.headerHeight,
        rowHeight: options.rowHeight >= 5 ? parseInt(options.rowHeight) : dftConfig.rowHeight,
        footerHeight: options.footerHeight >= 5 ? parseInt(options.footerHeight) : dftConfig.footerHeight,
      };
    }
  },

  components: { TableHeader, TableBody },

  provide() {

    return {

      columns: this.columnsPro,
      setting: this.setting
    }
  },

  data() {

    return {

      /**
       * <string: required> table名称（用于识别已存储个性设置，包括：表格显示列配置、表格导出列配置等），默认 null
       */
      tableName: null,
      /**
       * <string: optional> table显示性质的名称（用于展示，数据导出等），默认 null
       */
      displayName: null,
      /**
       * <object: optional> 记录在table上的任何值
       */
      tag: null,
      /**
       * <booleaan: optional> 是否固定表头，默认 true
       */
      fixHeader: true,
      /**
       * <number: optional> 分页大小，默认 30
       */
      pageSize: 0,
      /**
       * <number: optional> 表头高度，默认 24
       */
      headerHeight: 0,
      /**
       * <number: optional> 数据行高度，默认 24
       */
      rowHeight: 0,
      /**
       * <optional> 汇总栏行高，默认 24
       */
      footerHeight: 0,
      /**
       * <number: optional> 表格最大高度，默认不设置
       */
      maxHeight: null,
      /**
       * <boolean: optional> 是否支持表格列，随着组件的宽度变化给动态的调整列宽，设置为false可防止列宽发生变化，默认 true
       */
      dynamicColumnWidth: true,
      /**
       * <optional> 排序规则
       */
      defaultSorting: { 
          /**
           * <string: optional> 排序字段名称
           */
          prop: null, 
          /**
           * <string: optional> 排序方向
           */
          direction: null 
      },

      /**
       * <Array<String>: optional> 可参与搜索的数据字段名称（该列表，将和各个字段定义的可搜索列进行合并计算）
       */
      searchables: [],
      /**
       * <function(row_data): optional> 行dom元素class
       */
      rowClassMaker: null,
      /**
       * <function(row_data): optional> 行鼠标选中回调
       */
      rowSelected: null,
      /**
       * <function(all_rows_checked: boolean): optional> 所有行选择列勾选（未勾选）回调
       */
      allRowsChecked: null,
      /**
       * <function(row_check: boolean, row_data: Object, table_row_element: HtmlTableRowElement): optional> 行选择列勾选（未勾选）回调
       */
      rowChecked: null,
      /**
       * <function(row_data): optional> 行双击回调
       */
      rowDbClicked: null,
      /**
       * <function(): optional> 表格数据重新填充回调
       */
      refilled: null,
      /**
       * <function(filtered_records_count: Number): optional>过滤数据回调
       */
      recordsFiltered: null,
      /**
       * <function: optional>(暂未支持) 翻页、改变分页大小完成
       */
      pageTurned: null,
      /**
       * <function(column_bound_property_name: String, header_text: String): optional> 表格列发生排序事件，需要执行的回调方法
       */
      columnSorted: null,
      /**
       * <function(row_datas: Array<Object>, column_bound_property_name: String, header_text: String): optional> 自定义数据列汇总方法
       */
      summarize: null,
      /**
       * <function: optional> 服务器端数据获取方法（如果指定，则为服务器分页，在数据列排序时进行调用）
       */
      serverDataRequester: null,
      
      /**
       * <boolean: optional> 是否对缺省值单元格的内容，用占位符填充，默认true
       */
      showNoValePlaeholder: true,

      columnsPro: {

        /**
         * <Array<TableColumn>: optional> 左固定列
         */
        leftColumns: [],

        /**
         * <Array<TableColumn>: optional> 右固定列
         */
        rightColumns: [],

        /**
         * <Array<TableColumn>: optional> 中间列
         */
        centerColumns: [],

      },

      config: config
    };
  },

  created() {

    this.init();
  },

  methods: {

    init() {

      this._compileColumns();
    },

    /**
     * 根据用户配置的columns构造表格信息
     */
    _compileColumns() {

      const useless_table_column = new TableColumn(null, null, -1);
      const index_col_info = { defined: false, fixed: null, tcol: useless_table_column };
      const check_cols_info = { defined: false, fixed: null, tcol: useless_table_column };

      try {

        for(let idx = 0; idx < this.columns.length; idx++) {

          let $the_col = this.columns[idx];
          let prop_col_type = $the_col.type ? $the_col.type.trim() : '';
          let is_index_col = prop_col_type == config.colType.index;
          let is_check_col = prop_col_type == config.colType.check;
          let prop_fixed = $the_col.fixed ? $the_col.fixed.trim() : '';;
          let new_col;

          if (is_index_col) {

            // 序号列最多仅一列
            if (index_col_info.defined) {
                continue;
            }

            new_col = new TableColumn(config.tableAreaName.left, this, -1);
            index_col_info.defined = true;
            index_col_info.fixed = prop_fixed;
            index_col_info.tcol = new_col;
          }
          else if (is_check_col) {

            // 选择列最多仅一列
            if (check_cols_info.defined) {
                continue;
            }

            new_col = new TableColumn(config.tableAreaName.left, this, -1);
            check_cols_info.defined = true;
            check_cols_info.fixed = prop_fixed;
            check_cols_info.tcol = new_col;
          }
          else if (prop_fixed === config.tableAreaName.left || utils.treateAsTrue(prop_fixed)) {

              new_col = new TableColumn(config.tableAreaName.left, this, -1);
              this.columnsPro.leftColumns.push(new_col);
          }
          else if (prop_fixed === config.tableAreaName.right) {

              new_col = new TableColumn(config.tableAreaName.right, this, -1);
              this.columnsPro.rightColumns.push(new_col);
          }
          else {
              // 最后剩下默认为中间可活动列
              new_col = new TableColumn(config.tableAreaName.center, this, -1);
              this.columnsPro.centerColumns.push(new_col);
          }

          // 获取列定义信息，编译为列属性
          new_col.compile($the_col, this);

        }

        if (index_col_info.defined) {

            /**
             * 决定序号列添加位置
             */

            if (index_col_info.fixed === config.tableAreaName.left || utils.treateAsTrue(index_col_info.fixed)) {
                this.columnsPro.leftColumns.unshift(index_col_info.tcol);
            }
            else {
                this.columnsPro.centerColumns.unshift(index_col_info.tcol);
            }
        }

        if (check_cols_info.defined) {
            
            /**
             * 决定选择列添加位置
             */

            if (check_cols_info.fixed === config.tableAreaName.left || utils.treateAsTrue(check_cols_info.fixed)) {
                this.columnsPro.leftColumns.unshift(check_cols_info.tcol);
            }
            else {
                this.columnsPro.centerColumns.unshift(check_cols_info.tcol);
            }
        }

        /**
         * 为中间活动列表添加左右的占位列
         * @param {Array<TableColumn>} columns
         */
        var addEmptyCol = (columns, is_left) => {
            this.columns.forEach(the_col => {
                let empty_col = new TableColumn(config.tableAreaName.center, null, -1);
                empty_col.compile2Empty(the_col);
                is_left ? this.columnsPro.centerColumns.unshift(empty_col) : this.columnsPro.centerColumns.push(empty_col);
            });
        };

        /**
         * 对中间活动列表，分别添加固定左右侧的占位列
         */

        if (this.columnsPro.leftColumns.length > 0) {
            addEmptyCol(this.columnsPro.leftColumns, true);
        }

        if (this.columnsPro.rightColumns.length > 0) {
            addEmptyCol(this.columnsPro.rightColumns, false);
        }

        // 对左中右三种列进行重新编号
        this.columnsPro.leftColumns.forEach((col, col_idx) => { col.columnIdx = col_idx + 1; });
        this.columnsPro.centerColumns.forEach((col, col_idx) => { col.columnIdx = col_idx + 1; });
        this.columnsPro.rightColumns.forEach((col, col_idx) => { col.columnIdx = col_idx + 1; });

        console.log("columns-----leftColumns----", this.columnsPro.leftColumns);
        console.log("columns-----centerColumns----", this.columnsPro.centerColumns);
        console.log("columns-----rightColumns----", this.columnsPro.rightColumns);

      }
      catch(ex) {

        throw ex;
      }
    },

  },


};
</script>
<style lang="scss">

  .smart-table-container {

     position: relative;
    box-sizing: border-box;
    width: 100%;
    border-top: 1px solid #e6e6e6;
    border-left: 1px solid #e6e6e6;
    overflow: auto;

    .table-fixed-left {

        position: absolute;
        left: 0;
        z-index: 1;

        &.scroll-moving {
            box-shadow: #191919 -2px 0 15px -5px;
        }
    }
    
    .table-center {
        width: 100%;
    }

    .table-fixed-right {

        position: absolute;
        right: 0;
        z-index: 2;

        &.scroll-moving {
            box-shadow: #191919 5px 0 15px -2px;
        }
    }

    table {

        table-layout: fixed;
        width: unset;
        border-collapse: collapse;

        th,
        td {
            box-sizing: border-box;
            padding-left: 5px;
            padding-right: 15px;
            white-space: nowrap;
            overflow: hidden;
            border-right: 1px solid #e6e6e6;
            border-bottom: 1px solid #e6e6e6;
        }

        th {
            text-align: left;

            &.sortable-column {

                cursor: pointer;
                user-select: none;
            }
        }

        th:first-child,
        td:first-child {
            padding-left: 10px;
        }
        
        th.column-check input,
        td.column-check input {

            width: 14px;
            height: 14px;
            margin: 0;
            position: relative;
            top: 3px;
        }
    }

    .cell-tooltip {

        position: fixed;
        z-index: 999;
        display: block;
        padding: 5px;
        background-color: white;
        border: 2px solid black;
        border-radius: 5px;

        * {
            color: black;
        }
    }
    
    .config-panel {

        position: fixed;
        right: 5px;
        top: 40px;
        z-index: 99;
        border: 2px solid white;
        border-radius: 5px;
        background-color: #423838;
        overflow: hidden;

        .btn {

            display: block;
            float: right;
            margin-left: 5px;
            margin-top: 3px;
            border: 1px solid #0e1218;
            background-image: linear-gradient(-180deg, #3e8aff 0%, #135fd5 100%);
            border-radius: 3px;
            cursor: pointer;
        }

        .content-container {

            max-height: 300px;
            overflow: auto;
            box-sizing: border-box;
            padding: 10px 5px;

            .btn {

                margin-top: -3px;
                padding: 2px 5px 3px 5px;
                line-height: 16px;
            }
        }

        .panel-boolbar {

            background-color: black;
            height: 30px;
            line-height: 30px;
            padding-right: 10px;

            .tab-item {

                display: inline-block;
                height: 100%;
                padding-left: 10px;
                padding-right: 10px;
                background-color: #8c95a2;
                cursor: pointer;

                &.focused {
                    background-color: #423838;
                }
            }

            .btn {
        
                padding: 3px 6px 5px 6px;
                line-height: 16px;
            }
        }

        .column-list-panel {
            width: 240px;
        }

        .checkbox-item {

            display: block;
            overflow: hidden;

            > input {

                width: 16px;
                height: 16px;
            }

            > span {

                padding-left: 5px;
                position: relative;
                top: -3px;
                font-size: 14px;
            }
        }
    }

  }
</style>

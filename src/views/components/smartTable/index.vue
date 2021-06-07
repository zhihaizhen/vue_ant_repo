<template>
  <div class="table-wrapper">
    <a-card :hoverable="true" :bordered="false">
      <smart-table
        :tableData="tableData"
        :columns="tableHead"
        :loading="loading"
        rowKey="id"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: handleSelect }"
        @changeCurrent="handleChangeCurrent"
      >
        <div slot="index" slot-scope="{ index }">
          {{ index + 1 }}
        </div>
        <div slot="money" slot-scope="{ text }">¥ {{ text }}</div>
        <div slot="action" slot-scope="{ text }">
          <a-button type="primary" size="small" @click="handleEdit(text)">
            编辑
          </a-button>
          <a-popconfirm title="你确定要删除当前列吗?" ok-text="是" cancel-text="否" @confirm="handleDelete(text)">
            <a-button type="danger" size="small" style="margin-left:8px">
              删除
            </a-button>
          </a-popconfirm>
        </div>
      </smart-table>
    </a-card>
  </div>
</template>

<script>

import smartTable from '@/components/smartTable/index';
import { getTableData, deleteTable, batchDeleteTable, editTable } from '@/api/table';
import { formatJson } from '@/utils';
export default {

  name: 'smartTables',
  components: { smartTable },

  data() {
    return {
      typeOption: [
        {
          key: '待付款',
          label: '待付款'
        },
        {
          key: '待发货',
          label: '待发货'
        },
        {
          key: '已发货',
          label: '已发货'
        },
        {
          key: '已收货',
          label: '已收货'
        },
        {
          key: '已评价',
          label: '已评价'
        }
      ],
      tableHead: [
        {
          label: '序号',
          prop: 'index',
          scopedSlots: { customRender: 'index' },
          width: 60
        },
        {
          label: '用户id',
          prop: 'id',
          sortable: true,
        },
        {
          label: '付款人',
          prop: 'name'
        },
        {
          label: '订单状态',
          prop: 'status'
        },
        {
          label: '下单时间',
          prop: 'date',
          sortable: true,
        },
        {
          label: '付款金额',
          prop: 'money',
          scopedSlots: { customRender: 'money' }
        },
        {
          label: '备注',
          prop: 'text'
        },
        {
          label: '操作',
          prop: 'id',
          scopedSlots: { customRender: 'action' },
          width: 140,
          align: 'right'
        }
      ],
      tableData: [],
      loading: false,
      selectedRowKeys: [],
      selectValue: [],
      currentEdit: {},
      editShow: false,
      filterList: {
        name: '',
        status: '',
        page: 1,
        size: 15,
        total: 0
      },
      deleteLoading: false,
      exportLoading: false
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    handleSelect(key, value) {
      this.selectedRowKeys = key;
      this.selectValue = value;
    },

    getTableData() {
      this.loading = true;
      const { name, status, page, size } = this.filterList;
      getTableData({ page, size, name, status }).then(res => {
        const data = res.data || {};
        this.filterList.total = data.total || 0;
        this.tableData = data.list || [];

        console.log("tableData------", this.tableData);
        this.loading = false;
      });
    },

    changeStatus(val) {
      this.filterList.status = val;
    },

    handleChangeCurrent(val) {
      this.filterList.page = val;
      this.getTableData();
    },

    search() {
      this.filterList.page = 1;
      this.getTableData();
    },

    handleEdit(val) {
      this.currentEdit = { ...val };
      this.editShow = true;
    },

    handleDelete(val) {
      const { id } = val;
      deleteTable({ id }).then(res => {
        this.getTableData();
        this.$message.success('删除成功');
      });
    },

    batchDeleteTable() {
      //模拟删除
      if (this.selectValue.length == 0) {
        this.$message.warning('请至少勾选一项');
        return;
      }
      this.deleteLoading = true;
      const batchId = this.selectValue.map(item => item.id).join(',');
      batchDeleteTable({ batchId }).then(res => {
        this.getTableData();
        this.$message.success('批量删除成功');
        this.deleteLoading = false;
      });
    },

    handleOk() {
      const { id, text } = this.currentEdit;
      editTable({ id, text }).then(res => {
        this.$message.success('修改成功！');
        this.editShow = false;
        this.getTableData();
      });
    },

    //导出
    handleExport() {
      //由于是前端导出，所以只能导出当前的页的15条数据
      this.exportLoading = true;
      import('@/vendor/Export2Excel').then(excel => {
        const header = [],
          filterVal = [];
        this.tableHead.forEach(item => {
          if (item.title != '操作' && item.title != '序号') {
            header.push(item.title);
            filterVal.push(item.dataIndex);
          }
        });
        const data = formatJson(this.tableData, filterVal);

        excel.export_json_to_excel({
          header,
          data,
          filename: '表单统计'
        });
        this.exportLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>

.table-wrapper {
  width: 100%;
  height: 100%;
  position: relative;

  .filter-wrapper {

    width: 230px;
    .label {
      min-width: 80px;
    }
    .select-width {
      width: 150px;
    }
  }
}
</style>

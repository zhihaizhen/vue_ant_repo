<template>
  <a-card title="K-line" :hoverable="true" :bordered="false">
    <div id="trading-view"></div>
  </a-card>
</template>
<script>

import { createChart } from 'lightweight-charts';

import request from '@/utils/request';
export default {
  components: {},
  data() {
    return {
      loading: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {

      let data = request.post('/tradingView/getChartData', data);
      console.log("chartData-0------", data);

      const chart = createChart(document.getElementById("trading-view"), { width: 800, height: 300 });
      const lineSeries = chart.addLineSeries();
      lineSeries.setData([
          { time: '2019-04-11', value: 80.01 },
          { time: '2019-04-12', value: 96.63 },
          { time: '2019-04-13', value: 76.64 },
          { time: '2019-04-14', value: 81.89 },
          { time: '2019-04-15', value: 74.43 },
          { time: '2019-04-16', value: 80.01 },
          { time: '2019-04-17', value: 96.63 },
          { time: '2019-04-18', value: 76.64 },
          { time: '2019-04-19', value: 81.89 },
          { time: '2019-04-20', value: 74.43 },
      ]);
    }
  }
};
</script>

const Mock = require('mockjs');

let dataList = [];

for (let i = 0; i < 10; i++) {
  dataList.push(
    // Mock.mock({
    //   id: '@natural(1000000,99999999)',
    //   name: '@first',
    //   'status|1': ['待付款', '待发货', '已发货', '已收货', '已评价'],
    //   date: Mock.Random.datetime(),
    //   'text|1': ['快点到，越快越好', '请尽快发货', '尽量轻拿轻放', '到了打电话', ''],
    //   money: '@natural(50,3500)'
    // })

    [
      new Date().getTime(),
      Mock.mock('@float(100, 1000, 2, 2)'),
      Mock.mock('@float(100, 1000, 2, 2)'),
      Mock.mock('@float(100, 1000, 2, 2)'),
      Mock.mock('@float(100, 1000, 2, 2)'),
      Mock.mock('@float(10, 100, 2, 2)'),
      Mock.mock('@float(100, 1000, 2, 5)'),
    ]
  );
}


module.exports = [
  {
    url: '/tradingView/getChartData',
    type: 'post',
    response: config => {

      return {
        data: {
          records: dataList,
          interval: "15min",
          market: "btc_usdt",
        },
        code: 200,
        info: 'success',
        message: 'chart数据获取成功！'
      };
    }
  },
];

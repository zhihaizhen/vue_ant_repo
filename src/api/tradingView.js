import request from '@/utils/request';

/**
 * @description  获取k线数据
 * @returns {Object}
 */

export function getKLineData(data) {
  return request.post('/tradingView/getChartData', data);
}

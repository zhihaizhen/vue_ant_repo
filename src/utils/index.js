import { Result } from 'ant-design-vue';
import remoteLoad from './remoteLoad';
const { AMapCDN, AMapUiCDN } = require('@/plugins/cdn');

/**
 * 用于将地址后面的参数转换成对象返回
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  );
}

/**
 * 函数防抖
 * @param {Function} func
 * @param {number} delay
 * @param {boolean} immediate
 * @return {*}
 */

export function debounce(func, delay, immediate = false) {
  let timer,
    context = this;
  return (...args) => {
    if (immediate) {
      func.apply(context, args);
      immediate = false;
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

/**
 * 获取geoJson数据  通过高德获取    递归获取区县geoJson
 * @param  {string} adcode  行政区code
 * @param  {string} childAdcode 区县级行政区code
 * @return {Array}
 */
export function getGeoJson(adcode, childAdcode = '') {
  return new Promise((resolve, reject) => {
    if (window.AMap && window.AMapUI) {
      insideFun(adcode, childAdcode);
    } else {
      remoteLoad(AMapCDN).then(() => {
        if (window.AMap) {
          remoteLoad(AMapUiCDN).then(() => {
            if (window.AMapUI) {
              insideFun(adcode, childAdcode);
            } else {
              console.error('AMapUI获取失败');
            }
          });
        } else {
          console.error('AMap获取失败');
        }
      });
    }
    function insideFun(adcode, childAdcode) {
      // eslint-disable-next-line
      AMapUI.loadUI(['geo/DistrictExplorer'], DistrictExplorer => {
        var districtExplorer = new DistrictExplorer();
        districtExplorer.loadAreaNode(adcode, function(error, areaNode) {
          if (error) {
            console.error(error);
            reject(error);
            return;
          }
          let Json = areaNode.getSubFeatures();
          if (Json.length === 0) {
            let parent = areaNode._data.geoData.parent.properties.acroutes;
            insideFun(parent[parent.length - 1], adcode);
            return;
          }

          if (childAdcode) {
            Json = Json.filter(item => {
              return item.properties.adcode == childAdcode;
            });
          }
          let mapJson = {
            features: Json
          };
          resolve(mapJson);
        });
      });
    }
  });
}

/**
 * 转换JSON  导出
 * @param  {Array}
 * @return {Array}
 */

export function formatJson(arr, filterVal) {
  return arr.map(v => filterVal.map(j => v[j].toString()));
}

export function getYearMonthDay(date) {

  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  return {year, month, day};
}

export function getDate(year, month, day) {

  return new Date(year, month, day);
}



/**
 * 加强版节流
 * @param {Function} func 
 * @param {Number} wait 
 */
export function throttlePro(func, wait) {

  if(typeof func != 'function') throw new TypeError('func must be a function!');
  wait = +wait;
  if (isNaN(wait)) wait = 300;
  let timer = null,
      previous = 0;
      result;

  return function proxy(...params) {

    let now = +new Date,
    remaining = wait - (now - previous),
    self = this;

    if (remaining <= 0) {

      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      previous = now;
      result = func.apply(self, params);
      return result;
    }

    if (!timer) {

      timer = setTimeout(() => {

        clearTimeout(timer);
        timer = null;
        previous = +new Date;
        result = func.apply(self, params);
      }, remaining);
    };

    return result;
  };
}


/**
 * 加强版防抖
 * @param {Function} func 
 * @param {Number} wait 
 * @param {Boolean} immediate 
 */
export function debouncePro(func, wait, immediate) {

    if (typeof func != 'function') throw new TypeError('func must be a function');
    if (typeof wait === 'undefined') {
      wait = 500;
      immediate = false;
    }

    if (typeof wait === 'boolean') {

      immediate = wait;
      wait = 500;
    }

    if (typeof immediate === 'undefined') {
      immediate = false;
    }

    if (typeof wait !== 'number') throw new TypeError('wait must be a number!');
    if (typeof immediate !== 'boolean') throw new TypeError('immediate must be a Boolean!');

    let timer = null, result;

    return function proxy(...params) {

      let self = this,
      callNow = !timer && immediate;
      if (timer) clearTimeout(timer); 
      timer = setTimeout(() => {

        clearTimeout(timer);
        timer = null;
        if (!immediate) result = func.apply(self, params);
      }, wait);

      if (callNow) result = func.apply(self, params);
      return result;

    }
}
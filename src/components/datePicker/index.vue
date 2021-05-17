<template>

    <!--基于原生js封装的日历组件-->
    <div v-click-outside>

        <input class="text-input" type="text" :value="formatDate">
        <div class="panel" v-if="isVisible">

            <div class="pannel-nav">

                <span @click="preYear">&lt;</span>
                <span @click="preMonth">&lt;&lt;</span>
                <span>{{currentTime.year}}年</span>
                <span>{{currentTime.month + 1}}月</span>
                <span @click="nextMonth">&gt;&gt;</span>
                <span @click="nextYear">&gt;</span>
            </div>

            <div class="pannel-content">

                <div class="days">

                    <span class="cell" v-for="j in 7" :key="'_'+j">
                        {{ weekDays[j - 1] }}
                    </span>

                    <div v-for="i in 6" :key="i">

                        <span class="cell cell-day" v-for="j in 7" :key="j"
                            @click="handleChoose(visibeDays[(i-1) * 7 + (j-1)])"
                            :class="[ { notCurrentMonth: !isCurrentMonth(visibeDays[(i-1) * 7 + (j-1)]) },
                                      { currentDay: isCurrentDay(visibeDays[(i-1) * 7 + (j-1)]) },
                                      { currentSelect: isSelectDay(visibeDays[(i-1) * 7 + (j-1)]) }   ]"
                            >

                            {{ visibeDays[(i-1) * 7 + (j-1)].getDate() }}
                        </span>
                    </div>
                    
                </div>
            </div>

            <div class="pannel-footer">
                今天
            </div>
            
        </div>
    </div>
</template>

<script>

    import { getYearMonthDay, getDate } from '@/utils/index';

    export default {

        name: 'DatePicker',

        directives: {

            clickOutside: {
                bind(el, bindings, vnode) {
                    
                    // 把事件绑定给document上，看一下点击的是否是当前这个元素内部
                    let handler = (e) => {

                        if(el.contains(e.target)) {
                            
                            // 判断一下是否当前面板已经显示出来
                            if(!vnode.context.isVisible) {
                                vnode.context.handleFocus();
                            }
                          
                        }
                        else {

                            if(vnode.context.isVisible) {
                                vnode.context.handleBlur();
                            }
                            
                        }
                    }

                    el.handler = handler;
                    document.addEventListener('click', handler);
                },

                unbind(el) {

                    document.removeEventListener('click', el.handler);
                }
            }
        },

        data() {

            let {year, month} = getYearMonthDay(this.value);
            return{

                weekDays: ['日', '一', '二', '三', '四', '五', '六'],
                currentTime: {year, month},
                isVisible: false
            }
        },

        props: {

            value: {

                type: Date,
                default: () => new Date()
            }
        },
        
        computed: {

            visibeDays() {

                let {year, month} = getYearMonthDay(getDate(this.currentTime.year, this.currentTime.month, 1));
                let currentFirstDay = getDate(year, month, 1);
                let week = currentFirstDay.getDay();
                let startDay = currentFirstDay - week * 60 * 60 * 1000 * 24;
                let arr = [];
                for(let i =0; i<42; i++) {
                    arr.push(new Date(startDay + i * 60 * 60 * 1000 * 24 ));
                }
                return arr;
            },
           
            formatDate() {

                let {year, month, day} = getYearMonthDay(this.value);
                return `${year}-${month}-${day}`;
            }
        },

        methods: {

            handleChoose(day) {
                
                this.currentTime = getYearMonthDay(day);
                this.$emit('input', day);
                this.handleBlur();
            },

            isCurrentMonth(date) {

                let {year, month} = getYearMonthDay(getDate(this.currentTime.year, this.currentTime.month, 1));
                let {year: y, month: m} = getYearMonthDay(date);
                return year === y && month === m;
            },

            isCurrentDay(date) {

                let {year, month, day} = getYearMonthDay(new Date());
                let {year: y, month: m, day: d} = getYearMonthDay(date);
                return year === y && month === m && day === d;
            },

            isSelectDay(date) {

                let {year, month, day} = getYearMonthDay(this.value);
                let {year: y, month: m, day: d} = getYearMonthDay(date);
                return year === y && month === m && day === d;
            },
            handleFocus() {
              this.isVisible = true;
            },

            handleBlur() {
              this.isVisible = false;
            },

            preYear() {
                this.currentTime.year--;
            },

            preMonth() {

                let d = getDate(this.currentTime.year, this.currentTime.month, 1);
                d.setMonth(d.getMonth() - 1);
                this.currentTime = getYearMonthDay(d);
            },

            nextMonth() {
                this.currentTime.month++;
            },

            nextYear() {
                this.currentTime.year++;
            }

          
        }
    };
</script>

<style lang="scss">

    .text-input{
        width: 100%;
    }
    
    .panel {

        position: absolute;
        width: 32*7px;
        background: #fff;
        box-shadow: 2px 2px 2px pink, -2px -2px 2px pink;
        z-index: 9999;

        .pannel-nav{
            height: 30px;
            display: flex;
            justify-content: space-around;
            span{
                cursor: pointer;
                user-select: none;
            }
        } 
            
        .pannel-content{


            .cell{

                width: 32px;
                height: 32px;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                font-weight: bold;
                box-sizing: border-box;
            }

            .cell-day:hover, .currentSelect {
                border: 1px solid pink;
            }
            
        }

        .pannel-footer {

            height: 30px;
            text-align: center;
        }

        .notCurrentMonth {
            color: rgb(184, 184, 192);
        }

        .currentDay {

            background: red;
            color: #fff;
            border-radius: 4px;
        }
    }
        
</style>

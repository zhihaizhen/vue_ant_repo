<template>
    <div id="tv_chart_pro" class="chart-area-main bg-white" style="width: 100%; height: 500px"></div>
</template>
<script>

    import { HmsTradingView } from "@/plugins/tradingView";
    export default {
        props : {
        },
        data () {
            return {
                taskInterval : null,
                taskTime : 0
            }
        },
        watch : {
        },
        computed : {
        },
        mounted() {
            this.init();
        },
        methods : {
            init() {
                //不加setTimeout会导致取不到配置
                setTimeout(function () {

                    let options = {
                        containerId : "tv_chart_pro",
                        market : "btc_usdt",
                        theme: "Dark",
                        mConfig : {},
                        isXT3: true
                    }
                    let tradingView = new HmsTradingView();
                    tradingView.init(options);
                    // _Chart.init(options);
                }, 0)
            },
        },
        
        beforeDestroy() {
        }
    }
</script>

<style lang="sass" scoped>

</style>

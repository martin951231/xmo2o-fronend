<template>
    <a-tabs type="card" @change="callback">
        <a-tab-pane key="1" tab="文旅">
            <ticket-goods ref="ticketGoods"></ticket-goods>
        </a-tab-pane>
        <a-tab-pane key="2" tab="体育">
            <sport-goods ref="sportGoods"></sport-goods>
        </a-tab-pane>
        <a-tab-pane key="3" tab="快店">
            <shop-goods ref="shopGoods"></shop-goods>
        </a-tab-pane>
        <a-tab-pane key="4" tab="商城">
            <mall-goods ref="mallGoods"></mall-goods>
        </a-tab-pane>
    </a-tabs>
</template>

<script>
    import TicketGoods from "./modules/ticketGoods";
    import SportGoods from "./modules/sportGoods";
    import ShopGoods from "./modules/ShopGoods";
    import MallGoods from "./modules/MallGoods";
    export default {
        name: "PlatformRecommendHot",
        components: {MallGoods, ShopGoods, SportGoods, TicketGoods},
        data() {
            return {

            }
        },
        mounted() {
            this.callback(1)
        },
        created() {
            this.callback(1)
        },
        methods: {
            callback(key) {
                var _this = this
                if(key*1==1){
                    this.$nextTick(() => {
                        _this.$refs.ticketGoods.getOpen()
                    })
                }else if(key*1==2){
                    this.$nextTick(() => {
                        _this.$refs.sportGoods.getOpen()
                    })
                }else if(key*1==3){
                    this.$nextTick(() => {
                        _this.$refs.shopGoods.getOpen()
                    })
                }else{
                    this.$nextTick(() => {
                        _this.$refs.mallGoods.getOpen()
                    })
                }
            },
            getData(gid) {
                this.request(configPlatformApi.configData, { gid: gid }, 'get').then((res) => {
                    this.groupList = res.group_list
                    this.configTab = res.config_list
                })
            },
            // 监听上传数据变化
            uploadChange(e) {
                const name = e.name
                let iv = ''
                if (e.value.length) {
                    const file = e.value[0]
                    iv = file.response && file.response.data
                }
                this.form.getFieldDecorator(name, { initialValue: iv })
            },
        },
    }
    // 提交数据
    window.dialogConfirm = () => {
                // 最后的数据
                console.log('Received values of form:1313213213 ')
    }
    window.dialogCancel = () => {//关闭取消

    }
</script>

<style scoped>

</style>
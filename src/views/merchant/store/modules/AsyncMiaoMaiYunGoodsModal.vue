<template>
    <a-modal :title="title" v-model="visible" :footer="null" destroyOnClose @cancel="cancel">
        <div class="flex flex-column align-center">
            <a-progress type="circle" :percent="percent" />
            <div class="mt-20"></div>
            <a-alert :message="btnText" :type="percent >= 100?'success':'info'" v-if="btnText" />
            <a-button class="mt-20" type="primary" @click="asyncMiaoMaiYunGoods" :disabled="timer?true:false">{{L('开始同步')}}</a-button>
        </div>
    </a-modal>
</template>

<script>
export default {
    data() {
        return {
            title: '',
            visible: false,
            timer: null,
            store_id: '',
            percent: 0,
            btnText: '',
        }
    },
    methods: {
        open(title, visible, store_id) {
            this.visible = visible
            this.store_id = store_id
            this.title = title || this.L('淼迈云商品同步')
            this.percent = 0
            this.btnText = ''
            clearTimeout(this.timer)
            this.timer = null
        },
        //同步商品
        asyncMiaoMaiYunGoods() {
            this.request('/merchant/merchant.MerchantShopManagement/miaoMaiGoodsSync', {
                store_id: this.store_id,
            }).then((res) => {
                if (res.retval.status == 1) {
                    this.btnText = this.L('正在同步，请耐心等待...')
                }
                if (res.retval.percent) {
                    this.percent = res.retval.percent
                }
                if (res.retval.status == 2) {
                    this.btnText = res.retval.msg
                    clearTimeout(this.timer)
                    this.timer = null
                    return
                }
                if (!this.timer) {
                    this.timer = setInterval(() => {
                        this.asyncMiaoMaiYunGoods()
                    }, 1000)
                }
            })
        },
        cancel() {
            clearTimeout(this.timer)
        },
    },
    beforeDestroy() {
        clearTimeout(this.timer)
    },
}
</script>
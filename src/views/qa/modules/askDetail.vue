<template>
    <a-modal :title="title" :width="600" :visible="visible" @cancel="handleCancel" footer="">
        <div class="main" v-for="d in records" :key="d.id">
            <div style="flex-basis:30px" class="font_bold">
                <span class="red" v-if="d.is_ask == 1">问</span>
                <span class="blue" v-else>答</span>
            </div>
            <div style="flex-grow:10;display: flex">
                <div style="flex-basis: 50px">
                    <img class="avatar" :src="d.avatar"/>
                </div>
                <div style="flex-grow: 10">
                    <div class="font_bold div-margin">{{ d.nickname }}</div>
                    <div class="div-margin">{{ d.create_time }}</div>
                    <div class="div-margin">{{ d.content }}</div>
                    <div class="div-margin">
                        <a-popover placement="right" v-for="image in d.images">
                            <template slot="content">
                                <img class="goods-image-big" :src="image"/>
                            </template>
                            <img class="goods-image" :src="image"/>
                        </a-popover>
                    </div>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script>
    import qaApi from '@/api/qa'

    export default {
        name: "askDetail",
        data() {
            return {
                title: '详情',
                visible: false,
                records: []
            };
        },
        methods: {
            detail(id,channel='') {
                this.visible = true;
                this.request(channel == 'platform' ? qaApi.showDetail : qaApi.askDetail, {id: id}).then((res) => {
                    this.records = res;
                })
            },
            handleCancel() {
                this.visible = false;
            },
        }
    }
</script>

<style scoped>
    .main {
        display: flex;
        margin-bottom: 10px;
    }
    .main div{
        padding: 2px auto;
    }
    .goods-image {
        width: 48px;
        margin-right: 5px;
        height: 48px;
    }
    .font_bold{
        font-weight: bold;
    }
    .red{
        color: red;
    }
    .blue{
        color: blue;
    }
    .avatar{
        width: 35px;
        border-radius: 35px
    }
    .div-margin{
        margin-bottom: 5px;
    }
</style>
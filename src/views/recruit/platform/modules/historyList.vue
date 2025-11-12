<template>
    <a-modal :title="title" :width="640" :visible="visible" @cancel="handleCancel">
        <a-timeline>
            <a-timeline-item  v-for="item in data" :key="item.id">
                <a-row :gutter="4">
                    <a-col :span="24">
                       <span>
                           {{item.name}}
                       </span>
                    </a-col>
                    <a-col :span="24" v-if="item.remark">
                        <span>
                           {{item.remark}}
                        </span>
                    </a-col>
                    <a-col :span="24">
                        <span style="color: lightgrey">
                            {{item.update_time}}
                        </span>
                    </a-col>
                </a-row>
            </a-timeline-item>
        </a-timeline>
        <template slot="footer">
            <a-button key="back" @click="handleCancel">{{ L('取消') }}</a-button>
            <a-button key="submit" type="primary" @click="handleSubmit">{{ L('确定') }}</a-button>
        </template>
    </a-modal>
</template>

<script>
    import recruitMerchantApi from '@/api/recruit/platform/index'

    export default {
        name: "historyList",
        data() {
            return {
                title: "历史记录",
                visible: false,
                data: [],
            }
        },
        methods: {
            getList(id, deliver_id) {
                this.visible = true
                this.data = []
                let param = {
                    resume_id: id,
                    deliver_id: deliver_id
                }
                this.request(recruitMerchantApi.getLibMsgLIst, param).then((res) => {
                    this.data = res
                })
            },
            handleCancel() {
                this.visible = false
            },
            handleSubmit() {
                this.visible = false
            },
        }
    }
</script>

<style scoped>

</style>
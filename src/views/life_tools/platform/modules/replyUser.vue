<template>
    <a-modal :title="title" :visible="visible" width="350px" @cancel="handleCancle" @ok="handleSubmit">
        <a-form>
            <a-form-item label="回复">
                <a-textarea
                        v-model="detail.reply_content"
                        placeholder="请输入回复内容"
                        :auto-size="{ minRows: 6, maxRows: 10 }"
                />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
    import lifeToolsPlatformApi from '@/api/life_tools/platform/index'

    export default {
        name: "replyUser",
        data() {
            return {
                visible: false,
                title: '回复评价',
                detail: {
                    id: 0,
                    reply_content: '',
                }
            }
        },
        methods: {
            handleCancle() {
                this.visible = false
            },
            handleSubmit(e) {
                this.request(lifeToolsPlatformApi.subReply, this.detail).then((res) => {
                    this.visible = false
                    this.$emit('getDataListReset')
                })
            },
            reply(id) {
                this.detail.id = id
                this.request(lifeToolsPlatformApi.getReplyContent, {id: id}).then((res) => {
                    this.visible = true
                    this.detail.reply_content = res.reply_content
                })
            },
        }
    }
</script>

<style scoped>

</style>
<template>
  <div class="online_file">
    <attachment-list source-type="room" :source-id="roomId" :readonly="false" upload-path="houseRoomAttachment" />
  </div>
</template>

<script>
    import { defineComponent } from '@vue/composition-api'
    import AttachmentList from '../../components/AttachmentList.vue'

    export default defineComponent({
        components: {
            AttachmentList
        },
        props: {
            roomParams: {
                type: Object,
                default: () => { return {} }
            },
            roomId: {
                type: [String, Number],
                defalut: ''
            }
        }
    })
</script>

<style lang="less" scoped>
.online_file {
    padding: 12px 0;
}
</style>

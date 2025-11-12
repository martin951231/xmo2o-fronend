/**
*******************
*   @author 郑亚莉
*   @date 2020-05-28
*   @description 富文本
*******************
*/
<template>
    <div class="rich-text">
        <vue-ueditor-wrap v-if="showRich" v-model="infoData" :config="myConfig"></vue-ueditor-wrap>
    </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
let _this = null
export default {
    name: 'RichText',
    components: {
        VueUeditorWrap,
    },
    data() {
        return {
            infoData: '',
            myConfig: {
                enableAutoSave: false,
                autoSyncData: false,
                // 编辑器不自动被内容撑高
                autoHeightEnabled: false,
                // 初始容器高度
                initialFrameHeight: 240,
                // 初始容器宽度
                initialFrameWidth: '100%',
                // 上传文件接口
                serverUrl: '/v20/public/static/UEditor/php/controller.php',
                // UEditor 文件存放位置
                UEDITOR_HOME_URL: '/v20/public/static/UEditor/',
            },
            showRich:false
        }
    },
    props: {
        info: {
            type: String,
            default: '',
        },
        width: {
            type: [String, Number],
            default: '100%',
        },
        height: {
            type: [String, Number],
            default: 240,
        },
        autoHeight: {
            type: Boolean,
            default: false,
        },
        serverUrl: {
            type: String,
            default: '',
        },
    },
    watch: {
        info: {
            immediate: true,
            handler: function (val) {
                if (val != '') {
                    this.infoData = val
                }
            },
        },
        infoData(val) {
            this.$emit('update:info', val)
        },
    },
    mounted() {
        this.showRich = true
        if (this.width) {
            // this.$set(this.myConfig, initialFrameWidth, this.width)
        }
        if (this.height) {
            // this.$set(this.myConfig, initialFrameHeight, this.height)
        }
        if (this.autoHeight) {
            this.$set(this.myConfig, 'autoHeightEnabled', this.autoHeight)
        }
        if (this.serverUrl) {
            this.$set(this.myConfig, 'serverUrl', this.serverUrl)
        }
    },
    destoryed() {
        this.showRich = false
    },
    activated() {
        this.infoData = this.info
    },
    methods: {},
}
</script>

<style scoped>
.rich-text >>> .edui-default .edui-toolbar {
    line-height: 1;
}
</style>

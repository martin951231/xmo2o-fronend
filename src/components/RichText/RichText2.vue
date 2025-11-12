<template>
    <div class="rich-text">
        <vue-ueditor-wrap v-if="showRich" v-model="infoData" :config="myConfig"></vue-ueditor-wrap>
    </div>
</template>

<script>
    import VueUeditorWrap from 'vue-ueditor-wrap'
    let _this ;
    export default {
        name: 'RichText2',
        components:{
            VueUeditorWrap
        },
        data() {
            return {
                infoData: ' ',
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
                    toolbars: [
                        [
                            'source', //源代码
                            '|',
                            'fontfamily',//字体
                            'fontsize',//字号
                            '|',
                            'forecolor', //字体颜色
                            'backcolor', //背景色
                            'bold', //加粗
                            'italic',//斜体
                            'underline',//下划线
                            'removeformat',//清除格式
                            '|',
                            'justifyleft',//居左对齐
                            'justifycenter',//居中对齐
                            'justifyright',//居右对齐
                            'insertorderedlist', //有序列表
                            'insertunorderedlist',//无序列表
                            '|',
                            'emotion',//表情
                            'simpleupload',//单图上传
                            'fullscreen', //全屏
                        ]
                    ],
                },
                showRich: false
            }
        },
        props: {
            info: {
                type: String,
                default: '',
            },
            width: {
                type: [String,Number],
                default: '100%'
            },
            height: {
                type: [String,Number],
                default: 240
            },
            autoHeight: {
                type: Boolean,
                default: false,
            },
            serverUrl: {
                type: String,
                default: '',
            }
        },
        watch: {
            info:{
                // immediate: false,
                handler:(val)=>{
                    // console.log(444,val,_this);
                    _this.infoData = val;
                }
            },
            infoData(val) {
                // console.log(333, val)
                this.$emit('update:info',val);
            }
        },
        created() {
            // console.log(111,this)
            _this = this;
        },
        mounted() {
            // console.log(222,this)
            this.showRich = true
            this.infoData = this.info;
            if(this.width) {
                // this.$set(this.myConfig, initialFrameWidth, this.width)
            }
            if(this.height) {
                // this.$set(this.myConfig, initialFrameHeight, this.height)
            }
            if(this.autoHeight) {
                this.$set(this.myConfig, autoHeightEnabled, this.autoHeight)
            }
            if(this.serverUrl) {
                this.$set(this.myConfig, serverUrl, this.serverUrl)
            }
        },
        destoryed() {
            this.showRich = false
        },
        methods:{

        }
    }
</script>

<style scoped>
.rich-text >>> .edui-default .edui-toolbar {
    line-height: 1;
}
</style>
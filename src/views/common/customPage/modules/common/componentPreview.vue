<template>
    <div>
        <a-modal
            :title="L('预览')"
            :visible="visible"
            :destroyOnClose="true"
            :footer="null"
            :width="'55%'"
            @cancel="handleCancel"
            >
            <div class="flex">
                <span class="linkLabel">{{L('链接')}}</span>
                <div class="flex flex-wrap ml-10 flex-1">
                    <span class="linkUrl flex-1">{{componentPreviewInfo.link_url}}</span>
                    <a-button class="ml-10" @click="copy()">{{L('复制')}}</a-button>
                </div>
            </div>
            <div class="mt-10 flex align-center justify-center">
                <img class="codeImg" :src="componentPreviewInfo.link_code" alt="">
            </div>
        </a-modal>
    </div>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        componentPreviewInfo: {
            type: [String,Object],
            default: ''
        }
    },
    data() {
        return {
        }
    },
    methods: {
        handleCancel() {
            this.$emit('handleCancel')
        },
        copy() {
            const input = document.createElement("input")
            input.setAttribute("readonly", "readonly")
            input.setAttribute("value", this.componentPreviewInfo.link_url)
            document.body.appendChild(input)
            input.focus()
            input.setSelectionRange(0, 9999)
     
            if (document.execCommand("copy")) { 
                document.execCommand("copy")
                this.$message.success(this.L('复制成功！'))
            }
            document.body.removeChild(input)
        }
    }
}
</script>

<style scoped>
.linkLabel {
    display: inline-block;
    height: 32px;
    font-size: 14px;
    line-height: 32px;
    text-align: center;
}
.linkUrl {
    display: inline-block;
    width: 100%;
    min-height: 32px;
    padding: 4px 11px;
    color: rgba(0,0,0,.65);
    font-size: 14px;
    line-height: 1.5;
    background-color: #f5f5f5;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
}
.codeImg {
    width: 344px;
    height: 344px;
}
</style>
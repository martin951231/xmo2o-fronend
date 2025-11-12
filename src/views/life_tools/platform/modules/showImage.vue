<template>
<a-modal :title="title" :width="800" :height="300" :visible="visible" @cancel="closeWindow" :footer="null">
    <img :src="image" style="margin-top: 15px; width: 760px;height:auto">
</a-modal>
</template>
<script>
    export default {
        data() {
            return {
                title:"",
                //是否显示弹窗
                visible:false,
                image: ''
            }
        },
            methods: {
                //关闭窗口
                closeWindow(){
                    this.visible = false
                },
                showImage(image)
                {
                    this.image = image
                    this.visible = true
                }
            }
        }
</script>
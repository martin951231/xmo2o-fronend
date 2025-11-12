<template>
    <div class="top">向【费少春】 、【韦顺】 共计15位客户，发送群发消息</div>
</template>

<script>
    export default {
        name: "sendRecord",
        methods:{
            add(){
                this.$parent.visible_record = true;
            }
        }
    }
</script>

<style scoped>
.top{
  height: 100px;
  line-height: 100px;
  margin-left: 10%;
}
</style>
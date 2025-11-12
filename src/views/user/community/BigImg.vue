<template>
    <div class="img-view" @click="bigImg">
        <img class="image" :src="imgSrc">
    </div>
</template>
<script>
export default {
    props: ['imgSrc'],
    created() {
      console.log(this.imgSrc)
    },
    methods: {
        bigImg() {
            // 发送事件
            console.log('发送事件')
            this.$emit('clickit')
        }
    }
}
</script>
<style lang="less" scoped>
    .img-view {
        z-index: 999999999;
        position: fixed;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, .3);
        .image{
            margin: 0 auto;
        }
    }
</style>
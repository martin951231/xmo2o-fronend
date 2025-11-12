<template>
    <!-- 悬浮按钮预览 -->
    <div 
        v-if="pageInfo && pageInfo.is_open && content.length" 
        class="floatBtnWrap">
        <div 
            v-for="(item,index) in content" 
            :key="index"
            class="floatBtnItem">
            <img :src="item.image" alt="" v-if="item.checked">
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            content: []
        }
    },
    computed: {
        pageInfo() {
            let info = this.$store.state.customPage.pageInfo || ''
            this.content = info && info.content && info.content.length?info.content.filter(item => item.checked):[]
            return info
        },
    },
    mounted() {
    },
    methods: {
    }
}
</script>

<style scoped>
.floatBtnWrap {
    position: absolute;
    right: 10px;
    bottom: 20px;
}
.floatBtnItem {
    margin-top: 4px;
    width: 50px;
    height: 50px;
    line-height: 50px;
    border-radius: 50%;
    overflow: hidden;
    text-align: center;
    box-sizing: border-box;
}
.floatBtnItem:first-child {
    margin-top: 0;
}
.floatBtnItem img {
    width: 50px;
    height: 50px;
}
</style>
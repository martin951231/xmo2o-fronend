<template>
    <!-- 装修组件标题描述 -->
    <div v-if="content" class="wrap" :class="{
        'borderNone':borderNone
    }">
        <div class="title">{{L(content.title)}}</div>
        <div class="desc">{{L(content.desc)}}</div>
    </div>
</template>

<script>
export default {
    props: {
        content: {
            type: [String,Object],
            default: ''
        },
        borderNone: {
            type: Boolean,
            default: false
        }
    },
}
</script>

<style scoped>
.wrap {
    padding: 0 26px 20px;
    border-bottom: 1px solid #F2F4F6;;
}
.title {
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: 400;
    color: #323233;
}
.desc {
    font-size: 14px;
    font-weight: 400;
    color: #969799;
    line-height: 22px;
}
.borderNone {
    border: none;
}
</style>

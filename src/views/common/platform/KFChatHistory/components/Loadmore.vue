<template>
    <div class="flex align-center justify-center">
        <a-spin size="small" :spinning="status == 'loading'" class="flex align-center" />
        <span class="ml-10" style="color: #1890ff" v-if="status == 'loading'">{{L('加载中...')}}</span>
        <span class="ml-10" v-else-if="status == 'nomore'" style="color: #666;">{{L('我是有底线的~')}}</span>
    </div>
</template>

<script>
export default {
    props: {
        status: {
            type: String,
            default: 'loadmore',
        },
    },
}
</script>
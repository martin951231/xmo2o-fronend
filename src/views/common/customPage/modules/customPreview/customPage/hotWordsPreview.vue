<template>
    <div class="wrap flex justify-between align-center">
        <span class="title" v-show="content.is_show_title == '1'">{{ L('热搜') }}：</span>
        <div v-if="content && content.list && content.list.length" class="flex align-center flex-1 sx-hidden">
            <div v-for="(item, index) in content.list" :key="index" class="text-nowrap item">
                <span>{{ item.name }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        content: {
            type: [String, Object],
            default: '',
        },
    },
    data() {
        return {}
    },
}
</script>

<style scoped>
.wrap {
    padding: 0 12px;
    width: 100%;
    height: 42px;
    box-sizing: border-box;
}
.title {
    font-size: 10px;
    font-weight: 500;
    color: #000000;
}
.item {
    margin-right: 6px;
    padding: 4px 8px;
    font-size: 11px;
    font-weight: 500;
    color: #4a525d;
    background: #f5f5f5;
    border-radius: 13px;
}
</style>
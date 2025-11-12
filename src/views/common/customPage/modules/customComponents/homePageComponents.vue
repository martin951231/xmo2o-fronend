<template>
    <div class="bg-ff homePage">
        <div 
            v-for="item in list" 
            :key="item.id"
            class="item"
            :class="[current == item.id? 'active' : '']"
            @click="componentChangeOpt(item)">
            {{item.label}}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        source: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            current: 'index',
            // 组件显隐showList中存在source true
            list: [
                {
                    label: this.L('首页装修'),
                    id: 'index',
                    page_title: this.L('首页'),
                    showList: ['merchant','store']
                },
                {
                    label: this.L('个人中心'),
                    id: 'my',
                    page_title: this.L('个人中心'),
                    showList: ['merchant','store']
                },
                {
                    label: this.L('底部导航'),
                    id: 'footerTabbar',
                    page_title: '',
                    showList: ['merchant','store']
                },
                {
                    label: this.L('悬浮窗'),
                    id: 'floatBtn',
                    page_title: '',
                    showList: ['merchant','store']
                }
            ]
        }
    },
    created() {
        this.$emit('getComponentInfo', this.getComponentInfo())
        this.$store.dispatch('updateComponentId', this.current);
    },
    mounted() {
    },
    methods: {
        // 组件切换
        componentChangeOpt(item) {
            if (this.current == item.id) return
            this.current = item.id
            this.$store.dispatch('updatePageInfo', '');
            this.$store.dispatch('updateComponentId', this.current);
            this.$emit('getComponentInfo', this.getComponentInfo())
        },
        // 获取组件信息
        getComponentInfo() {
            let info = this.list.filter(item => {
                return item.id == this.current
            })[0] || ''
            return info
        }
    }
}
</script>

<style scoped>
.item {
    margin-bottom: 10px;
    padding: 12px 16px;
    min-width: 150px;
    height: 36px;
    background: #ffffff;
    opacity: 0.6;
    border-radius: 2px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #323233;
    line-height: 22px;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    align-items: center;
}
.item:hover,.item.active {
    background: rgba(224, 240, 255, 1);
    color: rgba(24, 144, 255, 1);
}
</style>

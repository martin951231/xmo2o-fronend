<template>
    <div class="detail-search-container">
        <a-row :gutter="[16, 0]">
            <a-col :span="5">
                <div class="search-item">
                    <label>姓名：</label>
                    <a-input v-model="name" placeholder="请输入姓名" />
                </div>
            </a-col>
            <a-col :span="5">
                <div class="search-item">
                    <label>手机号：</label>
                    <a-input v-model="mobile" placeholder="请输入手机号" />
                </div>
            </a-col>
            <a-col :span="5">
                <div class="search-item">
                    <label>活动名称：</label>
                    <a-select v-model="activity_name" placeholder="请选择活动">
                        <a-select-option :value="''">全部</a-select-option>
                        <a-select-option v-for="item in activityList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                    </a-select>
                </div>
            </a-col>
            <a-col :span="5">
                <div class="search-item">
                    <label>获得时间：</label>
                    <a-range-picker v-model="timeRange" format="YYYY-MM-DD" />
                </div>
            </a-col>
            <a-col :span="4">
                <div class="search-buttons">
                    <a-button type="primary" @click="handleSearch">查询</a-button>
                    <a-button @click="handleReset">重置</a-button>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import socialActivityApi from '@/api/social_activity/index'

export default {
    name: 'DetailSearchBar',
    props: {
        searchParams: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            name: this.searchParams.name || '',
            mobile: this.searchParams.mobile || '',
            activity_name: this.searchParams.activity_name || '',
            timeRange: this.searchParams.timeRange || null,
            activityList: []
        }
    },
    created() {
        this.getActivityList()
    },
    methods: {
        getActivityList() {
            this.request(socialActivityApi.getActivityList, {}).then((res) => {
                this.activityList = res.data || []
            })
        },
        handleSearch() {
            this.$emit('search', {
                name: this.name,
                mobile: this.mobile,
                activity_name: this.activity_name,
                timeRange: this.timeRange
            })
        },
        handleReset() {
            this.name = ''
            this.mobile = ''
            this.activity_name = ''
            this.timeRange = null
            this.$emit('reset', {
                name: '',
                mobile: '',
                activity_name: '',
                timeRange: null
            })
        }
    }
}
</script>

<style lang="less" scoped>
.detail-search-container {
    margin-bottom: 16px;
    padding: 16px;
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 4px;

    .search-item {
        display: flex;
        align-items: center;

        label {
            min-width: 70px;
            text-align: right;
            margin-right: 12px;
            font-size: 14px;
            color: #333;
        }
    }

    .search-buttons {
        display: flex;
        gap: 12px;
    }
}
</style>

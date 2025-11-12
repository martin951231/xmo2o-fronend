<template>
    <div class="mt-10 mb-20 pt-20 pl-20 pr-20 pb-20 bg-ff br-10 list">
        <div class="btn-wrap mt-20">
            <a-button 
                type="primary" 
                @click="handleRead('', 1)" 
                :disabled="!pagination.total">{{ L('全部已读') }}</a-button>
        </div>
        <div class="mt-20 list">
            <a-collapse :bordered="false" @change="listChange" expandIconPosition="right">
                <a-collapse-panel
                    v-for="item in list"
                    :key="item.pigcms_id"
                    :class="[{ 'is-read': item.is_read == 1 }]"
                >
                    <span slot="header" class="flex-1 text-wrap">{{ item.title }}</span>
                    <span slot="extra" class="cr-gray ml-20 mr-10">{{ item.create_time }}</span>
                    <div class="flex">
                        <div class="msg-content text-wrap cr-gray " v-html="item.content"></div><a class="router-link-exact-active router-link-active ml-20 mr-20" v-if="item.pcUrl" :href="item.pcUrl">{{ L('前往') }}</a>
                    </div>
                </a-collapse-panel>
            </a-collapse>
        </div>

        <a-empty v-if="pagination.total == 0" :description="L('暂无消息')" />

        <div class="mt-20 pagination-wrap mb-20">
            <a-pagination
                v-model="pagination.current"
                :total="pagination.total"
                show-less-items
                show-quick-jumper
                :pageSize="pagination.pageSize"
                :showTotal="pagination.showTotal"
                hideOnSinglePage
                @change="pagination.onChange"
                @showSizeChange="pagination.onShowSizeChange"
            />
        </div>
    </div>
</template>

<script>
import warnMerchantIndexApi from '@/api/warn/merchant/index'
export default {
    data() {
        return {
            // 列表
            list: [],
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                onChange: this.onPageChange,
                onShowSizeChange: this.onPageSizeChange,
                showTotal: (total) => `共 ${total} 条记录`,
            },
        }
    },
    mounted() {
        this.getList()
    },
    beforeRouteLeave(to, from, next) {
        this.$destroy()
        next()
    },
    methods: {
        getList() {
            let params = {
                page: this.pagination.current,
                pageSize: this.pagination.pageSize,
            }
            this.request(warnMerchantIndexApi.getNoticeList, params).then((res) => {
                this.list = res.data || []
                this.pagination.total = res.total || 0
            })
        },
        // 页码变化
        onPageChange(page, pageSize) {
            this.$set(this.pagination, 'current', page)
            this.getList()
        },
        onPageSizeChange(page, pageSize) {
            this.$set(this.pagination, 'pageSize', pageSize)
            this.getList()
        },
        listChange(key) {
            if (key.length) {
                this.list.forEach((item) => {
                    if (item.is_read != 1 && key.findIndex((keyItem) => keyItem == item.pigcms_id) != -1) {
                        this.handleRead(item.pigcms_id)
                    }
                })
            }
        },
        // 是否全部已读，1：是，0：否
        handleRead(id = '', is_all = 0) {
            let params = {
                id,
                is_all,
            }
            this.request(warnMerchantIndexApi.msgRead, params).then((res) => {
                if (is_all == 1) {
                    this.getList()
                } else {
                    let index = this.list.findIndex((item) => item.pigcms_id == id)
                    this.$set(this.list[index], 'is_read', 1)
                }
            })
        },
    },
}
</script>

<style scoped>
.list {
    border: 1px solid #f1f1f1;
    padding: 0 20px;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    border-radius: 6px;
    overflow: hidden;
}
.list >>> .ant-collapse-borderless {
    background-color: #ffffff;
}
.list >>> .ant-collapse-borderless > .ant-collapse-item {
    border-bottom-color: #f1f1f1;
}
.list >>> .ant-collapse-header {
    font-size: 14px;
    color: #333333;
}
.list >>> .ant-collapse > .ant-collapse-item > .ant-collapse-header {
    padding: 20px 30px;
}
.list >>> .ant-collapse > .ant-collapse-item.ant-collapse-no-arrow > .ant-collapse-header {
    padding-left: 30px;
}
.list >>> .ant-collapse-header {
    display: flex;
}
.msg-content {
    font-size: 14px;
    padding-left: 14px;
}
.cr-gray,
.is-read >>> .ant-collapse-header,
.list >>> .ant-collapse > .ant-collapse-item > .ant-collapse-header .ant-collapse-arrow {
    color: #ababab;
}
.btn-wrap,.pagination-wrap {
    width: 100%;
    display: flex;
    justify-content: flex-end;
}
</style>
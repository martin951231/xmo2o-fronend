<template>
    <div>
        <a-modal
            :title="title"
            :visible="visible"
            :maskClosable="false"
            @cancel="handleCancel"
            :footer="null"
            >
            <a-list 
                bordered 
                :data-source="periodicList.deliver_msg" 
                item-layout="vertical"
                style="max-height: 500px;overflow-y: auto;">
                <a-list-item slot="renderItem" slot-scope="item">
                    <div class="text-center width-auto mb-20 fs-16">
                        {{moment(item.deliver_date).format('YYYY年MM月')}}
                    </div>
                    <div 
                        class="flex align-center flex-wrap width-auto" 
                        v-if="item.deliver_list && item.deliver_list.length">
                        <div 
                            v-for="(subItem,subIndex) in item.deliver_list" 
                            :key="subIndex"
                            class="flex flex-column align-center mb-20 deliver-item">
                            <span 
                                class="date-num" 
                                :class="subItem.deliver_status == 4?'active':''">
                                {{subItem.date_num}}
                            </span>
                            <span>{{subItem.deliver_status | deliverStatusOpt}}</span>
                        </div>
                    </div>
                </a-list-item>
            </a-list>
        </a-modal>
    </div>
</template>

<script>
    import mallMerchantApi from "@/api/mall/merchant/index"
import moment from 'moment'
const deliverStatus = [
    {
        status: 0,
        label: '待发货'
    },
    {
        status: 1,
        label: '备货中'
    },
    {
        status: 2,
        label: '待收货'
    },
    {
        status: 3,
        label: '已顺延'
    },
    {
        status: 4,
        label: '已收货'
    }
]
export default {
    props: {
        visible: Boolean,
        order: Object
    },
    data() {
        return {
            title: '配送周期',
            periodicList: ''
        }
    },
    filters: {
        deliverStatusOpt(val) {
            let text = ''
            deliverStatus.forEach(item => {
                if (item.status == val) {
                    text = item.label
                }
            })
            return text
        }
    },
    created() {
        this.getPeriodicList()
    },
    methods: {
        moment,
        // 查看配送周期 
        getPeriodicList() {
            this.request(mallMerchantApi.getPeriodicList, {
                order_id: this.order.order_id,
                store_id: this.order.store_id
            }).then((data) => {
                this.periodicList = data || ''
                if (data) {
                    let {nums = 0, complete_num = 0} = data
                    this.title = `${this.title}（共${nums}期，已送${complete_num}期）`
                }
            })
        },
        handleCancel() {
            this.$emit('handleCancel')
        }
    }
}
</script>

<style scoped>
.width-auto {
    width: 100%;
}
.deliver-item {
    width: calc(100%/7);
}
.date-num {
    margin-bottom: 5px;
    padding: 14px 18px;
    border-radius: 50%;
    border: 1px solid transparent;
    box-sizing: border-box;
    line-height: 1;
}
.date-num.active {
    border-color: orange;
    color: orange;
}
</style>
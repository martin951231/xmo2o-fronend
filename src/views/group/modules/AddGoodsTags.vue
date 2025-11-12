<template>
    <div>
        <!-- 新增标签组 -->
        <a-form-model-item label="标签组" :labelCol="{ span: 3 }" class="mb-10">
            <a-radio-group v-model="labelGroup" @change="goodsTagGroupChange">
                <a-radio
                    style="margin-bottom: 20px"
                    :value="groupItem.id"
                    v-for="(groupItem, groupIndex) in goodsTagGroupList"
                    :key="groupIndex"
                    :disabled="!groupItem.id"
                >
                    <a-input
                        v-model="groupItem.name"
                        @blur="addLabelOpt($event, '1', groupItem)"
                        @change="addLabelChange()"
                        placeholder="标签名"
                        style="width: 100px"
                    />
                </a-radio>
            </a-radio-group>
            <a-button
                style="padding: 0 10px; border-color: #1890ff"
                class="cr-primary"
                @click="addTagGroup"
                icon="plus"
            >
                新增
            </a-button>
        </a-form-model-item>
        <!-- 新增标签组下的子标签 -->
        <a-form-model-item label="标签" :labelCol="{ span: 3 }" v-if="showTags">
            <a-checkbox-group v-model="labelIds" @change="goodsTagChange">
                <a-checkbox
                    style="margin-bottom: 20px"
                    :value="item.id"
                    v-for="(item, index) in goodsTagList"
                    :key="index"
                >
                    <a-input
                        v-model="item.name"
                        @blur="addLabelOpt($event, '2', item)"
                        placeholder="标签名"
                        @change="addLabelChange()"
                        style="width: 100px"
                    />
                </a-checkbox>
            </a-checkbox-group>
            <a-button style="padding: 0 10px; border-color: #1890ff" class="cr-primary" @click="addTag" icon="plus">
                新增
            </a-button>
        </a-form-model-item>
    </div>
</template>

<script>
import groupMerchantApi from '@/api/group/merchant/index'
export default {
    props: {
        labelInfo: {
            type: [String, Object],
            default: '',
        },
    },
    data() {
        return {
            labelGroup: this.labelInfo && this.labelInfo.labelGroup ? this.labelInfo.labelGroup : '', // 标签组id
            labelIds: this.labelInfo && this.labelInfo.labelIds ? this.labelInfo.labelIds : [], // 子标签id
            goodsTagGroupList: [], // 标签组
            currentTagGroupIndex: 0, // 当前选中的标签组
            showTags: this.labelInfo && this.labelInfo.labelGroup ? true : false, // 是否显示子标签
            goodsTagList: [], // 子标签
            labelInfoForm: [],
            checkAddLabelChange: false,
        }
    },
    watch: {
        labelInfo: {
            immediate: true,
            handler(val) {
                if (val) {
                    if (val.labelGroup) {
                        this.showTags = true
                        this.getGoodsTagList()
                    }
                    this.$set(this, 'labelGroup', val.labelGroup || '')
                    this.$set(this, 'labelIds', val.labelIds || [])
                }
            },
        },
        labelGroup: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.getGoodsTagList()
                }
            },
        },
    },
    mounted() {
        this.getLabelList()
    },
    methods: {
        // 添加标签组
        addTagGroup() {
            this.goodsTagGroupList.push({
                id: '', // 标签组id
                name: '',
                child: [],
            })
        },
        // 添加子标签
        addTag() {
            if (this.goodsTagGroupList.length) {
                this.goodsTagGroupList.forEach((item, index) => {
                    if (item.id == this.labelGroup) {
                        if (!item.child) {
                            item.child = []
                        }
                        item.child.push({
                            id: '',
                            name: '',
                        })
                        this.$set(this.goodsTagGroupList, index, item)
                        this.getGoodsTagList()
                    }
                })
            }
        },
        // 切换标签组
        goodsTagGroupChange(e) {
            this.showTags = true
            let groupIndex = e.target.value
            this.currentTagGroupIndex = groupIndex
            this.labelInfoForm = this.labelInfoForm ? this.labelInfoForm : {}
            this.$set(this.labelInfoForm, 'labelGroup', e.target.value)
            this.$emit('getLabelGroup', this.labelInfoForm)
            this.getGoodsTagList()
        },
        // 获取对应标签组下的标签
        getGoodsTagList() {
            if (this.goodsTagGroupList.length) {
                this.goodsTagGroupList.forEach((item) => {
                    if (item.id == this.labelGroup) {
                        this.goodsTagList = item.child
                    }
                })
            }
        },
        // 选择子标签
        goodsTagChange(val) {
            console.log(val,"labelIds==labelIds==labelIds")
            this.$set(this.labelInfoForm, 'labelIds', val)
            this.$emit('getLabelGroup', this.labelInfoForm)
        },
        // 获取所有标签
        getLabelList() {
            this.request(groupMerchantApi.getLabelList).then((data) => {
                this.goodsTagGroupList = data.list
                if (!this.labelGroup && this.goodsTagGroupList && this.goodsTagGroupList.length) {
                    this.labelGroup = this.goodsTagGroupList[0]['id']
                    this.getGoodsTagList()
                }
            })
        },
        // 添加编辑标签
        addLabelOpt(e, type, currentItem) {
            if (currentItem.id && e.target.value.trim() == '') {
                this.$message.error('请输入标签名称')
                this.$emit('checkLabelReslut')
                return
            }
            if (e.target.value.trim() == '') return
            if (!this.checkAddLabelChange) return
            let params = {
                name: e.target.value,
                fid: type == '2' ? this.labelGroup : '',
                id: currentItem.id,
            }
            this.request(groupMerchantApi.addLabel, params)
                .then((data) => {
                    this.checkAddLabelChange = false
                    if (!currentItem.id) {
                        this.getLabelList()
                    }
                })
                .catch((err) => {
                    this.checkAddLabelChange = false
                })
        },
        // 监听标签变化
        addLabelChange() {
            this.checkAddLabelChange = true
        },
    },
}
</script>

<style scoped></style>

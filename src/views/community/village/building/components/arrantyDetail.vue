<template>
    <a-drawer title="质保明细" :width="1200" :visible="visible" :body-style="{ paddingBottom: '80px' }" @close="onClose">
        <div class="warranty_details">
            <a-alert message="在楼栋设置类别名称的保修期限后，会同步到楼栋下所有房间，房间的类别也可以修改保修期限，但是设置的保修期限不能超过楼栋设置的范围" />
            <div class="btn_con">
                <a-button type="primary" v-if="arrantyInfo.applyChangeName" @click="vertifyVisible = true">修改质保类别名称申请</a-button>
                <a-button v-if="arrantyInfo.applyChangeNameLog" style="margin-left: 10px;" @click="applyVisible = true" type="primary">申请记录</a-button>
            </div>
            <div class="form_con" style="margin-bottom: 100px;">
                <div class="form_item" v-for="(item, index) in arrantyList" :key="index">
                    <div class="cate_list">
                        <div class="cate_item">
                            <div class="label">类别名称：</div>
                            <a-input v-model="arrantyList[index].categoryName" style="width: 340px; margin-right: 15px;" :disabled="true"/>
                            <a-radio-group v-model="arrantyList[index].status">
                                <a-radio-button :value="1">显示</a-radio-button>
                                <a-radio-button :value="2">关闭</a-radio-button>
                            </a-radio-group>
                        </div>
                    </div>
                    
                    <div class="bottom_con" v-if="arrantyList[index].status == 1">
                        <div class="repaire_range">
                            <div class="label">保修期限：</div>
                            <div class="value">
                                <a-range-picker v-if="refrashDate" v-model="arrantyList[index].repaireDate" format="YYYY-MM-DD"
                                    style="width: 340px;" @change="(date, dateString)=>handleDateChange(date, dateString, index)" />
                            </div>
                        </div>
                        <div class="bind_order_cate">
                            <div class="label">绑定工单类目：</div>
                            <div class="value">
                                <a-input v-model="arrantyList[index].cateName" placeholder="请前往【工单管理/工单类目】处绑定"
                                    style="width: 340px;" :disabled="true" />
                            </div>
                        </div>
                    </div>
                    
                    <div class="extra_desc">
                        <div class="bottom_con bottom_2con" v-if="arrantyList[index].status == 1 && item.extra_desc" v-for="(d_item, d_index) in item.extra_desc" :key="d_index">
                            <div class="repaire_range"  v-for="(dd_item, dd_index) in d_item" :key="dd_index">
                                <div class="label">{{dd_item.p_key_name}}：</div>
                                <div class="value">
                                    <a-input class="desc_value" :placeholder="'请输入'+dd_item.p_key_name" v-model.trim="arrantyList[index].extra_desc[d_index][dd_index].p_value" />
                                </div>
                            </div>   
                             <a-button type="primary" v-if="d_index<1 && arrantyList[index].extra_desc.length<10"  @click="addExtraDesc(index)" > 添 加 </a-button>
                             <a-button type="danger" v-if="d_index>=1"  @click="delExtraDesc(index,d_index)" > 删 除 </a-button>
                        </div>
                        
                    </div>
                    
                </div>
            </div>
        </div>

        <div :style="{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  borderTop: '1px solid #e9e9e9',
                  padding: '10px 16px',
                  background: '#fff',
                  textAlign: 'right',
                  zIndex: 1,
                }">
            <a-button :style="{ marginRight: '8px' }" @click="onClose">
                取消
            </a-button>
            <a-button :loading="confirmLoading" type="primary" @click="handleConfirm">
                确定
            </a-button>
        </div>
        <vertifyCategory :visible="vertifyVisible" @close="closeVertify" />
        <applyList :visible="applyVisible" @close="closeApply" />
    </a-drawer>
</template>

<script>
    import Vue from 'vue';
    import {
        toRefs,
        ref,
        watch,
        reactive,
        onMounted,
        onUpdated,
        defineComponent,
        nextTick
    } from '@vue/composition-api';
    import moment from 'moment';
    import vertifyCategory from './module/vertifyCategory.vue';
    import applyList from './module/applyList.vue';
    export default defineComponent({
        components: {
            vertifyCategory,
            applyList
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            singleInfo: {
                type: Object,
                default: () => {
                    return {}
                }
            }
        },
        setup(props, context) {
            const state = reactive({
                arrantyList: [],
                confirmLoading: false,
                vertifyVisible: false,
                applyVisible: false,
                arrantyInfo: {},
                refrashDate: true
            })

            const onClose = () => {
                context.emit('close')
            }

            watch(() => props.visible, val => {
                if (val && props.singleInfo.id) {
                    getArrantyList()
                }
            })
            const addExtraDesc=(q_index)=>{
                let pushArr=[
                        {
                          "p_key": "p_brand",
                          "p_value": "",
                          "p_key_name": "品牌",
                          "xsort": 1
                        },
                        {
                          "p_key": "p_model_number",
                          "p_value": "",
                          "p_key_name": "型号",
                          "xsort": 2
                        },
                        {
                          "p_key": "construction_unit",
                          "p_value": "",
                          "p_key_name": "施工单位",
                          "xsort": 3
                        }
                      ];
                 state.arrantyList[q_index].extra_desc.push(pushArr);
            }
            
            const delExtraDesc=(q_index,m_index)=>{
                 state.arrantyList[q_index].extra_desc.splice(m_index, 1);
            }
            const handleDateChange = (date, dateString, index) => {
                if(dateString && dateString[0]){
                    state.arrantyList[index]['quality_start_time_text'] = dateString[0]
                    state.arrantyList[index]['quality_end_time_text'] = dateString[1]
                    state.arrantyList[index]['quality_start_time'] = date[0].unix()
                    state.arrantyList[index]['quality_end_time'] = date[1].unix()
                    state.arrantyList[index]['repaireDate'] = date
                    state.refrashDate = false
                    nextTick(()=>{
                        state.refrashDate = true
                    })
                } else {
                    state.arrantyList[index]['quality_start_time_text'] = null
                    state.arrantyList[index]['quality_end_time_text'] = null
                    state.arrantyList[index]['quality_start_time'] = null
                    state.arrantyList[index]['quality_end_time'] = null
                }
            }

            const getArrantyList = () => {
                Vue.prototype.request(
                    '/community/village_api.workorder.CommunityQuality/getSingleCommunityQualityInfo', {
                        single_id: props.singleInfo.id
                    }).then(res => {
                    state.arrantyList = res.list
                    state.arrantyInfo = res
                    state.arrantyList.map(v => {
                        v.repaireDate = null
                        if (v.quality_start_time_text && v.quality_end_time_text) {
                            v.repaireDate = [moment(v.quality_start_time_text,
                                'YYYY-MM-DD'), moment(v
                                .quality_end_time_text, 'YYYY-MM-DD')]
                        }
                        
                        if (v.cate_fname && v.cate_name) {
                            v.cateName = v.cate_fname + '/' + v.cate_name
                        }

                        if (v.fid_category_name && v.category_name) {
                            v.categoryName = v.fid_category_name + '/' + v
                                .category_name
                        }
                    })
                })
            }
            
            const handleConfirm = () => {
                let qualityParams = []
                state.arrantyList.map(v=>{
                    let extra_desc_tmp=[];
                    if(v.extra_desc.length>0){
                        v.extra_desc.map(ivv=>{
                            let is_have_v=false;
                            if(ivv.length>0){
                                ivv.map(evv=>{
                                     if(evv.p_value){
                                         is_have_v=true;
                                     }
                                 });
                            }
                            if(is_have_v){
                                extra_desc_tmp.push(ivv);
                            }
                        });
                    }
                    let obj = {
                        id: v.id,
                        category_name: v.category_name,
                        fid: v.fid,
                        fid_category_name: v.fid_category_name,
                        quality_start_time: v.quality_start_time,
                        quality_end_time: v.quality_end_time,
                        status: v.status,
                        quality_start_time_text: v.quality_start_time_text,
                        quality_end_time_text: v.quality_end_time_text,
                        extra_desc:extra_desc_tmp,
                    }
                    qualityParams.push(obj)
                })
                state.confirmLoading = true
                Vue.prototype.request('/community/village_api.workorder.CommunityQuality/setSingleCommunityQuality', {
                    qualityParams,
                    single_id: props.singleInfo.id
                }).then(res=>{
                    state.confirmLoading = false
                    Vue.prototype.$message.success('设置成功！')
                    context.emit('close', true)
                }).catch(err=> {
                    state.confirmLoading = false
                })
            }
            
            const closeVertify = () => {
                state.vertifyVisible = false
                getArrantyList()
            }
            
            const closeApply = () => {
                state.applyVisible = false
            }

            return {
                ...toRefs(state),
                onClose,
                handleDateChange,
                handleConfirm,
                closeVertify,
                closeApply,
                addExtraDesc,
                delExtraDesc
            }
        }
    })
</script>

<style lang="less" scoped>
    .warranty_details {
        .btn_con{
            display: flex;
            margin-top: 20px;
        }
        .form_con {
            margin-top: 10px;
            .form_item {
                margin-top: 20px;

                .cate_list {
                    .cate_item {
                        display: flex;
                        align-items: center;

                        .label {
                            font-size: 14px;
                            color: #333;
                        }
                    }
                }

                .bottom_con {
                    display: flex;
                    align-items: center;
                    margin-top: 10px;

                    .repaire_range {
                        display: flex;
                        align-items: center;

                        .label {
                            font-size: 14px;
                            color: #333;
                        }

                        .value {}
                    }

                    .bind_order_cate {
                        display: flex;
                        align-items: center;
                        margin-left: 15px;

                        .label {
                            font-size: 14px;
                            color: #333;
                        }

                        .value {}
                    }
                }
                .bottom_2con {
                    .repaire_range {
                        width: 32%;
                        .value { width: 80%;}
                        .desc_value{
                             width: 98%;
                        }
                    }
                    
                }
            }
        }
    }
</style>
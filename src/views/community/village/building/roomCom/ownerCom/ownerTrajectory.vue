<template>
    <div class="deal_record" @scroll="handleScroll">
        <div class="record_list" v-for="(item, index) in trailList" :key="index">
            <div class="flow_icon_out">
                <div class="flow_icon_in"></div>
            </div>
            <div class="flow_line" v-if="index != trailList.length-1"></div>
            <div class="props_list">
                <div class="props_item">
                    <span>{{item.create_day}}</span>
                    <span style="margin-left: 10px;">{{item.create_time}}</span>
                </div>
                <div class="props_item">
                    {{item.content}}
                </div>
            </div>
        </div>
        <div class="no_more" v-if="trailList.length == 0"
            style="width: 100%; padding: 10px 0; display:flex; align-items:center; justify-content:center;">
            暂无数据
        </div>
        <div class="no_more" v-if="noMore"
            style="width: 100%; padding: 10px 0; display:flex; align-items:center; justify-content:center;">
            --没有更多数据了--
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {
        ref,
        watch,
        reactive,
        onMounted,
        onUpdated,
        defineComponent,
        getCurrentInstance
    } from '@vue/composition-api';
    export default defineComponent({
        props: {
            roomParams: {
                type: Object,
                default: ()=>{return {}}
            },
            roomId: {
                type: [String, Number],
                defalut: ''
            },
            pigcms_id: {
                type: [String, Number],
                defalut: ''
            }
        },
        
        setup(props, context) {
            let noMore = ref(false)
            let trailList = ref([])
            let currentPage = ref(1)
            let maxPage = ref(2)
            let totalCount = ref(0)
            //计算列表最大页 判断有无更多数据
            const computeMaxpage = (count) => {
                noMore.value = false
                if (count % 10 == 0) {
                    maxPage.value = parseInt(count / 10)
                } else {
                    maxPage.value = parseInt(count / 10 + 1)
                }
            }
            const handleScroll=(e) =>  {
                const {
                    scrollTop,
                    clientHeight,
                    scrollHeight
                } = e.target
                if (scrollTop + clientHeight === scrollHeight) {
                    if (trailList.value.length > 0) {
                        if (currentPage.value >= maxPage.value) {
                            noMore.value = true
                        } else {
                            currentPage.value += 1
                            getTrailList()
                        }
                    }
                }
            }
            const getTrailList = () => {
                Vue.prototype.request('/community/village_api.ChatSidebar/getActionTrail', {
                    page: currentPage.value,
                    pigcms_id: props.pigcms_id
                }).then((res) => {
                    trailList.value = [...trailList.value, ...res.list]
                    totalCount.value = res.count
                    computeMaxpage(res.count)
                    getCurrentInstance()
                })
            }
            getTrailList()
            return{
                noMore,
                trailList,
                currentPage,
                maxPage,
                totalCount,
                computeMaxpage,
                handleScroll,
                getTrailList
            }
        }
    })
</script>

<style lang="less" scoped>
    .deal_record {
        height: 55vh;
        overflow-y: scroll;
        margin: 10px 0;
        &::-webkit-scrollbar {
            width: 0;
        }
        .record_list {
            margin: 10px;
            position: relative;
            margin: 15px 30px;
    
            .flow_line {
                position: absolute;
                width: 2px;
                border: 0;
                height: calc(100% + 10px);
                background-color: #409EFF;
                top: 14px;
                left: -23px;
            }
    
            .flow_icon_out {
                width: 15px;
                height: 15px;
                border-radius: 10px;
                background-color: #409EFF;
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                left: -30px;
                top: 3.5px;
    
                .flow_icon_in {
                    width: 7px;
                    height: 7px;
                    border-radius: 10px;
                    background-color: #ffffff;
                }
            }
    
            .props_list {
                width: 80%;
    
                .props_list {
                    margin: 10px 0;
                }
            }
        }
    }
</style>

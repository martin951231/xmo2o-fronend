<template>
    <a-modal
        :title="title"
        :visible="visible"
        @ok="handleCancel"
        @cancel="handleCancel"
        :footer="null"
        width="50%"
    >
    <a-row style="margin-bottom: 35px;">
        <a-button type="primary" @click="toggleAllChecked">
            {{ !checkAll ? '全选' : '全不选' }}
        </a-button>
        <a-button style="margin-left: 8px;" type="primary" @click="exportExcel()" :loading="exportLoading">
            {{ exportBtnName }}
        </a-button>
    </a-row>
    
    <a-row v-for="item in columns" :key="'row_'+item.title" :gutter="[8,8]" style="margin-bottom: 35px;">
        <p style="font-weight: bold;">{{ item.title }}</p>
        <a-col :span="6" v-for="item2 in item.columns" :key="'col_'+item2.value">
            <a-checkbox :value="item2.value" :checked="checkColumn.indexOf(item2.value) !== -1" @change="toggleChecked">
                {{ item2.name }}
            </a-checkbox>
        </a-col>
    </a-row>

    </a-modal>
</template>

<script>
import mallCommonApi from '@/api/mall/index'

export default {
    data() {
        return {
            title:'请选择导出项',
            visible:false,
            exportLoading:false,
            exportBtnName:'导出',
            columns:[],
            checkAll: false,
            checkColumn:[],
        }
    },
    
    mounted() {
    },
    methods: {
        getColumnsConfig(){
            this.visible = true;
            this.checkAll = false;
            this.checkColumn = [];
            this.request(mallCommonApi.exportColumns, {}).then((data) => {
                this.columns = data
            })
        },
        handleCancel(){
            this.visible=false;
        },
        toggleAllChecked() {
            this.checkAll = !this.checkAll;
            this.checkColumn = [];
            if (this.checkAll) {
                for (const i in this.columns) {
                    for (const c in this.columns[i]['columns']) {
                        this.checkColumn.push(this.columns[i]['columns'][c].value);
                    }
                }
            }
        },
        toggleChecked(e) {
            if (e.target.checked) {
                this.checkColumn.push(e.target.value);
            } else {
                this.checkColumn = this.checkColumn.filter(item => item != e.target.value);
            }
        },
        exportExcel(){
            if(this.checkColumn.length < 1){
                this.$message.warn('请选择导出项');
            }else{
                this.exportLoading = true
                this.exportBtnName = "导出中"

                //把选中的项按照显示重新排序
                var newColumn = [];
                for (const i in this.columns) {
                    for (const c in this.columns[i]['columns']) {
                        if (this.checkColumn.indexOf(this.columns[i]['columns'][c].value) != -1) {
                            newColumn.push(this.columns[i]['columns'][c].value);
                        }
                    }
                }
                this.$emit('getExport',newColumn,()=>{
                    this.exportLoading = false
                    this.exportBtnName = '导出'
                });
            }
        }
    },
}
</script>

<style scoped>
.mb-0 {
    margin-bottom: 0;
}
</style>

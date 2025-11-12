<template>
    <div class="parking_lot">
        <div class="header_search">
            <div class="search_item">
                <label>车场名称：</label>
                <a-input style="width: 160px;" placeholder="请输入" />
            </div>
            <div class="search_item">
                <label>车场名称：</label>
                <a-input style="width: 160px;" placeholder="请输入" />
            </div>
        </div>
        <div class="table_content">
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                
            }
        }
    }
</script>

<style lang="less" scoped>
    .parking_lot{
        width: 98%;
        background-color: #ffffff;
        margin: 10px;
    }
</style>

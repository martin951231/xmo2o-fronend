<template>
    <div class="building_manage">
        
    </div>
</template>

<script>
    export default {
        name: "buildingManage",
        components: {
        },
        data() {
            return {
                showMap: true
            }
        },

        mounted() {
            console.log('this.$route===>', this.$route.query)
            let pigcms_id = ''
            if(this.$route.query.pigcms_id){
                pigcms_id = this.$route.query.pigcms_id
            }
            location.href = 'http://www.group.com/packapp/material_diy/index.html#/write_list?pigcms_id='+pigcms_id
        },

        methods: {
        }
    }
</script>

<style lang="less" scoped>
    .building_manage {
        width: 60%;
        height: 60%;
        margin-left: 300px;
        margin-top: 200px;
    }
</style>

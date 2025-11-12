<template>
    <div class="audit_information">
        <iframe :src="'/shequ.php?g=House&c=User&a=bind_list&pigcms_id='+pigcmsId" width="100%" height="100%"></iframe>
    </div>
</template>

<script>
    export default{
        data(){
            return{
            }
        },
        props:{
            pigcmsId: {
                type: Number,
                default: 0
            }  
        },
        
        mounted(){
        },
        
        methods:{
        }
    }
</script>

<style lang="less" scoped>
    .audit_information{
        width: 100%;
        height: 60vh;
    }
</style>

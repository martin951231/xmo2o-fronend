<template>
    <div class="audit_information">
        <object type="text/html" :data="iframeUrl" style="width:100%; height:100%;">
            <p>backup content</p>
        </object>
        <!-- <iframe :src="iframeUrl" width="100%" height="100%"></iframe> -->
    </div>
</template>

<script>
    export default{
        data(){
            return{
                iframeUrl: ''
            }
        },
        props:{
            pigcmsId: {
                type: Number,
                default: 0
            }
        },
        
        watch:{
            pigcmsId: {
                immediate: true,
                handler(newVal, oldVal){
                    if(newVal){
                        this.getUrl(newVal)
                    }
                }
            }
        },
        
        methods:{
            getUrl(pigcms_id){
                this.request('/community/village_api.cashier/material_list', {pigcms_id,})
                .then((res) => {
                    this.iframeUrl = ''
                    console.log("this.iframeUrl===>1", this.iframeUrl)
                    this.$nextTick(()=>{
                        this.iframeUrl = res.url
                        console.log("this.iframeUrl===>2", this.iframeUrl)
                    })
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .audit_information{
        width: 100%;
        height: 50vh;
    }
</style>

<template>
    <div class="bg-ff wrap" >
        <div class="header-content flex align-center justify-between text-nowrap text-els">
            <span 
                class="header-title"
                :style="{
                    color: content.page_title_color || '#000000'
                }">{{content.page_title}}</span>
            <div 
                class="search-wrap flex-1 flex align-center"
                :style="{
                    color: catInfo.cat_fid != 0?'#8B929B':content.bg_color && content.bg_color != '#ffffff'?content.bg_color:'#000000',
                    background: catInfo.cat_fid != 0 || content.bg_color == '#ffffff'?'#F1F2F4':'rgba(255,255,255,0.8)'
                }">
                <a-icon type="search" />
                <span class="search-txt text-nowrap text-els">{{L(catInfo.cat_fid != 0?'请输入商家名、品类或商圈':'搜索商户名/服务项目')}}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        content: {
            type: [String,Object],
            default: ''
        }
    },
    computed: {
        // 是否为子分类装修
        catInfo() {
            let pageInfo = this.$store.state.customPage.pageInfo
            let info = {
                cat_id: pageInfo.source_id || '',
                cat_name: pageInfo.cat_name || '',
                cat_fid: pageInfo.cat_fid || '0',
            }
            return info
        },
    }
}
</script>

<style scoped>
.wrap {
    padding-top: 18px;
    width: 100%;
    height: 64px;
    background: transparent url(~@/assets/customPage/customPreviewHeaderBg.png) no-repeat top left;
    /* box-shadow: 0px 1px 0px 0px #F7F7F7; */
    box-sizing: border-box;
}
.header-content {
    padding: 0 20px;
    width: 290px;
    height: 100%;
    box-sizing: border-box;
}
.search-wrap {
    padding: 0 14px;
    width: 100%;
    height: 28px;
    background: rgba(255,255,255,0.8);
    border-radius: 28px;
    font-size: 12px;
    font-weight: 500;
    box-sizing: border-box;
}
.header-title {
    margin: 0 12px;
    font-size: 17px;
    font-weight: bold;
    color: #000000;
}
.search-txt {
    margin-left: 6px;
}
</style>
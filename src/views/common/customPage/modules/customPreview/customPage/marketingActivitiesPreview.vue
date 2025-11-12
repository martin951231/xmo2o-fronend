<template>
    <div class="bg-ff" v-if="list.length">
        <div class="title">
            {{content.title || L('营销活动')}}
        </div>
        <div 
            class="flex flex-wrap"
            :class="{
                'goods-wrap-one': content.style_type == '1',
                'goods-wrap-two': content.style_type == '2',
                'goods-wrap-three': content.style_type == '3'
            }">
            <div 
                class="goods-item-wrap"
                :class="{
                    'width-50': content.style_type == '2',
                    'width-33': content.style_type == '3',
                }"
                v-for="(item,index) in list"
                :key="index">
                <div class="goods-img-wrap">
                    <div class="goods-img">
                        <img v-if="item.image" class="goods-image" :src="item.image" alt="">
                        <img :src="defaultImg" v-else class="default-img" alt="">
                    </div>
                    
                    <span class="hd-type">{{hdTypeLabel}}</span>
                </div>
                <div class="name no-wrap">
                    <span>{{item.name}}</span>
                </div>
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
    data() {
        return {
            defaultImg: require('@/assets/customPage/marketingGoodsDefaultImg.png'),
            demoList: [
                {
                    goods_id: "1", //商品id
                    name: this.L("商品名称"), //商品名称
                    image: "", //图片
                },
                {
                    goods_id: "2",
                    name: this.L("商品名称"), 
                    image: "", 
                },
                {
                    goods_id: "3",
                    name: this.L("商品名称"), 
                    image: "", 
                }
            ]
        }
    },
    computed: {
        list() {
            let sliceNum = this.content && this.content.style_type?parseInt(this.content && this.content.style_type):1
            let demoList = this.content && this.content.style_type?this.demoList.slice(0,sliceNum):this.demoList
            let listNew = this.content && this.content.list && this.content.list.length?this.content.list:demoList
            // is_show == 2隐藏已失效的活动
            if (this.content && this.content.is_show && this.content.is_show == '2') {
                listNew = listNew.filter(item => {
                    return item.status != '2'
                })
            }
            return listNew
        },
        hdTypeLabel() {
            let label = this.L('活动')
            if (this.content && this.content.hd_type) {
                let hd_type = this.content.hd_type
                if (hd_type == 'limited') {
                    label = this.L('秒杀')
                } else if (hd_type == 'bargain') {
                    label = this.L('砍价')
                } else if (hd_type == 'group') {
                    label = this.L('拼团')
                }
            }
            return label
        }
    }
}
</script>

<style scoped>
.title {
    padding: 18px 12px;
    width: 100%;
    box-sizing: border-box;
    font-size: 15px;
    font-weight: bold;
    color: #000000;
    white-space: pre-wrap;
    word-break: break-all;
    word-wrap: break-word;
}
.goods-wrap-one {
    padding: 0 18px;
    width: 100%;
}
.goods-wrap-two,
.goods-wrap-three {
    padding: 0 9px;
    width: 100%;
    box-sizing: border-box;
}
.goods-item-wrap {
    width: 100%;
}
.width-50 {
    padding: 0 9px;
    width: 50%;
    box-sizing: border-box;
}
.width-33 {
    padding: 0 9px;
    width: 33.3333%;
    box-sizing: border-box;
}
.goods-wrap-one .goods-img-wrap {
    height: 190px;
}
.goods-wrap-two .goods-img-wrap {
    height: 160px;
}
.goods-wrap-three .goods-img-wrap {
    height: 100px;
}
.goods-img-wrap {
    position: relative;
    width: 100%; 
    text-align: center;
    background: #EBEDF1;
    border-radius: 4px;
    box-sizing: border-box;
}
.goods-img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    border-radius: 4px;
    overflow: hidden;
    box-sizing: border-box;
}
.goods-img .goods-image {
    width: 100%;
    height: 100%;
}
.hd-type {
    position: absolute;
    left: 0;
    top: 0;
    padding: 2px 8px;
    background: #FF654B;
    border-radius: 4px 0 8px 0;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 1;
}
.default-img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
.goods-wrap-three .default-img {
    width: 42px;
    height: auto;
}
.name {
    padding: 16px 0;
    line-height: 1;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
}

</style>
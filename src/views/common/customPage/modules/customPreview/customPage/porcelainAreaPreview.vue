<template>
    <div class="wrap flex">
        <div
            v-for="(item, index) in list"
            :key="index"
            class="flex-1 item-wrap text-nowrap text-els"
            :class="{
                'item-box-shadow': content.style_type == '1',
                'item-border': content.style_type == '2',
            }"
            :style="{
                height: '70px',
            }"
        >
            <div class="title-wrap flex-1 text-nowrap text-els">
                <div class="title text-nowrap text-els">
                    {{ item.title.trim() || L('主标题') }}
                </div>
                <div class="sub-title text-nowrap text-els">
                    {{ item.sub_title.trim() || L('副标题') }}
                </div>
            </div>

            <div class="img-wrap">
                <img
                    :src="item.image ? item.image : defaultImage"
                    alt=""
                    :style="{
                        width: imageSize.width,
                        height: imageSize.height,
                    }"
                />
            </div>

            <div class="badge text-nowrap text-els" v-show="item.show_badge == '1' && item.badge_val.trim() != ''">
                {{ item.badge_val.trim() }}
            </div>
        </div>
    </div>
</template>


<script>
export default {
    props: {
        content: {
            type: [String, Object],
            default: '',
        },
    },

    data() {
        return {
            defaultImage: require('@/assets/customPage/porcelainAreaDefaultImg.png'),
            demoList: [
                {
                    title: this.L('主标题'),
                    sub_title: this.L('副标题'),
                    link_url: '',
                    image: '',
                    show_badge: '2',
                    badge_val: '',
                },
                {
                    title: this.L('主标题'),
                    sub_title: this.L('副标题'),
                    link_url: '',
                    image: '',
                    show_badge: '2',
                    badge_val: '',
                },
            ],
        }
    },
    computed: {
        list() {
            return this.content && this.content.list && this.content.list.length ? this.content.list : this.demoList
        },
        imageSize() {
            let size = {
                width: '35px',
                height: '35px',
            }
            if (this.list.length == 3) {
                size.width = '30px'
                size.height = '30px'
            } else if (this.list.length == 4) {
                size.width = '25px'
                size.height = '25px'
            } else if (this.list.length == 5) {
                size.width = '20px'
                size.height = '20px'
            }
            return size
        },
    },
}
</script>


<style scoped>
.wrap {
    padding: 0 5px;
    width: 100%;
    box-sizing: border-box;
}
.item-wrap {
    position: relative;
    margin: 5px;
    width: 100%;
    border-radius: 5px;
    box-sizing: border-box;
    background: #ffffff;
}
.title-wrap {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 18px 7px 0 7px;
    box-sizing: border-box;
    z-index: 1;
}
.item-box-shadow {
    box-shadow: 0 0 7px 0 rgba(228, 228, 228, 0.89);
}
.item-border {
    border: 1px solid RGBA(239, 239, 239, 1);
}
.title {
    width: 100%;
    font-size: 12px;
    font-weight: bold;
    color: #010101;
}
.sub-title {
    margin-top: 2px;
    width: 100%;
    max-width: 80%;
    font-size: 9px;
    font-weight: 500;
    color: #999999;
    line-height: 1;
}
.img-wrap {
    position: absolute;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
}
.badge {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0 6px;
    font-size: 8px;
    font-weight: bold;
    color: #ffffff;
    background: RGBA(255, 90, 52, 1);
    border-radius: 0 10px 0 10px;
    max-width: 100%;
    line-height: 16px;
    height: 16px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
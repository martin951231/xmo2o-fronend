<template>
    <div class="computer_model">
        <div class="title_content">
            <div class="border_box">
                <div class="leftemptyybox"></div>
                <div class="titletext">{{ L('开台') }}</div>
                <div class="closeicon" @click="closemodel()">
                    <img src="../../../../../assets/storestaff/close.png" alt="" />
                </div>
            </div>
        </div>
        <div class="tableinfo">
            <div class="table_name">{{ L('台号') }}：{{ tableinfos.name }}</div>
            <div class="table_size">
                {{ L('餐位数') }}：{{ tableinfos.min_people }}-{{ tableinfos.max_people }}{{ L('人') }}
            </div>
        </div>
        <div class="numberinput_container">
            <div class="numberinput">{{ diningPeople }}</div>
        </div>
        <div class="computer_wrapper">
            <div class="computer_container">
                <div class="btn_items" v-for="(items, index) in numbervalueList" :key="index" @click="addnum(items)">
                    {{ items }}
                </div>
                <div class="btn_items" @click="del()">
                    <img src="../../../../../assets/storestaff/delnum.png" alt="" />
                </div>
            </div>
        </div>
        <div class="confirm_btn" :class="Number(diningPeople) > 0 ? '' : 'noclick'" @click="confirmOpen()">
            {{ L('开台并点菜') }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        tableinfos: Object,
    },
    data() {
        return {
            tableinfo: {},
            diningPeople: '',
            numbervalueList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0'],
            confirmOpenFlag: false
        }
    },
    created() {},
    methods: {
        // 确认开台
        confirmOpen() {
            if(this.confirmOpenFlag) return
            this.confirmOpenFlag = true
            this.request('/foodshop/storestaff.order/createOrder', {
                table_id: this.tableinfos.id,
                book_num: this.diningPeople,
            }).then((res) => {
                if (res.order_id) {
                    this.$store.commit('changeOrder', res.order_id)
                    this.closemodel()
                    this.$router.push({ name: 'menu', query: { orderId: res.order_id } })
                }
            }).finally(() => {
                this.confirmOpenFlag = false
            })
        },

        del() {
            if (this.diningPeople.length > 1) {
                this.diningPeople = this.diningPeople.slice(0, this.diningPeople.length - 1)
            } else if (this.diningPeople.length == 1) {
                this.diningPeople = ''
            }
        },
        closemodel() {
            this.$emit('closemodel')
        },
        addnum(val) {
            if (this.diningPeople == '') {
                this.diningPeople = val
            } else {
                this.diningPeople = this.diningPeople + val.toString()
                if (this.diningPeople > 255) {
                    this.diningPeople = '255'
                }
            }
        },
    },
}
</script>

<style scoped lang="less">
@rem: 192; //定义页面尺寸
.computer_model {
    width: 100%;
    height: 70%;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    .title_content {
        width: 100%;
        box-sizing: border-box;
        padding: 0 20 / @rem * 1rem;
        .border_box {
            width: 100;
            height: 100 / @rem * 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
            padding: 0 10 / @rem * 1rem;
            border-bottom: 1px solid #ededed;
            .closeicon {
                width: 26 / @rem * 1rem;
                height: 26 / @rem * 1rem;
                display: flex;
                cursor: pointer;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .leftemptyybox {
                width: 26 / @rem * 1rem;
                height: 26 / @rem * 1rem;
            }
            .titletext {
                font-size: 32 / @rem * 1rem;
                font-weight: normal;
                color: #222222;
            }
        }
    }
    .tableinfo {
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        height: 80 / @rem * 1rem;
        padding: 0 30 / @rem * 1rem;
        font-size: 22 / @rem * 1rem;
        color: #666666;
    }

    .numberinput_container {
        width: 100%;
        height: 80 / @rem * 1rem;
        box-sizing: border-box;
        padding: 0 30 / @rem * 1rem;
        .numberinput {
            width: 100%;
            height: 100%;
            background-color: #f7fffe;
            border-radius: 4 / @rem * 1rem;
            border: solid 2 / @rem * 1rem #18c6b6;
            text-align: center;
            line-height: 80 / @rem * 1rem;
            font-size: 30 / @rem * 1rem;
            color: #18c6b6;
        }
    }

    .computer_wrapper {
        width: 100%;
        box-sizing: border-box;
        padding: 0 30 / @rem * 1rem;
        .computer_container {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            margin: 36 / @rem * 1rem 0;
            position: relative;
            .btn_items {
                width: 33.33333%;
                text-align: center;
                height: 86 / @rem * 1rem;
                line-height: 86 / @rem * 1rem;
                font-size: 30 / @rem * 1rem;
                color: #666666;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                user-select: none;
                img {
                    width: 47 / @rem * 1rem;
                    height: 34 / @rem * 1rem;
                }
            }
            .btn_items::before {
                position: absolute;
                content: '';
                display: block;
                left: -50%;
                top: -50%;
                width: 200%;
                height: 200%;
                border: solid 1px #ededed;
                transform: scale(0.5);
                pointer-events: none;
            }
        }
        .computer_container::before {
            position: absolute;
            content: '';
            display: block;
            left: -50%;
            top: -50%;
            width: 200%;
            height: 200%;
            border: solid 1px #ededed;
            transform: scale(0.5);
            pointer-events: none;
        }
    }
    .confirm_btn {
        width: 100%;
        height: 90 / @rem * 1rem;
        text-align: center;
        line-height: 90 / @rem * 1rem;
        background-color: #18c6b6;
        font-size: 30 / @rem * 1rem;
        color: #ffffff;
        cursor: pointer;
        user-select: none;
    }
    .confirm_btn:active {
        opacity: 0.7;
    }
    .noclick {
        background-color: #eaeaef;
        pointer-events: none;
    }
}
</style>

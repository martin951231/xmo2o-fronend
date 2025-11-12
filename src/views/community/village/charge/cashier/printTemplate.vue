<template>
    <a-drawer :visible="showTemplate" v-if="showTemplate" title="新版打印模板设置" :width="1400" @close="handleCancel">
        <a-modal v-if="showTemplate" :title="'【'+modelTitle+'】自定义字段'" :visible="showModel" @ok="confirmModel"
            @cancel="cancelModel">
            <a-input placeholder="请输入自定义内容" v-model="customName" />
        </a-modal>
        <!-- <div class="plate_tips"></div> -->
        <a-collapse accordion>
            <a-collapse-panel key="1" header="操作说明">
                注意：</br>
                1、仅页眉和页脚支持换行</br>
                2、选择自定义时，需要填写自定义名称且不能和模板字段名称重复</br>
                3、所有自定义字段均为空白字头，不支持自动填充</br>
                4、自定义字段名称最长8位</br>
                5、系统关键词：<span v-for="(item, index) in templateKeyword" :key="index">{{item}}
                    {{index!=templateKeyword.length-1? '、': ''}}</span></br>
                <strong>6、模板配置中页眉区标题不选或打印标题不填，打印时则不展示账单标题</strong> </br>
                7、起度和止度只对 水费、电费、燃气费账单打印有效，且只支持新版收费。</br>
                8、收款员显示问题，只针对批量打印订单的情况，订单中只要有自动缴费的，收款员就显示自动缴费，否则就判断是否有平台缴费且没有收款人信息的，如果有就显示平台缴费，最后如果订单中没有自动缴费，且没有平台缴费(没有收款人信息)的，收款员就显示第一笔订单的收款人</br>
                9、<strong>NO</strong> 是打印模板编号，同一订单同一模板编号不变，同一订单不同模板编号不一样，批量打印同理。</br>
                10、模板中的 <strong>备注</strong> 是统计所选打印订单中有备注的条数，当统计条数小于2时，展示备注内容。</br>
                11、页眉区中的<strong>收款人</strong>,如果存在多个账单一起打印，以最后一个账单的收款人为准。 </br>
            </a-collapse-panel>
        </a-collapse>
        <div class="plate_content">
            <div class="left_menu">
                <div class="page_header" :style="{border:activeType==1?'0.5px dashed red':''}">
                    <div class="header_content">
                        <div class="left_title">页眉区</div>
                        <div class="right_selet">
                            <div class="select_list">
                                <a-select size="small" label-in-value placeholder="请选择显示内容" style="width: 140px"
                                    @change="handleChange" :allowClear="true">
                                    <a-select-option v-for="(item,index) in selectList1" :key="item.configure_id">
                                        {{item.title}}
                                    </a-select-option>
                                </a-select>
                            </div>
                            <div class="select_confirm">
                                <a-tooltip placement="topLeft" title="点击可填写自定义名称且不能和模板字段名称重复">
                                    <a-button size="small" type="primary" style="font-size: 12px;"
                                        @click="customThis(1)">
                                        自定义
                                    </a-button>
                                </a-tooltip>
                            </div>
                            <a-popover title="" placement="right" trigger="click" style="width: 17px;margin-left: 12px;"
                                v-if="templateType == 3">
                                <template slot="content">
                                    <a-select :default-value="font_set.font1.size ? font_set.font1.size*1: 14"
                                        style="width: 70px;" @change="(vl)=>selectFontSizeHandle(1,vl)"
                                        placeholder="请选择字体大小">
                                        <a-select-option v-for="(item,index) in font_size" :key="item.value">
                                            {{item.value}}
                                        </a-select-option>
                                    </a-select>
                                    <a-divider type="vertical" />
                                    <a-icon :style="{color: font_set.font1.weight ? selectcolor: ''}"
                                        class="popoverfont" type="bold" @click.stop="changeBold(1)" />
                                    <a-divider type="vertical" />
                                    <a-icon :style="{color: font_set.font1.style ? selectcolor: ''}" type="italic"
                                        @click.stop="changeItalic(1)" class="popoverfont" />
                                    <a-divider type="vertical" />
                                    <a-icon :style="{color: font_set.font1.textdecoration ? selectcolor: ''}"
                                        type="underline" @click.stop="changeUnderline(1)" class="popoverfont" />
                                </template>
                                <a-icon type="more" style="font-size:16px;color: #000;cursor: pointer;" />
                            </a-popover>
                        </div>
                    </div>

                    <div class="line"></div>

                    <div class="selected_content">
                        <div class="select_item" v-for="(item, index) in printList.filter(v=>v.print_type == 1)" :key="index">
                            {{item.title}} <span class="reduce_item" @click="reduceItem(item.key)">x</span>
                        </div>
                    </div>
                </div>

                <div class="page_header" v-if="templateType == 2 || templateType == 3"
                    :style="{border:activeType==4?'0.5px dashed red':''}">
                    <div class="header_content">
                        <div class="left_title">表格顶部区</div>
                        <div class="right_selet">
                            <div class="select_list">
                                <a-select size="small" label-in-value placeholder="请选择显示内容" style="width: 140px"
                                    @change="handleChange" :allowClear="true">
                                    <a-select-option v-for="(item,index) in selectList4" :key="item.configure_id">
                                        {{item.title}}
                                    </a-select-option>
                                </a-select>
                            </div>
                            <div class="select_confirm" v-show="false">
                                <a-tooltip placement="topLeft" title="点击可填写自定义名称且不能和模板字段名称重复">
                                    <a-button size="small" type="primary" style="font-size: 12px;"
                                        @click="customThis(4)">
                                        自定义
                                    </a-button>
                                </a-tooltip>
                            </div>
                            <a-popover title="" placement="right" trigger="click" style="width: 17px;margin-left: 12px;"
                                v-if="templateType == 3">
                                <template slot="content">
                                    <a-select :default-value="font_set.font4.size ? font_set.font4.size*1: 14"
                                        style="width: 70px;" @change="(vl)=>selectFontSizeHandle(4,vl)"
                                        placeholder="请选择字体大小">
                                        <a-select-option v-for="(item,index) in font_size" :key="item.value">
                                            {{item.value}}
                                        </a-select-option>
                                    </a-select>
                                    <a-divider type="vertical" />
                                    <a-icon :style="{color: font_set.font4.weight ? selectcolor: ''}" type="bold"
                                        @click.stop="changeBold(4)" class="popoverfont" />
                                    <a-divider type="vertical" />
                                    <a-icon :style="{color: font_set.font4.style ? selectcolor: ''}" type="italic"
                                        @click.stop="changeItalic(4)" class="popoverfont" />
                                    <a-divider type="vertical" />
                                    <a-icon :style="{color: font_set.font4.textdecoration ? selectcolor: ''}"
                                        type="underline" @click.stop="changeUnderline(4)" class="popoverfont" />
                                </template>
                                <a-icon type="more" style="font-size:16px;color: #000;cursor: pointer;" />
                            </a-popover>
                        </div>
                    </div>

                    <div class="line"></div>

                    <div class="selected_content">
                        <div class="select_item" v-for="(item, index) in printList" :key="index"
                            v-if="item.print_type == 4">
                            {{item.title}} <span class="reduce_item" @click="reduceItem(item.key)">x</span>
                        </div>
                    </div>
                </div>

                <div class="page_header" :style="{border:activeType==2?'0.5px dashed red':''}">
                    <div class="header_content">
                        <div class="left_title">表格区</div>
                        <div class="right_selet">

                            <div class="select_list" v-if="templateType == 3">
                                <a-select size="small" :default-value='blankline'  placeholder="选择留空行数" style="width: 110px;margin-right: 5px;"
                                    @change="handlexChange" :allowClear="true">
                                    <a-select-option value="0">不留空行</a-select-option>
                                    <a-select-option value="1">留1行空行</a-select-option>
                                    <a-select-option value="2">留2行空行</a-select-option>
                                    <a-select-option value="3">留3行空行</a-select-option>
                                    <a-select-option value="4">留4行空行</a-select-option>
                                    <a-select-option value="5">留5行空行</a-select-option>
                                    <a-select-option value="6">留6行空行</a-select-option>
                                    <a-select-option value="7">留7行空行</a-select-option>
                                    <a-select-option value="8">留8行空行</a-select-option>
                                </a-select>
                            </div>
                            <div class="select_list">
                                <a-select size="small" label-in-value placeholder="请选择显示内容" style="width: 140px"
                                    @change="handleChange" :allowClear="true">
                                    <a-select-option v-for="(item,index) in selectList2" :key="item.configure_id">
                                        {{item.title}}
                                    </a-select-option>
                                </a-select>
                            </div>
                            <div class="select_confirm" v-show="false">
                                <a-tooltip placement="topLeft" title="点击可填写自定义名称且不能和模板字段名称重复">
                                    <a-button size="small" type="primary" style="font-size: 12px;"
                                        @click="customThis(2)">
                                        自定义
                                    </a-button>
                                </a-tooltip>
                            </div>
                            <a-popover title="" placement="right" trigger="click" style="width: 17px;margin-left: 12px;"
                                v-if="templateType == 3">
                                <template slot="content">
                                    <a-select :default-value="font_set.font2.size ? font_set.font2.size*1: 14"
                                        style="width: 70px;" @change="(vl)=>selectFontSizeHandle(2,vl)"
                                        placeholder="请选择字体大小">
                                        <a-select-option v-for="(item,index) in font_size" :key="item.value">
                                            {{item.value}}
                                        </a-select-option>
                                    </a-select>
                                    <a-divider type="vertical" />
                                    <a-icon :style="{color: font_set.font2.weight ? selectcolor: ''}" type="bold"
                                        @click.stop="changeBold(2)" class="popoverfont" />
                                    <a-divider type="vertical" />
                                    <a-icon :style="{color: font_set.font2.style ? selectcolor: ''}" type="italic"
                                        @click.stop="changeItalic(2)" class="popoverfont" />
                                    <a-divider type="vertical" />
                                    <a-icon :style="{color: font_set.font2.textdecoration ? selectcolor: ''}"
                                        type="underline" @click.stop="changeUnderline(2)" class="popoverfont" />
                                </template>
                                <a-icon type="more" style="font-size:16px;color: #000;cursor: pointer;" />
                            </a-popover>
                        </div>
                    </div>

                    <div class="line"></div>

                    <div class="selected_content">
                        <div class="select_item" v-for="(item, index) in printList" :key="index"
                            v-if="item.print_type == 2">
                            {{item.title}} <span class="reduce_item" @click="reduceItem(item.key)">x</span>
                        </div>
                    </div>
                </div>

                <div class="page_header" v-if="templateType == 3" :style="{border:activeType==7?'0.5px dashed red':''}">
                    <div class="header_content">
                        <div class="left_title">表格底部四列区</div>
                        <div class="right_selet">
                            <div class="select_list">
                                <a-select size="small" label-in-value placeholder="请选择显示内容" style="width: 140px"
                                    @change="handleChange" :allowClear="true">
                                    <a-select-option v-for="(item,index) in selectList7" :key="item.configure_id">
                                        {{item.title}}
                                    </a-select-option>
                                </a-select>
                            </div>
                            <a-popover title="" placement="right" trigger="click"
                                style="width: 17px;margin-left: 12px;">
                                <template slot="content">
                                    <a-select :default-value="font_set.font7.size ? font_set.font7.size*1: 14"
                                        style="width: 70px;" @change="(vl)=>selectFontSizeHandle(7,vl)"
                                        placeholder="请选择字体大小">
                                        <a-select-option v-for="(item,index) in font_size" :key="item.value">
                                            {{item.value}}
                                        </a-select-option>
                                    </a-select>
                                    <a-divider type="vertical" />
                                    <a-icon :style="{color: font_set.font7.weight ? selectcolor: ''}" type="bold"
                                        @click.stop="changeBold(7)" class="popoverfont" />
                                    <a-divider type="vertical" />
                                    <a-icon :style="{color: font_set.font7.style ? selectcolor: ''}" type="italic"
                                        @click.stop="changeItalic(7)" class="popoverfont" />
                                    <a-divider type="vertical" />
                                    <a-icon :style="{color: font_set.font7.textdecoration ? selectcolor: ''}"
                                        type="underline" @click.stop="changeUnderline(7)" class="popoverfont" />
                                </template>
                                <a-icon type="more" style="font-size:16px;color: #000;cursor: pointer;" />
                            </a-popover>
                        </div>
                    </div>

                    <div class="line"></div>

                    <div class="selected_content">
                        <div class="select_item" v-for="(item, index) in printList" :key="index"
                            v-if="item.print_type == 7">
                            {{item.title}} <span class="reduce_item" @click="reduceItem(item.key)">x</span>
                        </div>
                    </div>
                </div>

                <div class="page_header" v-if="templateType == 2|| templateType == 3"
                    :style="{border:activeType==5?'0.5px dashed red':''}">
                    <div class="header_content">
                        <div class="left_title">表格底部三列区</div>
                        <div class="right_selet">
                            <div class="select_list">
                                <a-select size="small" label-in-value placeholder="请选择显示内容" style="width: 140px"
                                    @change="handleChange" :allowClear="true">
                                    <a-select-option v-for="(item,index) in selectList5" :key="item.configure_id">
                                        {{item.title}}
                                    </a-select-option>
                                </a-select>
                            </div>
                            <div class="select_confirm" v-show="false">
                                <a-tooltip placement="topLeft" title="点击可填写自定义名称且不能和模板字段名称重复">
                                    <a-button size="small" type="primary" style="font-size: 12px;"
                                        @click="customThis(5)">
                                        自定义
                                    </a-button>
                                </a-tooltip>
                            </div>
                            <a-popover title="" placement="right" trigger="click" style="width: 17px;margin-left: 12px;"
                                v-if="templateType == 3">
                                <template slot="content">
                                    <a-select :default-value="font_set.font5.size ? font_set.font5.size*1: 14"
                                        style="width: 70px;" @change="(vl)=>selectFontSizeHandle(5,vl)"
                                        placeholder="请选择字体大小">
                                        <a-select-option v-for="(item,index) in font_size" :key="item.value">
                                            {{item.value}}
                                        </a-select-option>
                                    </a-select>
                                    <a-divider type="vertical" />
                                    <a-icon :style="{color: font_set.font5.weight ? selectcolor: ''}" type="bold"
                                        @click.stop="changeBold(5)" class="popoverfont" />
                                    <a-divider type="vertical" />
                                    <a-icon :style="{color: font_set.font5.style ? selectcolor: ''}" type="italic"
                                        @click.stop="changeItalic(5)" class="popoverfont" />
                                    <a-divider type="vertical" />
                                    <a-icon :style="{color: font_set.font5.textdecoration ? selectcolor: ''}"
                                        type="underline" @click.stop="changeUnderline(5)" class="popoverfont" />
                                </template>
                                <a-icon type="more" style="font-size:16px;color: #000;cursor: pointer;" />
                            </a-popover>
                        </div>
                    </div>

                    <div class="line"></div>

                    <div class="selected_content">
                        <div class="select_item" v-for="(item, index) in printList" :key="index"
                            v-if="item.print_type == 5">
                            {{item.title}} <span class="reduce_item" @click="reduceItem(item.key)">x</span>
                        </div>
                    </div>
                </div>

                <div class="page_header" v-if="templateType == 2|| templateType == 3"
                    :style="{border:activeType==6?'0.5px dashed red':''}">
                    <div class="header_content">
                        <div class="left_title">表格底部单行区</div>
                        <div class="right_selet">
                            <div class="select_list">
                                <a-select size="small" label-in-value placeholder="请选择显示内容" style="width: 140px"
                                    @change="handleChange" :allowClear="true">
                                    <a-select-option v-for="(item,index) in selectList6" :key="item.configure_id">
                                        {{item.title}}
                                    </a-select-option>
                                </a-select>
                            </div>
                            <div class="select_confirm" v-show="false">
                                <a-tooltip placement="topLeft" title="点击可填写自定义名称且不能和模板字段名称重复">
                                    <a-button size="small" type="primary" style="font-size: 12px;"
                                        @click="customThis(6)">
                                        自定义
                                    </a-button>
                                </a-tooltip>
                            </div>
                            <a-popover title="" placement="right" trigger="click" style="width: 17px;margin-left: 12px;"
                                v-if="templateType == 3">
                                <template slot="content">
                                    <a-select :default-value="font_set.font6.size ? font_set.font6.size*1: 14"
                                        style="width: 70px;" @change="(vl)=>selectFontSizeHandle(6,vl)"
                                        placeholder="请选择字体大小">
                                        <a-select-option v-for="(item,index) in font_size" :key="item.value">
                                            {{item.value}}
                                        </a-select-option>
                                    </a-select>
                                    <a-divider type="vertical" />
                                    <a-icon :style="{color: font_set.font6.weight ? selectcolor: ''}" type="bold"
                                        @click.stop="changeBold(6)" class="popoverfont" />
                                    <a-divider type="vertical" />
                                    <a-icon :style="{color: font_set.font6.style ? selectcolor: ''}" type="italic"
                                        @click.stop="changeItalic(6)" class="popoverfont" />
                                    <a-divider type="vertical" />
                                    <a-icon :style="{color: font_set.font6.textdecoration ? selectcolor: ''}"
                                        type="underline" @click.stop="changeUnderline(6)" class="popoverfont" />
                                </template>
                                <a-icon type="more" style="font-size:16px;color: #000;cursor: pointer;" />
                            </a-popover>
                        </div>
                    </div>

                    <div class="line"></div>

                    <div class="selected_content">
                        <div class="select_item" v-for="(item, index) in printList" :key="index"
                            v-if="item.print_type == 6">
                            {{item.title}} <span class="reduce_item" @click="reduceItem(item.key)">x</span>
                        </div>
                    </div>
                </div>

                <div class="page_header" :style="{border:activeType==3?'0.5px dashed red':''}">
                    <div class="header_content">
                        <div class="left_title">页脚区</div>
                        <div class="right_selet">
                            <div class="select_list">
                                <a-select size="small" label-in-value placeholder="请选择显示内容" style="width: 140px"
                                    @change="handleChange" :allowClear="true">
                                    <a-select-option v-for="(item,index) in selectList3" :key="item.configure_id">
                                        {{item.title}}
                                    </a-select-option>
                                </a-select>
                            </div>
                            <div class="select_confirm">
                                <a-tooltip placement="topLeft" title="点击可填写自定义名称且不能和模板字段名称重复">
                                    <a-button size="small" type="primary" style="font-size: 12px;"
                                        @click="customThis(3)">
                                        自定义
                                    </a-button>
                                </a-tooltip>
                            </div>
                            <a-popover title="" placement="right" trigger="click" style="width: 17px;margin-left: 12px;"
                                v-if="templateType == 3">
                                <template slot="content">
                                    <a-select :default-value="font_set.font3.size ? font_set.font3.size*1: 14"
                                        style="width: 70px;" @change="(vl)=>selectFontSizeHandle(3,vl)"
                                        placeholder="请选择字体大小">
                                        <a-select-option v-for="(item,index) in font_size" :key="item.value">
                                            {{item.value}}
                                        </a-select-option>
                                    </a-select>
                                    <a-divider type="vertical" />
                                    <a-icon :style="{color: font_set.font3.weight ? selectcolor: ''}" type="bold"
                                        @click.stop="changeBold(3)" class="popoverfont" />
                                    <a-divider type="vertical" />
                                    <a-icon :style="{color: font_set.font3.style ? selectcolor: ''}" type="italic"
                                        @click.stop="changeItalic(3)" class="popoverfont" />
                                    <a-divider type="vertical" />
                                    <a-icon :style="{color: font_set.font3.textdecoration ? selectcolor: ''}"
                                        type="underline" @click.stop="changeUnderline(3)" class="popoverfont" />
                                </template>
                                <a-icon type="more" style="font-size:16px;color: #000;cursor: pointer;" />
                            </a-popover>
                        </div>
                    </div>

                    <div class="line"></div>

                    <div class="selected_content">
                        <div class="select_item" v-for="(item, index) in printList" :key="index"
                            v-if="item.print_type == 3">
                            {{item.title}} <span class="reduce_item" @click="reduceItem(item.key)">x</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="right_table">
                <div class="table_content">
                    <div class="table_header">
                        <div class="header_title" style="font-weight: bold;">
                            【{{templateName}}】 预览区
                        </div>

                        <div class="header_operate">
                            <a-button type="primary" size="small" style="font-size: 12px;" @click="saveThis">
                                保存
                            </a-button>
                        </div>
                    </div>
                    <div class="line"></div>

                    <div class="main_content">
                        <div class="print_table_title"
                            v-if="printList.findIndex(v=>v.title=='标题')!=-1 && printObj.top_title">
                            {{printObj.top_title}}
                        </div>
                        <div class="module_one" :style="{border:activeType==1?'0.5px dashed red':''}"
                            v-if="printList.filter(v=>v.print_type == 1).length>0">
                            <div v-if="templateType!=3" class="header_show" style="width: 100%; display: flex; flex-wrap: wrap;">
                                <div v-if="item.title!='标题'" style="flex-shrink: 0; margin: 5px 0; word-break: break-word;"
                                :style="{width: item.title=='换行'?'100%':item.width?item.width:1/col_num*100+'%', margin:item.title=='换行'?'0':'5px 0'}"
                                class="page_header_item" v-for="(item, index) in printList.filter(v=>v.print_type == 1)" :key="index">
                                    <div :style="font1style" style="margin-left: 10px;" v-if="item.title!='换行'">
                                        {{item.title}}：{{item.value}}
                                    </div>
                                </div>
                            </div>
                            <a-descriptions v-if="templateType==3 && !(printList.filter(v=>v.print_type == 1).length == 1 && printList.filter(v=>v.print_type == 1)[0].title=='标题')" style="padding-top: 10px" :column="col_num"
                                :class="'template'+templateType+'type'">
                                <a-descriptions-item v-for="(item,index) in printList.filter(v=>v.print_type == 1)" :key="index+60"
                                    v-if="item.title !== '换行' && item.print_type == 1 && item.title !== '标题'">
                                    <template v-slot:label>
                                        <span :style="font1style" v-if="item.id==78">
                                            {{item.title}}
                                        </span>
                                        <span :style="font1style" v-else>
                                            {{item.title}}：
                                        </span>
                                    </template>
                                    <span :style="font1style">{{item.value}}</span>
                                </a-descriptions-item>
                            </a-descriptions>
                        </div>
                        <div class="module_two">
                            <div :style="{border:activeType==4?'0.5px dashed red':''}"
                                v-if="printList.filter(v=>v.print_type == 4).length>0">
                                <div class="table_top" v-show="printList.filter(v=>v.print_type == 4).length>0"
                                    v-if="templateType == 2|| templateType == 3">
                                    <div class="header_item"
                                        v-for="(item, index) in printList.filter(v=>v.print_type == 4)" :key="index">
                                        <span :style="font4style">{{item.title}}：</span>
                                    </div>
                                </div>
                            </div>

                            <div :style="{border:activeType==2?'0.5px dashed red':''}"
                                v-if="printList.filter(v=>v.print_type == 2).length>0">
                                <div class="table_container">
                                    <div class="table_item"
                                        :style="{width:(1/printList.filter(v=>v.print_type == 2).length)*100+'%' }"
                                        v-for="(item, index) in printList.filter(v=>v.print_type == 2)" :key="index">
                                        <span :style="font2style">{{item.title}}</span>
                                    </div>
                                </div>

                                <div class="table_container" v-for="(v, i) in 2" :key="i+30">
                                    <div class="table_item"
                                        :style="{width:(1/printList.filter(v=>v.print_type == 2).length)*100+'%' }"
                                        v-for="(item, index) in printList.filter(v=>v.print_type == 2)" :key="index+i">
                                    </div>
                                </div>
                            </div>

                            <div :style="{border:activeType==7?'0.5px dashed red':''}"
                                v-if="printList.filter(v=>v.print_type == 7).length>0">
                                <div class="table_footer_7" v-if="templateType == 3"
                                    v-for="(item, index) in printList.filter(v=>v.print_type == 7)" :key="index">
                                    <div class="left_title"><span :style="font7style">{{item.title}}</span></div>

                                    <div class="right_71" :style="font7style">人民币大写</div>
                                    <div class="right_72"></div>
                                    <div class="right_73"></div>

                                </div>
                            </div>

                            <div :style="{border:activeType==5?'0.5px dashed red':''}"
                                v-if="printList.filter(v=>v.print_type == 5).length>0">
                                <div class="table_footer_one" v-if="templateType == 2 || templateType == 3"
                                    v-for="(mc,imc) in active5List" :key="imc">
                                    <div class="table_item" :class="templateType == 3 ? 'table_item_5':''"
                                        :style="{width:(1/mc.length)*100+'%' }" v-for="(item, index) in mc"
                                        :key="index">

                                        <div :style="font5style" class="div51" v-if="templateType==3"><span
                                                class="span51">{{item.title}}</span><span class="span52"></span></div>

                                        <span v-else>{{item.title}}：</span>

                                    </div>
                                </div>
                            </div>

                            <div :style="{border:activeType==6?'0.5px dashed red':''}"
                                v-if="printList.filter(v=>v.print_type == 6).length>0">
                                <div class="table_footer_two" v-if="templateType == 2 || templateType == 3"
                                    v-for="(item, index) in printList.filter(v=>v.print_type == 6)" :key="index">
                                    <div class="left_title"><span :style="font6style">{{item.title}}：</span></div>
                                    <div class="right_content"></div>
                                </div>
                            </div>

                        </div>
                        <div class="module_three" :style="{border:activeType==3?'0.5px dashed red':''}"
                            v-if="printList.filter(v=>v.print_type == 3).length>0">
                            <div v-if="templateType!=3" class="header_show" style="width: 100%; display: flex; flex-wrap: wrap;">
                                <div v-if="item.title!='标题'" style="flex-shrink: 0; margin: 5px 0; word-break: break-word;"
                                :style="{width: item.title=='换行'?'100%':item.width?item.width:1/col_num*100+'%', margin:item.title=='换行'?'0':'5px 0'}"
                                class="page_header_item" v-for="(item, index) in printList.filter(v=>v.print_type == 3)" :key="index">
                                    <div :style="font1style" style="margin-left: 10px;" v-if="item.title!='换行'">
                                        {{item.title}}：{{item.value}}
                                    </div>
                                </div>
                            </div>
                            
                            <a-descriptions v-else style="padding-top: 10px" :column="col_num"
                                :class="'template'+templateType+'type'">
                                <a-descriptions-item v-for="(item,index) in printList" :key="index+60"
                                    v-if="item.title !== '换行' && item.print_type == 3">
                                    <template v-slot:label>
                                        <span :style="font3style" v-if="item.id==78">
                                            {{item.title}}
                                        </span>
                                        <span :style="font3style" v-else>
                                            {{item.title}}：
                                        </span>
                                    </template>
                                    <span :style="font3style">{{item.value}}</span>
                                </a-descriptions-item>
                            </a-descriptions>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </a-drawer>
</template>

<script>
    import villageApi from '@/api/community/village';
    export default {
        props: {
            showTemplate: {
                type: Boolean,
                default: false
            },
            tempateId: {
                type: Number,
                default: 0
            },
            templateName: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                selectList1: [],
                selectList2: [],
                selectList3: [],
                selectList4: [],
                selectList5: [],
                selectList6: [],
                selectList7: [],
                printObj: {},
                printList: [],
                templateKeyword: [],
                col_num: 3,
                customName: '',
                showModel: false,
                printType: 0,
                modelTitle: '',
                templateType: 1,
                activeType: 0,
                selectcolor: '#0563ef',
                font_size: [],
                font_set: {
                    'font1': {
                        'print_type': 1,
                        'size': '',
                        'weight': '',
                        'style': '',
                        'textdecoration': ''
                    },
                    'font2': {
                        'print_type': 2,
                        'size': '',
                        'weight': '',
                        'style': '',
                        'textdecoration': ''
                    },
                    'font3': {
                        'print_type': 3,
                        'size': '',
                        'weight': '',
                        'style': '',
                        'textdecoration': ''
                    },
                    'font4': {
                        'print_type': 4,
                        'size': '',
                        'weight': '',
                        'style': '',
                        'textdecoration': ''
                    },
                    'font5': {
                        'print_type': 5,
                        'size': '',
                        'weight': '',
                        'style': '',
                        'textdecoration': ''
                    },
                    'font6': {
                        'print_type': 6,
                        'size': '',
                        'weight': '',
                        'style': '',
                        'textdecoration': ''
                    },
                    'font7': {
                        'print_type': 7,
                        'size': '',
                        'weight': '',
                        'style': '',
                        'textdecoration': ''
                    }
                },
                font1style: '',
                font2style: '',
                font3style: '',
                font4style: '',
                font5style: '',
                font6style: '',
                font7style: '',
                active5List: [],
                blankline:'0',
            }
        },

        mounted() {
            this.getTemplateDetail()
        },

        methods: {
            getReduceRes(list){
                let result=list.reduce((pre, current, index, arr)=>{
                    if(index==0&&current.title=='换行'){
                        return this.col_num - 1
                    }
                    if(index==0&&current.title=='标题'){
                        return -1
                    }
                    if(index==0){
                        return 0
                    }
                    if(current.title == '换行' && (pre+2)%this.col_num==0){
                        return pre+1
                    }
                    if(current.title == '换行' && (pre+2)%this.col_num!=0){
                        return pre+this.col_num-(pre+1+1)%this.col_num+1
                    }
                    if(current.title == '标题'){
                        return pre
                    }
                    if(current.title!='换行'&&current.title!='标题'){
                        return pre+1
                    }
                }, 0)
                return result;
            },
            
            pageHeaderMap(){
                let mapArr = []
                this.printList.filter(v=>v.print_type==1).map(v=>{
                    mapArr.push(v)
                    v.realIndex = this.getReduceRes(mapArr)
                })
                
                this.printList.filter(v=>v.print_type==1).map((v, i)=>{
                    if(v.title == '换行'){
                        console.log(this.printList.filter(v=>v.print_type==1)[i-1]['realIndex'] % 4)
                        let width = ''
                        if((this.printList.filter(v=>v.print_type==1)[i-1]['realIndex'] + 1) % this.col_num == 0){
                            width = (1 - (this.printList.filter(v=>v.print_type==1)[i-1]['realIndex'] + 1) % this.col_num) / this.col_num * 100 + '%'
                        } else {
                            width = (this.col_num + 1 - (this.printList.filter(v=>v.print_type==1)[i-1]['realIndex'] + 1) % this.col_num) / this.col_num * 100 + '%'
                        }
                        this.printList.filter(v=>v.print_type==1)[i-1]['width'] = width
                    }
                })
                console.log('printList===>', this.printList)
            },
            
            pageFooterMap(){
                let mapArr = []
                this.printList.filter(v=>v.print_type==3).map(v=>{
                    mapArr.push(v)
                    v.realIndex = this.getReduceRes(mapArr)
                })
                
                this.printList.filter(v=>v.print_type==3).map((v, i)=>{
                    if(v.title == '换行'){
                        console.log(this.printList.filter(v=>v.print_type==1)[i-1]['realIndex'] % this.col_num)
                        let width = ''
                        if((this.printList.filter(v=>v.print_type==3)[i-1]['realIndex'] + 1) % this.col_num == 0){
                            width = (1 - (this.printList.filter(v=>v.print_type==3)[i-1]['realIndex'] + 1) % this.col_num) / this.col_num * 100 + '%'
                        } else {
                            width = (this.col_num + 1 - (this.printList.filter(v=>v.print_type==3)[i-1]['realIndex'] + 1) % this.col_num) / this.col_num * 100 + '%'
                        }
                        this.printList.filter(v=>v.print_type==3)[i-1]['width'] = width
                    }
                })
                console.log('printList===>', this.printList)
            },
            
            handleCancel(e) {
                let that = this
                that.$confirm({
                    title: '操作提示',
                    cancelText: '继续操作',
                    okText: "不保存且退出",
                    content: '点击【不保存且退出】按钮可能会导致当前打印模板设置数据丢失，建议先确认是否已保存数据？',
                    onOk() {
                        that.$emit('closeThis')
                    },
                    onCancel() {},
                });
            },
            getCSSClass(jj, len) {
                let tmplen = len > 1 ? len - 1 : 0;
                if (tmplen > 0) {
                    let cname = 'item_';
                    if (jj == 0) {
                        cname = cname + 'first';
                    } else if (jj == tmplen) {
                        cname = cname + 'last';
                    } else {
                        cname = cname + 'center';
                    }
                    return cname;
                } else {
                    return 'item_0';
                }
            },
            handleFontStyle(ii) {
                if (ii == 1) {
                    let font1style = '';
                    if (this.font_set.font1 != undefined) {
                        if (this.font_set.font1.size && this.font_set.font1.size > 0) {
                            font1style += 'font-size:' + this.font_set.font1.size + 'px;';
                        }
                        if (this.font_set.font1.weight && this.font_set.font1.weight.length > 0) {
                            font1style += 'font-weight:' + this.font_set.font1.weight + ';';
                        }
                        if (this.font_set.font1.style && this.font_set.font1.style.length > 0) {
                            font1style += 'font-style:' + this.font_set.font1.style + ';';
                        }
                        if (this.font_set.font1.textdecoration && this.font_set.font1.textdecoration.length > 0) {
                            font1style += 'text-decoration:' + this.font_set.font1.textdecoration + ';';
                        }
                        this.font1style = font1style;
                    }
                } else if (ii == 2) {
                    let font2style = '';
                    if (this.font_set.font2 != undefined) {
                        if (this.font_set.font2.size && this.font_set.font2.size > 0) {
                            font2style += 'font-size:' + this.font_set.font2.size + 'px;';
                        }
                        if (this.font_set.font2.weight && this.font_set.font2.weight.length > 0) {
                            font2style += 'font-weight:' + this.font_set.font2.weight + ';';
                        }
                        if (this.font_set.font2.style && this.font_set.font2.style.length > 0) {
                            font2style += 'font-style:' + this.font_set.font2.style + ';';
                        }
                        if (this.font_set.font2.textdecoration && this.font_set.font2.textdecoration.length > 0) {
                            font2style += 'text-decoration:' + this.font_set.font2.textdecoration + ';';
                        }
                        this.font2style = font2style;
                    }
                } else if (ii == 3) {
                    let font3style = '';
                    if (this.font_set.font3 != undefined) {
                        if (this.font_set.font3.size && this.font_set.font3.size > 0) {
                            font3style += 'font-size:' + this.font_set.font3.size + 'px;';
                        }
                        if (this.font_set.font3.weight && this.font_set.font3.weight.length > 0) {
                            font3style += 'font-weight:' + this.font_set.font3.weight + ';';
                        }
                        if (this.font_set.font3.style && this.font_set.font3.style.length > 0) {
                            font3style += 'font-style:' + this.font_set.font3.style + ';';
                        }
                        if (this.font_set.font3.textdecoration && this.font_set.font3.textdecoration.length > 0) {
                            font3style += 'text-decoration:' + this.font_set.font3.textdecoration + ';';
                        }

                    }
                    this.font3style = font3style;
                } else if (ii == 4) {
                    let font4style = '';
                    if (this.font_set.font4 != undefined) {
                        if (this.font_set.font4.size && this.font_set.font4.size > 0) {
                            font4style += 'font-size:' + this.font_set.font4.size + 'px;';
                        }
                        if (this.font_set.font4.weight && this.font_set.font4.weight.length > 0) {
                            font4style += 'font-weight:' + this.font_set.font4.weight + ';';
                        }
                        if (this.font_set.font4.style && this.font_set.font4.style.length > 0) {
                            font4style += 'font-style:' + this.font_set.font4.style + ';';
                        }
                        if (this.font_set.font4.textdecoration && this.font_set.font4.textdecoration.length > 0) {
                            font4style += 'text-decoration:' + this.font_set.font4.textdecoration + ';';
                        }

                    }
                    this.font4style = font4style;
                } else if (ii == 5) {
                    let font5style = '';
                    if (this.font_set.font5 != undefined) {
                        if (this.font_set.font5.size && this.font_set.font5.size > 0) {
                            font5style += 'font-size:' + this.font_set.font5.size + 'px;';
                        }
                        if (this.font_set.font5.weight && this.font_set.font5.weight.length > 0) {
                            font5style += 'font-weight:' + this.font_set.font5.weight + ';';
                        }
                        if (this.font_set.font5.style && this.font_set.font5.style.length > 0) {
                            font5style += 'font-style:' + this.font_set.font5.style + ';';
                        }
                        if (this.font_set.font5.textdecoration && this.font_set.font5.textdecoration.length > 0) {
                            font5style += 'text-decoration:' + this.font_set.font5.textdecoration + ';';
                        }
                    }
                    this.font5style = font5style;
                } else if (ii == 6) {
                    let font6style = '';
                    if (this.font_set.font6 != undefined) {
                        if (this.font_set.font6.size && this.font_set.font6.size > 0) {
                            font6style += 'font-size:' + this.font_set.font6.size + 'px;';
                        }
                        if (this.font_set.font6.weight && this.font_set.font6.weight.length > 0) {
                            font6style += 'font-weight:' + this.font_set.font6.weight + ';';
                        }
                        if (this.font_set.font6.style && this.font_set.font6.style.length > 0) {
                            font6style += 'font-style:' + this.font_set.font6.style + ';';
                        }
                        if (this.font_set.font6.textdecoration && this.font_set.font6.textdecoration.length > 0) {
                            font6style += 'text-decoration:' + this.font_set.font6.textdecoration + ';';
                        }

                    }
                    this.font6style = font6style;
                } else if (ii == 7) {
                    let font7style = '';
                    if (this.font_set.font7 != undefined) {
                        if (this.font_set.font7.size && this.font_set.font7.size > 0) {
                            font7style += 'font-size:' + this.font_set.font7.size + 'px;';
                        }
                        if (this.font_set.font7.weight && this.font_set.font7.weight.length > 0) {
                            font7style += 'font-weight:' + this.font_set.font7.weight + ';';
                        }
                        if (this.font_set.font7.style && this.font_set.font7.style.length > 0) {
                            font7style += 'font-style:' + this.font_set.font7.style + ';';
                        }
                        if (this.font_set.font7.textdecoration && this.font_set.font7.textdecoration.length > 0) {
                            font7style += 'text-decoration:' + this.font_set.font7.textdecoration + ';';
                        }

                    }
                    this.font7style = font7style;
                }

            },
            selectFontSizeHandle(index, vl) {
                if (this.font_set['font' + index] != undefined) {
                    this.font_set['font' + index].size = vl;
                } else {
                    this.font_set['font' + index] = {
                        'size': vl
                    }
                }
                this.handleFontStyle(index);
            },
            changeBold(index) {
                if (this.font_set['font' + index] != undefined) {
                    if (this.font_set['font' + index].weight == 'bold') {
                        this.font_set['font' + index].weight = '';
                    } else {
                        this.font_set['font' + index].weight = 'bold';
                    }
                } else {
                    this.font_set['font' + index] = {
                        'weight': 'bold'
                    }
                }
                this.handleFontStyle(index);
            },
            changeItalic(index) {
                if (this.font_set['font' + index] != undefined) {
                    if (this.font_set['font' + index].style == 'italic') {
                        this.font_set['font' + index].style = '';
                    } else {
                        this.font_set['font' + index].style = 'italic';
                    }
                } else {
                    this.font_set['font' + index] = {
                        'style': 'italic'
                    }
                }
                this.handleFontStyle(index);
            },
            changeUnderline(index) {
                if (this.font_set['font' + index] != undefined) {
                    if (this.font_set['font' + index].textdecoration == 'underline') {
                        this.font_set['font' + index].textdecoration = '';
                    } else {
                        this.font_set['font' + index].textdecoration = 'underline';
                    }
                } else {
                    this.font_set['font' + index] = {
                        'textdecoration': 'underline'
                    }
                }
                this.handleFontStyle(index);
            },
            handlexChange(ov){
                if(ov==undefined){
                    ov=0;
                }
                this.blankline=ov;
                console.log(this.blankline);
            },
            handleChange(value) {
                console.log(value);
                if (value == undefined || !value.key) {
                    return true;
                }
                this.selectList1.map((v, i) => {
                    if (v.configure_id == value.key) {
                        if (v.title == '标题') {
                            let index = this.printList.findIndex(vv => vv.title == '标题')
                            if (index == -1) {
                                this.printList.push({
                                    id: v.configure_id,
                                    title: v.title,
                                    print_type: v.type,
                                    key: 'e' + v.configure_id + (this.printList.length + 1)
                                })
                                this.activeType = 1
                            } else {
                                this.$message.warn('你已经添加过标题了，不能重复添加')
                            }
                        } else {
                            let indextmp = this.printList.findIndex((vv) => vv.id == v.configure_id);
                            if (indextmp == -1) {
                                this.printList.push({
                                    id: v.configure_id,
                                    title: v.title,
                                    print_type: v.type,
                                    key: 'e' + v.configure_id + (this.printList.length + 1)
                                })
                            } else if(v.title == '换行'){
                                this.printList.push({
                                    id: v.configure_id,
                                    title: v.title,
                                    print_type: v.type,
                                    key: 'e' + v.configure_id + (this.printList.length + 1)
                                })
                            }
                            this.activeType = 1
                        }
                        this.pageHeaderMap()
                    }
                })

                this.selectList2.map((v, i) => {
                    if (v.configure_id == value.key) {
                        let indextmp = this.printList.findIndex(vv => vv.id == v.configure_id);
                        if (indextmp == -1) {
                            this.printList.push({
                                id: v.configure_id,
                                title: v.title,
                                print_type: v.type,
                                key: 'e' + v.configure_id + (this.printList.length + 1)
                            })
                        }
                        this.activeType = 2
                    }
                })

                this.selectList3.map((v, i) => {
                    if (v.configure_id == value.key) {
                        let indextmp = this.printList.findIndex(vv => vv.id == v.configure_id);
                        if (indextmp == -1) {
                            this.printList.push({
                                id: v.configure_id,
                                title: v.title,
                                print_type: v.type,
                                key: 'e' + v.configure_id + (this.printList.length + 1)
                            })
                        } else if(v.title == '换行'){
                            this.printList.push({
                                id: v.configure_id,
                                title: v.title,
                                print_type: v.type,
                                key: 'e' + v.configure_id + (this.printList.length + 1)
                            })
                        }
                        this.activeType = 3
                        this.pageFooterMap()
                    }
                })

                this.selectList4.map((v, i) => {
                    if (v.configure_id == value.key) {
                        if (this.printList.filter(v => v.print_type == 4).length >= this.col_num * 1) {
                            this.$message.warn('此项最多只能添加' + this.col_num + '个')
                        } else {
                            let indextmp = this.printList.findIndex(vv => vv.id == v.configure_id);
                            if (indextmp == -1) {
                                this.printList.push({
                                    id: v.configure_id,
                                    title: v.title,
                                    print_type: v.type,
                                    key: 'e' + v.configure_id + (this.printList.length + 1)
                                })
                            }
                            this.activeType = 4
                        }
                    }
                })



                this.selectList5.map((v, i) => {
                    if (v.configure_id == value.key) {
                        if (false && this.printList.filter(v => v.print_type == 5).length >= this.col_num * 1) {
                            this.$message.warn('此项最多只能添加' + this.col_num + '个')
                        } else {
                            let indextmp = this.printList.findIndex(vv => vv.id == v.configure_id);
                            if (indextmp == -1) {
                                this.printList.push({
                                    id: v.configure_id,
                                    title: v.title,
                                    print_type: v.type,
                                    key: 'e' + v.configure_id + (this.printList.length + 1)
                                })
                            }
                            this.activeType = 5
                        }
                    }
                })
                let select5Arr = this.printList.filter(vv => vv.print_type == 5);
                this.active5List = [];
                if (select5Arr && select5Arr.length > 0) {
                    select5Arr.forEach((item, index) => {
                        let tmpcol = index / 3;
                        let ii = Math.floor(tmpcol);
                        if (this.active5List[ii] != undefined) {
                            this.active5List[ii].push(item)
                        } else {
                            this.active5List[ii] = [];
                            this.active5List[ii].push(item);
                        }
                    });
                }
                console.log('active5List', this.active5List);
                this.selectList6.map((v, i) => {
                    if (v.configure_id == value.key) {
                        let indextmp = this.printList.findIndex(vv => vv.id == v.configure_id);
                        if (indextmp == -1) {
                            this.printList.push({
                                id: v.configure_id,
                                title: v.title,
                                print_type: v.type,
                                key: 'e' + v.configure_id + (this.printList.length + 1)
                            })
                        }
                        this.activeType = 6
                    }
                })
                this.selectList7.map((v, i) => {
                    if (v.configure_id == value.key) {
                        let indextmp = this.printList.findIndex(vv => vv.id == v.configure_id);
                        if (indextmp == -1) {
                            this.printList.push({
                                id: v.configure_id,
                                title: v.title,
                                print_type: v.type,
                                key: 'e' + v.configure_id + (this.printList.length + 1)
                            })
                        }
                        this.activeType = 7
                    }
                })
                console.log("this.activeType=====>", this.activeType)
            },

            getPrintCustom(type) {
                this.request(villageApi.getPrintCustomConfigureList, {
                    type: type,
                    template_id: this.tempateId
                }).then(res => {
                    if (type == 1) {
                        this.selectList1 = res
                    } else if (type == 2) {
                        this.selectList2 = res
                    } else if (type == 3) {
                        this.selectList3 = res
                    } else if (type == 4) {
                        this.selectList4 = res
                    } else if (type == 5) {
                        this.selectList5 = res
                    } else if (type == 6) {
                        this.selectList6 = res
                    } else if (type == 7) {
                        this.selectList7 = res
                    }
                    
                    if(this.templateType == 3 && type == 1){
                        this.selectList1 = res.filter(v=>v.title!='换行')
                    }
                    
                    if(this.templateType == 3 && type == 3){
                        this.selectList3 = res.filter(v=>v.title!='换行')
                    }
                })
            },

            getTemplateDetail() {
                this.request(villageApi.getTemplateDetail, {
                    template_id: this.tempateId
                }).then(res => {
                    this.printObj = res.data
                    this.col_num = res.data.col_num
                    this.templateType = res.data.type
                    this.font_size = res.font_size;
                    if (this.templateType == 2 || this.templateType == 3) {
                        this.getPrintCustom(1)
                        this.getPrintCustom(2)
                        this.getPrintCustom(3)
                        this.getPrintCustom(4)
                        this.getPrintCustom(5)
                        this.getPrintCustom(6)
                        if (this.templateType == 3) {
                            this.getPrintCustom(7)
                            if(res.extra_data &&  res.extra_data.blankline!=undefined && res.extra_data.blankline){
                                this.blankline=res.extra_data.blankline.toString();
                            }
                        }

                    } else {
                        this.getPrintCustom(1)
                        this.getPrintCustom(2)
                        this.getPrintCustom(3)
                    }
                    res.list.map((v, i) => {
                        this.printList.push({
                            id: v.id,
                            print_type: v.print_type,
                            title: v.title,
                            key: 's' + v.id + (this.printList.length + 1)
                        })
                    })
                    this.pageHeaderMap()
                    this.pageFooterMap()
                    console.log('this.printList===>', this.printList)
                    this.templateKeyword = res.template_key_word
                    if (res.font_set != undefined && res.font_set) {
                        for (let i in res.font_set) {
                            this.font_set[i] = res.font_set[i];
                            this.handleFontStyle(this.font_set[i].print_type);
                        }
                    }
                    let select5Arr = this.printList.filter(vv => vv.print_type == 5);
                    this.active5List = [];
                    if (select5Arr && select5Arr.length > 0) {
                        select5Arr.forEach((item, index) => {
                            let tmpcol = index / 3;
                            let ii = Math.floor(tmpcol);
                            if (this.active5List[ii] != undefined) {
                                this.active5List[ii].push(item)
                            } else {
                                this.active5List[ii] = [];
                                this.active5List[ii].push(item);
                            }
                        });
                    }
                    console.log(this.font_set)
                })
            },

            reduceItem(key) {
                this.printList.map((v, i) => {
                    if (v.key == key) {
                        this.printList.splice(i, 1)
                        this.activeType = v.print_type
                    }
                });
                
                this.pageHeaderMap()
                this.pageFooterMap()
                
                if (this.activeType == 5) {
                    let select5Arr = this.printList.filter(vv => vv.print_type == 5);
                    this.active5List = [];
                    if (select5Arr && select5Arr.length > 0) {
                        select5Arr.forEach((item, index) => {
                            let tmpcol = index / 3;
                            let ii = Math.floor(tmpcol);
                            if (this.active5List[ii] != undefined) {
                                this.active5List[ii].push(item)
                            } else {
                                this.active5List[ii] = [];
                                this.active5List[ii].push(item);
                            }
                        });
                    }
                }
            },

            customThis(type) {
                this.showModel = true
                this.printType = type
                if (type == 1) {
                    this.modelTitle = '页眉区'
                } else if (type == 2) {
                    this.modelTitle = '表格区'
                } else if (type == 3) {
                    this.modelTitle = '页脚区'
                } else if (type == 4) {
                    this.modelTitle = '表格顶部区'
                } else if (type == 5) {
                    this.modelTitle = '表格底部三列区'
                } else if (type == 6) {
                    this.modelTitle = '表格底部单行区'
                } else if (type == 7) {
                    this.modelTitle = '表格底部四列区'
                }
            },

            confirmModel() {
                let type = this.printType
                if (this.customName == '') {
                    this.$message.warn('请先填写自定义内容')
                } else if (this.customName.length > 8) {
                    this.$message.warn('自定义内容不能超过8个字符')
                } else {
                    if (type == 4) {
                        if (this.printList.filter(v => v.print_type == 4).length >= this.col_num * 1) {
                            this.$message.warn('此项最多只能添加' + this.col_num + '个')
                        } else {
                            this.printList.push({
                                id: 'custom' + (this.printList.length + 1),
                                title: this.customName,
                                print_type: type,
                                key: 'custom' + (this.printList.length + 1)
                            })
                        }
                    } else if (type == 5) {
                        if (this.printList.filter(v => v.print_type == 5).length >= this.col_num * 1) {
                            this.$message.warn('此项最多只能添加' + this.col_num + '个')
                        } else {
                            this.printList.push({
                                id: 'custom' + (this.printList.length + 1),
                                title: this.customName,
                                print_type: type,
                                key: 'custom' + (this.printList.length + 1)
                            })
                        }
                    } else {
                        this.printList.push({
                            id: 'custom' + (this.printList.length + 1),
                            title: this.customName,
                            print_type: type,
                            key: 'custom' + (this.printList.length + 1)
                        })
                    }
                    this.showModel = false
                    this.customName = ''
                }
            },

            cancelModel() {
                this.showModel = false
            },

            saveThis() {
                let that = this
                that.$confirm({
                    title: '警告',
                    content: '确定要保存当前修改吗？',
                    onOk() {
                        that.request(villageApi.addPrintTemplateCustom, {
                            ids: that.printList,
                            template_id: that.tempateId,
                            font_set: that.font_set,
                            blankline:that.blankline
                        }).then(res => {
                            that.$message.success('保存成功！')
                            that.$emit('closeThis')
                        })
                    },
                    onCancel() {},
                });

            },

            jscolspan(arr1, num, arr2) {
                if (arr1 !== undefined) {
                    // 下一条有值 且是换行 则占3格
                    if (arr1.title === '换行') {
                        return this.col_num
                    } else if (arr1.title !== '换行') {
                        return 1
                    }
                } else {
                    return 1
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    /deep/ .ant-descriptions-item-colon::after {
        content: ''
    }

    .print_template {
        width: 100%;
        height: 100vh;
    }

    .plate_tips {
        width: 100%;
        padding: 12px;
        background-color: #e6f7ff;
    }

    .popoverfont {
        font-size: 20px;
    }

    .plate_content {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-top: 10px;

        .left_menu {
            width: 31%;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            background-color: #eeeeee;

            .page_header {
                width: 90%;
                background-color: #ffffff;
                border-radius: 5px;
                padding: 10px 15px;
                margin: 10px 0;

                .header_content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .left_title {}

                    .right_selet {
                        display: flex;

                        .select_list {}

                        .select_confirm {
                            margin-left: 3px;
                        }
                    }
                }

                .line {
                    width: 100%;
                    border: 0;
                    height: 0.5px;
                    background-color: #999999;
                    margin: 10px 0;
                }

                .selected_content {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: flex-start;
                    align-items: flex-start;

                    .select_item {
                        padding: 3px 10px;
                        border: 1px solid #dddddd;
                        border-radius: 3px;
                        margin: 3px;
                        display: flex;
                        align-items: center;
                        justify-content: space-around;

                        .reduce_item {
                            margin-left: 5px;
                            font-size: 15px;
                            color: #dddddd;
                            transform: translateY(-2px);
                            cursor: pointer;
                        }
                    }
                }
            }
        }

        .right_table {
            width: 70%;
            background-color: #eeeeee;
            justify-content: center;
            flex-direction: column;

            .table_content {
                width: 98%;
                padding: 10px 20px;
                background-color: #ffffff;
                border-radius: 5px;
                margin: 10px 0;
                display: flex;
                flex-direction: column;
                align-items: center;

                .table_header {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .line {
                    width: 100%;
                    border: 0;
                    height: 0.5px;
                    background-color: #999999;
                    margin: 10px 0;
                }

                .main_content {
                    display: flex;
                    flex-direction: column;
                    width: 100%;

                    .print_table_title {
                        width: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        height: 30px;
                        font-size: 19px;
                    }

                    .module_one {
                        display: flex;
                        flex-wrap: wrap;
                        width: 100%;
                    }

                    .module_two {
                        display: flex;
                        flex-direction: column;

                        .table_top {
                            border: 0.5px solid #999999;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            width: 100%;
                            height: 27px;

                            .header_item {
                                display: flex;
                                align-items: center;
                                justify-content: space-between;

                                &:nth-child(1) {
                                    margin-left: 10px;
                                }

                                &:nth-last-child(1) {
                                    margin-right: 20px;
                                }
                            }
                        }

                        .table_container {
                            display: flex;
                            align-items: center;
                            width: 100%;
                            border-left: 0.5px solid #999999;

                            .table_item {
                                border: 0.5px solid #999999;
                                border-left: 0;
                                height: 27px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-weight: bold;

                                &:nth-child(1) {
                                    // border-left: 0.5px solid #999999;
                                }
                            }
                        }

                        .table_footer_one {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 100%;

                            // transform: translateY(-1px);
                            .table_item {
                                border: 0.5px solid #999999;
                                border-left: 0;
                                height: 27px;
                                display: flex;
                                align-items: center;
                                // justify-content: center;
                                padding-left: 10px;

                                &:nth-child(1) {
                                    border-left: 0.5px solid #999999;
                                }
                            }

                            .table_item_5 {
                                .div51 {
                                    width: 100%;
                                    height: 100%;
                                }

                                .span51 {
                                    border-right: 0.5px solid #999999;
                                    height: 27px;
                                    display: flex;
                                    width: 50%;
                                }

                                .span52 {
                                    height: 27px;
                                    display: flex;
                                    width: 50%;
                                }

                            }
                        }

                        .table_footer_7 {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 100%;

                            // transform: translateY(-1.5px);
                            .left_title {
                                height: 27px;
                                width: 25.1%;
                                border: 0.5px solid #999999;
                                display: flex;
                                align-items: center;
                                // justify-content: center;
                                padding-left: 10px;
                            }

                            .right_71 {
                                height: 27px;
                                width: 12.5%;
                                border: 0.5px solid #999999;
                                border-left: 0;
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                            }

                            .right_72 {
                                height: 27px;
                                width: 40.4%;
                                border: 0.5px solid #999999;
                                border-left: 0;
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                            }

                            .right_73 {
                                height: 27px;
                                width: 22%;
                                border: 0.5px solid #999999;
                                border-left: 0;
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                            }
                        }

                        .table_footer_two {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            width: 100%;

                            // transform: translateY(-1.5px);
                            .left_title {
                                height: 27px;
                                width: 25%;
                                border: 0.5px solid #999999;
                                display: flex;
                                align-items: center;
                                // justify-content: center;
                                padding-left: 10px;
                            }

                            .right_content {
                                height: 27px;
                                width: 75%;
                                border: 0.5px solid #999999;
                                border-left: 0;
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                            }
                        }
                    }

                    .module_six {
                        display: flex;
                        flex-wrap: wrap;
                        width: 100%;
                    }

                    .template3type {
                        text-align: center;
                        /deep/.ant-descriptions-item{
                            &:nth-last-child(1) {
                                text-align: right;
                            }
                            
                            &:nth-child(1) {
                                text-align: left;
                            }
                        }
                        
                        .page_header_item{
                            &:nth-last-child(1) {
                                float: right;
                            }
                            
                            &:nth-child(1) {
                                float: left;
                            }
                        }
                    }
                }
            }
        }
    }
</style>

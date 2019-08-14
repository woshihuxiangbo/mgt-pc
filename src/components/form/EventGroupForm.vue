<template>
    <div>
        <div class="md-tip">
            <p>拼团活动商家提示：</p>
            <p>1、活动开始后就不支持任何修改。请预先规划好拼团活动。</p>
            <p>2、商品售完或者商家手动结束活动，活动即结束。</p>
            <p>3、同一活动时间内，商家设置限制购买数量，用户在该活动期间只能购买限定数量，若开启重复拼团，所有拼团总购买数量不超过限制数量。</p>
        </div>
        <el-form ref="form" :model="form" @submit.native.prevent="onSubmit" :rules="rules" label-width="120px">
            <el-form-item label="活动商品" prop="skuId">
                <goods-item-card :item="item" show-sku-name/>
                <div></div>
                <el-button @click="dialog = true">选择商品</el-button>
            </el-form-item>
            <el-form-item label="爆款推荐" prop="hotSale">
                <el-radio v-model="form.hotSale" :label="1">是</el-radio>
                <el-radio v-model="form.hotSale" :label="0">否</el-radio>
                <span class="md-muted">（选择是则在爆款推荐中显示）</span>
            </el-form-item>
            <el-form-item label="活动名称" prop="groupName">
                <el-input v-model="form.groupName" placeholder="请输入活动名称，最多50个字"/>
            </el-form-item>
            <el-form-item label="活动库存" prop="groupStock">
                <el-input-number v-model="form.groupStock" :min="0" :max="999999999"/>
                件
                <span class="md-muted">（通过拼团活动销量达到此值则活动结束）</span>
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
                <el-date-picker
                        v-model="form.startTime"
                        type="datetime"
                        :picker-options="options"
                        value-format="timestamp"
                        placeholder="选择日期时间">
                </el-date-picker>
                <span class="md-muted">（活动开始时间前为预热时间，用户可以在活动开始前看到活动价格）</span>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
                <el-date-picker
                        v-model="form.endTime"
                        type="datetime"
                        :picker-options="options"
                        value-format="timestamp"
                        placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="限制购买" prop="buyLimit">
                <el-input-number v-model="form.buyLimit" :min="0" :max="9999999999"/>
                件
                <span class="md-muted">（活动期间每人最多可购买的产品数量，默认值为0，代表不限制购买数量）</span>
            </el-form-item>
            <el-form-item label="拼团时限" prop="timeLimit">
                <el-select v-model="form.timeLimit" :value="form.timeLimit">
                    <el-option :value="12" label="12"/>
                    <el-option :value="24" label="24"/>
                    <el-option :value="48" label="48"/>
                    <el-option :value="72" label="72"/>
                    <el-option :value="96" label="96"/>
                </el-select>
                <span class="md-muted">（团长开团后，有多少小时可以召集团员参团购买）</span>
            </el-form-item>
            <el-form-item class="table-form">
                <span slot="label"><span class="md-red">*</span> 拼团价格</span>
                <el-button type="text" @click="addConfig" :disabled="form.list.length >= 5">增加行</el-button>
                <el-table :data="form.list" border size="mini" style="margin-top: 0">
                    <el-table-column label="层级" align="center">
                        <template slot-scope="scope">
                            {{scope.$index + 1}}
                        </template>
                    </el-table-column>
                    <el-table-column label="拼团人数（人）" align="center">
                        <template slot-scope="scope">
                            <el-form-item :rules="rules.personNumber"
                                          :prop="'list.' + scope.$index +'.personNumber'">
                                <el-input v-model="form.list[scope.$index].personNumber" size="small"/>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="拼团价格（元）" align="center">
                        <template slot-scope="scope">
                            <el-form-item :rules="rules.price" :prop="'list.' + scope.$index +'.price'">
                                <el-input v-model="form.list[scope.$index].price" size="small"/>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="团长返佣比例（%）" align="center">
                        <template slot-scope="scope">
                            <el-form-item :rules="rules.commission"
                                          :prop="'list.' + scope.$index +'.commission'">
                                <el-input v-model="form.list[scope.$index].commission" size="small"/>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" @click="deleteConfig(scope.$index)" size="mini">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label="活动说明">
                <editor v-model="form.remark"/>
            </el-form-item>
            <el-form-item>
                <slot/>
            </el-form-item>
        </el-form>
        <goods-dialog :md-active.sync="dialog" @onSelectSku="onSelectSku"/>
    </div>
</template>

<script>
    import vModelMixins from "@/components/mixins/vModelMixins";
    import GoodsDialog from "@/components/widget/GoodsDialog";
    import GoodsItemCard from "@/components/widget/GoodsItemCard";
    import Editor from "@/components/widget/Editor";

    export default {
        name: "EventGroupForm",
        components: {Editor, GoodsItemCard, GoodsDialog},
        mixins: [vModelMixins],
        props: {
            setItem: {
                type: Object, default: () => {
                    return {}
                }
            }
        },
        watch: {
            setItem (n) {
                this.item = n;
            }
        },
        data() {
            return {
                dialog: false,
                item: this.setItem,
                rules: {
                    skuId: this.$util.generateFormRule('请选择商品', 'required'),
                    hotSale: this.$util.generateFormRule('请选择', 'required'),
                    groupName: this.$util.generateFormRule('请输入活动名称', 'required|string|max:50'),
                    groupStock: this.$util.generateFormRule('请填写活动库存', 'required|integer|min:0|max:9999999999'),
                    startTime: this.$util.generateFormRule('请选择开始时间', 'required'),
                    endTime: this.$util.generateFormRule('请选择结束时间', 'required'),
                    buyLimit: this.$util.generateFormRule('请填写活动库存', 'required|integer|min:0|max:9999999999', false),
                    timeLimit: this.$util.generateFormRule('请选择拼团时限', 'required'),
                    personNumber: this.$util.generateFormRule('请输入拼团人数', 'required|integer|min:2|max:9999999999'),
                    commission: this.$util.generateFormRule('请输入团长返佣比例', 'required|integer|min:0|max:100'),
                    price: this.$util.generateFormRule('请输入拼团价格', 'required|numeric|min:0|max:9999999999'),
                },
                options: {
                    disabledDate(date) {
                        let newNow = new Date().getTime();
                        return date.getTime() < (newNow - 86400000);
                    }
                }
            }
        },
        methods: {
            onSelectSku(item) {
                console.info(item);
                this.form.skuId = item.skuId;
                this.form.itemId = item.id;
                this.form.spuId = item.spuId;
                this.item = item;
            },
            addConfig() {
                this.form.list.push({
                    personNumber: undefined,
                    price: undefined,
                    commission: 0
                });
            },
            deleteConfig(index) {
                this.form.list.splice(index, 1)
            }
        }
    }
</script>

<style scoped lang="scss">
    .md-tip {
        font-size: 13px;
        padding: 15px;

        > p {
            background: #F6F8F9;
            padding: 5px;
        }
    }

    .md-group-add {
        background: white;
    }
</style>
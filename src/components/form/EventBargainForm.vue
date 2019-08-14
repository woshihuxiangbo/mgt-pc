<template>
    <el-form @submit.native.prevent="onSubmit" label-width="80px" :rules="rules" :model="form" ref="form">
        <ul class="md-helper">
            砍价活动商家提示：
            <li>1、活动开始后就不支持任何修改。请预先规划好砍价活动。</li>
            <li>2、商品售完或者商家手动禁用某商品活动，活动即结束。</li>
            <li>3、同一活动时间内，商家设置限制购买数量，用户在该活动期间只能购买限定数量。</li>
            <li>4、爆款推荐：勾选后进入到爆款商品中显示。</li>
            <li>5、商品原价：商品活动前的零售价格。</li>
            <li>6、活动底价：砍价后最低价。</li>
            <li>7、最多砍价次数：每个人发送出去的商品达到砍价次数则不能再砍</li>
            <li>8、活动库存：参加砍价活动的数量，卖完后活动即结束</li>
            <li>9、每人限制购买数量：每人能在砍价活动期间购买该商品的数量，0代表无限制。</li>
            <li>10、砍价时限：用户发起砍价后，如果砍价时限在活动结束时间前则根据该砍价时限倒计时，如果大于活动结束时间则根据结束时间和当前时间计算倒计时时间。</li>
        </ul>
        <el-form-item label="活动名称" prop="eventName">
            <el-input v-model="form.eventName" placeholder="20个字符以内"/>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
            <el-date-picker type="datetime" v-model="form.startTime" placeholder="2019-07-02 12:12:23"
                            value-format="timestamp"/>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
            <el-date-picker type="datetime" v-model="form.endTime" placeholder="2019-07-04 12:22:23"
                            value-format="timestamp"/>
        </el-form-item>
        <el-form-item label="砍价时限" prop="timeLimit">
            <el-input-number v-model="form.timeLimit" :min="1" :max="124000" placeholder="大于0的整数"/>
            小时
        </el-form-item>
        <el-form-item label-width="0px" class="table-form">
            <el-button type="text" :disabled="form.items.length >= 20" @click="add">增加行</el-button>
            <el-table :data="form.items">
                <el-table-column label="选择商品" align="center" width="100px">
                    <template slot-scope="scope">
                        <el-button type="text" @click="selectItem(scope.$index)">选择商品</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="商品名称" align="center">
                    <template slot-scope="scope">
                        <el-form-item :rules="itemRules.itemId" :prop="'items.' + scope.$index +'.itemId'">
                            <el-input v-model="form.items[scope.$index].itemName" readonly/>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="商品规格" align="center" prop="skuName">
                    <template slot-scope="scope">
                        <el-input v-model="form.items[scope.$index].skuName" readonly/>
                    </template>
                </el-table-column>
                <el-table-column label="爆款推荐" align="center" width="80px">
                    <template slot-scope="scope">
                        <el-checkbox v-model="form.items[scope.$index].hotSale" :true-label="1" :false-label="0"/>
                    </template>
                </el-table-column>
                <el-table-column label="商品原价/元" align="center">
                    <template slot-scope="scope">
                        <el-form-item :rules="itemRules.price" :prop="'items.' + scope.$index +'.price'">
                            <el-input v-model="form.items[scope.$index].price" placeholder="正数"/>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="活动底价/元" align="center">
                    <template slot-scope="scope">
                        <el-form-item :rules="itemRules.minPrice" :prop="'items.' + scope.$index +'.minPrice'">
                            <el-input v-model="form.items[scope.$index].minPrice" placeholder="正数"/>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="最多砍价次数" align="center">
                    <template slot-scope="scope">
                        <el-form-item :rules="itemRules.maxHaggleTimes" :prop="'items.' + scope.$index +'.maxHaggleTimes'">
                            <el-input v-model.number="form.items[scope.$index].maxHaggleTimes" placeholder="大于0整数"/>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="活动库存/件" align="center">
                    <template slot-scope="scope">
                        <el-form-item :rules="itemRules.eventStock" :prop="'items.' + scope.$index +'.eventStock'">
                            <el-input v-model.number="form.items[scope.$index].eventStock" placeholder="正整数，不高于总库存"/>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column align="center" width="180px">
                    <template slot="header">
                        每人限制购买数量/件
                        <p class="md-muted">（0代表无限制）</p>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item :rules="itemRules.buyLimit" :prop="'items.' + scope.$index +'.buyLimit'">
                            <el-input v-model.number="form.items[scope.$index].buyLimit" placeholder="0"/>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column align="center" width="50px">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="scope.$index >= 1" @click="del(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item label-width="0px">
            <slot>
                <el-button type="primary" native-type="submit">保存</el-button>
            </slot>
        </el-form-item>
        <goods-dialog :md-active.sync="dialog" @onSelectSku="onSelectSku"/>
    </el-form>
</template>

<script>
    import vModelMixins from "@/components/mixins/vModelMixins";
    import GoodsDialog from "@/components/widget/GoodsDialog";

    export default {
        name: "EventBargainForm",
        components: {GoodsDialog},
        mixins: [vModelMixins],
        data() {
            return {
                rules: {
                    eventName: this.$util.generateFormRule("请输入活动名称", 'required|string|max:20', true),
                    startTime: this.$util.generateFormRule("请输入开始时间", 'required', true),
                    endTime: this.$util.generateFormRule("请输入结束时间", 'required', true),
                    timeLimit: this.$util.generateFormRule("请输入砍价时限", 'required|integer|min:1|max:124000', true),
                },
                itemRules: {
                    itemId: this.$util.generateFormRule("请选择商品", 'required', true),
                    price: this.$util.generateFormRule("请输入商品价格", 'required|numeric|min:0|max:9999999999', true),
                    minPrice: this.$util.generateFormRule("请输入活动底价", 'required|numeric|min:0|max:9999999999', true),
                    maxHaggleTimes: this.$util.generateFormRule("请输入最多砍价次数", 'required|integer|min:0|max:9999999999', true),
                    eventStock: this.$util.generateFormRule("请输入活动库存", 'required|integer|min:0|max:9999999999', true),
                    buyLimit: this.$util.generateFormRule("限制购买数量", 'required|integer|min:0|max:9999999999', true)
                },
                current: 0,
                dialog: false
            }
        },
        methods: {
            add() {
                this.form.items.push({
                    eventStock: undefined,
                    price: undefined,
                    minPrice: undefined,
                    maxHaggleTimes: undefined,
                    buyLimit: undefined,
                    itemId: undefined,
                    spuId: undefined,
                    skuId: undefined,
                    hotSale: false
                })
            },
            del(index) {
                this.form.items.splice(index, 1)
            },
            selectItem(index) {
                this.current = index;
                this.dialog = true;
            },
            onSelectSku(item) {
                let data = this.form.items[this.current];
                data.itemId = item.id;
                data.spuId = item.spuId;
                data.skuId = item.skuId;
                data.itemName = item.name;
                data.skuName = item.skuName;
                data.price = this.$util.integerToPrice(item.price);
                this.$set(this.form.items, this.current, data);
            }
        }
    }
</script>

<style scoped>
    .md-muted {
        color: #b1b1b1;
    }
</style>
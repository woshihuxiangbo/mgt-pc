<template>
    <el-form :model="form" @submit.native.prevent="onSubmit" ref="form">
        <el-form-item label="团购名称" prop="title">
            <el-input v-model="form.title"/>
        </el-form-item>
        <el-form-item label="活动时间">
            <div>
                <el-col :span="8">
                    <el-date-picker type="datetime" v-model="form.startTime"
                                    style="width: 100%;" value-format="timestamp"/>
                </el-col>
                <el-col :span="2" style="text-align: center">-</el-col>
                <el-col :span="8">
                    <el-date-picker type="datetime" v-model="form.endTime"
                                    style="width: 100%;" value-format="timestamp"/>
                </el-col>
            </div>
        </el-form-item>
        <el-form-item label="状态" prop="disabled">
            <el-select v-model="form.disabled" :value="form.disabled">
                <el-option label="启用" :value="false"/>
                <el-option label="禁用" :value="true"/>
            </el-select>
        </el-form-item>
        <el-form-item label="商品">
            <!--            <goods-selector @select="onSelectItem" is-group-store-item/>-->
            <el-select v-model="form.items" multiple :value="form.items" style="width: 100%" v-loading="loading">
                <el-option v-for="(item, i) in items" :key="i" :label="item.name" :value="item.id" class="md-ff-option">
                    <div class="md-item-data">
                        <img :src="item.thumbnail | imgSrc" alt=""/>
                        <span>{{item.name}}</span>
                    </div>
                </el-option>
            </el-select>
        </el-form-item>

        <!--        <div class="md-goods-content">-->
        <!--            <div class="goods-list" v-for="(item, i) in selectItems" :key="i">-->
        <!--                <img :src="item.thumbnail | imgSrc" alt="">-->
        <!--                <p>{{item.name}}</p>-->
        <!--                <el-button type="danger" icon="el-icon-delete" circle class="md-action" @click=""></el-button>-->
        <!--            </div>-->
        <!--        </div>-->
        <el-form-item>
            <slot/>
        </el-form-item>
    </el-form>
</template>

<script>
    import vModelMixins from '@/components/mixins/vModelMixins';
    import GoodsSelector from "@/components/selector/GoodsSelector";
    import api from '@/common/apis/goods';
    import {mapGetters} from 'vuex'

    export default {
        name: "GroupEventForm",
        components: {GoodsSelector},
        mixins: [vModelMixins],
        props: {
            defaultDateTime: {
                type: Array, default: () => {
                    return [];
                }
            }
        },
        data() {
            return {
                loading: false,
                date: this.defaultDateTime,
                items: {},
                query: {
                    itemName: undefined,
                    categoryId: undefined,
                    brandId: undefined,
                    page: 1,
                    pageSize: 100,
                    isGroupStoreItem: true,
                    column: 'id,name,thumbnail'
                }
            }
        },
        methods: {
            getData() {
                this.loading = true;
                this.query.storeId = this.shop.id;
                api.list(this.query).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.items = data.rows;
                    });
                }).finally(() => this.loading = false);
            },
            onSubmit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        this.form.storeId = this.shop.id;
                        this.$emit('submit', this.form);
                    } else {
                        this.$message.error('表单数据不完整');
                    }
                });
            }
        },
        created() {
            this.getData();
        },
        computed: {
            ...mapGetters(['shop'])
        },
        watch: {
            defaultDateTime(n) {
                this.date = n;
            }
        }
    }
</script>

<style scoped lang="scss">
    .md-goods-content {
        display: flex;
        flex-wrap: wrap;
        min-height: 300px;
        overflow: auto;

        .goods-list {
            flex: 0 0 120px;
            padding: 5px;
            position: relative;

            img {
                width: 110px;
                height: 110px;
            }

            p {
                width: 100%;
                height: 30px;
                overflow: hidden;
                text-overflow: ellipsis;
                text-wrap: normal;
                text-align: center;
                line-height: 30px;
            }

            .md-action {
                position: absolute;
                right: 15px;
                top: 15px;
            }
        }
    }
    .md-ff-option {
        height: 50px;
        line-height: 50px;
        &.selected,
        &.selected.hover,
        &.hover {
            /*background: #1d88e5 !important;*/
            /*color: #fff !important;*/
        }
    }
    .md-item-data {
        height: 45px;
        display: flex;
        > img {
            margin-top: 2px;
            width: 45px;
            height: 45px;
            display: block;
            margin-right: 10px;
            border-radius: 50%;
            overflow: hidden;
        }
    }
</style>

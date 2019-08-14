<template>
    <div class="store-selector">

        <!-- <el-select placeholder="选择上级管理员" v-model="masterRole" :value="masterRole" @change="onMasterRoleChange">
            <el-option value="q" label="q"></el-option>
        </el-select> -->

        <el-select v-model="form" :value="form" @change="formChange">
            <el-option label="无" value="0"></el-option>
            <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id"
                       v-if="role.roleID !== item.id"/>
        </el-select>

    </div>
</template>

<script>
    import vModelMixins from '@/components/mixins/vModelMixins';
    import api from '@/common/apis/role';
    import {mapGetters} from 'vuex';

    export default {
        name: 'RoleSelector',
        mixins: [vModelMixins],
        props: {
            value: {},
            needFilter: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                masterRole: undefined,
                list: [],
                adminList: undefined
            };
        },
        computed: {
            ...mapGetters(['role'])
        },
        // watch:{
        //     disabled(){
        //         this.getData();
        //     }
        // },
        methods: {
            _filterList(list) {
                return list.filter(item => {
                    // 记录集.level < 当前管理员的.level && (记录集.roleId=="0" || 记录集.parentRoleId = 当前管理员的.roleId)
                    if (item.level < this.role.roleLevel && (item.parentRoleId === '0' || item.parentRoleId === this.role.roleID)) {
                        return item;
                    }
                });
            },
            getData() {
                api.list({}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        let obj = [];
                        if (this.needFilter) {
                            obj = this._filterList(data);
                        } else {
                            obj = data;
                        }
                        this.list = [...obj];
                    });
                });
            },
            formChange(id) {
                this.form = id;
                switch (id) {
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    case 4:
                        break;
                    case 5:
                        break;
                    case 6:
                        break;
                    case 7:
                        break;
                    case 8:
                        break;
                    case 9:
                        break;
                }
            },
            onMasterRoleChange(userId) {
                this.$emit('changeMasterUser', userId);
            }
        },
        mounted() {
            if (!this.disabled) {
                this.getData();
            }
        }

    };
</script>

<style>
    .store-selector .el-input.is-disabled .el-input__inner {
        background-color: #fff !important;
        color: #606266 !important;
    }
</style>

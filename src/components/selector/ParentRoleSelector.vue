<template>
    <div class="store-selector">

        <!-- <el-select placeholder="选择上级管理员" v-model="masterRole" :value="masterRole" @change="onMasterRoleChange">
            <el-option value="q" label="q"></el-option>
        </el-select> -->

        <el-select class="select" v-model="form" :value="form" @change="formChange" style="width: 100%">
            <el-option label="无" value="0"></el-option>
            <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
    </div>
</template>

<script>
    import vModelMixins from '@/components/mixins/vModelMixins';
    import api from '@/common/apis/role';
    import adminApi from '@/common/apis/administrator';
    import {mapGetters} from "vuex";

    export default {
        name: "RoleSelector",
        mixins: [vModelMixins],
        props: {
            value: {},
            needFilter: {
                type: Boolean,
                default: true
            },
            adminId: {
                type: String | Number,
                require: true
            },
            isRole: { //true 上级管理员||false上级管理员
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                masterRole: undefined,
                list: [],
                adminList: undefined,
            }
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

            getData() {
                if (this.isRole) {
                    api.getParentRoles({
                        id: this.adminId
                    }).then(res => {
                        this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                            this.list = [...data];
                        })
                    })
                } else {
                    api.getParentManagers({
                        id: this.adminId
                    }).then(res => {
                        this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                            if (!data) return;
                            let obj = data.map(item => {
                                item.name = item.name + '(' + item.roleName + ')';
                                return item
                            });
                            this.list = [...obj];
                        })
                    })
                }
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
            // if(!this.disabled){
            this.getData();
            // }
        },

    }
</script>
<style lang="scss" scoped>
    .select {
        width: 300px;
    }
</style>

<template>
    <el-select v-model="form" :value="form" filterable v-loading="loading" remote reserve-keyword  :remote-method="getData">
        <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.nickname"
            :value="item.userId">
            <span style="float: left">{{ item.nickname }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.userId }}</span>
        </el-option>
    </el-select>
</template>

<script>
    import userApi from '@/common/apis/user'
    import vModelMixins from "@/components/mixins/vModelMixins";
    import {mapGetters} from 'vuex'

    export default {
        name: "UserSelector",
        mixins: [vModelMixins],
        props: {
            value: {}
        },
        data() {
            return {
                loading: false,
                userList: []
            }
        },
        methods: {
            getData(search) {
                userApi.userBackUserList(this.shop.id, {nickname: search, pageSize: 30}).then(res => {
                    this.$util.handelHttpResponseResult(res, false).then(({data}) => {
                        this.userList = data.list;
                    })
                })
            }
        },
        mounted() {
            this.getData();
        },
        computed: {
            ...mapGetters(['shop'])
        }
    }
</script>

<style scoped>

</style>

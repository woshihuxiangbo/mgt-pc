<template>
    <div>
        <breadcrumb :options="['活动管理', '创建代金券']"/>
        <div class="main-container">
            <coupon-form v-model="form">
                <el-button type="primary">保存</el-button>
            </coupon-form>
        </div>
    </div>
</template>

<script>
    import Breadcrumb from "../../../components/widget/breadcrumb";
    import CouponForm from "../../../components/form/CouponForm";
    export default {
        components: {CouponForm, Breadcrumb},
        data () {
            return {
                form: {}
            }
        }
    }
</script>

<style scoped>

</style>
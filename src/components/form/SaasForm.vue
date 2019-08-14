<template>
  <el-form 
    ref="form"
    :model="form"
    :rules="rules"
    label-width="120px"
    class="form"
    @submit.native.prevent="onSubmit"
    >
    <el-form-item label="序号">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="订单编号">
      <el-input v-model="form.total"></el-input>
    </el-form-item>
    <el-form-item label="付款方式">
      <el-select v-model="form.status" placeholder="请选择">
        <el-option label="xxxx" value="0"></el-option>
        <el-option label="库存不足" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="用户">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="金额">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="状态">
      <el-select v-model="form.status" placeholder="请选择">
        <el-option label="xxxx" value="0"></el-option>
        <el-option label="库存不足" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="充值时间">
      <el-date-picker v-model="form.time" type="date" placeholder="选择日期"></el-date-picker>
    </el-form-item>
    <el-form-item>
      <slot/>
    </el-form-item>
  </el-form>
</template>

<script>
import vModelMixins from '../mixins/vModelMixins';
// import UploadAvatar from '../widget/UploadAvatar';

export default {
    name: 'SaasForm',
    // components: {UploadAvatar},
    mixins: [vModelMixins],
    data() {
      return {
        rules: {
          
        }
      };
    },
    methods: {
      onSubmit(e) {
        e.preventDefault();
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$emit('submit', e);
          }
        });
      }
    }
};
</script>
<style lang="scss" scoped>

</style>
<template>
  <el-form :model="form" ref="form" @submit.native.prevent="onSubmit" :rules="rules">
    <el-form-item label="头图" prop='headPic'>
      <upload-avatar v-model="form.headPic" />
    </el-form-item>
    <el-form-item label="头图内文字" prop='headTitle'>
      <el-input v-model="form.headTitle" placeholder="请输入头图文字"/>
    </el-form-item>
    <el-form-item label="团购大标题" prop='mainTitle'>
      <el-input v-model="form.mainTitle" placeholder="请输入收益大标题"/>
    </el-form-item>
    <el-form-item label="团购问题列表">
      <el-button type="primary" @click="tuanAdd(1,'question')"  round>添加问题</el-button>
      <div class="tuan_content" v-for="(item1,index1) in form.mainContent" v-bind:key="item1.key">
        <el-button type="danger" @click="tuanDel(1,index1,'question')">删除问题</el-button>
        <el-input placeholder="请输入小标题" v-model="item1.title" class="inp_small"/>
        <div class="item">
          <div class="add_answer">
            <el-button type="primary" @click="tuanAdd(index1,'answer')" round>添加答案</el-button>
          </div>

          <el-input
            placeholder="请输入答案"
            v-model="item2.text"
            v-for="(item2,index2) in item1.content"
            v-bind:key="item2.key"
          >
            <el-button slot="append" icon="el-icon-delete" @click="tuanDel(index1,index2,'answer')"></el-button>
          </el-input>
        </div>
      </div>
    </el-form-item>
    <el-form-item>
      <slot/>
    </el-form-item>
  </el-form>
</template>

<script>
import vModelMixins from '../mixins/vModelMixins';
import UploadAvatar from '@/components/widget/UploadAvatar';
export default {
    name: 'tuanForm',
    components: {UploadAvatar},
    mixins: [vModelMixins],
    data() {
        return {
            labelPosition: 'top',
            rules:{
               headPic:{
                   required: true,
                   message: '请添加头部图片'
               },
               headTitle:{
                   required: true,
                   message: '请添加头部图片文字'
               },
               mainTitle:{
                   required: true,
                   message: '请添加收益大标题'
               },
            }
        };
    },
    methods: {
        tuanAdd(index,flag) {
            // console.log(index, flag);
            if (flag == 'question') {
                console.log('添加问题')
                this.$emit('tuanAddQuestion');
            } else if (flag == 'answer') {
                console.log('添加答案')
                this.$emit('tuanAddAnswer',{
                    mainContentIndex:index
                });
            }
        },
        tuanDel(index1,index2,flag){
            // console.log(index1,index2,flag)
            this.$emit('tuanDelAnswer',{
                    index1:index1,
                    index2:index2,
                    flag:flag,
                });
        },
        onSubmit(e) {
            e.preventDefault();
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.$emit('submit', e);
                }else{
                    this.$message.warning('数据请填完整');
                }
            });
        }
    }
};
</script>
<style scoped>
.tuan_content {
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    margin: 20px 0;
    padding: 20px;
    overflow: hidden;
}
.inp_small{
    margin-top: 10px;
}
.add_answer {
    float: right;
    margin: 10px;

}
</style>

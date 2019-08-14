<template class="rights">
  <el-form
    :model="form"
    :label-position="labelPosition"
    ref="form"
    @submit.native.prevent="onSubmit"
    :rules="rules"
  >
    <el-form-item label="头图" prop="headPic">
      <upload-avatar v-model="form.headPic"/>
    </el-form-item>
    <el-form-item label="头图内文字" prop="headTitle">
      <el-input v-model="form.headTitle" placeholder="请输入头图文字"/>
    </el-form-item>
    <el-form-item label="收益大标题" prop="mainTitle">
      <el-input v-model="form.mainTitle" placeholder="请输入收益大标题"/>
    </el-form-item>
    <el-form-item label="收益讲解">
      <!-- 主要内容数组-->
      <el-card>
        <div slot="header">
          <span>收益讲解列表</span>

          <el-button style="float: right;margin-right:20px;" type="success" @click="addEarnings" round>添加收益讲解</el-button>
        </div>

        <el-card v-for="(item1,index1) in form.mainContent" v-bind:key="item1.key">
          <div slot="header">
            <el-input v-model="item1.title" placeholder="请输入收益讲解标题" style="width:300px;"/>
            <el-button
              style="float: right;"
              type="danger"
              @click="delEarnings(index1)"
              round
            >删除此项main</el-button>
            <el-button-group style="float: right;margin-right:20px;">
              <el-button type="primary" @click="addMainWord(index1)" round>添加收益项</el-button>
              <el-button type="primary" @click="addStar(index1,'mainStar')" round>添加星星项</el-button>
            </el-button-group>
          </div>
          <!-- 主要文字数组 -->
          <div v-for="(item2,index2) in item1.content" v-bind:key="item2.key">
            <div>
              <el-input v-model="item2.text" v-if="!item2.isStar" placeholder="请输入收益讲解">
                <el-button slot="append" icon="el-icon-delete" @click="deleteMainWord(index1,index2)"></el-button>
              </el-input>
              <el-input v-model="item2.text" v-if="item2.isStar" placeholder="请输入星星内容">
                <el-button slot="append" icon="el-icon-star-on" @click="deleteMainWord(index1,index2)"></el-button>
              </el-input>
            </div>
          </div>

        </el-card>
      </el-card>
    </el-form-item>
    <!-- 8大权益标题 -->
    <el-form-item label="八大权益标题" prop="subTitle">
      <el-input v-model="form.subTitle" placeholder="请输入八大权益标题"/>
    </el-form-item>
    <!-- 权益列表  8大权益start -->
    <el-form-item label="权益列表">
      <el-card>
        <div slot="header">
          <span>权益列表讲解</span>
          <el-button @click="addRightsItem" style="float: right;margin-right:20px;" type="success" round>添加权益项</el-button>
        </div>
        <el-card v-for="(item1,index1) in form.subContent" v-bind:key="item1.key">
          <div slot="header">
            <el-input v-model="item1.title" style="width:300px;" placeholder="请输入权益单项标题"/>
            <el-button
              style="float: right;"
              type="danger"
              @click="delsubContentItem(index1)"
              round
            >删除此项sub</el-button>

            <el-button-group style="float: right;margin-right:20px;" >
              <el-button type="primary" @click="addSubWord(index1)" round>添加当前权益</el-button>
              <el-button type="primary" @click="addStar(index1,'subStar')" round>添加星星项</el-button>
            </el-button-group>
          </div>
          <el-row :gutter="20">
            <el-col :span="6">
              <upload-avatar v-model="item1.icon"/>
            </el-col>
            <el-col :span="18">
               <div v-for="(item2,index2) in item1.content" v-bind:key="item2.key">
                    <el-input v-model="item2.text" v-if="!item2.isStar" placeholder="请输入权益内容">
                        <el-button slot="append" icon="el-icon-delete" @click="deleteSubWord(index1,index2)"></el-button>
                    </el-input>
                    <el-input v-model="item2.text" v-if="item2.isStar" placeholder="请输入星星内容">
                        <el-button slot="append" icon="el-icon-star-on" @click="deleteSubWord(index1,index2)"></el-button>
                    </el-input>
               </div>


            </el-col>
          </el-row>
        </el-card>
      </el-card>
    </el-form-item>
    <!-- 权益列表  8大权益 end-->
    <el-form-item label="页面底部标题" prop="footerTitle">
      <el-input placeholder="请输入底部标题" v-model="form.footerTitle"/>
    </el-form-item>
    <el-form-item label="页面底部文字" prop="footerContent">
      <el-input placeholder="请输入底部文字" v-model="form.footerContent"/>
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
    name: 'rightsForm',
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
               subTitle:{
                   required: true,
                   message: '请添加权益大标题'
               },
               footerTitle:{
                   required: true,
                   message: '请添加底部标题'
               },
               footerContent:{
                   required: true,
                   message: '请添加底部文字'
               }
            }
        };
    },
    methods: {
        deleteMainWord(index1, index2) {
            this.$emit('childDeleteMainWord', {
                mainContentIndex: index1,
                contentIndex: index2
            });
        },
        deleteSubWord(index1, index2) {
            this.$emit('childDeleteSubWord', {
                subContentIndex: index1,
                contentIndex: index2
            });
        },
        addMainWord(index1) {
            console.log('添加收益文字');
            this.$emit('childAddMainWord', {
                mainContentIndex: index1
            });
        },
        addSubWord(index1) {
            console.log('添加权益文字');
            this.$emit('childAddSubWord', {
                subContentIndex: index1
            });
        },
        // 添加收益讲解大块()
        addEarnings() {
            console.log('添加mian大项');
            this.$emit('childAddMainBig');
        },
        // 添加权益项
        addRightsItem() {
            console.log('添加权益项');
            this.$emit('childAddRightItem');
        },
        // 删除  收益讲解大块()
        delsubContentItem(index1) {
            console.log('删除sub大块');
            this.$emit('childDelsubBig', {subIndex: index1});
        },
        // 删除  sub讲解大块()
        delEarnings(index1) {
            console.log('删除main大块');
            this.$emit('childDelRightBig', {mainIndex: index1});
        },
        // 添加星星项
        addStar(index,flag) {
            // console.log(flag);
            this.$emit('childAddStar', {index:index,starFlag: flag});
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

</style>

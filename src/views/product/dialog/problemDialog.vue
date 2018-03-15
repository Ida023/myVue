<template>
<div>
  <el-row >
    <el-tooltip content="添加问题"  effect="dark" placement="bottom" class="quesright"  v-if="inputDisabled==false" >
      <i  class="iconfontyyy" @click="addproblem();" content="Bottom center">&#xe623;</i>
    </el-tooltip>
    <el-col v-for="(item,index) in problemparentForm" :key="item.issueId" >
      <el-form :label-width="financeFormLabelWidth" >
        <el-form-item label="问题" >
          <el-col :span="22">
            <span v-if="inputDisabled==true">{{item.askTitle}}</span>
            <el-input v-if="inputDisabled==false" type="text" v-model="item.askTitle"></el-input>
          </el-col>
          <el-col :span="2" class="quesright"  v-if="inputDisabled==false" >
            <el-tooltip content="删除问题"  effect="dark" placement="bottom">
              <i  class="iconfontyyy" @click="deleteProblem(index);" content="Bottom center">&#xe6f7;</i>
            </el-tooltip>
          </el-col>
        </el-form-item>
        <el-form-item label="发布时间" >
          {{item.askTime}}
        </el-form-item>
        <el-form-item label="发布者">
          {{item.askUser}}
        </el-form-item>
        <el-form-item label="解答" >
          <el-col :span="22">
            <span v-if="inputDisabled==true">{{item.askContent}}</span>
            <el-input v-if="inputDisabled==false" type="text" v-model="item.askContent"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</div>
</template>
<script>
  import ElButton from "../../../../node_modules/element-ui/packages/button/src/button";

    export default{
      components: {ElButton},
      data(){
            return {
              layerDialog:{
                isopen:false,
                dialogTitle:'',
                label:'',
                addGoods:false,
              },
              productIdd:this.productId,
              financeFormLabelWidth: '90px',
              problemparentForm:[
                {
                  productId: '1',
                  askTime: '2',
                  askUser: '3',
                  askTitle: '',
                  askContent: '5',
                  issueId:'5'
                }
              ],
              inputDisabled:this.inputDisabled,//区分查看编辑
              userName:''
            }
        },
        props:['inputDisabled','productId','docmentNull','problemask'],
        watch: {
          'inputDisabled'(val){
          	this.inputDisabled=val;
          },
          'productId'(val){
          	this.productIdd = val;
          },
      },
      mounted: function () {
       // this.requestem();
        this.getuserName();
      },
        methods: {
          getuserName(){
            this.httpPost('personalCentre/select').then(res=>{
              this.userName=res.data.params.personalCentreList.userInfoDataData.userName;
            })
          },
          deleteProblem(index){
          	this.problemparentForm.splice(index,1);
          },
          addproblem(){
            this.problemparentForm.push({
              productId: '',
              askTime:  this.getdata(),
              askUser:  this.userName,
              askTitle: '',
              askContent: '',
              issueId:''})
          },
      	  getdata(){
              var date = new Date();
              var seperator1 = ".";
              var seperator2 = ":";
              var month = date.getMonth() + 1;
              var strDate = date.getDate();
              if (month >= 1 && month <= 9) {
                month = "0" + month;
              }
              if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
              }
              var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                + " " + date.getHours() + seperator2 + date.getMinutes()
                + seperator2 + date.getSeconds();
                return currentdate;

          },
          getProductQuest(){
      	  	var that=this;
            this.httpPost('productDevInfo/getProductQuest?productId='+this.productId).then(res=>{
            	if(res.data != []){
                this.problemparentForm=res.data;
                for(var i=0;i<this.problemparentForm.length;i++){
                  this.problemparentForm[i].askTime = that.tool.formatDate('','',this.problemparentForm[i].askTime)
                }
              }else{
                this.problemparentForm=[];
              }
            })
          },
          submitForm(){

          }
        },
    }

</script>

<style scoped>
  .quesright{
    float: right;
  }
</style>

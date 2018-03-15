<template>
<div>
  <el-form :label-width="financeFormLabelWidth" ref="addFrom"  :model="addFrom" :rules="infoRules">
    <el-form-item label="语言"  prop="languageNo" required>
      <el-col :span="6">
        <el-select  v-model="addFrom.languageNo" placeholder="请选择语言" filterable >
            <el-option
              v-for="item in options"
              :key="item.langNo"
              :label="item.cnName"
              :value="item.langNo">
            </el-option>
          </el-select>
      </el-col >
    </el-form-item>
    <el-form-item label="标题" prop="title"  >
      <el-input type="textarea" :rows="2" :disabled="dis" v-model="addFrom.title"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="description"  >
      <el-input type="textarea" :disabled="dis" v-model="addFrom.description"></el-input>
      <!--{{addFrom}}-->
    </el-form-item>
  </el-form>
</div>
</template>
<script>
    export default{
    	name:'describeDialog',
      data(){
            return {
              props:{
                value:'langNo',
                label:'cnName',
              },
              provs:[],
              financeFormLabelWidth: '120px',
              describeparentForm:this.describeparentinfoDetail,
              inputDisabled:this.inputDisabled,//区分查看编辑
              dis:this.disState,
              options:[],
              optionsData:'',
              productId:'',
              addFrom:{
                productId:'',
                title:'',
                description:'',
                languageNo:'',
                id:'',
              },
              formListL:[],
              getFeom:{
                langNo:'1',
              },
              langNo:'1',
              requiredd:false,
              success:false,
              infoRules:{
                description:[
                  { message: '请输入合法的语言！', trigger: 'blur' },
                  {min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur'}
                ],
                title:[
                  {min: 1, max: 225, message: '长度在 1 到 225 个字符', trigger: 'blur'}
                ],
                languageNo:[
                  {required: true, message: '请选择语言！', trigger: 'blur'}
                ]

              }
            }
        },
      props:['disState','Selected'],
      watch: {
        'addFrom':{
          handler(val,oldVal){
            this.$emit('assignment',val);
          },
          deep: true
        },
        'addFrom.languageNo':{
          handler(val,oldVal){
          	//alert(val)
            this.change(val);
          },
          deep: true
        },
        'Selected':{
          handler(val,oldVal){
              //alert(val)
            //alert(888)
              this.addFrom.productId = val.productId;
              this.change(this.addFrom.languageNo);
          },
          deep: true
        },
        'disState':{
          handler(val){
            this.dis = val;
          }
        }
      },
        methods: {
          ResetFrom(){
            this.$refs['addFrom'].resetFields();
            this.addFrom.description='';
          },
          submitForm() {
            var req = false;
            this.$refs['addFrom'].validate((valid) => {
              if (valid) {
              	if(this.addFrom.languageNo == '2' || this.addFrom.languageNo == '1'){
              		if(this.addFrom.description == ''){
              			this.$message('请填写描述')
                  }else{
                    req = true;
                  }
                }else{
                  req = true;
                }
              } else {
                req = false;
                console.log('error submit!!');
                return false;
              }
            });
            return req;
          },
            getLanguage(){
                let productId = this.productId
//                this.httpPost('productInfo/language?productId='+productId).then(src=>{
                this.httpPost('productDevInfo/getlanguage',this.Selected.productId).then(res=>{
                  this.options=res.data;
                })
            },
          /*getList(){
//          ,{productId:this.Selected.productId,langNo:this.langNo}
            this.addFrom.productId = this.Selected.productId;
            this.httpPost('productDevInfo/descript?productId='+this.Selected.productId+'&langNo='+this.langNo).then(res=>{
              console.log(res.data);
              let len = res.data.length;
              console.log(len)
              if(res.data){
                  //alert(999)
//                this.addFrom=res.data;
                this.addFrom.productId=res.data.productId;
                this.addFrom.title=res.data.title;
                this.addFrom.description=res.data.description;
                this.addFrom.langCode=res.data.langCode;
                this.addFrom.id=res.data.id;
              }else {
                  return;
              }
            })
          },*/

         change(val){
           this.deleteFrom();
           this.addFrom.productId = this.Selected.productId;
           this.httpPost('productDevInfo/descript?productId='+this.Selected.productId+'&langNo='+val).then(res=>{
           //	alert(9999)
             console.log(res.data);
             let len = res.data.length;
             console.log(len)
             if(res.data){
               //(999)
               this.addFrom.productId=res.data.productId;
               this.addFrom.title=res.data.title;
               this.addFrom.description=res.data.description;
               this.addFrom.languageNo=res.data.languageNo;
              /* if(this.addFrom.languageNo==''){
                 this.addFrom.languageNo = '1';
               }*/
               this.addFrom.id=res.data.id;
             }else {
               return;
             }
           })
          },
          addlang(){
            this.addFrom.languageNo='2';
          },
          deleteFrom(){
            this.addFrom.productId='';
            this.addFrom.title='';
            this.addFrom.description='';
            this.addFrom.id='';
          }
        },
      mounted () {
        this.getLanguage();
        //this.addlang();
//        this.getList()
      },
    }

</script>

<style scoped>


</style>

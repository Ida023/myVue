<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div class="personalTitle">
      <div>
        <span class="bold">个人中心</span>
        <span class="titleName">/&nbsp;Personal Center</span>
      </div>
      <div class="done">
        <span @click="isOpen=true">修改密码</span>
        <span @click="logout">退出</span>
      </div>
    </div>
    <div id="content_wrap" class="content_wrap">
      <div class="content_m">
        <el-col :span="15">
          <el-row>
            <img src="../../assets/personalImg.jpg" alt="">
          </el-row>
          <el-row>
            <el-col :span="5">&nbsp;</el-col>
            <el-col :span="19" class="formData">
              <el-form :model="personalCentreList"  label-position="right">
                <el-form-item label="邮箱/Email：" :label-width="formLabelWidth">
                  {{personalCentreList.userInfoDataData.email}}
                </el-form-item>
                <el-form-item label="姓名/Name：" :label-width="formLabelWidth">
                  {{personalCentreList.userInfoDataData.userName}}
                </el-form-item>
                <el-form-item label="手机/Phone：" :label-width="formLabelWidth">
                  {{personalCentreList.userInfoDataData.phone}}
                </el-form-item>
                <el-form-item label="角色/Role：" :label-width="formLabelWidth" class="listData">
                  <span v-for="(list,index) in personalCentreList.roleNameList" :key="list.roleName">{{list.roleName}}<span>，</span></span>
                </el-form-item>
                <el-form-item label="账号/Account Number：" :label-width="formLabelWidth" >
                  <el-form-item v-for="list in personalCentreList.channelNoList" :key="list.accNo" >
                    <span>{{list.channelName}}<span>：</span>{{list.accNo}}</span>
                  </el-form-item>
                </el-form-item>
                <el-form-item label="分配仓库/warehouse：" :label-width="formLabelWidth" class="listData">
                    <span v-for="list in personalCentreList.warehouseNameList" :key="list.wnName">{{list.wnName}}<span>，</span></span>
                </el-form-item>
                <el-form-item label="所属部门/Department：" :label-width="formLabelWidth" class="listData">
                  <span v-for="(list,index) in personalCentreList.deptNameList" :key="list.deptName" :class="index+'span'">{{list.deptName}}<span>，</span></span>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="9">&nbsp; </el-col>
          </el-row>
        </el-col>
        <el-col :span="9">
          <div class="info_main">
            <div class="infoData" v-for="item in infoData" :key="item.updTime">
              <div class="date">{{item.updTime}}</div>
              <div v-html="item.content" class="contentAa"></div>
            </div>
          </div>
          <div class="more" >
            <span id="moreId"  @click="getMore">查看更多</span>
          </div>
        </el-col>
      </div>
    </div>
    <!-----------------------修改密码----------------------------------->
    <el-dialog title="修改密码" :visible.sync="isOpen" size="tiny" @close="resetForm('ruleForm');">
      <el-form :model="ruleForm" :rules="rules2" ref="ruleForm" label-width="100px" class="demo-dynamic">
        <el-form-item  prop="password"   label="原密码：" :rules="[{ required: true, message: '请输入原密码', trigger: 'blur' }]" >
          <el-input type="password" v-model="ruleForm.password" ></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPassword" >
          <el-input type="password" v-model="ruleForm.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="newTwoPassword">
          <el-input type="password"  v-model="ruleForm.newTwoPassword"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isOpen = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm');" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'
  export default {
   data(){
     let validatePass = (rule, value, callback) => {
       if (value === '') {
         callback(new Error('请输入密码'));
       }else if(!/^(?=[`~!@#\$%\^&*\(\)\-_=\+\\\|\[\]\{\}:;\"\',.<>\/\?\d]*[a-zA-Z]+)(?=[a-zA-Z`~!@#\$%\^&*\(\)\-_=\+\\\|\[\]\{\}:;\"\',.<>\/\?]*\d+)[`~!@#\$%\^&*\(\)\-_=\+\\\|\[\]\{\}:;\"\',.<>\/\?\w]{6,16}$/.test(value)){
         callback(new Error('密码格式为6-16位数字+字母组成'));
       }  else {
         if (this.ruleForm.newTwoPassword !== '') {
           this.$refs.ruleForm.validateField('newTwoPassword');
         }
         callback();
       }
     };
     let validatePass2 = (rule, value, callback) => {
       if (value === '') {
         callback(new Error('请再次输入密码'));
       } else if (value !== this.ruleForm.newPassword) {
         callback(new Error('两次输入密码不一致!'));
       } else {
         callback();
       }
     };
       return{
         ruleForm: {
           password:'',
           newPassword:'',
           newTwoPassword:'',
         },
         isOpen:false,
         personalCentreList:{
           userInfoDataData:{
             email: "",
             phone: "",
             userName: "",
           },
           channelNoList:[
             {
               channelName:'',
               accNo:''
             }
           ],
           deptNameList:'',
           roleNameList:'',
           warehouseNameList:'',
         },
         formLabelWidth:'200px',
         pageFilter:{
             currentPage:1,
             pageSize:4,
         },
         infoData:[],
         rules2: {
           newPassword: [
             {validator: validatePass, trigger: 'blur', required: true,}
           ],
           newTwoPassword: [
             {validator: validatePass2, trigger: 'blur', required: true,}
           ],
         }

       }
   },
    mounted(){
      this.getDayInfoData();
      this.getPersonalData();
      this.postmenu(this.topMenu);
    },
    methods:{
      ...mapMutations([
        'postmenu',
        'subnav',
        'getsub'
      ]),
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.httpPost('personalCentre/updateUserPasswode',this.ruleForm,'Rms').then(res =>{
              if(res.data.result == true){
                this.isOpen = false;
                this.$alert('密码修改成功，请重新登入！', '提示', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.replace({
                      path: 'login',
                    })
                  }
                });
              }else{
                this.$message(res.data.message);
              }
            })
          } else {
            return false;
          }
        });
      },
      getPersonalData(){
         this.httpPost('personalCentre/select').then(res =>{
             if(res.data.result == true){
                console.log(res);
                this.personalCentreList = res.data.params.personalCentreList;
             }
         })
      } ,
      getDayInfoData(){
        this.httpPost('personalCentre/selectUpgradel',this.pageFilter).then(res =>{
          if(res.data.result == true){
              this.infoData = res.data.params.docsDataList.listData;
              if(this.infoData.length <= 0){
                let div = document.getElementById('moreId');
                div.className = 'getMore';
              }
              for(var i=0;i<this.infoData.length;i++){
                  let time = this.tool.reserverDate(this.infoData[i].updTime);
                  this.infoData[i].updTime = time;
              }
          }
        })
      },
      logout(){
          this.httpPost('logout').then(res =>{
            if(res.data.result == true){
              sessionStorage.removeItem('userSession');
              this.$router.push({
                path:'/login'
              })
            }else{
                this.$message(res.data.message);
            }
          })
    },
      getMore(){
          this.$router.push({
            path:'/dayData'
          })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>
.personalTitle{
  display:flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  padding:20px;
}
.bold{
  font-weight:bold;
}
.personalTitle .titleName{
  color:#5d5b5b;;
}
.personalTitle span{
  color: #20a0ff
}
  .done span{
    cursor: pointer;
    font-size:14px;
  }
  .content_m img{
    width: 100%;
    height: 100%;
  }
  .formData{
    margin-top:20px;
  }
  .infoData{
    border:1px solid#ccc;
    margin:0 0 20px 20px;
    padding:20px;

  }
  .date{
    padding-bottom:10px;
  }
  .contentAa{
    font-size:14px;
  }
  .more{
    color:#20a0ff;
    cursor: pointer;
    padding:10px 0;
    position: fixed;
    right: 20px;
  }
.getMore{
  display: none;
  }
  .info_main{
    max-height: 750px;
    overflow: auto;
  }
.listData span:last-child span{
  display:none;
}
</style>

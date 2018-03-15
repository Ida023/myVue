<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row id="filer" class="supplierFiler" style="margin-top:-10px;">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <span class="span_label">类型</span>
            <el-radio-group v-model="pageFilter.isUse" @change="page.currentPage=1;getPaypalList()" size="small">
              <el-radio-button  label="">全部</el-radio-button>
              <el-radio-button  label="1">已启用</el-radio-button>
              <el-radio-button  label="0">已暂停</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn"    v-if="ButtonInfo['新增PayPal账号']!='0'">
        <el-button type="primary" size="small" class="el-icon-plus" @click="tool.clearObjValue(accountInfo);dialogFlag.infoDetail = true;dialogFlag.inputDisabled = false;dialogFlag.dialogTitle='新增PayPal账号'">新增PayPal账号</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="paypalData" border tooltip-effect="dark" style="width: 100%">
          <el-table-column  label="操作" align="center" width="160px">
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start"     v-if="ButtonInfo['查看']!='0'">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row);dialogFlag.dialogTitle='查看PayPal账号';dialogFlag.inputDisabled = true;" >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start"    v-if="ButtonInfo['编辑']!='0'">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row);dialogFlag.dialogTitle='编辑PayPal账号';dialogFlag.inputDisabled = false;">&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="停用" placement="top-start"    v-if="ButtonInfo['停用']!='0'" v-show="scope.row.isUse == true">
                <i class="iconfontyyy" @click="updateStatus(scope.row,0)" >&#xe615;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="启用" placement="top-start"     v-if="ButtonInfo['启用']!='0'" v-show="scope.row.isUse == false">
                <i class="iconfontyyy" @click="updateStatus(scope.row,1)">&#xe618;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="accountName" label="pp账户名称" align="center"></el-table-column>
          <el-table-column sortable prop="accountEmail" label="账号邮箱"  align="center"></el-table-column>
          <el-table-column sortable prop="apiUserNo"   label="API邮箱"   align="center" ></el-table-column>
          <el-table-column sortable prop="areaId" label="所属区域"  align="center"></el-table-column>
          <el-table-column sortable prop="isUse" label="状态" :formatter="reserveisUse" align="center"></el-table-column>
          <el-table-column sortable prop="addUser" label="添加人"  align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="添加时间" :formatter="tool.formatDate" width="180px" align="center"></el-table-column>
          <el-table-column sortable prop="updTime" label="最新修改时间" :formatter="tool.formatDate" width="180px" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!-----------------------添加、查看和编辑PayPal账号弹窗----------------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" size="small" @close="resetForm('accountInfo');">
      <el-form ref="accountInfo" :model="accountInfo" label-width="100px">
        <el-form-item label="PP账号名称" prop="accountName" :rules="[{required:true,message:'不能为空',trigger:'change'},{min:1,max:20,message:'长度控制在1-20之间',trriger:'change'}]">
          <el-input v-model="accountInfo.accountName" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="账号邮箱" prop="accountEmail" :rules="[{required:true,message:'不能为空',trigger:'change'},{min:1,max:20,message:'长度控制在1-20之间',trriger:'change'}]">
          <el-input v-model="accountInfo.accountEmail" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="所属区域" prop="areaId" :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <area-list :select-value="accountInfo.areaId" @getData="getArea" :is-disabled="dialogFlag.inputDisabled"></area-list>
        </el-form-item>
        <el-form-item label="API 邮箱" prop="apiUserNo" :rules="[{required:true,message:'不能为空',trigger:'change'},{min:1,max:20,message:'长度控制在1-20之间',trriger:'change'}]">
          <el-input v-model="accountInfo.apiUserNo" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="API 密码" prop="apiPassword" :rules="[{required:true,message:'不能为空',trigger:'change'},{min:1,max:20,message:'长度控制在1-20之间',trriger:'change'}]">
          <el-input v-model="accountInfo.apiPassword" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="API Token" prop="apiToken" :rules="[{required:true,message:'不能为空',trigger:'change'},{min:1,max:20,message:'长度控制在1-20之间',trriger:'change'}]">
          <el-input v-model="accountInfo.apiToken" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="添加人" prop="addUser" v-show="dialogFlag.inputDisabled == true">
          <el-input v-model="accountInfo.addUser" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="添加时间" prop="addTime" v-show="dialogFlag.inputDisabled == true">
          <el-input v-model="accountInfo.addTime" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="最新修改时间" prop="updTime" v-show="dialogFlag.inputDisabled == true">
          <el-input v-model="accountInfo.updTime" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail = false">{{dialogFlag.inputDisabled == true?'关闭':'取消'}}</el-button>
        <el-button type="primary" @click="updateCompany('accountInfo');" :loading="$store.state.loading" v-if="dialogFlag.inputDisabled == false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import areaList from '../../components/listData/getAreaList'
  export default{
    components: {areaList},
    data(){
      return {
        activeNames: ['1'],
        pageFilter:{
          currentPage:1,
          pageSize:10,
          isUse:'1',
        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalPage:10,
          totalCount:10,
        },
        accountInfo: {
          accountName:'',
          accountEmail:'',
          areaId:'',
          apiUserNo:'',
          apiPassword:'',
          apiToken:'',
        },
        paypalData:[],   // 列表
        dialogFlag:{
          dialogTitle:'',
          infoDetail:false,    //  添加 编辑  查看框
          inputDisabled:false,   //是否编辑
        },
        financeFormLabelWidth: '140px',
        accountId:'',
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    computed:{
    },
    mounted () {

      this.getauthorityList();

      this.getPaypalList();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      getPaypalList:function(){
        this.tool.clearObjValue(this.updInfo);
        this.httpGet('financialAccountPaypal/selectAll',this.pageFilter,'Sms').then(res => {
            const pageData = res.data;
            this.page = pageData;
            this.paypalData = pageData.listData;
        }).catch(function(err){
          console.log(err);
        })
      },
      showInfoDialog:function(row){
        this.accountId = row.accountId;
        this.httpGet('financialAccountPaypal/selectData',{accountId:row.accountId},'Sms').then(res =>{
            if(res.data.result == true){
              this.accountInfo = res.data.params.data;
              this.accountInfo.addTime = this.tool.formatDate('','',this.accountInfo.addTime);
              this.accountInfo.updTime = this.tool.formatDate('','',this.accountInfo.updTime);
              this.dialogFlag.infoDetail = true;
            }else{
                this.$message(res.data.message);
            }
        })
      },
      updateStatus:function(row,val){
        var msg = val == 0 ? '您确定要停用该账号？' : '您确定要启用该账号？';
        var params = {
          isUse:val,
          accountId:row.accountId
        }
        this.doItem(msg,'financialAccountPaypal/update',params,this.getPaypalList);
      },
      updateCompany:function(formName){
        if(this.dialogFlag.dialogTitle == '新增PayPal账号'){
          if(this.accountInfo.hasOwnProperty('accountId')){
            delete this.accountInfo.accountId;
          }
        }else{
          this.accountInfo.accountId = this.accountId;
        }
        var url = this.dialogFlag.dialogTitle == '新增PayPal账号' ? 'financialAccountPaypal/save':'financialAccountPaypal/update';
        delete this.accountInfo.isUse;
        delete this.accountInfo.addTime;
        delete this.accountInfo.addUser;
        delete this.accountInfo.updTime;
        delete this.accountInfo.updUser;
        this.$refs[formName].validate((valid) =>{
          if(valid){
            this.httpPost(url,this.accountInfo,'Sms').then(res =>{
              this.$message(res.data.message);
              if(res.data.result == true){
                this.dialogFlag.infoDetail = false;
                this.getPaypalList();
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = 1;
        this.getPaypalList();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getPaypalList();
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      getArea:function(val){
        this.accountInfo.areaId = val.value;
      },
      reserveisUse:function(val){
        return val.isUse == true ?  '启用中' : '停用中';
      },
    }
  }
</script>
<style>
</style>

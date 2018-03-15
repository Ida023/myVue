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
            <el-radio-group v-model="pageFilter.isUse" @change="page.currentPage=1;getCompanyList()" size="small">
              <el-radio-button  label="">全部</el-radio-button>
              <el-radio-button  label="1">已启用</el-radio-button>
              <el-radio-button  label="0">已暂停</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn"  v-if="ButtonInfo['新增公司']!='0'" >
        <el-button type="primary" size="small" class="el-icon-plus" @click="tool.clearObjValue(companyInfo);dialogFlag.infoDetail = true;dialogFlag.inputDisabled = false;dialogFlag.dialogTitle='新增公司'">新增公司</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="companyData" border tooltip-effect="dark" style="width: 100%">
          <el-table-column  label="操作" align="center" width="160px">
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start"      v-if="ButtonInfo['查看']!='0'" >
                <i class="iconfontyyy" @click="showInfoDialog(scope.row);dialogFlag.dialogTitle='查看公司';dialogFlag.inputDisabled = true;" >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start"     v-if="ButtonInfo['编辑']!='0'" >
                <i class="iconfontyyy" @click="showInfoDialog(scope.row);dialogFlag.dialogTitle='编辑公司';dialogFlag.inputDisabled = false;">&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="停用" placement="top-start"      v-if="ButtonInfo['停用']!='0'"  v-show="scope.row.isUse == true">
                <i class="iconfontyyy" @click="updateStatus(scope.row,0)" >&#xe615;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="启用" placement="top-start"      v-if="ButtonInfo['启用']!='0'"   v-show="scope.row.isUse == false">
                <i class="iconfontyyy" @click="updateStatus(scope.row,1)">&#xe618;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="corporationName" label="公司名称" align="center"></el-table-column>
          <el-table-column sortable prop="corporationCode" label="代码"  align="center"></el-table-column>
          <el-table-column sortable prop="isUse"   label="状态"   align="center" :formatter="reserveisUse"></el-table-column>
          <el-table-column sortable prop="addUser" label="添加人"  align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="创建时间" :formatter="tool.formatDate" width="180px" align="center"></el-table-column>
          <el-table-column sortable prop="updTime" label="最后修改时间" :formatter="tool.formatDate" width="180px" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!-----------------------添加、查看和编辑公司弹窗----------------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" size="tiny" @close="resetForm('companyInfo');">
      <el-form ref="companyInfo" :model="companyInfo" label-width="80px">
        <el-form-item label="公司名称" prop="corporationName" :rules="[{required:true,message:'不能为空',trigger:'change'},{min:1,max:50,message:'长度控制在1-50之间',trriger:'change'}]">
          <el-input v-model="companyInfo.corporationName" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="公司简称" prop="corporationCode" :rules="[{required:true,message:'不能为空',trigger:'change'},{min:1,max:3,message:'长度控制在1-3之间',trriger:'change'}]">
          <el-input v-model="companyInfo.corporationCode" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="添加人" prop="addUser" v-show="dialogFlag.inputDisabled == true">
          <el-input v-model="companyInfo.addUser" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="添加时间" prop="addTime" v-show="dialogFlag.inputDisabled == true">
          <el-input v-model="companyInfo.addTime" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail = false">{{dialogFlag.inputDisabled == true?'关闭':'取消'}}</el-button>
        <el-button type="primary" @click="updateCompany('companyInfo');" :loading="$store.state.loading" v-if="dialogFlag.inputDisabled == false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default{
    components: {},
    data(){
      return {
        activeNames: ['1'],
        companyInfo: {},
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
        updInfo:{
          corporationId:'',
          corporationName:'',
          corporationCode:'',
          isUse:'',
        },
        companyData:[],   // 列表
        dialogFlag:{
          dialogTitle:'',
          infoDetail:false,    //  添加 编辑  查看框
          inputDisabled:false,   //是否编辑
        },
        financeFormLabelWidth: '140px',
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    computed:{
    },
    mounted () {

      this.getauthorityList();
      this.getCompanyList();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      getCompanyList:function(){
        this.tool.clearObjValue(this.updInfo);
        this.httpGet('financialCorporation/selectAll',this.pageFilter,'sms').then(res => {
            const pageData = res.data;
            this.page = pageData;
            this.companyData = pageData.listData;
        }).catch(function(err){
          console.log(err);
        })
      },
      showInfoDialog:function(row){
        this.httpGet('financialCorporation/selectData',{corporationId:row.corporationId},'sms').then(res =>{
            if(res.data.result == true){
                this.companyInfo = res.data.params.list;
                this.companyInfo.addTime = this.tool.formatDate('','',this.companyInfo.addTime);
                this.dialogFlag.infoDetail = true;
            }else{
                this.$message(res.data.message);
            }
        })
      },
      updateStatus:function(row,val){
          var msg = val == 0 ? '您确定要停用该公司？' : '您确定要启用该公司？';
          this.updInfo.corporationId = row.corporationId;
          this.updInfo.isUse = val;
          this.doItem(msg,'financialCorporation/update',this.updInfo,this.getCompanyList);
      },
      updateCompany:function(formName){
        var data = {corporationName:this.companyInfo.corporationName,corporationCode:this.companyInfo.corporationCode};
        this.updInfo.corporationId = this.companyInfo.corporationId;
        this.updInfo.corporationName = this.companyInfo.corporationName;
        this.updInfo.corporationCode = this.companyInfo.corporationCode;
        var params =  this.dialogFlag.dialogTitle == '新增公司' ? data : this.updInfo;
        var url = this.dialogFlag.dialogTitle == '新增公司' ? 'financialCorporation/save':'financialCorporation/update';
        this.$refs[formName].validate((valid) =>{
          if(valid){
            this.httpPost(url,params,'sms').then(res =>{
              this.$message(res.data.message);
              if(res.data.result == true){
                this.dialogFlag.infoDetail = false;
                this.getCompanyList();
                this.tool.clearObjValue(this.updInfo);
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
        this.getCompanyList();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getCompanyList();
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      reserveisUse:function(val){
        return val.isUse == true ?  '启用中' : '停用中';
      },
    }
  }
</script>
<style>
</style>

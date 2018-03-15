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
            <el-radio-group v-model="pageFilter.isUse" @change="page.currentPage=1;getBankcardList()" size="small">
              <el-radio-button  label="">全部</el-radio-button>
              <el-radio-button  label="1">已启用</el-radio-button>
              <el-radio-button  label="0">已暂停</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn"      v-if="ButtonInfo['新增银行卡']!='0'">
        <el-button type="primary" size="small" class="el-icon-plus" @click="tool.clearObjValue(companyInfo);dialogFlag.infoDetail = true;dialogFlag.inputDisabled = false;dialogFlag.dialogTitle='新增银行卡'">新增银行卡</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="bankcardData" border tooltip-effect="dark" style="width: 100%">
          <el-table-column  label="操作" align="center" width="160px">
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start"      v-if="ButtonInfo['查看']!='0'">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row);dialogFlag.dialogTitle='查看银行卡';dialogFlag.inputDisabled = true;" >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start"     v-if="ButtonInfo['编辑']!='0'">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row);dialogFlag.dialogTitle='编辑银行卡';dialogFlag.inputDisabled = false;">&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="停用" placement="top-start"     v-if="ButtonInfo['停用']!='0'" v-show="scope.row.isUse == true">
                <i class="iconfontyyy" @click="updateStatus(scope.row,0)" >&#xe615;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="启用" placement="top-start"     v-if="ButtonInfo['启用']!='0'"  v-show="scope.row.isUse == false">
                <i class="iconfontyyy" @click="updateStatus(scope.row,1)">&#xe618;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="accountName" label="银行卡名称" align="center"></el-table-column>
          <el-table-column sortable prop="cardId" label="银行卡卡号"  align="center"></el-table-column>
          <el-table-column sortable prop="userName"   label="开户人" align="center"></el-table-column>
          <el-table-column sortable prop="balanceCny" label="人民币余额" align="center">
            <template scope="scope">
              <span v-text="formatMoney(scope.row.balanceCny)"></span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="balanceUsd" label="美金余额" align="center">
            <template scope="scope">
              <span v-text="formatMoney(scope.row.balanceUsd)"></span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="balanceHkd" label="港币余额" align="center">
            <template scope="scope">
              <span v-text="formatMoney(scope.row.balanceHkd)"></span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="balanceGbp" label="英镑余额" align="center">
            <template scope="scope">
              <span v-text="formatMoney(scope.row.balanceGbp)"></span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="balanceEur" label="欧元余额" align="center">
            <template scope="scope">
              <span v-text="formatMoney(scope.row.balanceEur)"></span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="balanceAud" label="澳元余额" align="center">
            <template scope="scope">
              <span v-text="formatMoney(scope.row.balanceAud)"></span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="areaId" label="所属区域"  align="center"></el-table-column>
          <el-table-column sortable prop="corporationId" label="所属公司"  align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!-----------------------添加、查看和编辑银行卡弹窗----------------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" size="small" @close="resetForm('bandcardInfo');" @open="openAddDialog">
      <el-form :model="bandcardInfo" ref="bandcardInfo"  label-width="100px">
        <el-form-item label="银行卡名称" prop="accountName" :rules="[{required:true,message:'不能为空',trigger:'change'},{min:1,max:20,message:'长度控制在1-20之间',trriger:'change'}]">
          <el-input v-model="bandcardInfo.accountName" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="所属公司" prop="corporationId" :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <company-list :select-value="bandcardInfo.corporationId" :is-disabled="dialogFlag.inputDisabled" @getCompany="getCompany"></company-list>
        </el-form-item>
        <el-form-item label="所属区域" prop="areaId" :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <area-list :select-value="bandcardInfo.areaId" @getData="getArea" :is-disabled="dialogFlag.inputDisabled"></area-list>
        </el-form-item>
        <el-form-item label="银行卡卡号" prop="cardId" :rules="[{required:true,message:'不能为空',trigger:'change'},{min:16,max:19,message:'长度控制在16-19之间',trriger:'change'}]">
          <el-input type="number" v-model="bandcardInfo.cardId" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="开户人" prop="userName" :rules="[{required:true,message:'不能为空',trigger:'change'},{min:1,max:20,message:'长度控制在1-20之间',trriger:'change'}]">
          <el-input v-model="bandcardInfo.userName" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="开户行" prop="bankName" :rules="[{required:true,message:'不能为空',trigger:'change'},{min:1,max:20,message:'长度控制在1-20之间',trriger:'change'}]">
          <el-input v-model="bandcardInfo.bankName" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="银行卡类型" prop="cardType" :rules="[{required:true,message:'不能为空',trigger:'change',type:'number'}]">
          <el-radio-group v-model="bandcardInfo.cardType" :disabled="dialogFlag.inputDisabled">
            <el-radio :label="1">借记卡</el-radio>
            <el-radio :label="2">信用卡</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="人民币金额" prop="balanceCny">
          <el-input type="number" min="0" v-model="bandcardInfo.balanceCny" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="美金金额" prop="balanceUsd" >
          <el-input type="number" min="0" v-model="bandcardInfo.balanceUsd" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="港币金额" prop="balanceHkd" >
          <el-input type="number" min="0"  v-model="bandcardInfo.balanceHkd" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="英镑金额" prop="balanceGbp" >
          <el-input type="number" min="0" v-model="bandcardInfo.balanceGbp" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="欧元金额" prop="balanceEur">
          <el-input type="number" min="0" v-model="bandcardInfo.balanceEur" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="澳元金额" prop="balanceAud">
          <el-input type="number" min="0" v-model="bandcardInfo.balanceAud" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="memo" >
          <el-input type="textarea" v-model="bandcardInfo.memo" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail = false">{{dialogFlag.inputDisabled == true?'关闭':'取消'}}</el-button>
        <el-button type="primary" @click="updateBankcard('bandcardInfo');" :loading="$store.state.loading" v-if="dialogFlag.inputDisabled == false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import areaList from '../../components/listData/getAreaList'
  import companyList from '../../components/listData/getCompanyList'
  export default{
    components: {areaList,companyList},
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
        bandcardInfo:{
          accountName:'',
          areaId:'',
          corporationId:'',
          cardId:'',
          userName:'',
          bankName:'',
          cardType:'',
          balanceCny:'',
          balanceUsd:'',
          balanceHkd:'',
          balanceGbp:'',
          balanceEur:'',
          balanceAud:'',
          memo:'',
        },
        bankcardData:[],   // 列表
        dialogFlag:{
          dialogTitle:'',
          infoDetail:false,    //  添加 编辑  查看框
          inputDisabled:false,   //是否编辑
        },
        ButtonInfo:{},//按钮权限列表20171227

      }
    },
    computed:{
    },
    mounted () {
      this.getauthorityList();

      this.getBankcardList();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      getBankcardList:function(){
        this.tool.clearObjValue(this.updInfo);
        this.httpGet('financialAccountBank/selectAll',this.pageFilter,'Sms').then(res => {
            const pageData = res.data;
            this.page = pageData;
            this.bankcardData = pageData.listData;
        }).catch(function(err){
          console.log(err);
        })
      },
      showInfoDialog:function(row){
        this.httpGet('financialAccountBank/select',{accountId:row.accountId},'Sms').then(res =>{
          this.bandcardInfo = res.data;
          this.bandcardInfo.addTime = this.tool.formatDate('','',this.bandcardInfo.addTime);
          this.dialogFlag.infoDetail = true;
         })
      },
      updateStatus:function(row,val){
          var msg = val == 0 ? '您确定要停用该银行卡？' : '您确定要启用该银行卡？';
          var params = {
            accountId:row.accountId,
            isUse:val
          }
          this.doItem(msg,'financialAccountBank/update',params,this.getBankcardList);
      },
      updateBankcard:function(formName){
        if(this.dialogFlag.dialogTitle == '新增银行卡'){
          if(this.bandcardInfo.hasOwnProperty('accountId')){
            delete this.bandcardInfo.accountId;
          }
        }
        delete this.bandcardInfo.isUse;
        delete this.bandcardInfo.addTime;
        delete this.bandcardInfo.addUser;
        delete this.bandcardInfo.updTime;
        delete this.bandcardInfo.updUser;
        var url = this.dialogFlag.dialogTitle == '新增银行卡' ? 'financialAccountBank/save':'financialAccountBank/update';
        this.$refs[formName].validate((valid) =>{
          if(valid){
            this.httpPost(url,this.bandcardInfo,'Sms').then(res =>{
              this.$message(res.data.message);
              if(res.data.result == true){
                this.getBankcardList();
                this.dialogFlag.infoDetail = false;
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
        this.getBankcardList();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getBankcardList();
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.tool.clearObjValue(this.bandcardInfo);
      },
      getCompany:function(val){
        this.bandcardInfo.corporationId = val.value;
      },
      getArea:function(val){
        this.bandcardInfo.areaId = val.value;
      },
      openAddDialog:function(){
          if(this.dialogFlag.dialogTitle == '新增银行卡'){
            this.resetForm('bandcardInfo');
          }
      },
      formatMoney:function(val){
        var reg=/\d{1,3}(?=(\d{3})+$)/g;
        return (val + '').replace(reg, '$&,')+'.00';
      },
    }
  }
</script>
<style>
</style>

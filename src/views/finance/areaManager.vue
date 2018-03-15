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
            <el-radio-group v-model="pageFilter.isUse" @change="page.currentPage=1;getAreaList()" size="small">
              <el-radio-button  label="">全部</el-radio-button>
              <el-radio-button  label="1">已启用</el-radio-button>
              <el-radio-button  label="0">已暂停</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn"      v-if="ButtonInfo['新增区域']!='0'" >
        <el-button type="primary" size="small" class="el-icon-plus" @click="tool.clearObjValue(areaInfo);dialogFlag.infoDetail = true;dialogFlag.inputDisabled = false;dialogFlag.dialogTitle='新增区域'">新增区域</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="companyData" border tooltip-effect="dark" style="width: 100%">
          <el-table-column  label="操作" align="center" width="160px">
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start"      v-if="ButtonInfo['查看']!='0'" >
                <i class="iconfontyyy" @click="showInfoDialog(scope.row);dialogFlag.dialogTitle='查看区域';dialogFlag.inputDisabled = true;" >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start"     v-if="ButtonInfo['编辑']!='0'" >
                <i class="iconfontyyy" @click="showInfoDialog(scope.row);dialogFlag.dialogTitle='编辑区域';dialogFlag.inputDisabled = false;">&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="停用" placement="top-start"      v-if="ButtonInfo['停用']!='0'" v-show="scope.row.isUse == true">
                <i class="iconfontyyy" @click="updateStatus(scope.row,0)" >&#xe615;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="启用" placement="top-start"      v-if="ButtonInfo['启用']!='0'"  v-show="scope.row.isUse == false">
                <i class="iconfontyyy" @click="updateStatus(scope.row,1)">&#xe618;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="areaName" label="区域名称" align="center"></el-table-column>
          <el-table-column sortable prop="corporationId" label="所属公司"  align="center"></el-table-column>
          <el-table-column sortable prop="currencyId"   label="默认币种"   align="center" ></el-table-column>
          <el-table-column sortable prop="balanceCny" label="人民币余额" align="center">
            <template scope="scope">
              <span v-text="formatMoney(scope.row.balanceCny)"></span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="balanceUsd" label="美金余额"  align="center">
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
          <el-table-column sortable prop="balanceAud" label="澳元余额"  align="center">
            <template scope="scope">
              <span v-text="formatMoney(scope.row.balanceAud)"></span>
            </template>
          </el-table-column>
          <el-table-column sortable prop="isUse" label="状态" :formatter="reserveisUse" align="center"></el-table-column>
          <el-table-column sortable prop="updTime" label="最后修改时间" :formatter="tool.formatDate" width="180px" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!-----------------------添加、查看和编辑区域弹窗----------------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" size="small" @close="resetForm('areaInfo');">
      <el-form :model="areaInfo" ref="areaInfo" :rules="rules" label-width="100px">
        <el-form-item label="区域名称" prop="areaName" :rules="[{required:true,message:'不能为空',trigger:'change'},{min:1,max:20,message:'长度控制在1-20之间',trriger:'change'}]">
          <el-input v-model="areaInfo.areaName" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="公司" prop="corporationId" :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <company-list :select-value="areaInfo.corporationId" :is-disabled="dialogFlag.inputDisabled" @getCompany="getCompany"></company-list>
        </el-form-item>
        <el-form-item label="默认币种" prop="currencyId" :rules="[{required:true,message:'不能为空',trigger:'change'}]">
          <currency-list :select-value="areaInfo.currencyId" :is-disabled="dialogFlag.inputDisabled" @child-change-Val="getCurrency"></currency-list>
        </el-form-item>
        <el-form-item label="现金与否" prop="isCashArea" :rules="[{required:true,type:'boolean',message:'不能为空',trigger:'change'}]">
          <el-select v-model="areaInfo.isCashArea" placeholder="请选择" style="width: 100%;" :disabled="dialogFlag.inputDisabled">
            <el-option v-for="item in cashOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人民币金额" prop="balanceCny">
          <el-input type="number" min="0" v-model="areaInfo.balanceCny" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="美金金额" prop="balanceUsd" >
          <el-input type="number" min="0" v-model="areaInfo.balanceUsd" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="港币金额" prop="balanceHkd" >
          <el-input type="number" min="0"  v-model="areaInfo.balanceHkd" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="英镑金额" prop="balanceGbp" >
          <el-input type="number" min="0" v-model="areaInfo.balanceGbp" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="欧元金额" prop="balanceEur">
          <el-input type="number" min="0" v-model="areaInfo.balanceEur" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="澳元金额" prop="balanceAud">
          <el-input type="number" min="0" v-model="areaInfo.balanceAud" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="memo" >
          <el-input type="textarea" v-model="areaInfo.memo" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="添加人" prop="addUser" v-show="dialogFlag.inputDisabled == true">
          <el-input v-model="areaInfo.addUser" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
        <el-form-item label="添加时间" prop="addTime" v-show="dialogFlag.inputDisabled == true">
          <el-input v-model="areaInfo.addTime" :disabled="dialogFlag.inputDisabled"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail = false">{{dialogFlag.inputDisabled == true?'关闭':'取消'}}</el-button>
        <el-button type="primary" @click="updateArea('areaInfo');" v-show="dialogFlag.inputDisabled == false" :loading="$store.state.loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import currencyList from '../../components/listData/getCurrencyList'
  import companyList from '../../components/listData/getCompanyList'
  export default{
    components: {currencyList,companyList},
    data(){
      const regMoney = (rule, value, callback) => {
          if(value === ''  || value === undefined){
            callback();
          }else if (!/^\d+(\.\d{0,2})?$/.test(value)) {
              callback(new Error('请输入正确金额，小数点保留2位-'));
            } else{
              callback();
            }
      };
      return {
        cashOptions:[{value:true,label:'是'},{value:false,label:'否'}],
        activeNames: ['1'],
        areaInfo: {
          isCashArea:'',
          currencyId:'',
          balanceCny:'',
          balanceUsd:'',
          balanceHkd:'',
          balanceGbp:'',
          balanceEur:'',
          balanceAud:'',
          memo:'',
        },
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
        companyData:[],   // 列表
        dialogFlag:{
          dialogTitle:'',
          infoDetail:false,    //  添加 编辑  查看框
          inputDisabled:false,   //是否编辑
        },
        financeFormLabelWidth: '140px',
        areaId:'',
        reg:'/\d{1,3}(?=(\d{3})+$)/g',
        rules: {
          balanceCny: [{validator: regMoney, trigger: 'change'}],
          balanceUsd: [{validator: regMoney, trigger: 'change'}],
          balanceHkd: [{validator: regMoney, trigger: 'change'}],
          balanceGbp: [{validator: regMoney, trigger: 'change'}],
          balanceEur: [{validator: regMoney, trigger: 'change'}],
          balanceAud: [{validator: regMoney, trigger: 'change'}],
        },
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    computed:{
    },
    mounted () {
      this.getauthorityList();
      this.getAreaList();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      getAreaList:function(){
        this.httpGet('financialCorporationArea/selectAll',this.pageFilter,'Sms').then(res => {
            const pageData = res.data;
            this.page = pageData;
            this.companyData = pageData.listData;
        }).catch(function(err){
          console.log(err);
        })
      },
      showInfoDialog:function(row){
        this.areaId = row.areaId;
        this.httpGet('financialCorporationArea/select',{areaId:row.areaId},'Sms').then(res =>{
          this.areaInfo = res.data;
          this.areaInfo.addTime = this.tool.formatDate('','',this.areaInfo.addTime);
          this.dialogFlag.infoDetail = true;
        })
      },
      updateStatus:function(row,val){
        var msg = val == 0 ? '您确定要停用该区域？' : '您确定要启用该区域？';
        var params = {
            isUse:val,
            areaId:row.areaId
        }
        this.doItem(msg,'financialCorporationArea/update',params,this.getAreaList);
      },
      updateArea:function(formName){
        if(this.dialogFlag.dialogTitle == '新增区域'){
            if(this.areaInfo.hasOwnProperty('areaId')){
                delete this.areaInfo.areaId;
            }
        }else{
            this.areaInfo.areaId = this.areaId;
        }
        var url = this.dialogFlag.dialogTitle == '新增区域' ? 'financialCorporationArea/save':'financialCorporationArea/update';
        delete this.areaInfo.isUse;
        delete this.areaInfo.addTime;
        delete this.areaInfo.addUser;
        delete this.areaInfo.updTime;
        delete this.areaInfo.updUser;
        this.$refs[formName].validate((valid) =>{
          if(valid){
            this.httpPost(url,this.areaInfo,'Sms').then(res =>{
              this.$message(res.data.message);
              if(res.data.result == true){
                this.dialogFlag.infoDetail = false;
                this.getAreaList();
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
        this.getAreaList();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getAreaList();
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      reserveisUse:function(val){
        return val.isUse == true ?  '启用中' : '停用中';
      },
      getCurrency:function(val){
        this.areaInfo.currencyId = val.value;
      },
      getCompany:function(val){
        this.areaInfo.corporationId = val.value;
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

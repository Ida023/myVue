<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="8" class="optionValue">
          <el-input v-model="pageFilter.logisticsType" placeholder="请输入物流方式名称" size="small"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="small" @click="getLogisticsList()">搜索</el-button>
        </el-col>
      </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <span class="span_label">物流方式</span>
            <el-radio-group v-model="pageFilter.isUse" size="small" @change="getLogisticsList();">
              <el-radio-button  label=""  v-if="ButtonInfo['全部']!='0'">全部</el-radio-button>
              <el-radio-button  label="1" v-if="ButtonInfo['启用中']!='0'">启用中</el-radio-button>
              <el-radio-button  label="0" v-if="ButtonInfo['已暂停']!='0'">已暂停</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn" v-if="ButtonInfo['添加']!='0'">
        <el-button type="primary" class="el-icon-plus" size="small"  @click="clearFlag=true;dialogFlag.inputDisabled=false;dialogFlag.infoDetail=true;dialogFlag.dialogTitle='新增物流方式';">添加</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="logisticsData" border tooltip-effect="dark" style="width: 100%">
          <el-table-column label="操作" align="center" width="125px">
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start"  v-if="ButtonInfo['查看']!='0'">
                <i class="iconfontyyy" @click="clearFlag=false;showInfoDialog(scope.row);dialogFlag.inputDisabled=true;dialogFlag.dialogTitle='查看物流方式';" >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" v-if="ButtonInfo['编辑']!='0'">
                <i class="iconfontyyy" @click="clearFlag=false;showInfoDialog(scope.row);dialogFlag.inputDisabled=false;dialogFlag.dialogTitle='编辑物流方式';" >&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="scope.row.isUse == 0 ? '启用' : '停用'" placement="top-start"  v-if="ButtonInfo[scope.row.isUse == 0 ? '启用' : '停用']!='0'">
                <i class="iconfontyyy" @click="updateState(scope.row)" v-if="scope.row.isUse == 0">&#xe618;</i>
                <i class="iconfontyyy" @click="updateState(scope.row)" v-if="scope.row.isUse == 1">&#xe615;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="logisticsType" label="物流方式" align="center"></el-table-column>
          <el-table-column sortable prop="enName" label="物流方式（英文）" width="180px" align="center"></el-table-column>
          <el-table-column sortable prop="platformCode" label="平台物流代码" width="180px" align="center"></el-table-column>
          <el-table-column sortable prop="regulation" label="尺寸规则" min-width="180px" align="center"></el-table-column>
          <el-table-column sortable prop="isNeedTrackingNo" label="需要跟踪号？" width="80px"align="center"></el-table-column>
          <el-table-column sortable prop="userName" label="添加人" width="120px" align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="添加时间" width="180px" :formatter="tool.dateFormatter" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!------------------物流方式 查看  / 新建 / 编辑 地址 弹出框--------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" :close-on-click-modal="false" @close="closeDialog('logisticsForm')">
        <el-form :model="logisticsForm" ref="logisticsForm" :labelWidth="labelWidth">
          <el-form-item  label="物流方式名称："  prop="cnName"  :rules="[{ required: true, message: '请输入物流方式名称', trigger: 'change' },{ min: 1,max:50, message: '长度不能超过50位', trigger: 'change' }]">
            <el-input type="text" v-model="logisticsForm.cnName"  :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item  label="物流类型："  prop="logisticsType"   :rules="[{ required: true, message: '请选择物流类型', trigger: 'change' },{ min: 1,max:50, message: '长度不能超过50位', trigger: 'change' }]">
            <logistics-type :select-value="logisticsForm.logisticsType" :is-disabled="dialogFlag.inputDisabled" place-value="请选择物流类型" @getLogis="getLogis"></logistics-type>
          </el-form-item>
          <el-form-item  label="配送方式：" v-if="hasAPI == 1">
            <el-select v-model="logisticsForm.despatchCode" filterable clearable placeholder="请选择配送方式" size="small" style="width:100%" :disabled="dialogFlag.inputDisabled">
              <el-option v-for="item in sendData" :label="item.despatchName" :key="item.despatchCode" :value="item.despatchCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label="物流方式名称（英文）："  prop="enName"  :rules="[{ required: true, message: '请输入物流方式名称（英文）', trigger: 'change' },{ min: 1,max:50, message: '长度不能超过50位', trigger: 'change' }]">
            <el-input type="text" v-model="logisticsForm.enName"  :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item  label="EBay平台物流代码："  prop="platformCode">
            <el-input type="text" v-model="logisticsForm.platformCode"  :disabled="dialogFlag.inputDisabled"></el-input>
       <!--     <el-select v-model="logisticsForm.platformCode" filterable clearable placeholder="EBay平台物流代码" size="small" style="width:100%" :disabled="dialogFlag.inputDisabled">
               <el-option v-for="item in RAoptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
             </el-select>-->
          </el-form-item>
          <el-form-item  label="Amazon平台物流类型："  prop="platformType">
            <el-input type="text" v-model="logisticsForm.platformType"  :disabled="dialogFlag.inputDisabled"></el-input>
<!--            <el-select v-model="logisticsForm.platformCode" filterable clearable placeholder="Amazon平台物流类型" size="small" style="width:100%" :disabled="dialogFlag.inputDisabled">
               <el-option v-for="item in RAoptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
             </el-select>-->
          </el-form-item>
          <el-form-item  label="收件国家区域："  prop="receiveCountryArea" >
            <country-select :select-value="logisticsForm.receiveCountryArea" place-value="请选择国家" :is-disabled="dialogFlag.inputDisabled" @child-change-val="getCountry"></country-select>
          </el-form-item>
          <el-form-item  label="币种："  prop="currencyId"  :rules="[{ required: true, message: '请选择币种', trigger: 'change' }]">
            <currency-select :select-value="logisticsForm.currencyId" place-value="请选择币种" :is-disabled="dialogFlag.inputDisabled" @child-change-Val="getCurrencyId"></currency-select>
          </el-form-item>
          <el-form-item  label="首重费用："  prop="firstHeavyCost" >
            <el-input type="number" min="0" v-model="logisticsForm.firstHeavyCost"  :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item  label="挂号费："  prop="registrationCost" >
            <el-input type="number" min="0" v-model="logisticsForm.registrationCost"  :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item  label="操作费："  prop="handlingCost" >
            <el-input type="number" min="0" v-model="logisticsForm.handlingCost"  :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item  label="物流费用规则："  prop="costRules" >
            <el-radio-group v-model="logisticsForm.costRules" style="padding-top: 11px;font-size: 14px;" :disabled="dialogFlag.inputDisabled" @change="reinstate">
              <el-radio label="1">阶梯制</el-radio>
              <el-radio label="2">线性制</el-radio>
              <el-radio label="3">混合制</el-radio>
              <el-row v-if="logisticsForm.costRules == 3" class="mt-10">
                <div><span>费用=系数*重量</span><br/><br/><span>其中<span class="font-red">系数</span>为阶梯制：</span></div>
              </el-row>
              <el-row v-if="logisticsForm.costRules == 2" :gutter="10" class="mt-10" >
                <el-col :span="5" v-for="(item,index) in logisticsForm.addLogisticsRulList"><el-input type="number" min="0" v-model.number="item.costFactor" placeholder="系数" v-if="index==0"></el-input> </el-col>
                <el-col :span="5"><span class="lineh-36"> * 重量</span></el-col>
                <el-col class="margin-10-0">速卖通挂号配置：8+重量(g)*0.9，前述页面挂号费配置8，此处系数配置0.9</el-col>
                <el-col>速卖通平邮配置：0+重量(g)*0.9，前述页面挂号费配置0，此处系数配置0.9</el-col>
              </el-row>
              <el-row v-for="(item,index) in logisticsForm.addLogisticsRulList" :key="index" v-if="logisticsForm.costRules == 1 || logisticsForm.costRules == 3" :gutter="10" class="mt-10">
                <el-col :span="5"><el-input type="number" min="0" v-model.number="item.maxHeavy" :disabled="dialogFlag.inputDisabled"></el-input></el-col>
                <el-col :span="3"><span class="font-14 lineh-36">g以下</span></el-col>
                <el-col :span="5"><el-input type="number" min="0" v-model.number="item.costFactor" v-if="logisticsForm.costRules == 3"  placeholder="系数" :disabled="dialogFlag.inputDisabled"></el-input></el-col>
                <el-col :span="5"><el-input type="number" min="0" v-model.number="item.costFee" v-if="logisticsForm.costRules == 1"  placeholder="费用" :disabled="dialogFlag.inputDisabled"></el-input></el-col>
                <el-col :span="2"> <i v-if="dialogFlag.inputDisabled == false" class="el-icon-plus addIcon lineh-36" @click="addItem(index,logisticsForm.addLogisticsRulList)" ></i></el-col>
                <el-col :span="2"><i class="el-icon-minus delIcon lineh-36" @click="deleteItem(index,logisticsForm.addLogisticsRulList)" v-if="index != 0"></i></el-col>
              </el-row>
            </el-radio-group>
          </el-form-item>
          <el-form-item  label="长宽高限制："  >
            <el-row :gutter="10">
              <el-col :span="7">
                <el-input type="number" min="0"  v-model="logisticsForm.minLength" class="wd-60" :disabled="dialogFlag.inputDisabled"></el-input>
                <span class="font-14 lineh-36"> <长< </span>
                <el-input type="number" min="0" v-model="logisticsForm.maxLength" class="wd-60" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-col>
              <el-col :span="7">
                <el-input type="number" min="0" v-model="logisticsForm.minWidth" class="wd-60" :disabled="dialogFlag.inputDisabled"></el-input>
                <span class="font-14 lineh-36"> <宽< </span>
                <el-input type="number" min="0" v-model="logisticsForm.maxWidth" class="wd-60" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-col>
              <el-col :span="7">
                <el-input type="number" min="0" v-model="logisticsForm.minHeight"class="wd-60" :disabled="dialogFlag.inputDisabled"></el-input>
                <span class="font-14 lineh-36"> <高< </span>
                <el-input type="number" min="0" v-model="logisticsForm.maxHeight" class="wd-60" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item  label="体积限制："  prop="maxVolume">
            <el-row>
              <el-col>
                <el-input type="number" min="0" v-model="logisticsForm.minVolume" class="wd-60" :disabled="dialogFlag.inputDisabled"></el-input>
                <span class="font-14 lineh-36"> <体积< </span>
                <el-input type="number" min="0" v-model="logisticsForm.maxVolume" class="wd-60" :disabled="dialogFlag.inputDisabled"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item  label="跟踪单号："  prop="isNeedTrackingNo" >
            <el-radio-group v-model="logisticsForm.isNeedTrackingNo" :disabled="dialogFlag.inputDisabled">
              <el-radio label="1">需要</el-radio>
              <el-radio label="0">不需要</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item  label="发货方式："  prop="shippmentType"  :rules="[{ required: true, message: '不能为空', trigger: 'change' }]">
          <!--  <el-select v-model="logisticsForm.platformCode" filterable clearable placeholder="发货方式" size="small" style="width:100%" :disabled="dialogFlag.inputDisabled">
              <el-option v-for="item in shipOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
              <el-radio label="1">阶梯制</el-radio>
            </el-select>-->
            <el-radio-group v-model="logisticsForm.shippmentType"  :disabled="dialogFlag.inputDisabled" >
              <el-radio v-for="item in shipOptions" :label="item.value" :key="item.value" :value="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearFlag=false;dialogFlag.infoDetail = false;" v-if="dialogFlag.inputDisabled == false">取消</el-button>
        <el-button type="primary" @click="updateLogistics('logisticsForm');" v-if="dialogFlag.inputDisabled == false" :loading="$store.state.loading">确 定</el-button>
        <el-button @click="dialogFlag.infoDetail = false;" v-if="dialogFlag.inputDisabled == true">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import currencySelect from '../../components/listData/getCurrencyList.vue'
  import countrySelect from '../../components/listData/getCountryList.vue'
  import logisticsType from '../../components/listData/getLogisticsLIstAll.vue'
  export default{
    components: {currencySelect,countrySelect,logisticsType},
    data(){
      return {
        logisticsForm:{
          costRules:'',
          isNeedTrackingNo:'',
          shippmentType:'',
          addLogisticsRulList:[],
        },
        RAoptions:[{value:true,label:'是'},{value:false,label:'否'}],
        shipOptions:[{value:'1',label:'方式1'},{value:'2',label:'方式2'},{value:'3',label:'方式3'},],
        activeNames:['1'],
        logisticsData:[],
        sendData:[],
        pageFilter:{
          currentPage:1,
          pageSize:10,
          isUse:'',
          logisticsType:'',
        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalCount:10,
          totalPage:10
        },
        dialogFlag:{
          isOpen:false,     // 批量及单个删除框
          infoDetail:false,    //  添加 编辑  查看框
          dialogTitle:"",     // 弹出框 的title
          inputDisabled:false,   //checkbox是否处理可点击状态
        },
        labelWidth:'180px',
        sels:[],
        warehouseList:[],
        methodId:'',   // id
        hasAPI:'',   // id
        clearFlag:false,
        ButtonInfo:{},//按钮权限列表20171227
      }
    },
    mounted () {
      this.getauthorityList();
      this.getLogisticsList();
    },
    methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      getLogisticsList:function(){
        this.httpPost('logisticsMethod/select',this.pageFilter).then(res => {
            if(res.data.result == true){
              const pageData = res.data.params.list;
              this.page = pageData;
              this.logisticsData = pageData.listData;
              this.dialogFlag.isOpen = false;
            }else{
              this.logisticsData = [];
            }
        })
      },
      showInfoDialog(row){
        this.methodId = row.methodId;
        var vm = this;
        this.httpPost('logisticsMethod/selectData',{methodId:row.methodId}).then(res =>{
            if(res.data.result == true){
              this.logisticsForm = res.data.params.list;
              this.hasAPI = this.logisticsForm.hasApi;
              this.getDespatch(this.logisticsForm.hasApi,this.logisticsForm.despatchCode);
              if(this.logisticsForm.addLogisticsRulList.length < 1){
                this.resetArr();
              }
              this.dialogFlag.infoDetail = true;
              setTimeout(function(){
                  vm.clearFlag = true;
              },1000)
            }else{
                this.$message(res.data.message);
            }
        })
      },
      updateLogistics:function(formName){
         var data = this.logisticsForm.addLogisticsRulList;
         var required = true;
         var vm = this;
         this.$refs[formName].validate((valid) => {
          if (valid) {
            var flag = data.every(function(item,index,arr){
                var res = true;
                if(index != arr.length-1){
                   res = (item.maxHeavy < arr[index+1].maxHeavy);
                }
              return res;
            },this);
            if(this.logisticsForm.costRules == 1 || this.logisticsForm.costRules == 3){
              required = data.every(function(item){
                  var hunhe = (item.maxHeavy != '' && item.costFactor != '');
                  var jieti = (item.maxHeavy != '' && item.costFee != '');
                  var flag = vm.logisticsForm.costRules == 3 ? hunhe : jieti
                  return flag;
                })
                if(!required){
                  this.$message('请填写对应的重量及物流费用或是系数！');
                }else{
                  if(!flag){
                    this.$message('阶梯制或混合制时后面所填重量必须大于前面！');
                  }else{
                    this.submit();
                  }
                }
            }else if(this.logisticsForm.costRules == 2){
              if(this.logisticsForm.addLogisticsRulList[0].costFactor == ''){
                  this.$message('选择线性制时请输入对应系数！');
              }else{
                this.submit();
              }
            }else{
                this.submit();
            }
          }else{
            return false;
          }
         });
      },
      submit:function(){
        var url = this.dialogFlag.dialogTitle == '新增物流方式' ? 'logisticsMethod/addLogisticsInfo' : 'logisticsMethod/updateLogistics';
        this.dialogFlag.dialogTitle == '新增物流方式' ? delete this.logisticsForm.methodId:  this.logisticsForm.methodId = this.methodId;
        var list = [];
        var flag = this.logisticsForm.addLogisticsRulList.forEach(function(item,index,arr){
            var minHeavy = index == 0 ? 0 : arr[index-1].maxHeavy;
            list.push({rulesId:item.rulesId,minHeavy:minHeavy,maxHeavy:item.maxHeavy,costFee:item.costFee,costFactor:item.costFactor})
        },this);
        this.logisticsForm.addLogisticsRulList = list;
        this.httpPost(url,this.logisticsForm).then(res =>{
          this.$message(res.data.message);
          if(res.data.result == true){
            this.dialogFlag.infoDetail = false;
            this.clearFlag = false;
            this.getLogisticsList();
          }
        })
      },
      addItem:function(index,data){
        if(data.length>10){
          this.$message('最多只能添加10个');
        }else{
          data.splice(index+1,0,{maxHeavy:'',costFactor:'',rulesId:''});
        }
      },
      deleteItem:function(index,data){
         var id = data[index].rulesId;
         if(id !=''){
           this.httpPost('logisticsMethod/updateStatus',{rulesId:id}).then(res =>{
              if(res.data.result == false){
                  this.$message(res.data.message);
              }else{
                data.splice(index,1);
              }
           })
        }else{
           data.splice(index,1);
         }
      },
      updateState:function(row){
        var msg = row.isUse == 1 ? '您确定停用此物流方式？' : '您确定启用此物流方式？';
        this.doItem(msg,'logisticsMethod/updateStatus',{methodId:row.methodId},this.getLogisticsList);
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = '1';
        this.getLogisticsList();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getLogisticsList();
      },
      getCountry:function(val){
        this.logisticsForm.receiveCountryArea = val.value;
      },
      getCurrencyId:function(val){
        this.logisticsForm.currencyId = val.value;
      },
      closeDialog:function(formName){
        this.$refs[formName].resetFields();
        this.tool.clearObjValue(this.logisticsForm);
      },
      reinstate:function(){
         if(this.clearFlag == true){
           this.resetArr();
         }
      },
      resetArr:function(){
        this.logisticsForm.addLogisticsRulList = [{
          maxHeavy:'',
          costFactor:'',
          costFee:'',
          rulesId:'',
        }];
      },
      getLogis:function(val){
          this.logisticsForm.logisticsType = val.value;
          this.hasAPI = val.hasAPI;
          this.getDespatch(val.hasAPI,val.value);
      },
      getDespatch:function(hasAPI,param){
        if(hasAPI == 1){
          this.httpPost('cfgLogisticsDespatch/selectList',{logisticsType:param},'Sms').then(res =>{
            if(res.data){
              this.sendData = res.data;
            }
          })
        }
      }
    }
  }
</script>
<style scoped>
  .wd-60{
    width:60px;
  }
  .lineh-36{
    line-height:36px;
  }
  .font-14{
    font-size:14px;
  }
  .addIcon{
    font-size:20px;
    padding:0 5px;
    cursor: pointer;
  }
  .delIcon{
    font-size:20px;
    cursor: pointer;
  }
  .mt-10{
    margin-top:10px;
  }
  .font-red{
    color: red;
  }
  .margin-10-0{
    margin:10px 0;
  }
</style>

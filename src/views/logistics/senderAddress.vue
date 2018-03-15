<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="8" class="optionValue">
          <el-select v-model="pageFilter.warehouse" filterable clearable placeholder="请选择仓库" size="small" style="width:100%">
            <el-option v-for="item in warehouseList" :label="item.whName" :key="item.whId" :value="item.whId"></el-option>
          </el-select>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="small" @click="getSenderAddressList">搜索</el-button>
        </el-col>
      </el-row>
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <span class="span_label">种类</span>
            <el-radio-group v-model="pageFilter.logisticsCategory" size="small" @change="getSenderAddressList">
              <el-radio-button  label="01">德国DHL</el-radio-button>
              <el-radio-button  label="02">英国DPD</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn">
        <el-button type="primary" v-if="ButtonInfo['新建地址']!='0'" class="el-icon-plus" size="small"  @click="dialogFlag.inputDisabled=false;dialogFlag.infoDetail=true;dialogFlag.dialogTitle='新建地址';">新建地址</el-button>
        <el-button type="primary" size="small"  @click="dialogFlag.isOpen = true;">筛选</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn"   v-if="ButtonInfo['批量删除']!='0'">
        <el-button type="primary" size="small"  @click="deleteSenderAddr('',sels)">批量删除</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="senderAddressData" border tooltip-effect="dark" style="width: 100%"   @selection-change="selsChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="120px">
            <template scope="scope" >
              <el-tooltip class="item" effect="dark" content="查看" placement="top-start"  v-if="ButtonInfo['查看']!='0'">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row);dialogFlag.inputDisabled=true;dialogFlag.dialogTitle='查看地址';" >&#xe600;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start" v-if="ButtonInfo['编辑']!='0'">
                <i class="iconfontyyy" @click="showInfoDialog(scope.row);dialogFlag.inputDisabled=false;dialogFlag.dialogTitle='编辑地址';" >&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start" v-if="ButtonInfo['删除']!='0'">
                <i class="iconfontyyy" @click="deleteSenderAddr(scope.row,'')" >&#xe6f7;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column sortable prop="firstAddresser" :label="pageFilter.logisticsCategory == '01' ? '发货人1' : '联系人'" align="center"></el-table-column>
          <el-table-column sortable prop="addresser2" label="发货人2" v-if="pageFilter.logisticsCategory == '01'" align="center"></el-table-column>
          <el-table-column sortable prop="shortName" label="简称" v-if="pageFilter.logisticsCategory == '02'" align="center"></el-table-column>
          <el-table-column sortable prop="street" :label="pageFilter.logisticsCategory == '01' ? '街道名称' : '街道'" align="center"></el-table-column>
          <el-table-column sortable prop="streetCode" label="街道编码" v-if="pageFilter.logisticsCategory == '01'"  align="center"></el-table-column>
          <el-table-column sortable prop="address" label="地址信息" align="center"></el-table-column>
          <el-table-column sortable prop="postCode" label="邮编" align="center"></el-table-column>
          <el-table-column sortable prop="city" label="城市" align="center"></el-table-column>
          <el-table-column sortable prop="state" label="州" v-if="pageFilter.logisticsCategory == '01'" align="center"></el-table-column>
          <el-table-column sortable prop="nation" label="国家" align="center"></el-table-column>
          <el-table-column sortable prop="nationCode" label="国家编码" align="center"></el-table-column>
          <el-table-column sortable prop="email" label="邮箱" align="center"></el-table-column>
          <el-table-column sortable prop="tel" label="电话/手机" align="center"></el-table-column>
          <el-table-column sortable prop="isReturnAddress" label="RA" align="center"></el-table-column>
          <el-table-column sortable prop="addUser" label="创建人" align="center"></el-table-column>
          <el-table-column sortable prop="addTime" label="创建时间"  width="180px" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
    <!------------------德国DHL && 英国 查看  / 新建 / 编辑 地址 弹出框--------------------------->
    <el-dialog :title="dialogFlag.dialogTitle" :visible.sync="dialogFlag.infoDetail" :close-on-click-modal="false" @close="closeDialog('addressInfo')">
        <el-form :model="addressInfo" ref="addressInfo" :rules="rules">
          <el-form-item  :label="pageFilter.logisticsCategory == '01' ? '发货人1：' : '联系人'" :labelWidth="financeFormLabelWidth" prop="firstAddresser" required :rules="{required:true,message:'不能为空',trigger:'change'}">
            <el-input type="text" v-model="addressInfo.firstAddresser" :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item  v-if="pageFilter.logisticsCategory == '01'" label="发货人2：" :labelWidth="financeFormLabelWidth" prop="addresser2" :rules="{ min: 1, max: 50, message: '长度不能超过 50 个字符',trigger:'change'}">
            <el-input type="text" v-model="addressInfo.addresser2" :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item  v-if="pageFilter.logisticsCategory == '01'" label="发货人3：" :labelWidth="financeFormLabelWidth" prop="addresser3"  :rules="{ min: 1, max: 50, message: '长度不能超过 50 个字符',trigger:'change'}">
            <el-input type="text" v-model="addressInfo.addresser3" :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item  v-if="pageFilter.logisticsCategory == '02'" label="简称" :labelWidth="financeFormLabelWidth" prop="shortName"  :rules="{ min: 1, max: 50, message: '长度不能超过 50 个字符',trigger:'change'}">
            <el-input type="text" v-model="addressInfo.shortName" :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item  :label="pageFilter.logisticsCategory == '01'? '街道名称：' : '街道：'" :labelWidth="financeFormLabelWidth" prop="street" required :rules="{required:true,message:'不能为空',trigger:'change'}">
            <el-input type="text" v-model="addressInfo.street" :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item  v-if="pageFilter.logisticsCategory == '02'" label="组织：" :labelWidth="financeFormLabelWidth" prop="streetCode"  :rules="{ min: 1, max: 50, message: '长度不能超过 50 个字符',trigger:'change'}">
            <el-input type="text" v-model="addressInfo.streetCode" :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item  v-if="pageFilter.logisticsCategory == '01'" label="街道编码：" :labelWidth="financeFormLabelWidth" prop="streetCode" required :rules="{required:true,message:'不能为空',trigger:'change'}">
            <el-input type="text"  v-model="addressInfo.streetCode" :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item  label="地址信息：" :labelWidth="financeFormLabelWidth" prop="address" :rules="{min: 1, max: 50, message: '长度不能超过 50 个字符',trigger:'change'}">
            <el-input type="text"  v-model="addressInfo.address" :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item  label="城市：" :labelWidth="financeFormLabelWidth" prop="city" required :rules="{required:true,message:'不能为空',trigger:'change'}">
            <el-input type="text" v-model="addressInfo.city" :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item  v-if="pageFilter.logisticsCategory == '01'" label="州：" :labelWidth="financeFormLabelWidth" prop="state" :rules="{ min: 1, max: 50, message: '长度不能超过 50 个字符',trigger:'change'}">
            <el-input type="text" v-model="addressInfo.state"  :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item  label="邮编：" :labelWidth="financeFormLabelWidth" prop="postCode" :rules="[{required:true,message:'不能为空',trigger:'change'},{ min: 1, max: 20, message: '长度不能超过 20 个字符',trigger:'change'}]">
            <el-input type="number" min='0' v-model="addressInfo.postCode"  :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item  label="国家：" :labelWidth="financeFormLabelWidth" prop="nation" :rules="{message:'不能为空',trigger:'change'}">
            <country-select :select-value="addressInfo.nation" place-value="请选择国家" :is-disabled="dialogFlag.inputDisabled" @child-change-val="getCountry"></country-select>
          </el-form-item>
          <el-form-item  v-if="pageFilter.logisticsCategory == '01'" label="国家编码：" :labelWidth="financeFormLabelWidth" prop="nationCode" :rules="{ min: 1, max: 50, message: '长度不能超过 50 个字符',trigger:'change'}">
            <el-input type="text" v-model="addressInfo.nationCode" :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item  v-if="pageFilter.logisticsCategory == '02'" label="其他信息：" :labelWidth="financeFormLabelWidth" prop="nationCode" :rules="{ min: 1, max: 50, message: '长度不能超过 50 个字符',trigger:'change'}">
            <el-input type="text"v-model="addressInfo.nationCode"    :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item  label="邮箱：" :labelWidth="financeFormLabelWidth" prop="email" :rules="{ min: 1, max: 50, message: '长度不能超过 50 个字符',trigger:'change'}">
            <el-input type="text" v-model="addressInfo.email" :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item  label="电话/手机号码：" :labelWidth="financeFormLabelWidth" prop="tel" :required="false">
            <el-input type="text" v-model="addressInfo.tel"  :disabled="dialogFlag.inputDisabled"></el-input>
          </el-form-item>
          <el-form-item  label="RA：" prop="isReturnAddress" required  :rules="{required:true,message:'不能为空',type:'boolean',trigger:'change'}" :labelWidth="financeFormLabelWidth">
            <el-select v-model="addressInfo.isReturnAddress" filterable clearable placeholder="请选择仓库" size="small" style="width:100%" :disabled="dialogFlag.inputDisabled">
              <el-option v-for="item in RAoptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.infoDetail = false;" v-if="dialogFlag.inputDisabled == false">取消</el-button>
        <el-button type="primary" @click="updateSenderAddr('addressInfo');" v-if="dialogFlag.inputDisabled == false" :loading="$store.state.loading">确 定</el-button>
        <el-button @click="dialogFlag.infoDetail = false;" v-if="dialogFlag.inputDisabled == true">关闭</el-button>
      </div>
    </el-dialog>
    <!--筛选-->
    <div class="smallDia">
      <el-dialog title="筛选" :visible.sync="dialogFlag.isOpen" size="small" :close-on-click-modal="false" @close="pageFilter.firstAddresser = '';pageFilter.addresser2 = '';pageFilter.addresser3 = '';">
        <div class="data_body">
          <title-header></title-header>
          <text-input :select-value="pageFilter.firstAddresser" condition-name="发件人1" text-type="发件人1" @child-change-val="getTextInput"></text-input>
          <text-input :select-value="pageFilter.addresser2" condition-name="发件人2" text-type="发件人2" @child-change-val="getTextInput"></text-input>
          <text-input :select-value="pageFilter.addresser3" condition-name="发件人3" text-type="发件人3" @child-change-val="getTextInput"></text-input>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="pageFilter.firstAddresser = '';pageFilter.addresser2 = '';pageFilter.addresser3 = '';">清除条件</el-button>
          <el-button @click="getSenderAddressList()">筛 选</el-button>
          <el-button @click="dialogFlag.isOpen = false;">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import titleHeader from "../../components/ScreenModular/title.vue"
  import countrySelect from '../../components/listData/getCountryList.vue'
  import textInput from '../../components/ScreenModular/textInput.vue'
  export default{
    components: {titleHeader,textInput,countrySelect},
    data(){
      var validateTel = (rule, value, callback) => {
          if(value != ''){
            if (!/^\d+$/.test(value)) {
              callback(new Error('请输入数字'));
            }else if(value.length>20){
              callback(new Error('不能超过20位'));
            }else{
              callback();
            }
          }else {
            callback();
          }
      }
      return {
        RAoptions:[{value:true,label:'是'},{value:false,label:'否'}],
        activeNames:['1'],
        addressInfo:{
          firstAddresser:'',
          addresser2:'',
          addresser3:'',
          street:'',
          streetCode:'',
          address:'',
          city:'',
          state:'',
          nation:'',
          nationCode:'',
          email:'',
          tel:'',
          isReturnAddress:false,
          shortName:'',   /*  英国字段*/
          logisticsCategory:'',
        },
        notionOptions:[],
        senderAddressData:[],
        pageFilter:{
          currentPage:1,
          pageSize:10,
          firstAddresser:'',
          addresser2:'',
          addresser3:'',
          warehouse:'',
          logisticsCategory:'01',
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
        financeFormLabelWidth:'100px',
        sels:[],
        warehouseList:[],
        rules:{
          tel: [
            { validator: validateTel, trigger: 'change' }
          ],
        },
        ButtonInfo:{},//按钮权限列表20171227

      }
    },
    mounted () {
        this.getauthorityList();
        this.getSenderAddressList();
        this.getWarehouseList();
    },
    methods: {

      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      selsChange: function (sels) {
        this.sels = sels.map(item =>item.addressId);
      },
      getWarehouseList:function(){
        this.httpPost('addresser/selectWarehouseName').then(res =>{
          if(res.data.result == true){
              this.warehouseList = res.data.params.list;
          }
        })
      },
      getSenderAddressList:function(){
        this.httpPost('addresser/select',this.pageFilter).then(res => {
            if(res.data.result == true){
              const pageData = res.data.params.list;
              this.page = pageData;
              this.senderAddressData = pageData.listData;
              this.dialogFlag.isOpen = false;
            }else{
              this.senderAddressData = [];
            }
        })
      },
      showInfoDialog(row){
        this.httpPost('addresser/selectAddresserData',{addressId:row.addressId}).then(res =>{
          this.addressInfo = res.data.params.model;
          this.dialogFlag.infoDetail = true;
        })
      },
      updateSenderAddr:function(formName){
         var url = this.dialogFlag.dialogTitle == '新建地址' ? 'addresser/add' : 'addresser/update';
         this.addressInfo.logisticsCategory = this.pageFilter.logisticsCategory;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.httpPost(url,this.addressInfo).then(res =>{
              if(res.data.result == true){
                this.$message(res.data.message);
                this.dialogFlag.infoDetail = false;
                this.getSenderAddressList();
              }else{
                this.$message(res.data.message);
              }
            })
          }else{
            return false;
          }
         });
      },
      deleteSenderAddr:function(row,sels){
        var vm = this;
        var addressId = sels != '' ? sels : [row.addressId];
        addressId == '' ? vm.tips() : vm.doItem('您确定删除此发货人地址？','addresser/delect',{addresserId:addressId},vm.getSenderAddressList);
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = '1';
        this.getSenderAddressList();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getSenderAddressList();
      },
      getTextInput:function(val){
        val.type == '发件人1'? this.pageFilter.firstAddresser = val.value :  val.type == '发件人2'? this.pageFilter.addresser2 = val.value :this.pageFilter.addresser3 = val.value;
      },
      getCountry:function(val){
        this.addressInfo.nation = val.value;
      },
      closeDialog:function(formName){
        this.openAdd();
        this.$refs[formName].resetFields();
      },
      openAdd(){
          var obj={};
        for (var item in this.addressInfo) {
          this.$set(obj,item,'');
        }
        this.addressInfo = obj;
        console.log(this.addressInfo);
      }
    }
  }
</script>
<style scoped>
</style>

<template>
  <div id="outermost_wrap">
    <div id="sub_wrap">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap">
      <el-row  id="filer">
        <el-row class="filterOption" id="filterOption" >
          <el-col :span="6" class="optionValue">
            <el-input v-model="pagefilters.accountNo" placeholder="请输入账号名称" size="small"></el-input>
          </el-col>
          <el-col :span="1">
            <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="getmarkList();">搜索</el-button>
          </el-col>
        </el-row>
        <el-collapse v-model="activeNames" class="marginBottom">
          <el-collapse-item name="1">
            <el-col class="marginBottom">
              <span class="span_label">渠道</span>
              <el-radio-group size="small" @change="getmarkList" v-model="pagefilters.channelId">
                <el-radio-button :label="item.channelId"  :value="item.channelId" v-for="item in Channeloption">{{item.channelName}}</el-radio-button>
<!--
                <el-radio-button label="01">亚马逊</el-radio-button>
                <el-radio-button label="02">eBay</el-radio-button>
                <el-radio-button label="03">速卖通</el-radio-button>-->
              </el-radio-group>
            </el-col>
            <el-col class="marginBottom">
              <span class="span_label">状态</span>
              <el-radio-group size="small" @change="getmarkList" v-model="pagefilters.isUse">
                <el-radio-button label="">全部</el-radio-button>
                <el-radio-button label="1">启用中</el-radio-button>
                <el-radio-button label="0">已停用</el-radio-button>
              </el-radio-group>
            </el-col>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <el-row class="supplier_btn">
        <el-button size="small" @click="dialogFlag.isopen=true;dialogFlag.Disabled=false;dialogFlag.title='添加';userFlag=true;salesData=[];" type="primary">添加</el-button>
        <el-button size="small" @click="importData.isOpen = !importData.isOpen;" type="primary">导入账号</el-button>
      </el-row>
      <el-row class="supplier_btn last_btn" v-if="pagefilters.platform=='02'">
        <el-button size="small" @click="dialogFlag.isopen=true;dialogFlag.Disabled=false;dialogFlag.title='添加';" type="primary">更新秘钥</el-button>
      </el-row>
      <div id="item_list">
        <el-table :data="amazonData"  v-if="pagefilters.channelId=='01'" ref="amazonData" border tooltip-effect="dark" @selection-change="batchChange"
                  style="width:100%;">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column id="space" label="操作" align="center">
            <template scope="scope">
              <el-tooltip content="查看" effect="dark" placement="bottom">
                <i class="iconfontyyy" @click="dialogFlag.title='查看';dialogFlag.Disabled=true;openDialog(scope.row);"
                   content="Bottom center">&#xe600;</i>
              </el-tooltip>
              <el-tooltip content="编辑" effect="dark" placement="bottom">
                <i class="iconfontyyy" @click="dialogFlag.title='编辑';dialogFlag.Disabled=false;openDialog(scope.row);"
                   content="Bottom center">&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip content="停用" effect="dark" placement="bottom" v-if="scope.row.isUse==true">
                <i class="iconfontyyy" @click="settingid(scope.row);"
                   content="Bottom center">&#xe620;</i>
              </el-tooltip>
              <el-tooltip content="启用" effect="dark" placement="bottom" v-if="scope.row.isUse==false">
                <i class="iconfontyyy" @click="settingid(scope.row);"
                   content="Bottom center">&#xe618;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="代码" prop="prefixCode" align="center" sortable></el-table-column>
          <el-table-column label="账号" prop="accountNo" align="center" sortable></el-table-column>
          <el-table-column label="站点" prop="countryName" align="center" sortable></el-table-column>
          <el-table-column label="merchant_id" prop="merchantId" align="center" sortable></el-table-column>
          <el-table-column label="aws_access_key_id" prop="accessKey" align="center" sortable>
          </el-table-column>
          <el-table-column label="aws_secret_access_key" prop="secretKey"   align="center" sortable>
          </el-table-column>
          <el-table-column label="mws_auth_token" prop="accessToken"   width="280"  align="center" sortable>
          </el-table-column>
        </el-table>
        <el-table :data="eBayData" v-if="pagefilters.channelId=='02'"  ref="eBayData" border tooltip-effect="dark" @selection-change="batchChange"
                  style="width:100%;">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column id="space" label="操作" align="center">
            <template scope="scope">
              <el-tooltip content="查看" effect="dark" placement="bottom">
                <i class="iconfontyyy" @click="dialogFlag.title='查看';dialogFlag.Disabled=true;openDialog(scope.row);"
                   content="Bottom center">&#xe600;</i>
              </el-tooltip>
              <el-tooltip content="编辑" effect="dark" placement="bottom">
                <i class="iconfontyyy" @click="dialogFlag.title='编辑';dialogFlag.Disabled=false;openDialog(scope.row);"
                   content="Bottom center">&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip content="停用" effect="dark" placement="bottom" v-if="scope.row.isUse==true">
                <i class="iconfontyyy" @click="settingid(scope.row);"
                   content="Bottom center">&#xe620;</i>
              </el-tooltip>
              <el-tooltip content="启用" effect="dark" placement="bottom" v-if="scope.row.isUse==false">
                <i class="iconfontyyy" @click="settingid(scope.row);"
                   content="Bottom center">&#xe618;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="代码" prop="prefixCode" align="center" sortable></el-table-column>
          <el-table-column label="eBay name" prop="userNo" align="center" sortable></el-table-column>
          <el-table-column label="eBay eMail" prop="userEmail" align="center" sortable></el-table-column>
          <el-table-column label="eBay store title" prop="shopTitle" align="center" sortable></el-table-column>
          <el-table-column label="店铺地址" prop="shopUrl" align="center" sortable>
          </el-table-column>
          <el-table-column label="hard expiration time" prop="tokenExpiredTime"   align="center" sortable>
          </el-table-column>
          <el-table-column label="最新订单同步时间" prop="" :formatter="tool.formatDate"  width="280"  align="center" sortable>
          </el-table-column>
        </el-table>
        <el-table :data="xpressData"  v-if="pagefilters.channelId=='03'" ref="xpressData" border tooltip-effect="dark" @selection-change="batchChange" style="width:100%;">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column id="space" label="操作" align="center">
            <template scope="scope">
              <el-tooltip content="查看" effect="dark" placement="bottom">
                <i class="iconfontyyy" @click="dialogFlag.title='查看';dialogFlag.Disabled=true;openDialog(scope.row);"
                   content="Bottom center">&#xe600;</i>
              </el-tooltip>
              <el-tooltip content="编辑" effect="dark" placement="bottom">
                <i class="iconfontyyy" @click="dialogFlag.title='编辑';dialogFlag.Disabled=false;openDialog(scope.row);"
                   content="Bottom center">&#xe6e5;</i>
              </el-tooltip>
              <el-tooltip content="停用" effect="dark" placement="bottom" v-if="scope.row.isUse==true">
                <i class="iconfontyyy" @click="settingid(scope.row);"
                   content="Bottom center">&#xe620;</i>
              </el-tooltip>
              <el-tooltip content="启用" effect="dark" placement="bottom" v-if="scope.row.isUse==false">
                <i class="iconfontyyy" @click="settingid(scope.row);"
                   content="Bottom center">&#xe618;</i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="代码" prop="prefixCode" align="center" sortable></el-table-column>
          <el-table-column label="阿里账号" prop="accountNo" align="center" sortable></el-table-column>
          <el-table-column label="key" prop="apiKey" align="center" sortable></el-table-column>
          <el-table-column label="sign" prop="apiSign" align="center" sortable></el-table-column>
          <el-table-column label="gov name" prop="govName" align="center" sortable>
          </el-table-column>
          <el-table-column label="accesstoken" prop="accessToken"   align="center" sortable>
          </el-table-column>
          <el-table-column label="ccess_code" prop="accessCode"   width="280"  align="center" sortable>
          </el-table-column>
          <el-table-column label="添加时间" prop="addTime"  :formatter="tool.formatDate"  width="280"  align="center" sortable>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!------------------------------------ ------查看/编辑/新增--------------------------------------->
    <el-dialog :title="dialogFlag.title" :visible.sync="dialogFlag.isopen" size="small" @close="resetForm" @open="openForm" :close-on-click-modal="false">
      <el-form :model="Form" labelWidth="150px"  ref="Form" :rules="rules">
        <el-form-item label="订单前缀" prop="prefixCode"  :rules="{ required: true, message: '请输入订单前缀！', trigger: 'blur'}">
          <el-input type="text"  :disabled="dialogFlag.Disabled" v-model="Form.prefixCode" placeholder="请输入不超过10位英文字符，不能单独使用字母P或M，但可包含P或M。"></el-input>
        </el-form-item>
        <el-form-item :label="pagefilters.channelId=='01'?'账户名称':pagefilters.channelId=='02'?'eBay账户名称':'速卖通登录用户名'" prop="accountNo"
                      :rules="[{ required: true, message: '请输入账户名称！', trigger: 'blur'},{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}]">
          <el-input type="text"  :disabled="dialogFlag.Disabled" v-model="Form.accountNo"></el-input>
        </el-form-item>
        <el-col v-if="pagefilters.channelId=='02' &&  dialogFlag.Disabled==true">
          <el-form-item label="eBay邮箱" prop="userEmail">
            {{eBayForm.userEmail}}
          </el-form-item>
          <el-form-item label="title" prop="userEmail">
            {{eBayForm.shopTitle}}
          </el-form-item>
          <el-form-item label="店铺地址" prop="shopUrl">
            {{eBayForm.shopUrl}}
          </el-form-item>
          <el-form-item label="ebay_atuh_token" prop="accessToken">
            {{eBayForm.accessToken}}
          </el-form-item>
          <el-form-item label="hard time" prop="tokenExpiredTime">
            {{eBayForm.tokenExpiredTime}}
          </el-form-item>
          <el-form-item label="最新订单同步时间" prop="">
          </el-form-item>
        </el-col>
        <el-col v-if="pagefilters.channelId=='03' &&  dialogFlag.Disabled==true">
          <el-form-item label="key" prop="apiKey">
            {{expreeForm.apiKey}}
          </el-form-item>
          <el-form-item label="sign" prop="apiSign">
            {{expreeForm.apiSign}}
          </el-form-item>
          <el-form-item label="gov name" prop="govName">
            {{expreeForm.govName}}
          </el-form-item>
          <el-form-item label="accesstoken" prop="accessToken">
            {{expreeForm.accessToken}}
          </el-form-item>
          <el-form-item label="access code" prop="accessCode">
            {{expreeForm.accessCode}}
          </el-form-item>
          <el-form-item label="refreshtoken" prop="addTime">
            {{tool.formatDate('','',Form.addTime)}}
          </el-form-item>
        </el-col>
        <el-form-item  label="在售站点" prop="countryNo" class="dialogSelect" >
         <Country  v-if="dialogFlag.title=='添加'" :isMultiple="true" :isDisabled="dialogFlag.Disabled" :selectValue="sites" @child-change-val="childCountryValue"></Country>
          <Country v-if="dialogFlag.title!='添加'" :isMultiple="false" :isDisabled="dialogFlag.Disabled" :selectValue="countryNo" @child-change-val="childCountryValue"></Country>
        </el-form-item>
        <el-form-item  label="销售人员" prop="salesUserId" class="dialogSelect" :rules="[{ required: true, message: '请选择销售人员！', trigger: 'blur'}]">
         <personnelList :selectValue="Form.salesUserId" @child-change-val="getAllpersonnel" :isDisabled="dialogFlag.Disabled"> </personnelList>
        </el-form-item>
        <el-col v-if="dialogFlag.Disabled==false">
          <el-form-item  label="仓库" prop="whId" class="dialogSelect" :rules="[{ required: true, message: '请选择仓库！', trigger: 'blur'}]">
            <el-select  clearable :allow-create="true" v-model="Form.whId"  :disabled="dialogFlag.Disabled">
              <el-option v-for="item in houseOptions" :key="item.whId" :label="item.whName"
                         :value="item.whId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label="分配站点权限" prop="" class="dialogSelect"  >
            <span class="Astyel" style="text-align: left;margin-left: 5px;" @click="dialogFlag.roleisopen=true;">分配站点权限</span>
          </el-form-item>
          <el-col v-if="pagefilters.channelId=='01'">
            <el-form-item label="Merchant ID" labelWidth="170px"  prop="merchantId"  :rules="[{ required: true, message: '请输入字段！', trigger: 'blur'}]">
              <el-input type="text"  v-model="Form.merchantId" :disabled="dialogFlag.Disabled"></el-input>
            </el-form-item>
            <el-form-item  prop="accessCode" label="Developer account identifier and credentials for developer account number" labelWidth="300px"  :rules="[{ required: true, message: '请输入字段！', trigger: 'blur'}]" >
              <el-input type="text" v-model="Form.accessCode"  :disabled="dialogFlag.Disabled"></el-input>
            </el-form-item>
            <el-form-item  prop="accessKey" label="AWS Access Key ID" labelWidth="170px"  :rules="[{ required: true, message: '请输入字段！', trigger: 'blur'}]">
              <el-input type="text"  v-model="Form.accessKey" :disabled="dialogFlag.Disabled"></el-input>
            </el-form-item>
            <el-form-item  prop="secretKey" label="Secret Key" labelWidth="170px"  :rules="[{ required: true, message: '请输入字段！', trigger: 'blur'}]">
              <el-input type="text"  v-model="Form.secretKey" :disabled="dialogFlag.Disabled"></el-input>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col v-if="dialogFlag.Disabled==true">
          <el-form-item  prop="users" label="分配站点权限" labelWidth="170px" required>
           <span v-for="item in Form.users" style="margin-right: 7px">{{item.userName}}({{item.userNo}})</span>
         <!--   <el-checkbox-group class="grounpMl" v-model="userIds" >
              <el-checkbox v-for="city in salesData" :label="city.userId" :key="city.userId">{{city.userName}}</el-checkbox>
            </el-checkbox-group>-->
          </el-form-item>
          <el-form-item  prop="isUse" label="状态" labelWidth="170px" required>
           {{Form.isUse==true?'启用':'停用'}}
          </el-form-item>
          <el-form-item  prop="addUser" label="添加人" labelWidth="170px" required>
            {{Form.addUser}}
          </el-form-item>
          <el-form-item  prop="addTime" label="添加时间" labelWidth="170px" required>
            {{tool.formatDate('','',Form.addTime)}}
          </el-form-item>
        </el-col>
        <el-col v-if="pagefilters.channelId=='03' && dialogFlag.title=='添加'">
        <el-form-item label="说明：" prop="" >

            第一步:<br>
            输入速卖通账号，发起授权请求<br>
            第二步：<br>
            登录速卖通系统，本页面直接访问速卖通官网授权页面，并非通途本地页面，本系统无法知晓您的密码，请放心使用。

        </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.isopen=false;" v-if="dialogFlag.Disabled==true" >关 闭</el-button>
        <el-button @click="dialogFlag.isopen=false;" v-if="dialogFlag.Disabled==false">取 消</el-button>
        <el-button type="primary" @click="submitFormEbay " v-if="dialogFlag.Disabled==false" >保 存</el-button>
      </div>
    </el-dialog>
    <!------------------------------------eBay/速卖通 ------分配站点权限--------------------------------------->
    <el-dialog title="站点分配" :visible.sync="dialogFlag.roleisopen" size="small"
               :close-on-click-modal="false">
      <el-form labelWidth="50px" :model="roleForm" ref="roleForm">
        <el-form-item label="" prop="">
          <el-col v-for="(item,index) in deptList" :key="item">
            <el-col v-if="item.sysDeptDataList!=[] && item.sysDeptDataList.length>0">
              <el-col>{{item.deptName}}</el-col>
              <el-col style="margin-left:55px" v-for="(info,index) in item.sysDeptDataList" :key="info.deptId">
                <el-radio  :label="info.deptId" v-model="deptIdds" :value="info.deptId">{{info.deptName}}</el-radio>
                <el-checkbox-group class="grounpMl" v-model="userIds" v-if="checkboxIndex==info.deptId">
                  <el-checkbox v-for="city in salesData" :label="city.userId" :key="city.userId">{{city.userName}}</el-checkbox>
                </el-checkbox-group>
              </el-col>
            </el-col>
            <el-col  v-if="item.sysDeptDataList.length==0">
              <el-radio  :label="item.deptId" v-model="deptIdds" :value="item.deptId">{{item.deptName}}</el-radio>
              <el-checkbox-group class="grounpMl" v-model="userIds" v-if="checkboxIndex==item.deptId">
                <el-checkbox v-for="city in salesData" :label="city.userId" :key="city.userId">{{city.userName}}</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFlag.roleisopen=false;" v-if="dialogFlag.Disabled==true" >关 闭</el-button>
        <el-button @click="dialogFlag.roleisopen=false;" v-if="dialogFlag.Disabled==false">取 消</el-button>
        <el-button type="primary" @click="submitFormUserids" v-if="dialogFlag.Disabled==false" >保 存</el-button>
      </div>
    </el-dialog>
    <!------------------导入手工订单 弹出框--------------------------->
    <import-dialog  :is-open="importData.isOpen" :import-url="importData.importUrl" :modal-url="importData.modalUrl" @getData="getmarkList"></import-dialog>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage"
                     :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
  </div>
</template>
<script>
  import Country from 'components/listData/getCountryList.vue'
  import personnelList from 'components/listData/GetAllpersonnelList.vue'
  import ElRadio from "../../../node_modules/element-ui/packages/radio/src/radio";
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import importDialog from '../../components/importData/importDialog.vue'


  export default{
    components: {
      ElButton,
      ElRadio,
      Country,
      importDialog,personnelList},

    data(){

      let name = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入该字段'));
        } else if(!/^[A-Za-z]{1,10}$/.test(value)){
          callback(new Error('请输入不超过10位英文字符!'));
        }
        else if(!/(p.*m)|(m.*p)/gi.test(value)){
          callback(new Error('不能单独使用字母P或M，但可包含P或M!'));
        } else {
          callback();
        }
      };
      return {
        importData:{  // /新建手工订单 子组件传参
          importUrl:'shopAccount/importShopAccount',
          modalUrl:'shopAccount/templateExport',
          isOpen:false,
        },
        countryNo:'',
        sites:[],
        checkboxIndex:'',
        deptIdds:'',
        userIds:[],
        userFlag:false,
        salesData:[],
        deptList:[],
        salesOptions:[],
        houseOptions:[],
        Channeloption:[],
        rules:{
          aa:[ { validator: name, trigger: 'blur', required: true } ]
        },
        activeNames: ['1'],
        dialogFlag: {
          isopen: false,
          title: '',
          Disabled:false,
          roleisopen:false
        },
        Options: [
          {label: '1', value: '1'},
          {label: '1', value: '1'},
          {label: '1', value: '1'},
        ],
        amazonData: [],
        eBayData:[],
        xpressData:[],
        eBayForm:{
          userEmail:'',
          shopTitle:'',
          shopUrl:'',
          accessToken:'',
          tokenExpiredTime:'',
        },
        expreeForm:{
          apiKey:'',
          apiSign:'',
          govName:'',
          accessToken:'',
          accessCode:''
        },
        Form: {
          shopAccountId:'',
          accountId:'',
          channelId:'',
          prefixCode:'',
          accountNo:'',
          merchantId:'',
          accessCode:'',
          accessKey:'',
          secretKey:'',
          salesUserId:'',
          sites:[],
          whId:'',
          deptId:'',
          users:[],
          userIds:[],
        },
        //分页得到的数据集合
        page: {
          currentPage: 1, //当前页数
          pageSize: 10, //每页条数
          totalCount: 0, //总共条数
          totalPage: 0, //总共页数
        },
        roleForm:{
        	aa:'',
          bb:['1','2','3']
        },
        //过滤返回数据
        pagefilters: {
          channelId:'01',
          isUse: '',
          accountNo: '',
          currentPage: 1,
          pageSize: 10,
        },
      }
    },
    mounted: function () {
      this.getChannel();
      this.getmarkList();
    },
    watch:{
      'deptIdds':{
        handler(val){
        	if(this.userFlag==true){  this.userIds=[];}
          this.changeDept(val);
          this.userFlag=true;
        },
        deep: true
      }
    },
    methods: {
      getAllpersonnel(val){
      	this.Form.salesUserId=val.value;
      },
      changeDept(val){
        this.httpPost('deptManager/selectDeptUserList',{deptId:val,pageSize:1000}).then(res=>{
        	if( res.data.params.deptUserList.listData!=[] && res.data.params.deptUserList.listData.length>0){
            this.salesData=res.data.params.deptUserList.listData;
            this.checkboxIndex=this.salesData[0].deptId;
            //alert(this.checkboxIndex)
          }else{
            this.salesData=[];
            this.checkboxIndex='';
          }
        })
      },
    	openForm(){
        this.gethouseOptions();
        this.getsalesOptions();
        this.getdeptManager();
        this.sites=[];
      },
    	getdeptManager(){
    		this.httpPost('deptManager/selectDeptList',{isUse:''}).then(res=>{
         this.deptList=res.data.params.deptList;
          console.log('000% 0', this.deptList)

        })
      },
    	getsalesOptions(){
    		this.httpGet('product/loadFilterConditionSalesUser').then(res=>{
    			this.salesOptions=res.data;
        })
      },
      gethouseOptions(){
      	this.httpGet('warehouse/selectAllWarehouse').then(res=>{
      		if(res.data!=[]){
            this.houseOptions=res.data;
          }
        })
      },
      childCountryValue(val){
        if(this.dialogFlag.title=='添加'){   this.sites=val.value;}else{
        	this.countryNo=val.value;
        }
      },
      //渠道平台
      getChannel(){
        this.httpGet('/dictChannel/selectList','','scm').then(res=>{
          if(res.data!=[] && res.data.length>1){
            this.Channeloption=res.data;
          }
        })
      },
      resetForm() {
        this.$refs['Form'].resetFields();
        this.deptIdds='';
        this.userIds=[];
        this.countryNo='';
        this.sites=[];
        this.salesData=[];
        this.Form.whId='';
        this.Form.merchantId='';
        this.Form.accessCode='';
        this.Form.accessKey='';
        this.Form.secretKey='';
        this.Form.shopAccountId='';
        this.Form.accountId='';

      },
      submitFormUserids(){
        console.log('ddd%0',this.deptIdds)
        console.log('ddd  77777%0',this.userIds)
        this.Form.deptId=this.deptIdds;
        this.Form.userIds=this.userIds;
        if( this.Form.deptId==''  ){
        	this.$message('请至少选择一个部门！')
        } else if(this.userIds.length==0 || this.userIds==[]) {
        	this.$message('请至少选择一个成员！')
        }
        else{
          this.dialogFlag.roleisopen=false;
        }
      },
      submitFormEbay(){
        console.log('5555 % 0',this.Form)
        this.Form.sites=[];
        if(this.Form.users){
          delete this.Form.users
        }
        if(this.dialogFlag.title=='添加'){this.Form.sites=this.sites}else{this.Form.sites.push(this.countryNo);}
        this.Form.channelId=this.pagefilters.channelId;
        this.$refs['Form'].validate((valid) => {
            if (valid) {
            	console.log('rrr % 0',this.Form.sites)
            	if(this.Form.sites==[]  || this.Form.sites.length<1){
            		this.$message('请选择站点！')
              }else if( this.deptIdds=='' || this.userIds==[]){
                this.$message('请分配权限！')
              }else{
                this.httpPost('accountManage/add',this.Form).then(res=>{
                  this.$message(res.data.message)
                  if(res.data.result==true){
                    this.dialogFlag.isopen=false;
                    this.getmarkList();
                  }
                })
              }

            }})
      },
      settingid(row){
        let vm=this,msg='',obj={};
        msg=row.isUse==true?'您确定停用此账号？':'您确定启用此账号？';
        obj.shopAccountId=row.shopAccountId;
        obj.accountId=row.accountId;
        obj.channelId=this.pagefilters.channelId;
        obj.countryNo=row.countryNo;
        obj.isUse=!row.isUse;
        vm.doItem(msg,'accountManage/editState',obj,vm.getmarkList);
      },
      openDialog(val){
        this.dialogFlag.isopen=true;
        this.openForm();
        this.httpGet('accountManage/query?shopAccountId='+val.shopAccountId+'&accountId='+val.accountId+'&channelId='+this.pagefilters.channelId+'&countryNo='+val.countryNo,'','rms').then(res=>{
        	if(res.data!='' && res.data!=null){
        		this.Form=res.data;
        		console.log('rrr % 0',this.Form)
        		if(res.data.deptId){
              this.deptIdds=res.data.deptId;
              this.userFlag=false;
            }
            if(res.data.userIds){
              this.userIds=res.data.userIds;
              this.userFlag=false;
            }
            this.countryNo=res.data.countryNo;
            if(this.pagefilters.channelId=='02' && this.dialogFlag.Disabled==true){
              this.eBayForm.userEmail=res.data.userEmail;
              this.eBayForm.shopTitle=res.data.shopTitle;
              this.eBayForm.shopUrl=res.data.shopUrl;
              this.eBayForm.accessKey=res.data.accessToken;
              this.eBayForm.tokenExpiredTime=res.data.tokenExpiredTime;
            }
            if(this.pagefilters.channelId=='03' && this.dialogFlag.Disabled==true){
              this.expreeForm.apiKey=res.dat.apiKey;
              this.expreeForm.apiSign=res.dat.apiSign;
              this.expreeForm.govName=res.dat.govName;
              this.expreeForm.accessKey=res.dat.accessToken;
              this.expreeForm.accessCode=res.dat.accessCode;
            }
          }
        })
      },
      getmarkList(){
        this.httpPost('accountManage/list',this.pagefilters,'rms').then(res=>{
        	if(this.pagefilters.channelId=='01'){
            this.amazonData=res.data.listData;
          }else if(this.pagefilters.channelId=='02'){
            this.eBayData=res.data.listData;
          }else if(this.pagefilters.channelId=='03'){
            this.xpressData=res.data.listData;
          }
          this.page=res.data;
          this.userFlag=false;
        })
      },
      batchChange(){

      },
      //分页
      changePageSize: function (val) {
        this.pagefilters.pageSize = val;
        this.pagefilters.currentPage = 1;
        this.getmarkList();
      },
      changeCurrentPage: function (val) {
        this.pagefilters.currentPage = val;
        this.getmarkList();
      },

    }
  }

</script>

<style scoped>
.Amazonitem .el-form-item{
  margin-bottom: 10px;
}
.Amazonitem .el-form-item:first-child{
  margin-top:10px;
}
.Amazonitem  .el-form-item .el-form-item__label{
    text-align: left!important;
  }
div.grounpMl .el-checkbox:first-child{
   margin-left: 15px;
  }
</style>

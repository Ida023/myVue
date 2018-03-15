<template>
    <div id="outermost_wrap">
        <div id="sub_wrap">
            <CrumbsNav></CrumbsNav>
        </div>
        <div id="content_wrap">
          <el-row class="filterOption" id="filterOption" >
            <el-col :span="6" class="optionValue">
              <el-input v-model="pagefilters.orderId" placeholder="请输入采购订单编号" size="small"></el-input>
            </el-col>
            <el-col :span="1">
              <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="pagefilters.isBounded='';status=false;getRequirementList();">搜索</el-button>
            </el-col>
          </el-row>
            <el-row  id="filer">
                <el-collapse v-model="activeNames" class="marginBottom">
                    <el-collapse-item name="1">
                        <el-col class="marginBottom">
                            <span class="span_label">类型</span>
                            <el-radio-group size="small" @change="changeisBounded" v-model="pagefilters.isBounded">
                                <el-radio-button label="">全部</el-radio-button>
                                <el-radio-button label='true'>已认领</el-radio-button>
                                <el-radio-button label='false'>未认领</el-radio-button>
                            </el-radio-group>
                        </el-col>
                    </el-collapse-item>
                </el-collapse>
            </el-row>
          <el-row class="supplier_btn">
            <el-button size="small" @click="dialogFlag.title='新建银行转账';openDialog('');" type="primary">新建银行转账</el-button>
            <el-button size="small" @click="dialogFlag.screeisopen=true;" type="primary">筛选</el-button>
            <el-button size="small" @click="dialogFlag.isOpenLead=true" type="primary">批量导入</el-button>
          </el-row>
            <div id="item_list">
                <el-table :data="Data" ref="Data" border tooltip-effect="dark" @selection-change="batchChange"
                          style="width:100%;">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column id="space" label="操作" align="center">
                        <template scope="scope">
                            <el-tooltip content="查看" effect="dark" placement="bottom">
                                <i class="iconfontyyy" @click="dialogFlag.title='查看银行转账';openDialog(scope.row);"
                                   content="Bottom center">&#xe600;</i>
                            </el-tooltip>
                            <el-tooltip content="编辑" effect="dark" placement="bottom">
                                <i class="iconfontyyy" @click="dialogFlag.title='编辑银行转账';openDialog(scope.row);"
                                   content="Bottom center">&#xe6e5;</i>
                            </el-tooltip>
                          <el-tooltip content="删除银行转账记录" effect="dark" placement="bottom">
                            <i class="iconfontyyy" @click="deleteBank(scope.row);"
                               content="Bottom center">&#xe6f7;</i>
                          </el-tooltip>
                          <el-tooltip content="认领付款创建手工订单" effect="dark" placement="bottom" v-if="scope.row.isBounded==false">
                            <i class="iconfontyyy" @click="addcopyOrder(scope.row);"
                               content="Bottom center">&#xe63e;</i>
                          </el-tooltip>
                          <el-tooltip content="解除绑定" effect="dark" placement="bottom">
                            <i class="iconfontyyy" @click="UnbindBank(scope.row);"
                               content="Bottom center">&#xe665;</i>
                          </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="交易ID" prop="flowId" align="center" sortable></el-table-column>
                  <el-table-column label="银行" prop="bankType" align="center" sortable>
                    <template scope="scope">
                      <span >{{scope.row.bankType =='0'?'德国企业账号':'Noris银行'}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="付款金额" prop="amount" align="center" sortable></el-table-column>
                  <el-table-column label="币种" prop="currencyId" align="center" sortable></el-table-column>
                  <el-table-column label="付款日期" prop="payTime" width="180" :formatter="tool.formatDate" align="center"
                                   sortable>
                  </el-table-column>
                  <el-table-column label="关联订单" prop="orderId" align="center" sortable></el-table-column>
                    <el-table-column label="转账备注" prop="payMemo" align="center" sortable></el-table-column>
                    <el-table-column label="导入人" prop="addUser" align="center" sortable></el-table-column>
                    <el-table-column label="导入时间" prop="addTime" width="180" :formatter="tool.formatDate" align="center"
                                     sortable>
                    </el-table-column>
                </el-table>
            </div>
        </div>
      <!------------------------------------筛选--------------------------------------->
      <el-dialog   title="筛选" :visible.sync="dialogFlag.screeisopen" size="small" @close="screenReset"  :close-on-click-modal="false">
        <div class="data_body">
          <title-header></title-header>
          <select-input conditionName="银行" :optionsData="bankOptions" :selectValue="pagefilters.bankType" @child-change-val="getSelectValue"></select-input>
          <text-input   condition-name="付款金额"  @child-change-val="getChildren"  :selectValue="pagefilters.amount" text-type="付款金额" ></text-input>
          <el-row class="row">
            <el-col class="col" :span="4">付款币种</el-col><el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16">
              <Country     :selectValue="pagefilters.currencyId"    @child-change-Val="changeCurrency"  selectType="付款币种"></Country>
            </el-col>
          </el-row>
          <time-data   :start-time="pagefilters.initialTime" condition-name="付款日期" :end-time="pagefilters.overTime" @child-value-Stime="getTime" @child-value-Etime="getTime" ></time-data>
          <text-input   condition-name="关联订单"  @child-change-val="getChildren"  :selectValue="orderId" text-type="关联订单" ></text-input>
          <el-row class="row">
            <el-col class="col" :span="4">关联操作人</el-col><el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16">
              <personnel     :selectValue="pagefilters.boundedUser"    @child-change-val="changeboundedUser"></personnel>
            </el-col>
          </el-row>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button  @click="screenReset">清除筛选</el-button>
          <el-button  @click="screenList">筛 选</el-button>
          <el-button @click="dialogFlag.screeisopen=false;">取 消</el-button>
        </div>
      </el-dialog>

      <!------------------------------------查看/编辑/新增--------------------------------------->
        <el-dialog :title="dialogFlag.title" :visible.sync="dialogFlag.isopen" size="small" @close="resetForm"
                   :close-on-click-modal="false">
            <el-form labelWidth="170px" :model="Form" ref="Form">
                <el-form-item label="交款银行" prop="bankType"  :rules="[{ required: true, message: '请选择交款银行！', trigger: 'blur'}]" >
                  <el-radio-group v-model="Form.bankType" :disabled="dialogFlag.disabled">
                    <el-radio label="0">德国企业账号</el-radio>
                    <el-radio label="1">Noris银行</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="付款日期" prop="payTime" >
                  <span v-if="dialogFlag.disabled == true">{{Form.payTime}}</span>
                  <el-date-picker
                    v-if="dialogFlag.disabled == false"
                    v-model="Form.payTime"
                    type="date"
                    placeholder="选择日期"
                    >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="计息日（value date）" prop="interestDate"   >
                  <span v-if="dialogFlag.disabled==true">{{Form.interestDate}}</span>
                  <el-date-picker  v-if="dialogFlag.disabled==false"
                    v-model="Form.interestDate"
                    type="date"
                    placeholder="选择日期"
                    >
                  </el-date-picker>
                </el-form-item>
                  <el-form-item label="付款金额" prop="amount" :rules="[{ required: true, message: '请输入付款金额！', trigger: 'blur'},{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}]">
                    <span v-if="dialogFlag.disabled==true">{{Form.amount}}</span>
                    <el-input v-if="dialogFlag.disabled==false" type="text" v-model="Form.amount"></el-input>
                  </el-form-item>
                  <el-form-item label="交易类型：" prop="tradingType" class="isBounded" :rules="[{ required: true, message: '请选择交易类型！', trigger: 'blur'}]">
<!--
                    <span v-if="dialogFlag.disabled==true">{{Form.tradingType}}</span>
-->
                    <el-select  v-model="Form.tradingType" :disabled="dialogFlag.disabled" filterable clearable :allow-create="true" >
                          <el-option v-for="item in isBoundedOptions" :key="item.value" :label="item.label"
                                     :value="item.value"></el-option>
                      </el-select>
                  </el-form-item>
                <el-form-item label="币种：" prop="currencyId" class="dialogSelect" >
                  <span v-if="dialogFlag.disabled==true">{{Form.currencyId}}</span>
                  <Country :selectValue="Form.currencyId"  v-if="dialogFlag.disabled==false"   @child-change-Val="changeCurrency" selectType="币种"></Country>
                </el-form-item>
                <el-form-item label="转账备注(booking text)" prop="payMemo" >
                  <span v-if="dialogFlag.disabled==true">{{Form.payMemo}}</span>
                  <el-input type="textarea" v-model="Form.payMemo" v-if="dialogFlag.disabled==false"></el-input>
                </el-form-item>
                <el-form-item :label="Form.bankType=='0'?'Account of Initiator':'客户姓名'" prop="accountNo" :rules="[{ required: true, message: '请输入该字段！', trigger: 'blur'},{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}]">
                  <span v-if="dialogFlag.disabled==true">{{Form.accountNo}}</span>
                  <el-input type="text" v-model="Form.accountNo" v-if="dialogFlag.disabled==false"></el-input>
                </el-form-item>
                <el-form-item :label="Form.bankType=='0'?'Bank Code':'BIC'" prop="bankCode" :rules="[{ required: true, message: '请输入该字段!', trigger: 'blur'},{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}]">
                  <span v-if="dialogFlag.disabled==true">{{Form.bankCode}}</span>
                  <el-input type="text" v-model="Form.bankCode" v-if="dialogFlag.disabled==false"></el-input>
                </el-form-item>
                <el-form-item label="IBAN" prop="iban" :rules="[{ required: true, message: '请输入IBAN！', trigger: 'blur'},{ min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}]">
                  <span v-if="dialogFlag.disabled==true">{{Form.iban}}</span>
                  <el-input type="text" v-model="Form.iban" v-if="dialogFlag.disabled==false"></el-input>
                </el-form-item>
                <el-col v-if="dialogFlag.disabled==true">
                  <el-form-item label="关联订单" prop="aa" >
                  </el-form-item>
                  <el-form-item label="关联操作人" prop="aa" >
                  </el-form-item>
                  <el-form-item label="关联时间" prop="aa" >
                  </el-form-item>
                </el-col>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFlag.isopen=false;" v-if="dialogFlag.disabled==true">关 闭</el-button>
              <el-button @click="dialogFlag.isopen=false;" v-if="dialogFlag.disabled==false">取 消</el-button>
              <el-button type="primary" @click="submitForm" v-if="dialogFlag.disabled==false" :loading="$store.state.loading">保 存</el-button>
            </div>
        </el-dialog>
      <!------------------------------------认领付款创建手工订单--------------------------------------->
      <copy-order-dialog :id-value="flowId" :is-open="dialogFlag.addisopen" dialog-title="认领付款创建手工订单"  @getData="getData"></copy-order-dialog>
      <!------------------------------------添加SKU--------------------------------------->
      <el-dialog title="添加SKU" :visible.sync="dialogFlag.addSkuisopen" size="tiny" @close=""
                 :close-on-click-modal="false">
            <el-form :model="addSkuForm" labelWidth="50px">
              <el-form-item label="SKU">
                <el-input  type="text" v-model="addSkuForm.a"></el-input>
              </el-form-item>
              <el-form-item label="数量">
                <el-input  type="text" v-model="addSkuForm.a"></el-input>
              </el-form-item>
            </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.addSkuisopen=false;">关 闭</el-button>
          <el-button type="primary" @click="">保 存</el-button>
        </div>
      </el-dialog>
      <!---------------批量导入弹出框-------------------------->
      <el-dialog title="批量导入商品" :visible.sync="dialogFlag.isOpenLead" size="tiny" :before-close="beforeCloseChange" :close-on-click-modal="false" >
        <el-upload class="upload-demo" :http-request="uploadFile"  :action="uploadExc" ref="upload" :auto-upload="false" :on-change="handExcChange"  :file-list="excFile" accept='.xls,.xlsx,.xlsm'>
          <span>选择需要导入的文件</span>
          <el-button size="small" type="primary">选择文件</el-button>
        </el-upload><br/>
        <span class="remark">请先下载Excel模板，录入相关数据之后再导入。</span><br/>
        <span class="modelDown" @click="downDown(uploadExcModal)">excel模板下载</span><br>
        <el-radio-group v-model="uploadType" >
          <el-radio label="0">德国企业账号</el-radio>
          <el-radio label="1">Noris银行</el-radio>
        </el-radio-group>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.isOpenLead = false;excFile=[]">取 消</el-button>
          <el-button type="primary" :loading="$store.state.loading" @click="submitUpload();">导 入</el-button>
        </div>
      </el-dialog>
      <!---------------批量导入导常弹出框-------------------------->
      <el-dialog title="异常提示" :visible.sync="dialogFlag.isOpenErr" size="tiny">
        <div id="item_list">
          <el-table :data="errorData" border tooltip-effect="dark" style="width: 100%">
            <el-table-column prop="cellName" label="坐标" align="center"></el-table-column>
            <el-table-column prop="cellValue" label="错误信息" align="center"></el-table-column>
            <el-table-column prop="errorDesc" label="描述" align="center"></el-table-column>
            <el-table-column prop="errorType" label="错误类型" align="center"></el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.isOpenErr = false;dialogFlag.isOpenLead = false;requestem()">关 闭</el-button>
        </div>
      </el-dialog>
      <div id="page" class="page">
            <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage"
                           :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
        </div>
    </div>
</template>
<script>
  import textInput from '../../components/ScreenModular/textInput.vue'
  import selectInput from '../../components/ScreenModular/selectInput.vue'
  import titleHeader from "../../components/ScreenModular/title.vue"
  import timeData from "../../components/ScreenModular/timeDate.vue"
  import Country from "../../components/listData/getCurrencyList.vue"
  import personnel from "../../components/listData/GetAllpersonnelList.vue"
  import ElForm from "../../../node_modules/element-ui/packages/form/src/form";
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";



  export default{
    components: {
      ElFormItem,
      ElForm,
      textInput,selectInput,titleHeader,timeData,Country,personnel},
		data(){
			return {
        hasdataa:false,
        errorData:[],
        uploadExc:'',
        excFile:[],
        excName:'',  //  已选择导入的文件名
        excList:'',  //  已选择导入的文件
        uploadType:'0',
        bankOptions:[
          {value:'0',label:'德国企业账号'},
          {value:'1',label:'Noris银行'},
        ],
        activeName:'1',
				addSkuForm:{a:''},
        CustomerForm:{aa:''},
        dialogData:[
          {aa:'11'}
        ],
        msgForm:{
          aa:'',
          bb:'1'
        },
				payForm:{
					aa:'',
          bb:'1'
        },
        options:[{value:'11',label:'555'}],
				picList: [],
				uploadPic: this.RmsUrl + 'productDevInfo/postProductImage=' + this.sessuserid,   //  上传图片地址
				activeNames: ['1'],
				dialogFlag: {
          addisopen:false,
          screeisopen:false,
					isopen: false,
					title: '',
          disabled:false,
          addSkuisopen:false,
          isOpenLead:false,
          isOpenErr:false
				},
        isBoundedOptions:[{label: 'Credit', value: '0'},{label: 'SEPA-Gutschrift', value: '1'}],
				Options: [
					{label: '1', value: '1'},
					{label: '1', value: '1'},
					{label: '1', value: '1'},
				],
				Data: [],
				Form: {
          bankType:'0',
          payTime:'',
          interestDate:'',
          isBounded:'',
          amount:'',
          currencyId:'',
          payMemo:'',
          accountNo:'',
          bankCode:'',
          iban:'',
          tradingType:''
        },
				//分页得到的数据集合
				page: {
					currentPage: 1, //当前页数
					pageSize: 10, //每页条数
					totalCount: 0, //总共条数
					totalPage: 0, //总共页数
				},
				//过滤返回数据
				pagefilters: {
          isBounded:'',
          flowId:'',
          amount:'',
          currencyId:'',
          initialTime:'',
          overTime:'',
          orderId:'',
          boundedUser:'',
					currentPage: 1,
					pageSize: 10,
				},
        status:false,
        orderId:'',
        flowId:'',
        uploadExcModal:this.RmsUrl+'financialFlowOrders/exportModel?Authorization='+sessionStorage.getItem('userSession')+'&type=',   //  导入模板地址

      }
		},
		mounted: function () {
			this.getRequirementList();
		},
		methods: {
      getData(val){
      	console.log('返回ID',val.pramas)
        var obj={};
      	obj.orderId=val.pramas;
        obj.flowId=this.flowId;
        this.httpPost('financialFlowOrders/saveFinFlowOrder',obj).then(res=>{
          this.getRequirementList();
        })
      },
      addcopyOrder(row){
      	this.flowId=row.flowId;
      	this.dialogFlag.addisopen=!this.dialogFlag.addisopen;
      },
      submitUpload:function() {
        if(this.excName == ''){
          this.$message('还未选择导入文件！');
        }if(this.excList.length>=2){
          this.$message('只能导入一个文件，请把其它文件移除！')
        } else{
          this.$refs.upload.submit();
        }
      },
      handExcChange(file,fileList){
        this.excName = file.name;
        this.excList = fileList;
      },
      beforeCloseChange(val){
        this.excFile = [];
        this.dialogFlag.isOpenLead = false;
      },
      //      自定义上传
      uploadFile(options){
        let data = new FormData();
        data.append(options.filename, options.file);
        var url = 'financialFlowOrders/importFinlowOrders';
        this.httpPost(url,data).then(res => {
          if(res.data.result == true){
            this.$message(res.data.message);
            this.dialogFlag.isOpenLead = false;
            this.excFile=[];
            this.requestem();
          }else{
            if(res.data.params.errorList.length>0){
              this.errorData = res.data.params.errorList;
              this.dialogFlag.isOpenErr = true;
            }else{
              this.$message(res.data.message);
            }
            this.excFile=[]
          }
        })
      },
      downDown:function(url){
      	var url=url+this.uploadType;
        window.open(url);
        console.log(url+this.uploadType)
      },
      deleteBank(row){
      	var vm=this;
       vm.doItem('您确定删除此银行转账记录？','financialFlowOrders/delete',{flowId:row.flowId},vm.getRequirementList);

      },
      UnbindBank(){
        var vm=this;
        vm.$message('待开发！')
        //vm.doItem('您确定接触该付款记录的绑定？解除绑定之后可以供销售再次绑定新的订单？','financialFlowOrders/delete',{flowId:row.flowId},vm.getRequirementList);
      },
      screenList(){
        this.pagefilters.orderId=this.orderId;
        this.getRequirementList();
        this.dialogFlag.screeisopen=false;
      },
      changeisBounded(){
           if(this.status==true){
             this.pagefilters.orderId='';
             this.getRequirementList();

           }
      },
      changeboundedUser(val){
        this.pagefilters.boundedUser=val.value;
      },
      changeCurrency(val){
      	val.type=='付款币种'? this.pagefilters.currencyId=val.value:this.Form.currencyId=val.value;
      },
			getFormData(val){
				this.httpGet('financialFlowOrders/selectData?flowId='+val).then(res=>{
          if(res.data!='' && res.data!=null){
            this.Form=res.data;
            this.Form.bankType=String(this.Form.bankType)
            this.Form.tradingType=String(this.Form.tradingType)
            this.Form.amount=String( this.Form.amount)
            this.Form.payTime=this.tool.formatDate('','',this.Form.payTime);
            this.Form.interestDate=this.tool.formatDate('','',this.Form.interestDate);
           // var aa=this.Form.payTime.slice(0,10);
            this.Form.payTime=this.Form.payTime.slice(0,10);
            this.Form.interestDate= this.Form.interestDate.slice(0,10);

           // console.log('555 % 0',  this.Form.payTime )
          }
          this.dialogFlag.isopen=true;
        })
      },
      submitForm(){
        this.$refs['Form'].validate((valid) => {
          if (valid) {
          	if(this.Form.currencyId=='' ){
                 this.$message('请选择币种！')
            }else if(this.Form.interestDate=='' || this.Form.payTime==''){
               this.$message('请填写相关日期！')
            }
            else{
              this.httpPost('financialFlowOrders/save',this.Form).then(res=>{
                this.$message(res.data.message)
                if(res.data.result==true){
                  this.dialogFlag.isopen=false;
                  this.getRequirementList();
                }
              })
            }


          }

        })
      },
      screenReset(){
        this.pagefilters.currencyId='';
        this.pagefilters.boundedUser='';
        this.pagefilters.orderId='';
        this.pagefilters.bankType='';
        this.pagefilters.amount='';
        this.pagefilters.overTime='';
        this.pagefilters.initialTime='';
        this.orderId='';
      },
      resetForm(){
        this.$refs['Form'].resetFields();
        this.Form.currencyId='';
        this.Form.bankType='0';
        this.Form.payTime='';
        this.Form.interestDate='';
        this.Form.amount='';
        this.Form.tradingType='';
        this.Form.payMemo='';
        this.Form.accountNo='';
        this.Form.iban='';
        this.Form.bankCode='';

      },
      getChildren(val){
      	val.type=='付款金额'?this.pagefilters.amount=val.value:val.type='关联订单'?this.orderId=val.value:'';
      },
      getSelectValue(val){
      	this.pagefilters.bankType=val.value;
      },
      getTime(val){
        val.type == 'start' ? this.pagefilters.initialTime = val.value : this.pagefilters.overTime = val.value;
      },
			openDialog(val){
        this.flowId=val.flowId;
      	this.dialogFlag.disabled=this.dialogFlag.title==='查看银行转账'?true:false;
      	val!=''?this.getFormData(val.flowId):this.dialogFlag.isopen=true;

			},
			getRequirementList(){
        this.httpPost('financialFlowOrders/selectAll',this.pagefilters).then(res=>{
          this.Data=res.data.listData;
        	 this.page=res.data;
        	 this.status=true;
        })
			},
			batchChange(){

			},
			//分页
			changePageSize: function (val) {
				this.pagefilters.pageSize = val;
				this.pagefilters.currentPage = 1;
        this.getRequirementList();
			},
			changeCurrentPage: function (val) {
				this.pagefilters.currentPage = val;
				this.getRequirementList();
			},

		}
	}

</script>

<style scoped>


</style>

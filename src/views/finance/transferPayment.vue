<template>
    <div id="outermost_wrap">
        <div id="sub_wrap">
            <CrumbsNav></CrumbsNav>
        </div>
        <div id="content_wrap">
          <el-row class="marginBottom"  :gutter="10">
            <el-col :span="3">
              <el-select size="small" v-model="selectParams.optionTitle" filterable  @change="selectParams.optionValue = ''">
                <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6" class="optionValue">
              <el-input v-model="selectParams.optionValue" :placeholder="getPlaceholder" size="small"></el-input>
            </el-col>
            <el-col :span="1">
              <el-button type="primary" size="small" @click="selectFilter">搜索</el-button>
            </el-col>
          </el-row>
            <el-row  id="filer">
                <el-collapse v-model="activeNames" class="marginBottom">
                    <el-collapse-item name="1">
                        <el-col class="marginBottom">
                            <span class="span_label">类型</span>
                            <el-radio-group size="small" @change="changeStatus();" v-model="pagefilters.isUse">
                              <el-radio-button label=""   v-if="ButtonInfo['全部']!='0'">全部</el-radio-button>
                              <el-radio-button label="0"   v-if="ButtonInfo['未录入']!='0'">未录入</el-radio-button>
                              <el-radio-button label="1"   v-if="ButtonInfo['已录入']!='0'">已录入</el-radio-button>
                            </el-radio-group>
                        </el-col>
                    </el-collapse-item>
                </el-collapse>
            </el-row>
            <el-row class="supplier_btn">
                <el-button size="small" @click="dialogFlag.screeisopen=true; getFounder();" type="primary">筛选</el-button>
            </el-row>
          <!--<el-row class="supplier_btn last_btn">
            <el-button size="small" @click="" type="primary">批量录入</el-button>
          </el-row>-->
            <div >
                <el-table :data="ListData" ref="ListData" class="table_padding" border tooltip-effect="dark" @selection-change="batchChange"
                          style="width:100%;">
                  <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column id="space" label="操作" align="center">
                        <template scope="scope">
                            <el-tooltip content="查看" effect="dark" placement="bottom"    v-if="ButtonInfo['查看']!='0'">
                                <i class="iconfontyyy" @click="dialogFlag.title='查看调拨费用登记';dialogFlag.disabled=true;openDialog(scope.row);"
                                   content="Bottom center">&#xe600;</i>
                            </el-tooltip>
                            <el-tooltip content="编辑" effect="dark" placement="bottom"    v-if="ButtonInfo['编辑']!='0'">
                                <i class="iconfontyyy" @click="dialogFlag.title='编辑调拨费用登记';dialogFlag.disabled=false;openDialog(scope.row);"
                                   content="Bottom center">&#xe6e5;</i>
                            </el-tooltip>
                          <el-tooltip content="新增" effect="dark" placement="bottom" v-if="pagefilters.isUse=='0'  && ButtonInfo['新增']!='0'">
                            <i class="iconfontyyy" @click="dialogFlag.title='新增调拨费用登记';dialogFlag.disabled=false;openDialog(scope.row);"
                               content="Bottom center">&#xe623;</i>
                          </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="调拨单编号" prop="transferNo" align="center" sortable></el-table-column>
                    <el-table-column label="跟踪单号" prop="trackingNo" align="center" sortable></el-table-column>
                    <el-table-column label="调拨类型" prop="transferStatus" align="center" sortable></el-table-column>
                    <el-table-column label="始发仓" prop="whId" align="center" sortable></el-table-column>
                  <el-table-column label="中转仓" prop="transitWhId" align="center" sortable></el-table-column>
                  <el-table-column label="目的仓" prop="toWhId" align="center" sortable></el-table-column>
                  <el-table-column label="运输方式" prop="transportType" align="center" sortable></el-table-column>
                  <el-table-column label="调拨费用总计" prop="allCnyAmount" align="center" sortable>
                    <template scope="scope">
                      <span  v-if="scope.row.allCnyAmount !=null ">
                        <span v-if="scope.row.currencyRate !=''"> {{scope.row.allCnyAmount*scope.row.currencyRate}}</span>
                        <span v-if="scope.row.currencyRate ==''">{{scope.row.allCnyAmount}}</span>
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="币种" prop="" align="center" sortable width="180px">
                    <template scope="scope">
                      <el-select  v-model="scope.row.currencyId" placeholder="请选择币种" filterable @change="changeCurrency($event,scope.row,scope.$index)">
                        <el-option
                          v-for="item in currencyOptions"
                          :key="item.currencyId"
                          :label="item.cnName"
                          :value="item.currencyId">
                        </el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="调拨单状态" prop="trStatus" align="center" sortable></el-table-column>
                  <el-table-column label="创建人" prop="addUser" align="center" sortable></el-table-column>
                  <el-table-column label="调拨单创建时间" prop="addTime" align="center"  :formatter="tool.formatDate"  sortable></el-table-column>
                </el-table>
            </div>
        </div>
        <!------------------------------------查看/编辑/新增--------------------------------------->
        <el-dialog class="headerBorder" :title="dialogFlag.title" :visible.sync="dialogFlag.isopen" size="small" @close="resetForm"
                   :close-on-click-modal="false">
            <el-form labelWidth="120px" :model="tTransferForm" ref="tTransferForm">
              <el-form-item label="调拨单编号" prop="transferId">
                {{tTransferForm.trackingNo}}
              </el-form-item>
              <el-form-item label="始发仓" prop="whId">
                {{tTransferForm.whId}}
              </el-form-item>
              <el-form-item label="中转仓" prop="transitWhId" v-if="transitWhIdInfo==false">
                {{tTransferForm.transitWhId}}
              </el-form-item>
              <el-form-item label="目的仓" prop="toWhId" style="border-bottom: 1px solid #ccc;">
                {{tTransferForm.toWhId}}
              </el-form-item>
                <el-form-item label="" labelWidth="20px" >
                  <el-tabs  v-model="tTransferForm.phaseId" @tab-click="handleClick" class="tabsBorder">
<!--
                    <el-tab-pane name="0" label="费用"  v-if="transitWhIdInfo==true"><payForm   ref="payForm1" :Disabled="dialogFlag.disabled" :activeName="tTransferForm.phaseId"></payForm></el-tab-pane>
-->
                    <el-tab-pane name="1" :label="transitWhIdInfo==true?'费用':'第1阶段费用'" >
                      <el-form>
                        <el-form-item label="跟踪单号" prop="transferNo"  labelWidth="120px">{{childData.transferNo}}</el-form-item>
                        <el-form-item label="物流方式" prop="transportType" labelWidth="120px">
                          <span v-if="childData.transportType !=null">{{childData.transportType}}</span>
                          <span v-if="childData.logisticsType !=null">/{{childData.logisticsType}}</span></el-form-item>
                        <el-form-item label="币种"  labelWidth="120px" prop="" v-if="dialogFlag.disabled==true">CNY</el-form-item>
                        <el-form-item>
                          <payForm ref="payForm1" @getchild='getChildValue' :Disabled="dialogFlag.disabled" :activeName="tTransferForm.phaseId" :getpoId="transferId"  :gettrackingNo="trackingNo" ></payForm>
                        </el-form-item>
                      </el-form>
                    </el-tab-pane>
                    <el-tab-pane name="2" label="第2阶段费用" v-if="transitWhIdInfo==false">
                      <el-form>
                        <el-form-item label="跟踪单号" prop="transferNo"  labelWidth="120px">{{childData.transferNo}}</el-form-item>
                        <el-form-item label="物流方式" prop="transportType" labelWidth="120px">
                          <span v-if="childData.transportType !=null">{{childData.transportType}}</span>
                          <span v-if="childData.logisticsType !=null">/{{childData.logisticsType}}</span></el-form-item>
                        <el-form-item label="币种"  labelWidth="120px" prop="" v-if="dialogFlag.disabled==true">CNY</el-form-item>
                        <el-form-item>
                          <payForm  ref="payForm2"  @getchild='getChildValue' :Disabled="dialogFlag.disabled" :activeName="tTransferForm.phaseId" :getpoId="transferId"   :gettrackingNo="trackingNo"></payForm>
                        </el-form-item>
                      </el-form>
                    </el-tab-pane>
                  </el-tabs>
                </el-form-item>
                <el-form-item label="费用总计" class="TotalCost" prop="aa" v-if="dialogFlag.title=='查看调拨费用登记'">
                  <el-radio-group v-model="radio2"  @change="changeCurrencyAmount">
                    <el-radio label="CNY">CNY</el-radio>
                    <el-radio label="HKD">HKD</el-radio>
                  </el-radio-group>
                  <p v-if="radio2=='CNY'">{{CnyAmountt}}</p>
                  <p v-if="radio2=='HKD'">{{CnyAmountt*currencyradio}}</p>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFlag.isopen=false;" v-if="dialogFlag.disabled==false">取 消</el-button>
              <el-button @click="dialogFlag.isopen=false;" v-if="dialogFlag.disabled==true">关 闭</el-button>
               <el-button type="primary" @click="subMitForm('1')" v-if="dialogFlag.disabled==false && pagefilters.isUse!='1' " :loading="$store.state.loading">标记已录全</el-button>
              <el-button type="primary" @click="subMitForm('0')"  v-if="dialogFlag.disabled==false" :loading="$store.state.loading">确 定</el-button>
            </div>
        </el-dialog>
        <!------------------------------------筛选--------------------------------------->
        <el-dialog :title="dialogFlag.title" :visible.sync="dialogFlag.screeisopen" size="small" @close="screenreset"  :close-on-click-modal="false">
        <div class="data_body">
          <title-header></title-header>
          <text-input   condition-name="调拨单"  @child-change-val="getChildren"  :selectValue="transferId" text-type="transferId" ></text-input>
          <text-input   condition-name="跟踪单号"  @child-change-val="getChildren"  :selectValue="trackingNo" text-type="trackingNo" ></text-input>
          <el-row class="row">
            <el-col class="col" :span="4">调拨类型</el-col><el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16">
              <el-select  filterable v-model="pagefilters.transferType" >
                <el-option v-for="item in typeOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">始发仓</el-col><el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16">
              <houseList  @child-change-Val="getHouse" :selectValue="pagefilters.whId" selectType="始发仓"></houseList>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">中转仓</el-col><el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16">
              <houseList @child-change-Val="getHouse" :selectValue="pagefilters.transitWhId" selectType="中转仓"></houseList>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">目的仓</el-col><el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16">
              <houseList @child-change-Val="getHouse" :selectValue="pagefilters.toWhId" selectType="目的仓"></houseList>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">调拨单状态</el-col><el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16">
              <el-select  filterable  v-model="pagefilters.status" >
                <el-option v-for="item in StatusOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="4">调拨创建人</el-col><el-col class="col" :span="4">是</el-col>
            <el-col class="col_input" :span="16">
              <el-select  filterable  v-model="pagefilters.addUser">
                <el-option v-for="item in FounderOptions" :label="item.userName" :key="item.userId" :value="item.userId"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <time-data   :start-time="pagefilters.initialTime" condition-name="创建时间" :end-time="pagefilters.overTime" @child-value-Stime="getTime" @child-value-Etime="getTime" ></time-data>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button  @click="screenreset">清除筛选</el-button>
          <el-button  @click="sccrenForm">筛 选</el-button>
          <el-button @click="dialogFlag.screeisopen=false;">取 消</el-button>
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
  import timeData from "../../components/ScreenModular/timeDate.vue"
  import titleHeader from "../../components/ScreenModular/title.vue"
  import textInput from '../../components/ScreenModular/textInput.vue'
  import selectInput from '../../components/ScreenModular/selectInput.vue'
  import houseList from '../../components/listData/getWarehouseList.vue'
  import payForm from './SonModula/payForm.vue'
  import Currency from '../../components/listData/getCurrencyList.vue'
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";
  import ElTabPane from "../../../node_modules/element-ui/packages/tabs/src/tab-pane";
  import ElForm from "../../../node_modules/element-ui/packages/form/src/form";

  export default{
    components: {
      ElForm,
      ElTabPane,
      ElFormItem,
      ElButton,
      titleHeader,timeData,textInput,selectInput,houseList,payForm,Currency
    },
		data(){
			return {
        FounderOptions:[],
        StatusOptions:[
          {
            value: '01',
            label: '待调拨'
          },
          {
            value: '02',
            label: '已调拨出库'
          },
          {
            value: '03',
            label: '已到中转仓'
          },
          {
            value: '04',
            label: '已出中转仓'
          },
          {
            value: '05',
            label: '已部分入目的仓'
          },
          {
            value: '06',
            label: '已全部入目的仓'
          },
        ],
        typeOptions:[
          {
            value: '',
            label: '全部'
          },
        	{
            value: '0',
            label: '备货'
          },
          {
            value: '1',
            label: '分仓'
          }

          ],
        status:false,
        radio2:'CNY',
        currencyradio:'',
        CnyAmountt:'0',
				childData:{
          trackingNo:'',
          transportType:'',
          logisticsType:''
        },
        trackingNo:'',
        transferId:'',
        transitWhIdInfo:false,
        allCnyAmount:[],
        currencyRate:'',
        currencyOptions:[],
        optionVal:'',    // 下拉选项值
        selectParams:{    //  下拉过滤
          optionValue:'',
          optionTitle:'调拨单编号',
        },
        selectOptions: [{
          value: '跟踪单号',
          label: '跟踪单号'
        }, {
          value: '调拨单编号',
          label: '调拨单编号'
        }],
				payForm:{
					date:'',
          money:'',
          activeName:1,
        },
        picList:[],
        uploadPic:this.RmsUrl+'productDevInfo/postProductImage='+this.sessuserid,   //  上传图片地址
        activeNames: ['1'],    //  过滤条件栏的折叠面板
        ListData: [],
				dialogFlag: {
          activeName:'1',
					isopen: false,
          screeisopen:false,
					title: '',
          disabled:false,
				},
        Options: [
          {label: '1', value: '1'},
          {label: '1', value: '1'},
          {label: '1', value: '1'},
        ],
        tTransferForm: {
          transferId:'',
          trackingNo:'',
          transferStatus:'',
          whId:'',
          transitWhId:'',
          toWhId:'',
          transportType:'',
          logisticsType:'',
          list:[],
          phaseId:'1'
        /*  payYear:'',
          payMonth:'',
            phaseId:'1',
            freightCn:'',
            dutyCn:'',
            vatCn:'',
            disbursementCn:'',
            serviceFeeCn:'',
            otherCn:'',
            memo:''*/
        },
        transferForm1:{},
        transferForm2:{},
        //分页得到的数据集合
				page: {
					currentPage: 1, //当前页数
					pageSize: 10, //每页条数
					totalCount: 0, //总共条数
					totalPage: 0, //总共页数
				},
				//过滤返回数据
				pagefilters: {
          transferId:'',
          trackingNo:'',
          isUse:'',
          transferType:'',
          whId:'',
          transitWhId:'',
          toWhId:'',
          addUser:'',
          status:'',
          initialTime:'',
          overTime:'',
					currentPage: 1,
					pageSize: 10,
				},
        obj:{},
        ButtonInfo:{},//按钮权限列表20171227
			}
		},
    computed:{
      getPlaceholder:function(){
        return this.selectParams.optionTitle == '调拨单编号' ? '请输入调拨单编号' : this.selectParams.optionTitle == '跟踪单号' ? '请输入跟踪单号' :'' ;
      }
      },
		mounted: function () {
      this.getauthorityList();
			this.getRequirementList();
      this.getCurrencyInfo();
		},
		methods: {

      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
			//人员
      getFounder(){

      	this.httpPost('sysUser/selectList',{}).then(res=>{
      		this.FounderOptions=res.data;
        })
      },
      getHouse(data){
      	data.type=='始发仓'?this.pagefilters.whId=data.value:data.type=='中转仓'?this.pagefilters.transitWhId=data.value:data.type='目的仓'?this.pagefilters.toWhId=data.value:'';
      },
			changeStatus(){
         if(this.status==true){
           this.selectParams.optionValue='';this.pagefilters.trackingNo='';this.pagefilters.transferId='';
           this.getRequirementList();
         }
      },
      sccrenForm(){
        this.pagefilters.transferId=this.transferId;
        this.pagefilters.trackingNo=this.trackingNo;
        this.getRequirementList();
        this.dialogFlag.screeisopen=false;
      },
      screenreset(){
        this.transferId='';
        this.trackingNo='';
        this.pagefilters.initialTime='';
        this.pagefilters.overTime='';
        this.pagefilters.whId='';
        this.pagefilters.transitWhId='';
        this.pagefilters.toWhId='';
        this.pagefilters.status='';
        this.pagefilters.transferType='';
        this.pagefilters.addUser=''
      },
      subMitForm(val){
      	 var url='';
      	 url=this.dialogFlag.title=='新增调拨费用登记'?'financialPaymentTransfer/save':'financialPaymentTransfer/update';
        if(this.transitWhIdInfo==false){
          var bb= this.$refs.payForm2.submitRequired();
        }
        var aa= this.$refs.payForm1.submitRequired();
        if(val=='1' && (aa==false || bb==false)){
          this.$message('阶段费用未填写完整标记失败！')
        }else if(val=='1' && this.transitWhIdInfo==true){
        	if(aa==false){
            this.$message('基础费用信息未填写完整标记失败！')
          }else{
            this.transferForm1.isUse=val;
            this.transferForm2.isUse=val;
            var objKeys=Object.keys(this.transferForm2);
            this.submit(url,this.transferForm1);
            if(this.transitWhIdInfo==false && objKeys.length>1){
              this.submit(url,this.transferForm2);
            }
          }
        }
        else{
          this.transferForm1.isUse=val;
          this.transferForm2.isUse=val;
          var objKeys=Object.keys(this.transferForm2);
        	console.log(4444)
          this.submit(url,this.transferForm1);
          if(this.transitWhIdInfo==false && objKeys.length>1){
            this.submit(url,this.transferForm2);
          }
        }
        //this.dialogFlag.title=='新增调拨费用登记' ? (this.$refs.payForm1.getsubMitForm(),this.$refs.payForm2.getsubMitForm()):(this.$refs.payForm1.geteditForm(),this.$refs.payForm2.geteditForm());
      },
      submit(url,Form){
      	this.httpPost(url,Form).then(res=>{
      		this.$message(res.data.message);
      		if(res.data.result==true){
      			this.dialogFlag.isopen=false;
      			this.getRequirementList();
          }
        })
      },
      getChildValue(val){
      	if(val.value.phaseId=='1'){
      		console.log(444)
      		this.transferForm1=val.value;
          this.transferForm1. transferId=this.transferId;
          this.transferForm1.trackingNo=this.trackingNo;
          this.transferForm1.phaseId=val.value.phaseId=='1'?'1':'2';
      	}else{
          console.log(555)
          this.transferForm2=val.value;
          this.transferForm2. transferId=this.transferId;
          this.transferForm2.trackingNo=this.trackingNo;
          this.transferForm2.phaseId=val.value.phaseId=='1'?'1':'2';
      	}
        console.log('111111 % 0', this.transferForm1)
        console.log('3323333 % 0', this.transferForm2)



      },
      //搜索确认
      selectFilter: function (val) {
        this.status=false;
        if (this.selectParams.optionValue == '') {
          this.pagefilters.transferId = '';
          this.pagefilters.trackingNo = '';
          this.getRequirementList();
        } else {
          var value = this.selectParams.optionValue;
          var title = this.selectParams.optionTitle;
          if (value == '' || title == '') {

          } else {
            var vm = this;
            if (title == '调拨单编号') {
              vm.pagefilters.transferId = value;
              vm.pagefilters.trackingNo = '';
            } else if (title == '跟踪单号') {
              vm.pagefilters.trackingNo = value;
              vm.pagefilters.transferId = '';
            }
            vm.pagefilters.isUse = '';

            console.log('vm.pagefilters %0==',vm.pagefilters)
            this.getRequirementList();
          }
        }
      },
      handleClick(){
         if(this.tTransferForm.phaseId=='2' && this.dialogFlag.title=='新增调拨费用登记' || this.tTransferForm.list.length==1){
           this.$refs.payForm2.addform();
         }else if(this.tTransferForm.phaseId=='2' && this.tTransferForm.list.length==1){
           this.$refs.payForm2.addform();
         }
      },
      resetForm(){
      	var vm=this;
      	if(this.transitWhIdInfo==false){
          vm.$refs.payForm2.resetForm();
        }
      	vm.$refs.payForm1.resetForm();
        this.radio2='CNY';
        this.CnyAmountt='';
        this.tTransferForm.phaseId='1';
      },

      getChildren(data){
        data.type === 'transferId'? this.transferId = data.value : data.type==='trackingNo' ?this.trackingNo = data.value:'';
         // data.type === 'house' ? this.pageFilter.poWarehouse = data.value : '' ;
      },
      getTime:function(val){
        val.type == 'start' ? this.pagefilters.initialTime = val.value : this.pagefilters.overTime = val.value;
      },
			openDialog(val){
				var vm=this;
				this.transferId=val.transferId;
				this.trackingNo=val.trackingNo;
				this.tTransferForm.transferId=val.transferId;
        this.tTransferForm.whId=val.whId;
        this.tTransferForm.transitWhId=val.transitWhId;
        this.tTransferForm.toWhId=val.toWhId;
        this.childData.transferNo=val.transferNo;
        this.childData.transportType=val.transportType;
        this.childData.logisticsType=val.logisticsType;
        val.transitWhId==null?this.transitWhIdInfo=true:this.transitWhIdInfo=false;
        if(vm.dialogFlag.title!='新增调拨费用登记'){
          this.getForm();
          if(this.transitWhIdInfo==false){
            setTimeout(function(){vm.$refs.payForm2.getForm2();},300)
          }
        	setTimeout(function(){vm.$refs.payForm1.getForm();},300)
        }
        vm.dialogFlag.isopen=true;
			},

      getForm(){
        this.httpGet('financialPaymentTransfer/selectFinPaymentTransferData?transferId='+this.transferId).then(res=>{
          if(res.data.params.list.length !==0){
            var amount=0;
            this.tTransferForm.list= res.data.params.list;
            this.tTransferForm.list.map(item=>{
            	 amount  += (item.freightCny + item.dutyCny+  item.vatCny+ item.disbursementCny+ item.serviceFeeCny+item.otherCny)
             /*  console.log('6666666'+item.dutyCny+
               +item.vatCny
               +item.disbursementCny
               +item.serviceFeeCny
              + item.otherCny)*/
            })
           this.CnyAmountt=amount;
          }
        })
      },
      changeCurrencyAmount(val){
        var arr=this.currencyOptions.map(item=>item.currencyId);
        var currencyindex=arr.indexOf(this.radio2);
        this.currencyOptions.map((value,index,data)=>{
          this.currencyradio=data[currencyindex].currencyRate;
        });

      },
      //选择币种
      changeCurrency(data,row,index){
       var arr=this.currencyOptions.map(item=>item.currencyId);
			 var currencyindex=arr.indexOf(data);
        this.currencyOptions.map((value,index,data)=>{
        row.currencyRate=data[currencyindex].currencyRate;
        });

      },
      //币种
      getCurrencyInfo(){
				this.httpPost('financialPaymentTransfer/queryCurrencyInfo').then(res=>{
					this.currencyOptions=res.data.params.list;
        })
      },
      //进入页面基础数据
			getRequirementList(){
           this.httpPost('financialPaymentTransfer/selectAll',this.pagefilters).then(res=>{
           	this.ListData=res.data.listData;
             this.ListData.forEach(item=>{
             	this.$set(item,'currencyId','CNY');
               this.$set(item,'currencyRate','');
             })
           	this.page=res.data;
           //	this.currencyRate='CNY';
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

.tabsBorder .el-tabs__header{
  border:0!important;
}
.el-form-item.TotalCost .el-form-item__label{
  font-size: 24px;
  font-weight: bold;
}
</style>

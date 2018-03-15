<template>
    <div id="outermost_wrap">
        <div id="sub_wrap">
            <CrumbsNav></CrumbsNav>
        </div>
        <div id="content_wrap">
          <el-row class="marginBottom">
            <el-col :span="3" >
              <OwnWarehouseList  :selectValue="pagefilters.whId"  select-type="house"  default="defaultt" placeValue="请选择仓库"  size="small"  @child-change-val="getChildren"   @child-change="getHouse" ></OwnWarehouseList>
            </el-col>
          </el-row>
          <el-row class="marginBottom"  :gutter="5">
            <el-col :span="3">
              <el-select size="small" v-model="selectParams.optionTitle" filterable  >
                <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="5" class="optionValue">
              <el-input v-model="selectParams.optionValue" :placeholder="getPlaceholder" size="small"></el-input>
            </el-col>
            <el-col :span="1">
              <el-button type="primary" size="small" @click="selectFilter('1')">搜索</el-button>
            </el-col>
          </el-row>
          <el-row  id="filer" class="marginBottom">
            <el-collapse v-model="activeNames">
              <el-collapse-item name="1">
                <span class="span_label">状态</span>
                <el-radio-group v-model="pagefilters.approvalStatus" size="small"   @change="selectFilter('2')" >
                  <el-radio-button label="01"     v-if="ButtonInfo['待审核']!='0'">待审核</el-radio-button>
                  <el-radio-button label="02"     v-if="ButtonInfo['审核通过']!='0'">审核通过</el-radio-button>
                  <el-radio-button label="03"     v-if="ButtonInfo['审核不通过']!='0'">审核不通过</el-radio-button>
                  <el-radio-button label="04"     v-if="ButtonInfo['已发货']!='0'">已发货</el-radio-button>
                  <el-radio-button label="05"     v-if="ButtonInfo['已补足新品配件']!='0'">已补足新品配件</el-radio-button>
                </el-radio-group>
              </el-collapse-item>
            </el-collapse>
          </el-row>
          <el-row class="marginBottom" style="border-bottom:1px solid #bfcbd9;padding-bottom: 10px; "  v-if="ButtonInfo['筛选']!='0'">
            <el-button size="small"  type="primary" @click="dialogFlag.sccrenisOpen = true" >筛选</el-button>
          </el-row>
          <el-row class="supplier_btn">
            <el-button type="primary" size="small"  @click="openSubmitDialog('','Agree')" v-if="pagefilters.approvalStatus == '01' && ButtonInfo['批量同意']!='0'" >批量同意</el-button>
            <el-button type="primary" size="small" @click="openSubmitDialog('','Noagree')" v-if="pagefilters.approvalStatus == '01' && ButtonInfo['批量不同意']!='0'">批量不同意</el-button>
            <el-button type="primary" size="small" @click="openSubmitDialog('','Goback')" v-if="pagefilters.approvalStatus == '03' && ButtonInfo['批量退回']!='0'">批量退回</el-button>
            <el-button type="primary" size="small" @click="openSubmitDialog('','Added')" v-if="pagefilters.approvalStatus == '04' && ButtonInfo['批量标记补足配件']!='0'">批量标记补足配件</el-button>
          </el-row>
          <div id="item_list">
            <el-table  :data="AccessoryData"  ref="AccessoryData"  border tooltip-effect="dark"  @selection-change="batchChange"   style="width:100%;" >
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column  id="space" label="操作"  align="center" style="word-wrap:break-word;word-break:break-all;">
                <template scope="scope">
                  <el-tooltip content="同意"  effect="dark" placement="bottom" v-if="scope.row.approvalStatus == '待审核'  && ButtonInfo['同意']!='0'">
                    <i  class="iconfontyyy" @click="openSubmitDialog(scope.row,'Agree')"  content="Bottom center">&#xe67e;</i>
                  </el-tooltip>
                  <el-tooltip content="不同意"  effect="dark" placement="bottom" v-if="scope.row.approvalStatus == '待审核'  && ButtonInfo['不同意']!='0'">
                    <i  class="iconfontyyy" @click="openSubmitDialog(scope.row,'Noagree')" content="Bottom center">&#xe665;</i>
                  </el-tooltip>
                  <el-tooltip content="撤回"  effect="dark" placement="bottom" v-if="scope.row.approvalStatus == '审核不通过'  && ButtonInfo['撤回']!='0'">
                    <i  class="iconfontyyy" @click="openSubmitDialog(scope.row,'Goback')"  content="Bottom center">&#xe666;</i>
                  </el-tooltip>
                  <el-tooltip content="标记补足配件"  effect="dark" placement="bottom" v-if="scope.row.approvalStatus == '已发货'  && ButtonInfo['标记补足配件']!='0'">
                    <i  class="iconfontyyy" @click="openSubmitDialog(scope.row,'Added')"  content="Bottom center">&#xe67e;</i>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="订单编号"  prop="orderNo"  sortable align="center"></el-table-column>
              <el-table-column label="SKU图片"  prop="" align="center"  sortable >
                <template scope="scope">
                  <img v-if="scope.row.productImageUrl!=null" :src="scope.row.productImageUrl" :data-src="scope.row.productImageUrl">
                </template>
              </el-table-column>
              <el-table-column label="SKU"    prop="skuNo" align="center"  sortable  ></el-table-column>
              <el-table-column label="产品名称" prop="cnName"   align="center" sortable >
              </el-table-column>
              <el-table-column label="发货物品图片"  align="center"  prop="" sortable >
                <template scope="scope">
                  <img v-if="scope.row.imageUrl!=null" :src="scope.row.imageUrl" :data-src="scope.row.imageUrl">
                </template>
              </el-table-column>
              <el-table-column label="创建人" align="center" prop="reqUserName"  sortable >
              </el-table-column>
              <el-table-column label="收件人信息"  width="180"   align="left"  prop="" sortable >
                <template scope="scope">
                  客户ID:{{scope.row.customerId}}<br>客户姓名:{{scope.row.customerName}}<br>地址1:{{scope.row.address1}}<br>市:{{scope.row.city}}<br>区:{{scope.row.district}}<br>州:{{scope.row.state}}<br>邮编:{{scope.row.postCode}}<br>手机:{{scope.row.phone}}<br>国家:{{scope.row.cuntryArea}}
                </template>
              </el-table-column>
              <el-table-column label="物流方式" align="center"  prop="whLogisticsCnName"  sortable ></el-table-column>
              <el-table-column label="状态" align="center"   prop="approvalStatus"  sortable ></el-table-column>
              <el-table-column label="发货时间" align="center" prop="whTime"  :formatter="tool.formatDate" sortable >
            </el-table-column>
              <el-table-column label="物流跟踪单" align="center" prop="trackingNo"  sortable >
              </el-table-column>
              <el-table-column label="备注信息" align="center" prop="reqMemo"   sortable >
              </el-table-column>
            </el-table>
          </div>
        </div>
      <!--筛选弹窗-->
      <div class="smallDia">
        <el-dialog title="筛选" :visible.sync="dialogFlag.sccrenisOpen" size="small" :close-on-click-modal="false"  @open="colseScreen();">
          <div class="data_body">
            <title-header></title-header>
            <text-input   condition-name="订单编号"  @child-change-val="getChildren"  :selectValue="poNoo" text-type="poNo" ></text-input>
            <el-row class="row">
              <el-col class="col" :span="4">SKU</el-col><el-col class="col" :span="4">是</el-col>
              <el-col class="col_input" :span="16">
                <SkuList  :selectValue="skuNoo" @child-change-val="getChildren" @child-list="getid" select-type="skuNo"></SkuList>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col class="col" :span="4">创建人</el-col><el-col class="col" :span="4">是</el-col>
              <el-col class="col_input" :span="16">
                <FounderList  :selectValue="pagefilters.userId"  @child-change-val="getChildren"   select-type="userId">
                </FounderList  >
              </el-col>
            </el-row>
            <time-data  conditionName="创建日期"  :start-time="pagefilters.startDate" :end-time="pagefilters.endDate" @child-value-Stime="getTime" @child-value-Etime="getTime" ></time-data>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="colseScreen">清除条件</el-button>
            <el-button @click="dialogFlag.sccrenisOpen = false;screenForm();">筛 选</el-button>
            <el-button @click="dialogFlag.sccrenisOpen = false;">取 消</el-button>
          </div>
        </el-dialog>
      </div>
        <div id="page" class="page">
            <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage"
                           :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize"
                           layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
        </div>
    </div>
</template>
<script>
  import OwnWarehouseList from 'components/listData/getOwnWarehouseList.vue'
  import textInput from '../../components/ScreenModular/textInput.vue'
  import timeData from "../../components/ScreenModular/timeDate.vue"
  import titleHeader from "../../components/ScreenModular/title.vue"
  import SkuList from 'components/listData/getSkuList.vue'
  import FounderList from '../../components/listData/GetFounderList.vue'



  export default{
    components: {OwnWarehouseList,titleHeader,textInput,timeData,SkuList,FounderList},
		data(){
			return {
        seachValue:false,
        poNoo:'',
        skuNoo:'',
        startDate:'',
        endDate:'',
        dialogFlag:{
          sccrenisOpen:false,
        },
        AccessoryData:[],
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        //搜索下拉值
        selectOptions: [{
          value: 'SKU',
          label: 'SKU'
        }, {
          value: '订单ID',
          label: '订单ID'
        }],
        optionVal:'',    // 下拉选项值
        selectParams:{    //  下拉过滤
          optionValue:'',
          optionTitle:'SKU',
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
					currentPage: 1,
					pageSize: 10,
          whId:'',
          orderNo:'',
          skuNo:'',
          approvalStatus:'01',
          userId:'',
          startDate:"",
          endDate:'',
				},
        IdList:[],
        ButtonInfo:{},//按钮权限列表20171227
			}
		},
    computed:{
      getPlaceholder:function(){
        return this.selectParams.optionTitle == 'SKU' ? '请输入SKU' : this.selectParams.optionTitle == '订单ID' ? '请输入订单ID' :'' ;
      }
    },
		mounted: function () {
      this.getauthorityList();
			this.getAccessList();
		},
		methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      getid(data){
        this.skuNoo = data;
      },
      getHouse(data){
        var valarr = data.map(item => item.value);
        this.pagefilters.whId = valarr[0];
        this.getAccessList();
      },
      colseScreen(){
      	this.skuNoo='';
      	this.poNoo='';
        this.pagefilters.userId='';
        this.pagefilters.startDate='';
        this.pagefilters.endDate='';
      },
      screenForm(){
        this.pagefilters.skuNo = this.skuNoo;
        this.pagefilters.orderNo = this.poNoo;
        this.getAccessList();
      },
      batchChange(val){
        this.IdList = val.map(item => item.reqId);
      },
      /*
      * id:''为批量，反之为单个提交
      * status:Agree为同意，Noagree为不同意，Goback为退回，Added为补足新配件
      *
      * */
      openSubmitDialog(id,status){
        var vm =this,msg='',url='',obj={reqIds:[],auditNo:''};
        id == '' ? obj.reqIds =  this.IdList : obj.reqIds.push(id.reqId);
        obj.auditNo = status == 'Agree' ? '1' : status == 'Noagree' ? '0' : status == 'Goback' ? '2' : '';
        url = status == 'Added' ? 'partsApply/complement' :'partsApply/audit' ;
        msg = status == 'Agree' ? '您确定同意配件的申请？' : status == 'Noagree' ? '您确定不同意配件的申请？' : status == 'Goback' ? '您确定退回配件的申请？' : '您确定新品已补足配件？';
        obj.reqIds.length < 1 ? vm.tips() : status == 'Added' ? vm.doItem(msg,url,obj.reqIds,vm.getAccessList) : vm.doItem(msg,url,obj,vm.getAccessList) ;
      },
      getTime:function(val){
        val.type == 'start' ? this.pagefilters.startDate = val.value : this.pagefilters.endDate = val.value;
      },
      getChildren(data){
        data.type === '订单编号'? this.poNoo = data.value : data.type==='skuNo' ? this.skuNoo = data.value : data.type==='userId' ? this.pagefilters.userId = data.value : data.type==='house' ? this.pagefilters.whId = data.value : '';
        if(data.type ==='house'){
          this.pagefilters.whId = data.value;
          this.getAccessList();
        }
        },
      getchangeList( val ){
        this.getinfoModel.isOpen = false;
      },
      requestemStart(){

      },
      //搜索确认
      selectFilter:function(val){
        var _this = this;
        if(val === '1'){
        	this.seachValue = true;
          if(_this.selectParams.optionValue === '' ){
          }else {
            var value = _this.selectParams.optionValue;
            var title = _this.selectParams.optionTitle;
            if(value === '' || title === '' ){
            }else{
              if(title == 'SKU'){
                _this.pagefilters.skuNo=value;
                _this.pagefilters.orderNo='';
              }else if(title == '订单ID'){
                _this.pagefilters.orderNo=value;
                _this.pagefilters.skuNo='';

              }
              _this.getAccessList();
            }
          }
        }else if(val === '2'){
        	if(this.seachValue === false){
        		_this.selectParams.optionValue='';
            _this.pagefilters.orderNo='';
            _this.pagefilters.skuNo='';
            _this.getAccessList();
          }
        }
      },
      getAccessList(){
      	//alert(888)
        this.httpPost('partsApply/missingPartsList',this.pagefilters).then(res =>{
  	     this.AccessoryData = res.data.listData;
  	     this.page=res.data;
          this.seachValue=false;
        })
			},
			//分页
			changePageSize: function (val) {
				this.pagefilters.pageSize = val;
				this.pagefilters.currentPage = 1;
        this.getAccessList();
			},
			changeCurrentPage: function (val) {
				this.pagefilters.currentPage = val;
        this.getAccessList();
			},

		}
	}

</script>

<style scoped>


</style>

<template>
    <div id="outermost_wrap">
        <div id="sub_wrap">
            <CrumbsNav></CrumbsNav>
        </div>
        <div id="content_wrap">
          <el-row class="marginBottom"  :gutter="10">
            <el-col :span="6" class="optionValue">
              <el-input v-model="pagefilters.skuNo" size="small" placeholder="请输入SKU"></el-input>
            </el-col>
            <el-col :span="1">
              <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="getPartsList();">搜索</el-button>
            </el-col>
          </el-row>
          <el-row  id="filer" >
            <el-collapse v-model="activeNames">
              <el-collapse-item name="1">
                <span class="span_label">状态</span>
                <el-radio-group v-model="pagefilters.poStatus" size="small"   @change="pagefilters.skuNo ='';getPartsList();" >
                  <el-radio-button label="01"   v-if="ButtonInfo['待采购']!='0'">待采购</el-radio-button>
                  <el-radio-button label="02"   v-if="ButtonInfo['已采购']!='0'">已采购</el-radio-button>
                  <el-radio-button label="03"   v-if="ButtonInfo['已调拨']!='0'">已调拨</el-radio-button>
                </el-radio-group>
              </el-collapse-item>
            </el-collapse>
          </el-row>
          <el-row class="supplier_btn" v-if="ButtonInfo['筛选']!='0'" >
            <el-button size="small"  @click="dialogFlag.sccrenisOpen = true" type="primary" >筛选</el-button>
          </el-row>
          <el-row class="supplier_btn  last_btn" v-if="ButtonInfo['批量标记已采购']!='0'" >
            <el-button size="small"  @click="openSubmitDialog('','2');" type="primary"  v-if="pagefilters.poStatus == '01'">批量标记已采购</el-button>
          </el-row>
          <div id="item_list">
            <el-table  :data="partsData"  ref="partsData"  border tooltip-effect="dark"  @selection-change="batchChange"   style="width:100%;" >
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column  id="space" label="操作"  align="center" style="word-wrap:break-word;word-break:break-all;">
                <template scope="scope">
                  <el-tooltip content="标记已采购"  effect="dark" placement="bottom" v-if="scope.row.poStatus == '待采购'">
                    <i  class="iconfontyyy" @click="openSubmitDialog(scope.row,'1');" content="Bottom center">&#xe66f;</i>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="SKU图片"  prop="imageUrl" align="center"  sortable >
                <template scope="scope">
                  <img v-if="scope.row.productImageUrl!=null" :src="scope.row.productImageUrl" :data-src="scope.row.productImageUrl">
                </template>
              </el-table-column>
              <el-table-column label="SKU"    prop="skuNo" align="center"  sortable  ></el-table-column>
              <el-table-column label="产品名称" prop="cnName"  align="center" sortable >
              </el-table-column>
              <el-table-column label="发货物品图片"  prop="productImageUrl"  sortable align="center">
                <template scope="scope">
                  <img v-if="scope.row.imageUrl!=null" :src="scope.row.imageUrl" :data-src="scope.row.imageUrl">
                </template>
              </el-table-column>
              <el-table-column label="申请人"  align="center"  prop="reqUserName" sortable ></el-table-column>
              <el-table-column label="申请时间"  align="center"  prop="reqTime"  :formatter="tool.formatDate" sortable >
              </el-table-column>
              <el-table-column label="申请备注" align="center"  prop="reqMemo"  sortable ></el-table-column>
              <el-table-column label="状态" align="center"   prop="poStatus"  sortable ></el-table-column>
              <el-table-column label="处理备注" align="center" prop="poMemo"  sortable >
              </el-table-column>
              <el-table-column label="随同成品订单" align="center" prop="poNo"     sortable >
              </el-table-column>
              <el-table-column label="处理人" align="center" prop="poUser"    sortable >
              </el-table-column>
              <el-table-column label="处理时间" align="center" prop="poTime" :formatter="tool.formatDate"    sortable >
              </el-table-column>
            </el-table>
          </div>
        </div>
      <!--筛选-->
      <div class="smallDia">
        <el-dialog title="筛选" :visible.sync="dialogFlag.sccrenisOpen" size="small" :close-on-click-modal="false" @open="colseScreen();">
          <div class="data_body">
            <title-header></title-header>
<!--
            <text-input   condition-name="SKU"   @child-change-val="getChildren" :selectValue="skuNoo" text-type="skuNo"   ></text-input >
-->
            <el-row class="row">
              <el-col class="col" :span="4">SKU</el-col><el-col class="col" :span="4">是</el-col>
              <el-col class="col_input" :span="16">
                <SkuList  :selectValue="skuNoo" @child-change-val="getChildren" @child-list="getid" select-type="skuNo"></SkuList>
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col class="col" :span="4">创建人</el-col><el-col class="col" :span="4">是</el-col>
              <el-col class="col_input" :span="16">
                <FounderList :selectValue="pagefilters.userId"   @child-change-val="getChildren" select-type="userId">
                </FounderList>
              </el-col>
            </el-row>
            <time-data  condition-name='申请日期'  :start-time="pagefilters.startDate" :end-time="pagefilters.endDate" @child-value-Stime="getTime" @child-value-Etime="getTime"  ></time-data>
            <el-row class="row">
              <el-col class="col" :span="4">状 态</el-col><el-col class="col" :span="4">是</el-col>
              <el-col class="col_input" :span="16">
                <el-select size="small" v-model="pagefilters.poStatus" filterable clearable>
                  <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-col>
            </el-row>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="colseScreen">清除条件</el-button>
            <el-button @click="getPartsList(); dialogFlag.sccrenisOpen = false;">筛 选</el-button>
            <el-button @click="dialogFlag.sccrenisOpen = false;" >取 消</el-button>
          </div>
        </el-dialog>
      </div>
      <!--标记已采购-->
      <el-dialog title="标记为已采购" :visible.sync="dialogFlag.isOpen"  size="tiny" :close-on-click-modal="false" @open="" @close="deleteId();">
         <el-form labelWidth="90px">
           <el-form-item label="采购订单:">
             <el-input type="text" v-model="signData.poNo"></el-input>
           </el-form-item>
           <el-form-item label="处理备注:">
             <el-input type="textarea" v-model="signData.poMemo"></el-input>
           </el-form-item>
           <el-form-item label="提示:">
             <el-col style="color: red;">
               您在标记为已采购之前，请先前往成品采购添加

               SKU配件采购的备注。
             </el-col>
           </el-form-item>
         </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFlag.isOpen = false">取 消</el-button>
          <el-button type="primary"  @click="subMitsign();" :loading="$store.state.loading">确 定</el-button>
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
  import textInput from 'components/ScreenModular/textInput.vue'
  import LogisticsList from 'components/listData/getLogisticsList.vue'
  import timeData from "components/ScreenModular/timeDate.vue"
  import titleHeader from "components/ScreenModular/title.vue"
  import FounderList from 'components/listData/GetFounderList.vue'
  import SkuList from 'components/listData/getSkuList.vue'
  import ElForm from "../../../node_modules/element-ui/packages/form/src/form";
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";

  export default{
    components: {
      ElFormItem,
      ElForm,
      titleHeader,textInput,timeData,LogisticsList,FounderList,SkuList},
		data(){
			return {
        selectOptions: [{
          value: '01',
          label: '待采购'
        }, {
          value: '02',
          label: '已采购'
        },{
          value: '03',
          label: '已调拨'
        }],
        skuNoo:'',
        partsData:[],
        activeNames:['1'],
        dialogFlag:{
          sccrenisOpen:false,
          isOpen:false

        },
        signData:{
          reqIds:[],
          poNo:'',
          poMemo:'',
        },
        IdList:'',
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
          skuNo:'',
          poStatus:'01',
          userId:'',
          startDate:'',
          endDate:'',
				},
        ButtonInfo:{},//按钮权限列表20171227
			}
		},
		mounted: function () {
      this.getauthorityList();
			this.getPartsList();
		},
		methods: {
      /*********************页面按钮权限 20171227*****************************/
      getauthorityList(){
        var vm=this;
        vm.ButtonInfo=vm.tool.getBtnPermissions(vm.currentPath);
        console.log('horityList % 0',vm.ButtonInfo)

      },
      /*********************页面按钮权限 20171227*****************************/
      subMitsign(){
      	if(this.signData.poNo == '' || this.signData.poMemo == '' ){this.$message('请填写订单和备注！')}else{
          this.httpPost('partsApply/purchase',this.signData).then(res=>{
           if(res.data.result == true){
             this.$message(res.data.message);
             this.dialogFlag.isOpen = false;
             this.getPartsList();
           }else{
             this.$message(res.data.message);
           }
          })
        };
      },
      getid(data){
        this.skuNoo = data;
      },
      deleteId(){
      	this.signData.reqIds=[];
      	this.signData.poNo='';
        this.signData.poMemo='';
      },
      colseScreen(){
      	this.pagefilters.skuNo='';
      	this.skuNoo='';
        this.pagefilters.userId = '';
      	this.pagefilters.endDate='';
        this.pagefilters.startDate='';
      },
      getTime:function(val){
        val.type == 'start' ? this.pagefilters.startDate = val.value : this.pagefilters.endDate = val.value;
      },
      batchChange(val){
        this.IdList =[];
        this.IdList = val.map(item =>item.reqId);
      },
      openSubmitDialog(id,value){
        var vm = this;
      	value == '1' ? vm.signData.reqIds.push(id.reqId) : vm.signData.reqIds = vm.IdList;
        vm.signData.reqIds.length < 1 ? this.tips() : this.dialogFlag.isOpen = true;
      },

      getChildren(data){
        data.type === 'skuNo'? this.skuNoo = data.value : this.pagefilters.userId = data.value;
      },
      getPartsList(){
      	this.httpPost('partsApply/partsPurchaseList',this.pagefilters).then(res=>{
          this.partsData= res.data.listData;
          this.page=res.data;

        })
			},
			//分页
			changePageSize: function (val) {
				this.pagefilters.pageSize = val;
				this.pagefilters.currentPage = 1;
				this.requestem();
			},
			changeCurrentPage: function (val) {
				this.pagefilters.currentPage = val;
				this.requestem();
			},

		}
	}

</script>

<style scoped>


</style>

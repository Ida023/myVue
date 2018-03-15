<template>
    <div id="outermost_wrap">
        <div id="sub_wrap">
            <CrumbsNav></CrumbsNav>
        </div>
        <div id="content_wrap">
          <el-row class="marginBottom"  :gutter="10">
            <el-col :span="3">
              <el-select size="small" v-model="selectParams.optionTitle" filterable clearable @clear="" @change="">
                <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6" class="optionValue">
              <el-input v-model="selectParams.optionValue" :placeholder="getPlaceholder" size="small"></el-input>
            </el-col>
            <el-col :span="1">
              <el-button type="primary" size="small" @click="selectFilter();">搜索</el-button>
            </el-col>
          </el-row>
          <el-row  id="filer" class="marginBottom">
            <el-collapse v-model="activeNames">
              <el-collapse-item name="1">
                <span class="span_label">状态</span>
                <el-radio-group v-model="pagefilters.reqStatus" size="small"   @change="pagefilters.skuNo='';pagefilters.cnName='';selectParams.optionValue='';getAccessList();" >
                  <el-radio-button label="01"   v-if="ButtonInfo['待发货']!='0'">待发货</el-radio-button>
                  <el-radio-button label="02"   v-if="ButtonInfo['已发货']!='0'">已发货</el-radio-button>
                </el-radio-group>
              </el-collapse-item>
            </el-collapse>
          </el-row>
          <el-row class="marginBottom" style="border-bottom:1px solid #bfcbd9;padding-bottom: 10px; ">
            <!--<el-button size="small"  type="primary" @click="" >新建配件申请</el-button>-->
            <span style="margin-left:10px;color: red;">各销售人员注意：如果某个订单的某个SKU有两个，然而很不幸这两个的配件都broken了，你需要填写两条记录哦！因为仓库可能会拆两个新品</span>
          </el-row>
          <!--<el-row class="supplier_btn">
            <el-button type="primary" size="small"  @click="" >批量删除</el-button>
            <el-button type="primary" size="small" @click="" >批量申请</el-button>
          </el-row>-->
          <div id="item_list">
            <el-table  :data="AccessoryData"  ref="AccessoryData"  border tooltip-effect="dark"    style="width:100%;" >
              <el-table-column  id="space" label="操作"  align="center" style="word-wrap:break-word;word-break:break-all;">
                <template scope="scope">
                  <el-tooltip content="查看"  effect="dark" placement="bottom"   v-if="ButtonInfo['查看']!='0'">
                    <i  class="iconfontyyy" @click="getinfoModel.isOpen = true; dialogInfo = true;getinfoModel.title='查看';openDialog(scope.row);" content="Bottom center">&#xe600;</i>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="SKU"    prop="skuNo" align="center"  sortable  ></el-table-column>
              <el-table-column label="SKU图片"  prop="imageUrl" align="center"  sortable >
                <template scope="scope">
                  <img v-if="scope.row.productImageUrl!=null" :src="scope.row.productImageUrl" :data-src="scope.row.productImageUrl">
                </template>
              </el-table-column>
              <el-table-column label="商品名称" prop="cnName"  :formatter="tool.addTime" align="center" sortable >
              </el-table-column>
              <el-table-column label="订单ID"  prop="orderNo"  sortable align="center"></el-table-column>
              <el-table-column label="收件人信息" width="180"  align="left"  prop="" sortable  >
                <template scope="scope">
                  客户ID:{{scope.row.customerId}}<br>客户姓名:{{scope.row.customerName}}<br>地址1:{{scope.row.address1}}<br>市:{{scope.row.city}}<br>区:{{scope.row.district}}<br>州:{{scope.row.state}}<br>邮编:{{scope.row.postCode}}<br>手机:{{scope.row.phone}}<br>国家:{{scope.row.cuntryArea}}
                </template>
              </el-table-column>
              <el-table-column label="图片"  align="center"  prop="productImageUrl" sortable >
                <template scope="scope">
                  <img v-if="scope.row.imageUrl!=null" :src="scope.row.imageUrl" :data-src="scope.row.imageUrl">
                </template>
              </el-table-column>
              <el-table-column label="备注" align="center"  prop="reqMemo"  sortable ></el-table-column>

              <el-table-column label="数量" align="center"  prop="reqQty"  sortable ></el-table-column>
              <el-table-column label="状态" align="center"   prop="reqStatus"  sortable ></el-table-column>
              <el-table-column label="申请人" align="center" prop="reqUserName"  sortable >
              </el-table-column>
              <el-table-column label="申请时间" align="center" prop="reqTime" :formatter="tool.formatDate" sortable >
              </el-table-column>
            </el-table>
          </div>
        </div>
        <Accessory ref="accessory" :DialogTitle="getinfoModel.title" :getpoId="reqId" :getdata="dialogInfo" :infoisOpen="getinfoModel.isOpen" @Change-list="getchangeList"></Accessory>
      <div id="page" class="page">
        <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage"
                       :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
      </div>
    </div>
</template>
<script>
  import Accessory from './SonModula/AccessoryApplication.vue'
  export default{
    components: {Accessory},
		data(){
			return {
				dialogInfo:false,
        reqId:'',
        getinfoModel:{
          isOpen:false,
          type:'',
          title:''
        },
        AccessoryData:[],
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        //搜索下拉值
        selectOptions: [{
          value: 'SKU',
          label: 'SKU'
        }, {
          value: '产品名称',
          label: '产品名称'
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
          reqStatus:'01',
          cnName:'',
          skuNo:''
				},
        ButtonInfo:{},//按钮权限列表20171227
			}
		},
    computed:{
      getPlaceholder:function(){
        return this.selectParams.optionTitle == 'SKU' ? '请输入SKU' : this.selectParams.optionTitle == '产品名称' ? '请输入产品名称' :'' ;
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
      openDialog(row){
        this.reqId = row.reqId;
        //this.$refs.accessory.getList();
      },
      getchangeList( val ){
        this.getinfoModel.isOpen = false;
        this.dialogInfo = false;
      },
      //搜索确认
      selectFilter:function(){
        var _this=this;
          if(_this.selectParams.optionValue === '' ){
          }else {
            var value = _this.selectParams.optionValue;
            var title = _this.selectParams.optionTitle;
            if(value === '' || title === '' ){

            }else{
              if(title === 'SKU'){
                _this.pagefilters.skuNo = value;
                _this.pagefilters.cnName='';
              }else if(title === '产品名称'){
                _this.pagefilters.cnName=value;
                _this.pagefilters.skuNo='';
              }
              _this.getAccessList();
            }
        }
      },
      getAccessList(){
        this.httpPost('partsApply/list',this.pagefilters).then(res =>{
  	     this.AccessoryData=res.data.listData;
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

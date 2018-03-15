<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row class="filterOption" id="filterOption" >
        <el-col :span="2" class="optionValue">
          <el-select v-model="selectParams.optionTitle" filterable clearable size="small" @change="selectFilter();selectParams.optionValue=''">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="optionValue">
          <el-input v-model="selectParams.optionValue" :placeholder="getPlaceholder" class="input66" size="small" name="input66" @change="selectFilter()"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="getPictureList">搜索</el-button>
        </el-col>
        <!--<el-col :span="2">-->
          <!--<el-button type="primary" class="research_btn" size="small" @click="closeDialog(); getPictureList()">清除条件</el-button>-->
        <!--</el-col>-->
      </el-row>
      <el-row id="filers" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <div>
              <div class="stateDiv">
                <span class="span_label">仓库</span>
                <el-radio-group v-model="defaultData.whId" size="small" v-for="(item,index) in BasicsData1" >
                  <el-radio-button  :label="item.whId" >{{ item.whName }}</el-radio-button>
                </el-radio-group>
              </div>
              <div class="stateDiv">
                <span class="span_label">数量类型</span>
                <el-radio-group v-model="defaultData.type" @change="getPictureList()"  size="small">
                  <el-radio-button  label="3">全部</el-radio-button>
                  <el-radio-button  label="1">增加</el-radio-button>
                  <el-radio-button  label="0">减少</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-row>

      <div id="item_list" style="margin-top: 20px">
        <el-table :data="GetListData" border tooltip-effect="dark" style="width: 100%"   >
          <el-table-column sortable  label="SKU" align="center" prop="skuNo"></el-table-column>
          <el-table-column sortable prop="productName" label="商品名称" align="center"></el-table-column>
          <el-table-column sortable prop="tradingType" label="动作"  align="center"></el-table-column>
          <el-table-column sortable  label="操作前数量"  align="center" prop="inventoryQty"></el-table-column>
          <el-table-column sortable prop="inventoryQtyafter" label="操作后数量" align="center"></el-table-column>
          <el-table-column sortable prop="qtyState" label="数量增减" align="center"></el-table-column>
          <el-table-column sortable prop="userNo" label="操作人" align="center"></el-table-column>
          <el-table-column sortable label="操作时间" align="center" :formatter="tool.formatDate" prop="uptime" width="180px"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
  </div>
</template>
<script>
  import getOwnWarehouseList from "components/listData/getOwnWarehouseList";
  import ElForm from "../../../node_modules/element-ui/packages/form/src/form";
  import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";
  import ElCol from "element-ui/packages/col/src/col";
  import ElRow from "element-ui/packages/row/src/row";
  export default{
    name:'WarehouseJournal',
    components: {
      ElRow,
      ElCol,
      ElFormItem,
      ElForm,
      getOwnWarehouseList
    },
    data(){
      return {
        optionVal:'',    // 下拉选项值
        selectParams:{    //  下拉过滤
          optionValue:'',
          optionTitle:0,
        },
        defaultData:{
          skuNo:'',//Sku
          productName:'',//商品名称
          whId:'',//仓库id
          type:'3',//提交日期2
          currentPage:1,//当前页数
          pageSize:10,//页面显示条数
        },
        options: [
          {
           value: 0,
            label: 'SKU'
          },
          {
           value: 1,
            label: '商品名称'
         }],
        options2: [
          {
            value: 3,
            label: '深圳仓'
          },
          {
            value: 0,
            label: '英国仓'
          },
          {
            value: 1,
            label: '美国仓'
          }],
        page:{          // 分页参数
          currentPage:0,
          pageSize:10,
          totalCount:10,
          totalPage:1
        },
        activeNames: ['1'],    //  筛选 功能的折叠面板
        sels:[],    //批量删除已选的条目数
        BasicsData1:[],

      }
    },
    computed:{
      getPlaceholder:function(){
        return this.selectParams.optionTitle == 0 ? '请输入SKU' : this.selectParams.optionTitle == 1 ? '请输入商品名称':'';
      },
    },
    watch:{
      'defaultData.whId':{
        handler(val){
         this.getPictureList();

        }
      },
    },
    mounted () {
      this.getBasicsData();
//      this.getDemo()
    },
    methods: {
      getPictureList:function(){
        console.log('翻页传参 % O',this.defaultData);
        this.httpPost('warehouseAllotting/warehouseProductInfos',this.defaultData).then(res => {
          this.GetListData=res.data.listData;
          const pageData = res.data;
          this.page.currentPage = pageData.currentPage;
          this.page.totalCount = pageData.totalCount;
          this.page.totalPage = pageData.totalPage;
          this.page.pageSize = pageData.pageSize;
        }).catch(function(err){
          console.log(err);
        })
      },
      getBasicsData:function() {
        this.httpGet('productMaterial/getAllWareHouse').then(res=>{//始发仓
          this.BasicsData1=res.data;
          setTimeout(()=>{
            this.defaultData.whId=res.data[0].whId;
            this.getPictureList();
          },20)
        })
      },
      selectFilter:function(){
        var selectVal = this.selectParams.optionValue;
        var selectTittle = this.selectParams.optionTitle;
        var vm = this;
        switch(selectTittle){
          case 0:
            vm.defaultData.skuNo = selectVal ;
            vm.defaultData.productName = '' ;
            break;
          case 1:
            vm.defaultData.productName = selectVal ;
            vm.defaultData.skuNo = '' ;
            break;
          case 3:
            vm.defaultData.states = '' ;
            break;
        }
      },
      selsChange: function (sels) {
        this.sels = sels;
        console.log(this.sels)
        console.log(999887)
      },
      changePageSize:function(val){
        this.defaultData.pageSize=val;
        this.defaultData.currentPage = 1;
        this.getPictureList();
      },
      changeCurrentPage:function(val){
        this.defaultData.currentPage=val;
        this.getPictureList();
      },

    },
  }
</script>

<style scoped>
  .form-item{
    margin-bottom: 0px;
  }
  .breakAll{
    word-break: break-all;
  }
  .padding-style{
    padding:10px;
  }
  .box-style{
    border-top: solid 1px #ccc;
  }
  .span_label{
    margin-right: 20px;
    width: 200px;
  }
  .supplier_btn{
    padding:10px 0;
    border-bottom:solid 1px #e4e4e4;
  }
  .tatestyle{
    display: block;
    line-height: 41px;
    /*text-align: center;*/
    padding-left: 20px;
    min-height: 41px;
    border-right: 1px solid #e4e4e4
  }
  .stateDiv{
    margin-bottom: 5px;
  }
</style>

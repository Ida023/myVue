<template>
  <div>
      <el-row>
        <el-col :span="4">
          <el-select v-model="selectParams.optionTitle" filterable clearable @change="selectParams.optionValue=''">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="7" class="optionValue">
          <el-input v-model="selectParams.optionValue" :placeholder="getPlaceholder"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" class="research_btn" id="research_btn" size="small" @click="selectFilter">搜索</el-button>
        </el-col>
      </el-row>
      <div id="product_list_wrap" class="product_list_wrap">
        <div class="tree_data cate_tree">
          <div class="tree_title">
            <span>全部分类</span>
          </div>
          <el-tree :data="categoryList" accordion @node-expand="saveCurrentExpandedKey" :highlight-current="true" :props="defaultProps" node-key="id" :expand-on-click-node="true" @node-click="pageFilter.proName='';pageFilter.skuNo='';selectParams.optionValue='';getResponseData($event);"></el-tree>
        </div>
        <div class="content_data">
          <div class="table_data">
            <div id="item_list">
              <el-table border tooltip-effect="dark" :data="categoryListData"    @selection-change="selsChange" ref="tableData">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="图片" align="center" width="106px" >
                  <template scope="scope">
                    <img  v-if="scope.row.imageUrl!=null" :src="scope.row.imageUrl" >
                  </template>
                </el-table-column>
                <el-table-column label="SKU"   prop="skuNo" align="center"  sortable></el-table-column>
                <el-table-column label="商品名称"  prop="cnName" align="center"  sortable ></el-table-column>
                <el-table-column sortable align="center" prop="productWeight" label="重量" ></el-table-column>
                <el-table-column label="长"   prop="productLength" align="center"  sortable ></el-table-column>
                <el-table-column label="宽"   prop="productWidth" align="center"  sortable ></el-table-column>
                <el-table-column label="高"   prop="productHeight" align="center"  sortable ></el-table-column>
              </el-table>
            </div>
          </div>
          <div class="page" style="margin-top: 20px;">
            <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
    export default{
        data(){
            return {
              categoryList: [],
              saveCurrentExpandedKey: this.defaltKey,
              defaultProps: {
                children: 'subCategoryList',
                label: 'categoryName'
              },
              categoryListData:[],
              pageFilter:{
                currentPage:1,
                pageSize:10,
                categoryId:'',
                proName:'',
                skuNo:'',
                listingProductId:''
              },
              page:{          // 分页参数
                currentPage:1,
                pageSize:10,
                totalCount:10,
                totalPage:10
              },
              optionVal:'',    // 下拉选项值
              selectParams:{    //  下拉过滤
                optionValue:'',
                optionTitle:'SKU',
              },
              options: [{value: 'SKU', label: 'SKU'}, {value: '产品名称', label: '产品名称'}, {value: 'listingProductId', label: 'FNSKU'}],
              sels:[],
            }
        },
        props:['defaultKey'],
        computed:{
          getPlaceholder:function(){
            return this.selectParams.optionTitle == 'SKU' ? '多个SKU请用逗号,分隔开' : this.selectParams.optionTitle == '产品名称' ? '请输入产品名称':this.selectParams.optionTitle == 'listingProductId'?'请输入FNSKU':'';
          },
      },
        mounted () {
          this.getCategoryList();
          this.getResponseData('');
        },
        methods: {
          resetData:function(){
              this.page.currentPage = 1;
              this.getResponseData('');
              this.getCategoryList();
          },
          clearSels:function(){
            this.$refs.tableData.clearSelection();
          },
          selsChange:function(sels){
            this.sels = sels;
          },
          returnData:function(){
              return this.sels;
          },
          selectFilter:function(){
            var selectVal = this.selectParams.optionValue;
            var selectTittle = this.selectParams.optionTitle;
            var vm = this;
            switch(selectTittle){
              case 'SKU':
                vm.pageFilter.skuNo = selectVal ;
                vm.pageFilter.listingProductId = '' ;
                vm.pageFilter.proName = '' ;
                this.getResponseData('');
                break;
              case '产品名称':
                vm.pageFilter.proName = selectVal ;
                vm.pageFilter.listingProductId = '' ;
                vm.pageFilter.skuNo = '' ;
                this.getResponseData('');
                break;
              case 'listingProductId':
                vm.pageFilter.listingProductId = selectVal ;
                vm.pageFilter.proName = '' ;
                vm.pageFilter.skuNo = '' ;
                this.getResponseData('');
                break;
            }
          },
          getCategoryList: function () {
            this.httpPost('selectAllCategoryList').then(res => {
              if (res.data.result == true) {
                this.categoryList = res.data.params.mapList;
              }
            })
          },
          getResponseData:function(data) {
            data != '' ? this.pageFilter.categoryId = data.categoryId : this.pageFilter.categoryId = '';
            this.httpPost('product/listCargo', this.pageFilter).then(res => {
              const pageData = res.data;
              this.page = pageData;
              this.categoryListData = pageData.listData;
            }).catch(function (err) {
              console.log(err);
            });
          },
          changePageSize: function (val) {
            this.pageFilter.pageSize = val;
            this.pageFilter.currentPage = 1;
            this.getResponseData('');
          },
          changeCurrentPage: function (val) {
            this.pageFilter.currentPage = val;
            this.getResponseData('');
          },
        },
        watch:{
            'defaltKey':{
                handler(val){
                    this.saveCurrentExpandedKey = val;
                }
            }
        }
    }
</script>

<style scoped>
    [v-cloak] {
        display: none;
    }
    #add_product_wrap{
      display:-webkit-box;
      display:-webkit-flex;
      display:-ms-flexbox;
      display:flex;
      -webkit-box-orient:vertical;
      -webkit-flex-direction:column;
      -ms-flex-direction:column;
      flex-direction:column;
      width:100%;
      height:100%;
    }
    .add_product_wrap{
      overflow-x: hidden;
    }
    #add_product_wrap #product_list_wrap{
      padding:10px 0 20px 0;
      flex:1;
      display: flex;
    }
    .product_list_wrap .tree_data{
      min-width: 180px;
      max-height:430px;
      min-height:430px;
    }
    .tree_data .el-tree{
      height: 100%;
      overflow: auto;
      border: 1px solid #d1dbe5;
      font-size:14px;
      max-width: 240px;
    }
    .product_list_wrap .content_data{
      margin-left:10px;
      flex:1;
      display: flex;
      max-height:430px;
      flex-direction:column;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .content_data .table_data{
      flex:1;
    }
    .tree_data .tree_title{
      padding: 10px 5px;
      border: 1px solid #d1dbe5;
      border-bottom: none;
    }
    .optionValue{
      margin:0 10px;
    }
    .research_btn{
      padding:9px 12px;
    }
</style>

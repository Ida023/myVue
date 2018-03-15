<template>
  <div id="outermost_wrap" class="user_manager_wrap">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap" class="content_wrap">
      <el-row id="filer" class="supplierFiler">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <span class="span_label">类型</span>
            <el-radio-group v-model="type" size="small" @change="getPerList">
              <el-radio-button  label="1">开发人员</el-radio-button>
              <el-radio-button  label="2">摄影人员</el-radio-button>
              <el-radio-button  label="3">P图人员</el-radio-button>
            </el-radio-group>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <div id="item_list">
        <el-table :data="perListData" border tooltip-effect="dark" style="width: 100%">
          <el-table-column sortable prop="userName" label="人员" align="center"></el-table-column>
          <el-table-column sortable prop="thisWeekData" label="本周" align="center"></el-table-column>
          <el-table-column sortable prop="lastWeekData" label="上周"  align="center"></el-table-column>
          <el-table-column sortable prop="theWeekBeforeLastData" label="上上周"  align="center"></el-table-column>
          <el-table-column sortable prop="thisMonthData" label="本月"  align="center"></el-table-column>
          <el-table-column sortable prop="lastMonthData" label="上月" align="center"></el-table-column>
          <el-table-column sortable prop="thisYearData" label="本年"  align="center"></el-table-column>
          <el-table-column sortable prop="lastYearData" label="上年"  align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div id="page" class="page">
      <div class="remark">
        <span v-if="type == 1">提交开发/生成商品</span>
        <span v-if="type == 2">处理SKU数量</span>
        <span v-if="type == 3">处理SKU数量/提交图片张数</span>
      </div>
      <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
    </div>
  </div>
</template>
<script>
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button";
  import ElInput from "../../../node_modules/element-ui/packages/input/src/input";
  export default{
    components: {
      ElInput,
      ElButton,},
    data(){
      return {
        type:1,
        pageFilter:{
          currentPage:1,
          pageSize:10,
        },
        page:{          // 分页参数
          currentPage:1,
          pageSize:10,
          totalCount:10,
          totalPage:10
        },
        activeNames: ['1'],    //  筛选 功能的折又又叠面板
        perListData:[],
      }
    },
    computed:{},
    mounted () {
      this.getPerList();
    },
    methods: {
      getPerList:function(){
        console.log('翻页传参 % O',this.pageFilter);
        var url = this.type == 1 ? 'performanceRecord/selectDevelopHis' : this.type == 2 ? 'performanceRecord/selectPhotographyHis' : 'performanceRecord/selectImagedesignHis';
        this.httpPost(url,this.pageFilter).then(res => {
          if(res.data.result == true){
            console.log(res);
            const pageData = res.data.params.docsDataList;
            this.page.currentPage = pageData.currentPage;
            this.page.totalCount = pageData.totalCount;
            this.page.totalPage = pageData.totalPage;
            this.page.pageSize = pageData.pageSize;
            this.perListData = pageData.listData;
            console.log('  ---userListData % O',this.perListData);
          }else{
            this.perListData = [];
            console.log('请求无数据');
          }
        }).catch(function(err){
          console.log(err);
        })
      },
      changePageSize:function(val){
        this.pageFilter.pageSize=val;
        this.pageFilter.currentPage = 1;
        this.getPerList();
      },
      changeCurrentPage:function(val){
        this.pageFilter.currentPage=val;
        this.getPerList();
      },
    }
  }
</script>

<style scoped>
  [v-cloak] {
    display: none;
  }
  #filer .el-collapse {
    margin-top: 0px;
    margin-bottom:20px;
  }
  .span_label{
    font-weight:bold;
    margin-right:10px;
  }
  .page .remark{
    margin:20px 0 30px 20px;
    color: #48576a;
  }
</style>

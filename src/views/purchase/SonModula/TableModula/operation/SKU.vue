<template>
  <div>
      <el-row class="marginBottom"  :gutter="10">
        <el-col :span="4">
          <el-select size="small" v-model="assistlist.selectParams.optionTitle" filterable clearable @change="valueFn">
            <el-option v-for="item in assistlist.selectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="optionValue">
          <el-input v-model="assistlist.selectParams.optionValue" :placeholder="getPlaceholderr" size="small" @change="valueFn2"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" size="small" @click="getlist()">搜索</el-button>
        </el-col>
      </el-row>
    <el-row :span="24">
        <el-col :span="6" class="classLeft">
          <span @click="getlistall()" class="classAll">全部分类</span>
          <el-col  class="cate_tree">
          <el-tree class="classborder" :data="assistlist.data" :props="assistlist.defaultProps" @node-click="handleNodeClick"></el-tree>
          </el-col>
        </el-col>
        <el-col :span="17"  class="classRight">
          <el-table border class="publicCell" tooltip-effect="dark" :data="assistlist.listData"  @selection-change="selsChange" ref="SKUTable">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="图片"   prop="imageUrl" align="center"   >
              <template scope="scope">
                <img  v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="scope.row.imageUrl" :data-src="scope.row.imageUrl">
              </template>
            </el-table-column>
            <el-table-column label="SKU"   prop="skuNo" align="center"  sortable></el-table-column>
            <el-table-column label="MSKUAsin"  prop="listingProductId" align="center"  sortable ></el-table-column>
            <el-table-column label="商品名称"  prop="cnName" align="center"  sortable ></el-table-column>
            <el-table-column label="在途库存"   prop="" align="center"  sortable ></el-table-column>
            <el-table-column label="可用库存"   prop="" align="center"  sortable ></el-table-column>
            <el-table-column label="故障品库存"   prop="" align="center"  sortable ></el-table-column>
          </el-table>
          <div  class="block page">
            <el-pagination
              @size-change="handleSizeChange('1',$event)"
              @current-change="handleCurrentChange('1',$event)"
              :current-page="assistlist.page.currentPage"
              :page-sizes="[10, 20, 30, 50,100]"
              :page-size="assistlist.page.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="assistlist.page.totalCount">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
  </div>

</template>

<script>
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  export default {
    name:'SKU',
    props:['Selected','scene'],
    components: {
      ElCol,
      ElRow},
    data() {
      return {
        //添加组合商品
        assistlist:{
          dialoglist:[],
          data:[],
          defaultProps:{
            label:'cnName',
            children:'categorys'
          },
          sels:[],    //批量删除已选的条目数
          listData:[],
          page: {
            currentPage: 1, //当前页数
            pageSize: 10, //每页条数
            totalCount: 0, //总共条数
            totalPage: 0, //总共页数
            listData: []
          },
          pagefilters:{
            skuNo:'',
            cnName:'',
            categoryId:'',
            currentPage:1,
            pageSize:10,
            includeAssemby:'1',
            shopAccountId:'',
            listingProductId:''
          },
          classifybuteTree:[],
          optionVal:'',    // 下拉选项值
          selectParams:{    //  下拉过滤
            optionValue:'',
            optionTitle:'0',
          },
          selectOptions: [{
            value: '0',
            label: 'SKU'
          }, {
            value: '1',
            label: '产品名称'
          },
            {
              value: '2',
              label: 'FNSKU'
            }],
          assistisOpen:false,
          info:[],

        },
      };
    },
    computed:{
      getPlaceholder:function(){
        return this.selectParams.optionTitle == 'SKU' ? '请输入SKU' : this.selectParams.optionTitle == '产品名称' ? '请输入产品名称' :'请输入SKU' ;
      },
      getPlaceholderr:function(){
        return this.assistlist.selectParams.optionTitle === '0' ? '多个SKU请用,隔开' : this.assistlist.selectParams.optionTitle === '1' ? '请输入产品名称' :'FNSKU' ;
      },
    },
    mounted () {
      this.getlist();
      this.getassdialog();
    },
    methods: {
        addSku:function () {
          this.httpPost('stockProductPlan/getProductInfos',this.info).then(res=>{
              console.log(res);
//            for(let i=0; i<res.data.length; i++){
//              let ifInput=true;
//              this.$set(res.data[i],'ifInput',ifInput)//输入框切换，需要每个小行有个判断值
//            }
            this.$emit('addSeeTableData',res.data)
          })
        },
      valueFn: function (val) {
        this.assistlist.selectParams.optionValue=''
      },
      valueFn2: function () {
        this.assistlist.pagefilters.skuNo=''
        this.assistlist.pagefilters.cnName=''
        this.assistlist.pagefilters.listingProductId=''
        switch (this.assistlist.selectParams.optionTitle){
          case '0':
            this.assistlist.pagefilters.skuNo=this.assistlist.selectParams.optionValue;
            break
          case '1':
            this.assistlist.pagefilters.cnName=this.assistlist.selectParams.optionValue;
            break
          case '2':
            this.assistlist.pagefilters.listingProductId=this.assistlist.selectParams.optionValue;
            break
        }
      },
      deleteSku:function (val) {//打开Sku 一些重置动作
        this.assistlist.pagefilters.shopAccountId=val
        this.$refs.SKUTable.clearSelection()
        this.getlist();
      },
      selsChange: function (sels) {//批量操作获取SKU
        console.log(sels)
        this.sels = [];
        this.info = [];
        for(let i=0; i<sels.length;i++){
          let obj = {
            productId:'',
            productListingId:''
          }
          this.sels.push(sels[i].productId)
          obj.productId=sels[i].productId
          obj.productListingId=sels[i].listingProductId
          console.log(sels.length)
          this.info.push(obj)
        }
        console.log(this.info)
      },
      getlist(){
        this.httpPost('product/listCargo',this.assistlist.pagefilters).then(res=>{
          this.assistlist.page = res.data;
          this.assistlist.listData = res.data.listData;
        });
      },
      handleNodeClick(data){
          console.log(data)
        this.assistlist.pagefilters.categoryId = data.categoryId;
        this.getlist();
      },
      //批量
      handleSelectionChange(val){
        this.batchList = val;
      },
      getassdialog(val){
        var _this = this;
        _this.assistisOpen = true;
        _this.getlist();
        _this.httpPost('productCategory/getList').then( res => {
          _this.assistlist.data = res.data;
          var digui = function(val){
            for( var i=0;i<val.length;i++ ){
              if(val[i].categorys){
                if(!val[i].categorys.length){
                  delete val[i].categorys;
                }else{
                  digui(val[i].categorys);
                }
              } else{
                continue;
              }
            }
          };
          digui(_this.assistlist.data);
        })
      },
      handleSizeChange(arr,val) {
        arr == '0' ? this.pagefilters.pageSize = val : this.assistlist.pagefilters.pageSize = val;
        if(arr == '0'){
          this.requestem();
        }else{
          this.getassdialog();
        }

      },
      handleCurrentChange(arr,val) {
        arr == '0' ? this.pagefilters.currentPage = val : this.assistlist.pagefilters.currentPage = val;
        if(arr == '0'){
          this.requestem();
        }else{
          this.getassdialog();
        }
      },
      getlistall(){
        this.assistlist.pagefilters.skuNo='';
        this.assistlist.pagefilters.cnName='';
        this.assistlist.pagefilters.categoryId='';
        this.assistlist.pagefilters.currentPage=1;
        this.assistlist.pagefilters.pageSize=10;
        this.getlist();
      },
    },
    watch: {
      'Selected':{
        handler(val){
          this.options=val.Selected;
          this.dis=val.dis;
          this.scene=this.Selected.scene;
        },
        deep: true
      },
      'options':{
        handler(val){
          this.$emit('assignment',{
            value: val,
            scene:this.scene,
            sign: 'accounts'
          })
        }
      }
    }
  };

</script>

<style scoped>
  .classAll{
  //text-align: left;
    padding-left: 24px;
    display: inline-block;
    width: 100%;
    line-height: 36px;
  // border: 1px solid rgb(209, 219, 229);
    //border-bottom: 1px solid rgb(209, 219, 229);
    cursor: pointer;
    box-sizing: border-box;
  }
  .classLeft{
    max-width: 400px;
    height: 460px;
    border:1px solid #ccc;
    margin-right: 10px;
    overflow: auto;
  }
  .classRight{
    max-height: 460px;
    overflow: auto;
  }
  .el-tree.classborder{
    border:none!important;
  }
  .classAll:hover{
    background: #eef1f6;
  }
</style>

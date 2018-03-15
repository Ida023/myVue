<template>
  <div>
    <el-dialog title="添加货品" :visible.sync="dialogFlag.isOpen" :close-on-click-modal="false" size="small" id="add_product_wrap" class="add_product_wrap" @close="closeDialog">
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
        <div class="tree_data">
          <div class="tree_title">
            <span>全部分类</span>
          </div>
          <el-tree :data="data" accordion @node-expand="saveCurrentExpandedKey" :highlight-current="true" :props="defaultProps" node-key="id" :expand-on-click-node="true" @node-click="getResponseData"></el-tree>
        </div>
        <div class="content_data">
          <div class="table_data">
            <div id="item_list">
              <el-table border tooltip-effect="dark" :data="listData"   @selection-change="">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="图片"   prop="imageUrl" align="center"   >
                  <template scope="scope">
                    <img  v-if="scope.row.imageUrl!=null" style="width: 70px; height: 70px" :src="scope.row.imageUrl" :data-src="scope.row.imageUrl">
                  </template>
                </el-table-column>
                <el-table-column label="SKU" prop="status" align="center"  sortable></el-table-column>
                <el-table-column label="MSKUAsin" prop="status" align="center"  sortable ></el-table-column>
                <el-table-column label="商品名称"  prop="status" align="center"  sortable ></el-table-column>
                <el-table-column label="在途库存"  prop="status" align="center"  sortable ></el-table-column>
                <el-table-column label="可用库存"  prop="status" align="center"  sortable ></el-table-column>
                <el-table-column label="故障品库存" prop="status" align="center"  sortable ></el-table-column>
              </el-table>
            </div>
          </div>
          <div class="page" style="margin-top: 20px;">
            <el-pagination @size-change="changePageSize" @current-change="changeCurrentPage" :current-page="page.currentPage" :page-sizes="[10,20,30,40]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalCount"></el-pagination>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">关 闭</el-button>
        <el-button type="primary" @click="closeDialog" :loading="$store.state.loading">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
    export default{
        data(){
            return {
              data: [{
                label: '一级 1',
                children: [{
                  label: '二级 1-1',
                  children: [{
                    label: '三级 1-1-1'
                  }]
                }]
              }, {
                label: '一级 2',
                children: [{
                  label: '二级 2-1',
                  children: [{
                    label: '三级 2-1-1'
                  }]
                }, {
                  label: '二级 2-2',
                  children: [{
                    label: '三级 2-2-1'
                  }]
                }]
              }, {
                label: '一级 3',
                children: [{
                  label: '二级 3-1',
                  children: [{
                    label: '三级 3-1-1'
                  }]
                }, {
                  label: '二级 3-2',
                  children: [{
                    label: '三级 3-2-1'
                  }]
                }]
              }],
              defaultProps: {
                children: 'children',
                label: 'label'
              },
              listData:[{status:1},{status:1},{status:1},],
              pageFilter:{
                currentPage:1,
                pageSize:10,
                skuNo:'',
                addUser:'',
              },
              page:{          // 分页参数
                currentPage:1,
                pageSize:10,
                totalCount:10,
                totalPage:10
              },
              dialogFlag:{
                isOpen:this.open,
              },
              sels:[],    //批量删除已选的条目数
              optionVal:'',    // 下拉选项值
              selectParams:{    //  下拉过滤
                optionValue:'',
                optionTitle:0,
              },
              options: [{
                value: 3,
                label: '全部'
              },{
                value: 0,
                label: 'SKU'
              }, {
                value: 1,
                label: '上传者'
              }],
              proData:111111,
              transmit:false,
            }
        },
        props:['open'],
        computed:{
          getPlaceholder:function(){
            return this.selectParams.optionTitle == 0 ? '请输入SKU' : this.selectParams.optionTitle == 1 ? '请输入上传者':'';
          },
      },
        mounted () {

        },
        methods: {
          closeDialog:function(){
            this.dialogFlag.isOpen = false;
            this.transmit = !this.transmit;
            this.selectParams.optionTitle = 3;
          }
        },
        watch:{
            'transmit':{
                handler(val){
                    this.$emit('add-pro-data',{
                        value:this.proData,
                        open:this.dialogFlag.isOpen
                    })
                }
            },
            'open':{
                handler(val){
                    this.dialogFlag.isOpen = val;
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
      min-width: 100px;
      max-height:430px;
    }
    .tree_data .el-tree{
      height: 100%;
      overflow: auto;
      border: 1px solid #d1dbe5;
      font-size:14px;
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

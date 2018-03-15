<template>
  <div>
    <!------------------打印商品标签--------------------------->
    <el-dialog title="打印商品标签" :visible.sync="printDialog" :close-on-click-modal="false" :modal="false">
      <el-table :data="printData" border tooltip-effect="dark" style="width: 100%">
        <el-table-column label="操作"  prop="label" align="center"  width="150">
          <template scope="scope">
            <el-tooltip content="打印"  effect="dark" placement="bottom">
              <i class="iconfontyyy" content="Bottom center" @click="printProduct(scope.row)">&#xe638;</i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column sortable prop="poNo" label="采购订单编号" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column sortable prop="poDate" label="采购单生成时间" :formatter="tool.formatDate"  width="180px" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column sortable prop="poBatchNo" label="批次号（R.N）"  align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column sortable prop="skuNo" label="SKU"  align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column sortable prop="purchaseUser" label="跟单"  align="center" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="printDialog = false;">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        deptList:[],   //
        printData:[],   //
        modelData:[{value:'1',label:'测试数据1'},{value:'2',label:'测试数据2'},{value:'3',label:'测试数据3'},{value:'4',label:'测试数据4'}],   //
        formData:{
            content:'',
            title:'11',
            modelType:'',
        },
        id:this.idValue,
        printDialog:false,
      }
    },
    props:['idValue','isOpen',],
    mounted () {
    },
    methods: {
      getData(){
        this.httpGet('poItem/selectListByProductId',{productId:this.idValue},'Scm').then(res =>{
          if(res.data.result == true){
            this.printData = res.data.params.listData;
            this.printDialog = true;
          }else{
            this.$message(res.data.message);
          }
        })
      },
      printProduct:function (row){
        //  模块 scm
        var url = this.RmsUrl+'poItem/selectProductLable?Authorization='+sessionStorage.getItem('userSession')+'&productId='+row.productId+'&poId='+row.poId;
        window.open(url);
        //this.tool.openPostWindow(url,params,'导出')
      },
      resetForm:function(formName) {
        this.$refs[formName].resetFields();
      },
    },
    watch:{
      'idValue':{
          handler(val){
            this.id = val;
          },
          deep:true
      },
      'isOpen':{
          handler(val){
            this.printDialog = true;
            this.getData();
          },
      },
    }
  }
</script>
<style scoped>
</style>

<template>
<div class="table_border">
    <el-table  :data="stockObject"  ref="stockObject"  border tooltip-effect="dark"    style="width:100%;">
      <el-table-column label="图片"    prop="poNo" align="center"  sortable  >
        <template scope="scope">
          <img v-if="scope.row.imageUrl!=null" :src="scope.row.imageUrl" width="70px" height="70px" :data-src="scope.row.imageUrl">
        </template>
      </el-table-column>
      <el-table-column label="SKU/名称"  prop="skuNo" align="center"  width="200" sortable >
        <template scope="scope">
          <span>{{scope.row.skuNo}}/{{scope.row.cnName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购数量" prop="poQty" align="center" sortable >
       <!-- <template scope="scope">
          <el-input type="text" v-model="scope.row.poQty"  :disabled="inputDisabled"></el-input>
        </template>-->
      </el-table-column>
      <el-table-column label="单位"  prop="itemUnit"  sortable align="center"></el-table-column>
      <el-table-column label="到货状况"  align="center"  prop="isArrive" sortable >
        <template scope="scope">
          <span>{{scope.row.isArrive == true ?  '是' : '否'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库数量"  align="center"  prop=""  sortable >
        <template scope="scope">
        <span>{{scope.row.receiveQty}}</span> / <span>{{scope.row.defectiveQty}}</span>
        </template>
      </el-table-column>
       <el-table-column label="重量（kg）" align="center"  prop="productWeight"  sortable ></el-table-column>
      <el-table-column label="体积（cm³）" align="center"   prop="productVolume"  sortable ></el-table-column>
     <el-table-column label="单价" align="center" prop="price"  sortable >
        <template scope="scope">
          <el-input type="text" v-model="scope.row.price"  :disabled="inputDisabled"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="小计" align="center" prop="totalAmount"  sortable >
        <template scope="scope">
         <span>{{Number(scope.row.price) * Number(scope.row.poQty)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注详情" align="center" prop="remarksDetails"  sortable width="400" >
        <template scope="scope">
          <el-row v-for="item in scope.row.remarksDetails"  :key="item.itemNo">
            <span>{{item.itemNo}}</span>/<span>{{item.poQty}}</span>/<span>{{item.whName}}</span>/<span>{{item.transportType}}<br></span>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="报关数量" align="center" prop="remarksDetails"  sortable >
        <template scope="scope">
          <el-switch  :disabled="inputDisabled"
            v-model="item.isCustoms"
            on-text="是"
            off-text="否" v-for="item in scope.row.remarksDetails"  :key="item.cnName">
          </el-switch>
          <!--<el-row v-for="item in scope.row.remarksDetails"  :key="item.cnName">
            <span>{{item.isCustoms == true ? '是':'否'}}<br></span>
          </el-row>-->
        </template>
      </el-table-column>
    </el-table>
</div>
</template>
<script>
    export default{
    	name:'proList',
      components: {},
      data(){
            return {
              stockObject:[],
              dataValue:false,
              listId:this.getpoId,
              inputDisabled:this.dis
            }
        },
      props:['getpoId','dis','tabtype','isopen'],
        methods: {
          getList(){
            this.httpPost('/productPurchase/query?poId='+this.getpoId).then(res=>{
                this.stockObject = res.data.stockObject;
            })
          },
          remove(){
          	this.stockObject=[];
          },
          submitList(){
          	var obj={};
          	var vm=this;
          	obj.poId = vm.getpoId;
          	obj.stockObject = vm.stockObject;
          	obj.delivery ={};
            for(let i=0;i<this.stockObject.length;i++){
              if(vm.stockObject[i].poQty < 0 || vm.stockObject[i].price < 0){
                vm.$message('采购数量和单价不能为空！')
              }else{
                vm.httpPost('/productPurchase/edit',obj).then(res=>{
                  if(res.data.result == true){
                    vm.$message(res.data.message);
                    vm.dataValue = true;
                    this.getList();
                    vm.$emit('child-list',vm.dataValue);
                  }else{
                    vm.$message(res.data.message);
                    vm.dataValue = false;
                    vm.$emit('child-list',vm.dataValue);
                  }
                })
              }
            }
          },
        },
      mounted () {
       this.getList();
      },
      watch: {
        'isopen':{
          handler(val){
           if(val==true){
             this.getList();
           }
          },
        },

        'getpoId':{
          handler(val){
            this.listId = val;
           // this.getList();
          },
        },
        'dis':{
          handler(val){
            this.inputDisabled = val;
          },
        },
        'stockObject': {
          handler: function (val) {
            this.$emit('child-list',{
              Model: val,
              type:this.tabtype
            });
          },
          deep: true,
        },
      },
    }

</script>

<style scoped>


</style>

<template>
  <div>
    <div class="table_padding">
      <el-table :data="data" border tooltip-effect="dark" style="width: 100%" >
        <el-table-column sortable align="center" label="图片" width="106px">
          <template scope="scope">
            <img :src="scope.row.picture" width="70px" height="70px">
          </template>
        </el-table-column>
        <el-table-column sortable align="center" prop="skuNo" label="SKU" ></el-table-column>
        <el-table-column sortable align="center" prop="proName" label="商品名称" ></el-table-column>
        <el-table-column sortable align="center" prop="whName" label="所属仓库" ></el-table-column>
        <el-table-column sortable align="center" prop="locaNo" label="库位号" ></el-table-column>
        <el-table-column sortable align="center" prop="oldInvQty" label="在库库存" ></el-table-column>
        <el-table-column sortable align="center" label="盘点库存" width="120px">
          <template scope="scope">
            <span v-show="disabled === true">{{scope.row.newInvQty}}</span>
            <el-input v-show="disabled !== true" type="number" min='1' v-model="scope.row.newInvQty" @change="calculateQty($event,scope.$index,data)"></el-input>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" prop="qty" label="盘盈/盘亏"></el-table-column>
        <el-table-column label="操作" width="120" align="center" v-if="column === true">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
              <i class="iconfontyyy"  @click="deleteData(scope.row,scope.$index,data)">&#xe6f7;</i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return {
        data:this.tableData,
        column:this.btnColumn,
        disabled:this.isDisable,
      }
    },
    props:['tableData','btnColumn','isDisable'],
    mounted(){
    },
    methods: {
      calculateQty:function(val,index,data){
        if(val>0){
            data[index].qty = val - data[index].oldInvQty;
            if(data[index].qty > 0){
                data[index].qty = '+'+data[index].qty+''
            }
        }else{
          data[index].qty = '';
        }
      },
      deleteData:function(row,index,data){
        data.splice(index,1)
      },
      submit:function(){
          var flag = this.data.every(function(item){
              return item.poNo>0;
          })
          if(flag){
               return this.data;
          }else{
              this.$message('盘点库存不能小于零！')
          }
      }
    },
    watch: {
      'data':{
          handler(val){
              this.$emit('child-change-val',{
                  value:val,
              })
          }
      },
      'tableData':{
          handler(val){
              this.data = val;
          }
      },
      'btnColumn':{
          handler(val){
              this.column = val;
          }
      },
      'isDisable':{
        handler(val){
          this.disabled = val;
        }
      },
    }
  }
</script>
<style scoped>
</style>

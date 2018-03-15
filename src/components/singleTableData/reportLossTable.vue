<template>
  <div>
    <div class="table_padding">
      <el-table :data="data" border tooltip-effect="dark" style="width: 100%" >
        <el-table-column sortable align="center"  label="图片" width="106px">
          <template scope="scope">
            <img  v-if="scope.row.picture!=null" :src="scope.row.picture" >
          </template>
        </el-table-column>
        <el-table-column sortable align="center" prop="skuNo" label="SKU" ></el-table-column>
        <el-table-column sortable align="center" prop="proName" label="商品名称" ></el-table-column>
        <el-table-column sortable align="center" prop="whName" label="所属仓库" ></el-table-column>
        <el-table-column sortable align="center" prop="oldInvQty" label="在库库存" ></el-table-column>
        <el-table-column sortable align="center" prop="newInventoryQty" :label="colunmTitle" width="120px">
          <template scope="socpe">
            <span v-if="disabled === true">{{socpe.row.newInventoryQty}}</span>
            <el-input v-if="disabled !== true" type="number"  v-model="socpe.row.newInventoryQty"></el-input>
          </template>
        </el-table-column>
        <el-table-column sortable align="center" prop="deviationQty" label="故障品库存"></el-table-column>
        <el-table-column label="操作" width="120" align="center" v-if="column == true">
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
        colunmTitle:this.title,
      }
    },
    props:['tableData','btnColumn','isDisable','title'],
    mounted(){
    },
    methods: {
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
              this.$message('报损/溢数量不能小于零！')
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
      'title':{
        handler(val){
          this.colunmTitle = val;
        }
      },
    }
  }
</script>
<style scoped>
</style>

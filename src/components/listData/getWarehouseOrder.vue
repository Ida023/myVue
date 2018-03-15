<template>
    <div class="selectorCom">
      <el-select v-model="selectVal" filterable :placeholder="placeholder" :multiple="isMultiple" :disabled="disabled" >
        <el-option v-for="item in modalData" :label="item.whName" :key="item.whId" :value="item.whId"></el-option>
      </el-select>
    </div>
</template>
<script>
  export default{
    data(){
      return {
        selectVal:this.selectValue,
        type:this.selectType,
        modalData:[],
        placeholder:this.placeValue,
        noData:this.noDataText,
        disabled:this.isDisabled,
        multiple:this.isMultiple,

      }
    },
    props:['selectValue','placeValue','isDisabled','isMultiple'],
    mounted(){
        this.getData();   // 获取发货仓库
    },
    methods: {
      getData(){
        this.httpGet('warehouse/selectAllList','','Lwms').then(res =>{
          this.modalData =res.data;
          if(res.data.result == true){
            this.modalData =res.data.params.listData;
          }
        })
      },
    },
    watch: {
      'selectVal':{
          handler(val){
              this.$emit('getData',{
                  value:val,
                  type:this.selectType,
              })
          }
      },
      'selectValue':{
          handler(val){
              this.selectVal = val;
          }
      },
      'isMultiple':{
          handler(val){
              this.multiple = val;
          }
      },
      'isDisabled':{
        handler(val){
          this.disabled = val;
        }
      },
    }
  }
</script>

<style scoped>
.selectorCom .el-select{
  width:100% !important
}
</style>

<template>
    <div class="selectorCom">
      <el-select v-model="selectVal" filterable clearable :placeholder="placeholder" :multiple="isMultiple" :disabled="disabled" >
        <el-option v-for="item in modalData" :label="item.accountName" :key="item.accountId" :value="item.accountId" >{{item.accountName}}</el-option>
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
        this.getData();   // 获取邮票账号
    },
    methods: {
      getData:function(){
        this.httpPost('financialAccountPaypal/selectList',{isUse:1}).then(res => {
          this.modalData = res.data;
        }).catch(function(err){
          console.log(err);
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

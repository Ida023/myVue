<template>
    <div class="selectorCom">
      <el-select v-model="selectVal" filterable :placeholder="placeholder" :multiple="isMultiple" :disabled="disabled" :no-data-text="noData" :type="type" :size="ssize">
        <el-option v-for="item in options" :label="item.channelName" :key="item.channelId" :value="item.channelId"></el-option>
      </el-select>
    </div>
</template>
<script>
  export default{
    data(){
      return {
        selectVal:this.selectValue,
        type:this.selectType,
        options:[],
        placeholder:this.placeValue,
        noData:this.noDataText,
        disabled:this.isDisabled,
        multiple:this.isMultiple,
        ssize:this.size
      }
    },
    props:['selectValue','placeValue','noDataText','selectType','isDisabled','isMultiple','size','houseValue'],
    mounted(){
        this.getPlatformList();  // 获取平台
    },
    methods: {
      getPlatformList(){
        this.httpGet('dictChannel/selectList').then(res =>{
                this.options = res.data;
        })
      },
    },
    watch: {
      'selectVal':{
          handler(val){
              this.$emit('getPla',{
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
      'size':{
          handler(val){
              this.ssize = val;
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

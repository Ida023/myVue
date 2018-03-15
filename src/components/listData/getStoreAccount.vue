<template>
    <div class="selectorCom">
      <el-select v-model="selectVal" filterable  :placeholder="placeholder" :multiple="isMultiple" :disabled="disabled" >
        <el-option v-for="item in accountNoData" :label="item.accountNo" :key="item.accountId" :value="item.accountId"></el-option>
      </el-select>
    </div>
</template>
<script>
  export default{
    data(){
      return {
        selectVal:this.selectValue,
        type:this.selectType,
        accountNoData:[],
        placeholder:this.placeValue,
        noData:this.noDataText,
        disabled:this.isDisabled,
        multiple:this.isMultiple,
        ssize:this.size,
        number:0,
        id:this.channelId,
        number:0
      }
    },
    props:['channelId','selectValue','placeValue','isDisabled','isMultiple','isUse'],
    mounted(){
        //this.getData();   // 获取店铺账号
     // alert(321321);
    },
    methods: {
      getData(){
        this.httpGet('shopAccount/selectListByChannel',{channelId:this.channelId},'Sms').then(res =>{
          this.accountNoData = res.data;
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
      'isUse':{
        handler(val){
            this.number = 0;
          }
      },
      'channelId':{
        handler(val){
            //alert(5254)
          this.number++;
          //alert(this.number);
          this.id = val;
          this.getData();
          if(this.number >1 && this.isUse == true){
              //alert('清空');
            this.selectVal = '';
          }
        },
      },
     /* 'id':{
        handler(val){
            alert(val)
          //this.id = val;
          this.getData();
          //this.selectVal = '';
        },
      },*/
    }
  }
</script>

<style scoped>
.selectorCom .el-select{
  width:100% !important
}
</style>

<template>
    <div class="selectorCom">
      <el-select v-model="selectVal" filterable clearable :placeholder="placeholder" :multiple="isMultiple" :disabled="disabled" :no-data-text="noData" :type="type" :size="ssize">
        <el-option v-for="item in countryNoData" :label="item.cnName" :key="item.countryNo" :value="item.countryNo"></el-option>
      </el-select>
    </div>
</template>
<script>
  export default{
    data(){
      return {
        selectVal: this.selectValue,
        type: this.selectType,
        countryNoData: [],
        placeholder: this.placeValue,
        noData: this.noDataText,
        disabled: this.isDisabled,
        multiple: this.isMultiple,
        ssize: this.size,
        accountId: this.accountId,
        number: 0,
      }
    },
    props: ['accountId', 'selectType', 'selectValue', 'placeValue', 'isDisabled', 'isMultiple', 'isUse'],
    mounted(){
      this.getData();   // 获取站点
    },
    methods: {
      getData(){
        this.httpGet('shopAccount/selectCountryList', {accountId: this.id}, 'Sms').then(res => {
          this.countryNoData = res.data;
        })
      },
    },
    watch: {

      'selectVal': {
        handler(val){
          this.$emit('getData', {
            value: val,
            type: this.type,
          })
        }
      },
      'selectValue': {
        handler(val){
          this.selectVal = val;
        }
      },
      'isMultiple': {
        handler(val){
          this.multiple = val;
        }
      },
      'size': {
        handler(val){
          this.ssize = val;
        }
      },
      'isDisabled': {
        handler(val){
          this.disabled = val;
        }
      },
      'selectType': {
        handler(val){
          this.type = val;
        }
      },
      'isUse': {
        handler(val){
          this.number = 0;
        }
      },
      'accountId': {
        handler(val){
          //alert(5254)
          this.number++;
          //alert(this.number);
          this.id = val;
          this.getData();
          if (this.number > 1 && this.isUse == true) {
            //alert('清空');
            this.selectVal = '';
          }
        },
      },
    }
  }
</script>

<style scoped>
.selectorCom .el-select{
  width:100% !important
}
</style>

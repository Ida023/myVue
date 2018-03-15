<template>
  <div>
    <!--筛选按钮弹出框-->
    <div class="data_body">
      <title-header></title-header>
      <select-input :select-value="pageFilter.channelId" condition-name="平台" :options-data="channelIdData" @child-change-val="getSelectInput"></select-input>
      <select-input :select-value="pageFilter.accountNo" condition-name="店铺账号" :options-data="accountNoData" @child-change-val="getSelectInput"></select-input>
      <select-input :select-value="pageFilter.countryNo" condition-name="市场/站点" :options-data="countryNoData" @child-change-val="getSelectInput"></select-input>
      <text-input :select-value="pageFilter.orderNo" condition-name="系统订单号" place-value="请输入订单号" @child-change-val="getTextInput"></text-input>
 <!--     <text-input :select-value="pageFilter.shopOrderId" condition-name="平台订单号" place-value="请输入订单号" @child-change-val="getTextInput"></text-input>-->
      <text-input :select-value="pageFilter.customerInfo" condition-name="收件人/邮箱/地址/邮编" place-value="请输入" @child-change-val="getTextInput"></text-input>
      <select-input :select-value="pageFilter.whId" condition-name="发货仓库" :options-data="warehouseData" @child-change-val="getSelectInput"></select-input>
      <select-input :select-value="pageFilter.logisticsMethod" condition-name="物流方式" :options-data="logicData" @child-change-val="getSelectInput"></select-input>
      <text-input :select-value="pageFilter.skuNo" condition-name="SKU" place-value="请输入SKU" @child-change-val="getTextInput"></text-input>
      <select-input :select-value="pageFilter.salesUser" condition-name="销售人员" :options-data="userData" @child-change-val="getSelectInput"></select-input>
    </div>
  </div>
</template>
<script>
  import titleHeader from "../../components/ScreenModular/title.vue"
  import textInput from '../../components/ScreenModular/textInput.vue'
  import selectInput from '../../components/ScreenModular/selectInput.vue'
  export default{
    components: {titleHeader, textInput,selectInput},
    data(){
      return {
        deptList:[],   //
        statusOption:[],   //
        dataOption:[{value:1,label:'测试数据1'},{value:2,label:'测试数据2'},{value:3,label:'测试数据3'},{value:4,label:'测试数据4'}],   //
        platform:this.platformItem,
        account:this.accountItem,
        site:this.siteItem,
        country:this.countryItem,
        pageFilter:{
          channelId:'',
          accountNo:'',
          countryNo:'',
/*          shopOrderId:'',*/
          orderNo:'',
          customerInfo:'',
          logisticsMethod:'',
          whId:'',
          skuNo:'',
          salesUser:'',
        },
        channelIdData:[],   //
        accountNoData:[],   //
        countryNoData:[],   //
        logicData:[],   //
        warehouseData:[],   //
        userData:[],   //
        open:false,
        number1:0,  //  账号， 销售
        number2:0,  //  站点
        number3:0,  //  物流
        first:true,
      }
    },
    props:['paramsData','isOpen','isUse'],
    mounted () {
      this.getChannelIdData();
      this.getWarehouseData();
      this.getAccountNoData();
      this.getLogicData();
      this.getCountryNoData();
      this.getUserData();
      this.pageFilter = JSON.parse(JSON.stringify(this.paramsData));
      //alert(this.isOpen);
      console.log('父组件传到筛选子组件的对象值：');
      console.log(JSON.parse(JSON.stringify(this.pageFilter)))

    },
    methods: {
      getChannelIdData: function(){  //加载平台渠道
        this.httpGet('dictChannel/selectList','','Scm').then(res =>{
          this.channelIdData= this.tool.replaceObjKey(res.data,'channelId','channelName');
          this.channelIdData.unshift({value:'', label: '全部'});
        })
      },
      getWarehouseData: function(){  //加载仓库列表
        this.httpGet('warehouse/selectAllList','','Lwms').then(res =>{
          if(res.data.result == true){
            this.warehouseData = this.tool.replaceObjKey(res.data.params.listData,'whId','whName');
            this.warehouseData.unshift({value:'', label: '全部'});
          }
        })
      },
      getAccountNoData:function(){  //加载店铺账号
        this.httpGet('shopAccount/selectListByChannel',{channelId:this.pageFilter.channelId},'Sms').then(res =>{
          this.accountNoData = this.tool.replaceObjKey(res.data,'accountId','accountNo');
          this.accountNoData.unshift({value:'', label: '全部'});
        })
      },
      getLogicData:function(){  //加载物流方式
        this.httpGet('logisticsMethod/selectListByWhId',{whId:this.pageFilter.whId},'Sms').then(res =>{
          this.logicData = res.data;
          this.logicData = this.tool.replaceObjKey(res.data,'methodId','cnName');
          this.logicData.unshift({value:'', label: '全部'});
        })
      },
      getCountryNoData:function(){  //加载市场/站点
        this.httpGet('shopAccount/selectCountryList',{accountId:this.pageFilter.accountNo},'Sms').then(res =>{
          this.countryNoData = this.tool.replaceObjKey(res.data,'countryNo','cnName');
          this.countryNoData.unshift({value:'', label: '全部'});
        })
      },
      getUserData:function(){  //加载销售人员
        this.httpGet('shopAccount/selectSalesUserList',{channelId:this.pageFilter.channelId},'Sms').then(res =>{
          this.userData = this.tool.replaceObjKey(res.data,'userId','userName');
          this.userData.unshift({value:'', label: '全部'});
        })
      },
      returnData:function(){
          var data = JSON.parse(JSON.stringify(this.pageFilter));
          return data;
      },
      clearData:function(){
          this.tool.clearObjValue(this.pageFilter);
      },
      getTextInput:function(val){
        val.type == '系统订单号' ? this.pageFilter.orderNo = val.value : val.type == 'SKU' ? this.pageFilter.skuNo = val.value : this.pageFilter.customerInfo = val.value;
      },
      getSelectInput:function(val){
          val.type == '平台' ? this.pageFilter.channelId = val.value : val.type == '店铺账号' ? this.pageFilter.accountNo = val.value : val.type == '市场/站点' ?
          this.pageFilter.countryNo = val.value : val.type == '物流方式' ? this.pageFilter.logisticsMethod = val.value : val.type == '发货仓库' ?
              this.pageFilter.whId = val.value : this.pageFilter.salesUser = val.value;
      },
    },
    watch:{
      'paramsData':{
          handler(val){
              //alert('进入组件')
              console.log('父组件传到筛选子组件的对象值：');
              console.log(val);
              this.pageFilter = JSON.parse(JSON.stringify(val));
          },
          deep:true
      },
      'open':{
          handler(val){
              /*console.log('父组件传到筛选子组件的对象值：');
              console.log(this.paramsData);
              this.pageFilter = JSON.parse(JSON.stringify(this.paramsData));*/
          },
      },
      'isOpen':{
          handler(val){
              this.open = val;
              this.number1 = 0;
              console.log('父组件传到筛选子组件的对象值：');
              console.log(this.paramsData);
              this.pageFilter = JSON.parse(JSON.stringify(this.paramsData));
          },
      },
      'pageFilter.channelId':{
        handler(val){
          var vm = this;
          if(this.first == false){
            this.pageFilter.accountNo = '';
            this.pageFilter.salesUser = '';
          }
          this.getAccountNoData();
          this.getUserData();
          setTimeout(function(){
            vm.first = false;
          },200)
        },
      },
      'pageFilter.accountNo':{
        handler(val,vall){
          var vm = this;
          console.log(val)
          console.log(vall)
          if(this.first == false){
            this.pageFilter.countryNo = '';
          }
          this.getCountryNoData();
          setTimeout(function(){
            vm.first = false;
          },200)
        },
      },
      'pageFilter.whId':{
        handler(val){
          var vm = this;
          if(this.first == false){
            this.pageFilter.logisticsMethod = '';
          }
          this.getLogicData();
          setTimeout(function(){
            vm.first = false;
          },200)
        },
      },
      'isUse':{
        handler(val){
          this.number1 = 0;
          this.number3 = 0;
          this.number2 = 0;
        },
        deep:true
      },
    }
  }
</script>
<style scoped>
</style>

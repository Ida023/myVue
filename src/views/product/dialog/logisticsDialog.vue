<template>
<div>
  <span  class="Astyel float-r"  @click="tool.goToPage('settingsWarehouse')">仓库设置</span>&nbsp;&nbsp;
  <span  class="Astyel float-r" v-if="inputDisabled==false"  @click="isOpen = !isOpen">物流方式导入 &nbsp;&nbsp;</span>
<!--
  <span  class="Astyel float-r"  @click=" exportList()">导 出 &nbsp;&nbsp; </span>
-->
  <el-tabs v-model="houseactive" type="card" @tab-click="handleClick">
      <el-tab-pane  :label="item.whName" :name="item.whId"  :key="index"  v-for="(item,index) in logisticList" >
      <span class="Astyel float-r"  @click="addTab(editableTabsValue2,item.listInfo)" v-if="inputDisabled==false">添加国际区域</span><br>
        <el-tabs type="card" v-model="editableTabsValue2" :closable="!inputDisabled" @tab-remove="removeTab($event,item.listInfo,item,index)">
          <el-tab-pane class="tabModel"
            v-for="(list, index) in item.listInfo"
            :key="list.areaId"
            :label="list.areaName"
            :name="list.areaId">
            <span  class="Astyel float-r"  @click="addForm(list,index)" v-if="inputDisabled==false">添加模板</span> <br>
            <el-form :label-width="financeFormLabelWidth"  >
              <el-col v-if="list.domestic==false">
                <el-form-item label="区域名称" required>
                  <el-col :span="8"><el-input type="text" v-model="list.areaName" :disabled="inputDisabled"></el-input></el-col>
                </el-form-item>
                <el-form-item label="运送国家" required>
                  <Country :selectValue="list.toCountryId" :isMultiple="true" @child-change-val="changeCountry($event,list)" :isDisabled="inputDisabled"></Country>
                </el-form-item>
              </el-col>
              <el-col  v-for="(listData,index) in list.formworkListInfo" :key="listData.rulesId">
                <el-tooltip content="删除"  effect="dark" placement="bottom"  class="Astyel  float-r"  v-if="index !='0' && inputDisabled==false" >
                  <i  class="iconfontyyy" @click="deleteForm(listData,list.formworkListInfo,index)" content="Bottom center">&#xe619;</i>
                </el-tooltip><br>
                <el-form-item label="订单数量" required >
                  <el-col :span="5">
                    <el-input  type="number" v-model="listData.startQty" :max="listData.toQty" min="0" :disabled="inputDisabled" placeholder="最小数"></el-input>
                  </el-col>
                  <el-col :span="1" style="text-align: center">到</el-col>
                  <el-col :span="5">
                    <el-input  type="number"  v-model="listData.toQty"  min="0" :disabled="inputDisabled" placeholder="最大数"></el-input>
                  </el-col>
                </el-form-item>
                <el-form-item label="订单物流方式" required>
                  <div v-if="logisticsGrounp.length==0">暂无数据，可前往仓库设置配置</div>
                  <el-checkbox-group style="display:inline;" v-model="listData.logisticsTypeIdlist" @change="changeGroupList($event,listData,index)" v-if="logisticsGrounp.length>=1">
                    <el-checkbox  v-for="Grounp in logisticsGrounp" :disabled="inputDisabled"  :label="Grounp.methodId" :key="Grounp.methodId">{{Grounp.cnName}}</el-checkbox >
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="备注" >
                  <el-input type="textarea"  v-model="listData.note" :disabled="inputDisabled"></el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
  </el-tabs>

</div>
</template>
<script>
  import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item";
  import Country from '../../../components/listData/getCountryList.vue'
  import ElButton from "../../../../node_modules/element-ui/packages/button/src/button";
  export default{
    components: {
      ElButton,
      ElFormItem,Country},
    data(){
      return {
        isOpen:false,
        logisticsGrounp:[],
      	/*logisticList:[
          {
            whName:'仓库1',
            whId:'1111',
            listInfo:[]
          },
          {
            whName:'仓库2',
            whId:'333',
            listInfo:[
              {
              	areaId:'区域ID',
                areaName:'区域ID',
                toCountryId:['1'],
                domestic:true,
                formworkListInfo:[
                  {
                    rulesId:'444',
                    startQty:'222',
                    toQty:'333',
                    data:[],
                    note:''
                  }
                ]
              }
            ]
          },


        ],*/
        logisticList:[],
        options:[
          {label:'1',value:'1'}
        ],
        editableTabsValue2: '20171222112848983784',
        editableTabs2: [{
          title: '国内',
          name: '1',
          content: '国内'
        }, {
          title: '国际区域1',
          name: '2',
          content: '国际1'
        }],
        formArr:[
          {id:'322',arr:[{is:true,name:'123' },{is:true,name:'123' }]},
          {id:'322',arr:[{is:true,name:'123' },{is:true,name:'123' }]},
        ],
        tabIndex: 1,
        activeName:'1',
        houseactive:'',
        financeFormLabelWidth: '120px',
        logisticsparentForm:this.logisticsparentinfoDetail,
        inputDisabledd:this.inputDisabled,//区分查看编辑
      }
    },
    props:['inputDisabled','logisticsparentinfoDetail','productId'],
    watch:{
    	'isOpen'(val){
        this.$emit('assignment2',{
          value:val
        });
       },
      'inputDisabled'(val){
        this.inputDisabledd = val;
        },
      'logisticsparentinfoDetail'(val){
        this.logisticsparentForm = val;
      }
    },
    mounted(){
      //this.getLogisTypeForm();
      //this.getlogisType(this.logisticList[0].whId);
    },
    methods: {
    	//物流方式
    	getlogisType(val){
    		this.httpPost('warehouseSetting/queryWhLogisticsMethod?whId='+val).then(res=>{
    			if(res.data!=[]){
            this.logisticsGrounp=res.data;
          }else{
            this.logisticsGrounp=[];
          }
        })
      },
      changeCountry(val,list){
    		console.log(val)
        console.log(list)
        list.toCountryId=val.value;
        //this.getlogisType(val);
      },
      handleClick(val){
      	console.log('565695',val.name)
        this.tabIndex=0;
        var index=Number(val.index);
      /*  console.log('whName %0==',this.logisticList)
        console.log('whId111 %0==',this.logisticList[index])
        console.log('whId22222 %0==',this.logisticList[index].whId)
      	console.log('val33333 %0==',this.logisticList[index].listInfo[0].areaId)
        console.log('areaName4444 %0==',this.logisticList[index].listInfo[0].areaName)*/
          this.editableTabsValue2=this.logisticList[index].listInfo[0].areaId;
      	//console.log(this.editableTabsValue2)
        this.getlogisType(val.name);
      },
      //进入页面
      getLogisTypeForm(val){
      	this.httpGet('productDevInfo/getProductWarehoseAndLogisTypeInfo?productId='+val).then(res=>{
          this.logisticList=res.data;
          //this.editableTabsValue2=this.logisticList[0].listInfo[0].areaId;
          this.houseactive=this.logisticList[0].whId;
          this.getlogisType(this.houseactive);
        })
      },
      deleteForm(list,info,index){
      	//alert(info.indexOf(list))
      	console.log(list)
        console.log('info %000',info)
        console.log('index % 0',index)
        if(list.rulesId==''){
         info.splice(index,1)
        }else{
          this.httpGet('productDevInfo/deleteLogisTypeInfo?rulesId='+list.rulesId).then(res=>{
            this.$message(res.data.message)
            if(res.data.result==true){
              info.splice(index,1)
            }
          })
        }
        console.log('info %111',info)
/*
        this.httpGet('productDevInfo/deleteLogisTypeInfo?rulesId='+list.rulesId).then(res=>{
          this.$message(res.data.message)
          if(res.data.result==true){
            info.splice(list,1)
          }
        })*/

    /*    this.formArr.forEach((item,index,data)=>{
          data.splice(index,1);
        	alert(item)
        	//delete item;
        })*/
      },
      changeGroupList(val,list,index){
        console.log(list)
        console.log(val)
      	//alert(val)
      },
      submitForm(){
      	var vm=this,flag = true,flageName = true;
    /*    this.logisticList.forEach((item,index) => {*/
         aaa:
        	for(let k=0;k<vm.logisticList.length;k++){
          if (vm.logisticList[k].listInfo && vm.logisticList[k].listInfo.length > 0) {
           	//console.log('第11111层 %00',vm.logisticList[k].listInfo)
            for(let i=0;i<vm.logisticList[k].listInfo.length;i++){
              //console.log('第22222层 % 0',vm.logisticList[k].listInfo[i])
            	if(vm.logisticList[k].listInfo[i].domestic==false){
                if(vm.logisticList[k].listInfo[i].areaName == '' || vm.logisticList[k].listInfo[i].toCountryId == [] || vm.logisticList[k].listInfo[i].toCountryId.length == 0){
                  flageName=false;
                  break;
                }else{
                  flageName=true;
                }
              }
              if (vm.logisticList[k].listInfo[i].formworkListInfo && vm.logisticList[k].listInfo[i].formworkListInfo.length > 0) {
            		console.log('第33333层 % 0',vm.logisticList[k].listInfo[i].formworkListInfo)
                for(let j=0;j<vm.logisticList[k].listInfo[i].formworkListInfo.length;j++){
              /*    console.log('333 % 0',vm.logisticList[k].listInfo[i].formworkListInfo[j])
                  console.log('444 % 0',vm.logisticList[k].listInfo[i].formworkListInfo[j].toQty)
                  console.log('555 % 0',vm.logisticList[k].listInfo[i].formworkListInfo[j].startQty)
                  console.log('666 % 0',vm.logisticList[k].listInfo[i].formworkListInfo[j].logisticsTypeIdlist)*/
            			 if(vm.logisticList[k].listInfo[i].formworkListInfo[j].toQty=='' || vm.logisticList[k].listInfo[i].formworkListInfo[j].toQty==0 || vm.logisticList[k].listInfo[i].formworkListInfo[j].startQty=='' || vm.logisticList[k].listInfo[i].formworkListInfo[j].startQty==0 || vm.logisticList[k].listInfo[i].formworkListInfo[j].logisticsTypeIdlist == [] || vm.logisticList[k].listInfo[i].formworkListInfo[j].logisticsTypeIdlist.length ==0 ){
                     flag=false;
                     break aaa;
                   }else  if(Number(vm.logisticList[k].listInfo[i].formworkListInfo[j].toQty)<=Number(vm.logisticList[k].listInfo[i].formworkListInfo[j].startQty) || Number(vm.logisticList[k].listInfo[i].formworkListInfo[j].startQty)>=Number(vm.logisticList[k].listInfo[i].formworkListInfo[j].toQty)){
                     flag=false;
                     break aaa;
                   }
                   else {
                    // alert(1111)
                     flag=true;
                   }
                }
              }
            }
          }
        }

        if (flag == false || flageName == false) {
          vm.$emit('assignment',{
        		value:false
          });
          this.$message('请填写所有必填项且订单数量最小数不能大于最大数！')
        } else {
          vm.$emit('assignment',{
            value:true
          })
          this.httpPost('productDevInfo/postProductWarehoseAndLogisTypeInfo', this.logisticList).then(res => {
            this.$message(res.data.message)
            if (res.data.result == true) {
            }
          })
        }
      },
      addForm(list,value){
      	var ListInfoArr=[];
      	list.formworkListInfo.push( {
          rulesId:'',
          startQty:'',
          toQty:'',
          logisticsTypeIdlist:[],
          note:''})
        var ListInfo= this.logisticList.map(item=>item);
      	var ListInfoArr=ListInfo.map(item=>item.listInfo);
        //ListInfoArr=list;
        list=ListInfoArr;
      	console.log('list % 00===',list)
        console.log('ListInfo % 0==',ListInfoArr)

      	//this.formArr.push({id:'322',arr:[{is:true,name:'123' },{is:true,name:'123' }]});
      },
      removeTab(targetName,list,item,index) {
          let tabs = list;
          let activeName = this.editableTabsValue2;
         let listId=list.map(item=>item.areaId);
         let idIndex= listId.indexOf(targetName);
        console.log(list)
        console.log(list[idIndex].areaId)
        if(list[idIndex].areaId==''){
        	this.deletetab(tabs,list,activeName,targetName,index);
        }else{
          this.httpGet('productDevInfo/deleteAreaInfo?areaId='+list[idIndex].areaId+'&productId='+item.productId).then(res=>{
            this.$message(res.data.message)
            if(res.data.result==true){
              this.deletetab(tabs,list,activeName,targetName,index);
            }
          })
        }

      },
      deletetab(tabs,list,activeName,targetName,index){
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            //console.log('tab % 0==',tab)
            if (tab.areaId === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.areaId;
              }
            }
          });
        }
        this.editableTabsValue2 = list[0].areaId;
        list = tabs.filter(tab => tab.areaId !== targetName);
        this.logisticList[index].listInfo=list;
      },
      addTab(value,targetName) {
        let newTabName = targetName[0].areaId;
        console.log('newTabName %0',newTabName)
        targetName.push({
          areaName: '国际区域'+(++this.tabIndex + ''),
          areaId: '',
          toCountryId:[],
          domestic:false,
          formworkListInfo:[]
        });
        this.editableTabsValue2 = newTabName;
      },
      removeForm(){
      this.houseactive='20171114165156044947';
      }
    }
  }
</script>

<style scoped>
.float-r{
  float: right;
}
  /*.tabModel .el-tabs__nav>div:first-child .el-icon-close{
    display: none;
  }*/
</style>

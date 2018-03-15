<template>
    <div>
      <el-row class="row">
        <el-col class="col" :span="4">{{stateName}}</el-col>
        <el-col class="col" :span="4">是</el-col>
        <el-col class="col_input" :span="16">
          <el-cascader v-model="selectVal" :options="options" :props="props" :placeholder="placeholder" :change-on-select="true" :show-all-levels="false" clearable filterable></el-cascader>
        </el-col>
      </el-row>
    </div>
</template>
<script>
	export default{
		data(){
			return {
        props:{value:'deptId',label:'deptName',children:'sysDeptDataList'},
        stateName:this.conditionName,//状态名
        selectVal:this.selectValue,//当前选中
        options: [],//下拉数据
        placeholder:this.placeValue,
			}
		},
    props:['conditionName','selectValue','placeValue',],
    watch: {
      'selectVal':{
        handler(val){
          this.$emit('getDept',{
            value:val[val.length-1],
            type:this.stateName,
          })
        },
        deep:true
      },
      'selectValue':{
        handler(val){
          this.selectVal = val;
        }
      },
      'placeValue':{
        handler(val){
          this.placeholder = val;
        }
      },
      'conditionName':{
        handler(val){
          this.stateName = val;
        }
      },
    },
    mounted() {
        this.getDepList();
		},
		methods: {
      getDepList:function(){
        this.httpPost('deptManager/selectDeptList',{isUse:'1'}).then(res =>{
          if(res.data.result == true){
            var data = res.data.params.deptList;
            var diGui = function(arr) {
              arr.forEach(function(item,index){
                if(item.sysDeptDataList.length < 1){
                  delete item.sysDeptDataList;
                }else{
                  diGui(item.sysDeptDataList);
                }
              })
            };
            diGui(data);
            this.options = data;
          }
        })
      },
		}
	}


</script>

<style scoped>


</style>

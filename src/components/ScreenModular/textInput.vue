<template>
    <div>
      <el-row class="row">
        <el-col class="col" :span="4">{{stateName}}</el-col>
        <el-col class="col" :span="4">是</el-col>
        <el-col class="col_input" :span="16">
          <el-input :type="type" :placeholder="placeholder" v-model="selectVal"></el-input>
        </el-col>
      </el-row>
    </div>
</template>
<script>
	export default{
    name:'textInput',
		data(){
			return {
        stateName:this.conditionName,//状态名
        selectVal:this.selectValue,//当前选中
        placeholder:this.placeValue,
        disabled:this.isDisabled,
        type:this.textType
			}
		},
    props:['conditionName','selectValue','isDisabled','placeValue','textType'],
    watch: {
      'selectVal':{
        handler(val){
          this.$emit('child-change-val',{
              value: val,
              type: this.stateName
          });
        },
        deep:true
      },
      'conditionName':{
        handler(val){
        	console.log(val)
          this.stateName = val;
        }
      },
      'selectValue':{
        handler(val){
          this.selectVal = val;
        },
        deep:true
      },
      'placeValue':{
        handler(val){
          this.placeholder = val;
        },
        deep:true
      },
      'isDisabled':{
        handler(val){
          this.disabled = val;
        },
        deep:true
      },
    },
    mounted() {
		},
		methods: {
		}
	}


</script>

<style scoped>


</style>

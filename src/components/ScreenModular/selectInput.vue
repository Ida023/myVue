<template>
    <div>
      <el-row class="row">
        <el-col class="col" :span="4">{{stateName}}</el-col>
        <el-col class="col" :span="4">是</el-col>
        <el-col class="col_input" :span="16">
          <el-select v-model="selectVal" filterable  :placeholder="placeholder" :multiple="isMultiple" :disabled="disabled"  >
            <el-option v-for="item in options" :label="item.label" :key="item.value" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
</template>
<script>
	export default{
    name:'textInput',
		data(){
			return {
        stateName:this.conditionName,//条件名
        selectVal:this.selectValue,//当前选中
        options: this.optionsData,//下拉数据
        placeholder:this.placeValue,
        disabled:this.isDisabled,
        multiple:this.isMultiple,//是否多选
			}
		},
    /*
    * conditionName 筛选条件名称
    * selectValue 选中的值
    * optionsData 下拉框数据源
    * isDisabled   选框禁用
    * isMultiple   是否多选
    * placeValue   placeholder提示文字
    * child-change-val   父组件接收事件名(value选中值  type选框名用于区分多个选框场景用同一个接收事件)
    * */
    props:['conditionName','selectValue','optionsData','isDisabled','isMultiple','placeValue','id','name','url'],
    watch: {
      'selectVal':{
        handler(val){
          this.$emit('child-change-val',{
              value:val,
              type:this.stateName
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
      'isMultiple':{
        handler(val){
          this.multiple = val;
        }
      },
      'optionsData':{
        handler(val){
          this.options = val;
        }
      },
      'isDisabled':{
        handler(val){
          this.disabled = val;
        }
      },
    },
    mounted() {
      // this.getList();
		},
		methods: {
      getList(){
          if(this.url != undefined){
            this.httpGet(this.url).then(res => {
              this.options = this.tool.replaceObjKey(res.data,this.id,this.name);
            })
          }
      }
		}
	}


</script>

<style scoped>


</style>

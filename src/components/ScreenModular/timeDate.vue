<template>
  <el-row class="row">
    <el-col class="col" :span="4">{{titleName}}</el-col>
    <el-col class="col" :span="4">是</el-col>
    <el-col class="col_input" :span="16">
      <el-row class="block">
        <el-col :span="12">
          <el-date-picker v-model="initialTime" size="small"  type="datetime" format="yyyy-MM-dd" placeholder="选择开始时间" ></el-date-picker>
        </el-col>
        <el-col :span="12">
          <el-date-picker v-model="overTime" size="small"  type="datetime" format="yyyy-MM-dd" placeholder="选择结束时间" ></el-date-picker>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
    export default{
        data(){
            return {
                 titleName:this.conditionName,
                 initialTime:this.startTime,
                 overTime:this.endTime,
            }
        },
      props:['startTime','endTime','conditionName'],
        mounted () {

        },
      watch:{
            'conditionName':{
                    handler(val){
                        this.titleName = val;
                        alert(val);
                    }
                },
            'startTime':{
                    handler(val){
                        this.initialTime = val;
                    }
                },
            'endTime':{
                    handler(val){
                        this.overTime = val;
                    }
                },
            'initialTime':{
                        handler(val){
                            this.$emit('child-value-Stime',{
                                value:val,
                                type:'start',
                                titleName:this.titleName,
                            })
                        }
                    },
            'overTime':{
                        handler(val){
                            this.$emit('child-value-Etime',{
                                value:val,
                                type:'end',
                                titleName:this.titleName,
                            })
                        }
                    },
              },
        methods: {}
    }
</script>

<style scoped>
    [v-cloak] {
        display: none;
    }

</style>

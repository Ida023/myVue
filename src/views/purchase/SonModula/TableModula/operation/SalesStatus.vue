<template>
    <div id="">
      <div class="smallDia" >

        <div class="data_body">
            <el-row class="row">
              <el-col class="col" :span="12">首批备货物品到货日期</el-col>
              <el-col class="tatestyle" :span="12">
                2017-08-01
              </el-col>
            </el-row>
          <el-row class="row">
            <el-col class="col" :span="12">销售计划天数</el-col>
            <el-col class="tatestyle" :span="12">
              60天
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="12">销售计划完成日期</el-col>
            <el-col class="tatestyle" :span="12">
              2017-09-31
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="12">销售开始日期</el-col>
            <el-col class="tatestyle" :span="12">
              2017-08-05
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="12">销售实际完成日期</el-col>
            <el-col class="tatestyle" :span="12">
              --
            </el-col>
          </el-row>
          <el-row class="row">
            <el-col class="col" :span="12">截至当前完成数量</el-col>
            <el-col class="tatestyle" :span="12">
              20
            </el-col>
          </el-row>
          </div>
      </div>
    </div>
</template>

<script>


</script>

<style scoped>
  .colStyle{
    padding: 10px 20px 10px 0px;
  }
  .nav{
    border: 1px solid #dfe6ec;
    line-height: 36px;
  }
  .tatestyle{
    margin-top: 10px;
    padding-left: 10px;
  }
</style>

<template>
  <div id="outermost_wrap" class="role" style="">
    <div id="sub_wrap" class="top-nav">
      <CrumbsNav></CrumbsNav>
    </div>
    <div id="content_wrap">
      <template>
        <el-radio-group  @change="changeRadio" v-model="radio">
          <el-row class="marginBottom">
            <el-radio  :label="1" >规则一：自动
              <el-row  class="pL">
                <p>SKU纯数字组成，随机生成，总计位数</p>
                <div class="input-w"><el-input v-model="codeLen1" placeholder="该规则位数不能小于3位且不能大于7位"  type="number" name="quantity" min="6" max="15"></el-input><span>位</span></div>
              </el-row>
            </el-radio>
          </el-row>
          <el-row class="marginBottom">
            <el-radio  :label="2" >规则二：半自动 <el-button  @click="tool.goToPage('categoryManagerNew')">分类管理</el-button>
              <el-row  class="pL">
                <p>SKU前面位数根据大类、小类固定规则生成，后面位数按添加顺序叠加，后面位数设置 </p>
                <div class="input-w" ><el-input  v-model="codeLen2" placeholder="该规则位数不能小于2位且不能大于7位"  type="number" name="quantity" min="2" max="11"></el-input><span>位</span></div>
              </el-row>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio  :label="3" >规则三：手动
              <el-row  class="pL">
                <p>新建产品时，需手动输入SKU号，系统将会判断是否有重复，有重复将提示使用其他SKU号 </p>
              </el-row>
            </el-radio>
          </el-row>
        </el-radio-group>
        <el-row class="pL">
          <el-button type="primary"  size="large" @click="editSubmit();"  >确认</el-button>
        </el-row>
      </template>
    </div>
    <router-view></router-view>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        radio: '',
        skuRule: [],
        codeLen1: '',
        codeLen2: '',
        defaultData:{
          codeLen: '',
          refId:''
        },
    /*    skuruleData: [{
          ruleType:'',//默认选中
          skuRule:{
            refId:'',//ID
            codeLen:'',//位数
            refValue:''//枚举名
          }
        }
        ]*/
      }
    },
    mounted: function () {
      this.requestem();
    },
    methods: {
      requestem(){
        this.httpPost('querySKURule').then(res => {
            this.radio = parseInt(res.data.rule.ruleType);
            if (res.data.rule.ruleType==1){
              this.codeLen1 = res.data.rule.codeLen
            }else if (res.data.rule.ruleType==2){
              this.codeLen2 = res.data.rule.codeLen
            }
        })
      },
      category(){
        this.$router.push({
          path:'/categoryManager'
        })
      },
      changeRadio(val){
        this.defaultData.refId = val;
        val == '1' ? this.codeLen2='':this.codeLen1='';
        val == '3'? (this.codeLen2='',this.codeLen1=''):'';

    /*    alert(this.defaultData.codeLen)*/
      },
      editSubmit(){
         const defaultDatalist = {};
        defaultDatalist.refId = this.defaultData.refId;
        if( this.defaultData.refId == 1){
         defaultDatalist.codeLen = this.codeLen1;
          this.codeLen2 = '';
        }else if(this.defaultData.refId == 2){
         defaultDatalist.codeLen = this.codeLen2;
          this.codeLen1 = '';
        }
        console.log(defaultDatalist)
        this.httpPost('editSKURule',this.qs.stringify(defaultDatalist)).then((res) => {
            if(res.data.result== true){
              this.$message({
                message: res.data.message,
                duration : 2000
              });
              this.requestem();
            }
            else if(res.data.result == false){
              this.$message.error(res.data.message);
            }

        })
      }

    }
  }

</script>

<style scoped>
  .pL{
    padding-left: 20px;
  }
  .input-w{
  width: 280px;
  }
  .input-w span{
    margin-left: 5px;
  }
  .category{
    display: inline-block;
    padding:11px 19px;
    background: #20a0ff;
    color: #fff;
    border-radius: 4px;
  }
  .category a{
    color: #fff;
  }
</style>

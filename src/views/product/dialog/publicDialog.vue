<template>
  <div>
    <el-dialog :title="parentForm.dialogTitle " :visible.sync="parentForm.isOpen" :close-on-click-modal="false" >
      <el-tabs v-model="parentForm.activeTab"  @tab-click="tabclick" >
        <el-tab-pane label="基本信息"   name="0">
          <el-form :model="vendorInfoModel"  :rules="infoRules" ref="vendorInfoModel"  class="demo-ruleForm" :label-width="financeFormLabelWidth">
            <el-form-item label="SKU"  prop="skuName" :label-width="financeFormLabelWidth" required>
              <el-row>
                <el-col :span="20">
                  <el-input v-model="vendorInfoModel.skuName" :disabled="parentForm.inputDisabled"></el-input>
                </el-col>
                <el-col :span="4" class="routerLink"><router-link to="" >SKU规则配置</router-link></el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="EAN"  prop="eanName" :label-width="financeFormLabelWidth" :rules="{ min: 1, max: 50, message: '长度不能超过 50 个字符', trigger: 'change' }">
              <el-input v-model="vendorInfoModel.eanName" :disabled="parentForm.inputDisabled"></el-input>
            </el-form-item>
            <el-form-item label="UPC"  prop="upcName" :label-width="financeFormLabelWidth" :rules="{ min: 1, max: 20, message: '固话长度不能超过 20 个字符', trigger: 'change' }">
              <el-input v-model="vendorInfoModel.upcName" :disabled="parentForm.inputDisabled"></el-input>
            </el-form-item>
            <el-form-item label="商品名称(中)"  prop="chineseName" :label-width="financeFormLabelWidth" :rules="{ min: 1, max: 20, message: '不能超过 20 个字符', trigger: 'change' }">
              <el-input v-model="vendorInfoModel.chineseName" :disabled="parentForm.inputDisabled"></el-input>
            </el-form-item>
            <el-form-item label="商品名称(英)"  prop="englishName" :label-width="financeFormLabelWidth"  required>
              <el-input v-model="vendorInfoModel.englishName" :disabled="parentForm.inputDisabled"></el-input>
            </el-form-item>
            <el-form-item label="所属分类"  prop="classification" :label-width="financeFormLabelWidth"  required>
              <el-row>
                <el-col :span="6">
                  <el-form-item prop="province">
                    <el-select size="small"
                               v-model="vendorInfoModel.province"
                               placeholder="一级分类"
                               @change="getProv($event)" :disabled="parentForm.inputDisabled" >
                      <el-option
                        v-for="item in provs"
                        :label="item.label"
                        :value="item.value"
                        :key="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col >
                <el-col :span='6'>
                  <el-form-item prop="city">
                    <el-select size="small"
                               v-model="vendorInfoModel.city"
                               placeholder="二级分类"
                               :disabled="parentForm.inputDisabled" >
                      <el-option
                        v-for="item in citys"
                        :label="item.label"
                        :value="item.value"
                        :key="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="3" class="routerLink" ><router-link to="" >分类管理</router-link></el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="特殊属性"  prop="specialAttr" :label-width="financeFormLabelWidth"  required>
              <el-row>
                <el-col>
                  <el-checkbox v-model="checked" :disabled="parentForm.inputDisabled">大属性</el-checkbox>
                  <router-link to="" style="margin-left:20px" class="arrouterLink">特殊属性管理</router-link>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="产品文档"  :label-width="financeFormLabelWidth" class="picture" >
              <div class="downDoc"   @click="downDoc">{{docsNamePing}}</div>
              <el-button size="small" type="primary" v-if='parentForm.inputDisabled == false'>点击上传</el-button>
            </el-form-item>
            <el-form-item label="备注信息"  prop="remarks" :label-width="financeFormLabelWidth"  required>
              <el-input type="textarea" :disabled="parentForm.inputDisabled" ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="辅助信息"   name="1">
          <el-form :model="assistInfoModel"  :rules="infoRules" ref="vendorInfoModel"  class="demo-ruleForm" :label-width="financeFormLabelWidth">
            <h4 v-text="parentForm.photoDialog == true ? '商品与包装':'商品信息'"></h4>
            <el-row  >
              <el-form-item label="商品重量"  prop="vendorName" :label-width="financeFormLabelWidth" required>
                <el-row>
                  <el-col :span="6">
                    <el-input v-model="vendorInfoModel.vendorName" :disabled="parentForm.inputDisabled"><template slot="append">g</template></el-input></el-col>
                </el-row>
              </el-form-item>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="商品尺寸" :label-width="financeFormLabelWidth" prop="lengthInfo">
                    <el-input  :disabled="parentForm.inputDisabled" ><template slot="prepend">长</template><template slot="append">CM</template></el-input>
                  </el-form-item>
                  <el-form-item label="" prop="widthInfo" :label-width="financeFormLabelWidth">
                    <el-input :disabled="parentForm.inputDisabled" > <template slot="prepend">宽</template><template slot="append">CM</template></el-input>
                  </el-form-item>
                  <el-form-item label="" prop="heightInfo" :label-width="financeFormLabelWidth">
                    <el-input  :disabled="parentForm.inputDisabled" type="height"><template slot="prepend">高</template><template slot="append">CM</template></el-input>
                  </el-form-item><el-form-item label="" prop="heightInfo" :label-width="financeFormLabelWidth">
                  <el-input  :disabled="parentForm.inputDisabled" type="height"><template slot="prepend">体积</template><template slot="append">cm³</template></el-input>
                </el-form-item>
                </el-col>
              </el-row>
              <el-col :span="2"><h4>包材信息</h4></el-col>
              <el-col :span="2" class="routerLink"><router-link to=""  v-if="parentForm.inputDisabled == false"> <h4>包材管理</h4></router-link></el-col>
             <!-- <h4 >包材管理</h4>-->
             </el-row>
               <el-row :span="24" >
                 <el-col :span="12">
                   <el-form-item label="空运包材" :label-width="financeFormLabelWidth" required prop="lengthInfo">
                     <el-select size="small"
                                v-model="vendorInfoModel.province"
                                placeholder="包材1"
                                @change="getProv($event)" :disabled="parentForm.inputDisabled" >
                       <el-option
                         v-for="item in provs"
                         :label="item.label"
                         :value="item.value"
                         :key="item.value">
                       </el-option>
                     </el-select>
                   </el-form-item>
                   <el-form-item label="空运包材重量"  prop="vendorName" :label-width="financeFormLabelWidth" >
                       <el-col :span="13">
                         <el-input v-model="vendorInfoModel.vendorName" :disabled="parentForm.inputDisabled"><template slot="append">g</template></el-input></el-col>
                   </el-form-item>
                   <el-form-item label="空运包材体积"  prop="vendorName" :label-width="financeFormLabelWidth" >
                       <el-col :span="13">
                         <el-input v-model="vendorInfoModel.vendorName" :disabled="parentForm.inputDisabled"><template slot="append">g</template></el-input></el-col>
                   </el-form-item>
                   <el-form-item label="空运包材价格"  prop="vendorName" :label-width="financeFormLabelWidth" >
                       <el-col :span="13">
                         <el-input v-model="vendorInfoModel.vendorName" :disabled="parentForm.inputDisabled"><template slot="append">g</template></el-input></el-col>
                   </el-form-item>
                 </el-col>
                 <el-col :span="12">
                   <el-form-item label="海运包材" :label-width="financeFormLabelWidth" required prop="lengthInfo">
                     <el-select size="small"
                                v-model="vendorInfoModel.province"
                                placeholder="包材1"
                                @change="getProv($event)" :disabled="parentForm.inputDisabled" >
                       <el-option
                         v-for="item in provs"
                         :label="item.label"
                         :value="item.value"
                         :key="item.value">
                       </el-option>
                     </el-select>
                   </el-form-item>
                   <el-form-item label="海运包材重量"  prop="vendorName" :label-width="financeFormLabelWidth" >
                     <el-col :span="13">
                       <el-input v-model="vendorInfoModel.vendorName" :disabled="parentForm.inputDisabled"><template slot="append">g</template></el-input></el-col>
                   </el-form-item>
                   <el-form-item label="海运包材体积"  prop="vendorName" :label-width="financeFormLabelWidth" >
                     <el-col :span="13">
                       <el-input v-model="vendorInfoModel.vendorName" :disabled="parentForm.inputDisabled"><template slot="append">g</template></el-input></el-col>
                   </el-form-item>
                   <el-form-item label="海运包材价格"  prop="vendorName" :label-width="financeFormLabelWidth" >
                     <el-col :span="13">
                       <el-input v-model="vendorInfoModel.vendorName" :disabled="parentForm.inputDisabled"><template slot="append">g</template></el-input></el-col>
                   </el-form-item>
                 </el-col>
               </el-row>
            <h4>开发与跟单</h4>
            <el-form-item label="开发人员" style="text-align: center">
              <el-col span="3">
                <el-select size="small"
                           v-model="vendorInfoModel.province"
                           placeholder="李四"
                           @change="getProv($event)" :disabled="parentForm.inputDisabled" >
                  <el-option
                    v-for="item in provs"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col span="3">跟单人员</el-col>
              <el-col span="3"> <el-select size="small"
                                           v-model="vendorInfoModel.province"
                                           placeholder="李四"
                                           @change="getProv($event)" :disabled="parentForm.inputDisabled" >
                <el-option
                  v-for="item in provs"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value">
                </el-option>
              </el-select></el-col>
              <el-col span="3">摄影人员</el-col>
              <el-col span="3"> <el-select size="small"
                                           v-model="vendorInfoModel.province"
                                           placeholder="李四"
                                           @change="getProv($event)" :disabled="parentForm.inputDisabled" >
                <el-option
                  v-for="item in provs"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value">
                </el-option>
              </el-select></el-col>
              <el-col span="4">图片处理人员</el-col>
              <el-col span="3"> <el-select size="small"
                                           v-model="vendorInfoModel.province"
                                           placeholder="李四"
                                           @change="getProv($event)" :disabled="parentForm.inputDisabled" >
                <el-option
                  v-for="item in provs"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value">
                </el-option>
              </el-select></el-col>
            </el-form-item>
            <el-form-item v-if="parentForm.addDialog == true">
              <el-row>
              <el-col :span="2"><h4>组合产品信息</h4></el-col>
                <el-col :span="2" class="routerLink" v-if="parentForm.inputDisabled == false" @click="layerDialog.isopen=true"><h4>添加物品</h4></el-col>
              </el-row>
              <template>
                <el-table border v-model="listData" tooltip-effect="dark" :data="listData" label-width="">
                  <el-table-column label="图片"  width="200" prop="skuName" align="center"   ></el-table-column>
                  <el-table-column label="名称"  width="200" prop="skuName" align="center"  sortable></el-table-column>
                  <el-table-column label="SKU"  width="200" prop="skuName" align="center"  sortable ></el-table-column>
                  <el-table-column label="数量"  width="200" prop="skuName" align="center"  sortable ></el-table-column>
                  <el-table-column label="成本"  width="200" prop="skuName" align="center"  sortable ></el-table-column>
                  <el-table-column label="重量"  width="200" prop="skuName" align="center"  sortable ></el-table-column>
                  <el-table-column label="操作"  width="200" prop="skuName" align="center"  sortable ></el-table-column>
                </el-table>
              </template>
            </el-form-item>
          </el-form>
       </el-tab-pane>
        <el-tab-pane label="采购信息"   name="2">
         <el-form :label-width="financeFormLabelWidth">
             <el-form-item label="最新采购单价" >
               <el-col :span="5">
                 <el-input v-model="vendorInfoModel.vendorName" :disabled="parentForm.inputDisabled"><template slot="append">CNY</template></el-input>
               </el-col>
               <router-link to="" class="routerLinkright" >供应商管理</router-link>
             </el-form-item>
           <el-form-item label="首选供应商">
             <el-row :gutter="8">
               <el-col span="6">
                 <el-select size="small"
                            v-model="vendorInfoModel.province"
                            placeholder="李四"
                            @change="getProv($event)" :disabled="parentForm.inputDisabled" >
                   <el-option
                     v-for="item in provs"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
                   </el-option>
                 </el-select>
               </el-col>
               <el-col span="8">
                 <el-input v-model="vendorInfoModel.vendorName" :disabled="parentForm.inputDisabled"><template slot="prepend">最小采购量</template><template slot="append">PCS</template></el-input>
               </el-col>
               <el-col span="8">
                 <el-input v-model="vendorInfoModel.vendorName" :disabled="parentForm.inputDisabled"><template slot="prepend">采购单价</template><template slot="append">CNY</template></el-input>
               </el-col>
             </el-row>

           </el-form-item>
           <el-form-item label="首选供应商1">
             <el-row :gutter="8">
               <el-col span="6">
                 <el-select size="small"
                            v-model="vendorInfoModel.province"
                            placeholder="李四"
                            @change="getProv($event)" :disabled="parentForm.inputDisabled" >
                   <el-option
                     v-for="item in provs"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
                   </el-option>
                 </el-select>
               </el-col>
               <el-col span="8">
                 <el-input v-model="vendorInfoModel.vendorName" :disabled="parentForm.inputDisabled"><template slot="prepend">最小采购量</template><template slot="append">PCS</template></el-input>
               </el-col>
               <el-col span="8">
                 <el-input v-model="vendorInfoModel.vendorName" :disabled="parentForm.inputDisabled"><template slot="prepend">采购单价</template><template slot="append">CNY</template></el-input>
               </el-col>
             </el-row>
           </el-form-item>
           <el-form-item label="首选供应商2">
             <el-row :gutter="8">
               <el-col span="6">
                 <el-select size="small"
                            v-model="vendorInfoModel.province"
                            placeholder="李四"
                            @change="getProv($event)" :disabled="parentForm.inputDisabled" >
                   <el-option
                     v-for="item in provs"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
                   </el-option>
                 </el-select>
               </el-col>
               <el-col span="8">
                 <el-input v-model="vendorInfoModel.vendorName" :disabled="parentForm.inputDisabled"><template slot="prepend">最小采购量</template><template slot="append">PCS</template></el-input>
               </el-col>
               <el-col span="8">
                 <el-input v-model="vendorInfoModel.vendorName" :disabled="parentForm.inputDisabled"><template slot="prepend">采购单价</template><template slot="append">CNY</template></el-input>
               </el-col>
             </el-row>
           </el-form-item>
           <el-form-item label="首选供应商3">
             <el-row :gutter="8">
               <el-col span="6">
                 <el-select size="small"
                            v-model="vendorInfoModel.province"
                            placeholder="李四"
                            @change="getProv($event)" :disabled="parentForm.inputDisabled" >
                   <el-option
                     v-for="item in provs"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
                   </el-option>
                 </el-select>
               </el-col>
               <el-col span="8">
                 <el-input v-model="vendorInfoModel.vendorName" :disabled="parentForm.inputDisabled"><template slot="prepend">最小采购量</template><template slot="append">PCS</template></el-input>
               </el-col>
               <el-col span="8">
                 <el-input v-model="vendorInfoModel.vendorName" :disabled="parentForm.inputDisabled"><template slot="prepend">采购单价</template><template slot="append">CNY</template></el-input>
               </el-col>
             </el-row>
           </el-form-item>

         </el-form>
        </el-tab-pane>
        <el-tab-pane label="详细描述"   name="3">
          <el-form :label-width="financeFormLabelWidth">
            <el-form-item label="语言" >
              <el-col :span="6">
                <el-form-item prop="province">
                  <el-select size="small"
                             v-model="vendorInfoModel.province"
                             placeholder="包装材料1"
                             @change="getProv($event)" :disabled="parentForm.inputDisabled" >
                    <el-option
                      v-for="item in provs"
                      :label="item.label"
                      :value="item.value"
                      :key="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col >
            </el-form-item>
            <el-form-item label="标题"  >
              <el-input :disabled="parentForm.inputDisabled"></el-input>
            </el-form-item>
            <el-form-item label="描述" >
              <el-input type="textarea" :disabled="parentForm.inputDisabled"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品图片"   name="4">
          <el-form>
            <el-form-item label="产品相册"  :label-width="financeFormLabelWidth" class="picture">
              <el-upload
                :http-request="uploadFilePic"  action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                accept=".jpg,.jpeg,.png"
              >
                <el-button size="small" type="primary" v-if='parentForm.inputDisabled == false'>点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="产品设计图"  :label-width="financeFormLabelWidth" class="picture">
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <el-button size="small" type="primary" v-if='parentForm.inputDisabled == false'>点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="物流方式"   name="5">
          <router-link to="" class="routerLinkright" >仓库设置</router-link>
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="深圳仓" name="first1">
              <el-col>
              <router-link to="" class="routerLinkright">添加模板</router-link>
                <el-form :label-width="financeFormLabelWidth">
                  <el-form-item label="订单数量" required>
                    <el-col :span="5">
                      <el-input :disabled="parentForm.inputDisabled"></el-input>
                    </el-col>
                    <el-col :span="1" style="text-align: center">到</el-col>
                    <el-col :span="5">
                      <el-input :disabled="parentForm.inputDisabled"></el-input>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="订单物流方式" required>
                    <el-checkbox-group style="display:inline;" >
                      <el-checkbox :disabled="parentForm.inputDisabled" ></el-checkbox >
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item label="备注" required>
                    <el-input type="textarea" :disabled="parentForm.inputDisabled"></el-input>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="产品问题"   name="6">
          <el-button to="" class="quesright"  @click="layerDialog.isopen=true;layerDialog.dialogTitle='添加提问';layerDialog.label='提问'">添加问题</el-button>
              <el-col>
                <el-form >
                  <el-form-item label="问题" :label-width="financeFormLabelWidth">
                    {{}}
                  </el-form-item>
                  <el-form-item label="发布时间" :label-width="financeFormLabelWidth">
                    <template> <time class="time">{{  }}</time></template>
                  </el-form-item>
                  <el-form-item label="发布者" :label-width="financeFormLabelWidth">
                    {{}}
                  </el-form-item>
                  <el-form-item label="解答" :label-width="financeFormLabelWidth">
                    {{}}
                    <el-button to="" class="quesright"  @click="layerDialog.isopen=true;layerDialog.dialogTitle='我来回答';layerDialog.label='回答'">我来回答</el-button>
                  </el-form-item>
                  <el-form-item :label-width="financeFormLabelWidth" label="">
                  </el-form-item>
                </el-form>
              </el-col>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-col :span="6" style="color:red">切换并填写的时候，记得点击保存→→</el-col>
        <el-button @click="parentForm.isOpen = false;parentForm.activeTab='0';vendorInfoModel.attachList=[];">关 闭</el-button>
        <el-button type="primary" @click="vendorInfoModel.attachList=[]" :loading="$store.state.loading">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="layerDialog.dialogTitle" :visible.sync="layerDialog.isopen" size="small">
      <el-form v-if="parentForm.addDialog == false">
        <el-form-item :label="layerDialog.label">
          <el-input type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="layerDialog.isOpen = false">关 闭</el-button>
        <el-button type="primary" @click="layerDialog.isOpen = false" :loading="$store.state.loading">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import ElForm from "../../../../node_modules/element-ui/packages/form/src/form";
  import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item";
  import ElButton from "../../../../node_modules/element-ui/packages/button/src/button";
    export default{
      components: {
        ElButton,
        ElFormItem,
        ElForm},
      data(){
            return {
              layerDialog:{
                  isopen:false,
                  dialogTitle:'',
                  label:'',
                  addGoods:false,
              },
              activeName:'first1',
              tabArr:['0','1','2','3','4','5','6'],
              docsNamePing:"文档啊",
              financeFormLabelWidth: '120px',
              vendorInfoModel: { // 基本信息
                skuName:'',
                eanName:'',
                upcName :'',
                chineseName:'',
                englishName:'',
                classification:'',
                specialAttr:'',
                remarks:'',
              },
              assistInfoModel:{ //辅助信息(摄影列表)
                  title:'商品与包装',


              },
              commodityInfoModel:{ //辅助信息(产品开发)
                title:'商品信息',
              },

              parentForm:this.parentinfoDetail,
            }
        },
          props:['parentinfoDetail'],
                // 基本信息
          methods: {
            //当前tab
            tabclick(val){
               // alert(val.name)
            }

        }
    }

</script>

<style scoped>
  .routerLink {
    text-align: center;
  }
  .routerLink a, a.arrouterLink {
    color:#20a0ff;
  }
  .arrouterLink{
    margin-left: 20px;
  }
  a.routerLinkright {
    color:#20a0ff;
    float: right;
  }
  .quesright{
    float: right;
  }
</style>

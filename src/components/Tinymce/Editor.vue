<template>
  <div>
    <quill-editor ref="myTextEditor"
                  v-model="$store.state.EditorContent"
                  :config="editorOption"
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @ready="onEditorReady($event)"
    >
    </quill-editor>
  </div>

</template>

<script>
  import { mapState,mapMutations,mapGetters,mapActions } from 'vuex'
  export default {
    data () {
      return {
        content:'',
        editorOption: {
          // something config
          disabled:"true"
        },
      }
    },
    props: ['body'],
    // if you need to manually control the data synchronization, parent component needs to explicitly emit an event instead of relying on implicit binding
    // 如果需要手动控制数据同步，父组件需要显式地处理changed事件
    methods: {
      ...mapMutations([
        'EditorContent',
      ]),

      onEditorBlur(editor) {
//        console.log('editor blur!', editor)
      },
      onEditorFocus(editor) {
//        console.log('editor focus!', editor)
      },
      onEditorReady(editor) {
//        console.log('editor ready!', editor)
      },
      onEditorChange({ editor, html, text }) {
        // console.log('editor change!', editor, html, text)
        this.content = html
      },

      geteditor(editorfrom){
        this.content=editorfrom
      },
      deletecontent(){
        this.content=''
      }
    },
    // if you need to get the current editor object, you can find the editor object like this, the $ref object is a ref attribute corresponding to the dom redefined
    // 如果你需要得到当前的editor对象来做一些事情，你可以像下面这样定义一个方法属性来获取当前的editor对象，实际上这里的$refs对应的是当前组件内所有关联了ref属性的组件元素对象
    computed: {
      editor() {
        return this.$refs.myTextEditor.quillEditor
      }
    },
    mounted() {
      // you can use current editor object to do something(editor methods)
      console.log('this is my editor', this.editor)
      // this.editor to do something...
    }
  }
</script>

<style scoped>
  .tinymce-container {
    position: relative
  }
  .ql-editor{
    height: 300px;
  }
  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }

  .editor-custom-btn-container {
    position: absolute;
    right: 15px;
    top: 18px;
  }

  .editor-upload-btn {
    display: inline-block;
  }
</style>

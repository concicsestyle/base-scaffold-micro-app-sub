<template>
    <!-- 富文本 -->
    <el-input  v-model="content" :disabled="disabled" maxlength="1000" class="editor" :rows="10" style="width: 100%"></el-input>
    <!-- <editor ref="editorRef" v-model="content" :init="initOption" :disabled="disabled"></editor> -->
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import tinymce from 'tinymce'
import editor from '@tinymce/tinymce-vue'

const content = ref('')
const disabled = ref(false)

let baseUrl = 'tinymce'
//判断是否处于微应用模式下
if (window['__MICRO_APP_ENVIRONMENT__'] && window['__MICRO_APP_PUBLIC_PATH__']) {
    //处于微应用模式下，拼接绝对路径
    baseUrl = `${window['__MICRO_APP_PUBLIC_PATH__']}tinymce`
} else {
    //非微应用模式下，拼接为相对路径
    baseUrl = 'tinymce'
}

const initOption = ref({
    base_url: baseUrl, // 不配置这里会自动走cdn 可能慢或者报错
    suffix: '.min',
    language: 'zh_CN', // 语言类型
    placeholder: '在这里输入文字', // textarea中的提示信息
    width: '100%',
    height: 500, // 注：引入autoresize插件时，此属性失效
    resize: false, // 编辑器宽高是否可变，false-否,true-高可变，'both'-宽高均可，注意引号
    branding: false, // tiny技术支持信息是否显示
    statusbar: false, // 最下方的元素路径和字数统计那一栏是否显示
    // elementpath: false, //元素路径是否显示
    // font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;', // 字体样式
    font_formats: 'SourceHan-Regular', // 字体样式
    plugins:
        'autolink directionality visualblocks visualchars fullscreen image link media template code codesample table   pagebreak nonbreaking anchor  advlist lists wordcount  autosave emoticons industrial-symbol ', // 插件配置 axupimgs indent2em
    toolbar: [
        'undo redo  cut copy paste pastetext  forecolor backcolor bold italic underline strikethrough link alignleft aligncenter alignright alignjustify table image axupimgs industrial-symbol',
    ], // 工具栏配置，设为false则隐藏 | bullist numlist subscript superscript
    menubar: false,
    paste_data_images: false, // 图片是否可粘贴
    // 此处为图片上传处理函数
    file_picker_types: 'file image media', // file image media分别对应三个类型文件的上传：link插件，image和axupimgs插件，media插件。想屏蔽某个插件的上传就去掉对应的参数
    // 文件上传处理函数
    file_picker_callback: function (callback, value, meta) {
        let filetype // 限制文件的上传类型,需要什么就添加什么的后缀
        if (meta.filetype == 'image') {
            filetype = '.jpg, .jpeg, .png, .gif, .ico, .svg'
        } else if (meta.filetype == 'media') {
            filetype = '.mp3, .mp4, .avi, .mov'
        } else {
            filetype =
                '.pdf, .txt, .zip, .rar, .7z, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .mp3, .mp4, .jpg, .jpeg, .png, .gif, .ico, .svg'
        }
        let inputElem = document.createElement('input') // 创建文件选择
        inputElem.setAttribute('type', 'file')
        inputElem.setAttribute('accept', filetype)
        inputElem.click()
        inputElem.onchange = () => {
            let file = inputElem.files[0] // 获取文件信息
            // 所有都转成base64文件流,来自官方文档https://www.tiny.cloud/docs/configure/file-image-upload/#file_picker_callback
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = function () {
                let id = `blobid${new Date().getTime()}`
                let blobCache = tinymce.activeEditor.editorUpload.blobCache
                let base64 = reader.result.split(',')[1]
                let blobInfo = blobCache.create(id, file, base64)
                blobCache.add(blobInfo)
                callback(blobInfo.blobUri(), { title: file.name })
            }
        }
    },
})

const init = (value, disable) => {
    disabled.value = disable
    content.value = value
}

const getEditorValue = () => {
    return content.value
}

defineExpose({ init, getEditorValue })
</script>

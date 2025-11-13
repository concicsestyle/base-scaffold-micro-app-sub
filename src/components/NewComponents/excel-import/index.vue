<template>
    <el-dialog
        v-model="dialogVisible"
        title="文件导入"
        :close-on-click-modal="false"
        draggable
        width="578px"
        :before-close="handleClose"
    >
        <div class="bt-component-setting" v-loading="uploadLoading" element-loading-text="数据导入中">
            <div class="bt-flex-center">
                <el-upload
                    ref="upload"
                    class="bt-dialog-width"
                    action="#"
                    :limit="1"
                    accept=".xls, .xlsx"
                    :on-exceed="handleExceed"
                    :auto-upload="false"
                    :on-change="handleChange"
                    :http-request="handleHttpUpload"
                    :on-error="handleError"
                    :show-file-list="false"
                >
                    <template #trigger>
                        <el-button type="primary">选择文件</el-button>
                    </template>
                    <div class="el-font-border el-font-left bt-file-upload-content" @click="downLoadModel">
                        下载模板
                    </div>
                    <template #tip>
                        <div class="bt-flex-center el-margin-top">
                            <el-input v-model="fileName" disabled placeholder="" class="el-margin-right"></el-input>
                        </div>
                    </template>
                </el-upload>
            </div>
            <div class="submit-button-div">
                <el-button :disabled="uploadLoading" type="primary" @click="submitUpload"> 确&nbsp;定 </el-button>
            </div>
        </div>
    </el-dialog>
    <errorTable ref="errorTableRef"></errorTable>
</template>
<script setup lang="ts">
import { ref, nextTick, PropType } from 'vue'
import { ElMessage, genFileId, UploadRequestOptions } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import errorTable from './components/error-table.vue'
import { E_Msg } from '@/utils/message/index'
import axios from 'axios'
const fileName = ref('') // 显示在输入框里的上传文件名
const uploadLoading = ref(false) // loading
const uploadFlag = ref(2) // 判断是否上传成功 0：失败   1：成功
const upload = ref<UploadInstance>()
const dialogVisible = ref(false)
import workTypeDescApi from '@/api/basic/work-type-desc-api'
const errorTableRef = ref()
const props = defineProps({
    fileParams: {
        type: Array,
        default: () => [],
    },
    requestApi: {
        type: Function as PropType<Function<Promise>>,
        default: null,
    },
})

const startImport = () => {
    dialogVisible.value = true
    uploadLoading.value = false
    uploadFlag.value = 0
    upload.value?.clearFiles()
    fileName.value = ''
}

// 当超出限制时，替换上一个文件
const handleExceed: UploadProps['onExceed'] = files => {
    upload.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    upload.value!.handleStart(file)
}

// 文件改变时执行,获取文件名用于显示
const handleChange: UploadProps['onChange'] = uploadFile => {
    fileName.value = uploadFile.name
}

// 导入操作
const emit = defineEmits(['changeDisable'])
const submitUpload = () => {
    if (fileName.value) {
        uploadLoading.value = true
        upload.value!.submit()
    } else {
        ElMessage({
            message: '请先选择文件！',
            type: 'warning',
        })
    }
}

// 文件上传
// const handleHttpUpload = async (options: UploadRequestOptions) => {
//     let formData = new FormData()
//     formData.append('file', options.file)
//     try {
//         // return
//         props.requestApi({ a: 1 }).then(res => {
//         })
//         return
//         const api = props.requestApi
//         const { data } = await api({ a: 1 })
//         options.onSuccess(data)
//     } catch (error) {
//         options.onError(error as any)
//     }
// }
const appShortName = import.meta.env.VITE_APP_SHORT_APP_NAME;
async function handleHttpUpload(options: UploadRequestOptions) {
    let formData = new FormData()
    formData.append('file', options.file)
    // axios.post('/api/basic/typeOfWork/workTypeDesc/importExcel', formData, {
    //                     headers: {
    //                         'Content-Type': 'multipart/form-data',
    //                     }
    //                 })
    // uploadLoading.value = true
    try {
        // debugger
        props.requestApi(formData)
            .then((res) => {
                ElMessage({ message: '导入成功', type: 'success' })
                handleSuccess()
                handleClose()
                emit('success')
            })
            .catch(err => {
                uploadLoading.value = false
                uploadFlag.value = 0
                upload.value!.clearFiles()
                fileName.value = ''
                if (err.code == 120003 || err.code == 120004) {
                    ElMessage({ message: err.msg || err, type: 'error' })
                } else {
                    errorTableRef.value.openErrorTable(err.data.excelErrorDtoList)
                }
            })
    } catch (error) {
        uploadLoading.value = false
        options.onError(error)
    }
}

// 上传成功
const handleSuccess = () => {
    uploadLoading.value = false
    uploadFlag.value = 1
    upload.value!.clearFiles()
    nextTick(() => {
        fileName.value = ''
    })
}

// 上传失败
const handleError = () => {
    uploadLoading.value = false
    uploadFlag.value = 0
    upload.value!.clearFiles()
    nextTick(() => {
        fileName.value = ''
    })
    ElMessage({
        message: '接口异常请联系系统管理员！',
        type: 'error',
    })
}

// 下载模板
const downLoadModel = () => {
    // if (!downLoadUrl) return
    // window.open(downLoadUrl, '_blank')
    
    axios
        // .get(`/${import.meta.env.MODE == 'development' ? 'app-basic' : 'app-basic'}/excel/${props.fileParams[0]}`, {
        .get(`${import.meta.env.VITE_APP_CONTEXT_PATH}/excel/${props.fileParams[0]}`, {
            responseType: 'blob',
            responseEncoding: 'GBK',
        })
        .then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            let fname = props.fileParams[1]
            link.href = url
            link.setAttribute('download', fname)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        })
}

const handleClose = () => {
    uploadFlag.value = 2
    dialogVisible.value = false
}

defineExpose({ startImport })
</script>
<style lang="scss" scoped>
.bt-component-setting {
    .bt-dialog-width {
        width: 100%;
    }
    .bt-flex-center {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
    }
    .el-font-border {
        color: #5c84f2;
        cursor: pointer;
        border-bottom: 1px solid #5c84f2;
    }
    .el-font-left {
        margin-left: 16px;
    }
    .el-margin-top {
        margin-top: 8px;
    }
    .el-margin-right {
        // margin-right: 8px;
    }
    :deep(.el-upload-list) {
        margin: 0;
    }
    .bt-justify-center {
        justify-content: center;
    }
    .justify-margin-top {
        margin-top: 32px;
    }
    .el-icon-sty {
        width: 24px;
        height: 24px;
    }
    .bt-flex-column {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .bt-error-column {
        width: 100%;
        margin-top: 8px;
        .result-title span {
            position: relative;
            bottom: 5px;
            left: 4px;
        }
    }
    .el-error-font {
        color: #3e4a6b;
    }
    .el-mes-margin-top {
        margin-top: 24px;
    }
    .el-num-color {
        color: #5c84f2;
    }
    .el-font-size {
        font-size: 12px;
        line-height: 12px;
    }
    :deep(.el-loading-spinner .el-loading-text) {
        color: #5c84f2;
    }
    :deep(.el-loading-spinner .path) {
        stroke: #5c84f2;
    }
    .bt-file-upload-content {
        display: inline-flex;
    }
}
.submit-button-div {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
}
</style>

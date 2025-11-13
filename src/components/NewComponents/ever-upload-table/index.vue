<template>
    <div>
        <div :class="props.disabled ? 'mb-2' : ''">
            <el-upload
                v-if="!props.disabled"
                multiple
                accept=".pdf,.xls,.xlsx,.doc,.docx,.pptx,.ppt,.zip,.rar,.txt,.jpg,.jpeg,.png,.bmp,.gif,.mp3,.mp4,.mov,.avi,.rmvb"
                class="upload-div"
                :before-upload="fileUpload"
                :show-file-list="false"
                :headers="headers"
            >
                <el-button type="primary">上&nbsp;传</el-button>
            </el-upload>
           
    <!-- 上传提示 -->
            <el-button type="primary" :disabled="!states.selections.length" @click="downloadFile">
                下&nbsp;载</el-button
            >
            <el-button
                v-if="!props.disabled"
                type="danger"
                :disabled="!states.selections.length"
                @click="deleteFile"
            >
                删&nbsp;除</el-button
            >
        </div>
        <p v-if="!props.disabled" class="tootip-text">
            支持扩展名：pdf,xls,xlsx,doc,docx,pptx,ppt,zip,rar,txt,jpg,jpeg,png,bmp,gif,mp3,mp4,mov,avi,rmvb。单个文件不大于20M
        </p>
        <el-form :disabled="false">
            <el-table :data="states.fileList" @selection-change="handleSelectionChange" style="width: 1000px">
                <el-table-column type="selection" :selectable="selectable" width="55"></el-table-column>
                <el-table-column type="index" label="序号" width="60"></el-table-column>
                <el-table-column label="文件名称" prop="fileName">
                    <template #default="{ row }">
                        <span class="read-text" @click="readFileDetail(row)">{{ row.fileName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="文件大小" prop="fileSize" width="150">
                    <template #default="{ row }">
                        {{ calcFileSize(row.fileSize) }}
                    </template>
                </el-table-column>
                <el-table-column label="上传者" width="150">
                    <template #default="{ row }">
                        <!-- {{ row.createName || BtUserTokenInfo.getUser()?.name }} -->
                    </template>
                </el-table-column>
                <el-table-column label="上传时间" width="200">
                    <template #default="{ row }">
                        <!-- <progressComp :data="row"></progressComp> -->
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
import { ElNotification } from 'element-plus'
import { globalBaseUrl, globalHeaders } from '@/utils/request';
import { propTypes } from '@/utils/propTypes';
// import fileObjectApi from '@/usage/api/system/app/file-object-api'
// import { BtUserTokenInfo } from 'beeboat-ui/es/core'
// import progressComp from './components/progress-comp.vue'
// import { exportFile } from 'beeboat-ui/es/core/utils/export'
//import AppConfig from '@/usage/config'
import dayjs from 'dayjs'
//import BtApplication from 'beeboat-ui/es/core'
import request from '@/utils/request';
const microApESL = (window as any).microApp
const headers = ref(globalHeaders());
const props = defineProps({
    disabled: Boolean,
    buttonLoading: Boolean,
})

const states = reactive({
    fileList: [],
    selections: [],
    loading: false,
})

const emits = defineEmits(['update:buttonLoading'])

watch(
    () => states.fileList,
    v => {
        if (v.find(x => x.status == 'ready')) {
            emits('update:buttonLoading', true)
        } else {
            emits('update:buttonLoading', false)
        }
    },
    { deep: true },
)

const fileUpload = file => {
    const allowList = [
        'pdf',
        'xls',
        'xlsx',
        'doc',
        'docx',
        'pptx',
        'ppt',
        'zip',
        'rar',
        'txt',
        'jpg',
        'jpeg',
        'png',
        'bmp',
        'gif',
        'mp3',
        'mp4',
        'mov',
        'avi',
        'rmvb',
    ]
    if (!allowList.includes(file.name.split('.').slice(-1)[0].toLocaleLowerCase())) {
        ElNotification({
            title: '提示',
            message: `上传文件格式不符合要求`,
            type: 'warning',
        })

        return
    }
    if (file.size / 1024 / 1024 > 20) {
        ElNotification({
            title: '提示',
            message: `只能上传小于20M的文件`,
            type: 'warning',
        })
        return
    }
    states.fileList.push({
        fileName: file.name,
        fileSize: file.size,
        status: 'ready',
        uid: file.uid,
    })
    let param = new FormData()
    // 添加文件
    param.append('file', file)
    states.loading = true
    request({
    url: `/infra/admin/common/file/uploadPrivateFile`,
    headers: {
        'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    data: param
  }).then(res => {
            const fileData = states.fileList.find(x => x.uid == file.uid)
            fileData.status = 'success'
            fileData.fileId = res.data.ossId
            fileData.fileUrl = res.data.url
            fileData.uploadTime = dayjs(res.data.gmtCreate).format('YYYY-MM-DD HH:mm:ss')
        })
        .catch(err => {
            ElNotification({
                title: '提示',
                message: err.msg || err,
                type: 'error',
            })
            states.fileList = states.fileList.filter(x => x.uid != file.uid)
        })
    // fileObjectApi
    //     .upload(param, {
    //         params: { t: Math.random() },
    //     })
    //     .then(res => {
    //         const fileData = states.fileList.find(x => x.uid == file.uid)
    //         fileData.status = 'success'
    //         fileData.fileId = res.data.id
    //         fileData.uploadTime = dayjs(res.data.gmtCreate).format('YYYY-MM-DD HH:mm:ss')
    //     })
    //     .catch(err => {
    //         ElNotification({
    //             title: '提示',
    //             message: err.msg || err,
    //             type: 'error',
    //         })
    //         states.fileList = states.fileList.filter(x => x.uid != file.uid)
    //     })
    return false
}
const calcFileSize = size => {
    return `${(size / 1024 / 1024).toFixed(2)}M`
}

const startEdit = fileList => {
    states.fileList = fileList.map(x => {
        x.status = 'success'
        return x
    })
}
// 删除文件
const deleteFile = () => {
    const idList = states.selections.map(x => x.fileId || x.uid)
    states.fileList = states.fileList.filter(x => {
        return !idList.includes(x.fileId || x.uid)
    })
}
// 下载文件
const downloadFile = async () => {
    // const unSuccessFiles = states.selections.filter(x => !x.fileId)
    // if (unSuccessFiles.length) {
    //     ElNotification({
    //         title: '提示',
    //         message: `${unSuccessFiles.map(x => x.fileName).join(',')}未上传完成不能下载`,
    //         type: 'warning',
    //     })
    // }
    request({
                url: `/infra-ycw/admin/common/file/download/${states.selections[0].fileId}`,
                responseType: 'blob',
                method: 'get',
            })
    // states.selections
    //     .filter(x => x.fileId)
    //     .map(x => {
           
           
            // fileObjectApi.download(x.fileId).then(res => {
            //     exportFile(res, x.fileName)
            // })
        // })
}
// 查看文件详情
const readFileDetail = row => {
    microApESL.forceDispatch({
        dataType: 'preview',
        id: row.fileId,
        name: row.fileName,
    })
}
// 未上传完的禁止选中
const selectable = row => {
    return true
    // return Boolean(row.fileId) && !row.disabled
}

const getFileList = () => {
    return states.fileList
}

const resetFields = () => {
    states.fileList = []
    states.selections = []
}

const handleSelectionChange = selections => {
    states.selections = selections
}

defineExpose({ startEdit, getFileList, resetFields })
</script>
<style lang="scss" scoped>
.upload-div {
    display: inline-block;
    position: relative;
    top: 2px;
    margin-right: 8px;
}
.tootip-text {
    color: rgba(62, 74, 107, 0.65);
    font-size: 14px;
    padding-bottom: 4px;
}
</style>

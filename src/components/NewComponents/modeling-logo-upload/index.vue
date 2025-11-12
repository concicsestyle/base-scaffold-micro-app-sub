<template>
    <div v-if="states.imageUrl" class="avatar">
        <img :src="states.imageUrl" alt="一张图片" />
        <div class="icon-div">
            <div>
                <el-icon color="#e5e5e5" @click="states.showImageViewer = true"><ZoomIn></ZoomIn></el-icon>
                <el-icon
                    v-if="props.updateType == 'add' || props.updateType == 'edit'"
                    color="#F5F6FA"
                    @click="deleteImg"
                >
                    <Delete></Delete>
                </el-icon>
            </div>
        </div>
    </div>
    <el-upload
        v-else-if="!states.imageUrl && props.updateType != 'add' && props.updateType != 'edit'"
        action="#"
        list-type="picture-card"
        :auto-upload="false"
    >
        <template #default>
            <span style="color: #9198a2">暂无图片</span>
        </template>
    </el-upload>
    <el-popover
        v-else-if="props.updateType == 'add' || props.updateType == 'edit'"
        placement="left"
        title="提示"
        :width="250"
        trigger="hover"
        content="支持上传的类型是jpeg,jpg,png,bmp,gif,且只可上传单个不大于10M的图片"
    >
        <template #reference>
            <el-upload
                v-model:file-list="states.fileList"
                class="avatar-uploader"
                action="#"
                :before-upload="fileUpload"
                :show-file-list="false"
                accept=".png,.jpeg,.jpg,.bmp,.gif"
                v-loading="states.loading"
            >
                <el-icon class="avatar-uploader-icon"><Plus></Plus></el-icon>
            </el-upload>
        </template>
    </el-popover>

    <el-image-viewer
        v-if="states.showImageViewer"
        :url-list="[states.imageUrl]"
        @close="states.showImageViewer = false"
    ></el-image-viewer>
</template>

<script lang="ts" setup>
import { reactive, watch } from 'vue'
// import fileObjectApi from '@/usage/api/system/app/file-object-api'
// import { E_Msg } from '@utils'
import { Plus, ZoomIn, Delete } from '@element-plus/icons-vue'

const emits = defineEmits(['uploadMethod'])

const props = defineProps({
    logo: String,
    updateType: String, // edit   or   add   or   read
})

watch(
    () => props.logo,
    v => {
        if (v) {
            // states.imageUrl = fileObjectApi.getPreviewUrl(v)
        } else {
            states.imageUrl = ''
        }
    },
)
const states = reactive({
    fileList: [],
    imageUrl: '',
    showImageViewer: false,
    loading: false,
    uploadLoading: false,
})

const fileUpload = file => {
    const allowList = ['png', 'jpeg', 'jpg', 'bmp', 'gif', 'PNG', 'JPEG', 'JPG', 'BMP', 'GIF']
    if (!allowList.includes(file.name.split('.').slice(-1)[0])) {
        // E_Msg.warn('提示', '文件格式不符合要求，只能上传jpeg,jpg,png,bmp,gif文件')
        return
    }
    if (file.size / 1024 / 1024 > 10) {
        // E_Msg.warn('提示', '只能上传小于10M的图片')
        return
    }
    let param = new FormData()
    // 添加文件
    param.append('file', file)
    emits('uploadMethod', 'uploading')
    states.loading = true
    // fileObjectApi
    //     .upload(param)
    //     .then(res => {
    //         emits('uploadMethod', 'success', res.data.id)
    //         states.loading = false
    //     })
    //     .catch(err => {
    //            ElMessage({ message: err.msg || err, type: 'error' })
    //         states.uploadLoading = true
    //         emits('uploadMethod', 'uploadingEnd')
    //         states.loading = false
    //     })
    return false
}

const deleteImg = () => {
    // E_Msg.delete('提示', '确认删除图片？').then(() => {
    //     emits('uploadMethod', 'success', '')
    // })
}
</script>
<style lang="scss" scoped>
.avatar {
    width: 174px;
    height: 130px;
    display: block;
    position: relative;
    img {
        width: 100%;
        height: 100%;
        border-radius: 3px;
        border: 1px solid #e5e5e5;
        object-fit: contain;
    }
}
.icon-div {
    display: none;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    background: rgba(0, 0, 0, 0.2);
    div {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
    }

    i {
        display: inline-block;
        margin: 0 10px;
        cursor: pointer;
        font-size: 26px;
        color: white;
    }
}
.avatar:hover .icon-div {
    display: inherit;
}
.avatar-uploader {
    width: 174px;
    height: 130px;
}

:deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

:deep(.el-upload) {
    border-color: var(--el-color-primary);
}

:deep(.el-icon.avatar-uploader-icon) {
    font-size: 28px;
    color: #8c939d;
    width: 174px;
    height: 130px;
    text-align: center;
}
</style>

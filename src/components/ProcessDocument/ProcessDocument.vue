<template>
    <div class="bt-page">
      <div class="box">
          <div class="box_left">
              <el-tree :data="DrawingList" highlight-current default-expand-all :props="defaultProps" 
              @node-click="handleNodeClick" />
          </div>
          <div class="box_right" v-loading="states.loading">
            <iframe v-show="iframeUrl" :src="iframeUrl" width="100%" height="100%" frameborder="0" @load="onIframeLoad"></iframe>
            <div v-if="states.source" class="pdf-container">
                <!-- 控制工具栏 -->
                <div class="toolbar">
                  <el-button-group>
                    <el-button @click="prevPage" :disabled="pageNum <= 1">
                      <el-icon><ArrowLeft /></el-icon>上一页
                    </el-button>
                    <el-button>{{ pageNum }} / {{ pageCount }}</el-button>
                    <el-button @click="nextPage" :disabled="pageNum >= pageCount">
                      下一页<el-icon><ArrowRight /></el-icon>
                    </el-button>
                  </el-button-group>
                  
                  <div class="zoom-controls">
                    <el-button @click="zoomOut" :disabled="scale <= 0.5">
                      <el-icon><Minus /></el-icon>
                    </el-button>
                    <el-tag>{{ Math.round(scale * 100) }}%</el-tag>
                    <el-button @click="zoomIn" :disabled="scale >= 2">
                      <el-icon><Plus /></el-icon>
                    </el-button>
                  </div>
                </div>
                <VuePdfEmbed
                  ref="pdfRef"
                  :source="states.source"
                  :page="pageNum"
                  :style="`transform: scale(${scale});heght: 100%;`"
                  @loaded="onPdfLoaded"
                  class="pdf-viewer"
                />
            </div>
            <div v-if="!iframeUrl&&!states.source" style="display: flex;justify-content: center;align-items: center; height: 100%;">暂无数据</div>
            </div>
          </div>
    </div>
</template>
<script setup name="ProcessDocument" lang="ts">
import VuePdfEmbed from 'vue-pdf-embed'
// optional styles
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'
import {E_Msg, exportFile} from '@/utils/utils'
import axios from 'axios';
const DrawingList = ref<any>([]);//CAD图列表
const PdfInfoList = ref<any>([]);//PDF 图纸信息列表
const ProcessInfoList = ref<any>([]);//PDF 工艺信息列表
const activeName = ref(' PdfInfo');
const states = reactive({
    selectDrawing:{}as any,//选中的CAD图
    selectPdfInfo:{}as any,//选中的PDF 图纸信息列表
    selectProcessInfo:{}as any,//选中的PDF 工艺信息列表
    source: '',
    loading: false,
    pageNum: 1,
    numPages: 0
})
interface Props {
  orderNumber: number | string ;//订单号
  processType: number;//工艺类型（0 工艺图，1 粗加工图）
  revNo: number | string ;//版本号
}
const props = withDefaults(defineProps<Props>(), {
  processType: 0
});
const iframeUrl = ref('');
const pdfRef = ref(null)
const pageNum = ref(1)
const pageCount = ref(0)
const scale = ref(1)
 // PDF加载完成时获取总页数
    const onPdfLoaded = (pdf) => {
      pageCount.value = pdf.numPages
      states.loading = false;
    };
// iframe 加载完成事件处理函数
const onIframeLoad = () => {
  states.loading = false;
  // 可以在这里添加其他 iframe 加载完成后的处理逻辑
};
const prevPage = () => {
  if (pageNum.value > 1) pageNum.value--
}

const nextPage = () => {
  if (pageNum.value < pageCount.value) pageNum.value++
}

const zoomIn = () => {
  if (scale.value < 2) scale.value += 0.1
}

const zoomOut = () => {
  if (scale.value > 0.5) scale.value -= 0.1
}
const BaseUrl = ref(JSON.parse(sessionStorage.getItem('baseUrl')))
// 创建简单的 axios 实例
const apiInstance = axios.create({
  baseURL: 'http://' + BaseUrl.value,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json'
  }
});
// 请求拦截器（可选）
apiInstance.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token 等认证信息
    const token = JSON.parse(sessionStorage.getItem('cappInterfaceToken'))
    config.headers.Authorization = `Bearer ${token}`;
    if (config.responseType === 'blob') {
        config.headers.responseType = 'blob'
    }
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器（可选）
apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    E_Msg.newMessage(`${error.data.msg}`, 'error');
    return Promise.reject(error);
  }
);
// 根据订单号获取数据
const fetchDataByOrderNumber = async (orderNumber: number | string) => {
  try {
     // 使用 axios 实例调用接口

    //  通过订货代号获取 CAD 图纸信息列表
    const response1 = await apiInstance.get(`/ListDrawing?orderNumber=${orderNumber}`, {});
    DrawingList.value = response1.data.data;
    DrawingList.value = DrawingList.value?.map(item=>{
      item.type = 'Drawing'
      if(item.otherVersion.length>0){
        item.otherVersion = item.otherVersion.map(item=>{
          item.type = 'Drawing'
          return item
        })
      }
      // 如果 revNo 有值，过滤 otherVersion 中 userRevisionNo 等于 revNo 的项
      if (props.revNo !== undefined && props.revNo !== null && props.revNo !== '') {
        item.otherVersion = item.otherVersion.filter(version => 
          version.userRevisionNo == props.revNo
        )
      }
        return item
      })
      if(!DrawingList.value) DrawingList.value = [];
    // 通过订货代号获取 PDF 图纸信息列表
    const response3 = await apiInstance.get(`/ListPdfInfo?orderNumber=${orderNumber}`, {});
    PdfInfoList.value = response3.data.data;//PDF 图纸信息列表
    PdfInfoList.value = PdfInfoList.value?.map(r=>{
      r.name = r.name.replace(/\.[^/.]+$/, '.pdf');
      r.type = 'ProcessInfo'
      return r;
    })

    // 通过订货代号和工艺类型获取 PDF 工艺信息列表 //工艺类型（0 工艺图，1 粗加工图）
    const response4 = await apiInstance.get(`/ListProcessInfo?orderNumber=${orderNumber}&processType=0`, {});
    ProcessInfoList.value = response4.data.data ;//PDF 工艺信息列表
    ProcessInfoList.value = ProcessInfoList.value?.map(r=>{
      r.name = r.name + '.pdf'
      r.type = 'PdfInfo'
      return r;
    })
     // 通过订货代号和工艺类型获取 PDF 工艺信息列表//工艺类型（0 工艺图，1 粗加工图）
    const response5 = await apiInstance.get(`/ListProcessInfo?orderNumber=${orderNumber}&processType=1`, {});
    let list = response5.data.data?.map(r=>{
      r.name = r.name.replace(/\.[^/.]+$/, '.pdf');
      r.type = 'PdfInfo'
      return r;
    })
    if(list?.length>0){
       DrawingList.value.push(...list)
    }
    if(PdfInfoList.value?.length>0){
       DrawingList.value.push(...PdfInfoList.value)
    }
    if(ProcessInfoList.value?.length>0){
       DrawingList.value.push(...ProcessInfoList.value)
    }
  } catch (error) {
    E_Msg.newMessage('获取数据失败','error')
  }
};

// 监听订单号变化，获取页面数据
watch(
  () => props.orderNumber,
  (newOrderNumber) => {
    if (newOrderNumber) {
      fetchDataByOrderNumber(newOrderNumber);
      

      //重置数据
      DrawingList.value = []//CAD图列表
      PdfInfoList.value =[]//PDF 图纸信息列表
      ProcessInfoList.value = []//PDF 工艺信息列表
      activeName.value = 'PdfInfo'
      
      states.selectDrawing = {}//选中的CAD图
      states.selectPdfInfo = {}//选中的PDF 图纸信息列表
      states.selectProcessInfo = {}//选中的PDF 工艺信息列表
      states.source =  ''
      states.loading =  false
      states.pageNum =  1
      states.numPages =  0

      iframeUrl.value =  ''
      pdfRef.value =  null
      pageNum.value =  1
      pageCount.value =  0
      scale.value =  1
    }
  },
  { immediate: true }
);
onMounted(()=>{ 
     activeName.value = 'PdfInfo'
})
const defaultProps = {
  children: 'otherVersion',
  label: 'name',
}
const initPdf = async (fileStream) => {
  try { 
      const blob = new Blob([fileStream],{type:'application/pdf'});
      states.source = URL.createObjectURL(blob)
  } catch (error) {
    E_Msg.newMessage('PDF 文件加载失败','error')
  }
};
// 点击树
const handleNodeClick = async (value: any) => {
  if(states.loading) return;
    states.loading = true;
        iframeUrl.value = ''
        states.source = ''
        activeName.value = value.type
    switch (value.type) {
      case 'PdfInfo'://图纸信息
        states.selectPdfInfo = value
        try {
            // // 通过 GUID 获取 PDF 工艺文件
            const response5 = await apiInstance.get(`/GetPdfDrawingByGuid?guid=${states.selectPdfInfo.guid}`, {
                responseType: 'blob'
            });
            // 移除原有后缀并添加 .pdf
            const fileName = states.selectPdfInfo.name.replace(/\.[^/.]+$/, '.pdf');
            // exportFile(response5.data, fileName);
            initPdf(response5.data)
        } catch (error) {
            E_Msg.newMessage('获取数据失败','error')
            states.loading = false;
        }
        break;
      case 'ProcessInfo'://工艺信息
        states.selectProcessInfo = value
        try {
            // // 通过 GUID 获取 PDF 工艺文件
            const response5 = await apiInstance.get(`/GetPdfDrawingByGuid?guid=${states.selectProcessInfo.guid}`, {
                responseType: 'blob'
            });
            const fileName = states.selectProcessInfo.name + '.pdf'
            // exportFile(response5.data,fileName)
            initPdf(response5.data)
        } catch (error) {
            E_Msg.newMessage('获取数据失败','error')
            states.loading = false;
        }
        break;
      case 'Drawing'://CAD图纸
        states.selectDrawing = value
        try {
            // // // 获取 CAD 图纸预览地址
            const response2 = await apiInstance.get(`/GetPreviewUrl?orderNumber=${states.selectDrawing.orderNumber}&pageNo=${states.selectDrawing.pageNo}&revNo=${states.selectDrawing.userRevisionNo}`, {});
            iframeUrl.value = response2.data
        } catch (error) {
            E_Msg.newMessage('获取数据失败','error')
            states.loading = false;
        }
        break;
    }
}

/** 打开弹窗，接收参数 */
const acceptParams = () => {
};

defineExpose({ acceptParams });
</script>
<style lang="scss" scoped>

.bt-page {
    box-sizing: border-box;
    // padding: 24px;
    height: calc( 100vh - 240px );
    width: 100%;

    // background: pink;
    ::v-deep .el-row {
        height: 100%;
    }
    .box{
        display: flex;
        height: 100%;
        .box_left{
            width: 200px;
        height: 100%;
            overflow: auto;
            flex-shrink: 0;
            border:1px solid #e4e7ed;
            margin-right: 20px;
            padding: 10px;
        }
        .box_right{
            flex: 1;
            width: calc( 100% - 190px );
        height: 100%;
            padding: 10px;
            border:1px solid #e4e7ed;
            .pz,.xq{
                color: #0079c3;
                cursor: pointer;
            }
            .xq{
                margin-left: 10px;
            }
            .hui{
              color: #e4e7ed;
            }
        }
    }
    .pdf-container {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
.pdf-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 10px;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pdf-viewer {
  width: 100%;
  height: calc(100vh - 100px);
  overflow: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transform-origin: 0 0;
}
}
</style>

<template>
  <h4 class="hidden">
    当前中心经纬度：<span id="map-center-content">{{ modelValue.toString() }}</span>
  </h4>
  <h2 class="ml-5">
    当前选中经纬度：<span id="map-select-content" class="color-red font-bold ml-5">{{ modelValue.toString() }}</span>
  </h2>
  <div id="amap-container"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import AMapLoader from '@amap/amap-jsapi-loader';
import { propTypes } from '@/utils/propTypes';
const emit = defineEmits(['update:modelValue']);
const defaultPosition = reactive([104.390372, 31.101728]);

const props = defineProps({
  /* 当前坐标 */
  modelValue: propTypes.array
});

watch(
  () => props.modelValue,
  (v: Array<any>) => {
    // console.log('经纬度数据', v);
    if (!v || !v[0] || !v[1]) {
      emit('update:modelValue', defaultPosition);
    }
  },
  { immediate: true }
);

let map = null;
let toolbar = null;
let scale = null;
let controlBar = null;
let mapType = null;
let geolocation = null;
let marker = null;

onMounted(() => {
  AMapLoader.load({
    key: 'd14b9f6643511d609e08f503f335fb3f', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.ToolBar', 'AMap.Scale', 'AMap.ControlBar', 'AMap.MapType', 'AMap.Geolocation', 'AMap.PlaceSearch'] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      map = new AMap.Map('amap-container', {
        resizeEnable: true,
        viewMode: '2D', // 是否为3D地图模式
        zoom: 15, // 初始化地图级别
        center: props.modelValue // 初始化地图中心点位置
      });
      initBaseTool(AMap);
      bindBaseEvent();
      initPageEle(AMap);
    })
    .catch((err) => {
      console.error(err);
    });
});

// 初始化页面元素
const initPageEle = (AMap) => {
  document.querySelector('#map-center-content').innerText = map.getCenter().toString();
  map.setCenter(props.modelValue);
  setMarker(AMap, props.modelValue);
};

// 地图移动事件
const bindBaseEvent = () => {
  map.on('click', clickLogic);
  map.on('moveend', moveendLogic);
  map.on('zoomend', zoomendLogic);
};

// 缩放事件
const zoomendLogic = (e) => {
  // console.log('缩放事件信息', e);
  document.querySelector('#map-center-content').innerText = map.getCenter().toString();
};

// 地图移动事件
const moveendLogic = (e) => {
  // console.log('地图移动事件信息', e);
  document.querySelector('#map-center-content').innerText = map.getCenter().toString();
};

// 单击事件
const clickLogic = (e) => {
  // console.log('单击事件信息', e);
  document.querySelector('#map-select-content').innerText = [e.lnglat.lng, e.lnglat.lat].toString();
  setMarker(null, [e.lnglat.lng, e.lnglat.lat]);
  emit('update:modelValue', [e.lnglat.lng, e.lnglat.lat]);
};

// 设置点
const setMarker = (AMap, position) => {
  if (marker) {
    marker.setPosition(position);
    return;
  }
  const markerContent =
    '' +
    '<div>' +
    '   <img style="width: 25px;height: 34px" src="https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png">' +
    '</div>';
  marker = new AMap.Marker({
    position: position,
    content: markerContent,
    offset: new AMap.Pixel(-13, -30)
  });
  marker.setMap(map);
};

// 初始化基础工具
const initBaseTool = (AMap) => {
  toolbar = new AMap.ToolBar({
    visible: true,
    position: {
      top: '110px',
      right: '40px'
    }
  });
  map.addControl(toolbar);
  scale = new AMap.Scale({
    visible: true
  });
  map.addControl(scale);
  controlBar = new AMap.ControlBar({
    visible: true,
    position: {
      top: '10px',
      right: '10px'
    }
  });
  map.addControl(controlBar);
  mapType = new AMap.MapType({
    visible: true,
    position: {
      top: '20px',
      left: '110px'
    }
  });
  map.addControl(mapType);
  geolocation = new AMap.Geolocation();
  map.addControl(geolocation);
  // 如果未传入经纬度，则尝试根据定位获取
  // geolocation.getCurrentPosition(function (status, result) {
  //   if (status === 'complete') {
  //     const geolocationArr = [result.position.lng, result.position.lat];
  //     console.log(result);
  //   } else {
  //     // 定位失败，设置默认位置
  //     console.log(result);
  //   }
  // });
  // console.log('初始化基础工具完成！');
};

onUnmounted(() => {
  map?.destroy();
});
</script>

<style scoped lang="scss">
#amap-container {
  width: 100%;
  height: 600px;
}
</style>

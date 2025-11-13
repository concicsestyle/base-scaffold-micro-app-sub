/*
 * @Description:
 * @Autor: 刘珂
 * @Date: 2024-12-10 15:35:09
 * @LastEditors: 王瑶
 * @LastEditTime: 2025-07-21 13:59:08
 */
import { PropType } from 'vue'
export function getProps() {
    return {
        // 布局方式 true 左右  false上下
        isVertical: {
            type: Boolean as PropType<boolean>,
            required: true,
            default: true,
        },
        // 是否均分
        isHalf: {
            type: Boolean as PropType<boolean>,
            default: false,
        },
    }
}
export const tableMouse = (
    event,
    isVertical: Boolean,
    topOrLeftDom: any,
    bottomOrRightDom: any,
    gDom: any,
) => {
    event = event || window.event
    //设置moveBox捕获所有鼠标按下的事件
    event.target.setCapture && event.target.setCapture()
    //记录鼠标相对于盒子的位移距离
    const offsety = event.clientY
    const offsetx = event.clientX
    const topHOrLeftW = isVertical ? topOrLeftDom.offsetWidth : topOrLeftDom.offsetHeight
    console.log('%c [ topHOrLeftW ]-43', 'font-size:13px; background:pink; color:#bf2c9f;', topHOrLeftW)
    const bottomHOrRightW = isVertical
    ? bottomOrRightDom.offsetWidth
    : bottomOrRightDom.offsetHeight
    console.log('%c [ bottomHOrRightW ]-45', 'font-size:13px; background:pink; color:#bf2c9f;', bottomHOrRightW)
    document.onmousemove = function (event: any) {
        event = event || window.event
        //移动后的鼠标坐标
        const y = event.clientY
        const x = event.clientX
        const num = isVertical ? x - offsetx : y - offsety
        if (isVertical) {
            topOrLeftDom.style.width = `${topHOrLeftW + num}px`
            bottomOrRightDom.style.width = `${bottomHOrRightW - num}px`
        } else {
            topOrLeftDom.style.height = `${topHOrLeftW + num}px`
            bottomOrRightDom.style.height = `${bottomHOrRightW - num}px`
        }
    }
    document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
        //点击 - 移动 - 松开 鼠标松开时，取消对事件的捕获
        gDom.releaseCapture && gDom.releaseCapture()
    }
}

import request from '@/utils/request';
// import { AxiosPromise } from 'axios';
import {API_PREFIX} from '../prefix'
const getUrl = `/${API_PREFIX.basic}/tool/toolDesc`;



/**
 * 更新数据
 * @param params 参数
 * @returns 回调
 */
export const update=(params)=>{
    return request({
        url: `${getUrl}/update`,
        method: 'post',
        data: {
            ...params,
            _t: new Date().getTime(),
        }
    });
}
/**
 * 新建数据
 * @param params 参数
 * @returns 回调
 */
export const saveAdd=(params)=> {
    return request({
        url: `${getUrl}/save`,
        method: 'post',
        data: {
            ...params,
            _t: new Date().getTime(),
        }
    });
}

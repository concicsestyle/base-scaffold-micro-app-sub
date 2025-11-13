import request from '@/utils/request';
// import { AxiosPromise } from 'axios';
import {API_PREFIX} from '../prefix'
const getUrl = `/${API_PREFIX.basic}/tool/toolType`;

/**
 * 刀具类别API对象
 * <p>平台生成代码,请勿修改</p>
 * @author Administrator
 */


    /**
     * 查询刀具类别树
     * @param params 参数
     * @returns 回调
     */
export const treeTool=(params)=>{
        return request({
            url: `${getUrl}/treeTool`,
            method: 'post',
            data: {
                ...params,
                _t: new Date().getTime(),
            }
        });
}
    /**
     * 批量删除数据
     * @param params 参数
     * @returns 回调
     */
    // static deleteBatch(params = {}, timestamp = false): Promise<any> {
    //     params = params || {}
    //     if (timestamp) {
    //         params['_t'] = Date.now()
    //     }
    //     return this.post(`${this.getUrl()}/deleteBatch`, params)
    // }
    /**
     * 根据ID查询数据
     * @param params 参数
     * @returns 回调
     */
    // static get(params = {}, timestamp = false): Promise<any> {
    //     params = params || {}
    //     if (timestamp) {
    //         params['_t'] = Date.now()
    //     }
    //     return this.post(`${this.getUrl()}/get`, params)
    // }
    /**
     * 更新数据
     * @param params 参数
     * @returns 回调
     */
 export const  update=(params)=> {
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
  export const  save=(params )=> {
        return request({
            url: `${getUrl}/save`,
            method: 'post',
            data: {
                ...params,
                _t: new Date().getTime(),
            }
        });
    }
    /**
     * 列表查询数据
     * @param params 参数
     * @returns 回调
     */
    // static list(params = {}, timestamp = false): Promise<any> {
    //     params = params || {}
    //     if (timestamp) {
    //         params['_t'] = Date.now()
    //     }
    //     return this.post(`${this.getUrl()}/list`, params)
    // }
    /**
     * 删除数据
     * @param params 参数
     * @returns 回调
     */
 export const  deleteId=(params)=> {
        return request({
            url: `${getUrl}/delete`,
            method: 'post',
            data: {
                ...params,
                _t: new Date().getTime(),
            }
        });
    }
    /**
     * 列表分页查询数据
     * @param params 参数
     * @returns 回调
     */
    // static listPage(params = {}, timestamp = false): Promise<any> {
    //     params = params || {}
    //     if (timestamp) {
    //         params['_t'] = Date.now()
    //     }
    //     return this.post(`${this.getUrl()}/listPage`, params)
    // }


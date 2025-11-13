import request from '@/utils/request';
import {API_PREFIX} from '../prefix'
const getUrl = `/${API_PREFIX.basic}/typeOfWork/workTypeGroup`;

/**
 * 根据资料code查询策略
 * @param params 参数
 * @returns 回调
 */
// static getByInformationCode(params = {}, timestamp = false): Promise<any> {
//     params = params || {}
//     if (timestamp) {
//         params['_t'] = Date.now()
//     }
//     return this.post(`${this.getUrl()}/getByInformationCode`, params)
// }
// /**
//  * 根据页面id批量新增数据
//  * @param params 参数
//  * @returns 回调
//  */
// static saveBatchByPageId(params = {}, timestamp = false): Promise<any> {
//     params = params || {}
//     if (timestamp) {
//         params['_t'] = Date.now()
//     }
//     return this.post(`${this.getUrl()}/saveBatchByPageId`, params)
// }
// /**
//  * 批量删除数据
//  * @param params 参数
//  * @returns 回调
//  */
// static deleteBatch(params = {}, timestamp = false): Promise<any> {
//     params = params || {}
//     if (timestamp) {
//         params['_t'] = Date.now()
//     }
//     return this.post(`${this.getUrl()}/deleteBatch`, params)
// }
// /**
//  * 根据ID查询数据
//  * @param params 参数
//  * @returns 回调
//  */
// static get(params = {}, timestamp = false): Promise<any> {
//     params = params || {}
//     if (timestamp) {
//         params['_t'] = Date.now()
//     }
//     return this.post(`${this.getUrl()}/get`, params)
// }
// /**
//  * 更新数据
//  * @param params 参数
//  * @returns 回调
//  */
// static update(params = {}, timestamp = false): Promise<any> {
//     params = params || {}
//     if (timestamp) {
//         params['_t'] = Date.now()
//     }
//     return this.post(`${this.getUrl()}/update`, params)
// }
// /**
//  * 新建数据
//  * @param params 参数
//  * @returns 回调
//  */
// static save(params = {}, timestamp = false): Promise<any> {
//     params = params || {}
//     if (timestamp) {
//         params['_t'] = Date.now()
//     }
//     return this.post(`${this.getUrl()}/save`, params)
// }
// /**
//  * 列表查询数据
//  * @param params 参数
//  * @returns 回调
//  */
// export const list=(params)=>{
//     return request({
//         url: `${getUrl}/list`,
//         method: 'post',
//         data: {
//             ...params,
//             _t: new Date().getTime(),
//         }
//     });
// }
// /**
//  * 删除数据
//  * @param params 参数
//  * @returns 回调
//  */
// export const delete=(params )=> {
//     return request({
//         url: `${getUrl}/delete`,
//         method: 'post',
//         data: {
//             ...params,
//             _t: new Date().getTime(),
//         }
//     });
//     return this.post(`${this.getUrl()}/delete`, params)
// }
// /**
//  * 列表分页查询数据
//  * @param params 参数
//  * @returns 回调
//  */
// static listPage(params = {}, timestamp = false): Promise<any> {
//     params = params || {}
//     if (timestamp) {
//         params['_t'] = Date.now()
//     }
//     return this.post(`${this.getUrl()}/listPage`, params)
// }

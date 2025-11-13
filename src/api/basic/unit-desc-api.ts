import request from '@/utils/request';
// import { AxiosPromise } from 'axios';
import {API_PREFIX} from '../prefix'
const getUrl = `/${API_PREFIX.basic}/unit/unitDesc`;
export const listPage=(params)=>{
    // const params=reactive({pageNumber:1, pageSize:10000,temp:2})
    return request({
        url: `${getUrl}/listPage`,
        method: 'post',
        data: {
            ...params,
            _t: new Date().getTime(),
        }
    });
}


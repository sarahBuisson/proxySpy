import { MockedCall } from './app/model';

export const initData: Array<MockedCall> = [{
    request: {path: '/greeting', header: {}, method: 'GET'},
    response: {status: 200, data: "blabla", header: {}}
}]
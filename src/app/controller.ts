import * as Koa from 'koa';
import * as Router from 'koa-router';
import { initData } from '../initData';
import { IncomingHttpHeaders } from 'http';
import * as https from 'https';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { MockedCall } from './model';

const router: Router = new Router();
const storedData = [...initData]


const DESTINATION_URL = 'https://github.com';

function findMockedCall(requestUrl: string, ctx: Koa.Context) {
    let mockedCall
    let mocks = storedData.filter(it => it.request.path === requestUrl && it.request.method.toLowerCase() === ctx.request.method.toLowerCase());

    console.log(mocks)
    if (mocks.length == 1) {
        mockedCall = mocks[0];
    }
    return mockedCall;
}

function updateResponse(ctx: Koa.Context, mockedCall: MockedCall) {
    ctx.body = mockedCall.response.data

    ctx.status = mockedCall.response.status
    mockedCall.response.header
    Object.keys(ctx.headers).forEach((key) => {
        ctx.set(key, ctx.headers[key])
    })
}

router.get(/\/mock\/(.*)/, async (ctx: Koa.Context) => {

    console.log(ctx.request.path)
    let requestUrl = ctx.request.path.replace('/mock', '');
    console.log(requestUrl)
    let mockedCall = findMockedCall(requestUrl, ctx);
    if (mockedCall) {
        updateResponse(ctx, mockedCall);
    }
});

function ToMockedCall(requestUrl: string, ctx: Koa.Context, resp: AxiosResponse<any>) {
    return {
        request: {
            path: requestUrl,
            method: ctx.request.method,
            header: ctx.request.header
        }, response: {
            status: resp.status,
            data: resp.data,
            header: resp.headers
        }
    } as MockedCall;
}

router.get(/\/spy\/(.*)/, async (ctx: Koa.Context) => {

    console.log(ctx.request.path)
    let requestUrl = ctx.request.path.replace('/spy', '');
    let proxyRequest = {url: DESTINATION_URL + requestUrl} as AxiosRequestConfig
    await axios.request(proxyRequest).then((resp) => {
        let newMockedCall = ToMockedCall(requestUrl, ctx, resp);
        storedData.push(newMockedCall)

       updateResponse(ctx,newMockedCall)
    })


});


router.get(/\/data/, async (ctx: Koa.Context) => {

    console.log('data')
    ctx.body = JSON.stringify(storedData);
});


export default router;
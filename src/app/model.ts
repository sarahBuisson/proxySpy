export class MockedRequest {
    path: string
    method: string='GET'
    header?: any

}

export class MockedResponse {
    data?: any
    status: number=200
    header?: any

}

export class MockedCall {
    request: MockedRequest
    response: MockedResponse


}
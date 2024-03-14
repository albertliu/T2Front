import { takeLatest, call, put, all } from 'redux-saga/effects'
import { actions, types } from './index'
import axios from 'axios'

//watchers
function* getDept1Watch() {
    yield takeLatest(types.GET_DEPT_1, getDept1Worker)
}

function* getDept2Watch() {
    yield takeLatest(types.GET_DEPT_2, getDept2Worker)
}

function* postResetPasswordWatch() {
    yield takeLatest(types.POST_RESET_PASSWORD, postResetPasswordWorker)
}

function* getEducationWatch() {
    yield takeLatest(types.GET_EDUCATION, getEducationWorker)
}

function* getInvoiceWatch() {
    yield takeLatest(types.GET_INVOICE, getInvoiceWorker)
}

function* getReceiptWatch() {
    yield takeLatest(types.GET_RECEIPT, getReceiptWorker)
}

function* getRegisterWatch() {
    yield takeLatest(types.GET_REGISTER, getRegisterWorker)
}

function* getRegisterCardsWatch() {
    yield takeLatest(types.GET_REGISTER_CARDS, getRegisterCardsWorker)
}

function* postRegisterCardsRestWatch() {
    yield takeLatest(types.POST_REGISTER_CARDS_REST, postRegisterCardsRestWorker)
}

function* postCheckinWatch() {
    yield takeLatest(types.POST_CHECKIN, postCheckinWorker)
}

function* postFaceDetectOSSWatch() {
    yield takeLatest(types.POST_FACE_DETECT_OSS, postFaceDetectOSSWorker)
}

export function getDeptEndpoint(data) {
    return axios.get('/public/getDeptListByPID', {
        params: data
    })
}

export function postResetPasswordEndpoint(data) {
    return axios.post('/public/reset_student_password', data)
}

export function getEducationEndpoint(data) {
    return axios.get('/public/getDicListByKind', {
        params: data
    })
}

export function getInvoiceEndpoint(data) {
    return axios.get('/public/getInvoiceList', {
        params: data
    })
}

export function getReceiptEndpoint(data) {
    return axios.get('/public/getReceiptList', {
        params: data
    })
}

export function getRegisterCardsEndpoint(data) {
    return axios.get('/public/getRegisterCards', {
        params: data
    })
}

export function postRegisterCardsRestEndpoint(data) {
    return axios.post('/public/setRegisterCardsRest', data)
}

export function postCheckinEndpoint(data) {
    // console.log("post data:", data);
    return axios.post('/public/doCheckin', data)
}

export function postFaceDetectOSSEndpoint(data) {
    return axios.post('/outfiles/uploadFaceDetectOSS', data)
}


//workers
function* getDept1Worker(action) {
    try {
        const response = yield call(getDeptEndpoint, action.payload)
        yield put(actions.updateDept1(response.data))
    } catch (error) {
        yield put(actions.dept1Error(error))
    }
}

function* getDept2Worker(action) {
    try {
        const response = yield call(getDeptEndpoint, action.payload)
        yield put(actions.updateDept2(response.data))
    } catch (error) {
        yield put(actions.dept2Error(error))
    }
}

function* postResetPasswordWorker(action) {
    try {
        const response = yield call(postResetPasswordEndpoint, action.payload)
        yield put(actions.updateResetPassword(response.data))
    } catch (error) {
        yield console.log(error)
    }
}

function* getEducationWorker(action) {
    try {
        const response = yield call(getEducationEndpoint, action.payload)
        yield put(actions.updateEducation(response.data))
    } catch (error) {
        yield console.log(error)
    }
}

function* getInvoiceWorker(action) {
    try {
        const response = yield call(getInvoiceEndpoint, action.payload)
        yield put(actions.updateInvoice(response.data))
    } catch (error) {
        yield console.log(error)
    }
}

function* getReceiptWorker(action) {
    try {
        const response = yield call(getReceiptEndpoint, action.payload)
        yield put(actions.updateReceipt(response.data))
    } catch (error) {
        yield console.log(error)
    }
}

function* getRegisterWorker(action) {
    try {
        const response = yield call(getRegisterEndpoint, action.payload)
        yield put(actions.updateRegister(response.data))
    } catch (error) {
        yield console.log(error)
    }
}

function* getRegisterCardsWorker(action) {
    try {
        const response = yield call(getRegisterCardsEndpoint, action.payload)
        yield put(actions.updateRegisterCards(response.data))
    } catch (error) {
        yield console.log(error)
    }
}

function* postRegisterCardsRestWorker(action) {
    try {
        const response = yield call(postRegisterCardsRestEndpoint, action.payload)
        yield put(actions.updateRegisterCardsRest(response.data))
    } catch (error) {
        yield console.log(error)
    }
}

function* postCheckinWorker(action) {
    try {
        const response = yield call(postCheckinEndpoint, action.payload)
        yield put(actions.updateCheckinRe(response.data))
    } catch (error) {
        yield console.log(error)
    }
}


function* postFaceDetectOSSWorker(action) {
    try {
        const response = yield call(postFaceDetectOSSEndpoint, action.payload)
        yield put(actions.updateFaceDetectOSS(response.data))
    } catch (error) {
        yield console.log(error)
    }
}
export const workers = {
    getDept1Worker,
    getDept2Worker,
    postResetPasswordWorker,
    getEducationWorker,
    getInvoiceWorker,
    getReceiptWorker,
    getRegisterWorker,
    getRegisterCardsWorker,
    postRegisterCardsRestWorker,
    postCheckinWorker,
    postFaceDetectOSSWorker
}

export default function* saga() {
    yield all([getDept1Watch(), getDept2Watch(), postResetPasswordWatch(),getEducationWatch(), getInvoiceWatch(), getReceiptWatch(), getRegisterWatch(), getRegisterCardsWatch(), postRegisterCardsRestWatch(), postCheckinWatch(), postFaceDetectOSSWatch()])
}
//Actions
const SHOW_PASSWORD_RESET_MODAL = 'show_password_reset_modal'
const GET_DEPT_1 = 'get_dept_1'
const GET_DEPT_2 = 'get_dept_2'
const UPDATE_DEPT_1 = 'update_dept_1'
const UPDATE_DEPT_2 = 'update_dept_2'
const DEPT_1_ERROR = 'dept_1_error'
const DEPT_2_ERROR = 'dept_2_error'
const POST_RESET_PASSWORD = 'post_reset_password'
const UPDATE_RESET_PASSWORD = 'update_reset_password'
const GET_EDUCATION = 'get_education'
const UPDATE_EDUCATION = 'update_education'
const GET_INVOICE = 'get_invoice'
const UPDATE_INVOICE = 'update_invoice'
const GET_RECEIPT = 'get_receipt'
const UPDATE_RECEIPT = 'update_receipt'
const GET_REGISTER = 'get_register'
const UPDATE_REGISTER = 'update_register'
const UPDATE_CHECKIN = 'update_checkin'
const GET_REGISTER_CARDS = 'get_register_cards'
const UPDATE_REGISTER_CARDS = 'update_register_cards'
const POST_REGISTER_CARDS_REST = 'post_register_cards_rest'
const UPDATE_REGISTER_CARDS_REST = 'update_register_cards_rest'
const POST_CHECKIN = 'post_checkin'
const UPDATE_CHECKIN_RE = 'update_checkin_re'
const POST_FACE_DETECT_OSS = 'post_face_detect_oss'
const UPDATE_FACE_DETECT_OSS = 'update_face_detect_oss'

export const types = {
    SHOW_PASSWORD_RESET_MODAL,
    GET_DEPT_1,
    GET_DEPT_2,
    UPDATE_DEPT_1,
    UPDATE_DEPT_2,
    DEPT_1_ERROR,
    DEPT_2_ERROR,
    POST_RESET_PASSWORD,
    UPDATE_RESET_PASSWORD,
    GET_EDUCATION,
    UPDATE_EDUCATION,
    GET_INVOICE,
    UPDATE_INVOICE,
    GET_RECEIPT,
    UPDATE_RECEIPT,
    GET_REGISTER,
    UPDATE_REGISTER,
    UPDATE_CHECKIN,
    GET_REGISTER_CARDS,
    UPDATE_REGISTER_CARDS,
    POST_REGISTER_CARDS_REST,
    UPDATE_REGISTER_CARDS_REST,
    POST_CHECKIN,
    UPDATE_CHECKIN_RE,
    POST_FACE_DETECT_OSS,
    UPDATE_FACE_DETECT_OSS
}

//Action creators
const setPasswordResetModal = passwordResetModalVisible => ({
    type: SHOW_PASSWORD_RESET_MODAL,
    payload: {
        passwordResetModalVisible
    }
});

const getDept1 = payload => ({
    type: GET_DEPT_1,
    payload
})

const updateDept1 = data => ({
    type: UPDATE_DEPT_1,
    data
})

const dept1Error = data => ({
    type: DEPT_1_ERROR,
    data
})

const dept2Error = data => ({
    type: DEPT_2_ERROR,
    data
})

const getDept2 = payload => ({
    type: GET_DEPT_2,
    payload
})

const updateDept2 = data => ({
    type: UPDATE_DEPT_2,
    data
})

const updateResetPassword = data => ({
    type: UPDATE_RESET_PASSWORD,
    data
})

const postResetPassword = payload => ({
    type: POST_RESET_PASSWORD,
    payload
})

const getEducation = payload => ({
    type: GET_EDUCATION,
    payload
})

const updateEducation = data => ({
    type: UPDATE_EDUCATION,
    data
})

const getInvoice = payload => ({
    type: GET_INVOICE,
    payload
})

const updateInvoice = data => ({
    type: UPDATE_INVOICE,
    data
})

const getReceipt = payload => ({
    type: GET_RECEIPT,
    payload
})

const updateReceipt = data => ({
    type: UPDATE_RECEIPT,
    data
})

const getRegister = payload => ({
    type: GET_REGISTER,
    payload
})

const updateRegister = data => ({
    type: UPDATE_REGISTER,
    data
})

const updateCheckin = data => ({
    type: UPDATE_CHECKIN,
    data
})

const getRegisterCards = payload => ({
    type: GET_REGISTER_CARDS,
    payload
})

const updateRegisterCards = data => ({
    type: UPDATE_REGISTER_CARDS,
    data
})

const updateRegisterCardsRest = data => ({
    type: UPDATE_REGISTER_CARDS_REST,
    data
})

const postRegisterCardsRest = payload => ({
    type: POST_REGISTER_CARDS_REST,
    payload
})

const postCheckin = payload => ({
    type: POST_CHECKIN,
    payload
})

const updateCheckinRe = data => ({
    type: UPDATE_CHECKIN_RE,
    data
})

const updateFaceDetectOSS = data => ({
    type: UPDATE_FACE_DETECT_OSS,
    data
})

const postFaceDetectOSS = payload => ({
    type: POST_FACE_DETECT_OSS,
    payload
})

export const actions = {
    setPasswordResetModal,
    getDept1,
    getDept2,
    updateDept1,
    updateDept2,
    dept1Error,
    dept2Error,
    updateResetPassword,
    postResetPassword,
    getEducation,
    updateEducation,
    getInvoice,
    updateInvoice,
    getReceipt,
    updateReceipt,
    getRegister,
    updateRegister,
    updateCheckin,
    getRegisterCards,
    updateRegisterCards,
    postRegisterCardsRest,
    updateRegisterCardsRest,
    postCheckin,
    updateCheckinRe,
    postFaceDetectOSS,
    updateFaceDetectOSS
}

const initialState = {
    passwordResetModalVisible: false,
    email: 'email@email.com',
    dept1List: [],
    dept2List: [],
    resetMessage: null,
    resetStatus: null,
    educationList: [],
    invoiceList: [],
    receiptList: [],
    registerCards: [],
    register: '',
    checkin: null,
    postCheckin: null,
    registerCardsRest: null,
    faceDetectOSS: null
}

//Reducers
const reducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case SHOW_PASSWORD_RESET_MODAL:
            return {
                ...state,
                ...action.payload
            }
        case UPDATE_DEPT_1:
            if (action.data.sessionExpire === 1) {
                break;
            }
            return {
                ...state,
                dept1List: action.data
            }
        case UPDATE_RESET_PASSWORD: {
            return {
                ...state,
                resetMessage: action.data.msg,
                resetStatus: action.data.status
            }
        }
        case UPDATE_DEPT_2:
            return {
                ...state,
                dept2List: action.data
            }
        case UPDATE_EDUCATION:
            return {
                ...state,
                educationList: action.data
            }
        case UPDATE_INVOICE:
            return {
                ...state,
                invoiceList: action.data
            }
        case UPDATE_RECEIPT:
            return {
                ...state,
                receiptList: action.data
            }
        case UPDATE_REGISTER:
            return {
                ...state,
                register: action.data
            }
        case UPDATE_CHECKIN:
            return {
                ...state,
                checkin: action.data
            }
        case UPDATE_REGISTER_CARDS:
            return {
                ...state,
                registerCards: action.data
            }
        case UPDATE_REGISTER_CARDS_REST:
            return {
                ...state,
                registerCardsRest: action.data.status
            }
        case UPDATE_CHECKIN_RE:
            return {
                ...state,
                postCheckin: action.data
            }
        case UPDATE_FACE_DETECT_OSS:
            return {
                ...state,
                faceDetectOSS: action.data
            }
        default:
            return state;
    }


}

export default reducer
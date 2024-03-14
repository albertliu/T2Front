import React, { Component } from 'react'
import { Form, Button, Radio, message, Checkbox, Spin, Alert, Affix, Row, Col, Image, Space, Modal } from 'antd'
import moment from 'moment'
import './ExamForm.css'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { withRouter } from 'react-router-dom'
import axios from 'axios'

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const font = '1.3em'

class ExamForm extends Component {
    formRef = React.createRef()
    currQID = 0
    currRe = 0

    state = { 
        time: 0, 
        loading: false, 
        buttonDisabled: false, 
        showMsg: false, 
        currQID: 0, 
        answer: false, 
        myAnswer: null,
        numPages: null,
        pageNumber: 0,
        currQuestion: null,
        submitBtnDisable: true,
        submitConfirmVisible: false,
        readSec: 3
    }

    onValuesChange = (changedValue, values) => {
        if(this.props.exam.exam[0].pkind < 2){  // 考试或错题集
            if (this.props.exam.exam && this.props.exam.exam[0] && this.props.exam.exam[0].status !== 2) {// && this.props.exam.exam[0].pkind !== 2
                if (this.props.exam.exam[0].pkind === 1){
                    message.destroy();
                    this.setState({showMsg: true})
                }
                let myAnswer = ""
                for (var key in changedValue) {
                    if (Array.isArray(changedValue[key])) {
                        var aggre = ''
                        for (var i = 0; i < changedValue[key].length; i++) {
                            aggre += changedValue[key][i]
                        }
                        myAnswer = this.answerSort(aggre)
                        aggre = myAnswer
                        this.props.actions.postSingleQuestion({ ID: key, answer: aggre, pkind: this.props.exam.exam[0].pkind})
                    } else {
                        this.props.actions.postSingleQuestion({ ID: key, answer: changedValue[key], pkind: this.props.exam.exam[0].pkind })
                        myAnswer = changedValue[key]
                    }
                }
                this.setState({answer: true, myAnswer: myAnswer})
            }
        }else{
            // 总题库
            let myAnswer = ""
            for (var key in changedValue) {
                if (Array.isArray(changedValue[key])) {
                    var aggre = ''
                    for (var i = 0; i < changedValue[key].length; i++) {
                        aggre += changedValue[key][i]
                    }
                    myAnswer = this.answerSort(aggre)
                } else {
                    myAnswer = changedValue[key]
                }
            }
            this.setState({answer: true, myAnswer: myAnswer})
        }
    }

    toInitialValues = questions => {
        if (questions) {
            const res = {}
            for (var i = 0; i < questions.length; i++) {
                const question = questions[i]
                if (question.myAnswer && question.myAnswer !== '') {
                    if (question.kindID !== 2) {
                        res[question.ID] = question.myAnswer
                    } else {
                        res[question.ID] = Array.from(question.myAnswer)
                    }
                } else {
                    res[question.ID] = null
                }

            }
            return res
        }
    }

    onFinish = values => {
        if (this.props.exam.exam[0].status === 2) {
            this.props.actions.updateExamQuestion(null)
            this.props.actions.getExamQuestion({ paperID: this.props.exam.exam[0].paperID, mark: 1, pkind: 0, examID:this.props.exam.exam[0].examID })
        } else {
            this.props.actions.postExam({ paperID: this.props.exam.exam[0].paperID })
            this.setState({ loading: true })
        }
        this.setState({ submitConfirmVisible: false, submitBtnDisable: true, readSec: 3 });
    }
    
    onClickCancel = () => {
        this.setState({ submitConfirmVisible: false, submitBtnDisable: true, readSec: 3 });
    }

    onSubmit = () => {
        this.setState({ submitConfirmVisible: true })
        const t1 = setInterval(() => {
            this.setState({ readSec: this.state.readSec - 1 })
        },1000)
        setTimeout(() => {
            this.setState({ submitBtnDisable: false })
            clearInterval(t1)
        },3000)
    }

    componentDidMount() {
        if(this.props.exam.exam[0].pkind === 0){
            this.timer = setInterval(() => {

                if (this.state.time > 0 && this.props.exam.exam && this.props.exam.exam[0].status !== 2) {
                    const { time } = this.state
                    this.props.actions.postTime({ paperID: this.props.exam.exam[0].paperID, secondRest: this.state.time })
                }
            }, 10000)    //exam submission Interval

            this.timer2 = setInterval(() => {
                this.setState({ time: this.state.time - 1 })
                if (this.state.time === 1 && this.props.exam.exam[0].kind > 0) {
                    this.onFinish({})
                }
            }, 1000)
        }
    }

    previousPage = () => {
        const { pageNumber } = this.state
        let p = 0
        if (pageNumber > 0) {
          this.setState({ pageNumber: pageNumber - 1 }, () => {
            this.setState({answer: false, myAnswer: null, currQuestion: this.props.exam.examQuestion[pageNumber - 1]})
          })
          p = pageNumber - 1
        }
        this.props.actions.postTotalExamNum({ num: p, username: this.props.exam.exam[0].username, examID: this.props.exam.exam[0].examID })
    }
    
    nextPage = () => {
        const { pageNumber, numPages } = this.state
        let p = pageNumber
        if (pageNumber < numPages - 1) {
            this.setState({ pageNumber: pageNumber + 1 }, () => {
            this.setState({answer: false, myAnswer: null, currQuestion: this.props.exam.examQuestion[pageNumber + 1]})
            })
            p = pageNumber + 1
        }
        this.props.actions.postTotalExamNum({ num: p, username: this.props.exam.exam[0].username, examID: this.props.exam.exam[0].examID })
    }
    
    leave = () => {
        this.props.actions.updateLeave(true)
        this.props.history.push('/homepage')
    }
    
    answerSort = (str) => {
        const arr = str.split(''); //将字符串转换成数组
        arr.sort(); //对数组进行排序
        return arr.join(''); //将数组转换回字符串
    }

    componentWillUnmount() {
        this.props.actions.updateExam(null)
        this.props.actions.updateExamQuestion(null)
        clearInterval(this.timer)
        clearInterval(this.timer2)
    }

    componentDidUpdate = prevProps => {
        if (this.props.exam.postTimeRes) {
            if (this.props.exam.postTimeRes.status === 1) {
                this.onFinish({})
                this.props.actions.updatePostTime(null)
            } else if (this.props.exam.postTimeRes.secondRest !== 0) {
                this.setState({ time: this.props.exam.postTimeRes.secondRest })
                this.props.actions.updatePostTime(null)
            }
        }
        if (!prevProps.exam.exam && this.props.exam.exam) {
            this.setState({ time: this.props.exam.exam[0].secondRest })
        }
        if (this.props.exam.postExamRes && this.props.exam.exam[0].pkind == 0) {
            // if (this.props.exam.exam[0].kind === 0) {    //模拟考试交卷后显示答案
                this.props.actions.getExam({ paperID: this.props.exam.exam[0].paperID, pkind: this.props.exam.exam[0].pkind, examID: '' })
                this.props.actions.getExamQuestion({ paperID: this.props.exam.exam[0].paperID, pkind: this.props.exam.exam[0].pkind, examID:'' })
            // }
            const msg = this.props.exam.postExamRes.msg || '提交成功';
            message.success(msg);
            setTimeout(() => { this.setState({ loading: false }) }, 5000);
            this.props.actions.updatePostExam(null)
            this.props.actions.updateLeave(true)
            // if (this.props.exam.exam[0].kind === 1) {
            //     this.props.history.push('/homepage')
            // }

        }
        if (this.props.exam.exam && this.props.exam.examQuestion && prevProps.exam.examQuestion === null) {
            this.props.actions.getExam({ paperID: this.props.exam.exam[0].paperID, pkind: this.props.exam.exam[0].pkind, examID: this.props.exam.exam[0].examID, username: this.props.exam.exam[0].username})
        }
        if (prevProps.exam.exam && this.props.exam.exam && prevProps.exam.exam !== this.props.exam.exam) {
            this.setState({ time: this.props.exam.exam[0].secondRest })
        }
        // if (this.props.exam.exam[0].pkind === 1 && this.props.exam.postSingleQuestionRes && this.state.showMsg) {//
        //     if (this.props.exam.postSingleQuestionRes.status === 1){
        //         this.currRe = 1
        //         if (this.props.exam.exam[0].pkind === 1){
        //             // 错题集如果答对了，弹出对话框
        //             message.success("回答正确。");
        //         }
        //     }else{
        //         // message.error("答错了，正确答案为：" + this.props.exam.postSingleQuestionRes.answer);
        //         this.currRe = 0
        //     }
        //     this.props.actions.getExamQuestion({ paperID: this.props.exam.exam[0].paperID, pkind: this.props.exam.exam[0].pkind, examID: this.props.exam.exam[0].examID })
        //     this.props.actions.updatePostSingleQuestion(null);
        //     this.setState({showMsg: false})
        // }
        if(this.props.exam.exam[0].pkind >0 && prevProps.exam.examQuestion === null && this.props.exam.examQuestion){
            this.setState({currQuestion: this.props.exam.examQuestion[this.props.exam.exam[0].lastNum || 0], numPages: this.props.exam.examQuestion.length, pageNumber: this.props.exam.exam[0].lastNum})
        }
    }

    render() {
        if (!this.props.exam.examQuestion || !this.props.exam.exam) {
            return (<div style={{ height: '100vh', verticalAlign: 'middle', lineHeight: '100vh' }}><Spin spinning></Spin></div>)
        }
        return (<Form
            name="exam_form"
            className="login-form"
            initialValues={this.props.exam.examQuestion ? this.toInitialValues(this.props.exam.examQuestion) : null}
            onFinish={this.onFinish}
            {...layout}
            layout={"vertical"}
            ref={this.formRef}
            onValuesChange={this.onValuesChange}
        >
            <Affix offsetTop={10}>
                <div className='alert-container'>
                    <Form.Item>
            {this.props.exam.exam[0].pkind === 0 ?
                        <Row gutter={4} style={{ textAlign: 'center' }}>
                            <Modal title={[<Button type='primary' onClick={this.onClickCancel}>取消</Button>, 
                                <Button onClick={this.onFinish} htmlType="submit" disabled={this.state.submitBtnDisable}>{ (this.state.readSec === 0 ? '' : this.state.readSec) + (this.props.exam.exam[0].status !== 2 ?'交卷' : '重新开始')}</Button>
                                , <span style={{color:'red', paddingLeft:'10px'}}>{this.props.exam.exam[0].status !== 2 ? '确定要交卷吗？' : '确定要重新开始吗？'}</span> 
                                ]} visible={this.state.submitConfirmVisible} footer={[]}>
                            </Modal>
                            <Col span={10}><Alert message={this.props.exam.exam[0].status === 2 ? '得分: ' + this.props.exam.exam[0].score : '' + moment.utc(this.state.time * 1000).format("H:mm:ss")} type='info' /></Col>
                            {this.props.exam.exam[0].kind===1 && this.props.exam.exam[0].status===2 ? "" :<Col span={7}><Button style={{ height: '100%' }} type="primary" onClick={this.onSubmit} loading={this.state.loading}>{this.props.exam.exam[0].status !== 2 ? '交卷' : '重新开始'}</Button></Col>}
                            {this.props.exam.leave ? <Col span={7}><Button style={{ height: '100%' }} onClick={() => this.leave()}>离开</Button></Col> : null}
                        </Row>
            :<Col span={7}><Button style={{ height: '100%' }} onClick={() => this.leave()}>离开</Button></Col> }
                    </Form.Item>
                </div>
            </Affix>
            <p> </p>
            <div>

                {this.props.exam.exam[0].pkind === 0 ?
                    this.props.exam.examQuestion.map((question, index) => (
                        <Form.Item style={{ textAlign: 'left' }}
                            name={question.ID}
                            key={question.ID}
                            label={
                                <div style={{ fontSize: font }}>
                                    <span dangerouslySetInnerHTML={{__html: (index + 1) + '. ' + '(' + question.kindName + '题 ' + (this.props.exam.exam[0].pkind === 0 ? question.scorePer + '分' : "") + ')' + question.questionName}} /><span>{question.image !== '' ? <Image src={axios.defaults.baseURL + question.image} /> : null}</span>
                                    &nbsp;<span style={{color:'lightgray'}}>{this.props.exam.exam[0].status === 2 ? '(' + (question.myAnswer ? question.myAnswer + ':' : '') + question.score + '分)' : null}</span>
                                    &nbsp;<span>{this.props.exam.exam[0].status === 2 ? ((question.score > 0) ? <CheckOutlined style={{ color: 'green' }} /> : <CloseOutlined style={{ color: 'red' }} />) : null}</span>
                                    &nbsp;<span>{this.props.exam.exam[0].status === 2 ? '正确答案: ' + question.answer : null}</span>
                                </div>
                            }>
                            {
                                question.kindID !== 2 ?
                                    <Radio.Group value='' disabled={this.props.exam.exam[0].status === 2 ? true : false}>
                                        <Row>{question.A !== '' || question.imageA !== '' ? <Radio key={question.ID + 'A'} value={this.props.exam.exam[0].status === 2 && !question.myAnswer ? '' : 'A'}><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'A. ' + question.A}} /></Radio> : null}{question.imageA !== '' ? <Image src={axios.defaults.baseURL + question.imageA} /> : null}</Row>
                                        <Row>{question.B !== '' || question.imageB !== '' ? <Radio key={question.ID + 'B'} value={this.props.exam.exam[0].status === 2 && !question.myAnswer ? '' : 'B'}><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'B. ' + question.B}} /></Radio> : null}{question.imageB !== '' ? <Image src={axios.defaults.baseURL + question.imageB} /> : null}</Row>
                                        <Row>{question.C !== '' || question.imageC !== '' ? <Radio key={question.ID + 'C'} value={this.props.exam.exam[0].status === 2 && !question.myAnswer ? '' : 'C'}><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'C. ' + question.C}} /></Radio> : null}{question.imageC !== '' ? <Image src={axios.defaults.baseURL + question.imageC} /> : null}</Row>
                                        <Row>{question.D !== '' || question.imageD !== '' ? <Radio key={question.ID + 'D'} value={this.props.exam.exam[0].status === 2 && !question.myAnswer ? '' : 'D'}><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'D. ' + question.D}} /></Radio> : null}{question.imageD !== '' ? <Image src={axios.defaults.baseURL + question.imageD} /> : null}</Row>
                                        <Row>{question.E !== '' || question.imageE !== '' ? <Radio key={question.ID + 'E'} value={this.props.exam.exam[0].status === 2 && !question.myAnswer ? '' : 'E'}><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'E. ' + question.E}} /></Radio> : null}{question.imageE !== '' ? <Image src={axios.defaults.baseURL + question.imageE} /> : null}</Row>
                                        <Row>{question.F !== '' || question.imageF !== '' ? <Radio key={question.ID + 'F'} value={this.props.exam.exam[0].status === 2 && !question.myAnswer ? '' : 'F'}><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'F. ' + question.F}} /></Radio> : null}{question.imageF !== '' ? <Image src={axios.defaults.baseURL + question.imageF} /> : null}</Row>
                                    </Radio.Group> :
                                    <Checkbox.Group value='' disabled={this.props.exam.exam[0].status === 2 ? true : false}>
                                        <Row>{question.A !== '' || question.imageA !== '' ? <Checkbox key={question.ID + 'A'} value={this.props.exam.exam[0].status === 2 && !question.myAnswer ? '' : 'A'}><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'A. ' + question.A}} /></Checkbox> : null}{question.imageA !== '' ? <Image src={axios.defaults.baseURL + question.imageA} /> : null}</Row>
                                        <Row>{question.B !== '' || question.imageB !== '' ? <Checkbox key={question.ID + 'B'} value={this.props.exam.exam[0].status === 2 && !question.myAnswer ? '' : 'B'}><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'B. ' + question.B}} /></Checkbox> : null}{question.imageB !== '' ? <Image src={axios.defaults.baseURL + question.imageB} /> : null}</Row>
                                        <Row>{question.C !== '' || question.imageC !== '' ? <Checkbox key={question.ID + 'C'} value={this.props.exam.exam[0].status === 2 && !question.myAnswer ? '' : 'C'}><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'C. ' + question.C}} /></Checkbox> : null}{question.imageC !== '' ? <Image src={axios.defaults.baseURL + question.imageC} /> : null}</Row>
                                        <Row>{question.D !== '' || question.imageD !== '' ? <Checkbox key={question.ID + 'D'} value={this.props.exam.exam[0].status === 2 && !question.myAnswer ? '' : 'D'}><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'D. ' + question.D}} /></Checkbox> : null}{question.imageD !== '' ? <Image src={axios.defaults.baseURL + question.imageD} /> : null}</Row>
                                        <Row>{question.E !== '' || question.imageE !== '' ? <Checkbox key={question.ID + 'E'} value={this.props.exam.exam[0].status === 2 && !question.myAnswer ? '' : 'E'}><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'E. ' + question.E}} /></Checkbox> : null}{question.imageE !== '' ? <Image src={axios.defaults.baseURL + question.imageE} /> : null}</Row>
                                        <Row>{question.F !== '' || question.imageF !== '' ? <Checkbox key={question.ID + 'F'} value={this.props.exam.exam[0].status === 2 && !question.myAnswer ? '' : 'F'}><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'F. ' + question.F}} /></Checkbox> : null}{question.imageF !== '' ? <Image src={axios.defaults.baseURL + question.imageF} /> : null}</Row>
                                    </Checkbox.Group>
                            }
                        </Form.Item>
                    ))
                :
                        this.state.currQuestion ?
                        <div>
                        <Row style={{ textAlign: 'center', margin: '10px' }}>
                            <Space>
                                <Button onClick={() => this.previousPage()}><span style={{ fontSize: font }}>上一页</span></Button>
                                <Button onClick={() => this.nextPage()}><span style={{ fontSize: font }}>下一页</span></Button>
                            </Space>
                        </Row>
                        <Form.Item style={{ fontSize: '16px', textAlign: 'left' }}
                            name={this.state.currQuestion.ID}
                            key={this.state.currQuestion.ID}
                            label={
                                <div style={{ fontSize: font }}>
                                    <span>{(this.state.pageNumber + 1) + '. ' + '(' + this.state.currQuestion.kindName + '题 ' + ')' + this.state.currQuestion.questionName}{this.state.currQuestion.image !== '' ? <Image src={axios.defaults.baseURL + this.state.currQuestion.image} /> : null}</span>
                                    &nbsp;<span>{this.state.myAnswer ? (this.state.myAnswer === this.state.currQuestion.answer ? <CheckOutlined style={{ color: 'green' }} /> : <CloseOutlined style={{ color: 'red' }} />) : null}</span>
                                    &nbsp;<span>{this.state.myAnswer ? '正确答案: ' + this.state.currQuestion.answer : null}</span>
                                </div>
                            }>
                            {
                                this.state.currQuestion.kindID !== 2 ?
                                <Radio.Group value=''>
                                    <Row>{this.state.currQuestion.A !== '' || this.state.currQuestion.imageA !== '' ? <Radio key={this.state.currQuestion.ID + 'A'} value='A'><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'A. ' + this.state.currQuestion.A}} /></Radio> : null}{this.state.currQuestion.imageA !== '' ? <Image src={axios.defaults.baseURL + this.state.currQuestion.imageA} /> : null}</Row>
                                    <Row>{this.state.currQuestion.B !== '' || this.state.currQuestion.imageB !== '' ? <Radio key={this.state.currQuestion.ID + 'B'} value='B'><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'B. ' + this.state.currQuestion.B}} /></Radio> : null}{this.state.currQuestion.imageB !== '' ? <Image src={axios.defaults.baseURL + this.state.currQuestion.imageB} /> : null}</Row>
                                    <Row>{this.state.currQuestion.C !== '' || this.state.currQuestion.imageC !== '' ? <Radio key={this.state.currQuestion.ID + 'C'} value='C'><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'C. ' + this.state.currQuestion.C}} /></Radio> : null}{this.state.currQuestion.imageC !== '' ? <Image src={axios.defaults.baseURL + this.state.currQuestion.imageC} /> : null}</Row>
                                    <Row>{this.state.currQuestion.D !== '' || this.state.currQuestion.imageD !== '' ? <Radio key={this.state.currQuestion.ID + 'D'} value='D'><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'D. ' + this.state.currQuestion.D}} /></Radio> : null}{this.state.currQuestion.imageD !== '' ? <Image src={axios.defaults.baseURL + this.state.currQuestion.imageD} /> : null}</Row>
                                    <Row>{this.state.currQuestion.E !== '' || this.state.currQuestion.imageE !== '' ? <Radio key={this.state.currQuestion.ID + 'E'} value='E'><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'E. ' + this.state.currQuestion.E}} /></Radio> : null}{this.state.currQuestion.imageE !== '' ? <Image src={axios.defaults.baseURL + this.state.currQuestion.imageE} /> : null}</Row>
                                    <Row>{this.state.currQuestion.F !== '' || this.state.currQuestion.imageF !== '' ? <Radio key={this.state.currQuestion.ID + 'F'} value='F'><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'F. ' + this.state.currQuestion.F}} /></Radio> : null}{this.state.currQuestion.imageF !== '' ? <Image src={axios.defaults.baseURL + this.state.currQuestion.imageF} /> : null}</Row>
                                </Radio.Group> :
                                <Checkbox.Group value=''>
                                    <Row>{this.state.currQuestion.A !== '' || this.state.currQuestion.imageA !== '' ? <Checkbox key={this.state.currQuestion.ID + 'A'} value='A'><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'A. ' + this.state.currQuestion.A}} /></Checkbox> : null}{this.state.currQuestion.imageA !== '' ? <Image src={axios.defaults.baseURL + this.state.currQuestion.imageA} /> : null}</Row>
                                    <Row>{this.state.currQuestion.B !== '' || this.state.currQuestion.imageB !== '' ? <Checkbox key={this.state.currQuestion.ID + 'B'} value='B'><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'B. ' + this.state.currQuestion.B}} /></Checkbox> : null}{this.state.currQuestion.imageB !== '' ? <Image src={axios.defaults.baseURL + this.state.currQuestion.imageB} /> : null}</Row>
                                    <Row>{this.state.currQuestion.C !== '' || this.state.currQuestion.imageC !== '' ? <Checkbox key={this.state.currQuestion.ID + 'C'} value='C'><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'C. ' + this.state.currQuestion.C}} /></Checkbox> : null}{this.state.currQuestion.imageC !== '' ? <Image src={axios.defaults.baseURL + this.state.currQuestion.imageC} /> : null}</Row>
                                    <Row>{this.state.currQuestion.D !== '' || this.state.currQuestion.imageD !== '' ? <Checkbox key={this.state.currQuestion.ID + 'D'} value='D'><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'D. ' + this.state.currQuestion.D}} /></Checkbox> : null}{this.state.currQuestion.imageD !== '' ? <Image src={axios.defaults.baseURL + this.state.currQuestion.imageD} /> : null}</Row>
                                    <Row>{this.state.currQuestion.E !== '' || this.state.currQuestion.imageE !== '' ? <Checkbox key={this.state.currQuestion.ID + 'E'} value='E'><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'E. ' + this.state.currQuestion.E}} /></Checkbox> : null}{this.state.currQuestion.imageE !== '' ? <Image src={axios.defaults.baseURL + this.state.currQuestion.imageE} /> : null}</Row>
                                    <Row>{this.state.currQuestion.F !== '' || this.state.currQuestion.imageF !== '' ? <Checkbox key={this.state.currQuestion.ID + 'F'} value='F'><span style={{ fontSize: font }} dangerouslySetInnerHTML={{__html: 'F. ' + this.state.currQuestion.F}} />  </Checkbox> : null}{this.state.currQuestion.imageF !== '' ? <Image src={axios.defaults.baseURL + this.state.currQuestion.imageF} /> : null}</Row>
                                </Checkbox.Group>
                            }
                        </Form.Item>
                        </div>
                        : null
                        
              }


            </div>
        </Form>
        )
    }
}
export default withRouter(ExamForm)
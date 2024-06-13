import React, { Component } from 'react'
import { Card, Row, Col, Progress, message, Button, Modal } from 'antd'
import { connect } from "react-redux";
import { withRouter } from 'react-router-dom'
import { actions as LessonActions } from '../../modules/courses'
import 'antd/dist/antd.min.css'
import SignatureCanvas from 'react-signature-canvas'
import { bindActionCreators } from "redux";
import axios from 'axios'
import { Document, Page, pdfjs } from 'react-pdf';

// pdfjs.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.min.js';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


class LessonCard extends Component {

    constructor(props) {
        super(props)
        // this.modalRef = React.createRef()
        this.divRef = React.createRef()
        this.state = {
            signatureAgreementChecked: false,
            signatureModalVisible: false,
            signatureBtnDisable: true,
            img: null,
            busy: false,
            loading: true,
            numPages: null,
            pageNumber: 1,
            width: 0,
            displaySignature: false,
            readSec: 5,
            showItem: 0
        }
        // window.addEventListener("resize", this.resize)
        // window.addEventListener("resize", this.update);
    }

    onRenderSuccess = () => {
        this.setState({ width: this.divRef.current.offsetWidth });
    };
    
    // update = () => {
    //     this.setState({
    //       width: this.divRef.current.offsetWidth
    //     })
    //   }

    onClick = (lesson) => {
        if (this.props.lessons && this.props.lessons[0].missingItems) {
            message.info({
                content: '请填写' + this.props.lessons[0].missingItems,
                style: {
                    marginTop: '50%',
                    color: 'red',
                    textAlign: 'left'
                },
                duration: 10,
            })
            this.props.history.push("/userinfo")
        }
        else {
            this.props.actions.updateCurrentLesson(lesson)
            this.props.history.push("/classpage")
        }

    }

    onClickExam = (paperID, pkind, examID, username) => {
        this.props.examActions.updateLeave(true)
        this.props.examActions.getExam({ paperID, pkind, examID, username })
        this.props.examActions.updateBusyGetExamQuestion(1);
    }

    componentDidUpdate = prevProps => {
        if (this.props.exam.exam && prevProps.exam.exam !== this.props.exam.exam) {
            if (this.props.exam.exam[0].missingItems) {
                message.info({
                    content: '请填写' + this.props.exam.exam[0].missingItems,
                    style: {
                        marginTop: '50%',
                        color: 'red',
                        textAlign: 'left'
                    },
                    duration: 10,
                })
                this.props.history.push("/userinfo")
            } else if (this.props.exam.exam[0].startExamMsg !== "") {
                message.info(this.props.exam.exam[0].startExamMsg)
            } else if (this.props.exam.busyGetExamQuestion === 1) {
                this.props.history.push("/exampage")
                this.props.examActions.getExamQuestion({ paperID: this.props.exam.exam[0].paperID, pkind: this.props.exam.exam[0].pkind, examID:this.props.exam.exam[0].examID })
                this.props.examActions.updateBusyGetExamQuestion(0);
            }
        }
        if (this.state.busy && this.props.courseState.postSignature && !prevProps.courseState.postSignature) {
            this.setState({ signatureModalVisible: false })
            if (this.props.courseState.postSignature.status === 0) {
                message.success('签名提交成功')
                this.props.actions.getCourseList({ username: this.props.application.username })
            } else {
                message.error('签名提交失败')
            }
            this.setState({ busy: false, displaySignature: false })
            this.sigCanvas.clear()
            this.props.actions.updateSignature(null)
            this.setState({ signatureModalVisible: false })
        }
    }

    componentDidMount() {
        // this.setState({ pageNumber: this.props.course.currentPDF.lastPage })
        // location.hash = '#82129';
        if (this.props.courseState.currentLesson) {
            const el = document.getElementById(this.props.courseState.currentLesson.refID);
            if(el){
                el.scrollIntoView();
                this.setState({ showItem: this.props.courseState.currentLesson.refID })
            }
            this.props.actions.updateCurrentLesson(null);
        }

        // document.querySelector('xx1').scrollIntoView();
    }

    gridStyle = {
        width: '100%',
        textAlign: 'left',
        backgroundColor: '#FCFCFC'
    };

    onChangeCheckBox = (e) => {
        this.setState({ signatureAgreementChecked: e.target.checked })
    }

    onClickCommentPage = () => {
        this.props.history.push(`/classcommentpage?classID=${this.props.course.certID}`);
    };

    onClickNext = () => {
        this.setState({displaySignature: true});
    }

    onSubmitSignature = () => {
        if (this.sigCanvas.isEmpty()) {
            message.error('请正确签名。')
            return;
        }
        const imgData = this.sigCanvas.toDataURL();

        this.props.actions.postSignature({
            upID: "student_letter_signature", //固定内容
            username: this.props.course.ID, //P7. getStudentCourseList.ID
            currUser: this.props.application.username, //当前用户身份证
            imgData
        })
        this.setState({ busy: true })
    }

    onClickSignature = () => {
        // if (!this.state.signatureAgreementChecked) {
        //     message.warn('请阅读并勾选同意承诺书')
        //     return;
        // }
        this.setState({ width: this.divRef.current.offsetWidth })
        this.setState({ signatureModalVisible: true })
        //此处函数叫匿名函数
        const t1 = setInterval(() => {
            this.setState({ readSec: this.state.readSec - 1 })
        },1000)
        
        setTimeout(() => {
            this.setState({ signatureBtnDisable: false })
            clearInterval(t1)
        },5000)
    }

    previousPage = () => {
        const { pageNumber } = this.state
        if (pageNumber > 1) {
          this.setState({ pageNumber: pageNumber - 1 })
        }
    }
    
    nextPage = () => {
        const { pageNumber, numPages } = this.state
        if (pageNumber < numPages) {
          this.setState({ pageNumber: pageNumber + 1 })
        }
    }
    
    onClickCancel = () => {
        if(this.sigCanvas) {
            this.sigCanvas.clear(); 
        }
        
        this.setState({ signatureModalVisible: false, displaySignature: false, readSec: 5, signatureBtnDisable: true });
    }
    
    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages, loading: false })
    }
    
    onClickShowItem = (courseID) => {
        this.setState({ showItem: (this.state.showItem === 0 ? courseID : 0) })
    }

    onLoadError = () => {
        message.error('文档载入失败')
        this.setState({ loading: false })
    }
    
    render() {
        const { course } = this.props
        const { lessons } = this.props
        const { pageNumber, numPages } = this.state
        return (
            <div id={course.ID}>
            <Row key={course.lessonID} gutter={[16, 32]}>
                <div className="document" style={{ width: "100%" }} ref={this.divRef}>
                <Modal title={[<Button onClick={this.onClickCancel}>取消</Button>, 
                    <Button type='primary' onClick={this.state.displaySignature ? this.onSubmitSignature: this.onClickNext} disabled={this.state.signatureBtnDisable}>{this.state.displaySignature ? '提交签名':'已阅读并同意'}</Button>
                    , <span style={{color:'red', paddingLeft:'10px'}}>{this.state.displaySignature || this.state.readSec === 0 ? null : this.state.readSec + '报名表及培训协议'}</span>, 
                    <span style={{color:'red', paddingLeft:'10px'}}>{this.state.displaySignature ? '请在下面空白处签名' : null}</span>]} visible={this.state.signatureModalVisible} footer={[]}>
                    {this.state.displaySignature ? <div style={{border:'2px solid blue'}}><SignatureCanvas penColor='black' minWidth='0.7'
                        canvasProps={{ width: 500, height: 200, className: 'sigCanvas', contentBg: '#ddd' }} ref={(ref) => { this.sigCanvas = ref }} /></div>:
                    <div>
                        <Button onClick={() => this.previousPage()}>上一页</Button><Button onClick={() => this.nextPage()}>下一页</Button>
                        <Document
                            file={axios.defaults.baseURL + this.props.course.file4}
                            onLoadSuccess={this.onDocumentLoadSuccess}
                            onLoadError={this.onLoadError}
                        ><Page pageNumber={pageNumber} width={this.state.width} onRenderSuccess={this.onRenderSuccess} />
                        </Document>
                    </div>}
                </Modal>
                </div>
                <Col span={24}>
                    <Card title={course.courseName} bordered={false} headStyle={{ color:'white',backgroundColor: '#1E90FF' }} style={{ textAlign: 'center',backgroundColor: '#1E90FF', border:'solid 1px #BFEEFF' }} extra={<div>{[course.type === 0 ? <span style={{ color: 'red' }}>{course.checkName}&nbsp;</span> : null]} <a>{course.statusName}</a></div>}>{
                        course.status < 2 ? <Card.Grid style={{ textAlign: 'left',width:'100%',backgroundColor: '#BFEEFF' }}>
                            {course.completion ? <Progress percent={course.completion} size="small" /> : null}<p>学习时长：{course.hours}课时</p>
                            <p>开始日期：{course.startDate}</p>
                            <p>结束日期：{course.endDate}</p>
                            <p>完成条件：{course.pass_condition}</p>
                            {!this.props.application.teacher ? <Button onClick={() => this.onClickCommentPage()}>课程答疑</Button> : null}
                        </Card.Grid> : null}
                        {course.signatureType === 1 && course.signature === "" && course.try === 0 ? <Card.Grid style={this.gridStyle}>
                            <Button type='primary' onClick={this.onClickSignature} >签名</Button></Card.Grid> : null}
                        {course.status < 2 && (course.signatureType === 0 || course.signature > "" || course.try === 1) ? <Card.Grid style={{ textAlign: 'left',width:'100%',backgroundColor: '#F3FFFF' }}>
                            <div style={{padding:'5px'}}>
                                <Button type='primary' onClick={() => this.onClickShowItem(course.ID)} >课程详细内容</Button>
                            </div>
                            <p> </p>
                            <ul style={{ textAlign: 'left', margin: 0, padding: 0, display:(this.state.showItem===course.ID ? "block" : "none")}}>
                                {lessons.filter(lesson => lesson.refID === course.ID).map((lesson, index) => (
                                    <li style={{ listStyleType: 'none', clear: 'both' }} key={lesson.ID}>
                                        <p style={{ float: 'left' }}>
                                            <a onClick={() => this.onClick(lesson)} id={'x' + lesson.ID}>{index + 1}. {lesson.lessonName}&nbsp;&nbsp;</a>
                                            <span style={{ color: 'lightgray' }}>{lesson.completion}%</span>
                                        </p>

                                    </li>
                                ))}
                            </ul>
                            <ul style={{ textAlign: 'left', margin: 0, padding: 0}}>
                                <li key={999} style={{ listStyleType: 'none', clear: 'both' }}>
                                    <div style={{padding:'5px'}}>
                                    <span>模拟考试</span>
                                    <span style={{ color: 'lightgray', paddingLeft:'1em' }}>{course.examTimes}次</span>
                                    </div>
                                    <ul style={{ textAlign: 'left', margin: 0, padding: 0 }}>
                                        {
                                            course.paperID !== null && course.paperID !== '' ? JSON.parse(course.paperID)
                                                .map(singlePaperID => (
                                                    <li key={singlePaperID.paperID} style={{ listStyleType: 'none', clear: 'both' }}>
                                                        <p style={{ float: 'left' }}>
                                                            <a style={{color:'orange'}} onClick={() => this.onClickExam(singlePaperID.paperID, singlePaperID.pkind, singlePaperID.examID, course.username)}>*&nbsp;&nbsp;{singlePaperID.item}&nbsp;&nbsp;&nbsp;</a><span style={{ color: 'lightgray' }}>
                                                                {singlePaperID.examScore}&nbsp;&nbsp;</span>
                                                        </p>
                                                    </li>
                                                ))
                                                : null}
                                    </ul>
                                </li>
                                {/* {course.paperID !== null && course.paperID !== '' ? <li key={999} style={{ listStyleType: 'none', clear: 'both' }}>
                                    <p style={{ float: 'left' }}>
                                        <a onClick={() => this.onClickExam(course)}>*&nbsp;&nbsp;{course.type === 0 ? '模拟考试' : '考试'}&nbsp;&nbsp;&nbsp;</a><span style={{ color: 'lightgray' }}>
                                            {course.examScore}分&nbsp;&nbsp;</span>
                                        <span style={{ color: 'lightgray' }}>{course.examTimes}次</span>
                                    </p>
                                </li> : null} */}
                            </ul>
                        </Card.Grid> : null}


                    </Card>
                </Col>
            </Row >
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    user: state.user,
    application: state.application
});
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(LessonActions, dispatch),
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(LessonCard)
);

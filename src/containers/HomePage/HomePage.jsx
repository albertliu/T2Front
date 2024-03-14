import React, { Component } from "react";
import LessonCard from "../../components/LessonCard/LessonCard";
import { connect } from "react-redux";
import { actions as CourseActions } from "../../modules/courses";
import { actions as ExamActions } from "../../modules/exam";
import { actions as UserActions } from "../../modules/user";
import { bindActionCreators } from "redux";
import { Button, Card, notification, message, Modal } from "antd";

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
        cardsVisable: true,
        checkinVisable: false
    }
  }

  componentDidMount() {
    this.props.actions.getCourseList({
      username: this.props.application.username,
    });
    this.props.actions.getLessonList({
      username: this.props.application.username,
    });
    this.props.examActions.getRealExamList({
      username: this.props.application.username,
    });
    // console.log("register:", this.props.user.register, qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).register)
    if(this.props.user.register){
        this.props.userActions.getRegisterCards({ username: this.props.application.username } )
    }
    if(this.props.user.checkin){
        // console.log("checkin data:", this.props.user.checkin);
        this.setState({ checkinVisable: true })
    }
  }

  componentDidUpdate = prevProps => {
    if (this.props.user.postCheckin && !prevProps.user.postCheckin) {
      message.info(this.props.user.postCheckin.msg);
      this.setState({ checkinVisable: false });
      this.props.userActions.updateCheckinRe(null)
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (
      nextProps.application.userInfo &&
      this.props.application.userInfo !== nextProps.application.userInfo &&
      nextProps.application.userInfo.newMessage > 0
    ) {
      notification.info({
        message: `你有${nextProps.application.userInfo.newMessage}条新信息`,
        placement: "topRight",
        duration: 2,
      });
    }
  };

  onClickExam = (paperID) => {
    this.props.examActions.updateLeave(false);
    this.props.examActions.getExam({ paperID: paperID });
    this.props.examActions.updateBusyGetExamQuestion(1);
  };

  onClickRule = () => {
    Modal.info({
      title: "考生须知",
      content: (
        <div>
          <p>1、仔细检查题目，交卷后将无法进入。</p>
          <p>2、迟到15分钟不得入场。</p>
        </div>
      ),
      onOk() {},
    });
  };

  onClickCancelCards = () => {
    this.setState({ cardsVisable: false });
  }
  onSubmitCards = () => {
    this.setState({ cardsVisable: false })
    this.props.userActions.postRegisterCardsRest({
        ID: this.props.user.registerCards[0].ID,
        teacherID: ''
    })
    // console.log('data',this.props.user.registerCards[0].ID)
    message.success('签到成功。')
  }

  onClickCancelCheckin = () => {
    this.setState({ checkinVisable: false });
  }

  onSubmitCheckin = async () => {
    let data = {
      username: this.props.application.username,
      courseID: this.props.user.checkin.courseID,
      placeID: this.props.user.checkin.placeID,
      kindID: this.props.user.checkin.kindID,
      date: this.props.user.checkin.date,
      lng: 0,
      lat: 0
    }
    try{
      const re = await this.getPosition();
      data.lng = re.lng;
      data.lat = re.lat;
    }catch(err){
      console.log("get position err:", err);
    }
    // console.log("data:", data);
    this.props.userActions.postCheckin(data);
  }

  getPosition = () => {
    return new Promise((resolve, reject) => {
      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
      
      function success(pos) {
        var crd = pos.coords;
      
        // console.log("Your current position is:");
        // console.log("Latitude : " + crd.latitude);
        // console.log("Longitude: " + crd.longitude);
        // console.log("More or less " + crd.accuracy + " meters.");
        resolve({lng:crd.longitude, lat:crd.latitude});
      }
      
      function error(err) {
        // console.warn("ERROR(" + err.code + "): " + err.message);
        reject(err);
      }
      navigator.geolocation.getCurrentPosition(success, error, options);
    })
  }

  render() {
    const { courses, lessons } = this.props.course;
    const { actions, examActions, exam, user } = this.props;
    if (courses.length === 0) {
      return (
        <div>
          <h3>还未选择课程</h3>
        </div>
      );
    }
    return (
      <div>
        <div>
          {this.props.exam.realExamList &&
          this.props.exam.realExamList.length > 0 ? (
            <Card title="我的考试">
              {this.props.exam.realExamList.map((exam) => (
                <Card.Grid
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "#BBFFFF",
                  }}
                >
                  <p>科目：{exam.certName}</p>
                  <p>日期：{exam.startDate}</p>
                  <p>地点：{exam.address}</p>
                  <p>
                    姓名：{exam.name} &nbsp;&nbsp;类型：{exam.kindName}
                  </p>
                  <Button type="primary" onClick={this.onClickRule}>
                    考生须知
                  </Button>
                  &nbsp;&nbsp;
                  {exam.kindID === 1 ? (
                    exam.status < 2 ? (
                      <Button
                        type="primary"
                        onClick={() => this.onClickExam(exam.paperID)}
                      >
                        开始考试
                      </Button>
                    ) : (
                      <span>已完成</span>
                    )
                  ) : null}
                </Card.Grid>
              ))}
            </Card>
          ) : null}
        </div>
        <div>
          <Modal open={this.props.user.registerCards.length>0 && this.state.cardsVisable} title={[<Button onClick={this.onClickCancelCards}>取消</Button>,
            <Button type='primary' onClick={this.onSubmitCards} disabled={this.props.user.registerCards.length===0 || this.props.user.registerCards[0].cardsRest<1}>{'确认签到'}</Button>]}
            footer={[]}>
                <div>姓名：<span style={{color:'red', fontSize:'1.5em'}}>{this.props.user.registerCards.length>0 ? this.props.user.registerCards[0].name : null}</span></div>
                <div>课程：{this.props.user.registerCards.length>0 ? this.props.user.registerCards[0].courseName : null}</div>
                <div>总次数：{this.props.user.registerCards.length>0 ? this.props.user.registerCards[0].cards : null}</div>
                <div>可用次数：{this.props.user.registerCards.length>0 ? this.props.user.registerCards[0].cardsRest : null}</div>
          </Modal>
          <Modal open={this.state.checkinVisable} title={[<Button onClick={this.onClickCancelCheckin}>取消</Button>,
            <Button type='primary' onClick={this.onSubmitCheckin}>{'确认签到'}</Button>]}
            footer={[]}>
                <div>课程：{this.props.user.checkin ? this.props.user.checkin.courseName : null}</div>
                <div>日期：{this.props.user.checkin ? this.props.user.checkin.date : null}</div>
          </Modal>
          {courses.map((course) => (
            <LessonCard
              application={this.props.application}
              exam={exam}
              key={course.ID}
              course={course}
              courseState={this.props.course}
              lessons={lessons}
              actions={actions}
              examActions={examActions}
              user={user}
            />
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  course: state.course,
  application: state.application,
  exam: state.exam,
  user: state.user
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(CourseActions, dispatch),
  examActions: bindActionCreators(ExamActions, dispatch),
  userActions: bindActionCreators(UserActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

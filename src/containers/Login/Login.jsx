import React, { Component } from 'react'
import LoginForm from '../../components/LoginForm/LoginForm.jsx'
import 'antd/dist/antd.min.css'
import './Login.css'
import { Row, Col } from 'antd'
import { actions as LoginActions } from '../../modules/application'
import { actions as UserActions } from '../../modules/user'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import axios from 'axios'
import qs from 'qs'
class Login extends Component {

    componentDidMount() {
        const { register, checkin, host, partner, ck_courseID, ck_placeID, ck_kindID, ck_date, ck_courseName } = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
        if (register) {
            this.props.userActions.updateRegister(register);
        } else {
            this.props.userActions.updateRegister(null);
        }
        if (checkin) {
            this.props.userActions.updateCheckin({courseID:ck_courseID, courseName:ck_courseName, placeID:ck_placeID, kindID:ck_kindID, date:ck_date});
        } else {
            this.props.userActions.updateCheckin(null);
        }
        if (qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).fromID) {
            this.props.actions.updateFromID(qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).fromID)
        }
            console.log("host:", host)
        if (host) {
            this.props.actions.updateHost(host);
        } else {
            this.props.actions.updateHost(null);
        }
        if (partner) {
            this.props.actions.updatePartner(partner);
        } else {
            this.props.actions.updatePartner(null);
        }
        this.props.actions.getCompanyInfo()
    }

    render() {
        return (
            <Row className="form-row">
                <Col xs={2} sm={4} md={6} lg={8} xl={8}>
                </Col>
                <Col xs={20} sm={16} md={12} lg={8} xl={8} className="form-container">
                    {this.props.application.companyInfo ?
                        <div className="title-div">
                            <div style={{ margin: 20 }}>
                                {<img src={axios.defaults.baseURL + this.props.application.companyInfo[0].logo} width={300} heigth={100} />}
                            </div>
                            <div>
                                <b className="title">{this.props.application.companyInfo[0].hostName}</b>
                            </div>
                        </div>
                        : null
                    }
                    <LoginForm
                        requestLogin={this.props.actions.requestLogin}
                        loggedIn={this.props.application.loggedIn}
                        loginError={this.props.application.loginError}
                        username={this.props.application.username}
                        getUserInfo={this.props.actions.getUserInfo}
                        userInfo={this.props.application.userInfo}
                        teacher={this.props.application.teacher} />

                </Col>
                <Col xs={2} sm={4} md={6} lg={8} xl={8}>
                </Col>
            </Row>
        )
    }
}

const mapStateToProps = state => ({
    application: state.application
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(LoginActions, dispatch),
    userActions: bindActionCreators(UserActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);

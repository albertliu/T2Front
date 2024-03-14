import React, { Component } from 'react'
import { connect } from 'react-redux'
import { actions as ExamActions } from '../../modules/exam'
import { bindActionCreators } from 'redux'
import ExamForm from '../../components/ExamForm/ExamForm'
import { Modal } from 'antd'


class ExamPage extends Component {

    constructor() {
        super();
        this.state = {
            alertVisible: false
        }
    }

    render() {
        const {exam,actions} = this.props
        const { alertVisible } = this.state
        return (
            <div>
                <Modal title='请用浏览器打开(右上角...图标)' footer={[]}
                style={{
                    maxWidth: "100vw",
                    top: 0,
                    paddingBottom: 0,
                    background: "#facd91"
                  }}
                  bodyStyle={{
                    height: "calc(100vh - 55px - 53px)"
                  }}
                  width="100vw" 
                  visible={alertVisible}       
                >
                    <p>检测到当前环境为IOS苹果微信</p>
                    <p>直接打开时会有卡顿现象</p>
                    <p>请使用浏览器打开</p>
                </Modal>
                <ExamForm exam={exam} actions={actions}/>
            </div>
        )
    }

    componentDidMount() {
        const browser={
            versions:function(){
                var u = navigator.userAgent;
                return {
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1,//火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
                    iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') === -1, //是否web应该程序，没有头部与底部
                    weixin: u.toLowerCase().indexOf('micromessenger') > -1, //是否微信 （2015-01-22新增）
                    qq: u.match(/sQQ/i) === " qq" //是否QQ
                };
            }(),
            language:(navigator.browserLanguage || navigator.language).toLowerCase()
        }
        if(browser.versions.ios && browser.versions.weixin){ //
            // this.setState({alertVisible: true})
        }        
    }
}

const mapStateToProps = state => ({
    exam: state.exam,
})


const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(ExamActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ExamPage);
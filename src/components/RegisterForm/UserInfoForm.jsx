import React, { Component } from 'react'
import { Form, Input, Button, Select, message, Row, Col } from 'antd'
import checkIDcard from '../../modules/function/checkID'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import Avatar from './Avatar'

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};
const { Option } = Select
class UserInfoForm extends Component {
    formRef = React.createRef()
    constructor(props) {
        super(props)
        this.checkIDcard = checkIDcard
        this.state = { kindID: "0" }
    }

    componentWillMount() {
        this.props.userActions.getEducation({ kindID: 'education' })
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.application.postUserInfoStatus && nextProps.application.postUserInfoStatus.status === 0) {
            message.success("学员信息修改成功")
            this.props.actions.getUserInfo({ username: this.props.application.username })
            this.props.actions.resetPostUserInfo()
        }

    }

    onFinish = values => {
        console.log('Success:', values)
        this.props.actions.postUserInfo({
            mark: 1,
            username: values.username,
            password: values.password,  //*
            name: values.name,   //*
            kindID: values.kindID,    //0:系统内单位  1:系统外单位
            education: values.education,
            job: values.job,
            mobile: values.mobile,
            phone: values.phone,
            email: values.email,   //*
            province: values.province,
            address: values.address,
            unit: values.unit,
            linker: values.linker
        })
    }


    onValuesChange = (changedValue, values) => {
    }
    // action={`${axios.defaults.baseURL}/files/uploadSingle?username=${this.props.application.username}&upID=student_IDcardA&keyID=0`}
    render() {
        const { kindID } = this.state
        return (
            <Form
                {...formItemLayout}
                onFinish={this.onFinish}
                scrollToFirstError
                initialValues={this.props.application.userInfo ?
                    {
                        ...this.props.application.userInfo,
                        password: null,
                        kindID: this.props.application.userInfo.kindID.toString(),
                        education: this.props.application.userInfo.education.toString(),
                    }
                    : { kindID: "0" }}
                onValuesChange={this.onValuesChange}
                ref={this.formRef}
            >
                <Form.Item
                    name="username"
                    label="身份证"
                    rules={[
                        {
                            required: true,
                            message: '请输入身份证号',
                        },
                        {
                            validator: (rule, value) => {
                                // console.log(this.checkIDcard(value))
                                if (!value || this.checkIDcard(value) === 1) {
                                    return Promise.resolve();
                                } else if (this.checkIDcard(value) === 2) {
                                    return Promise.reject('身份证号码位数不对');
                                } else if (this.checkIDcard(value) === 3) {
                                    return Promise.reject('身份证号码出生日期超出范围或含有非法字符');
                                } else if (this.checkIDcard(value) === 4) {
                                    return Promise.reject('身份证号码校验错误');
                                } else if (this.checkIDcard(value) === 5) {
                                    return Promise.reject('身份证地区非法');
                                } else
                                    return Promise.reject('身份证号码校验错误');
                            },
                        }

                    ]}
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    name="name"
                    label="姓名"
                    rules={[
                        {
                            required: true,
                            message: '请输入姓名',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="密码"
                    rules={[
                        {
                            required: false,
                            message: '请输入密码',
                        },
                        {
                            min: 6,
                            message: '密码至少六位'
                        }
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    label="确认密码"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: false,
                            message: '请确认密码',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('两次输入不匹配');
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="education"
                    label="学历"
                    rules={[{ required: true, message: '请输入学历' }]}
                >
                    <Select>
                        {this.props.user.educationList.map(item => (
                            <Option key={item.ID} value={item.ID}>{item.item}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="mobile"
                    label="手机号码"
                    rules={[
                        {
                            required: true,
                            message: '请输入手机号码',
                        },
                        {

                            validator: (rule, value) => {
                                console.log(this.checkIDcard(value))
                                if (!value || value.length === 11) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject('手机号不合法')
                                }
                            },

                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="address"
                    label="联系地址"
                    rules={[{ required: true, message: '请输入联系地址' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="province"
                    label="邮政编码"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="unit"
                    label="单位"
                    rules={[{ required: true, message: '请输入单位' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="job"
                    label="岗位"
                    rules={[{ required: true, message: '请输入岗位' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="单位电话"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="单位地址"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="linker"
                    label="联系人"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="upload"
                    label="上传照片(仅供制作证件)"
                >
                    <Row>
                        <Col span={12}>
                            <Avatar imageUrl={this.props.application.userInfo.photo_filename !== "" ? axios.defaults.baseURL + this.props.application.userInfo.photo_filename : axios.defaults.baseURL + '/public/images/guy.png'} />
                        </Col>
                        <Col span={12} style={{ textAlign: "left" }}>
                            <span>
                                正面免冠彩色近照, 头部占画面的2/3，图像清晰无畸变。照片高宽比为7:5。请适当裁剪，不合格者无法取证。
                            </span>
                        </Col></Row>
                </Form.Item>
                <Form.Item
                    name="upload2"
                    label="上传身份证正面"
                >
                    <Row>
                        <Col span={12}>
                            <Avatar imageUrl={this.props.application.userInfo.IDa_filename ? axios.defaults.baseURL + this.props.application.userInfo.IDa_filename : null} />
                        </Col>
                        <Col span={12} style={{ textalign: "left" }}>
                            <span>
                                水平放置, 身份证充满画面至少4/5，图像清晰，无明显畸变。高宽比为5:8。
                            </span>
                        </Col></Row>
                </Form.Item>
                <Form.Item
                    name="upload3"
                    label="上传身份证背面"
                >
                    <Row>
                        <Col span={12}>
                            <Avatar imageUrl={this.props.application.userInfo.IDb_filename ? axios.defaults.baseURL + this.props.application.userInfo.IDb_filename : null} disabled={true}/>
                        </Col>
                        <Col span={12} style={{ textalign: "left" }}>
                            <span>
                                同上。
                            </span>
                        </Col></Row>
                </Form.Item>
                <Form.Item
                    name="upload4"
                    label="上传学历证明"
                >
                    <Row>
                        <Col span={12}>
                            <Avatar imageUrl={this.props.application.userInfo.edu_filename ? axios.defaults.baseURL + this.props.application.userInfo.edu_filename : null} />
                        </Col>
                        <Col span={12} style={{ textalign: "left" }}>
                            <span>
                            </span>
                        </Col></Row>
                </Form.Item>
                <Form.Item
                    name="upload4"
                    label="上传在职证明"
                >
                    <Row>
                        <Col span={12}>
                            <Avatar imageUrl={this.props.application.userInfo.employe_filename ? axios.defaults.baseURL + this.props.application.userInfo.employe_filename : null} />
                        </Col>
                        <Col span={12} style={{ textalign: "left" }}>
                            <span>
                            </span>
                        </Col></Row>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">保存</Button>
                    <span> </span>
                    <span> </span>
                </Form.Item>
            </Form>

        )
    }
}
export default withRouter(UserInfoForm)
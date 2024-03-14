import React, { Component } from 'react'
import { Form, Input, Button, Select,message } from 'antd'
import { withRouter } from 'react-router-dom'


const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

class FeedbackForm extends Component {
    formRef = React.createRef()
    constructor(props) {
        super(props)
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props.message.postMessageRes === null && nextProps.message.postMessageRes && nextProps.message.postMessageRes.status === 0) {
            message.success('反馈提交成功')
            this.formRef.current.resetFields()
            this.props.actions.updatePostMessage(null)
        }
    }

    onFinish = values => {
        console.log('Success:', values)
        this.props.actions.postMessage({
            username: this.props.application.userInfo.username,
            mobile: values.mobile,
            email: values.email,
            kindID: values.kindID,
            item: values.item,
            refID: "0"
        })
    }

    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo)
    }
    render() {
        return (
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ mobile: this.props.application.userInfo.mobile, email:this.props.application.userInfo.email}}
                onFinish={this.onFinish}
                {...layout}
                ref={this.formRef}
            >
                <Form.Item
                    name="mobile"
                    label="手机"
                    rules={[{ required: true, message: '请输入手机' }]}
                >
                    <Input placeholder="手机号码" />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[{ required: true, message: '请输入邮箱' }]}
                >
                    <Input
                    />
                </Form.Item>
                <Form.Item
                    name="kindID"
                    label="问题类型"
                >
                    <Select>
                        {this.props.message.messageTypes.map(type => (
                            <Select.Option key={type.ID} value={type.ID}>{type.item}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="item"
                    label="反馈内容"
                    rules={[{ required: true, message: '请输入反馈内容' }]}
                >
                    <Input.TextArea  autoSize={{minRows: 3}}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        提交
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}

export default withRouter(FeedbackForm)
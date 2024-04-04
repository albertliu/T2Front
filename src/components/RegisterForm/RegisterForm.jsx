import React, { Component } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Radio,
  message,
  Upload,
  AutoComplete,
} from "antd";
import checkIDcard from "../../modules/function/checkID";
import { withRouter } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";

const uploadProps = {
  name: "avatar",
  action:
    "http://localhost:8085/files/uploadSingle?username=120107196604032113&upID=student_photo",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} 文件上传成功`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} 文件上传失败`);
    }
  },
};

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
const { Option } = Select;
class RegisterForm extends Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.checkIDcard = checkIDcard;
    this.state = { kindID: "0" };
  }

  componentWillMount = () => {
    if (this.props.loggedIn) {
      this.props.history.push("/homepage");
    }
    this.props.userActions.getEducation({ kindID: "education" });
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.loggedIn && nextProps.username) {
        this.props.getUserInfo({ username: nextProps.username })
        if (nextProps.userInfo && nextProps.userInfo.newCourse === 0) {
            this.props.history.push('/courseselect')
        } else if (nextProps.userInfo) {
            console.log(nextProps.userInfo)
            this.props.history.push('/homepage')
        }
    }
    // if (nextProps.loggedIn) {
    //   this.props.history.push("/homepage");
    // }
    if (nextProps.registerError) {
      message.error(nextProps.registerError);
    }
    if (nextProps.loginError) {
        message.error(nextProps.loginError.msg);
    }
    if (nextProps.registered) {
      message.success("注册成功！");
      this.props.resetRegisterStatus();
      // this.props.history.push('/login')
      const values = this.formRef.current.getFieldsValue();
      const { host, partner, sales } = this.props.application;
      this.props.requestLogin({
        username: values.username,
        password: values.password,
        host,
        partner,
        sales,
      });
    }
  };

  onFinish = (values) => {
    // console.log('Success:', values)
    this.props.requestRegister({
      mark: 0,
      username: values.username,
      password: values.password, //*
      name: values.name, //*
      kindID: values.kindID, //0:系统内单位  1:系统外单位
      education: values.education,
      job: values.job,
      mobile: values.mobile,
      phone: values.phone,
      email: values.email, //*
      province: values.province,
      address: values.address,
      unit: values.unit,
      linker: values.linker,
    });
  };

  onValuesChange = (changedValue, values) => {};

  render() {
    const { kindID } = this.state;
    return (
      <Form
        {...formItemLayout}
        onFinish={this.onFinish}
        scrollToFirstError
        initialValues={{ kindID: "0" }}
        onValuesChange={this.onValuesChange}
        ref={this.formRef}
      >
        <Form.Item
          name="username"
          label="身份证"
          rules={[
            {
              required: true,
              message: "请输入身份证号",
            },
            {
              validator: (rule, value) => {
                console.log(this.checkIDcard(value));
                if (!value || this.checkIDcard(value) === 1) {
                  return Promise.resolve();
                } else if (this.checkIDcard(value) === 2) {
                  return Promise.reject("身份证号码位数不对");
                } else if (this.checkIDcard(value) === 3) {
                  return Promise.reject(
                    "身份证号码出生日期超出范围或含有非法字符"
                  );
                } else if (this.checkIDcard(value) === 4) {
                  return Promise.reject("身份证号码校验错误");
                } else if (this.checkIDcard(value) === 5) {
                  return Promise.reject("身份证地区非法");
                } else return Promise.reject("身份证号码校验错误");
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          label="姓名"
          rules={[
            {
              required: true,
              message: "请输入姓名",
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
              required: true,
              message: "请输入密码",
            },
            {
              min: 6,
              message: "密码至少六位",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="确认密码"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "请确认密码",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("两次输入不匹配");
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="education"
          label="学历"
          rules={[{ required: true, message: "请输入学历" }]}
        >
          <Select>
            {this.props.user.educationList.map((item) => (
              <Option value={item.ID}>{item.item}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="mobile"
          label="手机号码"
          rules={[
            {
              required: true,
              message: "请输入手机号码",
            },
            {
              validator: (rule, value) => {
                console.log(this.checkIDcard(value));
                if (!value || value.length === 11) {
                  return Promise.resolve();
                } else {
                  return Promise.reject("手机号不合法");
                }
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="address" label="联系地址">
          <Input />
        </Form.Item>
        <Form.Item name="province" label="邮政编码">
          <Input />
        </Form.Item>

        <Form.Item
          name="unit"
          label="单位"
          rules={[{ required: true, message: "请输入单位" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="job"
          label="岗位"
          rules={[{ required: true, message: "请输入岗位" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="单位电话">
          <Input />
        </Form.Item>
        <Form.Item name="email" label="单位地址">
          <Input />
        </Form.Item>
        <Form.Item name="linker" label="联系人">
          <Input />
        </Form.Item>
        {false ? (
          <Form.Item name="upload" label="上传照片">
            <Upload {...uploadProps}>
              <Button>
                <UploadOutlined /> Click to Upload
              </Button>
            </Upload>
          </Form.Item>
        ) : null}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            注册
          </Button>
          <span> </span>
          <span> </span>
          <a href="/login">取消</a>
        </Form.Item>
      </Form>
    );
  }
}
export default withRouter(RegisterForm);

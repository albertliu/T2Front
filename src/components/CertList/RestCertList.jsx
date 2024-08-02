import React, { Component } from 'react'
import { List, Skeleton, message, Modal, Button, Input, Radio, Form, DatePicker, ConfigProvider } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { withRouter } from 'react-router-dom'
import 'antd/dist/antd.css'
// import locale from 'antd/es/date-picker/locale/zh_CN';
import { LocalFormat } from './localHelper';
// import 'dayjs/locale/zh-cn';
// import moment from 'moment';
// import 'moment/dist/locale/zh-cn';
// moment.locale('zh-cn');

class RestCertList extends Component {
  constructor(props) {
    super(props)
    this.formRef = React.createRef()
    this.state = {
      visible: false,
      retrain: 0,
      selectedItem: null
    }
  }
  componentDidMount() {
    this.props.actions.getRestCert({ username: this.props.application.username })
  }

  onAdd = cert => {
    console.log("addcert:", this.props.application.username, cert.certID, 0, 0, this.props.application.host)
    this.props.actions.postAddCert({ username: this.props.application.username, certID: cert.certID, mark: 0, reexamine: 0, x:`1`, host:this.props.application.host, partner:this.props.application.partner })
    this.setState({ visible: false })
  }

  onAddretrain = cert => {
    this.props.actions.postAddCert({ username: this.props.application.username, certID: cert.certID, mark: 0, reexamine: 1, host:this.props.application.host, partner:this.props.application.partner })
    this.setState({ visible: false })
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.cert.addCertRes === null && nextProps.cert.addCertRes && nextProps.cert.addCertRes.status === 0) {
      message.success('选择成功')
      this.props.actions.getRestCert({ username: this.props.application.username })
      this.props.actions.getSelectedCert({ username: this.props.application.username })
      this.props.actions.getCertCourse({ username: this.props.application.username })
      this.props.actions.resetAddCert()
    } else if (this.props.cert.addCertRes === null && nextProps.cert.addCertRes && nextProps.cert.addCertRes.status !== 0) {
      message.error({
        content: (<div>
          <p>{nextProps.cert.addCertRes.msg}</p>
          {/* <a onClick={() => { this.props.history.push('/userinfo') }}>前往个人信息</a> */}
        </div>)
      })
      this.props.actions.resetAddCert()
    }
  }


  handleCancel = () => {
    console.log(this.formRef.current.getFieldsValue())
    this.setState({ visible: false, selectedItem: null })
  }
  handleOK = cert => {
    this.props.actions.postAddCert({ ...this.formRef.current.getFieldsValue(), username: this.props.application.username, certID: cert.certID, mark: 0, host:this.props.application.host, partner:this.props.application.partner })
    this.setState({ visible: false, selectedItem: null })
  }


  onChange1 = e => {
    this.setState({
      retrain: e.target.value,
    });
  };

  render() {
    const { loading } = this.props
    const { visible } = this.state
    return (
      <List
        header={
          <div>
            <b>可选证书</b>
          </div>
        }
        style={{ textAlign: 'left' }}
        itemLayout="horizontal"
        size="large"
        dataSource={this.props.cert.restCert.filter(restCert => restCert.mark === 0)}
        renderItem={item => (
          <List.Item
            key={item.certID}
            actions={item.reexamine !== 1 ? [<a key="list-loadmore-edit" onClick={() => this.onAdd(item)} style={{ color: 'darkOrange' }}><PlusOutlined /></a>] :
              [
                <div><Modal
                  visible={visible}
                  title=""
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  footer={[
                    <Button key="first" onClick={() => this.handleOK(this.state.selectedItem)} type="primary">
                      确定
                    </Button>,
                    <Button
                      key="link"
                      loading={loading}
                      onClick={this.handleCancel}
                    >
                      取消
                    </Button>,
                  ]}
                >
                  <Form
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{
                      reexamine: 0,
                    }}
                    ref={this.formRef}
                  >
                    <Form.Item name="reexamine" className="collection-create-form_last-form-item">
                      <Radio.Group onChange={this.onChange1}>
                        <Radio value={0}>初训</Radio>
                        <Radio value={1}>复训</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {this.state.retrain === 1 ? <Form.Item name="currDiplomaDate" label="应复训日期">
                    <DatePicker locale={LocalFormat.getDefinedChineseLocal()} />
                    </Form.Item> : null}

                  </Form>
                </Modal>
                  <a key="list-loadmore-edit" onClick={() => { this.setState({ visible: true, selectedItem: item }) }} style={{ color: 'darkOrange' }}><PlusOutlined /></a>
                </ div>]}
          >
            <Skeleton active loading={loading}>
              <List.Item.Meta
                title={<a>{item.certName}</a>}
              />
            </Skeleton>
          </List.Item>
        )
        }
      />
    )
  }
}

export default withRouter(RestCertList)
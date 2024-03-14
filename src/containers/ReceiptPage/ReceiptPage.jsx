import React, { Component } from "react";
import { Row, Col, Button } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { actions as UserActions } from "../../modules/user";
import { bindActionCreators } from "redux";
import { Table } from 'antd';
const { Column, ColumnGroup } = Table;
import styless from './ReceiptPage.css'

const w = '10%'
const columns = [
  {
    title: '摘要',
    dataIndex: 'item',
    width: '60%',
    customHeaderCell: () => ({
      style: {
          textAlign: 'center',  //头部单元格水平居中
      },
    }),
  },
  {
    title: '金额',
    children: [
      {
        title: '千',
        dataIndex: 'qian',
        width: w,
      },
      {
        title: '百',
        dataIndex: 'bai',
        width: w,
      },
      {
        title: '十',
        dataIndex: 'shi',
        width: w,
      },
      {
        title: '元',
        dataIndex: 'yuan',
        width: w,
        // ellipsis: true
      },
  ]},
  // {
  //   title: '备注',
  //   dataIndex: 'memo',
  //   width: '16',
  //   align: 'center'
  // },
];

class ReceiptPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    // window.addEventListener("resize", this.update);
  };

  componentDidMount() {
    // this.update();
    this.props.actions.getReceipt({ username: this.props.application.username } )
  }

  backToLesson = () => {
    this.props.history.push("/homepage");
  };

  
  render() {
    if (!this.props.user.receiptList) {
      return <h2>当前还没有收据</h2>;
    }
    return (
        <div className="document" style={{ width: "100%" }}>
          <div style={{ backgroundColor: "#F0FFFF" }}>
            <h2 style={{ textAlign: "left" }}>我的收据</h2>
          </div>
          <div>
            <h3 style={{ textAlign: "left", color: "gray" }}>
              上海市应急管理局核准的特种作业培训机构
            </h3>
          </div>
          <div>
            <h3 style={{ textAlign: "left", color: "gray" }}>
              本机构信息在应急管理部官网可查询（cx.mem.gov.cn）
            </h3>
          </div>
          <div>&nbsp;</div>
          {

            this.props.user.receiptList.map((receipt, index) => {
            const amount = receipt.amounty.split("")
            
            // const data = [
            //   {
            //     key: '1',
            //     item: receipt.certName,
            //     qian: amount[0],
            //     bai: amount[1],
            //     shi: amount[2],
            //     yuan: amount[3],
            //     // memo: receipt.pay_typeName
            //   },
            //   {key: '2'},
            //   {key: '3'},
            //   {
            //     key: '4',
            //     item: '合计(大写)：' + receipt.amountCN,
            //     qian: receipt.amount[0],
            //     bai: receipt.amount[1],
            //     shi: receipt.amount[2],
            //     yuan: receipt.amount[3],
            //     // memo: ''
            //   }
            // ]         
            
            return  <div>
            <div style={{border:"0px solid gray", boxShadow:"2px 2px 5px rgba(0, 0, 0, 0.3)"}}>
            <Row style={{ backgroundColor: "#F6F6F6" }}>
              <Col flex="auto">
                <h3 style={{ textAlign: "center", color:"gray", fontSize:"1.1em", paddingTop:"5px" }}>特种作业培训专用收费凭证</h3>
                <h3 style={{ textAlign: "center", color:"red", fontSize:"1.1em" }}>No.{receipt.ID}</h3>
              </Col>
            </Row>
            <Row style={{backgroundColor: "#F6F6F6" }}>
              <Col>
                <div style={{ textAlign: "left", fontSize:"0.9em" }}>
                  <span style={{paddingLeft:"1em"}}>{'交款人：' + receipt.name}</span><span style={{paddingLeft:"4em"}}>{receipt.datePay.substring(0,4) + '年' + receipt.datePay.substring(5,7) + '月' + receipt.datePay.substring(8) + '日'}</span>
                </div>
              </Col>
            </Row>
            {/* <Table bordered dataSource={data} columns={columns} pagination={false} table-layout="fixed" ></Table> */}
            <table class="ant-table-cell" style={{width:"100%"}}>
              <tr>
                <td style={{width:"50%"}} class="ant-table-cell" rowSpan={2}>摘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;要</td>
                <td class="ant-table-cell" colSpan={4}>金额</td>
                <td style={{width:"10%"}} class="ant-table-cell" rowSpan={2}>备注</td>
              </tr>
              <tr>
                <td style={{width:w}} class="ant-table-cell">千</td>
                <td style={{width:w}} class="ant-table-cell">百</td>
                <td style={{width:w}} class="ant-table-cell">十</td>
                <td style={{width:w}} class="ant-table-cell">元</td>
              </tr>
              <tr style={{height:"30px"}}>
                <td class="ant-table-cell" style={{textAlign:"left", paddingLeft:"1em"}}>{receipt.certName}</td>
                <td class="ant-table-cell">{amount[0]}</td>
                <td class="ant-table-cell">{amount[1]}</td>
                <td class="ant-table-cell">{amount[2]}</td>
                <td class="ant-table-cell">{amount[3]}</td>
                <td class="ant-table-cell">{receipt.pay_typeName}</td>
              </tr>
              <tr style={{height:"30px"}}>
                <td class="ant-table-cell">&nbsp;</td>
                <td class="ant-table-cell">&nbsp;</td>
                <td class="ant-table-cell">&nbsp;</td>
                <td class="ant-table-cell">&nbsp;</td>
                <td class="ant-table-cell">&nbsp;</td>
                <td class="ant-table-cell">&nbsp;</td>
              </tr>
              <tr style={{height:"30px"}}>
                <td class="ant-table-cell">&nbsp;</td>
                <td class="ant-table-cell">&nbsp;</td>
                <td class="ant-table-cell">&nbsp;</td>
                <td class="ant-table-cell">&nbsp;</td>
                <td class="ant-table-cell">&nbsp;</td>
                <td class="ant-table-cell">&nbsp;</td>
              </tr>
              <tr style={{height:"30px"}}>
                <td class="ant-table-cell" style={{textAlign:"left", paddingLeft:"1em"}}>{'合计(大写)：' + receipt.amountCN}</td>
                <td class="ant-table-cell">{amount[0]}</td>
                <td class="ant-table-cell">{amount[1]}</td>
                <td class="ant-table-cell">{amount[2]}</td>
                <td class="ant-table-cell">{amount[3]}</td>
                <td class="ant-table-cell"></td>
              </tr>
            </table>
            <Row wrap={false} style={{ backgroundColor: "#F6F6F6" }}>
              <Col>
                <div style={{ textAlign: "left", fontSize:"0.9em", paddingTop:"5px", paddingBottom:"5px" }}>
                  <span style={{paddingLeft:"1em"}}>{'经办人：' + receipt.pay_checkerName}</span>
                </div>
              </Col>
            </Row>
            </div>
            <div style={{height:"15px"}}></div>
            </div>
            })
          }
          <Row>
            <Col span={24} style={{ textAlign: "center" }}>
              <Button type="primary" onClick={() => this.backToLesson()}>
                返回
              </Button>
            </Col>
          </Row>
        </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  application: state.application
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(UserActions, dispatch),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ReceiptPage)
);

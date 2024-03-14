import React, { Component } from "react";
import CertCard from "../../components/CertCard/CertCard";
import { connect } from "react-redux";
import { actions as CertActions } from "../../modules/certificate";
import { actions as AuditActions } from "../../modules/audit";
import { bindActionCreators } from "redux";
import styless from '../ReceiptPage/ReceiptPage.css'

class CertPage extends Component {
  componentDidMount() {
    this.props.actions.getAccomplished({
      username: this.props.application.username,
    });
  }

  render() {
    const { accomplished } = this.props.cert;
    if (accomplished.length === 0) {
      return (
        <div>
          <h3>还没有获得证书</h3>
        </div>
      );
    }
    return (
      <div>
        <div style={{ backgroundColor: "#F0FFFF" }}>
          <h2 style={{ textAlign: "left" }}>安全生产培训证书查询</h2>
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
        <div>
          {accomplished.map((cert) => (
            // <CertCard
            //   key={cert.ID}
            //   cert={cert}
            //   actions={this.props.auditActions}
            //   audit={this.props.audit}
            // />
            <table class="ant-table-cell" style={{width:"100%"}}>
              <tr>
                <td style={{width:'25%'}} class="td1">姓名</td>
                <td style={{width:'25%'}} class="td2">{cert.name}</td>
                <td style={{width:'25%'}} class="td1">性别</td>
                <td style={{width:'25%'}} class="td2">{cert.sexName}</td>
              </tr>
              <tr>
                <td class="td1">证书编号</td>
                <td class="td2" colSpan={3}>{cert.diplomaID}</td>
              </tr>
              <tr>
                <td class="td1">身份证号</td>
                <td class="td2" colSpan={3}>{cert.username}</td>
              </tr>
              <tr>
                <td class="td1">工作单位</td>
                <td class="td2" colSpan={3}>{cert.unit}</td>
              </tr>
              <tr>
                <td class="td1">培训项目</td>
                <td class="td2" colSpan={3}>{cert.certName}</td>
              </tr>
              <tr>
                <td class="td1">有效期限</td>
                <td class="td2" colSpan={3}>{cert.startDate + '至' + cert.endDate}</td>
              </tr>
              <tr>
                <td class="td1">发证单位</td>
                <td class="td2" colSpan={3}>{cert.hostName}</td>
              </tr>
            </table>            
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  cert: state.cert,
  application: state.application,
  audit: state.audit,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(CertActions, dispatch),
  auditActions: bindActionCreators(AuditActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CertPage);

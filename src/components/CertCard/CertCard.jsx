import React, { Component } from 'react'
import { Card, Row, Col, Progress } from 'antd'
import { withRouter } from 'react-router-dom'
import 'antd/dist/antd.min.css'

class LessonCard extends Component {


    gridStyle = {
        width: '100%',
        textAlign: 'left',
    };

    onClick = (item) => {
        this.props.actions.updateSelectedCert(item)
    }

    componentWillReceiveProps = nextProps => {
        if (nextProps.audit.selectedCert) {
            this.props.history.push('/certpage/certimage')
        }
    }

    render() {
        const { cert } = this.props

        return (
            <Row key={cert.ID} gutter={[16, 32]}>
                <Col span={24}>
                    <Card title={cert.certName} style={cert.status !== 0 ? { textAlign: 'left', background: '#FFFFF0' } : { textAlign: 'left', background: '#F0FFFF' }} extra={<a>{cert.statusName}</a>}>
                        <Card.Grid style={this.gridStyle}>
                            <p>有效期至：{cert.endDate}</p>
                            {cert.filename !== '' ? <a onClick={() => this.onClick(cert)} target="blank">查看证书</a> : null}
                        </Card.Grid>
                    </Card>
                </Col>
            </Row>
        )
    }
}

export default withRouter(LessonCard)

import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Button, Modal } from 'antd'

export default class HelpPage extends Component {

  constructor(props) {
    super(props)
    this.divRef = React.createRef()
    this.state = {
      shotVisible: false
    }
    // window.addEventListener("resize", this.resize)
    // window.addEventListener("resize", this.update);
}

  handleClick = () => {
    //console.log('点击按钮主动调用input框',this.fileInput.click())
    //需要获取真实的dom元素的点击事件，而不是react实例
    // alert("请拍摄正面头像");
    // document.getElementById("file").click();
    ReactDOM.findDOMNode(this.fileInput).click();
    this.setState({ shotVisible: false });
  };
    
  onClickCancel = () => {
    this.setState({ shotVisible: false });
  }

  componentDidMount() {
    document.getElementById("file").setAttribute("capture", "user");
    // const t1 = setInterval(() => {
    //   this.setState({ readSec: this.state.readSec - 1 })
    // },1000)
    
    setTimeout(() => {
      this.setState({ shotVisible: true });
    },5000)
  }

  render() {
    return (
      <div>
        <h2>暂无资料</h2>
        <div className="container">
          <Modal
            visible={this.state.shotVisible}
            title="头像检测"
            centered
            footer={[<Button onClick={this.onClickCancel}>取消</Button>, 
                    <Button type='primary' onClick={this.handleClick}>拍照</Button>]} 
          >
            <span style={{'fontSize':'1.3em', 'color':'red'}}>将检测您的正面头像，请平视摄像头</span>
          </Modal>
          <input
            id="file"
            type="file"
            name="singlePhoto"
            // capture="camera"
            capture="user"
            ref={(el) => (this.fileInput = el)}
            accept="image/*"
            onChange={this.handleChange}
            style={{ display: "none" }}
          />
        </div>
      </div>
    );
  }
}

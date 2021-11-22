import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Text, Button, Form, Input } from '@tarojs/components'
import './retrievePsw.scss'

export default class Index extends Component {

  constructor(props){
    super(props);
    this.state={
      phoneNum:undefined,
      veriCode:undefined,
      password_1:undefined,
      password_2:undefined,
      time:"获取验证码",
      btnDisabled:false,
      restingTime:61,
    }
    this.setPhoneNum=this.setPhoneNum.bind(this);
    this.setVeriCode=this.setVeriCode.bind(this);
    this.setPassword_1=this.setPassword_1.bind(this);
    this.setPassword_2=this.setPassword_2.bind(this);
    this.btnVeriCode=this.btnVeriCode.bind(this);
    this.changePsw=this.changePsw.bind(this);
  }
  //获取输入框中的输入值
  setPhoneNum(event){
    this.setState({
      phoneNum:event.detail.value
    })
  }
  setVeriCode(event){
    this.setState({
      veriCode:event.detail.value
    })
  }
  setPassword_1(event){
    this.setState({
      password_1: event.detail.value
    });
  }
  setPassword_2(event){
    this.setState({
      password_2: event.detail.value
    });
  }
  //获取验证码 （!!!还缺少服务端验证码的动态获取接口）
  btnVeriCode(){
    // console.log(this.data.phoneNum);//测试用
    var reg = /^1[3|4|5|8][0-9]\d{4,8}$/;//电话号码正则表达式
    var flag=reg.test(this.state.phoneNum);
    var timer=null;//timer定时器

    if(flag===true){  //符合手机号的格式
      this.setState({btnDisabled:true});//禁用按钮
      Taro.showToast({
        title: '已发送至手机号',
        icon:"success",
        duration:1500,
      });

      const that=this;
      let restingTime=this.state.restingTime;
      timer=setInterval(function(){
        restingTime--;
        that.setState({time:"已发送("+restingTime+"s)" });
        if(restingTime<=0){
          clearInterval(timer);
          that.setState({
            time:"重新获取",
            restingTime:61,
            btnDisabled:false,
          })
        }
      },1000)
    }
    else{ //不符合手机号格式，发出toast警告
      Taro.showToast({
        title:"请输入正确的手机号",
        icon:"none",
        duration:1500,
      });
    }
  }

  //提交修改密码的表单
  changePsw(){
    let that=this;
    let psw1=this.state.password_1, psw2=this.state.password_2;
    let veriCode=this.state.veriCode;
    let reg=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
    if(reg.test(psw1)){//密码符合标准
      if(psw1===psw2){
        if(veriCode==="SYSU"){ //静态的验证码，后期要改为动态
          // console.log("新密码设置成功！");//调试用
          Taro.request({
            url:"http://127.0.0.1:8008/changePsw",
            method:"GET",
            data:{
              //将新的数据发送至服务器；
              //注意新密码要与手机号一起发，以便后台能快速锁定记录
              phoneNum:`${this.state.phoneNum}`,
              newPsw:`${psw1}`
            },
            success:(result)=>{
              if(result.data==="success")
              {
                Taro.showToast({
                  title: '密码修改成功!',
                  icon:"success",
                  duration:1000
                });
                that.setState({
                  phoneNum:"",
                  veriCode:"",
                  password_1:"",
                  password_2:""
                })
              }
              else if(result.data==="fail"){
                Taro.showToast({
                  title: '手机号非注册手机号',
                  icon:"none",
                  duration:2000
                })
              }
              else if(result.data==="error")
                Taro.showToast({
                  title: '服务端繁忙，请稍后再试',
                  icon:"none",
                  duration:2000
                })
              console.log(result);//调试用
            }
          })
        }
        else{
          Taro.showToast({
            title:"验证码错误",
            icon:"none",
            duration:1500,
          })
        }
      }
      else{
        Taro.showToast({
          title: '两次密码不一致',
          icon:"none",
          duration:1500,
        })
      }
    }
    else{//密码格式不符
      Taro.showToast({
        title: "密码格式不符要求",
        icon:"none",
        duration:1500
      })
    }
  }
  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View>
        <Form id="formElement">
          <View className="inputList">
            <Text className="fronter">手机号码</Text>
            <Button onClick={this.btnVeriCode} disabled={this.state.btnDisabled} >{this.state.time}</Button>
            <Input type="text" placeholder="请输入注册手机号" onInput={this.setPhoneNum} value={this.state.phoneNum} maxlength="15"></Input>

          </View>

          <View className="inputList">
            <Text className="fronter">验证号码</Text>
            <Input type="text" placeholder="验证码" onInput={this.setVeriCode} value={this.state.veriCode} maxlength="4"></Input>
          </View>

          <View className="inputList">
            <Text className="fronter" id="shortFronter">密码</Text>
            <Input type="text" password={true} placeholder="设置新密码(6~16位,包含数字和字母)" onInput={this.setPassword_1} value={this.state.password_1} maxlength="18"></Input>
          </View>

          <View className="inputList">
            <Text className="fronter">确认密码</Text>
            <Input type="text" password={true} placeholder="请再次确认密码" onInput={this.setPassword_2} value={this.state.password_2} maxlength="18"></Input>
          </View>
        </Form>
        <Button type="primary" id="changePsw" onClick={this.changePsw}>修改密码</Button>
      </View>

    )
  }
}

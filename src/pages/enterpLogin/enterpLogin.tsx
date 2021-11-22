import Taro from '@tarojs/taro'
import { useState, useEffect} from 'react'
import { View, Form, Text, Input, Button } from '@tarojs/components'
import './enterpLogin.scss'
import {setUsername, setUserPhoneNum, userInfo} from "../sharedDataModule"

export default function EnterpLogin(){

  const [username, setUserName]=useState("");
  const [phoneNum, setPhoneNum]=useState("");
  const [password, setPassword]=useState("");

  function forgetPsw(){ //前往找回密码页面
    Taro.navigateTo({ url: '../retrievePsw/retrievePsw' });
  }

  // useEffect(()=>{
  //   // console.log(userInfo);
  // },[]);

  function btnSignIn(){ //点击后进行登陆
    let phoneReg=/^1[3|4|5|8][0-9]\d{4,8}$/;//手机号正则
    if(username==="" || password==="")  //登录信息为空则返回
    {
      Taro.showToast({
        title: '登陆信息不能空',
        icon: "none",
        duration: 1500
      })
      return;
    }
    Taro.request({
      url:"http://127.0.0.1:8008/enterpSignIn",
      method:"GET",
      data:{
        username:username,
        phoneNum:phoneNum,
        password:password
      },
      success(result){
        // console.log(result);//调试用

        const p=new Promise((resolve,reject)=>{ //这里使用Promise来处理异步
          if(result.data.username)
          {
            setUsername(result.data.username);  //setUsername是设置共享文件usernameEnterp.tsx中userInfo的username属性
            setUserPhoneNum(result.data.phoneNum);  //同理setUserPhoneNum是设置共享文件中的属性
            resolve("ok");
          }
          else if(result.data==="wrong")
            reject("wrong")
          else 
            reject("error")
        })
        p.then(()=>{  //第一个参数是处理resolve的函数
          Taro.showToast({
            title: '登录成功',
            icon:"success",
            duration: 1000
          });
          setUserName("");//清空输入框
          setPassword("");

          // console.log(userInfo);//调试用

          setTimeout(()=>{
            Taro.navigateTo({url:"../enterpHome/enterpHome"});
          },1000)
        },reason=>{ //第二个参数是处理reject的函数
          if(reason==="wrong")
          {
            Taro.showToast({
              title: '用户名或密码错误',
              icon:"none",
              duration: 1500
            });
          }
          else if(reason==="error"){
            Taro.showToast({
              title: '服务器错误',
              icon:"none",
              duration: 1500
            });
          }
        })
      }
    })
  }
  function btnRegister(){ //前往注册页面
    Taro.navigateTo({ url: '../enterpRegister/enterpRegister' });
  }
  return (
    <View>
        <Form id="formElement">
          <View className="inputList">
            <Text className="fronter">账号</Text>
            <Input type="text" placeholder="请输入账号或手机号" onInput={input=>{setUserName(input.detail.value);setPhoneNum(input.detail.value);}} value={username} maxlength={20}/>
          </View>

          <View className="inputList">
            <Text className="fronter">密码</Text>
            <Input type="text" password={true} placeholder="请输入密码" onInput={input=>setPassword(input.detail.value)} value={password} maxlength={20}/>
          </View>

          <View id="forgetPsw" onClick={forgetPsw}>忘记密码？</View>
        </Form>
        <Button type="primary" id="signIn" onClick={btnSignIn}>立即登录</Button>
        <Button type="primary" id="register" onClick={btnRegister}>注册新账号</Button>
    </View>
    )
}

  
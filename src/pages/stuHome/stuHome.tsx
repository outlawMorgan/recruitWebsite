import Taro from '@tarojs/taro'
import { useState, useEffect} from 'react'
import { View, Image, Button} from '@tarojs/components'
import './stuHome.scss'
import defaultImg from "../../img/defaultImg.jpg"
import {stuInfo, setStuOpenid} from "../sharedDataModule"

export default function StuHome(){
  let user={
    portrait:"",
    name:""
  }

  const [portrait,setPortrait]=useState(defaultImg);
  const [stuName,setStuName]=useState("");
  const [btn1Style, setBtn1Style]=useState("color: #6D6D6D;");
  const [btn2Style, setBtn2Style]=useState("color: rgb(226, 225, 225);")

  useEffect(()=>{
    // console.log(stuInfo.openid);//调试用
    const assignAvatarName=new Promise((resolve, reject)=>{
        Taro.request({
            url:"http://127.0.0.1:8008/getStuAvatarName",
            method:"GET",
            data:{
                openid:stuInfo.openid
            },
            success(result){
              // console.log(result.data);//调试用
              user=result.data;
              resolve("");
            },
            fail(){
                reject();
            }
        })   
    });
    assignAvatarName.then(()=>{
      setPortrait(user.portrait);
      setStuName(user.name);
    },()=>{
        Taro.showToast({
          title:"获取信息失败!",
          icon:"none",
          duration:1500
        })
    });
  },[user,portrait,stuName]);

  function editStuInfor(){
    Taro.navigateTo({url:"../stuInforEdit/stuInforEdit"});
  }

  function checkRewards(){
    //后面补充，查看奖品的事件监听函数
  }

  function toMainPage(){
    setBtn1Style("color: rgb(226, 225, 225);");
    setBtn2Style("color: #6D6D6D;")
    Taro.navigateBack({});
}

  return (
    <View className="wrapper">
      <View className="avatar">
          <Image className="img" src={portrait}/>        
          <View className="stuName">{stuName}</View>
      </View>

      <View className="line">
          <View className="label" onClick={editStuInfor}>个人信息编辑</View>
      </View>

      <View className="line">
          <View className="label" onClick={checkRewards}>查看获奖信息</View>
      </View>

      <View className="home_mine">
            <View className="home"><Button className="button1" onClick={toMainPage} style={btn1Style}>首页</Button></View>
            <View className="mine"><Button className="button2" style={btn2Style}>我的</Button></View>
        </View>
    </View>
  )

}

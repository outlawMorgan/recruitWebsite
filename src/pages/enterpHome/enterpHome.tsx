import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { View, Image } from '@tarojs/components'
import './enterpHome.scss'
import {setUsername, setUserPhoneNum, userInfo} from "../sharedDataModule"
import defaultImg from "../../img/defaultImg.jpg"

export default function EnterpHome(){
    let user={
        avatar:"",
        name:""
    }
    const [avatar,setAvatar]=useState(defaultImg);
    const [enterpName,setEnterpName]=useState("");

    function editEnterpInfor(){
        Taro.navigateTo({url:"../enterpInforEdit/enterpInforEdit"});
    }

    useEffect(()=>{
        const p=new Promise((resolve,reject)=>{
            Taro.request({
                url:"http://127.0.0.1:8008/getAvatarName",
                method:"GET",
                data:{
                    username: userInfo.username
                },
                success(result){
                    user=result.data;
                    resolve(result.data);
                },
                fail(){
                    reject();
                }
            })   
        });
        p.then(()=>{
            if(user.avatar)
                setAvatar(user.avatar);
            setEnterpName(user.name);
        },()=>{
            console.log("获取信息失败");
        });

        return ()=>{
            setUsername("");
            setUserPhoneNum("");
        }
    },[])   //第二个参数中的中括号代表只在第一次渲染时执行useEffect

    function publishRecruitInfor(){
        Taro.navigateTo({url:"../recruitInforPublish/recruitInforPublish"})
    }
    function purchaseGift(){
        Taro.navigateTo({url:"../giftPurchase/giftPurchase"})
    }
    function signOut(){
        Taro.showModal({
            title: '提示',
            content: '确定退出当前账号吗？',
            success: (res)=>{
              if(res.confirm){  //点击确认则退出至登录页面
                setUsername("");
                Taro.navigateBack({});
              } 
              else if(res.cancel){  //点击取消则函数返回
                return;
              }
            }
        })
    }
    function retrieveRecruitInfor(){
        Taro.navigateTo({url:"../recruitInforRetrieve/recruitInforRetrieve"});
    }
    return(
        <View className="wrapper">
            <View className="avatar">
                <Image className="img" src={avatar}/>        
                <View className="enterpriseName">{enterpName}</View>
            </View>

            <View className="line">
                <View className="label" onClick={editEnterpInfor}>企业信息编辑</View>
            </View>

            <View className="line">
                <View className="label" onClick={publishRecruitInfor}>发布新职位</View>
            </View>

            <View className="line">
                <View className="label" onClick={retrieveRecruitInfor}>查看已发布的职位</View>
            </View>

            <View className="line">
                <View className="label" onClick={purchaseGift}>购买礼品券</View>
            </View>

            <View className="line">
                <View className="label" onClick={signOut}>退出登录</View>
            </View>
        </View>
    )
}
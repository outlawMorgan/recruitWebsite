import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { View, Button, Image} from '@tarojs/components'
import { recruitInfo, resetRecruitInfor} from "../sharedDataModule"
import './recruitInforDetail.scss'

export default function RecruitInforDetail(){
    useEffect(()=>{
        // console.log(recruitInfo);//调试用
    },[]);
    function deleteRecruitInfor(){
        const p=new Promise((resolve,reject)=>{
            Taro.request({
                url:"http://127.0.0.1:8008/deleteRecruitInfor",
                method:"GET",
                data:{
                    id: recruitInfo.id
                },
                success(result){
                    if(result.data==="success")
                        resolve("success");
                    else
                        reject();
                },
                fail(){
                    reject();
                }
            })
        });
        p.then(value=>{
            resetRecruitInfor();
            Taro.showToast({
                title:"删除成功",
                icon:"success",
                duration:1000
            });
            setTimeout(()=>{
                Taro.navigateBack({});
            },1000)
        },()=>{
            Taro.showToast({
                title:"服务器繁忙，请稍后再试",
                icon:"none",
                duration:2000
            });
        })
    }
    function editRecruitInfor(){
        Taro.redirectTo({
            url:"../recruitInforEdit/recruitInforEdit"
        })
    }
    return(
        <View className="wrapper">
            <View className="container">
                <View className="occupation_salary">
                    <View className="occupation">{recruitInfo.job}</View>
                    <View className="salary">{recruitInfo.salary}</View>
                </View>

                <View className="requirement">
                    <View className="head">职位要求</View>
                    <View>{recruitInfo.eduRequired} {recruitInfo.workExp} {recruitInfo.jobType} {recruitInfo.ageRequired} 性别要求:{recruitInfo.gender}</View>
                </View>


                <View className="introduction">
                        <View className="head">职位详情</View>
                        <View className="content">{recruitInfo.jobIntro}</View>
                </View>

                <View className="welfare">
                    <View className="head">员工福利</View>
                    {
                        recruitInfo.jobAdvantage.split(',').map(item=>(
                            <View className="item">{item}</View>
                        ))
                    }

                </View>
                <View className="promote">
                        <View className="head">宣传图片</View>
                        <Image className="promotePhoto" src={recruitInfo.promotePhoto}></Image>
                </View>
            </View>

            <Button className="editBtn" type="primary" onClick={editRecruitInfor}>编辑招聘信息</Button>
            <Button className="deleteBtn" type="warn" onClick={deleteRecruitInfor}>删除招聘信息</Button>
        </View>
    )
}
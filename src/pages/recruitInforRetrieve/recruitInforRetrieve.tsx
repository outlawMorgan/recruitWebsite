import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { View, Button} from '@tarojs/components'
import { userInfo, recruitInfo, setRecruitId, setRecruitInfor} from "../sharedDataModule"
import './recruitInforRetrieve.scss'

let tempArray=[];

export default function RecruitInforEdit(){
    const [recruitInforArray,setRecruitInforArray]=useState(new Array());
    const [hasInfor, toggleHasInfor]=useState(false);

    useEffect(()=>{
        const p=new Promise((resolve,reject)=>{
            Taro.request({
                url:"http://127.0.0.1:8008/getRecruitInfor",
                method:"GET",
                data:{
                    username: userInfo.username
                },
                success(result){
                    // console.log(result);//调试用
                    tempArray=result.data;
                    resolve("success");
                },
                fail(){
                    reject();
                }
            });
        });
        p.then(value=>{
            if(tempArray.length!=0)
                toggleHasInfor(true);
            setRecruitInforArray(tempArray);
        },()=>{
            Taro.showToast({
                title:"服务器繁忙，请稍后再试",
                icon:"none",
                duration: 2000
            })
        });

    },[hasInfor,recruitInforArray])

    return (
        <View className="wrapper">
            {
                // <Button onClick={test}>click me</Button>
                !hasInfor && <Notice/>
            }
            {
                recruitInforArray.map((item,index)=>(
                    <DisplayRecruitInfor jobInfor={item} index={index}/>)
                )
            }
        </View>
    )
        // <View className="recruitInfor">
        //     <View className="header">
        //         <View className="jobName">C++开发工程师</View>
        //         <View className="salary">3000元/月</View>
        //     </View>
        //     <View className="requirement">大专 3-5年经验 全职 20岁以上 性比要求:{"不限"}</View>
        //     <View className="welfare">
        //         <View className="item">五险一金</View>
        //         <View className="item">双休</View>
        //         <View className="item">年假</View>
        //         <View className="item">年终奖</View>
        //     </View>
        // </View>    
}
function naviToDetail(event){
    //此函数中的报错可忽略，不影响调试
    // console.log(event.currentTarget.dataset.id);//调试用

    let index=event.currentTarget.dataset.id;
    setRecruitId(tempArray[index].id);
    let curRecruitInfor=tempArray[index];
    setRecruitInfor(curRecruitInfor.job,curRecruitInfor.salary,curRecruitInfor.numOfRecruit,curRecruitInfor.eduRequired,
        curRecruitInfor.workExp,curRecruitInfor.jobType,curRecruitInfor.ageRequired,curRecruitInfor.gender,
        curRecruitInfor.jobAdvantage,curRecruitInfor.jobIntro,curRecruitInfor.promotePhoto);
    Taro.navigateTo({url:"../recruitInforDetail/recruitInforDetail"});
}
function Notice(){
    return <View className="notice">————还没有发布招聘信息哦————</View>
}
function DisplayRecruitInfor(props){
    return (
        <View className="recruitInfor" onClick={naviToDetail} data-id={props.index}>
            <View className="header">
                <View className="jobName">{props.jobInfor.job}</View>
                <View className="salary">{props.jobInfor.salary}</View>
            </View>
            <View className="requirement">{props.jobInfor.eduRequired} {props.jobInfor.workExp} {props.jobInfor.jobType} {props.jobInfor.ageRequired} 性比要求:{props.jobInfor.gender}</View>
            <View className="welfare">
                {
                    props.jobInfor.jobAdvantage.split(',').map(innerItem=>(
                        <DisplayWelfare welfareItem={innerItem}/>
                    ))
                }
            </View>
        </View>  
    )
      
}
function DisplayWelfare(props){
    return <View className="item">{props.welfareItem}</View>
}
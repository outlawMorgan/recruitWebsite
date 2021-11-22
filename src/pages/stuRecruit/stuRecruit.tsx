import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { View, Button, Text, Image} from '@tarojs/components'
import './stuRecruit.scss'
import {setStuOpenid, stuInfo} from "../sharedDataModule"
import redLove from "../../img/redLove.jpg"
import blackLove from "../../img/blackLove.jpg"

export default function StuRecruit(){
    const [currentMaxId, setCurrentMaxId]=useState(0);
    const [recruitInforArray,setRecruitInforArray]=useState(new Array());
    let tempArray=new Array();

    useEffect(()=>{
        const getOpenid=new Promise((resolve, reject)=>{
            Taro.login({
              success: function(res){
                if (res.code) {
                  //发起网络请求
                  Taro.request({
                    url: 'http://127.0.0.1:8008/api/getWxCode',
                    data: {
                      code: res.code,
                    },
                    success: function(res){
                      if(res.data.status == 100){
                        // console.log(res.data.openid);//调试用
                        setStuOpenid(res.data.openid);//来自sharedDataModule中引入的变量
                        resolve("");
                      }
                      else
                        reject();
                    },
                    fail: function(){
                      reject();
                    }
                  })
                }
                else {
                  reject();
                }
              }
            });
          });
      
          getOpenid.then(()=>{
            getMoreRecruitInfor();
          },()=>{}); 

        Taro.showToast({
            title:"下拉显示更多招聘信息",
            icon:"none",
            duration:1200
        })
    },[]);

    // useEffect(()=>{
    //     getMoreRecruitInfor();
    // },[recruitInforArray]);
    /**
     * 
        scrollindex,  //当前页面的索引值
        totalnum      //总共页面数
        starty        //开始的位置x
        endy          //结束的位置y
        critical      //触发翻页的临界值
        margintop     //滑动下拉距离
     */
    const [scrollindex,setScrollindex]=useState(0);
    const [totalnum, setTotalnum]=useState(0);
    const [startY, setStartY]=useState(0);
    const [endY, setEndY]=useState(0);
    // const [critical,setCritical]=useState(100);
    const [margintop, setMargintop]=useState(0);
    const [fullPageStyle, setFullPageStyle]=useState("transform:translateY(0);margin-top: 0px");
    
    const [btn1Style, setBtn1Style]=useState("color: rgb(226, 225, 225);");
    const [btn2Style, setBtn2Style]=useState("color: #6D6D6D;")

    const [hasLiked, toggleHasLiked]=useState(false);

    function getMoreRecruitInfor(){
        const getJobInfor=new Promise((resolve,reject)=>{
            Taro.request({
                url:"http://127.0.0.1:8008/stuGetRecruitInfor",
                method:"GET",
                data:{
                    id:currentMaxId
                },
                success(res){
                    // console.log(res.data); //调试用
                    if(res.data.length!=0)
                    {
                        tempArray=recruitInforArray;
                        let length=res.data.length;
                        for(let i=0;i<length;i++)
                            tempArray.push(res.data[i]);
                        resolve("");
                    }
                    else
                        reject();
                }
            });
        });
        getJobInfor.then(()=>{
            setCurrentMaxId(tempArray.length);
            setTotalnum(tempArray.length)
            setRecruitInforArray(tempArray);
            // for(let i=0;i<recruitInforArray.length;i++){
            //     Taro.request({
            //         url:"http://127.0.0.1:8008/hasLiked",
            //         data:{
            //             openid:stuInfo.openid,
            //             recruitInforId:recruitInforArray[i].id,
            //         },
            //         success(res){
            //             if(res.data==="YES")
            //                 recruitInforArray[i]["hasLiked"]=true;
            //             else if(res.data==="NO")
            //                 recruitInforArray[i]["hasLiked"]=false;
            //         }
            //     })
            // }
        },()=>{
            Taro.showToast({
                title:"没有更多信息了!",
                icon:"none",
                duration:1500
            })
        });
        return;
    };

    function scrollTouchstart(e){
        let py = e.touches[0].pageY;
        e.stopImmediatePropagation();
        setStartY(py);
    };

    function scrollTouchmove(e){
        let py = e.touches[0].pageY;
        setEndY(py);
    };

    function scrollTouchend(){
        if(endY===0)//若没有下滑操作（单击操作），则返回
            return;
        let tempVal=scrollindex;
        if(endY-startY > 100 && scrollindex>0){
            setScrollindex(scrollindex-1);
            tempVal=scrollindex-1;
        }
        else if(endY-startY <-100 && scrollindex<totalnum-1){
            setScrollindex(scrollindex+1);
            tempVal=scrollindex+1;
        }
        else if(endY-startY <-100 && scrollindex==totalnum-1){ //拉到底的时候，再拉便向服务器发送请求，导入新的招聘信息
            getMoreRecruitInfor();
        }
        setFullPageStyle(`transform:translateY(${-tempVal*100}%);margin-top: ${margintop}px`);
        setStartY(0);
        setEndY(0);
        setMargintop(0);
        setFullPageStyle(`transform:translateY(${-tempVal*100}%);margin-top: ${margintop}px`);
    };

    function toPersonalPage(){
        Taro.navigateTo({url:"../stuHome/stuHome"});
    }
    return (
    <View className="container-fill">
        <View className="scroll-fullpage" onTouchStart={scrollTouchstart} onTouchMove={scrollTouchmove} onTouchEnd={scrollTouchend} style={fullPageStyle}>
            {
                totalnum===0 && <View className="notice">————目前还没有招聘信息哦————</View>
            }
            {
                recruitInforArray.map((item)=>(
                        <FullPage recruitInfo={item} />
                ))
            }
  
        </View>
        <View className="home_mine">
            <View className="home"><Button className="button1" style={btn1Style}>首页</Button></View>
            <View className="mine"><Button className="button2" onClick={toPersonalPage} style={btn2Style}>我的</Button></View>
        </View>
    </View>
    )
}
//每条招聘信息占一个页面，在这里将招聘信息写成组件
function FullPage(props){
    const [likeBtnStyle1,setLikeBtn1]=useState("display:none;");
    const [likeBtnStyle2,setLikeBtn2]=useState("display:block;");
    useEffect(()=>{
        Taro.request({
            url:"http://127.0.0.1:8008/hasLiked",
            data:{
                openid:stuInfo.openid,
                recruitInforId:props.recruitInfo.id,
            },
            success(res){
                if(res.data==="YES")
                {
                    setLikeBtn1("display:block;");
                    setLikeBtn2("display:none;");
                }
                else if(res.data==="NO")
                {
                    setLikeBtn2("display:block;");
                    setLikeBtn1("display:none;");
                }
            }
        })
    },[])
    function handleLikeBtn(event){
        let recruitInforId=event.currentTarget.dataset.id;
        // console.log(recruitInforId); //调试用
        if(likeBtnStyle1==="display:none;")//原先未点赞，按钮变红
        {
            Taro.request({
                url:"http://127.0.0.1:8008/likeRecruitInfor",
                data:{
                    openid:stuInfo.openid,
                    recruitInforId:recruitInforId,
                }
            })
            setLikeBtn1("display:block;");
            setLikeBtn2("display:none;");
        }
        else{  //原先已经点赞，取消点赞
            Taro.request({
                url:"http://127.0.0.1:8008/unlikeRecruitInfor",
                data:{
                    openid:stuInfo.openid,
                    recruitInforId:recruitInforId,
                }
            })
            setLikeBtn2("display:block;");
            setLikeBtn1("display:none;");
        }
    }
    return(
        <View className="section">
            <View className="container">
                <View className="occupation_salary">
                    <View className="occupation">{props.recruitInfo.job}</View>
                    <View className="salary">{props.recruitInfo.salary}</View>
                </View>

                <View className="requirement">
                    <View className="head">职位要求</View>
                    <View>{props.recruitInfo.eduRequired} {props.recruitInfo.workExp} {props.recruitInfo.jobType} {props.recruitInfo.ageRequired} 性别要求:{props.recruitInfo.gender}</View>
                </View>


                <View className="introduction">
                    <View className="head">职位详情</View>
                    <View className="content">{props.recruitInfo.jobIntro}</View>
                </View>

                <View className="welfare">
                    <View className="head">员工福利</View>
                    {
                        props.recruitInfo.jobAdvantage.split(',').map(item=>(
                            <View className="item">{item}</View>
                        ))
                    }
                </View>
                
                <View className="contact">
                    <View className="head">联系方式</View>
                    <View className="content">{props.recruitInfo.region} {props.recruitInfo.enterpriseName} 电话: {props.recruitInfo.telephone}</View>
                </View>
                <View className="promote">
                        <View className="head">宣传图片</View>
                        <Image className="promotePhoto" src={props.recruitInfo.promotePhoto}></Image>
                        <Image className="like" src={redLove} style={likeBtnStyle1} onClick={handleLikeBtn} data-id={props.recruitInfo.id}/>
                        <Image className="like" src={blackLove} style={likeBtnStyle2} onClick={handleLikeBtn} data-id={props.recruitInfo.id}/>
                </View>
            </View>
        </View>
    )
}
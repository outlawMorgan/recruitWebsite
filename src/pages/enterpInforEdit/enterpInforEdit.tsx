import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { View, Label,Input, Button, Picker, Textarea, Image } from '@tarojs/components'
import './enterpInforEdit.scss'
import {userInfo} from "../sharedDataModule"


export default function EnterpInforEdit(){
    let user={
        region:"",
        enterpriseName:"",
        industryType:"",
        enterpriseType:"",
        numOfStuff:"",
        chargeMan:"",
        telephone:"",
        address:"",
        introduction:"",
        logoImageLink:""
    }; //保存此页面中所有企业信息的对象

    const [region, setRegion]=useState("");
    const[enterpriseName, setEnterpriseName]=useState("");
    const[industryType, setIndustryType]=useState("");
    const[enterpriseType, setEnterpriseType]=useState("");  //滚动选择器
    const[numOfStuff, setNumOfStuff]=useState("");  //滚动选择器
    const[chargeMan, setChargeMan]=useState("");
    const[telephone, setTelephone]=useState("");
    const[address, setAddress]=useState("");
    const[introduction, setIntroduction]=useState("");
    const[logoImageLink, setLogoImageLink]=useState("");

    const [stuffIndex, setStuffIndex]=useState(0); //人员规模
    const stuffData=["10人以下","10~100人","100~1000人","1000人以上"];

    const [enterpIndex, setEnterpIndex]=useState(0);  //企业性质
    const enterpData=['国有企业','集体所有制企业','私营企业','股份制企业','有限合伙企业','联营企业','外商投资企业','个人独资企业'];

    function enterpTypeSelector(event){ //设置企业类型的选择器
        setEnterpIndex(event.detail.value);
        setEnterpriseType(enterpData[event.detail.value]);
    }

    function numOfStuffSelector(event){ //设置人员规模的选择器
        setStuffIndex(event.detail.value);
        setNumOfStuff(stuffData[event.detail.value]);
    }

    useEffect(()=>{
        const p=new Promise((resolve,reject)=>{
            Taro.request({
                url:"http://127.0.0.1:8008/getEnterpInfor",
                method:"GET",
                data:{
                    username: userInfo.username
                },
                success(result){
                    user=result.data;
                    resolve("ok");
                },
                fail(res){
                    reject(res);
                }
            })   
        });
        p.then((value)=>{
            setRegion(user.region);
            setEnterpriseName(user.enterpriseName);
            setIndustryType(user.industryType);
            setEnterpriseType(user.enterpriseType); 
            setNumOfStuff(user.numOfStuff); 
            setChargeMan(user.chargeMan);
            setTelephone(user.telephone);
            setAddress(user.address);
            setIntroduction(user.introduction);
            setLogoImageLink(user.logoImageLink);
        },reason=>console.log(reason));
    },[])

    function getLocationBtn(){
        Taro.chooseLocation({
          success(res){
            setAddress(res.address)
          },
          fail(){
            Taro.getSetting({
              success(res){
                let status=res.authSetting;
                console.log(status["scope.userLocation"]);
                if(!status["scope.userLocation"]){//若用户尚未设置授权地理位置权限
                  Taro.showModal({
                    title:"是否授权当前位置",
                    content:"需要获取您的地理位置, 请确认授权，否则将无法使用地图功能",
                    success:function(tip){
                      if(tip.confirm)
                        Taro.openSetting({
                          success:function(data){
                            if(data.authSetting["scope.userLocation"]===true)//若用户愿意授权
                            {
                              Taro.showToast({  //发送toast框，授权成功
                                title: '授权成功',
                                icon:"success",
                                duration:1500,
                              });
                              Taro.chooseLocation({ //使用wx.chooseLocation接口调用地图功能
                                success:function(res){
                                  setAddress(res.address);
                                }
                              })
                            }
                          }
                        })
                        else{
                          Taro.showToast({  //若用户不愿授权，toast框显示授权失败
                            title: '未授权位置权限',
                            icon:"none",
                            duration:1500,
                        });
                        }   
                    }
                  })
                }
              }
            })
          }
        })
      }
    function getLogo(){
        Taro.chooseImage({
            count: 1, // 最多可以选择的图片张数，这里设置成一张
            sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
            sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success(res){
            // success
            // console.log(res);
            setLogoImageLink(res.tempFilePaths[0]);  //设置logo照片的路径
            }
        })
    }
    
    function saveInforBtn(){
        Taro.request({
            url:"http://127.0.0.1:8008/editEnterpInfor",
            method:"GET",
            data:{
                region: region,
                enterpriseName: enterpriseName,
                industryType: industryType,
                enterpriseType: enterpriseType,
                numOfStuff: numOfStuff,
                chargeMan: chargeMan,
                telephone: telephone,
                address: address,
                introduction: introduction,
                logoImageLink: logoImageLink,
                username: userInfo.username
            },
            success(result){
                // console.log(result.data);//调试用
                Taro.showToast({
                    title:"保存成功",
                    icon:"success",
                    duration:1000,
                });
                setTimeout(()=>Taro.navigateBack({}),1000);
            }
        })   
    }
    return(
        <View className="wrapper">
            <View className="head">
                <View>企业信息</View>
            </View>

            <View className="line">
                <Label className="label">所处地区</Label>
                <Input type="text" className="inputbox" placeholder="请输入地区" onInput={input=>setRegion(input.detail.value)} value={region}></Input>
            </View>

            <View className="line">
                <Label className="label">企业名称</Label>
                <Input type="text" className="inputbox" placeholder="请输入企业名称" onInput={input=>setEnterpriseName(input.detail.value)} value={enterpriseName}></Input>
            </View>

            <View className="line">
                <Label className="label">企业行业</Label>
                <Input type="text" className="inputbox" placeholder="请输入企业行业" onInput={input=>setIndustryType(input.detail.value)} value={industryType}></Input>
            </View>

            <View className="line">
                <Label className="label">企业性质</Label>
                <Picker className="inputbox" onChange={enterpTypeSelector} value={enterpIndex} range={enterpData}>{enterpriseType}</Picker>
            </View>

            <View className="line">
                <Label className="label">人员规模</Label>
                <Picker className="inputbox" onChange={numOfStuffSelector} value={stuffIndex} range={stuffData}>{numOfStuff}</Picker>  
            </View>

            <View className="line">
                <Label className="label">负责人</Label>
                <Input type="text" className="inputbox" placeholder="请输入负责人" onInput={input=>setChargeMan(input.detail.value)} value={chargeMan}></Input>
            </View>

            <View className="line">
                <Label className="label">电话</Label>
                <Input type="text" className="inputbox" placeholder="请输入电话" onInput={input=>setTelephone(input.detail.value)} value={telephone}></Input>
            </View>


            <View className="line">
                <Label className="label">地址</Label>
                <Input type="text" className="inputbox" placeholder="请输入地址" onInput={input=>setAddress(input.detail.value)} value={address}></Input>
                <Button className="location" style="width:120px" onClick={getLocationBtn}>获取位置</Button>
            </View>

            <View className="head">
                <View>公司介绍</View>
            </View>
            <View className="textarea">
                <Textarea  placeholder="请填写公司介绍" onInput={input=>setIntroduction(input.detail.value)} value={introduction}></Textarea>
            </View>

            <View className="head">
                <View>企业LOGO（单击图片更换）</View>
            </View>
            <View className="imageContainer">
                <Image className="imageStyle" src={logoImageLink} onClick={getLogo}></Image>
            </View>

            <View className="register">
                <Button className="registerbutton" style="width:100%" onClick={saveInforBtn}>保存企业信息</Button>
          </View>
        </View>
    )
}
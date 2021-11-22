import Taro, { onLocalServiceResolveFail } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { View, Label, Input, Checkbox,CheckboxGroup, Radio, RadioGroup, Textarea, Button, Image, Picker} from '@tarojs/components'
import './recruitInforEdit.scss'
import {recruitInfo, resetRecruitInfor} from "../sharedDataModule"

export default function RecruitInforEdit(){

    // useEffect(()=>{
    //     console.log(recruitInfo);//调试用
    // },[])
    const [job, setJob]=useState(recruitInfo.job);
    const [salary, setSalary]=useState(recruitInfo.salary);
    const [numOfRecruit, setNumOfRecruit]=useState(recruitInfo.numOfRecruit);
    const [eduRequired, setEduRequired]=useState(recruitInfo.eduRequired);
    const [workExp, setWorkExp]=useState(recruitInfo.workExp);
    const [jobType, setJobType]=useState(recruitInfo.jobType);
    const [ageRequired, setAgeRequired]=useState(recruitInfo.ageRequired);
    const [gender, setGender]=useState(recruitInfo.gender);

    const [jobIntro,setjobIntro]=useState(recruitInfo.jobIntro);
    const [promotePhoto, setPromotePhoto]=useState(recruitInfo.promotePhoto);

    //滚动选择器设置
    const [eduIndex,setEduIndex]=useState(0);
    const eduData=["初中","高中","中专","中技","大专"];

    const [expIndex, setExpIndex]=useState(0);
    const expData=["无经验","1年以下","1~3年","3~5年","5年以上"];

    const  [jobTypeIndex, setJobTypeIndex]=useState(0);
    const jobTypeData=['全职','兼职','实习'];

    //radio选项设置
    const [genderChosen1,setGenderChosen1]=useState(false);
    const [genderChosen2,setGenderChosen2]=useState(false);
    const [genderChosen3,setGenderChosen3]=useState(true);

    //checkbox选项设置
    const [indexSet, toggleIndexSet]=useState(new Set());
    
    const JobAdvantageData=["五险","五险一金","补充医疗保险","加班补贴","交通补贴","包食宿","餐饮补贴","定期体检","年终奖金","职位晋升","员工旅游","节日福利","调休","双休","年假"];

    function eduSelector(e){
        setEduIndex(e.detail.value);
        setEduRequired(eduData[e.detail.value]);
    }

    function expSelector(e){
        setExpIndex(e.detail.value);
        setWorkExp(expData[e.detail.value]);
    }

    function jobTypeSelector(e){
        setJobTypeIndex(e.detail.value);
        setJobType(jobTypeData[e.detail.value]);
    }

    function handleSetGender(event){
        let chooseId = event.currentTarget.dataset.id;
        if(chooseId==0)
        {
          setGenderChosen1(true);
          setGenderChosen2(false);
          setGenderChosen3(false);
          setGender("男");
        }
        else if(chooseId==1)
        {
          setGenderChosen1(false);
          setGenderChosen2(true);
          setGenderChosen3(false);
          setGender("女");
        }
        else if(chooseId==2){
          setGenderChosen1(false);
          setGenderChosen2(false);
          setGenderChosen3(true);
          setGender("不限");
        }
    }
    function handleCheckBox(event){
        let chooseId=event.currentTarget.dataset.id;
        let indexSetClone=indexSet;
        if(!indexSet.has(chooseId))
            indexSet.add(chooseId);
        else
            indexSet.delete(chooseId);
        toggleIndexSet(indexSetClone);
    }
    function getLogo(){
        Taro.chooseImage({
            count: 1, // 最多可以选择的图片张数，这里设置成一张
            sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
            sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
            success(res){
            // success
            // console.log(res);
            setPromotePhoto(res.tempFilePaths[0]);  //设置logo照片的路径
            }
        })
    }
    function alterRecruitInfor(){
        let flag=true;
        if(job==="")
            flag=false;
        else if(salary==="")
            flag=false;
        else if(numOfRecruit==="")
            flag=false;
        else if(ageRequired==="")
            flag=false;
        else if(jobIntro==="")
            flag=false;
        else
            flag=true;
        if(!flag) //信息未填写完整
            Taro.showToast({
                title:"必要信息不能为空",
                icon:"none",
                duration:2000
            })
            
        else{ //信息填写完整，发送招聘信息
            //发送请求之前先处理`职位优势`这一个特殊变量
            let jobAdvanArray=new Array();
            for(let i of indexSet)
                jobAdvanArray.push(JobAdvantageData[i]);  //这里是因为Set未指定类型，所以报错；实际不影响编译
            // console.log([...jobAdvanArray].toString());  //调试用
            let tempString="";
            tempString=[...jobAdvanArray].toString();

            const p=new Promise((resolve,reject)=>{
                Taro.request({
                    url:"http://127.0.0.1:8008/alterRecruitInfor",
                    method:"GET",
                    data:{
                        job:job,
                        salary:salary,
                        numOfRecruit:numOfRecruit,
                        eduRequired:eduRequired,
                        workExp:workExp,
                        jobType:jobType,
                        ageRequired:ageRequired,
                        gender:gender,
                        jobAdvantage:tempString,
                        jobInto:jobIntro,
                        promotePhoto:promotePhoto,
                        id:recruitInfo.id,
                    },
                    success(res){
                        if(res.data==="success")
                        {
                            Taro.showToast({
                                title:"编辑成功",
                                icon:"success",
                                duration:1500
                            });
                            setTimeout(()=>resolve("ok"),1500);
                        }
                        else{
                            Taro.showToast({
                                title:"服务器繁忙，请稍后再试",
                                icon:"none",
                                duration:2000
                            });
                            setTimeout(()=>reject(),2000);
                        } 
                    },
                    fail(){
                        Taro.showToast({
                            title:"服务器繁忙，请稍后再试",
                            icon:"none",
                            duration:2000
                        });
                        setTimeout(()=>reject(),2000);
                    }
                });
            });
            p.then(()=>{
                Taro.navigateBack({})
            },()=>{})
        }
    }

    return(
        <View className="wrapper">
        <View className="head">
            <View>基本信息(必填)</View>
        </View>

        <View className="line">
            <Label className="label">工作职位</Label>
            <Input type="text" className="inputbox" placeholder="请输入职位名称" onInput={input=>{setJob(input.detail.value)}} value={job}/>
        </View>

        <View className="line">
            <Label className="label">薪资待遇</Label>
            <Input type="text" className="inputbox" placeholder="请输入薪资待遇" onInput={input=>{setSalary(input.detail.value)}} value={salary}/>
        </View>

        <View className="line">
            <Label className="label">招聘人数</Label>
            <Input type="text" className="inputbox" placeholder="请输入招聘人数" onInput={input=>{setNumOfRecruit(input.detail.value)}} value={numOfRecruit}/>
        </View>

        <View className="line">
            <Label className="label">学历要求</Label>
            <Picker className="inputbox" value={eduIndex} range={eduData} onChange={eduSelector}>{eduRequired}</Picker>
        </View>

        <View className="line">
            <Label className="label">工作经验</Label>
            <Picker className="inputbox" value={expIndex} range={expData} onChange={expSelector}>{workExp}</Picker>
        </View>

        <View className="line">
            <Label className="label">工作性质</Label>
            <Picker className="inputbox" value={jobTypeIndex} range={jobTypeData} onChange={jobTypeSelector}>{jobType}</Picker> 
        </View>

        <View className="line">
            <Label className="label">年龄要求</Label>
            <Input type="text" className="inputbox" placeholder="请输入年龄要求" onInput={input=>{setAgeRequired(input.detail.value)}} value={ageRequired}/>
        </View>

        <View className="line">
        <Label className="label">性别要求</Label>
        <RadioGroup className="sex" >
            <Radio color="green" value="male"  className="radio" data-id={0} checked={genderChosen1} onClick={handleSetGender}>男</Radio>
            <Radio color="green" value="female" className="radio" data-id={1} checked={genderChosen2} onClick={handleSetGender}>女</Radio>
            <Radio color="green" value="all" className="radio" data-id={2} checked={genderChosen3} onClick={handleSetGender}>不限</Radio>
        </RadioGroup>
        </View>

        <View className="head">
        <View>职位优势(选填)</View>
        </View>

        <View className="mul-welfare">
            <CheckboxGroup className="column">
                <Checkbox color="green" value="welfare" className="option" data-id={0} onClick={handleCheckBox} >五险</Checkbox>
                <Checkbox color="green" value="welfare" className="option" data-id={1} onClick={handleCheckBox} >五险一金</Checkbox>
                <Checkbox color="green" value="welfare" className="option" data-id={2} onClick={handleCheckBox} >补充医疗保险</Checkbox>
                <Checkbox color="green" value="welfare" className="option" data-id={3} onClick={handleCheckBox} >加班补贴</Checkbox>
                <Checkbox color="green" value="welfare" className="option" data-id={4} onClick={handleCheckBox} >交通补贴</Checkbox>
            </CheckboxGroup>

            <CheckboxGroup className="column">
                <Checkbox color="green" value="welfare" className="option" data-id={5} onClick={handleCheckBox}>包食宿</Checkbox>
                <Checkbox color="green" value="welfare" className="option" data-id={6} onClick={handleCheckBox}>餐饮补贴</Checkbox>
                <Checkbox color="green" value="welfare" className="option" data-id={7} onClick={handleCheckBox}>定期体检</Checkbox>
                <Checkbox color="green" value="welfare" className="option" data-id={8} onClick={handleCheckBox}>年终奖金</Checkbox>
                <Checkbox color="green" value="welfare" className="option" data-id={9} onClick={handleCheckBox}>职位晋升</Checkbox>
            </CheckboxGroup>

            <CheckboxGroup className="column">
                <Checkbox color="green" value="welfare" className="option" data-id={10} onClick={handleCheckBox}>员工旅游</Checkbox>
                <Checkbox color="green" value="welfare" className="option" data-id={11} onClick={handleCheckBox}>节日福利</Checkbox>
                <Checkbox color="green" value="welfare" className="option" data-id={12} onClick={handleCheckBox}>调休</Checkbox>
                <Checkbox color="green" value="welfare" className="option" data-id={13} onClick={handleCheckBox}>双休</Checkbox>
                <Checkbox color="green" value="welfare" className="option" data-id={14} onClick={handleCheckBox}>年假</Checkbox>
            </CheckboxGroup>
            
        </View>

        <View className="head">
            <View>职位描述(必填)</View>
        </View>

        <View className="textarea">
            <Textarea className="description" maxlength={200} placeholder="请填写职位描述, 两百字以内" onInput={input=>{setjobIntro(input.detail.value)}} value={jobIntro}></Textarea>
        </View>

        <View className="head">
            <View>岗位宣传图片(选填)</View>
        </View>

        <View className="imageContainer">
            <Image className="imageStyle" src={promotePhoto} onClick={getLogo}></Image>
        </View>

        <View className="head"></View>

        <View className="register">
            <Button className="registerbutton" style="width:100%" onClick={alterRecruitInfor}>发布职位</Button>
        </View>
    </View>
    )
}
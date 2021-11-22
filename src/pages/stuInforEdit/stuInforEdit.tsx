import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { View, Form, Label, Input, Radio, Picker, Button, Textarea, Image} from '@tarojs/components'
import './stuInforEdit.scss'
import defaultImg from "../../img/defaultImg.jpg"
import {stuInfo} from "../sharedDataModule"

export default function EmployeeCV(){

  const[job,setJob]=useState("");
  const[name,setName]=useState("");
  const[gender,setGender]=useState("男");
  const[birthYear,setBirthYear]=useState("请选择出生年份");
  const[education,setEducation]=useState("请选择最高学历");
  const[experience,setExperience]=useState("请选择工作经验");
  const[address,setAddress]=useState("");
  const[email,setEmail]=useState("");
  const[phoneNum,setPhoneNum]=useState("");
  const[condition,setCondition]=useState("请选择目前工作状态");
  const[jobType,setJobType]=useState("请选择工作性质");
  const[expectedJob,setExpectedJob]=useState("请选择期望行业");
  const[expectedSalary,setExpectedSalary]=useState("请选择期望工资");
  const[workRegion,setWorkRegion]=useState("请选择工作地区");
  const[selfIntroduction,setSelfIntro]=useState("");
  const[portrait,setPortrait]=useState(defaultImg);

  let tempObj={
    job:"",
    name:"",
    gender:"",
    birthYear:"",
    education:"",
    experience:"",
    address:"",
    email:"",
    phoneNum:"",
    condition:"",
    jobType:"",
    expectedJob:"",
    expectedSalary:"",
    workRegion:"",
    selfIntroduction:"",
    portrait:""
  }

  useEffect(()=>{
    if(stuInfo.openid!="")
    {
      const retriveRecord=new Promise((resolve,reject)=>{
      Taro.request({
        url:"http://127.0.0.1:8008/getEmployeeInfor",
        data:{
          openid:stuInfo.openid
        },
        success(res){
          if(res.data.job){
            tempObj=res.data;
            // console.log(tempObj)//调试用
            resolve("ok");
          }
          else 
            reject();
        },
        fail(){
          reject();
        }
      })
    })

    retriveRecord.then(()=>{
      setJob(tempObj.job);
      setName(tempObj.name);
      setGender(tempObj.gender);
      setBirthYear(tempObj.birthYear);
      setEducation(tempObj.education);
      setExperience(tempObj.experience);
      setAddress(tempObj.address);
      setEmail(tempObj.email);
      setPhoneNum(tempObj.phoneNum);
      setCondition(tempObj.condition);
      setJobType(tempObj.jobType);
      setExpectedJob(tempObj.expectedJob);
      setExpectedSalary(tempObj.expectedSalary);
      setWorkRegion(tempObj.workRegion);
      setSelfIntro(tempObj.selfIntroduction);
      setPortrait(tempObj.portrait);
    },()=>{      
      Taro.showToast({
        title:"服务器繁忙，请稍后再试",
        icon: "none",
        duration: 1500
      })
    });
  }
  },[]);

  //radio单项选择器
  const [genderChosen1,setGenderChosen1]=useState(true);
  const [genderChosen2,setGenderChosen2]=useState(false);

  //滚动选择器
  const [birthYearIndex, setBirthYearIndex]=useState(0);
  const birthYearData=["2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", "2006", "2005", "2004", "2003", "2002", "2001", "2000", "1999", "1998", "1997", "1996", "1995", "1994", "1993", "1992", "1991", "1990", "1989", "1988", "1987", "1986", "1985", "1984", "1983", "1982", "1981", "1980", "1979", "1978", "1977", "1976", "1975", "1974", "1973", "1972", "1971", "1970", "1969", "1968", "1967", "1966", "1965", "1964", "1963", "1962", "1961", "1960", "1959", "1958", "1957"];
  
  const [educationIndex, setEducationIndex]=useState(0);
  const educationData=["初中","高中","中专","中技","大专"];

  const [experienceIndex,setExperienceIndex]=useState(0);
  const experienceData=["无经验","1年以下","1~3年","3~5年","5年以上"];


  const [conditionIndex,setConditionIndex]=useState(0);//目前状况选择
  const conditionData=["应届生","离职，正在待业中","在职，想要更好的工作","在职，暂无跳槽打算"];

  const [jobTypeIndex,setJobTypeIndex]=useState(0);
  const jobTypeData=["全职","在职","兼职"];

  const [expectedJobIndex,setExpectedJobIndex]=useState(0);
  const expectedJobData=['房地产业','制造业','建筑业','批发和零售业','住宿和餐饮业','其它服务业'];

  const [expectedSalaryIndex,setExpectedSalaryIndex]=useState(0);
  const expectedSalaryData=["2000元以下/月","2000~3500元/月","3500~5000元/月","5000元以上/月"];

  const [workRegionIndex,setWorkRegionIndex]=useState(0);
  const workRegionData=["广州","深圳","东莞","中山","佛山"];


  function handleSetGender(event){
    let chooseId = event.currentTarget.dataset.id;
    if(chooseId==0)
    {
      setGenderChosen1(true);
      setGenderChosen2(false);
      setGender("男");
    }
    else if(chooseId==1)
    {
      setGenderChosen1(false);
      setGenderChosen2(true);
      setGender("女");
    }
  }

  function handleSetBirthYear(event){
    setBirthYearIndex(event.detail.value);
    setBirthYear(birthYearData[event.detail.value]);
  }

  function handleSetEducation(event){
    setEducationIndex(event.detail.value);
    setEducation(educationData[event.detail.value]);
  }

  function handleSetExperience(event){
    setExperienceIndex(event.detail.value);
    setExperience(experienceData[event.detail.value]);
  }

  function handleSetCondition(event){
    setConditionIndex(event.detail.value);
    setCondition(conditionData[event.detail.value]);
  }

  function handleSetJobType(event){
    setJobTypeIndex(event.detail.value);
    setJobType(jobTypeData[event.detail.value]);
  }

  function handleSetExpectedJob(event){
    setExpectedJobIndex(event.detail.value);
    setExpectedJob(expectedJobData[event.detail.value]);
  }

  function handleSetExpectedSalary(event){
    setExpectedSalaryIndex(event.detail.value);
    setExpectedSalary(expectedSalaryData[event.detail.value]);
  }

  function handleSetWorkRegion(event){
    setWorkRegionIndex(event.detail.value);
    setWorkRegion(workRegionData[event.detail.value]);
  }

  function handleGetAvatar(){
    Taro.chooseImage({
      count: 1, 
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'], 
      success(res){
        // success
        // console.log(res);//调试用
        setPortrait(res.tempFilePaths[0])
      }
    })
  }
  function saveResumeBtn(){
    let phoneReg=/^1[3|4|5|8][0-9]\d{4,8}$/;
    if(!phoneReg.test(phoneNum))
    {
      Taro.showToast({
        title: '请输入正确的手机号',
        icon:"none",
        duration: 1500
      })
      return;
    }
    let emailReg=/^[A-Za-zd0-9]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
    if(!emailReg.test(email))
    {
      Taro.showToast({
        title:"请输入正确的邮箱",
        icon:"none",
        duration:2000
      })
      return;
    }
    let flag=true;
    if(job==="" || name==="" || address==="" || email==="" || phoneNum==="")
      flag=false;
    else if(birthYear==="请选择出生年份")
      flag=false;
    else if(education==="请选择最高学历")
      flag=false;
    else if(experience==="请选择工作经历")
      flag=false
    // else if(condition==="请选择目前工作状态") 
    //   flag=false
    // else if(jobType==="请选择工作性质")
    //   flag=false
    // else if(expectedJob==="请选择期望行业")
    //   flag=false
    // else if(expectedSalary==="请选择期望工资")
    //   flag=false
    // else if(workRegion==="请选择工作地区")
    //   flag=false

    if(flag===false)
    {
      Taro.showToast({
        title: '必要信息不能为空',
        icon:'none',
        duration:1500
      });
      return;
    }
    else{
      console.log("输入合法!");
      //在这里写入保存用户信息到数据库的Taro.request操作
      if(stuInfo.openid==="")
      {
        Taro.showToast({
          title:"服务器繁忙，请稍后再试",
          icon: "none",
          duration: 1500
        });
        return;
      }
      else{
        console.log(portrait);
        Taro.request({
          url:"http://127.0.0.1:8008/saveEmployeeCV",
          data:{
            job:job,
            name:name,
            gender:gender,
            birthYear:birthYear,
            education:education,
            experience:experience,
            address:address,
            email:email,
            phoneNum:phoneNum,
            condition:condition,
            jobType:jobType,
            expectedJob:expectedJob,
            expectedSalary:expectedSalary,
            workRegion:workRegion,
            selfIntroduction:selfIntroduction,
            portrait:portrait,
            openid:stuInfo.openid
          },
          success(){
            Taro.showToast({
              title: '简历保存成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(()=>Taro.navigateBack({}),1000);
          }
        })
      }
    }
  }

  return (
    <Form>
      <View className="head">
        <View>个人基本信息(必填)</View>
      </View>
      <View className="line">
        <Label className='label'>意向职位</Label>
        <Input type="text" className="inputbox" placeholder="请输入意向职位" value={job} onInput={input=>setJob(input.detail.value)} />
      </View>
      
      <View className="line">
        <Label className='label'>姓名</Label>
        <Input type="text" className="inputbox" placeholder="请输入姓名" value={name} onInput={input=>setName(input.detail.value)} />
      </View>
      
      <View className="line">
        <Label className='label'>性别</Label>
        <View className="sex">
          <Radio color="green" value="male" data-id="0" checked={genderChosen1} onClick={handleSetGender}>男</Radio>
          <Radio color="green" value="female" data-id="1" checked={genderChosen2} onClick={handleSetGender}>女</Radio>
        </View>
      </View>
    
      <View className="line">
        <Label className="label">出生年份</Label>
        <Picker className="inputbox" onChange={handleSetBirthYear} value={birthYearIndex} range={birthYearData}>{birthYear}</Picker>
      </View>

      <View className="line">
        <Label className="label">最高学历</Label>
        <Picker className="inputbox" onChange={handleSetEducation} value={educationIndex} range={educationData}>{education}</Picker>
      </View>

      <View className="line">
        <Label className="label">工作经验</Label>
        <Picker className="inputbox" onChange={handleSetExperience} value={experienceIndex} range={experienceData}>{experience}</Picker>
      </View>

      <View className="line">
        <Label className="label">现居住地</Label>
        <Input type="text" className="inputbox" placeholder="请输入现居住地" value={address} onInput={input=>setAddress(input.detail.value)} />
      </View>

      <View className="line">
        <Label className="label">邮箱</Label>
        <Input type="text" className="inputbox" placeholder="请输入邮箱" value={email} onInput={input=>setEmail(input.detail.value)} />
      </View>

      <View className="line">
        <Label className="label">手机号码</Label>
        <Input type="text" className="inputbox" placeholder="请输入手机号码" value={phoneNum} onInput={input=>setPhoneNum(input.detail.value)} />
      </View>

      <View className="head">
        <View>个人详情信息(选填)</View>
      </View>

      <View className="line">
        <Label className="label">目前状况</Label>
        <Picker className="inputbox" onChange={handleSetCondition} value={conditionIndex} range={conditionData}>{condition}</Picker>
      </View>

      <View className="line">
        <Label className="label">工作性质</Label>
        <Picker className="inputbox" onChange={handleSetJobType} value={jobTypeIndex} range={jobTypeData}>{jobType}</Picker>
      </View>

      <View className="line">
        <Label className="label">期望行业</Label>
        <Picker className="inputbox" onChange={handleSetExpectedJob} value={expectedJobIndex} range={expectedJobData}>{expectedJob}</Picker>
      </View>

      <View className="line">
        <Label className="label">期望薪酬</Label>
        <Picker className="inputbox" onChange={handleSetExpectedSalary} value={expectedSalaryIndex} range={expectedSalaryData}>{expectedSalary}</Picker>
      </View>

      <View className="line">
        <Label className="label">工作地区</Label>
        <Picker className="inputbox" onChange={handleSetWorkRegion} value={workRegionIndex} range={workRegionData}>{workRegion}</Picker>
      </View>
    
      <View className="head">
        <View>自我介绍及工作经历(选填)</View>
      </View>

      <View className="textarea">
        <Textarea maxlength={2000} placeholder="请填写自我介绍及工作经历" onInput={input=>setSelfIntro(input.detail.value)} value={selfIntroduction} ></Textarea>
      </View>

      <View className="head">
        <View>个人形象(选填)</View>
      </View>

      <View className="imageContainer">
        <Image className="imageStyle" src={portrait} onClick={handleGetAvatar}/>
      </View>
       
      <View className="register">
        <Button className="registerbutton" style="width:100%" onClick={saveResumeBtn}>保存简历</Button>
      </View>
    </Form>
  )
}
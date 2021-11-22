//此typescript文件用于对外输出需要在页面间传递的数据，多为数据库中的主键
import defaultImg from "../img/defaultImg.jpg"

//1. 企业用户信息
let userInfo={
    username:"",
    phoneNum:"",
};
function setUsername(username){
    userInfo.username=username;
}
function setUserPhoneNum(phoneNum){
    userInfo.phoneNum=phoneNum;
}
//2. 企业招聘信息
let recruitInfo={
    id:"",
    job:"",
    salary:"",
    numOfRecruit:"",
    eduRequired:"",
    workExp:"",
    jobType:"",
    ageRequired:"",
    gender:"",
    jobAdvantage:"",
    jobIntro:"",
    promotePhoto:defaultImg
}
function setRecruitId(id){
    recruitInfo.id=id;
}
function setRecruitInfor(job,salary,numOfRecruit,eduRequired,workExp,jobType,ageRequired,gender,jobAdvantage,jobIntro,promotePhoto){
    recruitInfo.job=job;
    recruitInfo.salary=salary;
    recruitInfo.numOfRecruit=numOfRecruit;
    recruitInfo.eduRequired=eduRequired;
    recruitInfo.workExp=workExp;
    recruitInfo.jobType=jobType;
    recruitInfo.ageRequired=ageRequired;
    recruitInfo.gender=gender;
    recruitInfo.jobAdvantage=jobAdvantage;
    recruitInfo.jobIntro=jobIntro;
    recruitInfo.promotePhoto=promotePhoto;
}
function resetRecruitInfor(){
    recruitInfo.id="",
    recruitInfo.job="",
    recruitInfo.salary="",
    recruitInfo.numOfRecruit="",
    recruitInfo.eduRequired="",
    recruitInfo.workExp="",
    recruitInfo.jobType="",
    recruitInfo.ageRequired="",
    recruitInfo.gender="",
    recruitInfo.jobAdvantage="",
    recruitInfo.jobIntro="",
    recruitInfo.promotePhoto=defaultImg
}

//3. 学生用户信息
let stuInfo={
    openid:"",
    portrait:"",
}
function setStuOpenid(openid){
    stuInfo.openid=openid;
}
export {setUsername, setUserPhoneNum, userInfo, recruitInfo, setRecruitId, setRecruitInfor, resetRecruitInfor, stuInfo, setStuOpenid};
//wxProgramServer.js

//此处是与本地的数据库连接，老师和师兄预览的时候需要改一下下方的密码和数据库名
const mysql = require("mysql");
const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"123456",
    database:"db_test"
});
connection.connect();//与mysql进行连接

// connection.query("SELECT COUNT(*) AS sum FROM enterprise",(err,res)=>{   //调试用的代码
//     if(err)
//         console("检索错误");
//     else
//         console.log(res[0].sum);
// });

//服务器路由设置
const express=require("express");
const app=express();
const requestOuter=require("request");
const url=require("url");
const e = require("express");
const { UV_FS_O_FILEMAP } = require("constants");

/**
 * 学生端后台路由：
 * 共_个 
 * */

app.all("/api/getWxCode", function(req,res){   //处理学生修改或创建简历的路由（employeeCV.tsx中使用）
    res.setHeader("Access-Control-Allow-Origin","*"); 
    var params=url.parse(req.url,true).query;
    var code=params.code;
    // console.log(code); //调试用
    const urlStr='https://api.weixin.qq.com/sns/jscode2session?appid=wx3fb0b8ac0177de58&secret=7756fc7fb94a03b44fa5d7a27b9e62a2&js_code=' + code + '&grant_type=authorization_code';
    requestOuter(urlStr, function(error, response, body){
        if (!error && response.statusCode == 200) {
            var jsBody = JSON.parse(body); 
            jsBody.status = 100;
            jsBody.msg = '操作成功';
            res.send(JSON.stringify(jsBody));
        }
    })
    //https://api.weixin.qq.com/sns/jscode2session?appid=wx3fb0b8ac0177de58&secret=7756fc7fb94a03b44fa5d7a27b9e62a2&js_code= ??? &grant_type=authorization_code //调试用
})

app.all("/getStuAvatarName",function(request,response){    //根据传递的账户名，获取数据库中的头像链接和企业名（enterpHome.tsx文件使用）
    response.setHeader("Access-Control-Allow-Origin","*"); 
    var params=url.parse(request.url,true).query;
    const selectSql="SELECT portrait, name from employee where openid=? and 1 = 1";
    var selectParams=[params.openid];
    connection.query(selectSql,selectParams,function(err,res){
        if(err)
        {
            console.log(err.message);
            response.send("error");
        }
        else{
            if(res.length==0)
            {
                console.log("fail to find the record in the database");
                response.send("check the server");
            }
            else{
                const obj={ //构造一个对象，储存数据库检索结果
                    portrait:res[0].portrait,
                    name:res[0].name
                }
                JSON.stringify(obj);    //将其转化成字符串
                response.send(obj);
            }
        }
    })
})

app.all("/getEmployeeInfor",function(request,response){
    response.setHeader("Access-Control-Allow-Origin","*"); 
    var params=url.parse(request.url,true).query;
    const selectParams=[params.openid];
    connection.query(`SELECT * FROM employee WHERE openid=? AND 1 = 1`,selectParams,(err,res)=>{
        if(err){
            console.log(err.message);
            return;
        }
        else{
            if(!res[0].job)
            {
                console.log("didn't find the record in the database");
                return;
            }
            const tempObj={
                job:res[0].job,
                name:res[0].name,
                gender:res[0].gender,
                birthYear:res[0].birthYear,
                education:res[0].education,
                experience:res[0].experience,
                address:res[0].address,
                email:res[0].email,
                phoneNum:res[0].phoneNum,
                condition:res[0].curCondition,  //这个注意，数据库中condition是关键字，不给用当字段名
                jobType:res[0].jobType,
                expectedJob:res[0].expectedJob,
                expectedSalary:res[0].expectedSalary,
                workRegion:res[0].workRegion,
                selfIntroduction:res[0].selfIntroduction,
                portrait:res[0].portrait
              };
            response.send(JSON.stringify(tempObj));
        }
    })
})
app.all("/saveEmployeeCV",function(request,response){    //处理学生保存简历信息的路由
    response.setHeader("Access-Control-Allow-Origin","*"); 
    var params=url.parse(request.url,true).query;
    let openid=params.openid;
    // console.log(openid);//调试用
    const sqlParams=[openid];
    connection.query(`SELECT * FROM employee WHERE openid=? AND 1 = 1`,sqlParams,(err,res)=>{
        if(err)
        {
            console.log(err.message);
            return;
        }
        else{
            if(res.length===0)  //若数据库中无记录（即学生刚填写简历）
            {
                let insertSql=`INSERT INTO employee(openid, job, name, gender, birthYear, education, experience, address, email, phoneNum,
                    curCondition, jobType, expectedJob, expectedSalary, workRegion, selfIntroduction, portrait) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                let insertParams=[params.openid];
                for(let prop in params)
                    if(params[prop]===undefined)
                        insertParams.push("");
                    else if(prop==="openid") //前面已经加了，跳过
                        continue;
                    else
                        insertParams.push(params[prop]);
                connection.query(insertSql,insertParams,(err,res)=>{
                    if(err)
                    {
                        console.log(err.message);
                    }
                    else{
                        response.send("sucess");
                    }
                })
            }
            else{
                let updateSql=`UPDATE employee SET job=?, name=?, gender=?, birthYear=?, education=?, experience=?, address=?, email=?, phoneNum=?,
                 curCondition=?, jobType=?, expectedJob=?, expectedSalary=?, workRegion=?, selfIntroduction=?, portrait=? WHERE openid=?`;
                let updateParams=[];
                for(let prop in params)
                    if(params[prop]===undefined)
                        updateParams.push("");
                    else
                        updateParams.push(params[prop]);
                connection.query(updateSql,updateParams,(err,res)=>{
                    if(err)
                    {
                        console.log(err.message);
                    }
                    else{
                        response.send("sucess");
                    }
                })    
            }
        }
    });
})

app.all("/stuGetRecruitInfor",function(request,response){  //学生端获取招聘信息的路由，在stuRecruit.tsx中需要用到
    response.setHeader("Access-Control-Allow-Origin","*");
    var params=url.parse(request.url,true).query;
    const selectParams=[params.id];
    const selectSql=`SELECT recruitinfor.id, job, salary, numOfRecruit, eduRequired, workExp, jobType, ageRequired, gender, jobAdvantage,
        jobIntro, promotePhoto, region, enterpriseName, telephone FROM recruitinfor, enterprise WHERE recruitinfor.username=enterprise.username
            AND recruitinfor.id>? AND 1=1 ORDER BY recruitinfor.id LIMIT 5`;
    connection.query(selectSql,selectParams,(err,res)=>{
        if(err)
        {
            console.log(err.message);
            response.send("err");
        }
        else{
            let objArray=new Array();
            for(let i=0;i<res.length;i++)
            {
                const tempObj={
                    id: res[i].id,
                    job:res[i].job,
                    salary:res[i].salary,
                    numOfRecruit:res[i].numOfRecruit,
                    eduRequired:res[i].eduRequired,
                    workExp:res[i].workExp,
                    jobType:res[i].jobType,
                    ageRequired:res[i].ageRequired,
                    gender:res[i].gender,
                    jobAdvantage:res[i].jobAdvantage,
                    jobIntro:res[i].jobIntro,
                    promotePhoto:res[i].promotePhoto,
                    region:res[i].region,
                    enterpriseName:res[i].enterpriseName,
                    telephone:res[i].telephone,
                    hasLiked:false
                }
                objArray.push(tempObj);
            }
            // console.log(objArray);//调试用
            response.send(JSON.stringify(objArray));
        }
    })
})

app.get("/hasLiked", function(request, response){   //查看某条招聘信息是否被某名学生用户点赞的路由, stuRecruit.tsx用到
    response.setHeader("Access-Control-Allow-Origin","*"); 
    var params=url.parse(request.url,true).query;
    let selectParams=[params.openid, params.recruitInforId];
    const selectSql="SELECT * from likedrecruitinfor WHERE openid=? AND recruitInforId=? AND 1=1";
    connection.query(selectSql,selectParams,(err,res)=>{
        if(err){
            console.log(err.message);
            response.send("check the database");
        }
        else{
            if(res.length==0)
                response.send("NO");
            else
                response.send("YES");
        }
    })
})

app.get("/likeRecruitInfor", function(request,response){   //处理学生用户点赞某条招聘信息的路由, stuRecruit.tsx用到
    response.setHeader("Access-Control-Allow-Origin","*"); 
    var params=url.parse(request.url,true).query;
    let insertParams=[params.openid, params.recruitInforId];
    const insertSql="INSERT INTO likedrecruitinfor(openid, recruitInforId) VALUES (?,?)";
    connection.query(insertSql,insertParams,(err,res)=>{
        if(err)
        {
            console.log(err.message);
            response.send("check the database");
        }
        else{
            response.send("success");
        }
    })
})
app.get("/unlikeRecruitInfor",function(request,response){   //处理学生用户取消点赞某条招聘信息的路由, stuRecruit.tsx用到
    response.setHeader("Access-Control-Allow-Origin","*"); 
    var params=url.parse(request.url,true).query;
    let deleteParams=[params.openid, params.recruitInforId];
    const deleteSql="DELETE FROM likedrecruitinfor WHERE openid=? AND recruitInforId=? AND 1=1"
    connection.query(deleteSql,deleteParams,(err,res)=>{
        if(err)
        {
            console.log(err.message);
            response.send("check the database");
        }
        else{
            response.send("受影响记录数: "+res.affectedRows);
        }
    })
})
/**
 * 企业端后台路由：
 * 共12个
 */
app.all("/retrieveUsername",function(request,response){ //企业用户注册时，校验用户名是否重名的路由（enterpRegister.tsx中使用）
    response.setHeader("Access-Control-Allow-Origin","*"); 
    var params=url.parse(request.url,true).query;
    const selectSql="SELECT * from enterprise where username=? and 1 = 1";
    let selectParams=[];
    selectParams.push(params.username);
    connection.query(selectSql, selectParams, function(err, res){
        if(err)
        {
            console.log(err.message); 
        }

        else
        {
            if(res.length===0)
                response.send("valid");
            else 
                response.send("invalid");
        }
    })
})

app.all("/retrieveTelephone",function(request,response){ //企业用户注册时，校验手机号是否重复的路由（enterpRegister.tsx中使用）
    response.setHeader("Access-Control-Allow-Origin","*"); 
    var params=url.parse(request.url,true).query;
    const selectSql="SELECT * from enterprise where telephone=? and 1 = 1";
    let selectParams=[];
    selectParams.push(params.telephone);
    connection.query(selectSql, selectParams, function(err, res){
        if(err)
        {
            console.log(err.message); 
        }

        else
        {
            if(res.length===0)
                response.send("valid");
            else 
                response.send("invalid");
        }
    })
})

app.all("/getAvatarName",function(request,response){    //根据传递的账户名，获取数据库中的头像链接和企业名（enterpHome.tsx文件使用）
    response.setHeader("Access-Control-Allow-Origin","*"); 
    var params=url.parse(request.url,true).query;
    const selectSql="SELECT logoImageLink AS avatar, enterpriseName AS name from enterprise where username=? and 1 = 1";
    var selectParams=[];
    selectParams.push(params.username);
    connection.query(selectSql,selectParams,function(err,res){
        if(err)
        {
            console.log(err.message);
            response.send("error");
        }
        else{
            if(res.length==0)
            {
                console.log("fail to find the record in the database");
                response.send("check the server");
            }
            const obj={ //构造一个对象，储存数据库检索结果
                avatar:res[0].avatar,
                name:res[0].name
            }
            JSON.stringify(obj);    //将其转化成字符串
            response.send(obj);
        }
    })
})

app.all("/getEnterpInfor",function(request,response){    //根据传递的账户名，获取数据库中企业公开信息（enterpInforEdit.tsx文件使用）
    response.setHeader("Access-Control-Allow-Origin","*"); 
    var params=url.parse(request.url,true).query;
    const selectSql="SELECT region, enterpriseName, industryType, enterpriseType, numOfStuff, chargeMan, telephone, address, introduction, logoImageLink from enterprise where username=? and 1 = 1";
    var selectParams=[];
    selectParams.push(params.username);
    connection.query(selectSql,selectParams,function(err,res){
        if(err)
        {
            console.log(err.message);
            response.send("error");
        }
        else{
            const obj={ //构造一个对象，储存数据库检索结果
                region:res[0].region,
                enterpriseName:res[0].enterpriseName,
                industryType:res[0].industryType,
                enterpriseType:res[0].enterpriseType,
                numOfStuff:res[0].numOfStuff,
                chargeMan:res[0].chargeMan,
                telephone:res[0].telephone,
                address:res[0].address,
                introduction:res[0].introduction,
                logoImageLink:res[0].logoImageLink
            }
            JSON.stringify(obj);    //将其转化成字符串
            response.send(obj);
        }
    })
})

app.all("/editEnterpInfor",function(request,response){  //修改企业公开信息的路由（enterpInforEdit.tsx用到）
    response.setHeader("Access-Control-Allow-Origin","*"); 
    var params=url.parse(request.url,true).query;
    const updateSql="UPDATE enterprise SET region=?,enterpriseName=?, industryType=?, enterpriseType=?, numOfStuff=?, chargeMan=?, telephone=?, address=?, introduction=?, logoImageLink=? WHERE username=? and 1=1 ";
    var updateParams=[];
    for(let props in params)
        updateParams.push(params[props]);
    connection.query(updateSql,updateParams,function(err,res){
        if(err)
        {
            console.log(err.message);
            response.send("fail");
        }
        else
            response.send("success")
    })
})

app.all("/enterpRegister",function(request,response){   //处理企业用户注册的路由（enterpRegister.tsx中使用）
    
    response.setHeader("Access-Control-Allow-Origin","*");  //CORS设置：允许跨域

    var params=url.parse(request.url,true).query;   //获取从小程序传来的数据(是一个对象)

    connection.query("SELECT MAX(id) AS max FROM enterprise where 1 = 1",(err,res)=>{
        if(err)
        {
            console.log(err.message);
            return;
        }
        else{
            let insertIndex=res[0].max+1;
            let insertSql="INSERT INTO enterprise(id, region, enterpriseName, industryType, enterpriseType, numOfStuff, chargeMan, telephone, address, username, password, introduction, logoImageLink, IdImageLink) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            let insertParams=[insertIndex];
            for(let prop in params)
                if(params[prop]===undefined)
                    insertParams.push("");
                else
                    insertParams.push(params[prop]);
            connection.query(insertSql,insertParams,(err,res)=>{
                if(err)
                {
                    console.log(err.message);
                }
                else{
                    response.send("successfully establishing new record in database!");
                }
                    
            })
        }
    });
})

app.all("/enterpSignIn", function(request, response){   //处理企业用户登陆的路由（enterpLogin.tsx中使用）
    response.setHeader("Access-Control-Allow-Origin","*");

    let params=url.parse(request.url,true).query;
    // console.log(params.password);
    // response.send("data has been processed");
    const selectSql="SELECT username, telephone, password from enterprise WHERE username=? OR telephone=?";
    let selectParams=[];
    selectParams.push(params.username);
    selectParams.push(params.phoneNum);
    connection.query(selectSql, selectParams, function(err, res){
        if(err)
        {
            console.log(err.message); 
        }
        else
        {
            if(res.length===0)
                response.send("wrong");//用户名错误
            else 
            {
                // console.log(res[0].psw);//调试用
                if(res[0].password===params.password)
                {
                    const tempObj={
                        username:res[0].username,
                        phoneNum:res[0].telephone
                    }
                    response.send(JSON.stringify(tempObj));
                }
                else
                    response.send("wrong");//密码错误
            }
        }
    })

})

app.all("/changePsw",function(request,response){    //处理企业用户修改密码的路由（retrievePsw.tsx中使用）
    response.setHeader("Access-Control-Allow-Origin","*");
    var params=url.parse(request.url,true).query;
    const updateSql="UPDATE enterprise SET password=? where telephone=? and 1=1";

    const updateParams=[];
    updateParams.push(params.newPsw);
    updateParams.push(params.phoneNum);
    connection.query(updateSql,updateParams,(err, res)=>{
        if(err)
        {
            console.log(err.message);
            response.send("error");
        }
        else{
            // console.log("update affected rows: "+res.affectedRows);//测试用
            if(res.affectedRows===0)
                response.send("fail");
            else
                response.send("success");
        }
    })
})

app.all("/publishJob",function(request,response){    //处理企业用户修改密码的路由（retrievePsw.tsx中使用）
    response.setHeader("Access-Control-Allow-Origin","*");
    var params=url.parse(request.url,true).query;
    connection.query("SELECT MAX(id) AS max FROM recruitinfor where 1 = 1",(err,res)=>{
        if(err)
        {
            console.log(err.message);
            return;
        }
        else{
            let insertIndex=res[0].max+1;
            let insertSql="INSERT INTO recruitinfor(id, job, salary, numOfRecruit, eduRequired, workExp, jobType, ageRequired, gender, jobAdvantage, jobIntro, promotePhoto, username) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";

            let insertParams=[insertIndex];
            for(let prop in params)
                if(params[prop]===undefined)
                    insertParams.push(null);
                else
                    insertParams.push(params[prop]);
            connection.query(insertSql,insertParams,(err,res)=>{
                if(err)
                {
                    console.log(err.message);
                }
                else{
                    response.send("successfully establishing a new record in the database!");
                }
                    
            })
        }
    });
})

app.all("/getRecruitInfor",function(request,response){  //获取招聘信息的路由，在recruitInforRetrieve.tsx中需要用到
    response.setHeader("Access-Control-Allow-Origin","*");
    var params=url.parse(request.url,true).query;
    const selectParams=[params.username];
    connection.query("SELECT id, job, salary, numOfRecruit, eduRequired, workExp, jobType, ageRequired, gender, jobAdvantage, jobIntro, promotePhoto FROM recruitinfor WHERE username=?",selectParams,(err,res)=>{
        if(err)
        {
            console.log(err.message);
            response.send("err");
        }
        else{
            let objArray=new Array();
            for(let i=0;i<res.length;i++)
            {
                const tempObj={
                    id: res[i].id,
                    job:res[i].job,
                    salary:res[i].salary,
                    numOfRecruit:res[i].numOfRecruit,
                    eduRequired:res[i].eduRequired,
                    workExp:res[i].workExp,
                    jobType:res[i].jobType,
                    ageRequired:res[i].ageRequired,
                    gender:res[i].gender,
                    jobAdvantage:res[i].jobAdvantage,
                    jobIntro:res[i].jobIntro,
                    promotePhoto:res[i].promotePhoto
                }
                objArray.push(tempObj);
            }
            // console.log(objArray);//调试用
            response.send(JSON.stringify(objArray));
        }
    })
})

app.all("/alterRecruitInfor",function(request,response){    //处理修改招聘信息的路由，在recruitInforEdit.tsx中用到
    response.setHeader("Access-Control-Allow-Origin","*");
    var params=url.parse(request.url,true).query;
    const updateParams=[];
    for(let props in params)
        updateParams.push(params[props]);
    /*
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
     */
    const updateSql=`UPDATE recruitinfor SET job=?, salary=?, numOfRecruit=?, eduRequired=?, workExp=?, jobType=?, ageRequired=?, 
        gender=?, jobAdvantage=?, jobIntro=?, promotePhoto=? WHERE id=?`;
    connection.query(updateSql, updateParams,(err,res)=>{
        if(err)
        {
            console.log(err.message);
            response.send("error");
        }
        else{
            response.send("success");
        }
    });
})

app.all("/deleteRecruitInfor",function(request,response){   //删除招聘信息的路由，在recruitInforDetail.tsx中用到
    response.setHeader("Access-Control-Allow-Origin","*");
    var params=url.parse(request.url,true).query;
    const deleteParams=[params.id];
    connection.query("DELETE FROM recruitinfor WHERE id=? and 1=1", deleteParams,(err,res)=>{
        if(err){
            console.log(err.message);
            response.send("error");
        }
        else{
            console.log(res.affectedRows);
            response.send("success");
        }
    })
})
app.listen(8008,function(){
    console.log("8008端口监听中...");
})

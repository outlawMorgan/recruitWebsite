import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Form, Label,Input, Button,Picker, Textarea, Image } from '@tarojs/components'
import './enterpRegister.scss'
import defaultImg from "/src/img/defaultImg.jpg"
import { setUsername, userInfo } from '../sharedDataModule';

export default class enterpRegister extends Component {

  constructor(props){
    super(props);
    this.state={
      _region:"",
      enterpriseName:"",
      industryType:"",
      enterpriseType:"请选择企业性质",
      numOfStuff:"请选择员工规模",
      chargeMan:"",
      telephone:"",
      address:"",
      username:"",
      password_1:"",
      password_2:"",
      introduction:"",
  
      stuffIndex:0, //人员规模
      stuffData:["10人以下","10~100人","100~1000人","1000人以上"],
  
      enterpIndex:0,  //企业性质
      enterpData:['国有企业','集体所有制企业','私营企业','股份制企业','有限合伙企业','联营企业','外商投资企业','个人独资企业'],

      logoImageLink:defaultImg,
      IdImageLink:defaultImg,
      
      //提示字体用的变量
      telephonePrompt:"",
      telephonePromptStyle:"prompt1",
      usernamePrompt:"",
      usernamePromptStyle:"prompt1",
      psw_1_prompt:"",
      psw_1_prompt_style:"prompt1",
      psw_2_prompt:"",
      psw_2_prompt_style:"prompt1",
    }
    this.setRegion=this.setRegion.bind(this);
    this.setEnterpName=this.setEnterpName.bind(this);
    this.setIndustType=this.setIndustType.bind(this);
    this.setChargeMan=this.setChargeMan.bind(this);
    this.setTelephone=this.setTelephone.bind(this);
    this.setAddress=this.setAddress.bind(this);
    this.setUsername=this.setUsername.bind(this);
    this.setPsw_1=this.setPsw_1.bind(this);
    this.setPsw_2=this.setPsw_2.bind(this);
    this.setIntro=this.setIntro.bind(this);
    this.setNumOfStuff=this.setNumOfStuff.bind(this);
    this.setEnterpType=this.setEnterpType.bind(this);
    this.getLocationBtn=this.getLocationBtn.bind(this);
    this.registerBtn=this.registerBtn.bind(this);
    this.getLogo=this.getLogo.bind(this);
    this.getRegistration=this.getRegistration.bind(this);
  }
  setRegion(input){
    this.setState({
      _region:input.detail.value
    })
  }
  setEnterpName(input){
    this.setState({
      enterpriseName:input.detail.value
    })
  }
  setIndustType(input){
    this.setState({
      industryType:input.detail.value
    })
  }
  setChargeMan(input){
    this.setState({
      chargeMan:input.detail.value
    })
  }
  setAddress(input){
    this.setState({
      address:input.detail.value
    })
  }
  setTelephone(input){
    this.setState({
      telephone:input.detail.value
    });
    const that=this;
    const val=input.detail.value;

    let phoneReg=/^1[3|4|5|8][0-9]\d{4,8}$/;
    if(!phoneReg.test(val)){
      that.setState({
        telephonePrompt:"请输入正确格式的手机号",
        telephonePromptStyle:"prompt1"
      });
    }
    else
      Taro.request({
        url:"http://127.0.0.1:8008/retrieveTelephone",
        method:"GET",
        data:{telephone:val},
        success(res){
          if(res.data=="valid")
            that.setState({
              telephonePrompt:"此手机号码可用",
              telephonePromptStyle:"prompt2"
            });
          else if(res.data=="invalid")
            that.setState({
              telephonePrompt:"此手机号码已被注册",
              telephonePromptStyle:"prompt1"
            });
        }
      })
  }
  setUsername(input){
    this.setState({
      username:input.detail.value
    })
    const that=this;
    const val=input.detail.value;
    var reg = /^[a-zA-Z\d]{6,}$/;
    if(!reg.test(val))
      this.setState({
        usernamePrompt:"请输入正确格式的密码",
        usernamePromptStyle:"prompt1"
      })
    else{
      Taro.request({
        url:"http://127.0.0.1:8008/retrieveUsername",
        method:"GET",
        data:{username:val},
        success(res){
          if(res.data=="valid")
            that.setState({
              usernamePrompt:"此用户名可用",
              usernamePromptStyle:"prompt2"
            });
          else if(res.data=="invalid")
            that.setState({
              usernamePrompt:"此用户名已被注册",
              usernamePromptStyle:"prompt1"
            });
        }
      })
    }

  }
  setPsw_1(input){
    this.setState({
      password_1:input.detail.value
    })
    let psw=input.detail.value;
    let pswReg=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
    if(!pswReg.test(psw))
      this.setState({
        psw_1_prompt:"密码格式有误",
        psw_1_prompt_style:"prompt1"
      })
    else
      this.setState({
        psw_1_prompt:"密码符合要求",
        psw_1_prompt_style:"prompt2"
      })
  }
  setPsw_2(input){
    this.setState({
      password_2:input.detail.value
    })
    let psw=input.detail.value;
    if(psw!=this.state.password_1)
      this.setState({
        psw_2_prompt:"两次输入密码不一致",
        psw_2_prompt_style:"prompt1"
      })
    else
      this.setState({
        psw_2_prompt:"密码符合要求",
        psw_2_prompt_style:"prompt2"
      })
  }
  setIntro(input){
    this.setState({
      introduction:input.detail.value
    })
  }

  //滚动选择器设置
  setNumOfStuff(event) {
    // console.log(event.detail.value);
    this.setState({
      stuffIndex: event.detail.value
    });
    this.setState({
      numOfStuff: this.state.stuffData[event.detail.value]
    });
    // console.log(this.state.numOfStuff);
  }
  setEnterpType(event){
    this.setState({
      enterpIndex:event.detail.value,
    });
    this.setState({
      enterpriseType:this.state.enterpData[event.detail.value]
    })
    // console.log(this.state.enterpriseType)

  }
  getLocationBtn(){
    const that=this;
    Taro.chooseLocation({
      success(res){
        that.setState({
          address:res.address
        });
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
                              that.setState({address:res.address});
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
  getLogo(){
    const that=this;
    Taro.chooseImage({
      count: 1, // 最多可以选择的图片张数，这里设置成一张
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success(res){
        // success
        // console.log(res);
        that.setState({
          logoImageLink:res.tempFilePaths //设置logo照片的路径
        })
      }
    })
  }
  getRegistration(){
    const that=this;
    Taro.chooseImage({
      count: 1, 
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'], 
      success(res){
        // success
        console.log(res);
        that.setState({
          IdImageLink:res.tempFilePaths //设置企业证件照片的路径
        })
      }
    })
  }
  registerBtn(){
    const that=this;
    // console.log(this.state.region, this.state.industryType, this.state.enterpriseName, this.state.password_1); //测试用 
    //1. 检查手机号格式
    let phoneReg=/^1[3|4|5|8][0-9]\d{4,8}$/;
    if(!phoneReg.test(this.state.telephone))
    {
      Taro.showToast({
        title: '手机号码错误',
        icon:"none",
        duration: 1500
      })
      return;
    }
    else if(this.state.telephonePrompt!="此手机号码可用"){
      Taro.showToast({
        title:"请勿输入已有的手机号",
        icon:"none",
        duration: 1500
      })
      return;
    }
    //2. 检查用户名格式
    let usernameReg=/^[a-zA-Z\d]{6,}$/;
    if(!usernameReg.test(this.state.username))
    {
      Taro.showToast({
        title:"账号格式不符",
        icon:"none",
        duration: 1500
      })
      return;
    }
    else if(this.state.usernamePrompt!="此用户名可用"){
      Taro.showToast({
        title:"请勿输入已有的账号",
        icon:"none",
        duration: 1500
      });
      return;
    }
    //3. 检查密码格式
    let pswReg=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
    if(!pswReg.test(this.state.password_1))
    {
      Taro.showToast({
        title: '密码格式不符',
        icon:"none",
        duration:1500
      });
      return;
    }
    //4. 检查两次密码是否输入一致
    if(this.state.password_1!=this.state.password_2)
    {
      Taro.showToast({
        title: '两次密码不一致!',
        icon:"none",
        duration: 2000
      })
      return;
    }
    //5. 检查其余信息是否填写完整
    let flag=true;
    for(let prop in this.state){
      if(this.state[prop]=="" && prop!="introduction")
      {
        flag=false;
        break;
      }
      else if(prop=="enterpriseType" && this.state[prop]=="请选择企业性质")
      {
        flag=false;
        break;
      }
      else if(prop=="numOfStuff" && this.state[prop]=="请选择员工规模")
      {
        flag=false;
        break;
      }
      else if(prop=="IdImageLink" && this.state[prop]==defaultImg)
      {
        flag=false;
        break;
      }

    }
    if(flag===false)
    {
      Taro.showToast({
        title: '必要信息不能留空',
        icon: 'none',
        duration:2000
      })
      return;
    }
    //所有事项检查无误后，发送给服务器
    else{   
      /*通过引入的setUsername方法修改模块/src/pages.usernameEnterp.tsx中的值，即username,因为用户名是唯一的
        以备后续调取用户信息。
      */
      setUsername(this.state.username);
      Taro.request({
        url:"http://127.0.0.1:8008/enterpRegister",
        method:"GET",
        data:{
          region: `${this.state._region}`,
          enterpriseName: `${this.state.enterpriseName}`,
          industryType: `${this.state.industryType}`,
          enterpriseType: `${this.state.enterpriseType}`,
          numOfStuff: `${this.state.numOfStuff}`,
          chargeMan: `${this.state.chargeMan}`,
          telephone: `${this.state.telephone}`,
          address: `${this.state.address}`,
          username: `${this.state.username}`,
          password: `${this.state.password_1}`,
          introduction: `${this.state.introduction}`,
          logoImageLink:`${this.state.logoImageLink}`,
          IdImageLink:`${this.state.IdImageLink}`
        },
        success:(result)=>{
 
          Taro.showToast({
            title: '注册成功!',
            icon:"success",
            duration:1500
          });
          this.setState({//清空表单中的数据
            _region:"",
            enterpriseName:"",
            industryType:"",
            enterpriseType:"请选择企业性质",
            numOfStuff:"请选择员工规模",
            chargeMan:"",
            telephone:"",
            address:"",
            username:"",
            password_1:"",
            password_2:"",
            introduction:"",
            logoImageLink:defaultImg,
            IdImageLink:defaultImg,
            usernamePrompt:"",
            usernamePromptStyle:"prompt1",
            psw_1_prompt:"",
            psw_1_prompt_style:"prompt1",
            psw_2_prompt:"",
            psw_2_prompt_style:"prompt1",
          })
          // console.log(result);
          setTimeout(()=>{Taro.redirectTo({url:"../enterpLogin/enterpLogin"})},1500);
        },
        fail:()=>{
          Taro.showToast({
            title: '服务器繁忙，请稍后再试',
            icon:"none",
            duration:2000
          })
        }
      })
    }
  }
  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {

    return (
      <View className="wrapper">
        <Form>
          <View className="head">
            <View>企业信息(必填)</View>
          </View>
          <View className="line">
            <Label className="label">所处地区</Label>
            <Input type="text" className="inputbox" placeholder="请输入地区" onInput={this.setRegion} value={this.state._region}></Input>
          </View>

          <View className="line">
            <Label className="label">企业名称</Label>
            <Input type="text" className="inputbox" placeholder="请输入企业名称" onInput={this.setEnterpName} value={this.state.enterpriseName}></Input>
          </View>

          <View className="line">
            <Label className="label">企业行业</Label>
            <Input type="text" className="inputbox" placeholder="请输入企业行业" onInput={this.setIndustType} value={this.state.industryType}></Input>
          </View>

          <View className="line">
            <Label className="label">企业性质</Label>
            <Picker className="inputbox" onChange={this.setEnterpType} value={this.state.enterpIndex} range={this.state.enterpData}>{this.state.enterpriseType}</Picker>
          </View>

          <View className="line">
            <Label className="label">人员规模</Label>
            <Picker className="inputbox" onChange={this.setNumOfStuff} value={this.state.stuffIndex} range={this.state.stuffData}>{this.state.numOfStuff}</Picker>  
          </View>

          <View className="line">
            <Label className="label">负责人</Label>
            <Input type="text" className="inputbox" placeholder="请输入负责人" onInput={this.setChargeMan} value={this.state.chargeMan}></Input>
          </View>

          <View className="line">
            <Label className="label">地址</Label>
            <Input type="text" className="inputbox" placeholder="请输入地址" onInput={this.setAddress} value={this.state.address}></Input>
            <Button className="location" style="width:120px" onClick={this.getLocationBtn}>获取位置</Button>
          </View>

          <View className="head">
            <View>账号设置(必填)</View>
          </View>

          <View className="line">
            <Label className="label">手机号码</Label>
            <Input type="text" className="inputbox" placeholder="请输入用于注册的手机号码" onInput={this.setTelephone} value={this.state.telephone}></Input>
          </View>
          <View className={this.state.telephonePromptStyle}>{this.state.telephonePrompt}</View>

          <View className="line">
            <Label className="label">登录账号</Label>
            <Input type="text" className="accountInput" placeholder="请输入账号(6位以上,包含数字和字母)" onInput={this.setUsername} value={this.state.username} maxlength={40}/>
          </View>
          <View className={this.state.usernamePromptStyle}>{this.state.usernamePrompt}</View>

          <View className="line">
            <Label className="label">密码</Label>
            <Input type="text" password={true} className="accountInput" placeholder="请输入密码(6~16位,包含数字和字母)" onInput={this.setPsw_1} style="width:80%;" value={this.state.password_1} maxlength={20}/>
          </View>
          <View className={this.state.psw_1_prompt_style}>{this.state.psw_1_prompt}</View>

          <View className="line">
            <Label className="label">确认密码</Label>
            <Input type="text" password={true} className="accountInput" placeholder="请再次输入密码" onInput={this.setPsw_2} value={this.state.password_2} maxlength={20}/> 
          </View>
          <View className={this.state.psw_2_prompt_style}>{this.state.psw_2_prompt}</View>


          <View className="head">
            <View>公司介绍(选填)</View>
          </View>
          <View className="textarea">
            <Textarea placeholder="请填写公司介绍" onInput={this.setIntro}>{this.state.introduction}</Textarea>
          </View>

          <View className="head">
          <View>企业LOGO(选填)</View>
          </View>
          <View className="imageContainer">
            <Image className="imageStyle" src={this.state.logoImageLink} onClick={this.getLogo}></Image>
          </View>

          <View className="head">
          <View>企业执照或相关证件(必填)</View>
          </View>
          <View className="imageContainer">
            <Image className="imageStyle" src={this.state.IdImageLink} onClick={this.getRegistration}></Image>
          </View>

          <View className="register">
            <Button className="registerbutton" style="width:100%" onClick={this.registerBtn}>注册企业信息</Button>
          </View>
        </Form>
      </View>

    )
  }
}
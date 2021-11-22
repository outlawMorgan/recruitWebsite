import Taro from '@tarojs/taro'
import { useState } from 'react'
import { View, Text, Button, Image} from '@tarojs/components'
import './index.scss'
import logo from "/src/img/logo.jpg"

export default function Index(){

  const [slogan,setSlogan]=useState("发现一个更好的自己")

  function toEnterpPort(){  //跳转至企业端
    Taro.navigateTo({ url: '../enterpLogin/enterpLogin' });
  }

  function toEmployeePort(){  //跳转至求职者端
    Taro.navigateTo({ url: '../stuRecruit/stuRecruit' });
  }

  return (
  <View className="wrapper">

    <Image src={logo} className="logo"></Image>

    <View className="slogan">
      <Text>{slogan}</Text>
    </View>

    <View className="buttonWrapper">
      <Button type="primary" className="naviButton" onClick={toEnterpPort}>企业端入口</Button>
      <Button type="default" className="naviButton" onClick={toEmployeePort}>学生端入口</Button>
    </View>
  </View>
  )

}

import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { View, Image} from '@tarojs/components'
import './giftPurchase.scss'
import coco from "../../img/coco.jpg"
import ydd from "../../img/ydd.jpg"
import xc from "../../img/xc.jpg"
import {userInfo} from "../sharedDataModule"

export default function GiftPurchase(){
    return (
        <View className="wrapper">
            <View className="head">
                购买礼品券 
                <View>吸引更多学生用户</View>
            </View>

            <View className="date">
                目前共有
                <View className="number">3</View>
                种礼品券
            </View>
            <View className="line">
                <View className="coupons">
                    <View className="detail">
                        <View className="left1"></View>
                        <View className="right">CoCo10元代金券</View>
                    </View>
                </View>
                <View className="pay">立即购买</View>
            </View>

            <View className="line">
                <View className="coupons">
                    <View className="detail">
                        <View className="left2"></View>
                        <View className="right">一点点30元抵用券</View>
                    </View>
                </View>
                <View className="pay">立即购买</View>
            </View>

            <View className="line">
                <View className="coupons">
                    <View className="detail">
                        <View className="left3"></View>
                        <View className="right">喜茶20元代金券</View>
                    </View>
                </View>
                <View className="pay">立即购买</View>
            </View>
        </View>
    )
}
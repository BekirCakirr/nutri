import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type LeaderboardUser = {
  id: string
  name: string
  points: number
  rank: number
  avatar: string
  trend: 'up' | 'down' | 'same'
  isCurrentUser?: boolean
}

const mockLeaderboard: LeaderboardUser[] = [
  { id: 'u1', name: 'Zeynep K.', points: 14250, rank: 1, avatar: 'https://i.pravatar.cc/150?img=5', trend: 'same' },
  { id: 'u2', name: 'Caner T.', points: 13800, rank: 2, avatar: 'https://i.pravatar.cc/150?img=11', trend: 'up' },
  { id: 'u3', name: 'Gülşah M.', points: 13100, rank: 3, avatar: 'https://i.pravatar.cc/150?img=9', trend: 'down' },
  { id: 'u4', name: 'Ali Veli', points: 12500, rank: 4, avatar: 'https://i.pravatar.cc/150?img=12', trend: 'up' },
  { id: 'u5', name: 'Sen', points: 12150, rank: 5, avatar: 'https://i.pravatar.cc/150?img=33', trend: 'up', isCurrentUser: true },
  { id: 'u6', name: 'Burak A.', points: 11900, rank: 6, avatar: 'https://i.pravatar.cc/150?img=15', trend: 'down' },
  { id: 'u7', name: 'Selin B.', points: 11200, rank: 7, avatar: 'https://i.pravatar.cc/150?img=20', trend: 'same' },
]

export default function LeaderboardScreen() {
  const navigation = useNavigation()
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'all-time'>('weekly')

  const topThree = mockLeaderboard.slice(0, 3)
  const rest = mockLeaderboard.slice(3)

  return (
    <ScreenWrapper padded={false} scrollable={false}>
      <AppHeader
        title="Liderlik Tablosu"
        onBack={() => navigation.goBack()}
      />
      
      {/* Period Selector */}
      <View className="bg-white px-4 py-3 border-b border-[#E8F0EC]">
        <View className="flex-row bg-[#F8FAF9] p-1 rounded-xl border border-[#E8F0EC]">
          <TouchableOpacity 
             className={`flex-1 py-2 items-center rounded-lg ${period === 'weekly' ? 'bg-white shadow-sm' : ''}`}
             onPress={() => setPeriod('weekly')}
          >
             <Text className={`text-xs font-bold ${period === 'weekly' ? 'text-[#1A5C37]' : 'text-[#A8BFB2]'}`}>Haftalık</Text>
          </TouchableOpacity>
          <TouchableOpacity 
             className={`flex-1 py-2 items-center rounded-lg ${period === 'monthly' ? 'bg-white shadow-sm' : ''}`}
             onPress={() => setPeriod('monthly')}
          >
             <Text className={`text-xs font-bold ${period === 'monthly' ? 'text-[#1A5C37]' : 'text-[#A8BFB2]'}`}>Aylık</Text>
          </TouchableOpacity>
          <TouchableOpacity 
             className={`flex-1 py-2 items-center rounded-lg ${period === 'all-time' ? 'bg-white shadow-sm' : ''}`}
             onPress={() => setPeriod('all-time')}
          >
             <Text className={`text-xs font-bold ${period === 'all-time' ? 'text-[#1A5C37]' : 'text-[#A8BFB2]'}`}>Tüm Zamanlar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 bg-[#F8FAF9]" showsVerticalScrollIndicator={false}>
        
        {/* Podium Area */}
        <View className="bg-[#1A2E23] pt-8 pb-12 px-4 flex-row items-end justify-center rounded-b-[40px] shadow-sm">
          
          {/* 2nd Place */}
          <View className="items-center mx-2" style={{ paddingBottom: 20 }}>
             <Image source={{ uri: topThree[1].avatar }} className="w-16 h-16 rounded-full border-4 border-[#A1A1AA] mb-2" />
             <View className="absolute -top-3 bg-[#A1A1AA] w-6 h-6 rounded-full items-center justify-center border-2 border-[#1A2E23]">
                <Text className="text-white text-[10px] font-bold">2</Text>
             </View>
             <Text className="text-white font-semibold text-sm mb-1">{topThree[1].name}</Text>
             <Text className="text-[#A1A1AA] font-bold text-xs">{topThree[1].points} XP</Text>
          </View>

          {/* 1st Place */}
          <View className="items-center mx-2 z-10" style={{ paddingBottom: 40 }}>
             <Ionicons name="nutrition" size={24} color="#FBBF24" className="absolute -top-8" />
             <Image source={{ uri: topThree[0].avatar }} className="w-24 h-24 rounded-full border-[5px] border-[#FBBF24] mb-2" />
             <View className="absolute -bottom-2 bg-[#FBBF24] w-8 h-8 rounded-full items-center justify-center border-[3px] border-[#1A2E23]">
                <Text className="text-[#1A2E23] text-sm font-extrabold">1</Text>
             </View>
             <Text className="text-white font-bold text-lg mt-3 mb-1">{topThree[0].name}</Text>
             <Text className="text-[#FBBF24] font-extrabold text-sm">{topThree[0].points} XP</Text>
          </View>

           {/* 3rd Place */}
           <View className="items-center mx-2" style={{ paddingBottom: 10 }}>
             <Image source={{ uri: topThree[2].avatar }} className="w-14 h-14 rounded-full border-4 border-[#B45309] mb-2" />
             <View className="absolute -top-2 bg-[#B45309] w-5 h-5 rounded-full items-center justify-center border-2 border-[#1A2E23]">
                <Text className="text-white text-[10px] font-bold">3</Text>
             </View>
             <Text className="text-white font-semibold text-xs mb-1">{topThree[2].name}</Text>
             <Text className="text-[#B45309] font-bold text-[10px]">{topThree[2].points} XP</Text>
          </View>
        </View>

        {/* List Details */}
        <View className="px-4 py-8 space-y-3">
          {rest.map((user) => (
             <View 
               key={user.id} 
               className={`flex-row items-center p-4 rounded-2xl border ${user.isCurrentUser ? 'bg-[#E8F5EC] border-[#1A5C37]' : 'bg-white border-[#E8F0EC]'}`}
             >
                <Text className={`font-bold w-6 text-center ${user.isCurrentUser ? 'text-[#1A5C37]' : 'text-[#A8BFB2]'}`}>
                  {user.rank}
                </Text>

                <Image source={{ uri: user.avatar }} className="w-10 h-10 rounded-full ml-2 mr-3 border border-[#E8F0EC]" />
                
                <View className="flex-1">
                   <Text className={`font-bold text-base ${user.isCurrentUser ? 'text-[#1A5C37]' : 'text-[#1A2E23]'}`}>
                     {user.name} {user.isCurrentUser && '(Sen)'}
                   </Text>
                </View>

                <View className="items-end">
                   <Text className={`font-bold ${user.isCurrentUser ? 'text-[#1A5C37]' : 'text-[#5A7264]'}`}>
                     {user.points} XP
                   </Text>
                   {/* Trend icon */}
                   {user.trend === 'up' && <Ionicons name="caret-up" size={14} color="#10B981" />}
                   {user.trend === 'down' && <Ionicons name="caret-down" size={14} color="#EF4444" />}
                   {user.trend === 'same' && <Ionicons name="remove" size={14} color="#A8BFB2" />}
                </View>
             </View>
          ))}
        </View>

      </ScrollView>
    </ScreenWrapper>
  )
}

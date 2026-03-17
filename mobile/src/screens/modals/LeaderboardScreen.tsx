import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ScreenWrapper } from '../../components/common/ScreenWrapper'
import { AppHeader } from '../../components/common/AppHeader'

type LeaderboardEntry = {
  rank: number
  name: string
  points: number
  avatar: string
  streak: number
  isMe: boolean
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Zeynep K.', points: 2850, avatar: '👩', streak: 32, isMe: false },
  { rank: 2, name: 'Mehmet A.', points: 2720, avatar: '👨', streak: 28, isMe: false },
  { rank: 3, name: 'Ayşe D.', points: 2680, avatar: '👩', streak: 25, isMe: false },
  { rank: 4, name: 'Ahmet Y. (Ben)', points: 2540, avatar: '👨', streak: 18, isMe: true },
  { rank: 5, name: 'Fatma Ö.', points: 2490, avatar: '👩', streak: 22, isMe: false },
  { rank: 6, name: 'Can B.', points: 2350, avatar: '👦', streak: 15, isMe: false },
  { rank: 7, name: 'Elif T.', points: 2200, avatar: '👩', streak: 12, isMe: false },
  { rank: 8, name: 'Ali S.', points: 2100, avatar: '👨', streak: 9, isMe: false },
  { rank: 9, name: 'Selin Y.', points: 1980, avatar: '👩', streak: 7, isMe: false },
  { rank: 10, name: 'Burak K.', points: 1850, avatar: '👨', streak: 5, isMe: false },
]

type Period = 'Hafta' | 'Ay' | 'Tümü'

function medalColor(rank: number) {
  if (rank === 1) return '#D4A843'
  if (rank === 2) return '#A0A0A0'
  if (rank === 3) return '#CD7F32'
  return undefined
}

function medalEmoji(rank: number) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return ''
}

export default function LeaderboardScreen() {
  const navigation = useNavigation()
  const [period, setPeriod] = useState<Period>('Hafta')
  const myEntry = mockLeaderboard.find(e => e.isMe)!

  return (
    <ScreenWrapper padded={false}>
      <AppHeader title="Sıralama" onBack={() => navigation.goBack()} />
      <ScrollView className="flex-1 bg-[#F8FAF9]" showsVerticalScrollIndicator={false}>
        {/* Period selector */}
        <View className="flex-row px-5 pt-4 mb-4 gap-2">
          {(['Hafta', 'Ay', 'Tümü'] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              className="flex-1 rounded-xl py-2.5 items-center border"
              style={{
                backgroundColor: period === p ? '#1A5C37' : '#FFFFFF',
                borderColor: period === p ? '#1A5C37' : '#E8F0EC',
              }}
              activeOpacity={0.7}
              onPress={() => setPeriod(p)}
            >
              <Text className="text-sm font-semibold" style={{ color: period === p ? '#FFFFFF' : '#5A7264' }}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Top 3 podium */}
        <View className="flex-row justify-center items-end mb-6 px-5">
          {/* 2nd */}
          <View className="items-center flex-1">
            <Text className="text-2xl mb-1">{mockLeaderboard[1].avatar}</Text>
            <View className="bg-[#A0A0A0] rounded-t-xl w-full items-center py-4">
              <Text className="text-xl">🥈</Text>
              <Text className="text-xs text-white font-bold mt-1">{mockLeaderboard[1].name.split(' ')[0]}</Text>
              <Text className="text-sm text-white font-extrabold">{mockLeaderboard[1].points}</Text>
            </View>
          </View>
          {/* 1st */}
          <View className="items-center flex-1 mx-1">
            <Text className="text-3xl mb-1">{mockLeaderboard[0].avatar}</Text>
            <View className="bg-[#D4A843] rounded-t-xl w-full items-center py-6">
              <Text className="text-2xl">🥇</Text>
              <Text className="text-xs text-white font-bold mt-1">{mockLeaderboard[0].name.split(' ')[0]}</Text>
              <Text className="text-lg text-white font-extrabold">{mockLeaderboard[0].points}</Text>
            </View>
          </View>
          {/* 3rd */}
          <View className="items-center flex-1">
            <Text className="text-2xl mb-1">{mockLeaderboard[2].avatar}</Text>
            <View className="bg-[#CD7F32] rounded-t-xl w-full items-center py-3">
              <Text className="text-xl">🥉</Text>
              <Text className="text-xs text-white font-bold mt-1">{mockLeaderboard[2].name.split(' ')[0]}</Text>
              <Text className="text-sm text-white font-extrabold">{mockLeaderboard[2].points}</Text>
            </View>
          </View>
        </View>

        {/* Rest of the list */}
        <View className="px-5">
          {mockLeaderboard.slice(3).map((entry) => (
            <View
              key={entry.rank}
              className="flex-row items-center rounded-xl px-4 py-3.5 mb-2 border"
              style={{
                backgroundColor: entry.isMe ? '#E8F5EC' : '#FFFFFF',
                borderColor: entry.isMe ? '#1A5C37' : '#E8F0EC',
              }}
            >
              <Text className="w-7 text-sm font-bold text-[#5A7264]">#{entry.rank}</Text>
              <Text className="text-xl mr-3">{entry.avatar}</Text>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-[#1A2E23]">{entry.name}</Text>
                <Text className="text-xs text-[#5A7264]">🔥 {entry.streak} gün serisi</Text>
              </View>
              <Text className="text-base font-bold text-[#1A2E23]">{entry.points}</Text>
            </View>
          ))}
        </View>

        {/* My position */}
        <View className="mx-5 mt-4 mb-8 bg-[#1A2E23] rounded-xl p-4 flex-row items-center">
          <Text className="text-white font-bold mr-3">#{myEntry.rank}</Text>
          <Text className="text-xl mr-2">{myEntry.avatar}</Text>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-white">Senin Sıran</Text>
            <Text className="text-xs text-white/50">{myEntry.points} puan · {myEntry.streak} gün serisi</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}

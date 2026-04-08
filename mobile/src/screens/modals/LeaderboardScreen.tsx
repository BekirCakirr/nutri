import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
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
      <ScrollView style={{ flex: 1, backgroundColor: '#F8FAF9' }}showsVerticalScrollIndicator={false}>
        {/* Period selector */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingTop: 16, marginBottom: 16, gap: 8 }}>
          {(['Hafta', 'Ay', 'Tümü'] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={{ flex: 1, borderRadius: 12, paddingVertical: 10, alignItems: 'center', borderWidth: 1, backgroundColor: period === p ? '#1A5C37' : '#FFFFFF',
                borderColor: period === p ? '#1A5C37' : '#E8F0EC', }}
              activeOpacity={0.7}
              onPress={() => setPeriod(p)}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: period === p ? '#FFFFFF' : '#5A7264' }}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Top 3 podium */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', marginBottom: 24, paddingHorizontal: 20 }}>
          {/* 2nd */}
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 24, marginBottom: 4 }}>{mockLeaderboard[1].avatar}</Text>
            <View style={{ backgroundColor: '#A0A0A0', borderTopLeftRadius: 12, borderTopRightRadius: 12, alignItems: 'center', paddingVertical: 16 }} /* TODO: w-full */>
              <Text style={{ fontSize: 20 }}>🥈</Text>
              <Text style={{ fontSize: 12, color: '#FFFFFF', fontWeight: '700', marginTop: 4 }}>{mockLeaderboard[1].name.split(' ')[0]}</Text>
              <Text style={{ fontSize: 14, color: '#FFFFFF', fontWeight: '800' }}>{mockLeaderboard[1].points}</Text>
            </View>
          </View>
          {/* 1st */}
          <View style={{ alignItems: 'center', flex: 1, marginHorizontal: 4 }}>
            <Text style={{ fontSize: 30, marginBottom: 4 }}>{mockLeaderboard[0].avatar}</Text>
            <View style={{ backgroundColor: '#D4A843', borderTopLeftRadius: 12, borderTopRightRadius: 12, alignItems: 'center', paddingVertical: 24 }} /* TODO: w-full */>
              <Text style={{ fontSize: 24 }}>🥇</Text>
              <Text style={{ fontSize: 12, color: '#FFFFFF', fontWeight: '700', marginTop: 4 }}>{mockLeaderboard[0].name.split(' ')[0]}</Text>
              <Text style={{ fontSize: 18, color: '#FFFFFF', fontWeight: '800' }}>{mockLeaderboard[0].points}</Text>
            </View>
          </View>
          {/* 3rd */}
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 24, marginBottom: 4 }}>{mockLeaderboard[2].avatar}</Text>
            <View style={{ backgroundColor: '#CD7F32', borderTopLeftRadius: 12, borderTopRightRadius: 12, alignItems: 'center', paddingVertical: 12 }} /* TODO: w-full */>
              <Text style={{ fontSize: 20 }}>🥉</Text>
              <Text style={{ fontSize: 12, color: '#FFFFFF', fontWeight: '700', marginTop: 4 }}>{mockLeaderboard[2].name.split(' ')[0]}</Text>
              <Text style={{ fontSize: 14, color: '#FFFFFF', fontWeight: '800' }}>{mockLeaderboard[2].points}</Text>
            </View>
          </View>
        </View>

        {/* Rest of the list */}
        <View style={{ paddingHorizontal: 20 }}>
          {mockLeaderboard.slice(3).map((entry) => (
            <View
              key={entry.rank}
              style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8, borderWidth: 1, backgroundColor: entry.isMe ? '#E8F5EC' : '#FFFFFF',
                borderColor: entry.isMe ? '#1A5C37' : '#E8F0EC', }}
            >
              <Text style={{ width: 28, fontSize: 14, fontWeight: '700', color: '#5A7264' }}>#{entry.rank}</Text>
              <Text style={{ fontSize: 20, marginRight: 12 }}>{entry.avatar}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A2E23' }}>{entry.name}</Text>
                <Text style={{ fontSize: 12, color: '#5A7264' }}>🔥 {entry.streak} gün serisi</Text>
              </View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A2E23' }}>{entry.points}</Text>
            </View>
          ))}
        </View>

        {/* My position */}
        <View style={{ marginHorizontal: 20, marginTop: 16, marginBottom: 32, backgroundColor: '#1A2E23', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: '#FFFFFF', fontWeight: '700', marginRight: 12 }}>#{myEntry.rank}</Text>
          <Text style={{ fontSize: 20, marginRight: 8 }}>{myEntry.avatar}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>Senin Sıran</Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{myEntry.points} puan · {myEntry.streak} gün serisi</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  )
}

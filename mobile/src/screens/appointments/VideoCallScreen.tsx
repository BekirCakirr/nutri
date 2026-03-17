import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

export default function VideoCallScreen() {
  const navigation = useNavigation()
  const [isMicMuted, setIsMicMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  return (
    <View className="flex-1 bg-[#1A2E23]">
      {/* Remote Video Placeholder */}
      <View className="absolute inset-0 items-center justify-center">
        {!isVideoOff && (
          <Image
            source={{ uri: 'https://i.pravatar.cc/600?img=32' }}
            className="w-full h-full opacity-60 absolute"
            resizeMode="cover"
          />
        )}
        <View className="items-center">
           <View className="w-24 h-24 rounded-full bg-[#1A5C37] items-center justify-center mb-4">
             <Text className="text-3xl font-extrabold text-white">B</Text>
           </View>
           <Text className="text-2xl font-bold text-white mb-1 shadow-sm">Dyt. Buse Hanım</Text>
           <Text className="text-[#E8F5EC] text-base font-medium">10:45</Text>
        </View>
      </View>

      {/* Local Video Placeholder */}
      {!isVideoOff && (
        <View className="absolute top-16 right-5 w-32 h-44 bg-black rounded-2xl border-2 border-white/20 overflow-hidden shadow-lg">
          <Image
            source={{ uri: 'https://i.pravatar.cc/300?img=11' }}
            className="w-full h-full opacity-80"
            resizeMode="cover"
          />
        </View>
      )}

      {/* Header Controls */}
      <View className="absolute top-14 left-5">
         <TouchableOpacity 
           className="w-10 h-10 rounded-full bg-black/40 items-center justify-center"
           onPress={() => navigation.goBack()}
         >
           <Ionicons name="expand" size={20} color="#FFF" />
         </TouchableOpacity>
      </View>

      {/* Bottom Controls */}
      <View className="absolute bottom-12 w-full flex-row justify-center items-center gap-6 px-4">
        <TouchableOpacity 
          className={`w-14 h-14 rounded-full items-center justify-center ${isMicMuted ? 'bg-white' : 'bg-[#E8F5EC]/20'}`}
          onPress={() => setIsMicMuted(!isMicMuted)}
        >
          <Ionicons name={isMicMuted ? "mic-off" : "mic"} size={26} color={isMicMuted ? "#1A2E23" : "#FFF"} />
        </TouchableOpacity>

        <TouchableOpacity 
          className="w-16 h-16 rounded-full bg-[#EF4444] items-center justify-center shadow-lg shadow-red-500/30"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="call" size={28} color="#FFF" style={{ transform: [{ rotate: '135deg' }] }} />
        </TouchableOpacity>

        <TouchableOpacity 
           className={`w-14 h-14 rounded-full items-center justify-center ${isVideoOff ? 'bg-white' : 'bg-[#E8F5EC]/20'}`}
           onPress={() => setIsVideoOff(!isVideoOff)}
        >
           <Ionicons name={isVideoOff ? "videocam-off" : "videocam"} size={26} color={isVideoOff ? "#1A2E23" : "#FFF"} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

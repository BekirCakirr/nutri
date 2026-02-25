import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Mic,
  MicOff,
  VideoIcon,
  VideoOff,
  MonitorUp,
  PhoneOff,
  MessageSquare,
  User,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function VideoCallPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const handleEndCall = () => {
    navigate('/appointments')
  }

  return (
    <div className="h-screen bg-gray-900 flex">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        {/* Video */}
        <div className="flex-1 relative">
          {/* Remote Video (placeholder) */}
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <div className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarFallback className="text-3xl bg-gray-700 text-gray-300">AY</AvatarFallback>
              </Avatar>
              <p className="text-white text-lg font-medium">Ayşe Yılmaz</p>
              <p className="text-gray-400 text-sm mt-1">Bağlantı kuruluyor...</p>
            </div>
          </div>

          {/* Self View */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-700 rounded-lg border-2 border-gray-600 flex items-center justify-center">
            {isVideoOn ? (
              <div className="text-center">
                <User className="h-10 w-10 text-gray-400 mx-auto" />
                <p className="text-gray-400 text-xs mt-1">Siz</p>
              </div>
            ) : (
              <div className="text-center">
                <VideoOff className="h-8 w-8 text-gray-500 mx-auto" />
                <p className="text-gray-500 text-xs mt-1">Kamera kapalı</p>
              </div>
            )}
          </div>

          {/* Timer */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <Badge variant="secondary" className="bg-gray-800/80 text-white border-gray-600">
              <Clock className="h-3 w-3 mr-1" />
              {formatTime(elapsed)}
            </Badge>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-gray-800 border-t border-gray-700 p-4">
          <div className="flex items-center justify-center gap-3">
            <Button
              variant={isMuted ? 'destructive' : 'secondary'}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button
              variant={!isVideoOn ? 'destructive' : 'secondary'}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
            <Button
              variant={isScreenSharing ? 'default' : 'secondary'}
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => setIsScreenSharing(!isScreenSharing)}
            >
              <MonitorUp className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <div className="w-4" />
            <Button
              variant="destructive"
              size="icon"
              className="h-14 w-14 rounded-full"
              onClick={handleEndCall}
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Patient Info Sidebar */}
      {showSidebar && (
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-semibold">Hasta Bilgileri</h3>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            <div className="text-center">
              <Avatar className="h-16 w-16 mx-auto mb-2">
                <AvatarFallback className="bg-gray-700 text-gray-300">AY</AvatarFallback>
              </Avatar>
              <p className="text-white font-medium">Ayşe Yılmaz</p>
              <p className="text-gray-400 text-sm">32 yaş &middot; Kadın</p>
            </div>

            <Separator className="bg-gray-700" />

            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-xs">Hedef</p>
                <p className="text-gray-200 text-sm">Kilo Verme</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Mevcut Kilo</p>
                <p className="text-gray-200 text-sm">72 kg</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">BMI</p>
                <p className="text-gray-200 text-sm">26.4</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Uyum Skoru</p>
                <p className="text-gray-200 text-sm">%87</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Aktif Plan</p>
                <p className="text-gray-200 text-sm">Kilo Verme Programı - Hafta 8</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Alerjiler</p>
                <p className="text-gray-200 text-sm">Gluten, Laktoz</p>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            <div>
              <p className="text-gray-400 text-xs mb-2">Son Notlar</p>
              <p className="text-gray-300 text-sm">
                Kilo verme hedefinde iyi ilerliyor. Su tüketimini artırması gerekiyor.
                Protein alımı yeterli seviyede.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

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
  Heart,
  Target,
  Scale,
  Activity,
  Apple,
  AlertCircle,
  StickyNote,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export default function VideoCallPage() {
  const { id: _id } = useParams()
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
    <div className="h-screen bg-gray-950 flex">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        {/* Video */}
        <div className="flex-1 relative">
          {/* Remote Video (placeholder with telemed background) */}
          <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=800"
              alt="Telekonsültasyon"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/60 to-gray-950/90" />
            <div className="text-center animate-fade-up relative z-10">
              <Avatar className="h-28 w-28 mx-auto mb-4 ring-4 ring-gray-700/50">
                <AvatarFallback className="text-3xl bg-gray-800 text-gray-300">AY</AvatarFallback>
              </Avatar>
              <p className="text-white text-lg font-semibold tracking-tight">Ayse Yılmaz</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-gray-400 text-sm">Baglantı kuruluyor...</p>
              </div>
            </div>
          </div>

          {/* Self View */}
          <div
            className={cn(
              'absolute bottom-4 right-4 w-48 h-36 rounded-xl overflow-hidden',
              'border-2 border-gray-700/80 bg-gray-800',
              'shadow-xl transition-all duration-300',
              'flex items-center justify-center',
            )}
          >
            {isVideoOn ? (
              <div className="text-center">
                <User className="h-10 w-10 text-gray-500 mx-auto" />
                <p className="text-gray-500 text-xs mt-1.5 font-medium">Siz</p>
              </div>
            ) : (
              <div className="text-center">
                <VideoOff className="h-8 w-8 text-gray-600 mx-auto" />
                <p className="text-gray-600 text-xs mt-1.5">Kamera kapalı</p>
              </div>
            )}
          </div>

          {/* Timer */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <Badge
              variant="secondary"
              className="bg-gray-900/80 text-white border-gray-700/50 backdrop-blur-sm px-3 py-1 text-sm"
            >
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              <span className="tabular-nums font-medium">{formatTime(elapsed)}</span>
            </Badge>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 px-6 py-4">
          <div className="flex items-center justify-center gap-3">
            {/* Mute */}
            <Button
              variant={isMuted ? 'destructive' : 'secondary'}
              size="icon"
              className={cn(
                'h-12 w-12 rounded-full transition-all duration-200',
                !isMuted && 'bg-gray-700 hover:bg-gray-600 text-white border-0',
              )}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            {/* Camera */}
            <Button
              variant={!isVideoOn ? 'destructive' : 'secondary'}
              size="icon"
              className={cn(
                'h-12 w-12 rounded-full transition-all duration-200',
                isVideoOn && 'bg-gray-700 hover:bg-gray-600 text-white border-0',
              )}
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>

            {/* Screen Share */}
            <Button
              variant="secondary"
              size="icon"
              className={cn(
                'h-12 w-12 rounded-full transition-all duration-200',
                isScreenSharing
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-gray-700 hover:bg-gray-600 text-white border-0',
              )}
              onClick={() => setIsScreenSharing(!isScreenSharing)}
            >
              <MonitorUp className="h-5 w-5" />
            </Button>

            {/* Sidebar toggle */}
            <Button
              variant="secondary"
              size="icon"
              className={cn(
                'h-12 w-12 rounded-full transition-all duration-200',
                showSidebar
                  ? 'bg-primary/20 text-primary hover:bg-primary/30 border-0'
                  : 'bg-gray-700 hover:bg-gray-600 text-white border-0',
              )}
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>

            <div className="w-3" />

            {/* End Call */}
            <Button
              variant="destructive"
              size="icon"
              className="h-14 w-14 rounded-full shadow-lg shadow-red-500/20"
              onClick={handleEndCall}
            >
              <PhoneOff className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Patient Info Sidebar */}
      {showSidebar && (
        <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col animate-fade-up">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-white font-semibold text-sm tracking-tight">Hasta Bilgileri</h3>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            {/* Patient card */}
            <div className="text-center py-2">
              <Avatar className="h-16 w-16 mx-auto mb-2 ring-2 ring-gray-700">
                <AvatarFallback className="bg-gray-800 text-gray-300">AY</AvatarFallback>
              </Avatar>
              <p className="text-white font-medium">Ayse Yılmaz</p>
              <p className="text-gray-400 text-sm">32 yas - Kadın</p>
            </div>

            <Separator className="bg-gray-800" />

            {/* Info items */}
            <div className="space-y-3">
              {[
                { icon: Target, label: 'Hedef', value: 'Kilo Verme' },
                { icon: Scale, label: 'Mevcut Kilo', value: '72 kg' },
                { icon: Activity, label: 'BMI', value: '26.4' },
                { icon: Heart, label: 'Uyum Skoru', value: '%87' },
                { icon: Apple, label: 'Aktif Plan', value: 'Kilo Verme Programı - Hafta 8' },
                { icon: AlertCircle, label: 'Alerjiler', value: 'Gluten, Laktoz' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 rounded-lg bg-gray-800/50 p-3">
                  <Icon className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-gray-500 text-xs">{label}</p>
                    <p className="text-gray-200 text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="bg-gray-800" />

            {/* Notes */}
            <div className="rounded-lg bg-gray-800/50 p-3">
              <div className="flex items-center gap-2 mb-2">
                <StickyNote className="h-3.5 w-3.5 text-gray-500" />
                <p className="text-gray-500 text-xs font-medium">Son Notlar</p>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Kilo verme hedefinde iyi ilerliyor. Su tuketimini artırması gerekiyor.
                Protein alımı yeterli seviyede.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

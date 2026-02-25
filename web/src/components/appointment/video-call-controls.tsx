import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Camera, CameraOff, Monitor, PhoneOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoCallControlsProps {
  onEndCall?: () => void;
  onToggleMic?: (muted: boolean) => void;
  onToggleCamera?: (off: boolean) => void;
  onScreenShare?: () => void;
  className?: string;
}

export function VideoCallControls({
  onEndCall,
  onToggleMic,
  onToggleCamera,
  onScreenShare,
  className,
}: VideoCallControlsProps) {
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  function handleMicToggle() {
    setMicMuted((prev) => {
      onToggleMic?.(!prev);
      return !prev;
    });
  }

  function handleCameraToggle() {
    setCameraOff((prev) => {
      onToggleCamera?.(!prev);
      return !prev;
    });
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 rounded-xl bg-background/80 backdrop-blur p-3 border shadow-lg",
        className,
      )}
    >
      <Button
        variant={micMuted ? "destructive" : "outline"}
        size="icon"
        className="h-12 w-12 rounded-full"
        onClick={handleMicToggle}
      >
        {micMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>

      <Button
        variant={cameraOff ? "destructive" : "outline"}
        size="icon"
        className="h-12 w-12 rounded-full"
        onClick={handleCameraToggle}
      >
        {cameraOff ? <CameraOff className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="h-12 w-12 rounded-full"
        onClick={onScreenShare}
      >
        <Monitor className="h-5 w-5" />
      </Button>

      <Button
        variant="destructive"
        size="icon"
        className="h-12 w-12 rounded-full"
        onClick={onEndCall}
      >
        <PhoneOff className="h-5 w-5" />
      </Button>
    </div>
  );
}

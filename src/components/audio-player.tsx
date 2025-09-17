import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  List,
} from "lucide-react";

interface PodcastSegment {
  id: string;
  title: string;
  podcast: string;
  duration: string;
  tags: string[];
}

interface AudioPlayerProps {
  currentSegment: PodcastSegment | null;
  playlist: PodcastSegment[];
  currentIndex: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onTogglePlaylist: () => void;
}

export function AudioPlayer({
  currentSegment,
  playlist,
  currentIndex,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onTogglePlaylist,
}: AudioPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<
    "none" | "all" | "one"
  >("none");

  // Mock progress simulation
  useEffect(() => {
    if (!isPlaying || !currentSegment) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const newTime = prev + 1;
        if (newTime >= duration) {
          onNext();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentSegment, duration, onNext]);

  // Mock duration setting
  useEffect(() => {
    if (currentSegment) {
      // Mock duration - in real app would get from audio metadata
      setDuration(Math.floor(Math.random() * 300) + 180); // 3-8 minutes
      setCurrentTime(0);
    }
  }, [currentSegment]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    setIsMuted(vol === 0);
    onVolumeChange(vol);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    onVolumeChange(isMuted ? volume : 0);
  };

  const handleSeek = (newTime: number[]) => {
    const time = newTime[0];
    setCurrentTime(time);
    onSeek(time);
  };

  if (!currentSegment) {
    return (
      <div className="h-20 bg-card border-t flex items-center justify-center text-muted-foreground">
        <p>Select a segment or SuperPod to preview or listen</p>
      </div>
    );
  }

  return (
    <div className="h-20 bg-card border-t flex items-center px-4 gap-4">
      {/* Current segment info */}
      <div className="min-w-0 flex-1 max-w-xs">
        <h4 className="truncate text-sm">
          {currentSegment.title}
        </h4>
        <p className="truncate text-xs text-muted-foreground">
          {currentSegment.podcast}
        </p>
        <div className="flex gap-1 mt-1">
          {currentSegment.tags.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs px-1 py-0"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Main controls */}
      <div className="flex-1 max-w-2xl space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsShuffled(!isShuffled)}
            className={`h-8 w-8 p-0 ${isShuffled ? "text-primary" : "text-muted-foreground"}`}
          >
            <Shuffle className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onPrevious}
            disabled={
              currentIndex === 0 && repeatMode === "none"
            }
            className="h-8 w-8 p-0"
          >
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            onClick={isPlaying ? onPause : onPlay}
            className="h-10 w-10 p-0 rounded-full"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={onNext}
            disabled={
              currentIndex === playlist.length - 1 &&
              repeatMode === "none"
            }
            className="h-8 w-8 p-0"
          >
            <SkipForward className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              const modes: ("none" | "all" | "one")[] = [
                "none",
                "all",
                "one",
              ];
              const currentIdx = modes.indexOf(repeatMode);
              setRepeatMode(
                modes[(currentIdx + 1) % modes.length],
              );
            }}
            className={`h-8 w-8 p-0 ${repeatMode !== "none" ? "text-primary" : "text-muted-foreground"}`}
          >
            <Repeat className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 text-xs text-[12px]">
          <span className="text-muted-foreground">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={handleSeek}
            className="flex-1"
          />
          <span className="text-muted-foreground">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume and playlist controls */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={toggleMute}
          className="h-8 w-8 p-0"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </Button>

        <Slider
          value={[isMuted ? 0 : volume]}
          max={100}
          step={1}
          onValueChange={handleVolumeChange}
          className="w-20"
        />

        <Button
          size="sm"
          variant="ghost"
          onClick={onTogglePlaylist}
          className="h-8 w-8 p-0"
        >
          <List className="w-4 h-4" />
        </Button>

        <div className="text-xs text-muted-foreground">
          {currentIndex + 1} / {playlist.length}
        </div>
      </div>
    </div>
  );
}
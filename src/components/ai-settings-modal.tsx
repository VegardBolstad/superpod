import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Volume2, Mic, Brain, Zap } from "lucide-react";

interface AISettings {
  enableNarration: boolean;
  enableSummaries: boolean;
  enableTransitions: boolean;
  voiceStyle: string;
  speakingSpeed: number;
  summaryLength: string;
  transitionStyle: string;
}

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onSave: (settings: AISettings) => void;
}

export function AISettingsModal({ isOpen, onClose, settings, onSave }: AISettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<AISettings>(settings);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings: AISettings = {
      enableNarration: true,
      enableSummaries: true,
      enableTransitions: true,
      voiceStyle: "neutral",
      speakingSpeed: 1.0,
      summaryLength: "brief",
      transitionStyle: "smooth"
    };
    setLocalSettings(defaultSettings);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Voice Narration Settings
          </DialogTitle>
          <DialogDescription>
            Customize how AI narrates your SuperPods to optimize your learning experience and build trust in the system.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Controls */}
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    Enable AI Narration
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Turn on AI voice narration for your SuperPods
                  </p>
                </div>
                <Switch
                  checked={localSettings.enableNarration}
                  onCheckedChange={(checked) =>
                    setLocalSettings(prev => ({ ...prev, enableNarration: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Segment Summaries
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    AI will summarize previous segments before moving to the next
                  </p>
                </div>
                <Switch
                  checked={localSettings.enableSummaries}
                  onCheckedChange={(checked) =>
                    setLocalSettings(prev => ({ ...prev, enableSummaries: checked }))
                  }
                  disabled={!localSettings.enableNarration}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Smooth Transitions</Label>
                  <p className="text-xs text-muted-foreground">
                    AI will provide context when transitioning between segments
                  </p>
                </div>
                <Switch
                  checked={localSettings.enableTransitions}
                  onCheckedChange={(checked) =>
                    setLocalSettings(prev => ({ ...prev, enableTransitions: checked }))
                  }
                  disabled={!localSettings.enableNarration}
                />
              </div>
            </div>
          </Card>

          {/* Voice Configuration */}
          {localSettings.enableNarration && (
            <Card className="p-4">
              <div className="space-y-4">
                <h4 className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Voice Configuration
                </h4>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Voice Style</Label>
                    <Select
                      value={localSettings.voiceStyle}
                      onValueChange={(value) =>
                        setLocalSettings(prev => ({ ...prev, voiceStyle: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Speaking Speed</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[localSettings.speakingSpeed]}
                        onValueChange={([value]) =>
                          setLocalSettings(prev => ({ ...prev, speakingSpeed: value }))
                        }
                        min={0.5}
                        max={2.0}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Slow (0.5x)</span>
                        <span>Normal ({localSettings.speakingSpeed.toFixed(1)}x)</span>
                        <span>Fast (2.0x)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Summary Configuration */}
          {localSettings.enableNarration && localSettings.enableSummaries && (
            <Card className="p-4">
              <div className="space-y-4">
                <h4>Summary Configuration</h4>

                <div className="space-y-2">
                  <Label>Summary Length</Label>
                  <Select
                    value={localSettings.summaryLength}
                    onValueChange={(value) =>
                      setLocalSettings(prev => ({ ...prev, summaryLength: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brief">Brief (15-30 seconds)</SelectItem>
                      <SelectItem value="moderate">Moderate (30-60 seconds)</SelectItem>
                      <SelectItem value="detailed">Detailed (60-90 seconds)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Transition Style</Label>
                  <Select
                    value={localSettings.transitionStyle}
                    onValueChange={(value) =>
                      setLocalSettings(prev => ({ ...prev, transitionStyle: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smooth">Smooth (gentle transitions)</SelectItem>
                      <SelectItem value="direct">Direct (quick transitions)</SelectItem>
                      <SelectItem value="educational">Educational (learning focused)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          )}

          {/* Preview */}
          <Card className="p-4 bg-muted/50">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Preview</Badge>
                <span className="text-sm">How your narration will sound:</span>
              </div>
              <p className="text-sm text-muted-foreground italic">
                {localSettings.enableNarration ? (
                  <>
                    {localSettings.enableSummaries && "\"We just learned about AI in creative industries. "} 
                    {localSettings.enableTransitions && "Now let's explore the ethical implications of machine learning...\""}
                    {!localSettings.enableSummaries && !localSettings.enableTransitions && "\"Playing next segment: Machine Learning Ethics and Society\""}
                  </>
                ) : (
                  "Narration is disabled. Only audio content will play."
                )}
              </p>
            </div>
          </Card>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
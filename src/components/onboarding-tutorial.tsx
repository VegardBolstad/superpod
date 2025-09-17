import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { X, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

interface OnboardingTutorialProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
}

interface TutorialStep {
  title: string;
  content: string;
  targetSelector?: string;
  highlightArea?: {
    selector: string;
    padding?: number;
  };
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to SuperPod!",
    content: "Let's take a quick tour of how to create amazing podcast experiences. This tutorial will show you each section of the app and how they work together."
  },
  {
    title: "Search Section",
    content: "Start by searching for terms or concepts, filtering by tags, categories and sources if you want. You can collapse or open this section, using this button.",
    targetSelector: ".search-interface",
    highlightArea: {
      selector: ".search-interface",
      padding: 12
    }
  },
  {
    title: "Graph View",
    content: "Your results appear here, with related search terms lining the edges. Drag to scroll, scroll to zoom, or use the buttons in the top left of the results view. Click the nodes to view more info, preview and add to a SuperPod.",
    targetSelector: ".knowledge-graph",
    highlightArea: {
      selector: ".knowledge-graph",
      padding: 12
    }
  },
  {
    title: "My SuperPods Sidebar",
    content: "As you add segments, your SuperPods appear here. You can rearrange sections, adjust settings and save your SuperPods for later. SuperPods can be configured with AI-narrated sections, between segments, to provide context and summaries along the way. You can open and close the sidebar here.",
    targetSelector: ".superpod-sidebar",
    highlightArea: {
      selector: ".superpod-sidebar",
      padding: 12
    }
  },
  {
    title: "Menu and Navigation",
    content: "Finally, the menu contains access to settings, help and your user account, and you can set the interface to light or dark mode, using the icon, right next to the menu button.",
    targetSelector: "[data-menu]",
    highlightArea: {
      selector: "[data-menu]",
      padding: 8
    }
  },
  {
    title: "You're All Set!",
    content: "Enjoy exploring content, and building your own modular SuperPod experiences. If you want, you can view this tutorial again via the menu."
  }
];

export function OnboardingTutorial({ 
  isOpen, 
  onClose, 
  currentStep, 
  onNext, 
  onPrevious, 
  onSkip 
}: OnboardingTutorialProps) {
  const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({});
  
  const step = tutorialSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tutorialSteps.length - 1;

  // Calculate spotlight position and create cutout effect
  useEffect(() => {
    if (!isOpen) {
      setSpotlightStyle({});
      return;
    }

    if (!step?.highlightArea) {
      // No spotlight for welcome/completion steps
      setSpotlightStyle({});
      return;
    }

    const element = document.querySelector(step.highlightArea.selector);
    if (element) {
      const rect = element.getBoundingClientRect();
      const padding = step.highlightArea.padding || 0;
      
      // Create a spotlight effect using box-shadow with a cutout
      const spotlightX = rect.left - padding;
      const spotlightY = rect.top - padding;
      const spotlightWidth = rect.width + padding * 2;
      const spotlightHeight = rect.height + padding * 2;
      
      setSpotlightStyle({
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 55,
        boxShadow: `
          0 0 0 ${spotlightY}px rgba(0, 0, 0, 0.4),
          0 0 0 ${spotlightX}px rgba(0, 0, 0, 0.4),
          ${spotlightWidth}px 0 0 ${window.innerWidth - spotlightX - spotlightWidth}px rgba(0, 0, 0, 0.4),
          0 ${spotlightHeight}px 0 ${window.innerHeight - spotlightY - spotlightHeight}px rgba(0, 0, 0, 0.4)
        `,
        clipPath: `polygon(
          0% 0%, 
          0% 100%, 
          ${spotlightX}px 100%, 
          ${spotlightX}px ${spotlightY}px, 
          ${spotlightX + spotlightWidth}px ${spotlightY}px, 
          ${spotlightX + spotlightWidth}px ${spotlightY + spotlightHeight}px, 
          ${spotlightX}px ${spotlightY + spotlightHeight}px, 
          ${spotlightX}px 100%, 
          100% 100%, 
          100% 0%
        )`
      });
    }
  }, [currentStep, isOpen, step]);

  // Always center the popup for consistent experience
  const getPopupStyle = (): React.CSSProperties => {
    return {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 70,
      maxWidth: '420px',
      width: 'calc(100vw - 2rem)'
    };
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Spotlight overlay - only for steps with highlight areas */}
      {step.highlightArea ? (
        <div style={spotlightStyle} />
      ) : (
        /* Simple overlay for welcome/completion screens */
        <div 
          className="fixed inset-0 bg-black/30 z-50"
          onClick={onSkip}
        />
      )}

      {/* Highlight border for target element */}
      {step.highlightArea && (
        <div 
          className="fixed pointer-events-none z-60 border-2 border-blue-500 rounded-lg shadow-lg"
          style={{
            top: `${document.querySelector(step.highlightArea.selector)?.getBoundingClientRect().top! - (step.highlightArea.padding || 0)}px`,
            left: `${document.querySelector(step.highlightArea.selector)?.getBoundingClientRect().left! - (step.highlightArea.padding || 0)}px`,
            width: `${document.querySelector(step.highlightArea.selector)?.getBoundingClientRect().width! + (step.highlightArea.padding || 0) * 2}px`,
            height: `${document.querySelector(step.highlightArea.selector)?.getBoundingClientRect().height! + (step.highlightArea.padding || 0) * 2}px`,
            animation: 'tutorial-pulse 2s infinite'
          }}
        />
      )}

      {/* Tutorial popup - Always centered */}
      <Card 
        className="shadow-2xl border-2 bg-background/95 backdrop-blur-sm" 
        style={getPopupStyle()}
      >
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg">{step.title}</h3>
              </div>
              <Badge variant="secondary" className="text-xs">
                Step {currentStep + 1} of {tutorialSteps.length}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="h-8 w-8 p-0 opacity-70 hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step.content}
          </p>

          {/* Progress bar */}
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-2">
            <div className="flex gap-2">
              {!isFirstStep && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPrevious}
                  className="h-8"
                >
                  <ArrowLeft className="w-3 h-3 mr-1" />
                  Previous
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={onSkip}
                className="h-8 text-muted-foreground"
              >
                Skip Tutorial
              </Button>
            </div>

            {isLastStep ? (
              <Button
                size="sm"
                onClick={onClose}
                className="h-8"
              >
                I Got It!
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={onNext}
                className="h-8"
              >
                Next
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      <style>{`
        @keyframes tutorial-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.01);
          }
        }
      `}</style>
    </>
  );
}
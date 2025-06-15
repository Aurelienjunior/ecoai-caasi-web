
import React, { useEffect, useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

/**
 * For first-time users, display a helpful onboarding tooltip.
 * Automatically remembers dismissal in local storage.
 */
const OnboardingTooltip = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show only if never dismissed and first login
    const dismissed = window.localStorage.getItem("ecoai-onboard-dismissed");
    if (!dismissed) setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed left-4 bottom-24 z-50">
      <Tooltip open={show}>
        <TooltipTrigger asChild>
          <button
            aria-label="Close onboarding tip"
            className="rounded-full focus:outline-none bg-primary text-primary-foreground p-2 animate-bounce"
            onClick={() => {
              setShow(false);
              window.localStorage.setItem("ecoai-onboard-dismissed", "yes");
            }}
          >
            <HelpCircle className="w-6 h-6"/>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs text-left">
          <div className="text-base font-bold mb-2">Welcome to EcoAI!</div>
          <ul className="list-disc pl-4 text-sm leading-tight">
            <li>Snap or upload waste to get a price.</li>
            <li>Book instant pickup – <b>Book Now</b>!</li>
            <li>View your history in <b>History</b>.</li>
            <li>Edit profile in the avatar menu.</li>
          </ul>
          <div className="text-xs text-muted-foreground mt-2">
            Dismiss this tip by clicking the icon.
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default OnboardingTooltip;

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const Index = () => {
  const [accepted, setAccepted] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize NO button position
  useEffect(() => {
    if (!accepted) {
      positionNoButton(true);
    }
  }, [accepted]);

  // Track mouse movement
  useEffect(() => {
    if (accepted) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [accepted]);

  // Check proximity and teleport if needed
  useEffect(() => {
    if (accepted || !noButtonRef.current) return;

    const noButton = noButtonRef.current;
    const rect = noButton.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;

    const distance = Math.sqrt(
      Math.pow(mousePosition.x - buttonCenterX, 2) +
      Math.pow(mousePosition.y - buttonCenterY, 2)
    );

    if (distance < 70) {
      teleportNoButton();
    }
  }, [mousePosition, accepted]);

  const positionNoButton = (initial = false) => {
    if (!noButtonRef.current) return;

    const buttonWidth = noButtonRef.current.offsetWidth || 120;
    const buttonHeight = noButtonRef.current.offsetHeight || 48;

    const maxX = window.innerWidth - buttonWidth - 20;
    const maxY = window.innerHeight - buttonHeight - 20;

    let newX, newY;

    if (initial) {
      // Initial position: bottom right area
      newX = Math.max(10, maxX - 20);
      newY = Math.max(10, maxY - 20);
    } else {
      // Random position, clamped to viewport
      newX = Math.max(10, Math.random() * maxX);
      newY = Math.max(10, Math.random() * maxY);
    }

    setNoButtonPosition({ x: newX, y: newY });
  };

  const teleportNoButton = () => {
    if (!noButtonRef.current || !yesButtonRef.current) return;

    const yesButton = yesButtonRef.current;
    const yesRect = yesButton.getBoundingClientRect();
    const buttonWidth = noButtonRef.current.offsetWidth || 120;
    const buttonHeight = noButtonRef.current.offsetHeight || 48;

    const maxX = window.innerWidth - buttonWidth - 20;
    const maxY = window.innerHeight - buttonHeight - 20;

    let attempts = 0;
    let newX, newY;

    do {
      newX = Math.max(10, Math.random() * maxX);
      newY = Math.max(10, Math.random() * maxY);

      const distanceToYes = Math.sqrt(
        Math.pow(newX + buttonWidth / 2 - (yesRect.left + yesRect.width / 2), 2) +
        Math.pow(newY + buttonHeight / 2 - (yesRect.top + yesRect.height / 2), 2)
      );

      if (distanceToYes > 150 || attempts > 20) {
        break;
      }

      attempts++;
    } while (attempts < 30);

    setNoButtonPosition({ x: newX, y: newY });
  };

  const handleYesClick = () => {
    setAccepted(true);
  };

  if (accepted) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4 transition-all duration-150">
        <div className="border-thick border-secondary bg-primary p-12 flex flex-col items-center gap-6">
          <h1 className="text-2xl font-bold text-secondary uppercase tracking-tight text-center">
            GREAT CHOICE.
          </h1>
          <Heart className="w-12 h-12 text-secondary" strokeWidth={3} />
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden"
    >
      <div className="border-thick border-primary bg-background p-12 max-w-2xl w-full relative">
        <h1 className="text-2xl font-bold text-foreground uppercase tracking-tight text-center mb-12">
          DO YOU WANNA BE MY GIRLFRIEND?
        </h1>
        
        <div className="flex justify-center gap-8 relative h-32">
          <Button
            ref={yesButtonRef}
            onClick={handleYesClick}
            variant="brutalist-primary"
            className="font-bold uppercase text-sm tracking-wide"
          >
            YES
          </Button>

          <Button
            ref={noButtonRef}
            variant="brutalist-secondary"
            className="font-bold uppercase text-sm tracking-wide !bg-white !text-black !border-4 !border-black"
            style={{
              position: 'fixed',
              left: `${noButtonPosition.x}px`,
              top: `${noButtonPosition.y}px`,
              zIndex: 9999,
            }}
          >
            NO
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;

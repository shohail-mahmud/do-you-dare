import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const Index = () => {
  const [accepted, setAccepted] = useState(false);
  const [hasBeenHovered, setHasBeenHovered] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track mouse movement (only after first hover)
  useEffect(() => {
    if (accepted || !hasBeenHovered) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [accepted, hasBeenHovered]);

  // Check proximity and teleport if needed (only after first hover)
  useEffect(() => {
    if (accepted || !hasBeenHovered || !noButtonRef.current) return;

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
  }, [mousePosition, accepted, hasBeenHovered]);

  const handleNoButtonHover = () => {
    if (!hasBeenHovered) {
      setHasBeenHovered(true);
      teleportNoButton();
    }
  };

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

    const minDistanceFromCursor = 150;
    const minDistanceFromYes = 200;
    let attempts = 0;
    let newX, newY;

    do {
      newX = Math.max(10, Math.min(Math.random() * maxX, maxX));
      newY = Math.max(10, Math.min(Math.random() * maxY, maxY));

      // Check distance from cursor
      const distanceFromCursor = Math.sqrt(
        Math.pow(newX + buttonWidth / 2 - mousePosition.x, 2) +
        Math.pow(newY + buttonHeight / 2 - mousePosition.y, 2)
      );

      // Check distance from YES button
      const distanceFromYes = Math.sqrt(
        Math.pow(newX + buttonWidth / 2 - (yesRect.left + yesRect.width / 2), 2) +
        Math.pow(newY + buttonHeight / 2 - (yesRect.top + yesRect.height / 2), 2)
      );

      // Ensure position is far enough from both cursor and YES button, and within viewport
      if (
        distanceFromCursor >= minDistanceFromCursor &&
        distanceFromYes >= minDistanceFromYes &&
        newX >= 10 &&
        newX <= maxX &&
        newY >= 10 &&
        newY <= maxY
      ) {
        break;
      }

      attempts++;
    } while (attempts < 50);

    setNoButtonPosition({ x: newX, y: newY });
  };

  const handleYesClick = () => {
    setAccepted(true);
  };

  if (accepted) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="border-thick border-secondary bg-primary p-12 flex flex-col items-center gap-6">
          <h1 className="text-2xl font-bold text-secondary uppercase tracking-tight text-center">
            GREAT CHOICE :)
          </h1>
          <Heart className="w-12 h-12 text-secondary" strokeWidth={1.5} />
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
            className="font-bold uppercase text-sm tracking-wide transition-all duration-150 hover:!bg-primary hover:!text-primary-foreground hover:border-white hover:border-[2px]"
          >
            YES
          </Button>

          <Button
            ref={noButtonRef}
            onMouseEnter={handleNoButtonHover}
            variant="brutalist-secondary"
            className="font-bold uppercase text-sm tracking-wide !bg-white !text-black !border-4 !border-black"
            style={hasBeenHovered ? {
              position: 'fixed',
              left: `${noButtonPosition.x}px`,
              top: `${noButtonPosition.y}px`,
              zIndex: 9999,
            } : undefined}
          >
            NO
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;

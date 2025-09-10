import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-background">
      <div className="text-center space-y-6 p-8">
        <div className="text-8xl animate-bounce-gentle">🤔</div>
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Oops! This poll doesn't exist or has been encrypted beyond recognition.
        </p>
        <Button variant="emoji" size="lg" asChild>
          <a href="/">
            Return to Polls 🗳️
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

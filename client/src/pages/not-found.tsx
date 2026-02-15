import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center text-center space-y-6 max-w-md">
        <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-10 h-10" />
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight">404 Page Not Found</h1>
        
        <p className="text-muted-foreground text-lg">
          We couldn't find the page you were looking for. It might have been moved or deleted.
        </p>

        <Link href="/">
          <Button size="lg" className="mt-4">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

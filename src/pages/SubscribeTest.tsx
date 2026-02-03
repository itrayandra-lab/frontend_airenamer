import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const SubscribeTestPage = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold">Subscribe Page Test</h1>
        </div>
        
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Page is working!</h2>
          <p className="text-muted-foreground mb-4">
            URL Parameters: {window.location.search}
          </p>
          <p className="text-muted-foreground">
            This is a test version of the Subscribe page to ensure routing works correctly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscribeTestPage;
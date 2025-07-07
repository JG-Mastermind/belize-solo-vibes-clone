
import { useState } from "react";
import { useParams } from "react-router-dom";
import { adventures } from "@/data/adventures";
import { Progress } from "@/components/ui/progress";

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  
  const adventure = adventures.find(adv => adv.id === Number(id));
  
  if (!adventure) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Adventure not found</h1>
          <p className="mt-4 text-muted-foreground">The adventure you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentStep + 1) / adventure.steps.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{adventure.title}</h1>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Booking Progress</h2>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {adventure.steps.length}
            </span>
          </div>
          
          <Progress value={progressPercentage} className="mb-4" />
          
          <div className="flex justify-between">
            {adventure.steps.map((step, index) => (
              <div
                key={index}
                className={`text-xs px-2 py-1 rounded ${
                  index <= currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg mb-4">Current Step: {adventure.steps[currentStep]}</p>
          <div className="space-x-4">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(adventure.steps.length - 1, currentStep + 1))}
              disabled={currentStep === adventure.steps.length - 1}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;

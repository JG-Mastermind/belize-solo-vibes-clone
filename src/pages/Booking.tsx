
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { adventures } from "@/data/adventures";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const bookingFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  numberOfTravelers: z.number().min(1, "Must have at least 1 traveler").max(20, "Maximum 20 travelers"),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  
  const adventure = adventures.find(adv => adv.id === Number(id));
  
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      numberOfTravelers: 1,
    },
  });

  const onSubmit = (data: BookingFormData) => {
    console.log("Booking form submitted:", data);
    // Move to next step after form submission
    setCurrentStep(Math.min(adventure!.steps.length - 1, currentStep + 1));
  };
  
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
  const currentStepName = adventure.steps[currentStep];

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

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Current Step: {currentStepName}</h3>
          
          {currentStepName === "Your Info" && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Enter your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="numberOfTravelers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Travelers</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          max="20" 
                          placeholder="1" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  Continue to Next Step
                </Button>
              </form>
            </Form>
          )}
          
          {currentStepName !== "Your Info" && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {currentStepName === "Select Date" && "Please select your preferred date for this adventure."}
                {currentStepName === "Payment" && "Complete your payment to confirm the booking."}
                {currentStepName === "Confirmation" && "Your booking has been confirmed! You will receive a confirmation email shortly."}
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentStep(Math.min(adventure.steps.length - 1, currentStep + 1))}
              disabled={currentStep === adventure.steps.length - 1 || (currentStepName === "Your Info" && !form.formState.isValid)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;

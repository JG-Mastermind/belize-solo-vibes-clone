
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import { useStripePayment } from "@/hooks/useStripePayment";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { SignInModal } from "@/components/auth/SignInModal";
import { adventures } from "@/data/adventures";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { StripeProvider } from "@/components/StripeProvider";
import { StripePaymentForm } from "@/components/StripePaymentForm";
import { useCreatePaymentIntent } from "@/hooks/useCreatePaymentIntent";

const bookingFormSchema = z.object({
  bookingDate: z.date({
    required_error: "A booking date is required.",
  }),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  numberOfTravelers: z.coerce.number().min(1, "Must have at least 1 traveler").max(20, "Maximum 20 travelers"),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

const steps = ["Select Date", "Your Info", "Payment", "Confirmation"];

const Booking = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBooking, isLoading: isCreatingBooking, isAuthenticated } = useBookingFlow();
  const { createPaymentSession, isLoading: isCreatingPayment } = useStripePayment();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSignIn, setShowSignIn] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const { createPaymentIntent, clientSecret, isLoading: isCreatingPaymentIntent } = useCreatePaymentIntent();
  const [paymentIntentCreated, setPaymentIntentCreated] = useState(false);

  // First try to get adventure from local data (fallback for numeric IDs)
  const localAdventure = adventures.find(adv => adv.id.toString() === id);

  // Fetch adventure data from Supabase (for UUID adventures)
  const { data: dbAdventure, isLoading: isLoadingAdventure } = useQuery({
    queryKey: ['adventure', id],
    queryFn: async () => {
      if (!id) throw new Error('No adventure ID provided');
      
      // Only query database if it looks like a UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (!isUUID) return null;
      
      const { data, error } = await supabase
        .from('adventures')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  // Use either database adventure or local adventure with proper fallback
  const adventure = dbAdventure || (localAdventure ? {
    ...localAdventure,
    price_per_person: parseFloat(localAdventure.price.replace('$', ''))
  } : null);
  
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      bookingDate: undefined,
      fullName: user?.user_metadata?.first_name + " " + user?.user_metadata?.last_name || "",
      email: user?.email || "",
      phone: "",
      numberOfTravelers: 1,
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    if (!isAuthenticated) {
      setShowSignIn(true);
      return;
    }

    if (!adventure) {
      console.error('No adventure found');
      toast.error('Adventure not found');
      return;
    }

    // Use the proper adventure ID (either UUID from DB or local ID for fallback)
    const adventureId = dbAdventure?.id || (localAdventure ? 
      `550e8400-e29b-41d4-a716-44665544000${localAdventure.id}` : // Convert numeric to UUID format
      '550e8400-e29b-41d4-a716-446655440001' // Default fallback
    );

    const booking = await createBooking({
      adventureId: adventureId,
      bookingDate: data.bookingDate,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      numberOfTravelers: data.numberOfTravelers
    });

    if (booking) {
      setCreatedBooking(booking);
      // Automatically initialize payment intent when booking is created
      try {
        await createPaymentIntent({
          adventureTitle: adventure.title,
          totalAmount: booking.total_amount,
          userEmail: data.email,
          bookingId: booking.id
        });
        setPaymentIntentCreated(true);
        setCurrentStep(2); // Move to payment step
      } catch (error) {
        toast.error('Failed to initialize payment');
      }
    }
  };

  const handlePaymentSuccess = () => {
    setCurrentStep(3); // Move to confirmation step
    toast.success('Booking confirmed! Check your email for details.');
  };

  if (isLoadingAdventure) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading adventure details...</div>
      </div>
    );
  }
  
  if (!adventure) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Adventure not found</h1>
          <p className="mt-4 text-muted-foreground">The adventure you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Back to Adventures
          </Button>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  const currentStepName = steps[currentStep];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{adventure?.title || 'Adventure Booking'}</h1>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Booking Progress</h2>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          
          <Progress value={progressPercentage} className="mb-4" />
          
          <div className="flex justify-between">
            {steps.map((step, index) => (
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

        <Form {...form}>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Current Step: {currentStepName}</h3>
            
            {currentStep === 0 && (
              <FormField
                control={form.control}
                name="bookingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel className="text-lg font-semibold mb-4">Select Your Adventure Date</FormLabel>
                    <FormControl>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        className="rounded-md border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {currentStep === 1 && (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {!isAuthenticated && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800">Please sign in to continue with your booking.</p>
                    <Button 
                      type="button" 
                      onClick={() => setShowSignIn(true)}
                      className="mt-2"
                    >
                      Sign In
                    </Button>
                  </div>
                )}
                
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
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isCreatingBooking || !isAuthenticated}
                >
                  {isCreatingBooking ? "Creating Booking..." : "Continue to Payment"}
                </Button>
              </form>
            )}
            
            {currentStep === 2 && createdBooking && (
              <div className="space-y-6">
                {!paymentIntentCreated || isCreatingPaymentIntent ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Initializing secure payment...</p>
                  </div>
                ) : clientSecret ? (
                  <StripeProvider clientSecret={clientSecret}>
                    <StripePaymentForm
                      bookingData={{
                        adventureTitle: adventure?.title || 'Adventure',
                        bookingDate: form.getValues("bookingDate")?.toLocaleDateString() || '',
                        participants: createdBooking.participants,
                        totalAmount: createdBooking.total_amount,
                        fullName: form.getValues("fullName"),
                        email: form.getValues("email")
                      }}
                      onPaymentSuccess={handlePaymentSuccess}
                      isLoading={isCreatingPayment}
                    />
                  </StripeProvider>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-destructive mb-4">Failed to initialize payment</p>
                    <Button onClick={() => window.location.reload()} variant="outline">
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-green-800 mb-2">Booking Confirmed!</h2>
                  <p className="text-green-700">Thank you for your booking. A confirmation email is on its way to your inbox.</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-semibold text-green-800 border-b border-green-200 pb-2">Booking Summary</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-green-700">Adventure</p>
                      <p className="text-green-900">{adventure.title}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-green-700">Selected Date</p>
                      <p className="text-green-900">
                        {form.getValues("bookingDate")?.toLocaleDateString() || "Not selected"}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-green-700">Full Name</p>
                      <p className="text-green-900">{form.getValues("fullName") || "Not provided"}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-green-700">Number of Travelers</p>
                      <p className="text-green-900">{form.getValues("numberOfTravelers") || 1}</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    onClick={() => navigate("/")}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                  >
                    Explore More Adventures
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Form>

        {/* Navigation buttons */}
        <div className="text-center">
          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0 || (currentStep === 2 && (isCreatingPaymentIntent || !paymentIntentCreated))}
            >
              Previous
            </Button>
            {currentStep < 2 && (
              <Button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={currentStep === steps.length - 1 || 
                  (currentStep === 0 && !form.getValues("bookingDate")) ||
                  (currentStep === 1 && !form.formState.isValid)}
              >
                Next
              </Button>
            )}
          </div>
        </div>

        <SignInModal
          isOpen={showSignIn}
          onClose={() => setShowSignIn(false)}
          onSwitchToSignUp={() => {}}
        />
      </div>
    </div>
  );
};

export default Booking;

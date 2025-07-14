import { useState, useEffect } from "react";
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
import { SimplePaymentForm } from "@/components/SimplePaymentForm";

const bookingFormSchema = z.object({
  bookingDate: z.date({
    required_error: "A booking date is required.",
  }),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  numberOfTravelers: z.coerce.number().min(1, "Must have at least 1 traveler").max(20, "Maximum 20 travelers"),
  specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingFormSchema> & {
  specialRequests?: string;
};

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
        .eq('is_active', true)
        .single();
      
      if (error) {
        console.warn('Adventure not found in database:', id);
        return null;
      }
      
      // Transform to expected format
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        price_per_person: data.price_per_person || 0,
        location: data.location,
        duration: data.duration_hours ? `${data.duration_hours} hours` : 'Full Day',
        image: data.image_urls?.[0] || '',
        created_at: data.created_at,
        updated_at: data.updated_at
      };
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
      specialRequests: "",
    },
  });

  // Auto-create booking when user signs in at payment step
  useEffect(() => {
    const createBookingAfterAuth = async () => {
      if (currentStep === 2 && isAuthenticated && !createdBooking && adventure && user) {
        try {
          const formData = form.getValues();
          
          // Use the proper adventure ID (either UUID from DB or local ID for fallback)
          const adventureId = dbAdventure?.id || (localAdventure ? 
            `550e8400-e29b-41d4-a716-44665544000${localAdventure.id}` : // Convert numeric to UUID format
            '550e8400-e29b-41d4-a716-446655440001' // Default fallback
          );

          // Calculate total amount, handling both database and local adventure formats
          const pricePerPerson = adventure.price_per_person || 
            (localAdventure ? parseFloat(localAdventure.price.replace('$', '')) : 0);
          const totalAmount = pricePerPerson * formData.numberOfTravelers;

          // Create booking directly with Supabase
          const { data: bookingData, error } = await supabase
            .from('bookings')
            .insert({
              user_id: user.id,
              adventure_id: adventureId,
              booking_date: formData.bookingDate.toISOString().split('T')[0],
              participants: formData.numberOfTravelers,
              total_amount: totalAmount,
              special_requests: formData.specialRequests || null,
              status: 'pending',
              payment_status: 'pending'
            })
            .select()
            .single();

          if (error) {
            console.error('Error creating booking:', error);
            toast.error('Failed to create booking. Please try again.');
            return;
          }

          setCreatedBooking(bookingData);
          toast.success('Booking created! Please complete payment.');
        } catch (error) {
          console.error('Error in automatic booking creation:', error);
          toast.error('An error occurred. Please try again.');
        }
      }
    };

    createBookingAfterAuth();
  }, [currentStep, isAuthenticated, createdBooking, adventure, user, form, dbAdventure, localAdventure]);

  // Update form with user data when they sign in
  useEffect(() => {
    if (user && isAuthenticated) {
      const currentValues = form.getValues();
      const fullName = user.user_metadata?.first_name && user.user_metadata?.last_name 
        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
        : user.user_metadata?.full_name || currentValues.fullName;
      
      form.setValue('fullName', fullName);
      form.setValue('email', user.email || currentValues.email);
    }
  }, [user, isAuthenticated, form]);

  const onSubmit = async (data: BookingFormData) => {
    // Allow proceeding to step 1 (info collection) without authentication
    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }
    
    // Allow proceeding to step 2 (payment) without authentication
    // Authentication will be triggered at payment step
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }
    
    // Require authentication for actual booking creation at payment step
    if (!isAuthenticated) {
      setShowSignIn(true);
      return;
    }

    if (!adventure) {
      console.error('No adventure found');
      toast.error('Adventure not found');
      return;
    }

    if (!user) {
      toast.error('Please sign in to continue');
      return;
    }

    try {
      // Use the proper adventure ID (either UUID from DB or local ID for fallback)
      const adventureId = dbAdventure?.id || (localAdventure ? 
        `550e8400-e29b-41d4-a716-44665544000${localAdventure.id}` : // Convert numeric to UUID format
        '550e8400-e29b-41d4-a716-446655440001' // Default fallback
      );

      // Calculate total amount, handling both database and local adventure formats
      const pricePerPerson = adventure.price_per_person || 
        (localAdventure ? parseFloat(localAdventure.price.replace('$', '')) : 0);
      const totalAmount = pricePerPerson * data.numberOfTravelers;

      // Create booking directly with Supabase
      const { data: bookingData, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          adventure_id: adventureId,
          booking_date: data.bookingDate.toISOString().split('T')[0],
          participants: data.numberOfTravelers,
          total_amount: totalAmount,
          special_requests: data.specialRequests || null,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        toast.error('Failed to create booking. Please try again.');
        return;
      }

      setCreatedBooking(bookingData);
      setCurrentStep(2); // Move to payment step
      toast.success('Booking created! Please complete payment.');
    } catch (error) {
      console.error('Error in booking submission:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handlePaymentSuccess = async (paymentIntentId?: string) => {
    try {
      if (createdBooking && paymentIntentId) {
        // Update booking with payment confirmation
        const { error } = await supabase
          .from('bookings')
          .update({
            status: 'confirmed',
            payment_status: 'paid',
            payment_intent_id: paymentIntentId
          })
          .eq('id', createdBooking.id);

        if (error) {
          console.error('Error updating booking:', error);
          toast.error('Payment successful but booking update failed');
        }
      }
      
      setCurrentStep(3); // Move to confirmation step
      toast.success('Booking confirmed! Check your email for details.');
      
      // Redirect to confirmation page after a short delay
      setTimeout(() => {
        navigate('/confirmation', { 
          state: { 
            booking: createdBooking,
            adventure: adventure,
            formData: form.getValues()
          }
        });
      }, 2000);
    } catch (error) {
      console.error('Error in payment success handler:', error);
      toast.error('Payment successful but confirmation failed');
    }
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
    <div className="min-h-screen bg-background text-foreground">
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
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
              <div className="space-y-6">
                
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
                
                <FormField
                  control={form.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requests (Optional)</FormLabel>
                      <FormControl>
                        <textarea 
                          className="w-full p-3 border border-gray-300 rounded-md resize-vertical min-h-[80px]"
                          placeholder="Any special dietary requirements, accessibility needs, or other requests..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  onClick={form.handleSubmit(onSubmit)}
                  className="w-full"
                  disabled={isCreatingBooking}
                >
                  {isCreatingBooking ? "Creating Booking..." : "Continue to Payment"}
                </Button>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="space-y-6">
                {!isAuthenticated ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Ready to Secure Your Adventure?</h3>
                    <p className="text-blue-700 mb-4">Please sign in to complete your booking and payment.</p>
                    <Button 
                      onClick={() => setShowSignIn(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Sign In to Complete Booking
                    </Button>
                  </div>
                ) : createdBooking ? (
                  <SimplePaymentForm
                    bookingData={{
                      adventureTitle: adventure?.title || 'Adventure',
                      bookingDate: form.getValues("bookingDate")?.toLocaleDateString() || '',
                      participants: createdBooking.participants,
                      totalAmount: createdBooking.total_amount,
                      fullName: form.getValues("fullName"),
                      email: form.getValues("email"),
                      bookingId: createdBooking.id
                    }}
                    onPaymentSuccess={handlePaymentSuccess}
                    isLoading={isCreatingPayment}
                  />
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <p className="text-gray-700">Creating your booking...</p>
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
          </form>
        </Form>

        {/* Navigation buttons */}
        <div className="text-center">
          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0 || (currentStep === 2 && (false))}
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
    </div>
  );
};

export default Booking;

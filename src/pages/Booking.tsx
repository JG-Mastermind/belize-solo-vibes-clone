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
import { BookingService } from "@/services/bookingService";
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
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [selectedDateAvailability, setSelectedDateAvailability] = useState<{
    remainingSpots: number;
    isAvailable: boolean;
  } | null>(null);

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
            localAdventure.id.toString() : null
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

  // Load disabled dates when adventure changes
  useEffect(() => {
    const loadDisabledDates = async () => {
      if (!adventure) return;
      
      try {
        const adventureId = dbAdventure?.id || (localAdventure ? 
          localAdventure.id.toString() : null);
        
        if (!adventureId) return;
        
        const disabledDateStrings = await BookingService.getDisabledDates(adventureId, user?.id);
        const disabledDateObjects = disabledDateStrings.map(dateStr => new Date(dateStr));
        setDisabledDates(disabledDateObjects);
      } catch (error) {
        console.error('Error loading disabled dates:', error);
      }
    };

    loadDisabledDates();
  }, [adventure, user?.id, dbAdventure, localAdventure]);

  // Refresh disabled dates when a booking is made
  const refreshDisabledDates = async () => {
    if (!adventure) return;
    
    try {
      const adventureId = dbAdventure?.id || (localAdventure ? 
        localAdventure.id.toString() : null);
      
      if (!adventureId) return;
      
      const disabledDateStrings = await BookingService.getDisabledDates(adventureId, user?.id);
      const disabledDateObjects = disabledDateStrings.map(dateStr => new Date(dateStr));
      setDisabledDates(disabledDateObjects);
    } catch (error) {
      console.error('Error refreshing disabled dates:', error);
    }
  };

  // Function to check availability when a date is selected
  const handleDateSelection = async (date: Date | undefined) => {
    if (!date || !adventure) return;
    
    const adventureId = dbAdventure?.id || (localAdventure ? 
      localAdventure.id.toString() : null);
    
    if (!adventureId) return;
    
    const dateStr = date.toISOString().split('T')[0];
    
    try {
      const availability = await BookingService.checkDateAvailability(adventureId, dateStr);
      
      // Handle service errors gracefully
      if (availability.error) {
        toast.warning("Could not verify availability for this date. You can continue browsing, but availability will be confirmed at booking.");
        // Set optimistic availability state for UI
        setSelectedDateAvailability({
          remainingSpots: 8, // Optimistic default
          isAvailable: true
        });
        return;
      }
      
      setSelectedDateAvailability({
        remainingSpots: availability.remainingSpots,
        isAvailable: availability.isAvailable
      });
      
      // If the date is fully booked, show warning but allow selection for browsing
      if (availability.remainingSpots <= 0 && !availability.isBlocked) {
        toast.warning("This date is fully booked, but you can continue browsing trip details.");
        // Don't return here - allow selection to continue
      }
      
      // If the date is blocked by admin, prevent selection
      if (availability.isBlocked) {
        toast.error("This date is not available. Please select another date.");
        return;
      }
      
      // If available, show success feedback
      if (availability.isAvailable) {
        const spotsMessage = availability.remainingSpots === 1 
          ? "1 spot remaining" 
          : `${availability.remainingSpots} spots remaining`;
        toast.success(`Date selected! ${spotsMessage}`);
      }
      
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.warning("Could not verify availability for this date. You can continue browsing, but availability will be confirmed at booking.");
      // Set optimistic availability state for UI
      setSelectedDateAvailability({
        remainingSpots: 8, // Optimistic default
        isAvailable: true
      });
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    // Allow proceeding to step 1 (info collection) without authentication
    if (currentStep === 0) {
      // Only block if the date is truly disabled (past, admin-blocked, or user conflict)
      // Don't block for fully booked dates - user can continue browsing
      if (data.bookingDate) {
        const isPastDate = data.bookingDate < new Date(new Date().setHours(0, 0, 0, 0));
        const isDisabledDate = disabledDates.some(disabledDate => 
          disabledDate.toDateString() === data.bookingDate.toDateString()
        );
        
        if (isPastDate || isDisabledDate) {
          toast.error("Please select an available date before continuing.");
          return;
        }
      }
      setCurrentStep(1);
      return;
    }
    
    // Allow proceeding to step 2 (payment) without authentication
    // Authentication will be triggered at payment step
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }
    
    // This should only be reached from the final payment confirmation
    // Authentication check will happen in the payment step UI
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
        localAdventure.id.toString() : null
      );

      if (!adventureId) {
        toast.error('Adventure not found. Please try again.');
        return;
      }

      // Final availability check before creating booking
      const dateStr = data.bookingDate.toISOString().split('T')[0];
      
      try {
        const finalAvailability = await BookingService.checkDateAvailability(adventureId, dateStr);
        
        // If there's an error checking availability, proceed with optimistic booking
        // The database constraints will catch any actual conflicts
        if (finalAvailability.error) {
          console.warn('Could not verify final availability, proceeding with booking creation');
        } else {
          // Only block if we can successfully verify the date is unavailable
          if (!finalAvailability.isAvailable && !finalAvailability.error) {
            toast.error('This date is no longer available. Please select another date.');
            setCurrentStep(0); // Go back to date selection
            return;
          }
          
          if (finalAvailability.remainingSpots < data.numberOfTravelers && !finalAvailability.error) {
            toast.error(`Only ${finalAvailability.remainingSpots} spots remaining. Please adjust the number of travelers.`);
            setCurrentStep(1); // Go back to info step
            return;
          }
        }
      } catch (error) {
        console.warn('Error during final availability check, proceeding with booking creation:', error);
        // Continue with booking creation - database constraints will handle conflicts
      }

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
      
      // Refresh disabled dates after booking creation
      await refreshDisabledDates();
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
      
      // Refresh disabled dates after payment confirmation
      await refreshDisabledDates();
      
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
            <span className="text-sm text-green-500 font-medium">
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
                        onSelect={(date) => {
                          // Handle availability checking
                          handleDateSelection(date);
                          
                          // Only set the date if it's available
                          if (date) {
                            const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
                            const isDisabledDate = disabledDates.some(disabledDate => 
                              disabledDate.toDateString() === date.toDateString()
                            );
                            
                            if (!isPastDate && !isDisabledDate) {
                              field.onChange(date);
                            }
                          }
                        }}
                        disabled={(date) => {
                          // Only disable past dates and truly blocked dates (admin blocked, user conflicts)
                          // NOT fully booked dates (they should remain clickable)
                          if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
                            return true;
                          }
                          
                          // Disable dates that are in the disabled dates list (admin blocked, user conflicts)
                          return disabledDates.some(disabledDate => 
                            disabledDate.toDateString() === date.toDateString()
                          );
                        }}
                        className="rounded-md border"
                      />
                    </FormControl>
                    {selectedDateAvailability && field.value && (
                      <div className="text-center mt-2">
                        <p className={`text-sm ${selectedDateAvailability.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedDateAvailability.isAvailable 
                            ? selectedDateAvailability.remainingSpots === 1
                              ? '1 spot remaining'
                              : `${selectedDateAvailability.remainingSpots} spots remaining`
                            : 'Date unavailable'
                          }
                        </p>
                      </div>
                    )}
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
                          className="w-full p-3 border border-border rounded-md resize-vertical min-h-[80px]"
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
                  <div className="bg-primary/10 border border-primary rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-primary-foreground mb-4">Booking Summary</h3>
                    
                    {/* Show booking summary for guest users */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-primary">Adventure:</span>
                        <span className="font-semibold text-primary-foreground">{adventure?.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-primary">Date:</span>
                        <span className="font-semibold text-primary-foreground">{form.getValues("bookingDate")?.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-primary">Travelers:</span>
                        <span className="font-semibold text-primary-foreground">{form.getValues("numberOfTravelers")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-primary">Lead Guest:</span>
                        <span className="font-semibold text-primary-foreground">{form.getValues("fullName")}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between">
                        <span className="text-primary font-semibold">Total:</span>
                        <span className="font-bold text-primary-foreground text-lg">
                          ${((adventure?.price_per_person || (localAdventure ? parseFloat(localAdventure.price.replace('$', '')) : 0)) * form.getValues("numberOfTravelers")).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-primary-foreground mb-2">Ready to Secure Your Adventure?</h4>
                      <p className="text-primary mb-4">Please sign in to complete your booking and payment.</p>
                      <Button 
                        onClick={() => setShowSignIn(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Sign In to Complete Booking
                      </Button>
                    </div>
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
          <div className="flex gap-4">
            <Button
              type="button"
              variant="default"
              size="lg"
              className="flex-1"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0 || (currentStep === 2 && (false))}
            >
              Previous
            </Button>
            {currentStep < 2 && (
              <Button
                type="button"
                variant="default"
                size="lg"
                className="flex-1"
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

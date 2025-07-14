import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Clock, Users, MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { Adventure, BookingFormData, BookingStep, PricingBreakdown } from '@/types/booking';
import { BookingService } from '@/services/bookingService';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { BookingStepIndicator } from '@/components/booking/BookingStepIndicator';
import { BookingStepOne } from '@/components/booking/steps/BookingStepOne';
import { BookingStepTwo } from '@/components/booking/steps/BookingStepTwo';
import { BookingStepThree } from '@/components/booking/steps/BookingStepThree';
import { BookingStepFour } from '@/components/booking/steps/BookingStepFour';
import { PaymentStep } from '@/components/booking/PaymentStep';
import { BookingSummary } from '@/components/booking/BookingSummary';

const BookingCheckout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [adventure, setAdventure] = useState<Adventure | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<BookingFormData>({
    selectedDate: '',
    selectedTime: '',
    participants: 1,
    leadGuest: { name: '', email: '', phone: '' },
    guestDetails: {
      dietaryRestrictions: [],
      experienceLevel: '',
      emergencyContact: { name: '', phone: '' }
    },
    selectedAddOns: [],
    specialRequests: '',
    notifications: { email: true, sms: false, whatsapp: false },
    promoCode: '',
  });
  
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);

  const steps: BookingStep[] = [
    { id: 1, title: 'Date & Time', description: 'Choose your adventure date', completed: false, current: true },
    { id: 2, title: 'Group Size', description: 'Select number of participants', completed: false, current: false },
    { id: 3, title: 'Guest Details', description: 'Your information', completed: false, current: false },
    { id: 4, title: 'Add-ons', description: 'Enhance your experience', completed: false, current: false },
    { id: 5, title: 'Payment', description: 'Secure checkout', completed: false, current: false },
  ];

  useEffect(() => {
    if (id) {
      loadAdventure();
    }
  }, [id]);

  // Removed authentication blocker - guests can now access booking flow

  useEffect(() => {
    if (adventure) {
      calculatePricing();
      saveToCart();
    }
  }, [formData, adventure]);

  const loadAdventure = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const adventureData = await BookingService.getAdventure(id);
      setAdventure(adventureData);
      
      // Try to restore from cart
      const cartData = await BookingService.getCart(user?.id || null, id);
      if (cartData && cartData.cart_data) {
        setFormData(cartData.cart_data);
        setCurrentStep(cartData.step_completed + 1);
      }
    } catch (error) {
      console.error('Error loading adventure:', error);
      toast.error('Failed to load adventure details');
    } finally {
      setLoading(false);
    }
  };

  const calculatePricing = () => {
    if (!adventure || !formData.selectedDate) return;
    
    const pricingBreakdown = BookingService.calculatePricing(
      adventure, 
      formData, 
      formData.appliedPromotion
    );
    setPricing(pricingBreakdown);
  };

  const saveToCart = async () => {
    if (!adventure || !user) return;
    
    await BookingService.saveToCart(user.id, adventure.id, formData, currentStep);
  };

  const updateFormData = (updates: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.selectedDate && formData.selectedTime;
      case 2:
        return formData.participants > 0;
      case 3:
        return formData.leadGuest.name && formData.leadGuest.email && formData.leadGuest.phone;
      case 4:
        return true; // Add-ons are optional
      case 5:
        return false; // Payment step
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceedToNext()) {
      toast.error('Please complete all required fields');
      return;
    }
    
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!adventure || !user || !pricing) return;
    
    try {
      // Create booking with payment intent
      const booking = await BookingService.createBooking(
        user.id,
        adventure.id,
        formData,
        pricing,
        paymentIntentId
      );
      
      if (booking) {
        // Track conversion
        await BookingService.trackBookingComplete(adventure.id, pricing.totalAmount);
        
        // Clear cart
        await BookingService.clearCart(user.id, adventure.id);
        
        // Redirect to confirmation
        navigate(`/booking/${booking.id}/confirmation`);
      } else {
        toast.error('Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    }
  };

  const renderStep = () => {
    if (!adventure) return null;
    
    switch (currentStep) {
      case 1:
        return (
          <BookingStepOne
            adventure={adventure}
            formData={formData}
            onUpdate={updateFormData}
          />
        );
      case 2:
        return (
          <BookingStepTwo
            adventure={adventure}
            formData={formData}
            onUpdate={updateFormData}
          />
        );
      case 3:
        return (
          <BookingStepThree
            adventure={adventure}
            formData={formData}
            onUpdate={updateFormData}
          />
        );
      case 4:
        return (
          <BookingStepFour
            adventure={adventure}
            formData={formData}
            onUpdate={updateFormData}
          />
        );
      case 5:
        return (
          <PaymentStep
            adventure={adventure}
            formData={formData}
            pricing={pricing!}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!adventure) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Adventure Not Found</h1>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/tours/${adventure.id}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Adventure
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{adventure.title}</h1>
              <p className="text-gray-600 flex items-center mt-2">
                <MapPin className="w-4 h-4 mr-1" />
                {adventure.location}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold">
                {pricing ? `$${pricing.totalAmount.toFixed(2)}` : `$${adventure.base_price}`}
              </div>
              <div className="text-sm text-gray-500">
                {formData.participants} participant{formData.participants > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <BookingStepIndicator 
            steps={steps.map(step => ({
              ...step,
              completed: step.id < currentStep,
              current: step.id === currentStep
            }))} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{steps[currentStep - 1].title}</span>
                  <Badge variant="outline">
                    Step {currentStep} of {steps.length}
                  </Badge>
                </CardTitle>
                <p className="text-gray-600">{steps[currentStep - 1].description}</p>
              </CardHeader>
              <CardContent>
                {renderStep()}
              </CardContent>
            </Card>

            {/* Navigation */}
            {currentStep < 5 && (
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                <Button
                  onClick={handleNext}
                  disabled={!canProceedToNext()}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <BookingSummary
              adventure={adventure}
              formData={formData}
              pricing={pricing}
            />
            
            {/* Mobile Sticky Summary */}
            {currentStep < 5 && (
              <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold">
                      {pricing ? `$${pricing.totalAmount.toFixed(2)}` : `$${adventure.base_price}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formData.participants} participant{formData.participants > 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleNext}
                    disabled={!canProceedToNext()}
                    size="sm"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCheckout;
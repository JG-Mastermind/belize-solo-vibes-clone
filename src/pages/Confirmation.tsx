import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, Users, MapPin, Mail, Phone, Home } from 'lucide-react';

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, adventure, formData } = location.state || {};

  if (!booking || !adventure) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Booking Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find your booking confirmation. Please check your email for booking details.
          </p>
          <Button onClick={() => navigate("/")} className="bg-belize-green-600 hover:bg-belize-green-700">
            <Home className="h-4 w-4 mr-2" />
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-green-600">
            Your adventure has been successfully booked. Get ready for an amazing experience!
          </p>
        </div>

        {/* Booking Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Adventure Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{adventure.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{adventure.location || 'Belize'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formData?.bookingDate?.toLocaleDateString() || 'Date not available'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.participants} participant{booking.participants > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Payment Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-semibold">${booking.total_amount?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant="default" className="bg-green-600">
                      Confirmed
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Booking ID:</span>
                    <span className="font-mono text-xs">{booking.id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="border-t pt-6">
              <h4 className="font-semibold mb-3">Guest Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Name:</span>
                    <span>{formData?.fullName || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{formData?.email || 'Not provided'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{formData?.phone || 'Not provided'}</span>
                  </div>
                </div>
              </div>
              
              {formData?.specialRequests && (
                <div className="mt-4">
                  <span className="font-medium text-sm">Special Requests:</span>
                  <p className="text-sm text-muted-foreground mt-1 bg-gray-50 p-2 rounded">
                    {formData.specialRequests}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Confirmation Email</h4>
                  <p className="text-sm text-muted-foreground">
                    You'll receive a confirmation email with all booking details and instructions within 5 minutes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Prepare for Your Adventure</h4>
                  <p className="text-sm text-muted-foreground">
                    Check your email for a detailed packing list and meeting point information.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Contact Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Your guide will contact you 24 hours before your adventure with final details.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate("/")}
            className="bg-belize-green-600 hover:bg-belize-green-700"
          >
            <Home className="h-4 w-4 mr-2" />
            Explore More Adventures
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => window.print()}
          >
            Print Confirmation
          </Button>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Need help?</strong> Contact our support team at{' '}
            <a href="mailto:support@belizevibes.com" className="underline">
              support@belizevibes.com
            </a>{' '}
            or call{' '}
            <a href="tel:+5012234567" className="underline">
              +501 223-4567
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
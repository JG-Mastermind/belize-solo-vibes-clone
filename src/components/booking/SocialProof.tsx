import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Users, Flame, Calendar } from 'lucide-react';
import { Adventure } from '@/types/booking';

interface SocialProofProps {
  adventure: Adventure;
}

export const SocialProof: React.FC<SocialProofProps> = ({ adventure }) => {
  const [recentBookings, setRecentBookings] = useState<number>(0);
  const [viewersToday, setViewersToday] = useState<number>(0);
  const [spotsLeft, setSpotsLeft] = useState<number>(0);

  useEffect(() => {
    // Simulate social proof data
    generateSocialProofData();
  }, [adventure]);

  const generateSocialProofData = () => {
    // Generate realistic social proof numbers
    const baseBookings = Math.floor(Math.random() * 15) + 5; // 5-20 bookings
    const baseViewers = Math.floor(Math.random() * 50) + 20; // 20-70 viewers
    const remainingSpots = Math.floor(Math.random() * 5) + 1; // 1-6 spots left
    
    setRecentBookings(baseBookings);
    setViewersToday(baseViewers);
    setSpotsLeft(remainingSpots);
  };

  const isPopular = adventure.booking_count > 50;
  const isHotDeal = adventure.early_bird_discount_percentage > 0;
  const isLimitedAvailability = spotsLeft <= 3;

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center text-orange-800">
          <Flame className="w-5 h-5 mr-2" />
          Social Proof
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recent Activity */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Recent bookings</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {recentBookings} this week
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">People viewing</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {viewersToday} today
            </Badge>
          </div>
          
          {isLimitedAvailability && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Availability</span>
              <Badge variant="destructive" className="animate-pulse">
                Only {spotsLeft} spots left!
              </Badge>
            </div>
          )}
        </div>

        {/* Popular Indicators */}
        <div className="space-y-2">
          {isPopular && (
            <div className="flex items-center space-x-2 p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                Popular Choice - {adventure.booking_count}+ bookings
              </span>
            </div>
          )}
          
          {isHotDeal && (
            <div className="flex items-center space-x-2 p-2 bg-red-100 rounded-lg">
              <Clock className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">
                Early Bird: {adventure.early_bird_discount_percentage}% off
              </span>
            </div>
          )}
          
          {adventure.last_booked_at && (
            <div className="flex items-center space-x-2 p-2 bg-green-100 rounded-lg">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Last booked: {getTimeAgo(adventure.last_booked_at)}
              </span>
            </div>
          )}
        </div>

        {/* Fake Recent Bookings */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Recent Bookings</h4>
          <div className="space-y-1">
            {generateRecentBookings().map((booking, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{booking.name}</span>
                <span className="text-gray-500">{booking.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="pt-2 border-t border-orange-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Satisfaction Rate</span>
            <span className="font-medium text-green-600">
              {(adventure.average_rating * 20).toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Repeat Customers</span>
            <span className="font-medium text-blue-600">
              {Math.floor(adventure.booking_count * 0.3)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions
const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return 'Yesterday';
  return `${Math.floor(diffInHours / 24)}d ago`;
};

const generateRecentBookings = () => {
  const names = [
    'Sarah M.', 'John D.', 'Emma K.', 'Michael R.', 'Lisa T.',
    'David W.', 'Maria G.', 'James L.', 'Anna P.', 'Robert C.'
  ];
  
  const times = [
    '2 hours ago', '5 hours ago', '1 day ago', '2 days ago', '3 days ago'
  ];
  
  return Array.from({ length: 3 }, (_, i) => ({
    name: names[Math.floor(Math.random() * names.length)],
    time: times[i] || `${i + 1} days ago`
  }));
};
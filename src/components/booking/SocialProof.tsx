import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Users, Flame, Calendar } from 'lucide-react';
import { Adventure } from '@/types/booking';
import { useTranslation } from 'react-i18next';

interface SocialProofProps {
  adventure: Adventure;
}

export const SocialProof: React.FC<SocialProofProps> = ({ adventure }) => {
  const { t } = useTranslation(['adventureDetail']);
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
          {t('adventureDetail:socialProof.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recent Activity */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{t('adventureDetail:socialProof.recentBookings')}</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {recentBookings} {t('adventureDetail:socialProof.thisWeek')}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{t('adventureDetail:socialProof.peopleViewing')}</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {viewersToday} {t('adventureDetail:socialProof.today')}
            </Badge>
          </div>
          
          {isLimitedAvailability && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('adventureDetail:socialProof.availability')}</span>
              <Badge variant="destructive" className="animate-pulse">
                {t('adventureDetail:socialProof.onlyXSpotsLeft', { count: spotsLeft })}
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
                {t('adventureDetail:socialProof.popularChoice', { count: adventure.booking_count })}
              </span>
            </div>
          )}
          
          {isHotDeal && (
            <div className="flex items-center space-x-2 p-2 bg-red-100 rounded-lg">
              <Clock className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">
                {t('adventureDetail:socialProof.earlyBird', { percent: adventure.early_bird_discount_percentage })}
              </span>
            </div>
          )}
          
          {adventure.last_booked_at && (
            <div className="flex items-center space-x-2 p-2 bg-green-100 rounded-lg">
              <Calendar className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                {t('adventureDetail:socialProof.lastBooked', { time: getTimeAgo(adventure.last_booked_at, t) })}
              </span>
            </div>
          )}
        </div>

        {/* Fake Recent Bookings */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">{t('adventureDetail:socialProof.recentBookingsTitle')}</h4>
          <div className="space-y-1">
            {generateRecentBookings(t).map((booking, index) => (
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
            <span className="text-gray-600">{t('adventureDetail:socialProof.satisfactionRate')}</span>
            <span className="font-medium text-green-600">
              {(adventure.average_rating * 20).toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">{t('adventureDetail:socialProof.repeatCustomers')}</span>
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
const getTimeAgo = (dateString: string, t: any): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return t('adventureDetail:socialProof.timeAgo.justNow');
  if (diffInHours < 24) return t('adventureDetail:socialProof.timeAgo.hoursAgo', { hours: diffInHours });
  if (diffInHours < 48) return t('adventureDetail:socialProof.timeAgo.yesterday');
  return t('adventureDetail:socialProof.timeAgo.daysAgo', { days: Math.floor(diffInHours / 24) });
};

const generateRecentBookings = (t: any) => {
  const names = [
    'Sarah M.', 'John D.', 'Emma K.', 'Michael R.', 'Lisa T.',
    'David W.', 'Maria G.', 'James L.', 'Anna P.', 'Robert C.'
  ];
  
  const times = [
    t('adventureDetail:socialProof.mockTimes.hoursAgo2'),
    t('adventureDetail:socialProof.mockTimes.hoursAgo5'), 
    t('adventureDetail:socialProof.mockTimes.dayAgo1'),
    t('adventureDetail:socialProof.mockTimes.daysAgo2'),
    t('adventureDetail:socialProof.mockTimes.daysAgo3')
  ];
  
  return Array.from({ length: 3 }, (_, i) => ({
    name: names[Math.floor(Math.random() * names.length)],
    time: times[i] || times[4]
  }));
};
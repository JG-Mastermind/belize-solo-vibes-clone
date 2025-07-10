
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MessageSquare } from 'lucide-react';

interface Booking {
  id: string;
  guest: string;
  adventure: string;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  amount: number;
}

const mockBookings: Booking[] = [
  {
    id: '1',
    guest: 'John Doe',
    adventure: 'Blue Hole Diving',
    date: '2024-07-15',
    status: 'confirmed',
    amount: 250,
  },
  {
    id: '2',
    guest: 'Jane Smith',
    adventure: 'Mayan Ruins Tour',
    date: '2024-07-16',
    status: 'pending',
    amount: 180,
  },
  {
    id: '3',
    guest: 'Mike Johnson',
    adventure: 'Reef Snorkeling',
    date: '2024-07-17',
    status: 'confirmed',
    amount: 120,
  },
];

export const BookingsTable = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Adventure</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.guest}</TableCell>
                <TableCell>{booking.adventure}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell>${booking.amount}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

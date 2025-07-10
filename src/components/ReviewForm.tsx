
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Star, Send } from "lucide-react";
import { toast } from "sonner";

interface ReviewFormProps {
  adventureId?: string;
  bookingId?: string;
  onSubmit?: (review: any) => void;
}

const ReviewForm = ({ adventureId, bookingId, onSubmit }: ReviewFormProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState(user?.user_metadata?.first_name + " " + user?.user_metadata?.last_name || "");
  const [location, setLocation] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [trip, setTrip] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !reviewText) {
      toast.error("Please provide a rating and review text");
      return;
    }

    if (!user) {
      toast.error("Please sign in to submit a review");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Ensure we have a valid adventure_id for the review
      const finalAdventureId = adventureId || bookingId; // Use adventureId if provided, otherwise bookingId as fallback
      
      const reviewData = {
        reviewer_id: user.id,
        adventure_id: finalAdventureId,
        booking_id: bookingId,
        rating,
        comment: reviewText,
        submitted_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select()
        .single();

      if (error) throw error;

      toast.success("Review submitted successfully!");
      
      // Call the optional onSubmit callback with review data
      if (onSubmit) {
        onSubmit({
          name,
          location,
          rating,
          text: reviewText,
          trip
        });
      }
      
      // Reset form
      setRating(0);
      setReviewText("");
      setTrip("");
      setLocation("");
      
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white border-belize-green-200 shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-xl font-playfair font-bold text-belize-neutral-900 mb-4">
          Share Your Experience
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-belize-neutral-700 mb-1">
                Your Name *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-belize-neutral-700 mb-1">
                Location
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Toronto, Canada"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-belize-neutral-700 mb-1">
              Adventure/Trip Name
            </label>
            <Input
              value={trip}
              onChange={(e) => setTrip(e.target.value)}
              placeholder="e.g., Cave Tubing & Jungle Trek"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-belize-neutral-700 mb-2">
              Rating *
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-colors"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-belize-neutral-700 mb-1">
              Your Review *
            </label>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={4}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={rating === 0 || !reviewText || isSubmitting || !user}
            className="w-full bg-belize-green-600 hover:bg-belize-green-700"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : !user ? (
              "Sign in to submit review"
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Review
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;

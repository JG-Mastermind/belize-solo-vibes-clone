import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Users, 
  MapPin, 
  Star, 
  Calendar,
  Shield,
  Camera,
  MessageCircle,
  Heart,
  Share2,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Play,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { BookingService } from '@/services/bookingService';
import { Adventure, Review } from '@/types/booking';
import { useAuth } from '@/components/auth/AuthProvider';

// Extended Adventure interface with guide information
interface AdventureWithGuide extends Adventure {
  guide?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    whatsapp_number?: string;
    profile_image_url?: string;
    user_type: string;
    bio?: string;
    rating?: number;
    experience_years?: number;
  } | null;
}
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { SocialProof } from '@/components/booking/SocialProof';
import { BookingWidget } from '@/components/booking/BookingWidget';
import { ImageGallery } from '@/components/booking/ImageGallery';

const AdventureDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation(['adventureDetail', 'adventureCards']);
  
  // Map database adventure titles to i18n keys (same as AdventureCards)
  const getTitleBasedTranslationKey = (title: string) => {
    const titleMap: Record<string, number> = {
      'Cave Tubing & Jungle Trek': 1,
      'Snorkeling at Hol Chan Marine Reserve': 2,
      'Caracol Maya Ruins Adventure': 3,
      'Blue Hole Diving Experience': 4,
      'Jungle Zip-lining & Waterfall Tour': 5,
      'Manatee Watching & Beach Day': 6,
      'Sunrise Fishing & Island Hopping': 7,
      'Night Jungle Safari': 8,
      'Cultural Village Tour & Chocolate Making': 9
    };
    return titleMap[title] || null;
  };

  // Helper function to get translated adventure content
  const getAdventureContent = (adventure: any) => {
    // Try title-based mapping for database adventures first
    const translationKey = getTitleBasedTranslationKey(adventure.title);
    
    if (translationKey) {
      const translatedContent = t(`adventureCards:adventures.${translationKey}`, { returnObjects: true });
      
      if (translatedContent && typeof translatedContent === 'object') {
        return {
          title: translatedContent.title || adventure.title,
          description: translatedContent.description || adventure.description,
          highlights: translatedContent.highlights || adventure.highlights,
        };
      }
    }
    
    // Fallback for old local-X IDs (legacy support)
    const translationId = adventure.id?.toString().replace('local-', '') || adventure.id;
    const translatedContent = t(`adventureCards:adventures.${translationId}`, { returnObjects: true });
    
    if (translatedContent && typeof translatedContent === 'object') {
      return {
        title: translatedContent.title || adventure.title,
        description: translatedContent.description || adventure.description,
        highlights: translatedContent.highlights || adventure.highlights,
      };
    }
    
    // Final fallback to original content
    return {
      title: adventure.title,
      description: adventure.description,
      highlights: adventure.highlights,
    };
  };
  
  const [adventure, setAdventure] = useState<AdventureWithGuide | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showBookingWidget, setShowBookingWidget] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (id) {
      loadAdventureDetails();
      trackView();
    }
  }, [id]);

  const loadAdventureDetails = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const [adventureData, reviewsData] = await Promise.all([
        BookingService.getAdventure(id),
        BookingService.getAdventureReviews(id)
      ]);
      
      setAdventure(adventureData);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading adventure:', error);
      toast.error(t('adventureDetail:toast.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    if (id) {
      await BookingService.trackBookingView(id);
    }
  };

  const handleBookNow = () => {
    if (id) {
      BookingService.trackBookingStart(id);
      navigate(`/booking/${id}`);
    }
  };

  const handleWishlist = () => {
    if (!user) {
      toast.error(t('adventureDetail:toast.signInWishlist'));
      return;
    }
    
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? t('adventureDetail:toast.removedFromWishlist') : t('adventureDetail:toast.addedToWishlist'));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: adventure?.title,
          text: adventure?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t('adventureDetail:toast.linkCopied'));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-orange-100 text-orange-800';
      case 'extreme': return 'bg-red-100 text-red-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const translateDifficulty = (difficulty: string) => {
    return t(`adventureDetail:difficulties.${difficulty}`) || difficulty;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!adventure) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">{t('adventureDetail:notFound.title')}</h1>
          <Button onClick={() => navigate('/')}>{t('adventureDetail:notFound.returnHome')}</Button>
        </div>
      </div>
    );
  }

  const images = [
    adventure.featured_image_url,
    ...(adventure.gallery_images || [])
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-blue-50 dark:bg-blue-950/20">
      {/* Hero Section */}
      <div className="relative h-96 lg:h-[600px] overflow-hidden">
        <ImageGallery 
          images={images} 
          selectedIndex={selectedImageIndex}
          onImageChange={setSelectedImageIndex}
        />
        
        {/* Hero Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        
        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <div className="flex items-center space-x-2 mb-4">
              <Badge className={getDifficultyColor(adventure.difficulty_level)}>
                {translateDifficulty(adventure.difficulty_level)}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Clock className="w-4 h-4 mr-1" />
                {adventure.duration_hours}h
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Users className="w-4 h-4 mr-1" />
                {t('adventureDetail:hero.upTo')} {adventure.max_participants}
              </Badge>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-2">{getAdventureContent(adventure).title}</h1>
            <p className="text-xl flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              {adventure.location}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
            onClick={handleWishlist}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card className="dark:bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{t('adventureDetail:overview.title')}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span className="font-semibold">{adventure.average_rating}</span>
                    <span className="text-muted-foreground">({adventure.total_reviews} {t('adventureDetail:overview.reviews')})</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-6">{getAdventureContent(adventure).description}</p>
                
                {/* Highlights */}
                {adventure.highlights && adventure.highlights.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-foreground">{t('adventureDetail:overview.highlights')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getAdventureContent(adventure).highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* What's Included */}
                {adventure.includes && adventure.includes.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-foreground">{t('adventureDetail:overview.whatsIncluded')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {adventure.includes.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* What to Bring */}
                {adventure.what_to_bring && adventure.what_to_bring.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-foreground">{t('adventureDetail:overview.whatToBring')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {adventure.what_to_bring.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Not Suitable For */}
                {adventure.not_suitable_for && adventure.not_suitable_for.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-foreground">{t('adventureDetail:overview.notSuitableFor')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {adventure.not_suitable_for.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tour Guide */}
            <Card className="dark:bg-card">
              <CardHeader>
                <CardTitle className="text-2xl">{t('adventureDetail:guide.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                {adventure.guide ? (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={adventure.guide.profile_image_url || '/public/images/guides/default-guide.webp'}
                        alt={`${adventure.guide.first_name} ${adventure.guide.last_name}`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {adventure.guide.first_name} {adventure.guide.last_name}
                      </h3>
                      <p className="text-muted-foreground mb-3">
                        {adventure.guide.bio || t('adventureDetail:guide.defaultBio')}
                      </p>
                      <div className="flex items-center space-x-4">
                        {adventure.guide.whatsapp_number && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`https://wa.me/${adventure.guide.whatsapp_number.replace(/\D/g, '')}`, '_blank')}
                            className="flex items-center space-x-2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>{t('adventureDetail:guide.whatsapp')}</span>
                          </Button>
                        )}
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                          <span>{adventure.guide.rating || '4.8'} • {adventure.guide.experience_years || '5+'} {t('adventureDetail:guide.yearsExp')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    {t('adventureDetail:guide.noGuide')}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="reviews" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="reviews">{t('adventureDetail:tabs.reviews')}</TabsTrigger>
                <TabsTrigger value="itinerary">{t('adventureDetail:tabs.itinerary')}</TabsTrigger>
                <TabsTrigger value="faqs">{t('adventureDetail:tabs.faqs')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="reviews" className="space-y-4">
                <Card className="dark:bg-card">
                  <CardHeader>
                    <CardTitle>{t('adventureDetail:tabs.reviews')} ({reviews.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {reviews.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">{t('adventureDetail:reviews.noReviews')}</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                                  <Users className="w-5 h-5 text-muted-foreground" />
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating
                                            ? 'text-yellow-500 fill-current'
                                            : 'text-muted'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(review.created_at).toLocaleDateString()}
                                  </span>
                                  {review.is_verified && (
                                    <Badge variant="secondary" className="text-xs">
                                      {t('adventureDetail:reviews.verified')}
                                    </Badge>
                                  )}
                                </div>
                                {review.title && (
                                  <h4 className="font-semibold mb-2 text-foreground">{review.title}</h4>
                                )}
                                {review.comment && (
                                  <p className="text-foreground">{review.comment}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="itinerary">
                <Card className="dark:bg-card">
                  <CardHeader>
                    <CardTitle>{t('adventureDetail:tabs.itinerary')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{t('adventureDetail:placeholders.itinerary')}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="faqs">
                <Card className="dark:bg-card">
                  <CardHeader>
                    <CardTitle>{t('adventureDetail:tabs.faqs')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{t('adventureDetail:placeholders.faqs')}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Widget */}
            <Card className="sticky top-4 dark:bg-card">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {t('adventureDetail:pricing.from')} ${adventure.base_price}
                  <span className="text-lg font-normal text-muted-foreground">{t('adventureDetail:pricing.person')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleBookNow}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  {t('adventureDetail:pricing.bookNow')}
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">
                  {t('adventureDetail:pricing.freeCancellation')}
                </div>
                
                <Separator />
                
                {/* Quick Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('adventureDetail:quickDetails.duration')}</span>
                    <span className="text-sm font-medium text-foreground">{adventure.duration_hours} {t('adventureDetail:quickDetails.hours')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('adventureDetail:quickDetails.groupSize')}</span>
                    <span className="text-sm font-medium text-foreground">{t('adventureDetail:hero.upTo')} {adventure.max_participants}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('adventureDetail:quickDetails.difficulty')}</span>
                    <Badge className={getDifficultyColor(adventure.difficulty_level)}>
                      {translateDifficulty(adventure.difficulty_level)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Proof */}
            <SocialProof adventure={adventure} />
            
            {/* Safety & Trust */}
            <Card className="dark:bg-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  {t('adventureDetail:safetyTrust.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{t('adventureDetail:safetyTrust.licensedInsured')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{t('adventureDetail:safetyTrust.safetyEquipment')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{t('adventureDetail:safetyTrust.support24')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{t('adventureDetail:safetyTrust.satisfactionGuarantee')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdventureDetail;
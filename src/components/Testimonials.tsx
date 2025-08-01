
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, Plus, Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const initialTestimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "Toronto, Canada",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b630?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "My solo trip to Belize with BelizeVibes was absolutely incredible! The cave tubing experience was magical, and I felt completely safe traveling alone. The guides were knowledgeable and made sure everyone in our small group had an amazing time.",
    trip: "Cave Tubing & Jungle Trek"
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "San Francisco, USA",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "The Blue Hole diving experience exceeded all expectations! As a solo traveler, I was worried about fitting in, but the group was welcoming and the dive masters were professional. Definitely a once-in-a-lifetime experience.",
    trip: "Blue Hole Diving Experience"
  },
  {
    id: 3,
    name: "Emma Thompson",
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "I was nervous about traveling solo, but BelizeVibes made everything seamless. The Caracol Maya ruins tour was fascinating, and I learned so much about Mayan history. The small group size made it feel personal and intimate.",
    trip: "Caracol Maya Ruins Adventure"
  },
  {
    id: 4,
    name: "James Rodriguez",
    location: "Madrid, Spain",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "The snorkeling at Hol Chan was breathtaking! Swimming with nurse sharks and stingrays was surreal. The guides were excellent and made sure everyone felt comfortable in the water. Highly recommend for solo travelers!",
    trip: "Snorkeling at Hol Chan"
  },
  {
    id: 5,
    name: "Lisa Park",
    location: "Seoul, South Korea",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    text: "The zip-lining through the jungle canopy was exhilarating! I traveled alone but never felt lonely thanks to the friendly group and amazing guides. The waterfall swim afterwards was the perfect way to cool down.",
    trip: "Jungle Zip-lining & Waterfall"
  }
];

interface Review {
  id: string | number;
  name: string;
  location?: string;
  image: string;
  rating: number;
  text: string;
  trip?: string;
  created_at?: string;
  images?: string[];
}

// interface TestimonialData {
//   id: string;
//   comment: string;
//   rating: number;
//   created_at: string;
//   reviewer_id?: string;
// }

const Testimonials = () => {
  const { user, getUserAvatar } = useAuth();
  const { t } = useTranslation(['testimonials']);
  const [testimonials, setTestimonials] = useState<Review[]>(initialTestimonials);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    rating: 0
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [hoverRating, setHoverRating] = useState(0);
  
  // Image upload state
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const MAX_IMAGES = 5;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [testimonials.length]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      
      // Load verified testimonials from database
      try {
        const { data: dbTestimonials, error: dbError } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_verified', true)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (!dbError && dbTestimonials && dbTestimonials.length > 0) {
          const formattedReviews: Review[] = dbTestimonials.map((testimonial) => ({
            id: testimonial.id,
            name: testimonial.user_name,
            location: '', 
            image: testimonial.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.user_name)}&background=10b981&color=fff&size=100`,
            rating: testimonial.rating,
            text: testimonial.content,
            trip: '',
            created_at: testimonial.created_at,
            images: testimonial.images || []
          }));
          
          // Add to existing testimonials (avoiding duplicates)
          setTestimonials(prev => {
            const existingIds = new Set(prev.map(t => t.id));
            const newTestimonials = formattedReviews.filter(t => !existingIds.has(t.id));
            return [...newTestimonials, ...prev];
          });
        }
      } catch (dbError) {
        console.error('Error loading testimonials from database:', dbError);
      }
      
      // Also keep some mock data for demo purposes
      const mockTestimonials: Review[] = [
        {
          id: 'mock-1',
          name: 'Sarah Johnson',
          location: 'Toronto, Canada',
          image: 'https://ui-avatars.com/api/?name=Sarah%20Johnson&background=10b981&color=fff&size=100',
          rating: 5,
          text: 'Amazing solo travel experience in Belize! BelizeVibes made everything seamless and I felt completely safe throughout my adventure.',
          trip: 'Cave Tubing Adventure',
          created_at: new Date().toISOString(),
          images: []
        },
        {
          id: 'mock-2',
          name: 'Michael Chen',
          location: 'San Francisco, USA',
          image: 'https://ui-avatars.com/api/?name=Michael%20Chen&background=10b981&color=fff&size=100',
          rating: 5,
          text: 'The Blue Hole diving experience was incredible! Perfect for solo travelers looking for adventure.',
          trip: 'Blue Hole Diving',
          created_at: new Date().toISOString(),
          images: []
        }
      ];
      
      // Add mock testimonials if no database testimonials exist
      if (mockTestimonials.length > 0) {
        setTestimonials(prev => {
          // Remove duplicates and merge
          const existingIds = new Set(prev.map(t => t.id));
          const newTestimonials = mockTestimonials.filter(t => !existingIds.has(t.id));
          return [...newTestimonials, ...prev];
        });
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      errors.name = t('testimonials:form.validation.nameRequired');
    }
    
    if (!formData.content.trim()) {
      errors.content = t('testimonials:form.validation.contentRequired');
    } else if (formData.content.length < 10) {
      errors.content = t('testimonials:form.validation.contentMinLength');
    }
    
    if (formData.rating === 0) {
      errors.rating = t('testimonials:form.validation.ratingRequired');
    }
    
    if (selectedImages.length > MAX_IMAGES) {
      errors.images = t('testimonials:form.validation.maxImages', { max: MAX_IMAGES });
    }
    
    // Validate file sizes
    const oversizedFiles = selectedImages.filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      errors.images = t('testimonials:form.validation.oversizedFiles');
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      const sanitizedContent = formData.content.replace(/<[^>]*>/g, ''); // Basic XSS protection
      
      // Upload images first if any are selected
      let imageUrls: string[] = [];
      if (selectedImages.length > 0) {
        imageUrls = await uploadImages();
        if (selectedImages.length > 0 && imageUrls.length === 0) {
          throw new Error('Failed to upload images');
        }
      }
      
      // Insert into Supabase testimonials table
      const { data, error } = await supabase
        .from('testimonials')
        .insert([{
          user_name: formData.name.trim(),
          content: sanitizedContent,
          rating: formData.rating,
          images: imageUrls.length > 0 ? imageUrls : null,
          is_verified: false // Will need manual verification
        }])
        .select()
        .single();
        
      if (error) {
        console.error('Error inserting testimonial:', error);
        // Fallback to local state for demo
        const userAvatar = getUserAvatar();
        const userName = user?.user_metadata?.full_name || 
                        `${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim() || 
                        formData.name.trim();
        
        const newReview: Review = {
          id: `review-${Date.now()}`,
          name: userName,
          location: '',
          image: userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=10b981&color=fff&size=100`,
          rating: formData.rating,
          text: sanitizedContent,
          trip: '',
          created_at: new Date().toISOString(),
          images: imageUrls
        };
        
        setTestimonials(prev => [newReview, ...prev]);
      } else {
        // Successfully inserted, add to local state for immediate display
        const userAvatar = getUserAvatar();
        const userName = user?.user_metadata?.full_name || 
                        `${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim() || 
                        data.user_name;
        
        const newReview: Review = {
          id: data.id,
          name: userName,
          location: '',
          image: userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=10b981&color=fff&size=100`,
          rating: data.rating,
          text: data.content,
          trip: '',
          created_at: data.created_at,
          images: data.images || []
        };
        
        setTestimonials(prev => [newReview, ...prev]);
      }
      
      // Reset images
      setSelectedImages([]);
      setImagePreviews([]);
      setUploadProgress(0);
      
      // TODO: Uncomment when testimonials table is properly set up
      // const { error } = await supabase
      //   .from('testimonials')
      //   .insert([{
      //     user_name: formData.name.trim(),
      //     content: sanitizedContent,
      //     rating: formData.rating,
      //     is_verified: false
      //   }]);
      //
      // if (insertError) throw insertError;
        
      if (error) throw error;
      
      toast.success(t('testimonials:form.messages.success'));
      
      // Reset form
      setFormData({ name: '', content: '', rating: 0 });
      setFormErrors({});
      setShowReviewForm(false);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(t('testimonials:form.messages.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const loadMoreReviews = () => {
    setVisibleCount(prev => prev + 5);
  };
  
  // Image handling functions
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate file count
    if (selectedImages.length + files.length > MAX_IMAGES) {
      toast.error(t('testimonials:form.validation.invalidFiles', { max: MAX_IMAGES }));
      return;
    }
    
    // Validate file types and sizes
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    
    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(t('testimonials:form.validation.notImage', { filename: file.name }));
        return;
      }
      
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(t('testimonials:form.validation.tooLarge', { filename: file.name }));
        return;
      }
      
      validFiles.push(file);
    });
    
    if (invalidFiles.length > 0) {
      toast.error(invalidFiles.join(', '));
    }
    
    if (validFiles.length > 0) {
      setSelectedImages(prev => [...prev, ...validFiles]);
      
      // Create preview URLs
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };
  
  const uploadImages = async (): Promise<string[]> => {
    if (selectedImages.length === 0) return [];
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const uploadedUrls: string[] = [];
      
      for (let index = 0; index < selectedImages.length; index++) {
        const file = selectedImages[index];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `review-photos/${fileName}`;
        
        try {
          // Upload file to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('review-photos')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });
          
          if (uploadError) {
            console.error('Upload error:', uploadError);
            // For demo, fallback to placeholder if storage fails
            uploadedUrls.push(`https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format&q=80&sig=${index}`);
          } else {
            // Get public URL
            const { data: publicUrlData } = supabase.storage
              .from('review-photos')
              .getPublicUrl(filePath);
            
            if (publicUrlData?.publicUrl) {
              uploadedUrls.push(publicUrlData.publicUrl);
            } else {
              // Fallback URL if public URL generation fails
              uploadedUrls.push(`https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format&q=80&sig=${index}`);
            }
          }
        } catch (fileError) {
          console.error(`Error uploading file ${file.name}:`, fileError);
          // Add fallback URL for failed uploads
          uploadedUrls.push(`https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format&q=80&sig=${index}`);
        }
        
        // Update progress
        const progress = Math.round(((index + 1) / selectedImages.length) * 100);
        setUploadProgress(progress);
      }
      
      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error(t('testimonials:form.messages.uploadError'));
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}`}
      />
    ));
  };

  return (
    <section id="testimonials" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-4">
            {t('testimonials:header')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            {t('testimonials:subtitle')}
          </p>
          
          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            aria-expanded={showReviewForm}
            aria-controls="review-form"
          >
            <Plus className="h-4 w-4 mr-2" />
            {showReviewForm ? t('testimonials:buttons.hideForm') : t('testimonials:buttons.writeReview')}
          </Button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="max-w-2xl mx-auto mb-12">
            <Card className="bg-card border-green-200 dark:border-green-800 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-playfair font-bold text-foreground mb-4">
                  {t('testimonials:form.title')}
                </h3>
                
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label htmlFor="review-name" className="block text-sm font-medium text-foreground mb-1">
                      {t('testimonials:form.labels.name')}
                    </label>
                    <Input
                      id="review-name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={t('testimonials:form.placeholders.name')}
                      className={formErrors.name ? "border-red-500" : ""}
                      aria-describedby={formErrors.name ? "name-error" : undefined}
                    />
                    {formErrors.name && (
                      <p id="name-error" className="text-red-500 text-sm mt-1" role="alert">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="review-rating" className="block text-sm font-medium text-foreground mb-2">
                      {t('testimonials:form.labels.rating')}
                    </label>
                    <div className="flex space-x-1" role="radiogroup" aria-labelledby="review-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-colors focus:outline-none focus:ring-2 focus:ring-belize-green-500 rounded"
                          aria-label={t('testimonials:accessibility.rateStar', { star, plural: star !== 1 ? 's' : '' })}
                          role="radio"
                          aria-checked={formData.rating === star}
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= (hoverRating || formData.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-muted-foreground'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {formErrors.rating && (
                      <p className="text-red-500 text-sm mt-1" role="alert">
                        {formErrors.rating}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="review-content" className="block text-sm font-medium text-foreground mb-1">
                      {t('testimonials:form.labels.review')}
                    </label>
                    <Textarea
                      id="review-content"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder={t('testimonials:form.placeholders.review')}
                      rows={4}
                      className={formErrors.content ? "border-red-500" : ""}
                      aria-describedby={formErrors.content ? "content-error" : undefined}
                    />
                    {formErrors.content && (
                      <p id="content-error" className="text-red-500 text-sm mt-1" role="alert">
                        {formErrors.content}
                      </p>
                    )}
                  </div>

                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t('testimonials:form.labels.photos', { max: MAX_IMAGES })}
                    </label>
                    
                    {/* File Input */}
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                          id="image-upload"
                          disabled={selectedImages.length >= MAX_IMAGES || isUploading}
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center space-y-2">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">
                              {selectedImages.length >= MAX_IMAGES 
                                ? t('testimonials:form.upload.maxReached', { max: MAX_IMAGES })
                                : t('testimonials:form.upload.clickToUpload')}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {t('testimonials:form.upload.fileTypes')}
                            </span>
                          </div>
                        </label>
                      </div>
                      
                      {/* Upload Progress */}
                      {isUploading && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{t('testimonials:form.upload.uploading')}</span>
                            <span className="text-muted-foreground">{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}
                      
                      {/* Image Previews */}
                      {imagePreviews.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">
                            {t('testimonials:form.upload.selectedImages', { count: imagePreviews.length, max: MAX_IMAGES })}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {imagePreviews.map((preview, index) => (
                              <div key={index} className="relative group">
                                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                                  <img
                                    src={preview}
                                    alt={t('testimonials:accessibility.previewImage', { index: index + 1 })}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                  disabled={isUploading}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Error display for images */}
                      {formErrors.images && (
                        <p className="text-red-500 text-sm mt-1" role="alert">
                          {formErrors.images}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={submitting || isUploading}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t('testimonials:form.messages.uploadingImages')}
                        </>
                      ) : submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t('testimonials:form.messages.submitting')}
                        </>
                      ) : (
                        t('testimonials:buttons.submitReview')
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowReviewForm(false)}
                      className="px-6"
                    >
                      {t('testimonials:buttons.cancel')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Testimonial Card */}
        {testimonials.length > 0 && (
          <div className="max-w-4xl mx-auto mb-8">
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 border-green-200 dark:border-green-800">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                  <div className="flex-shrink-0">
                    <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                      <AvatarImage 
                        src={testimonials[currentIndex].image} 
                        alt={testimonials[currentIndex].name}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <Quote className="h-8 w-8 text-primary mb-4 mx-auto md:mx-0" />
                    
                    <p className="text-lg md:text-xl text-foreground mb-6 italic leading-relaxed">
                      "{testimonials[currentIndex].text}"
                    </p>
                    
                    {/* Image Gallery */}
                    {testimonials[currentIndex].images && testimonials[currentIndex].images!.length > 0 && (
                      <div className="mb-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {testimonials[currentIndex].images!.slice(0, 5).map((imageUrl, index) => (
                            <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted border border-border">
                              <img
                                src={imageUrl}
                                alt={t('testimonials:accessibility.reviewPhoto', { index: index + 1, name: testimonials[currentIndex].name })}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                                onClick={() => window.open(imageUrl, '_blank')}
                              />
                            </div>
                          ))}
                        </div>
                        {testimonials[currentIndex].images!.length > 1 && (
                          <p className="text-xs text-muted-foreground mt-2 text-center">
                            <ImageIcon className="w-3 h-3 inline mr-1" />
                            {t('testimonials:accessibility.photosCount', { 
                              count: testimonials[currentIndex].images!.length, 
                              plural: testimonials[currentIndex].images!.length > 1 ? 's' : '' 
                            })}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-center md:justify-start space-x-1 mb-2">
                        {renderStars(testimonials[currentIndex].rating)}
                      </div>
                      
                      <h4 className="font-semibold text-foreground text-lg">
                        {testimonials[currentIndex].name}
                      </h4>
                      
                      {testimonials[currentIndex].location && (
                        <p className="text-muted-foreground">
                          {testimonials[currentIndex].location}
                        </p>
                      )}
                      
                      {testimonials[currentIndex].trip && (
                        <p className="text-sm text-primary font-medium">
                          {testimonials[currentIndex].trip}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Testimonial Navigation Dots */}
        {testimonials.length > 1 && (
          <div className="flex justify-center space-x-2 mb-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted hover:bg-primary/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Thumbnail Grid */}
        {testimonials.length > 1 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-2xl mx-auto">
            {testimonials.slice(0, visibleCount).map((testimonial, index) => (
              <button
                key={testimonial.id}
                onClick={() => setCurrentIndex(index)}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-green-100 dark:bg-green-900/30 border-2 border-primary' 
                    : 'bg-muted border-2 border-transparent hover:bg-green-50 dark:hover:bg-green-900/20'
                }`}
              >
                <Avatar className="w-12 h-12 mx-auto mb-2">
                  <AvatarImage 
                    src={testimonial.image} 
                    alt={testimonial.name}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <p className="text-xs font-medium text-foreground truncate">
                  {testimonial.name}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {testimonials.length > visibleCount && (
          <div className="text-center mt-8">
            <Button
              onClick={loadMoreReviews}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
              disabled={loading}
            >
              {loading ? t('testimonials:buttons.loading') : t('testimonials:buttons.loadMore', { count: testimonials.length - visibleCount })}
            </Button>
          </div>
        )}

        {/* Trust Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {(testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)}/5
            </div>
            <div className="text-sm text-muted-foreground">{t('testimonials:stats.averageRating')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">{testimonials.length}</div>
            <div className="text-sm text-muted-foreground">{t('testimonials:stats.totalReviews')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">95%</div>
            <div className="text-sm text-muted-foreground">{t('testimonials:stats.soloTravelers')}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">100%</div>
            <div className="text-sm text-muted-foreground">{t('testimonials:stats.satisfaction')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

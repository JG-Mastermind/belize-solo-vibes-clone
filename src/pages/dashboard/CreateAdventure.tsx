import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";

import { useAdventureCreation } from "@/contexts/AdventureCreationContext";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/ui/ImageUploader";
import { MapPin, DollarSign, Clock, Users, Star } from "lucide-react";
import { toast } from "sonner";

// Define the form schema using Zod for validation
const adventureFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  location_name: z.string().min(3, "Location is required."),
  price_per_person: z.coerce.number().positive("Price must be a positive number."),
  duration_hours: z.coerce.number().positive("Duration must be a positive number."),
  max_participants: z.coerce.number().positive("Max participants must be a positive number."),
  difficulty_level: z.enum(["easy", "moderate", "challenging"]),
  includes: z.string().optional(),
  requirements: z.string().optional(),
  what_to_bring: z.string().optional(),
  meeting_point: z.string().optional(),
  featured_image_url: z.string().optional(),
  // Rich content fields
  highlights: z.string().optional(),
  itinerary: z.string().optional(),
  faqs: z.string().optional(),
  video_url: z.string().url().optional().or(z.literal('')),
  gallery_images: z.string().optional(),
});

type AdventureFormData = z.infer<typeof adventureFormSchema>;

const CreateAdventurePage: React.FC = () => {
  const { prefilledData, clearPrefilledData } = useAdventureCreation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const form = useForm<AdventureFormData>({
    resolver: zodResolver(adventureFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location_name: "",
      price_per_person: 100,
      duration_hours: 4,
      max_participants: 8,
      difficulty_level: "moderate",
      includes: "",
      requirements: "",
      what_to_bring: "",
      meeting_point: "",
      featured_image_url: "",
      // Rich content defaults
      highlights: "",
      itinerary: "",
      faqs: "",
      video_url: "",
      gallery_images: "",
    },
  });

  // Effect to prefill form with AI-generated content
  useEffect(() => {
    if (prefilledData) {
      if (prefilledData.title) {
        form.setValue("title", prefilledData.title);
      }
      if (prefilledData.description) {
        form.setValue("description", prefilledData.description);
      }
      if (prefilledData.image) {
        form.setValue("featured_image_url", prefilledData.image);
        setUploadedImageUrl(prefilledData.image);
      }
      toast.success("Form pre-filled with AI-generated content!");
    }
  }, [prefilledData, form]);

  const onSubmit = async (values: AdventureFormData) => {
    // Validate user authentication
    if (!user) {
      toast.error("You must be logged in to create an adventure.");
      return;
    }

    // Validate image upload
    if (!uploadedImageUrl) {
      toast.error("Please upload a featured image before saving.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for Supabase insert
      const adventureData = {
        title: values.title,
        description: values.description,
        location: values.location_name,
        price_per_person: values.price_per_person,
        duration_hours: values.duration_hours,
        max_participants: values.max_participants,
        difficulty_level: values.difficulty_level,
        guide_id: user.id, // Use logged-in user's ID as guide_id
        image_urls: [uploadedImageUrl], // Array of image URLs
        is_active: true,
        includes: values.includes ? [values.includes] : [],
        requirements: values.requirements ? [values.requirements] : [],
        what_to_bring: values.what_to_bring ? [values.what_to_bring] : [],
        meeting_point: values.meeting_point || '',
        // Rich content fields
        highlights: values.highlights ? values.highlights.split(',').map(h => h.trim()) : [],
        itinerary: values.itinerary || '',
        faqs: values.faqs || '',
        video_url: values.video_url || '',
        gallery_images: values.gallery_images ? values.gallery_images.split('\n').map(url => url.trim()).filter(url => url.length > 0) : [],
      };

      // Insert into Supabase adventures table
      const { data, error } = await supabase
        .from('tours')
        .insert([adventureData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        toast.error(`Failed to create adventure: ${error.message}`);
        return;
      }

      // Success! Reset form and state
      form.reset();
      setUploadedImageUrl("");
      clearPrefilledData();
      
      toast.success("Adventure created successfully! 🎉");
      console.log('Adventure created:', data);

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error creating adventure:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image upload success
  const handleImageUpload = (imageUrl: string) => {
    setUploadedImageUrl(imageUrl);
    form.setValue("featured_image_url", imageUrl);
    // Note: Toast notification is handled by ImageUploader component
  };

  // Handle image removal
  const handleImageRemove = () => {
    setUploadedImageUrl("");
    form.setValue("featured_image_url", "");
  };

  const difficultyOptions = [
    { value: "easy", label: "Easy", description: "Suitable for all fitness levels" },
    { value: "moderate", label: "Moderate", description: "Requires basic fitness" },
    { value: "challenging", label: "Challenging", description: "Requires good fitness level" },
  ];

  // Guard clause - require authentication
  if (!user) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Authentication Required</h2>
          <p className="text-gray-600">You must be logged in to create an adventure.</p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-playfair font-bold text-belize-neutral-900 mb-4">
              Create New Adventure
            </h1>
            <p className="text-lg text-belize-neutral-800 max-w-2xl mx-auto">
              Fill out the details below to add a new tour to the BelizeVibes platform. 
              Share your expertise and help travelers discover amazing experiences.
            </p>
            <div className="mt-2 text-sm text-gray-500">
              Creating as: {user.email}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-belize-blue-600" />
                    <span>Adventure Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Basic Information */}
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Adventure Title *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., ATM Cave & Jungle Expedition" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Create an engaging title that captures the essence of your adventure
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe the adventure, what makes it unique, and what travelers can expect..."
                                  className="resize-y min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Paint a vivid picture of the experience (minimum 20 characters)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., San Ignacio, Cayo District" {...field} />
                              </FormControl>
                              <FormDescription>
                                Specify the meeting point or general area
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Featured Image Upload */}
                      <div className="space-y-2">
                        <ImageUploader
                          onUpload={handleImageUpload}
                          onRemove={handleImageRemove}
                          bucketName="adventures"
                          currentImage={uploadedImageUrl}
                          label="Adventure Featured Image"
                        />
                        {!uploadedImageUrl && (
                          <p className="text-sm text-red-500">
                            * Featured image is required
                          </p>
                        )}
                        {form.formState.errors.featured_image_url && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.featured_image_url.message}
                          </p>
                        )}
                      </div>

                      {/* Pricing and Logistics */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="price_per_person"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center space-x-2">
                                <DollarSign className="w-4 h-4" />
                                <span>Price per Person (USD) *</span>
                              </FormLabel>
                              <FormControl>
                                <Input type="number" min="1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="duration_hours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>Duration (hours) *</span>
                              </FormLabel>
                              <FormControl>
                                <Input type="number" min="0.5" step="0.5" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="max_participants"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center space-x-2">
                                <Users className="w-4 h-4" />
                                <span>Max Participants *</span>
                              </FormLabel>
                              <FormControl>
                                <Input type="number" min="1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="difficulty_level"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center space-x-2">
                                <Star className="w-4 h-4" />
                                <span>Difficulty Level *</span>
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select difficulty" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {difficultyOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      <div className="flex flex-col">
                                        <span className="font-medium">{option.label}</span>
                                        <span className="text-xs text-muted-foreground">
                                          {option.description}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Additional Details */}
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="meeting_point"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Meeting Point</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., BelizeVibes Office, Central Park" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Where participants should meet for the adventure
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="includes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>What's Included</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g., Transportation, Equipment, Lunch, Professional Guide..."
                                  className="resize-y"
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                List what's included in the adventure package
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="what_to_bring"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>What to Bring</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g., Water bottle, Comfortable shoes, Sunscreen, Camera..."
                                  className="resize-y"
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Items participants should bring with them
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="requirements"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Requirements & Restrictions</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g., Minimum age 12, Basic swimming ability required, Not suitable for pregnant women..."
                                  className="resize-y"
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Any requirements or restrictions for participants
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Rich Content Fields */}
                        <FormField
                          control={form.control}
                          name="highlights"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Adventure Highlights</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="e.g., Ancient Maya ceremonial chambers, Underground river swimming, Wildlife spotting..."
                                  className="resize-y"
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Key highlights that make this adventure special (separate with commas)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="itinerary"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Detailed Itinerary</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="9:00 AM - Pickup from meeting point&#10;10:00 AM - Safety briefing and equipment check&#10;10:30 AM - Begin cave exploration..."
                                  className="resize-y"
                                  rows={6}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Step-by-step schedule of the adventure (use new lines for each time slot)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="faqs"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Frequently Asked Questions</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Q: What should I wear?&#10;A: Comfortable clothes that can get wet, water shoes recommended&#10;&#10;Q: Is it safe for beginners?&#10;A: Yes, our certified guides ensure safety for all skill levels..."
                                  className="resize-y"
                                  rows={6}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Common questions and answers (format: Q: question? A: answer)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="video_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Video URL (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://youtube.com/watch?v=..."
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                YouTube or Vimeo URL showcasing the adventure
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="gallery_images"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Image URLs (Optional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                                  className="resize-y"
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Additional images for the gallery (one URL per line)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-belize-orange-500 hover:bg-belize-orange-600 text-white text-lg py-6"
                        size="lg"
                        disabled={isSubmitting || !uploadedImageUrl}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Creating Adventure...
                          </>
                        ) : (
                          'Save Adventure'
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Tips and Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">💡 Tips for Success</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-semibold text-belize-blue-700">Great Title</h4>
                      <p className="text-belize-neutral-800">
                        Be specific and exciting. Include the main activity and location.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-belize-blue-700">Compelling Description</h4>
                      <p className="text-belize-neutral-800">
                        Paint a picture of the experience. What will they see, feel, and discover?
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-belize-blue-700">Eye-catching Image</h4>
                      <p className="text-belize-neutral-800">
                        Upload a high-quality image that showcases the adventure. Required for publication!
                      </p>
                      {uploadedImageUrl && (
                        <p className="text-xs text-green-600 font-medium">✓ Image uploaded</p>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-belize-blue-700">Fair Pricing</h4>
                      <p className="text-belize-neutral-800">
                        Research similar tours in your area. Include value-adds to justify your price.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">🚀 Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-2 h-2 bg-belize-orange-500 rounded-full mt-2"></span>
                      <p>Upload your featured image above ✅</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-2 h-2 bg-belize-orange-500 rounded-full mt-2"></span>
                      <p>Fill out all adventure details ✅</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-2 h-2 bg-gray-300 rounded-full mt-2"></span>
                      <p>Set your availability calendar</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-2 h-2 bg-gray-300 rounded-full mt-2"></span>
                      <p>Review and publish your listing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
    </div>
  );
};

export default CreateAdventurePage;
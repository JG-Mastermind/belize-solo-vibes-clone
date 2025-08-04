import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import ImageUploader from '@/components/ui/ImageUploader';

// Reuse the same schema as provider CreateAdventure
const adventureFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
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
  // Admin-specific fields
  guide_id: z.string().min(1, "Provider is required"),
  is_active: z.boolean().default(true),
});

type AdventureFormData = z.infer<typeof adventureFormSchema>;

interface Provider {
  id: string;
  name: string;
  email: string;
}

const AdminCreateAdventure: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [providers, setProviders] = useState<Provider[]>([]);

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
      highlights: "",
      itinerary: "",
      faqs: "",
      video_url: "",
      gallery_images: "",
      guide_id: "",
      is_active: true,
    },
  });

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      // Fetch users who are providers/guides
      const { data, error } = await supabase
        .from('users')
        .select('id, email, raw_user_meta_data')
        .or('raw_user_meta_data->>role.eq.guide,raw_user_meta_data->>role.eq.provider');

      if (error) throw error;
      
      const formattedProviders = data?.map(user => ({
        id: user.id,
        name: user.raw_user_meta_data?.name || user.email,
        email: user.email
      })) || [];

      setProviders(formattedProviders);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast.error('Failed to load providers');
    }
  };

  const onSubmit = async (values: AdventureFormData) => {
    if (!uploadedImageUrl) {
      toast.error("Please upload a featured image before saving.");
      return;
    }

    setIsSubmitting(true);

    try {
      const adventureData = {
        title: values.title,
        description: values.description,
        location: values.location_name,
        price_per_person: values.price_per_person,
        duration_hours: values.duration_hours,
        max_participants: values.max_participants,
        difficulty_level: values.difficulty_level,
        guide_id: values.guide_id,
        image_urls: [uploadedImageUrl],
        is_active: values.is_active,
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

      const { data, error } = await supabase
        .from('adventures')
        .insert([adventureData])
        .select()
        .single();

      if (error) throw error;

      toast.success('Adventure created successfully!');
      navigate('/admin/adventures');
    } catch (error) {
      console.error('Error creating adventure:', error);
      toast.error('Failed to create adventure. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Adventure - Admin Dashboard</title>
        <meta name="description" content="Create a new adventure listing" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/admin/adventures')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Adventures
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Adventure</h1>
            <p className="text-muted-foreground">
              Create a new adventure listing for any provider
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Adventure Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Provider Selection - Admin Only */}
                    <FormField
                      control={form.control}
                      name="guide_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provider *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select provider" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {providers.map((provider) => (
                                <SelectItem key={provider.id} value={provider.id}>
                                  {provider.name} ({provider.email})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose which provider this adventure belongs to
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adventure Title *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., ATM Cave & Jungle Expedition" {...field} />
                            </FormControl>
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Detailed description of the adventure..."
                              className="resize-y"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Pricing & Logistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="price_per_person"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price per Person ($) *</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" step="0.01" {...field} />
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
                            <FormLabel>Duration (Hours) *</FormLabel>
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
                            <FormLabel>Max Participants *</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="difficulty_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty Level *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="moderate">Moderate</SelectItem>
                              <SelectItem value="challenging">Challenging</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Featured Image */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Featured Image *</label>
                      <ImageUploader
                        onImageUploaded={setUploadedImageUrl}
                        existingImageUrl={uploadedImageUrl}
                      />
                    </div>

                    {/* Rich Content Fields */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Rich Content</h3>
                      
                      <FormField
                        control={form.control}
                        name="highlights"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adventure Highlights</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Ancient Maya chambers, Underground rivers, Wildlife spotting"
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>Key highlights (comma-separated)</FormDescription>
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
                                placeholder="9:00 AM - Pickup&#10;10:30 AM - Begin exploration..."
                                rows={6}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="faqs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>FAQs</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Q: What to wear?&#10;A: Comfortable clothes..."
                                rows={6}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting || !uploadedImageUrl}
                    >
                      {isSubmitting ? 'Creating Adventure...' : 'Create Adventure'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold">Provider Assignment</h4>
                    <p className="text-muted-foreground">
                      As an admin, you can create adventures for any provider.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Full Control</h4>
                    <p className="text-muted-foreground">
                      You have complete access to all adventure fields and settings.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Rich Content</h4>
                    <p className="text-muted-foreground">
                      Add detailed itineraries, FAQs, and highlights for professional listings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCreateAdventure;
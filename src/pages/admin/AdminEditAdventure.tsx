import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Trash2 } from 'lucide-react';
import ImageUploader from '@/components/ui/ImageUploader';

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
  highlights: z.string().optional(),
  itinerary: z.string().optional(),
  faqs: z.string().optional(),
  video_url: z.string().url().optional().or(z.literal('')),
  gallery_images: z.string().optional(),
  guide_id: z.string().min(1, "Provider is required"),
  is_active: z.boolean().default(true),
});

type AdventureFormData = z.infer<typeof adventureFormSchema>;

interface Provider {
  id: string;
  name: string;
  email: string;
}

const AdminEditAdventure: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [adventureData, setAdventureData] = useState<any>(null);

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
    if (id) {
      fetchAdventure();
      fetchProviders();
    }
  }, [id]);

  const fetchAdventure = async () => {
    try {
      setFetchLoading(true);
      const { data, error } = await supabase
        .from('adventures')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setAdventureData(data);
      
      // Populate form with existing data
      form.reset({
        title: data.title || '',
        description: data.description || '',
        location_name: data.location || '',
        price_per_person: data.price_per_person || 100,
        duration_hours: data.duration_hours || 4,
        max_participants: data.max_participants || 8,
        difficulty_level: data.difficulty_level || 'moderate',
        includes: Array.isArray(data.includes) ? data.includes.join(', ') : '',
        requirements: Array.isArray(data.requirements) ? data.requirements.join(', ') : '',
        what_to_bring: Array.isArray(data.what_to_bring) ? data.what_to_bring.join(', ') : '',
        meeting_point: data.meeting_point || '',
        featured_image_url: data.image_urls?.[0] || '',
        highlights: Array.isArray(data.highlights) ? data.highlights.join(', ') : '',
        itinerary: data.itinerary || '',
        faqs: data.faqs || '',
        video_url: data.video_url || '',
        gallery_images: Array.isArray(data.gallery_images) ? data.gallery_images.join('\n') : '',
        guide_id: data.guide_id || '',
        is_active: data.is_active ?? true,
      });

      setUploadedImageUrl(data.image_urls?.[0] || '');
    } catch (error) {
      console.error('Error fetching adventure:', error);
      toast.error('Failed to load adventure');
      navigate('/admin/adventures');
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchProviders = async () => {
    try {
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
      const updatedData = {
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
        includes: values.includes ? values.includes.split(',').map(i => i.trim()) : [],
        requirements: values.requirements ? values.requirements.split(',').map(r => r.trim()) : [],
        what_to_bring: values.what_to_bring ? values.what_to_bring.split(',').map(w => w.trim()) : [],
        meeting_point: values.meeting_point || '',
        highlights: values.highlights ? values.highlights.split(',').map(h => h.trim()) : [],
        itinerary: values.itinerary || '',
        faqs: values.faqs || '',
        video_url: values.video_url || '',
        gallery_images: values.gallery_images ? values.gallery_images.split('\n').map(url => url.trim()).filter(url => url.length > 0) : [],
      };

      const { error } = await supabase
        .from('adventures')
        .update(updatedData)
        .eq('id', id);

      if (error) throw error;

      toast.success('Adventure updated successfully!');
      navigate('/admin/adventures');
    } catch (error) {
      console.error('Error updating adventure:', error);
      toast.error('Failed to update adventure. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!adventureData || !confirm(`Are you sure you want to delete "${adventureData.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('adventures')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Adventure deleted successfully');
      navigate('/admin/adventures');
    } catch (error) {
      console.error('Error deleting adventure:', error);
      toast.error('Failed to delete adventure');
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading adventure...</span>
      </div>
    );
  }

  if (!adventureData) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Adventure Not Found</h1>
        <Button onClick={() => navigate('/admin/adventures')}>
          Back to Adventures
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Adventure - {adventureData.title} - Admin Dashboard</title>
        <meta name="description" content={`Edit adventure: ${adventureData.title}`} />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
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
              <h1 className="text-3xl font-bold">Edit Adventure</h1>
              <p className="text-muted-foreground">
                Modify adventure details and settings
              </p>
            </div>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Adventure
          </Button>
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
                    {/* Admin Controls */}
                    <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                      <FormField
                        control={form.control}
                        name="is_active"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Adventure is active</FormLabel>
                              <FormDescription>
                                Inactive adventures won't appear to users
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Provider Selection */}
                    <FormField
                      control={form.control}
                      name="guide_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provider *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
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
                              <Input {...field} />
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
                              <Input {...field} />
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
                            <Textarea rows={4} {...field} />
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
                              <Textarea rows={3} {...field} />
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
                              <Textarea rows={6} {...field} />
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
                              <Textarea rows={6} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Featured Image */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Featured Image *</label>
                      <ImageUploader
                        onImageUploaded={setUploadedImageUrl}
                        existingImageUrl={uploadedImageUrl}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        type="submit" 
                        className="flex-1"
                        size="lg"
                        disabled={isSubmitting || !uploadedImageUrl}
                      >
                        {isSubmitting ? 'Updating Adventure...' : 'Update Adventure'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => navigate('/admin/adventures')}
                      >
                        Cancel
                      </Button>
                    </div>
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
                    <h4 className="font-semibold">Full Control</h4>
                    <p className="text-muted-foreground">
                      As admin, you can edit any adventure regardless of owner.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Provider Transfer</h4>
                    <p className="text-muted-foreground">
                      Change the adventure owner by selecting a different provider.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Visibility Control</h4>
                    <p className="text-muted-foreground">
                      Toggle adventure visibility to users with the active checkbox.
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

export default AdminEditAdventure;
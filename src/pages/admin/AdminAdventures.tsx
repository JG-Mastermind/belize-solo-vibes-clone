import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  DollarSign, 
  Clock, 
  Users, 
  MapPin,
  Search,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Adventure {
  id: string;
  title: string;
  description: string;
  location: string;
  price_per_person: number;
  duration_hours: number;
  max_participants: number;
  difficulty_level: string;
  is_active: boolean;
  guide_id: string;
  created_at: string;
  image_urls: string[];
}

const AdminAdventures: React.FC = () => {
  const navigate = useNavigate();
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchAdventures();
  }, []);

  const fetchAdventures = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('adventures')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdventures(data || []);
    } catch (error) {
      console.error('Error fetching adventures:', error);
      toast.error('Failed to load adventures');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('adventures')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Adventure deleted successfully');
      fetchAdventures(); // Refresh list
    } catch (error) {
      console.error('Error deleting adventure:', error);
      toast.error('Failed to delete adventure');
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('adventures')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Adventure ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchAdventures(); // Refresh list
    } catch (error) {
      console.error('Error updating adventure status:', error);
      toast.error('Failed to update adventure status');
    }
  };

  const filteredAdventures = adventures.filter(adventure => {
    const matchesSearch = adventure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         adventure.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && adventure.is_active) ||
                         (filterStatus === 'inactive' && !adventure.is_active);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading adventures...</span>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage Adventures - Admin Dashboard</title>
        <meta name="description" content="Manage all adventure listings" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Manage Adventures</h1>
            <p className="text-muted-foreground">
              Complete control over all adventure listings
            </p>
          </div>
          <Button 
            onClick={() => navigate('/admin/adventures/new')}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Adventure
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search adventures by title or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                >
                  All ({adventures.length})
                </Button>
                <Button
                  variant={filterStatus === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('active')}
                >
                  Active ({adventures.filter(a => a.is_active).length})
                </Button>
                <Button
                  variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('inactive')}
                >
                  Inactive ({adventures.filter(a => !a.is_active).length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Adventures Grid */}
        {filteredAdventures.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No adventures found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdventures.map((adventure) => (
              <Card key={adventure.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium line-clamp-2">
                      {adventure.title}
                    </CardTitle>
                    <Badge variant={adventure.is_active ? 'default' : 'secondary'}>
                      {adventure.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Adventure Image */}
                  {adventure.image_urls && adventure.image_urls.length > 0 && (
                    <div className="aspect-video bg-gray-200 rounded-md mb-3 overflow-hidden">
                      <img 
                        src={adventure.image_urls[0]} 
                        alt={adventure.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Adventure Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {adventure.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      ${adventure.price_per_person}/person
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {adventure.duration_hours} hours
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      Max {adventure.max_participants}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => navigate(`/admin/adventures/edit/${adventure.id}`)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleStatus(adventure.id, adventure.is_active)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      {adventure.is_active ? 'Hide' : 'Show'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(adventure.id, adventure.title)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminAdventures;
import { supabase } from '../src/lib/supabase';

async function verifyTours() {
  try {
    console.log('🔍 Verifying tours in Supabase database...\n');
    
    // Fetch all tours from the database
    const { data: tours, error } = await supabase
      .from('tours')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching tours:', error.message);
      return;
    }

    if (!tours || tours.length === 0) {
      console.log('❌ No tours found in the database');
      return;
    }

    console.log(`✅ Found ${tours.length} tours in the database\n`);

    // Validate each tour has required fields
    const requiredFields = [
      'title',
      'description', 
      'location_name',
      'price_per_person',
      'duration_hours',
      'max_participants',
      'images',
      'provider_id',
      'is_active'
    ];

    let validTours = 0;
    const errors: string[] = [];

    console.log('📋 Tour validation results:\n');

    tours.forEach((tour, index) => {
      console.log(`${index + 1}. "${tour.title}" - $${tour.price_per_person}`);
      console.log(`   📍 Location: ${tour.location_name}`);
      console.log(`   ⏰ Duration: ${tour.duration_hours}h | Max: ${tour.max_participants} people`);
      console.log(`   🖼️  Images: ${Array.isArray(tour.images) ? tour.images.length : 0} image(s)`);
      console.log(`   ✅ Active: ${tour.is_active}`);

      // Check if all required fields are present
      const missingFields = requiredFields.filter(field => {
        const value = tour[field];
        return value === null || value === undefined || value === '';
      });

      if (missingFields.length === 0) {
        validTours++;
        console.log(`   ✅ All fields present\n`);
      } else {
        errors.push(`Tour "${tour.title}": Missing fields - ${missingFields.join(', ')}`);
        console.log(`   ❌ Missing fields: ${missingFields.join(', ')}\n`);
      }
    });

    // Summary
    console.log('=' * 50);
    console.log(`📊 SUMMARY:`);
    console.log(`   Total tours: ${tours.length}`);
    console.log(`   Valid tours: ${validTours}`);
    console.log(`   Tours with issues: ${tours.length - validTours}`);

    if (errors.length > 0) {
      console.log(`\n❌ VALIDATION ERRORS:`);
      errors.forEach(error => console.log(`   • ${error}`));
    } else {
      console.log(`\n🎉 All tours are valid and properly formatted!`);
    }

    // Check for recent inserts (last 10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const recentTours = tours.filter(tour => tour.created_at > tenMinutesAgo);
    
    if (recentTours.length > 0) {
      console.log(`\n🕐 ${recentTours.length} tours were inserted in the last 10 minutes:`);
      recentTours.forEach(tour => {
        console.log(`   • ${tour.title} (${new Date(tour.created_at).toLocaleTimeString()})`);
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error during verification:', error);
  }
}

// Run the verification
verifyTours();
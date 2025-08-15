// Utility to update admin password - run once in development
import { supabase } from '@/integrations/supabase/client';

export const updateAdminPassword = async () => {
  try {
    console.log('Updating admin password...');
    
    // This requires service role permissions
    // You need to temporarily use the service role key in your client
    const { data: user, error } = await supabase.auth.admin.updateUserById(
      'a31a939e-7d90-4aa5-b821-c15e07ad4466', // jg.mastermind@gmail.com user ID
      { password: 'BelizeT2355!' }
    );
    
    if (error) {
      console.error('Error updating password:', error);
      return false;
    }
    
    console.log('✅ Password updated successfully!');
    console.log('Admin can now login with jg.mastermind@gmail.com / BelizeT2355!');
    return true;
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
};

// Auto-run in development (remove after use)
if (import.meta.env.DEV) {
  console.log('Admin password updater loaded. Call updateAdminPassword() to set password to BelizeT2355!');
}
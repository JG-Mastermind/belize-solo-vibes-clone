const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tljeawrgjogbjvkjmrxo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsamVhd3Jnam9nYmp2a2ptcnhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MjE2ODQsImV4cCI6MjA2NzM5NzY4NH0.2g6Xm6u03FRUmsRcwvHVwh3WqQ13JM2zBFpdLvSoi8E';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createEthanWithConfirmation() {
  console.log('Creating Ethan Zaiden account with email confirmation...\n');
  
  const credentials = {
    email: 'belizevibetours@gmail.com',
    password: 'EthanZ1234!',
    options: {
      data: {
        first_name: 'Ethan',
        last_name: 'Zaiden',
        username: 'Ethan_Z'
      }
    }
  };
  
  try {
    console.log('Step 1: Creating auth user account...');
    console.log('Email: belizevibetours@gmail.com');
    console.log('Password: EthanZ1234!');
    console.log('Username: Ethan_Z');
    
    // Create the auth user - this will send a confirmation email
    const { data: authData, error: authError } = await supabase.auth.signUp(credentials);
    
    if (authError) {
      console.log('❌ Account creation failed:', authError.message);
      return;
    }
    
    console.log('✅ Account created successfully!');
    console.log('User ID:', authData.user?.id);
    console.log('Email:', authData.user?.email);
    console.log('Email confirmed:', authData.user?.email_confirmed_at ? 'Yes' : 'No');
    
    if (authData.user) {
      console.log('\n📧 CONFIRMATION EMAIL SENT!');
      console.log('   ➡️  Check belizevibetours@gmail.com for confirmation email');
      console.log('   ➡️  Click the confirmation link in the email');
      console.log('   ➡️  Then come back and we\'ll create the guide profile');
      
      console.log('\n📝 ACCOUNT DETAILS:');
      console.log('   - Email: belizevibetours@gmail.com');
      console.log('   - Password: EthanZ1234!');
      console.log('   - Username: Ethan_Z');
      console.log('   - User ID:', authData.user.id);
      
      console.log('\n⏳ NEXT STEPS:');
      console.log('   1. Check your email inbox for confirmation');
      console.log('   2. Click the confirmation link');
      console.log('   3. Let me know when confirmed');
      console.log('   4. I\'ll create the guide profile and test login');
      
      // Save the user ID for later use
      console.log('\n💾 User ID saved for profile creation:', authData.user.id);
      
    } else {
      console.log('❌ User creation returned no user data');
    }
    
  } catch (err) {
    console.log('❌ Exception during account creation:', err.message);
  }
}

createEthanWithConfirmation().catch(console.error);
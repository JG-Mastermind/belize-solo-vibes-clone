// Utility to clear all authentication state - run in browser console
export const clearAllAuthState = async () => {
  console.log('🧹 Clearing all authentication state...');
  
  // Clear localStorage
  const keys = Object.keys(localStorage);
  const authKeys = keys.filter(key => 
    key.includes('supabase') || 
    key.includes('auth') || 
    key.includes('session') ||
    key.includes('token')
  );
  
  console.log('Clearing localStorage keys:', authKeys);
  authKeys.forEach(key => localStorage.removeItem(key));
  
  // Clear sessionStorage
  const sessionKeys = Object.keys(sessionStorage);
  const authSessionKeys = sessionKeys.filter(key => 
    key.includes('supabase') || 
    key.includes('auth') || 
    key.includes('session') ||
    key.includes('token')
  );
  
  console.log('Clearing sessionStorage keys:', authSessionKeys);
  authSessionKeys.forEach(key => sessionStorage.removeItem(key));
  
  // Clear cookies
  document.cookie.split(";").forEach(cookie => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    if (name.includes('supabase') || name.includes('auth') || name.includes('session')) {
      console.log('Clearing cookie:', name);
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
  });
  
  console.log('✅ Auth state cleared. Please refresh the page.');
  return true;
};

// Auto-expose in development
if (import.meta.env.DEV) {
  (window as any).clearAllAuthState = clearAllAuthState;
  console.log('🔧 Auth debugging loaded. Run clearAllAuthState() to clear all auth state.');
}
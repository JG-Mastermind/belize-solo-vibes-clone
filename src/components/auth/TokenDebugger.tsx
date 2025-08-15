import React from 'react';
import { useSearchParams } from 'react-router-dom';

interface TokenDetails {
  type: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  allParams: Record<string, string>;
}

export const TokenDebugger: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  const tokenDetails: TokenDetails = {
    type: searchParams.get('type'),
    accessToken: searchParams.get('access_token'),
    refreshToken: searchParams.get('refresh_token'),
    allParams: Object.fromEntries(searchParams.entries())
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md text-xs font-mono z-50">
      <h3 className="font-bold text-yellow-400 mb-2">Token Debug Info</h3>
      <div className="space-y-1">
        <div>
          <span className="text-blue-400">Type:</span> {tokenDetails.type || 'null'}
        </div>
        <div>
          <span className="text-blue-400">Access Token:</span> 
          {tokenDetails.accessToken ? (
            <span className="text-green-400">
              {tokenDetails.accessToken.substring(0, 20)}...({tokenDetails.accessToken.length} chars)
            </span>
          ) : (
            <span className="text-red-400">null</span>
          )}
        </div>
        <div>
          <span className="text-blue-400">Refresh Token:</span>
          {tokenDetails.refreshToken ? (
            <span className="text-green-400">
              {tokenDetails.refreshToken.substring(0, 20)}...({tokenDetails.refreshToken.length} chars)
            </span>
          ) : (
            <span className="text-red-400">null</span>
          )}
        </div>
        <div className="mt-2">
          <span className="text-blue-400">All Params:</span>
          <pre className="text-xs bg-gray-800 p-2 rounded mt-1 overflow-auto max-h-32">
            {JSON.stringify(tokenDetails.allParams, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export const useTokenInspector = () => {
  const [searchParams] = useSearchParams();
  
  const inspectTokens = () => {
    const details = {
      type: searchParams.get('type'),
      accessToken: searchParams.get('access_token'),
      refreshToken: searchParams.get('refresh_token'),
      allParams: Object.fromEntries(searchParams.entries())
    };
    
    console.group('[TOKEN INSPECTOR]');
    console.log('Token Details:', details);
    console.log('URL Search Params:', searchParams.toString());
    
    if (details.type === 'recovery') {
      console.log('🔒 RECOVERY FLOW DETECTED');
      console.log('Access Token Length:', details.accessToken?.length);
      console.log('Has Refresh Token:', !!details.refreshToken);
      console.log('Token Preview:', details.accessToken?.substring(0, 50) + '...');
      
      // Additional validation
      if (!details.accessToken || !details.refreshToken) {
        console.warn('⚠️ INCOMPLETE RECOVERY TOKENS');
      } else {
        console.log('✅ Recovery tokens present');
      }
    }
    console.groupEnd();
    
    return details;
  };
  
  return { inspectTokens };
};
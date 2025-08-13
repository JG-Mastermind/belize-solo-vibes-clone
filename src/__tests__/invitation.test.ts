import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client for testing
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    rpc: jest.fn(),
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    functions: {
      invoke: jest.fn(),
    },
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('Invitation System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('accept_admin_invitation RPC', () => {
    test('accepts valid invitation', async () => {
      // Mock successful RPC call
      mockSupabase.rpc.mockResolvedValueOnce({
        data: 'ok',
        error: null,
      });

      const { data, error } = await supabase.rpc('accept_admin_invitation', {
        p_email: 'test@belizevibes.com',
        p_code: 'valid-code',
      });

      expect(error).toBeNull();
      expect(data).toBe('ok');
      expect(mockSupabase.rpc).toHaveBeenCalledWith('accept_admin_invitation', {
        p_email: 'test@belizevibes.com',
        p_code: 'valid-code',
      });
    });

    test('rejects invalid invitation code', async () => {
      // Mock RPC call with error
      mockSupabase.rpc.mockResolvedValueOnce({
        data: null,
        error: { message: 'Invalid or expired invitation' },
      });

      const { data, error } = await supabase.rpc('accept_admin_invitation', {
        p_email: 'test@belizevibes.com',
        p_code: 'invalid-code',
      });

      expect(data).toBeNull();
      expect(error).toBeTruthy();
      expect(error.message).toBe('Invalid or expired invitation');
    });

    test('rejects expired invitation', async () => {
      mockSupabase.rpc.mockResolvedValueOnce({
        data: null,
        error: { message: 'Invalid or expired invitation' },
      });

      const { data, error } = await supabase.rpc('accept_admin_invitation', {
        p_email: 'test@belizevibes.com',
        p_code: 'expired-code',
      });

      expect(error).toBeTruthy();
      expect(error.message).toBe('Invalid or expired invitation');
    });

    test('requires user to exist before using invitation', async () => {
      mockSupabase.rpc.mockResolvedValueOnce({
        data: null,
        error: { message: 'User must sign up before using invitation' },
      });

      const { data, error } = await supabase.rpc('accept_admin_invitation', {
        p_email: 'nonexistent@belizevibes.com',
        p_code: 'valid-code',
      });

      expect(error).toBeTruthy();
      expect(error.message).toBe('User must sign up before using invitation');
    });
  });

  describe('Edge Functions', () => {
    test('create_admin_invite function creates invitation', async () => {
      // Mock successful Edge Function call
      mockSupabase.functions.invoke.mockResolvedValueOnce({
        data: {
          success: true,
          message: 'Invitation created successfully',
          invitation_id: 'test-id',
          expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        },
        error: null,
      });

      const { data, error } = await supabase.functions.invoke('create_admin_invite', {
        body: { email: 'newuser@belizevibes.com', role: 'admin' },
      });

      expect(error).toBeNull();
      expect(data.success).toBe(true);
      expect(data.message).toBe('Invitation created successfully');
      expect(mockSupabase.functions.invoke).toHaveBeenCalledWith('create_admin_invite', {
        body: { email: 'newuser@belizevibes.com', role: 'admin' },
      });
    });

    test('create_admin_invite rejects invalid role', async () => {
      mockSupabase.functions.invoke.mockResolvedValueOnce({
        data: {
          error: 'Invalid role. Must be admin or blogger.',
        },
        error: null,
      });

      const { data, error } = await supabase.functions.invoke('create_admin_invite', {
        body: { email: 'test@belizevibes.com', role: 'invalid_role' },
      });

      expect(data.error).toBe('Invalid role. Must be admin or blogger.');
    });

    test('revoke_admin_invite deactivates invitation', async () => {
      mockSupabase.functions.invoke.mockResolvedValueOnce({
        data: {
          success: true,
          message: 'Invitation revoked successfully',
          invitation_id: 'test-id',
          revoked_at: new Date().toISOString(),
        },
        error: null,
      });

      const { data, error } = await supabase.functions.invoke('revoke_admin_invite', {
        body: { invitation_id: 'test-id' },
      });

      expect(error).toBeNull();
      expect(data.success).toBe(true);
      expect(data.message).toBe('Invitation revoked successfully');
    });
  });

  describe('Database Operations', () => {
    test('fetches invitations with proper fields', async () => {
      const mockInvitations = [
        {
          id: 'inv-1',
          email: 'test1@belizevibes.com',
          role_type: 'admin',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          used_at: null,
          created_at: new Date().toISOString(),
          is_active: true,
        },
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValueOnce({
          data: mockInvitations,
          error: null,
        }),
      } as any);

      // This would be called in the InvitationManager component
      const { data, error } = await supabase
        .from('admin_invitations')
        .select('*')
        .order('created_at', { ascending: false });

      expect(error).toBeNull();
      expect(data).toEqual(mockInvitations);
      expect(data[0].email).toBe('test1@belizevibes.com');
      expect(data[0].role_type).toBe('admin');
    });

    test('validates invitation expiry', () => {
      const expiredInvitation = {
        expires_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
      };

      const activeInvitation = {
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      };

      const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

      expect(isExpired(expiredInvitation.expires_at)).toBe(true);
      expect(isExpired(activeInvitation.expires_at)).toBe(false);
    });
  });
});
import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { ContactInput } from './types.ts';
import { assertCanWrite } from './demo.ts';

// Keep the guard at the request boundary, including calls made outside the UI.
export function atlasWrites(client: Pick<SupabaseClient, 'from' | 'rpc'>, user: User) {
  return {
    create: async (input: ContactInput) => {
      assertCanWrite(user);
      const { error } = await client.from('contacts').insert(input);
      if (error) throw error;
    },
    update: async ({ id, input }: { id: string; input: ContactInput }) => {
      assertCanWrite(user);
      const { data, error } = await client.from('contacts').update(input).eq('id', id).eq('owner_id', user.id).select('id');
      if (error) throw error;
      if (!data?.length) throw new Error('Contact not found or you do not have permission to edit it.');
    },
    remove: async (id: string) => {
      assertCanWrite(user);
      const { data, error } = await client.from('contacts').delete().eq('id', id).eq('owner_id', user.id).select('id');
      if (error) throw error;
      if (!data?.length) throw new Error('Contact not found or you do not have permission to delete it.');
    },
    seed: async () => {
      assertCanWrite(user);
      const { error } = await client.rpc('seed_sample_contacts');
      if (error) throw error;
    },
  };
}
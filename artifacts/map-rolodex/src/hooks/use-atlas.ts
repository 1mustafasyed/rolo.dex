import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Contact, ContactInput, MapContact, Place } from '@/lib/types';

const viewFields = 'id,owner_id,first_name,last_name,job_title,company,email,connection_type,how_we_met,source,location_confirmed_at,updated_at,place_id,city,region,country_code,latitude,longitude';
const contactFields = 'id,owner_id,first_name,last_name,job_title,company,email,connection_type,how_we_met,place_id';

export function useAtlas(userId: string) {
  const queryClient = useQueryClient();
  const view = useQuery({
    queryKey: ['atlas', userId, 'view'],
    queryFn: async () => {
      const { data, error } = await supabase.from('contacts_on_map').select(viewFields).eq('owner_id', userId);
      if (error) throw error;
      return (data || []) as MapContact[];
    },
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
  const contacts = useQuery({
    queryKey: ['atlas', userId, 'contacts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('contacts').select(contactFields).eq('owner_id', userId);
      if (error) throw error;
      return (data || []) as Contact[];
    },
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
  const places = useQuery({
    queryKey: ['atlas', userId, 'places'],
    queryFn: async () => {
      const { data, error } = await supabase.from('places').select('id,city,region,country_code').order('city');
      if (error) throw error;
      return (data || []) as Place[];
    },
    staleTime: 5 * 60_000,
  });
  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['atlas', userId, 'view'] }),
      queryClient.invalidateQueries({ queryKey: ['atlas', userId, 'contacts'] }),
    ]);
  };
  const create = useMutation({
    mutationFn: async (input: ContactInput) => {
      const { error } = await supabase.from('contacts').insert(input);
      if (error) throw error;
    },
    onSuccess: refresh,
  });
  const update = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: ContactInput }) => {
      const { data, error } = await supabase.from('contacts').update(input).eq('id', id).eq('owner_id', userId).select('id');
      if (error) throw error;
      if (!data?.length) throw new Error('Contact not found or you do not have permission to edit it.');
    },
    onSuccess: refresh,
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.from('contacts').delete().eq('id', id).eq('owner_id', userId).select('id');
      if (error) throw error;
      if (!data?.length) throw new Error('Contact not found or you do not have permission to delete it.');
    },
    onSuccess: refresh,
  });
  const seed = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('seed_sample_contacts');
      if (error) throw error;
    },
    onSuccess: refresh,
  });
  return { view, contacts, places, create, update, remove, seed, refresh };
}
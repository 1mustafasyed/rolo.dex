import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Contact, MapContact, Place } from '@/lib/types';
import { atlasWrites } from '@/lib/atlas-writes';
import type { User } from '@supabase/supabase-js';

const viewFields = 'id,owner_id,first_name,last_name,job_title,company,email,connection_type,how_we_met,source,location_confirmed_at,updated_at,place_id,city,region,country_code,latitude,longitude';
const contactFields = 'id,owner_id,first_name,last_name,job_title,company,email,connection_type,how_we_met,place_id';

export function useAtlas(user: User) {
  const userId = user.id;
  const writes = atlasWrites(supabase, user);
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
    mutationFn: writes.create,
    onSuccess: refresh,
  });
  const update = useMutation({
    mutationFn: writes.update,
    onSuccess: refresh,
  });
  const remove = useMutation({
    mutationFn: writes.remove,
    onSuccess: refresh,
  });
  const seed = useMutation({
    mutationFn: writes.seed,
    onSuccess: refresh,
  });
  return { view, contacts, places, create, update, remove, seed, refresh };
}
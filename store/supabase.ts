import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types';

type tablesNames = keyof Database['public']['Tables']

//stop process if missing env variables
if(!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) throw new Error("missing supabase env configurations – rename .evn.simple in .env an add neded configurations");

const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
)

export default supabase;

const searchQueryText = (query: string) => {
    const queryPartials = query.split(' ').filter((q) => q.length > 2);
    if(queryPartials.length === 1) return `${queryPartials}%`;
    return `%${queryPartials.join("%")}%`;
}

/**
 * GENERIC FUNCTIONS
 */

export const getDateById = async (table:tablesNames, id:number, ) => {
    try {
        const { data:lists, error } = await supabase.from(table)
            .select('*')
            .eq('id', id);

        return { lists, error }
    } catch (e) {
        return {    
            lists : null,
            error: e,
        }
    }
}

export const performNameSearch = async (searchTerm:string, table:tablesNames, query:string, limit=5) => {
    try {
        const searchTermSplit = searchQueryText(searchTerm);
        const response = await supabase.from(table)
            .select(query)
            .ilike('name', searchTermSplit)
            .limit(limit);
        const { data, error } = response;
        return { data, error }  
    } catch (e) {
        return {
            data : [],
            error: {
                message : `Error on Textsearch on "${table}" table`
            },
        }
    }
}
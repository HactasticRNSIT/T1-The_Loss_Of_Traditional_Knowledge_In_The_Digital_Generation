import { supabase } from '../lib/supabase';

/**
 * Searches the Supabase knowledge base using pgvector similarity.
 * Falls back gracefully to JSON text search if the RPC or table doesn't exist yet.
 */
export async function searchKnowledgeBase(queryVector: number[], queryText?: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.rpc('match_knowledge', {
      query_embedding: queryVector,
      match_threshold: 0.5,
      match_count: 5,
    });

    if (error) {
      console.warn('RAG search RPC failed (table may not exist yet), falling back to local JSON:', error.message);
      return await fallbackKeywordSearch(queryText || '');
    }

    if (!data || data.length === 0) {
      return await fallbackKeywordSearch(queryText || '');
    }

    // Each row should have a `content` field with the text chunk
    return data.map((row: { content: string }) => row.content);
  } catch (err) {
    console.warn('RAG search error:', err);
    return await fallbackKeywordSearch(queryText || '');
  }
}

async function fallbackKeywordSearch(query: string): Promise<string[]> {
  if (!query) return [];
  try {
    const res = await fetch('/knowledge.json');
    const records = await res.json();
    const keywords = query.toLowerCase().split(' ').filter(w => w.length > 3);
    
    // Sort records by keyword match score
    const scored = records.map((record: any) => {
      const text = JSON.stringify(record).toLowerCase();
      let score = 0;
      for (const kw of keywords) {
        if (text.includes(kw)) score++;
      }
      return { record, score };
    });
    
    scored.sort((a: any, b: any) => b.score - a.score);
    const topMatches = scored.filter((s: any) => s.score > 0).slice(0, 5).map((s: any) => {
      // create a text chunk out of the JSON object
      const r = s.record;
      return `Title: ${r.title}\nDomain: ${r.domain}\nSummary: ${r.summary}\nWisdom: ${r.dadi_story || ''}\nModern Relevance: ${r.modern_relevance?.join(', ')}\nGen-Z Hook: ${r.gen_z_hook}`;
    });
    return topMatches;
  } catch (e) {
    console.error('Fallback search failed', e);
    return [];
  }
}

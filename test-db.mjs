import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zgvpfhvdfvyiuplcdkgh.supabase.co',
  'sb_publishable_EYTIeLXftRQfrdgWQaoadQ_nV2Pl0yd'
);

// Test 1: Check connection by querying learning_modules
console.log('--- Test 1: Query learning_modules ---');
const { data: modules, error: modErr } = await supabase.from('learning_modules').select('*');
if (modErr) console.log('ERROR:', modErr.message, modErr.code, modErr.hint);
else console.log('Modules found:', modules?.length, modules?.length > 0 ? JSON.stringify(modules[0]) : '(empty table)');

// Test 2: Try signing in
console.log('\n--- Test 2: Sign in ---');
const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({ email: 'ajay@gmail.com', password: 'ajay' });
if (authErr) console.log('AUTH ERROR:', authErr.message);
else console.log('Auth OK, user:', authData.user?.id, authData.user?.email);

// Test 3: Check users table
console.log('\n--- Test 3: Query users table ---');
const { data: users, error: usrErr } = await supabase.from('users').select('*');
if (usrErr) console.log('ERROR:', usrErr.message, usrErr.code, usrErr.hint);
else console.log('Users found:', users?.length);

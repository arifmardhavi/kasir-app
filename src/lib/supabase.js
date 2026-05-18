import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wuxmnkbvbnhnleunapos.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1eG1ua2J2Ym5obmxldW5hcG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzk2NDEsImV4cCI6MjA5NDY1NTY0MX0.a9XgMyNsaeTcgk4alXUKriGbFYX5WljN26PqNkLTZz0'

export const supabase = createClient(supabaseUrl, supabaseKey)

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bquyjwhbixvskglcfzkh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxdXlqd2hiaXh2c2tnbGNmemtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3OTYwMDksImV4cCI6MjEwMjM3MjAwOX0.-1lywk4wfQcvyBaxjHOOrh0QS2GRbcsyidy6NgLg0uA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

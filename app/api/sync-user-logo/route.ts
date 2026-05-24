import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
    );

    const payload = await req.json();
    const { event, data } = payload;

    if (event === 'User.Created') {
      const { id, primaryEmail, name } = data;
      
      const { error } = await supabaseAdmin
        .from('restaurants')
        .insert([{
          id: id,
          email: primaryEmail,
          name: name || 'Nouveau Restaurant',
          subdomain: `resto-${id.substring(0, 5)}`,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      return NextResponse.json({ message: 'User synchronized' });
    }

    if (event === 'User.Deleted') {
      const { id } = data;
      const { error } = await supabaseAdmin.from('restaurants').delete().eq('id', id);

      if (error) throw error;
      return NextResponse.json({ message: 'User data cleaned' });
    }

    return NextResponse.json({ message: 'Event ignored' });
  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

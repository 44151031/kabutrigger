import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async () => {
  const siteUrl = Deno.env.get("SITE_URL") || "https://kabutrigger.vercel.app";
  const apiUrl = `${siteUrl}/api/rss-refresh`;
  
  console.log(`🔄 Fetching RSS from: ${apiUrl}`);
  
  try {
    const res = await fetch(apiUrl);
    const text = await res.text();
    
    if (!res.ok) {
      console.error(`❌ RSS refresh failed: ${res.status} - ${text}`);
      return new Response(`Error: ${text}`, { status: res.status });
    }
    
    console.log(`✅ RSS refresh successful: ${res.status}`);
    console.log(`📊 Response: ${text}`);
    
    return new Response(text, { 
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error in fetch-rss:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});


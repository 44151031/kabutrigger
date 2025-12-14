import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async () => {
  const siteUrl = Deno.env.get("SITE_URL") || "https://kabutrigger.vercel.app";
  const res = await fetch(`${siteUrl}/api/rss-refresh`);
  
  console.log("✅ RSS refresh triggered:", res.status);
  
  if (!res.ok) {
    const text = await res.text();
    console.error("❌ RSS refresh failed:", text);
    return new Response(`Error: ${text}`, { status: res.status });
  }
  
  const data = await res.json();
  console.log("📊 Result:", data);
  
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});


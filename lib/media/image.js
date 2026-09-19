const optimizedHosts = new Set([
  "basttettravel.com",
  "zxpcoubskncdsruearze.supabase.co",
  "lkwlrezhuxercfvtjiiw.supabase.co",
]);

export function canUseNextImageOptimizer(source) {
  if (!source || source.startsWith("/")) return true;

  try {
    return optimizedHosts.has(new URL(source).hostname);
  } catch {
    return false;
  }
}

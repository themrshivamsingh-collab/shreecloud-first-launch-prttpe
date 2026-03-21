import { supabase } from "@/integrations/supabase/client";

// ── User-friendly error messages ─────────────────────────
function friendlyError(error: any): string {
  const msg = error?.message || error?.toString() || '';
  
  if (msg.includes('FetchError') || msg.includes('fetch') || msg.includes('network') || msg.includes('Failed to fetch')) {
    return 'Unable to connect to server panel. Please try again later.';
  }
  if (msg.includes('401') || msg.includes('403') || msg.includes('Unauthorized') || msg.includes('Forbidden') || msg.includes('Access denied')) {
    return 'Access denied. Please check your account permissions.';
  }
  if (msg.includes('not configured') || msg.includes('PTERODACTYL')) {
    return 'Server panel is not configured. Please contact an administrator.';
  }
  if (msg.includes('ServerStateConflictException') || msg.includes('still installing')) {
    return 'Server is still installing. Please wait for installation to complete.';
  }
  if (msg.includes('404') || msg.includes('Not Found')) {
    return 'Server not found. It may have been removed or you lack access.';
  }
  if (msg.includes('429') || msg.includes('rate limit')) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  if (msg.includes('500') || msg.includes('Internal Server')) {
    return 'The server panel encountered an internal error. Please try again later.';
  }
  return msg || 'An unexpected error occurred. Please try again.';
}

async function pteroFetch(endpoint: string, method = 'GET', body?: unknown) {
  const { data, error } = await supabase.functions.invoke('pterodactyl-proxy', {
    body: { endpoint, method, body },
  });

  if (error) throw new Error(friendlyError(error));
  
  if (data?.errors && Array.isArray(data.errors)) {
    const first = data.errors[0];
    if (first?.code === 'ServerStateConflictException') {
      throw new Error('Server is still installing. Please wait for installation to complete.');
    }
    throw new Error(friendlyError({ message: first?.detail || first?.code }));
  }
  
  if (data?.error) throw new Error(friendlyError({ message: data.error }));
  return data;
}

// ── Client API: Account ──────────────────────────────────
export async function getAccount() {
  const res = await pteroFetch('/api/client/account');
  return res.attributes;
}

// ── Client API: Servers ──────────────────────────────────
export async function listServers() {
  const res = await pteroFetch('/api/client');
  return (res.data || []).map((s: any) => ({
    id: s.attributes.identifier,
    internalId: s.attributes.internal_id,
    uuid: s.attributes.uuid,
    name: s.attributes.name,
    description: s.attributes.description,
    status: s.attributes.status,
    isSuspended: s.attributes.is_suspended,
    isInstalling: s.attributes.is_installing,
    limits: s.attributes.limits,
    featureLimits: s.attributes.feature_limits,
    sftpDetails: s.attributes.sftp_details,
    node: s.attributes.node,
    allocation: s.attributes.relationships?.allocations?.data?.[0]?.attributes,
  }));
}

export async function getServerDetails(serverId: string) {
  const res = await pteroFetch(`/api/client/servers/${serverId}`);
  return res.attributes;
}

export async function getServerResources(serverId: string) {
  const res = await pteroFetch(`/api/client/servers/${serverId}/resources`);
  return res.attributes;
}

// ── Client API: Console WebSocket ────────────────────────
export async function getWebsocketDetails(serverId: string) {
  const res = await pteroFetch(`/api/client/servers/${serverId}/websocket`);
  return res.data;
}

// ── Client API: Send Command ─────────────────────────────
export async function sendCommand(serverId: string, command: string) {
  return pteroFetch(`/api/client/servers/${serverId}/command`, 'POST', { command });
}

// ── Client API: Power ────────────────────────────────────
export async function sendPowerAction(serverId: string, signal: 'start' | 'stop' | 'restart' | 'kill') {
  return pteroFetch(`/api/client/servers/${serverId}/power`, 'POST', { signal });
}

// ── Client API: Files ────────────────────────────────────
export async function listFiles(serverId: string, directory = '/') {
  const res = await pteroFetch(`/api/client/servers/${serverId}/files/list?directory=${encodeURIComponent(directory)}`);
  return (res.data || []).map((f: any) => f.attributes);
}

export async function getFileContent(serverId: string, file: string) {
  const res = await pteroFetch(`/api/client/servers/${serverId}/files/contents?file=${encodeURIComponent(file)}`);
  return res;
}

// ── Client API: Startup ──────────────────────────────────
export async function getStartup(serverId: string) {
  const res = await pteroFetch(`/api/client/servers/${serverId}/startup`);
  return (res.data || []).map((v: any) => v.attributes);
}

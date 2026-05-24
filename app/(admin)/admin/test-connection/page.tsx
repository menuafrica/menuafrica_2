"use client";
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button, Input, Label, Card } from '@/components/ui/uicomponents';
import { Play, AlertTriangle, CheckCircle, XCircle, Terminal, Copy } from 'lucide-react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bicwtmjjyzalyvbbbzqi.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface LogEntry {
  step: string;
  ok: boolean;
  duration_ms: number;
  result?: any;
  error?: string;
  timestamp: string;
}

export default function TestConnection() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serviceKey, setServiceKey] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (entry: Omit<LogEntry, 'timestamp'>) => {
    setLogs(prev => [...prev, { ...entry, timestamp: new Date().toISOString().split('T')[1].slice(0, -1) }]);
  };

  const withTimeout = async (promise: Promise<any> | any, ms: number, label: string): Promise<any> => {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout (${ms}ms) sur ${label}`)), ms)
    );
    return Promise.race([promise, timeout]);
  };

  const runTests = async () => {
    if (!email || !password) {
      alert("Email et mot de passe requis");
      return;
    }

    setIsRunning(true);
    setLogs([]);
    let userId = '';

    try {
      const startA = performance.now();
      addLog({ step: 'A_Start', ok: true, duration_ms: 0, result: 'Tentative de connexion...' });
      
      const { data: authData, error: authError } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        10000,
        'SignIn'
      );
      
      const endA = performance.now();

      if (authError) {
        addLog({ step: 'A_SignIn', ok: false, duration_ms: endA - startA, error: authError.message });
        setIsRunning(false);
        return;
      }

      userId = authData.user?.id || '';
      const tokenPreview = authData.session?.access_token ? 'Token présent' : 'NONE';
      
      addLog({ 
        step: 'A_SignIn', 
        ok: true, 
        duration_ms: endA - startA, 
        result: { uid: userId, tokenStatus: tokenPreview } 
      });

      const startB = performance.now();
      const { data: sessionData } = await supabase.auth.getSession();
      const endB = performance.now();
      
      const sessionUid = sessionData.session?.user?.id;
      const isMatch = sessionUid === userId;

      addLog({
        step: 'B_SessionCheck',
        ok: isMatch,
        duration_ms: endB - startB,
        result: { sessionUid, match: isMatch },
        error: !isMatch ? 'Mismatch UID' : undefined
      });

      const startC = performance.now();
      const { data: selectData, error: selectError } = await withTimeout(
        supabase.from('restaurants').select('id, name').limit(1),
        8000,
        'Select Restaurants'
      );
      const endC = performance.now();

      addLog({
        step: 'C_SelectRestaurants',
        ok: !selectError,
        duration_ms: endC - startC,
        result: selectData ? `Rows: ${selectData.length}` : 'No Data',
        error: selectError?.message
      });

      const startD = performance.now();
      const { data: rpcData, error: rpcError } = await withTimeout(
        supabase.rpc('get_full_user_profile'),
        10000,
        'RPC get_full_user_profile'
      );
      const endD = performance.now();

      addLog({
        step: 'D_RpcProfile',
        ok: !rpcError && rpcData !== null,
        duration_ms: endD - startD,
        result: rpcData ? 'JSON Reçu' : 'NULL returned',
        error: rpcError?.message || (rpcData === null ? 'RPC renvoie NULL (Probable RLS)' : undefined)
      });

      if (serviceKey) {
        const startF = performance.now();
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_full_user_profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${serviceKey}`
                },
                body: JSON.stringify({})
            });
            const json = await res.json();
            const endF = performance.now();
            
            addLog({
                step: 'F_ServiceRoleRPC',
                ok: res.ok,
                duration_ms: endF - startF,
                result: res.ok ? 'Succès (Admin Bypass)' : json,
                error: !res.ok ? 'Admin request failed' : undefined
            });
        } catch (e: any) {
            addLog({ step: 'F_ServiceRoleRPC', ok: false, duration_ms: 0, error: e.message });
        }
      }

    } catch (err: any) {
      addLog({ step: 'CRITICAL_FAIL', ok: false, duration_ms: 0, error: err.message || 'Erreur script' });
    } finally {
      setIsRunning(false);
    }
  };

  const copyLogs = () => {
    const text = JSON.stringify(logs, null, 2);
    navigator.clipboard.writeText(text);
    alert("Copié !");
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900 text-white p-4 md:p-8 font-mono overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
            <h1 className="text-2xl font-bold flex items-center gap-3 text-orange-500">
                <AlertTriangle /> DIAGNOSTIC CONNECTION V2
            </h1>
            <p className="text-slate-400 text-sm mt-1">
                Test sur : {SUPABASE_URL}
            </p>
        </div>

        <Card className="bg-slate-800 border-slate-700 p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <Label className="text-slate-300">Email Compte Bloqué</Label>
                    <Input className="bg-slate-900 border-slate-600 text-white" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                    <Label className="text-slate-300">Mot de passe</Label>
                    <Input type="password" className="bg-slate-900 border-slate-600 text-white" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
            </div>
            <div>
                <Label className="text-slate-300">Clé Service Role (Optionnel - Pour bypass RLS)</Label>
                <Input type="password" placeholder="eyJh..." className="bg-slate-900 border-slate-600 text-white" value={serviceKey} onChange={e => setServiceKey(e.target.value)} />
            </div>
            
            <Button onClick={runTests} isLoading={isRunning} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-12">
                <Play size={18} className="mr-2" /> LANCER LE TEST
            </Button>
        </Card>

        {logs.length > 0 && (
            <div className="bg-black rounded-xl border border-slate-700 overflow-hidden">
                <div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <Terminal size={14} /> Résultats
                    </span>
                    <button onClick={copyLogs} className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white flex items-center gap-2">
                        <Copy size={12}/> Copier JSON
                    </button>
                </div>
                <div className="p-4 space-y-2 overflow-x-auto max-h-[400px]">
                    {logs.map((log, idx) => (
                        <div key={idx} className={`text-xs p-2 rounded border-l-4 ${log.ok ? 'border-green-500 bg-green-900/10' : 'border-red-500 bg-red-900/10'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                {log.ok ? <CheckCircle size={12} className="text-green-500"/> : <XCircle size={12} className="text-red-500"/>}
                                <span className="font-bold text-slate-300">{log.step}</span>
                                <span className="text-slate-500 ml-auto">{log.duration_ms.toFixed(0)}ms</span>
                            </div>
                            {log.error && <div className="text-red-400 font-bold mt-1">ERREUR: {log.error}</div>}
                            {log.result && <pre className="text-slate-400 mt-1 opacity-80 whitespace-pre-wrap">{JSON.stringify(log.result).substring(0, 200)}</pre>}
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

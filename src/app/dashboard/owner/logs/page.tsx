/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LogFile { name: string; size: number; modified: string; }

export default function OwnerLogsPage() {
  const [logFiles, setLogFiles] = useState<LogFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<{name: string, content: string} | null>(null);
  const [loadingLog, setLoadingLog] = useState(false);
  const [liveLogs, setLiveLogs] = useState<{timestamp: string, level: string, message: string}[]>([]);

  const fetchLiveLogs = () => {
    fetch('/api/bot/owner/logs/live')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setLiveLogs(data.logs || []);
        }
      })
      .catch(() => {});
  };

  const fetchLogs = () => {
    setLoading(true);
    fetch('/api/bot/owner/logs')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setLogFiles(data.files || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
    fetchLiveLogs();
    
    // Poll live logs every 3 seconds
    const interval = setInterval(fetchLiveLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchLogs();
    fetchLiveLogs();
  };

  const handleViewLog = (filename: string) => {
    setLoadingLog(true);
    fetch(`/api/bot/owner/logs/${filename}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setSelectedLog({ name: filename, content: data.content });
        } else {
          alert('Failed to load log: ' + data.message);
        }
      })
      .catch(console.error)
      .finally(() => setLoadingLog(false));
  };

  const closeLogView = () => {
    setSelectedLog(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <Link href="/dashboard/owner" className="text-text-secondary hover:text-discord transition-colors p-2 hover:bg-dark-secondary rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-4xl font-bold flex items-center gap-3">
                                <svg className="w-10 h-10 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Bot Logs
                            </h1>
                        </div>
                    </div>
                    <p className="text-text-secondary ml-14">View bot activity and error logs</p>
                </div>
                <button 
                  onClick={handleRefresh} 
                  className="bg-discord hover:bg-discord-hover text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-discord/20"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    Refresh
                </button>
            </div>
        </div>

        {/* Console Output */}
        <div className="bg-dark-secondary border border-border-dark rounded-xl overflow-hidden mb-8 shadow-sm flex flex-col" style={{ maxHeight: '600px' }}>
            <div className="p-4 border-b border-border-dark flex items-center justify-between bg-dark-secondary shrink-0">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                   <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                   </svg>
                   Live Console
                </h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-dark-card rounded-full border border-border-dark">
                    <span className="w-2.5 h-2.5 bg-success rounded-full animate-pulse shadow-[0_0_8px_rgba(87,242,135,0.8)]"></span>
                    <span className="text-xs font-bold font-mono tracking-wider text-text-secondary uppercase">Live</span>
                </div>
            </div>
            <div className="p-6 font-mono text-sm bg-dark-primary flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 min-h-75">
                {liveLogs.length === 0 ? (
                  <div className="text-text-secondary opacity-75 italic mb-4">No recent live logs captured yet. Generating logs...</div>
                ) : (
                  liveLogs.map((log, index) => {
                    let logColor = "text-text-secondary";
                    switch(log.level) {
                      case 'ERROR': logColor = "text-error"; break;
                      case 'WARN': logColor = "text-warning"; break;
                      case 'INFO': logColor = "text-discord"; break;
                      case 'DEBUG': logColor = "text-success"; break;
                    }
                    return (
                      <div key={index} className={`font-mono break-all ${logColor}`}>
                        <span className="opacity-75">[{log.timestamp}]</span> [{log.level}] {log.message}
                      </div>
                    );
                  })
                )}
            </div>
        </div>

        {/* Log Files */}
        {logFiles && logFiles.length > 0 ? (
        <div className="bg-dark-secondary border border-border-dark rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-border-dark bg-dark-secondary">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                   <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                   </svg>
                   Log Files
                </h2>
                <p className="text-sm text-text-secondary mt-1 ml-7">Download and view historical log files</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-dark-card border-b border-border-dark">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">File Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Size</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Last Modified</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-text-secondary uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-dark">
                        {logFiles.map((file, idx) => (
                        <tr key={idx} className="hover:bg-dark-card transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                    </svg>
                                    <span className="font-mono text-sm text-white">{file.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-text-secondary">
                                {(file.size / 1024).toFixed(2)} KB
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-text-secondary">
                                {new Date(file.modified).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button 
                                  onClick={() => handleViewLog(file.name)}
                                  className="text-discord hover:text-white bg-discord/10 hover:bg-discord px-4 py-2 rounded-lg font-bold text-sm transition-all border border-discord/20 hover:border-discord shadow-sm"
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        ) : (
        <div className="bg-dark-secondary border border-border-dark rounded-xl p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-dark-card border border-border-dark rounded-full flex flex-col items-center justify-center mx-auto mb-6">
               <svg className="w-10 h-10 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
               </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">No Log Files Found</h3>
            <p className="text-text-secondary max-w-sm mx-auto">Log files will appear here once the system creates them.</p>
        </div>
        )}

        {/* Log Levels Info */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 pb-12">
            <div className="bg-dark-secondary border border-border-dark rounded-lg p-5 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center border border-success/30">
                    <div className="w-3 h-3 bg-success rounded-full shadow-[0_0_8px_rgba(87,242,135,0.8)]"></div>
                </div>
                <div>
                    <div className="text-sm font-bold text-white">Success</div>
                    <div className="text-xs text-text-secondary mt-0.5">Successful operations</div>
                </div>
            </div>
            <div className="bg-dark-secondary border border-border-dark rounded-lg p-5 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-discord/20 flex items-center justify-center border border-discord/30">
                    <div className="w-3 h-3 bg-discord rounded-full shadow-[0_0_8px_rgba(88,101,242,0.8)]"></div>
                </div>
                <div>
                    <div className="text-sm font-bold text-white">Info</div>
                    <div className="text-xs text-text-secondary mt-0.5">General information</div>
                </div>
            </div>
            <div className="bg-dark-secondary border border-border-dark rounded-lg p-5 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center border border-warning/30">
                    <div className="w-3 h-3 bg-warning rounded-full shadow-[0_0_8px_rgba(254,231,92,0.8)]"></div>
                </div>
                <div>
                    <div className="text-sm font-bold text-white">Warning</div>
                    <div className="text-xs text-text-secondary mt-0.5">Non-critical issues</div>
                </div>
            </div>
            <div className="bg-dark-secondary border border-border-dark rounded-lg p-5 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-danger/20 flex items-center justify-center border border-danger/30">
                    <div className="w-3 h-3 bg-danger rounded-full shadow-[0_0_8px_rgba(237,66,69,0.8)]"></div>
                </div>
                <div>
                    <div className="text-sm font-bold text-white">Error</div>
                    <div className="text-xs text-text-secondary mt-0.5">Critical errors</div>
                </div>
            </div>
        </div>

        {/* Modal for Log Viewing */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
             <div className="bg-dark-secondary border border-border-dark rounded-xl w-full max-w-5xl h-[80vh] flex flex-col">
                <div className="p-4 border-b border-border-dark flex items-center justify-between">
                   <h3 className="text-xl font-bold flex items-center gap-2">
                       <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                       {selectedLog.name}
                   </h3>
                   <button onClick={closeLogView} className="text-text-secondary hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                   </button>
                </div>
                <div className="p-4 flex-1 overflow-auto bg-dark-primary font-mono text-sm whitespace-pre-wrap text-text-secondary">
                   {selectedLog.content}
                </div>
             </div>
          </div>
        )}
    </div>
  );
}

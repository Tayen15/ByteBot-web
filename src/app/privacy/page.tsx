import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | ByteBot',
  description: 'ByteBot Privacy Policy.',
};

export default function PrivacyPage() {
  const currentDate = new Date().toISOString().slice(0, 10);

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-white">Privacy Policy</h1>
        <p className="text-text-secondary">Effective Date: <span className="font-semibold text-white">{currentDate}</span></p>
      </div>

      <section className="mb-12 bg-dark-secondary border border-border-dark rounded-xl p-8 space-y-8 shadow-sm">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-6">
           <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
           </svg>
           Privacy Policy
        </h2>
        <div className="space-y-8 text-sm leading-relaxed text-text-secondary">
          <div className="bg-dark-primary border border-border-dark p-5 rounded-lg">
            <h3 className="text-lg font-bold text-white mb-3">1. Data We Collect</h3>
            <ul className="space-y-2.5">
              <li className="flex gap-2">
                 <span className="text-success select-none">✓</span>
                 <span><span className="text-white font-semibold">Discord IDs:</span> Guild, channel, role, user IDs for configuration and execution (never stored with personal metadata beyond what Discord provides).</span>
              </li>
              <li className="flex gap-2">
                 <span className="text-success select-none">✓</span>
                 <span><span className="text-white font-semibold">Guild Settings:</span> Prayer times, welcome message templates, monitoring configurations, lofi playback state, moderation rules.</span>
              </li>
              <li className="flex gap-2">
                 <span className="text-success select-none">✓</span>
                 <span><span className="text-white font-semibold">Session Data:</span> OAuth tokens (session) for authenticated dashboard access; stored via secure server session and not shared.</span>
              </li>
              <li className="flex gap-2">
                 <span className="text-success select-none">✓</span>
                 <span><span className="text-white font-semibold">Runtime Logs:</span> Console level events (success / error) for debugging; not sold or profiled.</span>
              </li>
              <li className="flex gap-2">
                 <span className="text-success select-none">✓</span>
                 <span><span className="text-white font-semibold">Generated Assets:</span> Temporary welcome image previews are processed in memory and not persisted unless explicitly saved.</span>
              </li>
            </ul>
          </div>

          <div className="bg-dark-primary border border-danger/20 p-5 rounded-lg">
             <h3 className="text-lg font-bold text-white mb-3">2. Data We Do NOT Collect</h3>
             <ul className="space-y-2.5">
               <li className="flex gap-2">
                  <span className="text-danger select-none">✗</span>
                  <span><span className="text-white font-semibold">Message Content:</span> We do not read, log, or store the content of personal messages or server chats unless explicitly provided via command arguments (e.g. /announce).</span>
               </li>
               <li className="flex gap-2">
                  <span className="text-danger select-none">✗</span>
                  <span><span className="text-white font-semibold">Voice Data:</span> Lofi streaming features do not listen to or record voice channel participants.</span>
               </li>
               <li className="flex gap-2">
                  <span className="text-danger select-none">✗</span>
                  <span><span className="text-white font-semibold">PII:</span> Real names, email addresses, billing info, or offline identities.</span>
               </li>
            </ul>
          </div>

          <div className="space-y-4">
             <h3 className="text-lg font-bold text-white">3. How Data is Used</h3>
             <p>Data exists solely to facilitate bot features (e.g., knowing which channel to send a welcome message to). We do not sell, trade, or distribute your server/user data to third parties.</p>

             <h3 className="text-lg font-bold text-white">4. Data Deletion & Retention</h3>
             <p>If you kick ByteBot from your server, your stored configurations remain briefly in case of accidental removal. You can request full data wiping by contacting the developers or using specific dashboard tools if available.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

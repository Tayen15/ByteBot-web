import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy & Terms of Service',
  description: 'ByteBot Terms of Service and Privacy Policy.',
};

export default function PrivacyPage() {
  const currentDate = new Date().toISOString().slice(0, 10);

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-white">Terms of Service & Privacy Policy</h1>
        <p className="text-text-secondary">Effective Date: <span className="font-semibold text-white">{currentDate}</span></p>
      </div>

      {/* Terms of Service */}
      <section className="mb-12 bg-dark-secondary border border-border-dark rounded-xl p-8 space-y-6 shadow-sm">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
           <svg className="w-6 h-6 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
           </svg>
           1. Terms of Service
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-text-secondary">
          <p>These Terms govern your access to and use of the ByteBot Discord bot and its accompanying web dashboard. By inviting or using ByteBot you agree to these Terms. If you do not agree, you must remove the bot from your servers and stop using the dashboard.</p>
          <ul className="space-y-3 mt-4">
            <li className="flex items-start gap-3">
               <div className="mt-1 w-1.5 h-1.5 rounded-full bg-discord flex-shrink-0"></div>
               <span><span className="text-white font-bold tracking-wide">Eligibility:</span> You must comply with Discord's Terms of Service and Community Guidelines.</span>
            </li>
            <li className="flex items-start gap-3">
               <div className="mt-1 w-1.5 h-1.5 rounded-full bg-discord flex-shrink-0"></div>
               <span><span className="text-white font-bold tracking-wide">License:</span> You receive a non-exclusive, revocable right to use ByteBot on your Discord servers.</span>
            </li>
            <li className="flex items-start gap-3">
               <div className="mt-1 w-1.5 h-1.5 rounded-full bg-discord flex-shrink-0"></div>
               <span><span className="text-white font-bold tracking-wide">Acceptable Use:</span> You will not attempt to exploit, abuse, overload, reverse engineer, or circumvent rate limits, authentication, or permissions.</span>
            </li>
            <li className="flex items-start gap-3">
               <div className="mt-1 w-1.5 h-1.5 rounded-full bg-discord flex-shrink-0"></div>
               <span><span className="text-white font-bold tracking-wide">Prohibited Content:</span> Do not use ByteBot for hateful, NSFW, spam, malware distribution, or illegal activities.</span>
            </li>
            <li className="flex items-start gap-3">
               <div className="mt-1 w-1.5 h-1.5 rounded-full bg-discord flex-shrink-0"></div>
               <span><span className="text-white font-bold tracking-wide">Availability:</span> We do not guarantee 24/7 uptime. Maintenance or platform outages (Discord / hosting) may interrupt service.</span>
            </li>
            <li className="flex items-start gap-3">
               <div className="mt-1 w-1.5 h-1.5 rounded-full bg-discord flex-shrink-0"></div>
               <span><span className="text-white font-bold tracking-wide">Bot Removal:</span> We may remove the bot from a server or restrict features for abuse or violations without prior notice.</span>
            </li>
            <li className="flex items-start gap-3">
               <div className="mt-1 w-1.5 h-1.5 rounded-full bg-discord flex-shrink-0"></div>
               <span><span className="text-white font-bold tracking-wide">Changes:</span> Features may evolve. Breaking changes will normally be communicated via version updates unless urgent for security.</span>
            </li>
            <li className="flex items-start gap-3">
               <div className="mt-1 w-1.5 h-1.5 rounded-full bg-discord flex-shrink-0"></div>
               <span><span className="text-white font-bold tracking-wide">Liability:</span> ByteBot is provided "AS IS" without warranties. We are not liable for loss of data, downtime, or moderation outcomes.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Privacy Policy */}
      <section className="mb-12 bg-dark-secondary border border-border-dark rounded-xl p-8 space-y-8 shadow-sm">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-6">
           <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
           </svg>
           2. Privacy Policy
        </h2>
        <div className="space-y-8 text-sm leading-relaxed text-text-secondary">
          <div className="bg-dark-primary border border-border-dark p-5 rounded-lg">
            <h3 className="text-lg font-bold text-white mb-3">2.1 Data We Collect</h3>
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
            <h3 className="text-lg font-bold text-danger mb-3">2.2 Data NOT Collected</h3>
            <ul className="space-y-2.5">
              <li className="flex gap-2 text-danger/80">
                 <span className="select-none">✕</span>
                 <span>No message content archival.</span>
              </li>
              <li className="flex gap-2 text-danger/80">
                 <span className="select-none">✕</span>
                 <span>No user behavioral analytics beyond basic command usage counts (if enabled).</span>
              </li>
              <li className="flex gap-2 text-danger/80">
                 <span className="select-none">✕</span>
                 <span>No commercial profiling or third-party advertising trackers.</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-2">2.3 How We Use Data</h3>
            <p className="bg-dark-primary p-4 rounded-lg border border-border-dark">Data is used solely to render dashboard configuration, execute bot features (e.g., announcements, prayer scheduling, welcome messages), and maintain service stability.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-2">2.4 Data Retention</h3>
            <p className="bg-dark-primary p-4 rounded-lg border border-border-dark">Configuration data persists until you remove ByteBot from a server or request deletion. Orphaned guild settings may be periodically purged. Session data expires automatically based on TTL configuration (30 days).</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-3">2.5 Data Removal / Opt-Out</h3>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <li className="bg-dark-primary p-4 rounded-lg border border-border-dark text-center">
                 <div className="w-8 h-8 rounded-full bg-discord/20 flex items-center justify-center mx-auto mb-2 text-discord">1</div>
                 Remove the bot from your server to stop ongoing collection.
              </li>
              <li className="bg-dark-primary p-4 rounded-lg border border-border-dark text-center">
                 <div className="w-8 h-8 rounded-full bg-discord/20 flex items-center justify-center mx-auto mb-2 text-discord">2</div>
                 Request manual deletion of stored guild configuration via support channel.
              </li>
              <li className="bg-dark-primary p-4 rounded-lg border border-border-dark text-center">
                 <div className="w-8 h-8 rounded-full bg-discord/20 flex items-center justify-center mx-auto mb-2 text-discord">3</div>
                 Clear session by logging out (invalidates OAuth session).
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-2">2.6 Security Measures</h3>
            <p>We use secure session cookies, least-privilege Discord scopes, and avoid storing unnecessary personal data. No system is perfectly secure; report vulnerabilities responsibly.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-3">2.7 Third-Party Services</h3>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <li className="bg-dark-primary p-4 rounded-lg border border-border-dark flex flex-col items-center text-center">
                 <span className="text-white font-bold mb-1">Discord API</span>
                 <span className="text-xs opacity-75">Authentication, guild/member metadata, events.</span>
              </li>
              <li className="bg-dark-primary p-4 rounded-lg border border-border-dark flex flex-col items-center text-center">
                 <span className="text-white font-bold mb-1">Database Provider</span>
                 <span className="text-xs opacity-75">Persists configuration and session data.</span>
              </li>
              <li className="bg-dark-primary p-4 rounded-lg border border-border-dark flex flex-col items-center text-center">
                 <span className="text-white font-bold mb-1">External Storage</span>
                 <span className="text-xs opacity-75">Used for welcome image backgrounds (not tracked).</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-2">2.8 Children</h3>
            <p className="bg-dark-primary p-4 rounded-lg border border-border-dark">ByteBot relies on Discord platform age restrictions. We do not knowingly process data of users below Discord's minimum age.</p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-2">2.9 Changes to This Policy</h3>
            <p>Material changes will be versioned and reflected in release notes / changelog. Continued use after updates constitutes acceptance.</p>
          </div>

          <div className="bg-discord/10 border border-discord/30 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
               <svg className="w-5 h-5 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
               </svg>
               2.10 Contact
            </h3>
            <p>For questions or deletion requests, reach out via the support server: <Link href="https://discord.gg/" className="text-discord hover:underline font-bold" target="_blank" rel="noopener noreferrer">Join Support Server</Link>.</p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-dark-card border border-border-dark rounded-xl p-6 flex gap-4 items-start shadow-sm">
        <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0 text-warning mt-1">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
           </svg>
        </div>
        <div>
           <h2 className="text-xl font-bold text-white mb-1">3. Disclaimer</h2>
           <p className="text-sm leading-relaxed text-text-secondary">This document is provided for transparency only and is not formal legal advice. If you require a fully compliant policy for commercial deployment, consult a legal professional.</p>
        </div>
      </section>
    </div>
  );
}

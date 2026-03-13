import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | ByteBot',
  description: 'ByteBot Terms of Service.',
};

export default function TosPage() {
  const currentDate = new Date().toISOString().slice(0, 10);

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-white">Terms of Service</h1>
        <p className="text-text-secondary">Effective Date: <span className="font-semibold text-white">{currentDate}</span></p>
      </div>

      <section className="mb-12 bg-dark-secondary border border-border-dark rounded-xl p-8 space-y-6 shadow-sm">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
           <svg className="w-6 h-6 text-discord" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
           </svg>
           Terms of Service
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
    </div>
  );
}

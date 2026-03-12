import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Commands - ByteBot',
  description: 'Complete list of available slash commands for ByteBot',
};

export default function CommandsPage() {
  return (
    <>
      {/* Header Section */}
      <section className="py-16 bg-gradient-to-b from-dark-secondary to-dark-primary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Bot Commands</h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Complete list of available slash commands. Use them by typing <code className="bg-dark-card px-2 py-1 rounded text-discord">/command</code> in Discord
          </p>
        </div>
      </section>

      {/* Commands Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Information Commands */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-1 h-8 bg-discord rounded"></span>
              Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-dark-card border border-border-dark rounded-lg p-6 hover:border-discord transition-all">
                <div className="flex items-start justify-between mb-3">
                  <code className="text-discord font-mono text-lg">/help</code>
                  <span className="text-xs bg-green-900 px-2 py-1 rounded text-green-400">Public</span>
                </div>
                <p className="text-text-secondary">Display list of available commands</p>
              </div>
              
              <div className="bg-dark-card border border-border-dark rounded-lg p-6 hover:border-discord transition-all">
                <div className="flex items-start justify-between mb-3">
                  <code className="text-discord font-mono text-lg">/ping</code>
                  <span className="text-xs bg-green-900 px-2 py-1 rounded text-green-400">Public</span>
                </div>
                <p className="text-text-secondary">Check bot latency and response time</p>
              </div>
              
              <div className="bg-dark-card border border-border-dark rounded-lg p-6 hover:border-discord transition-all">
                <div className="flex items-start justify-between mb-3">
                  <code className="text-discord font-mono text-lg">/serverinfo</code>
                  <span className="text-xs bg-green-900 px-2 py-1 rounded text-green-400">Public</span>
                </div>
                <p className="text-text-secondary">Display detailed server information</p>
              </div>
              
              <div className="bg-dark-card border border-border-dark rounded-lg p-6 hover:border-discord transition-all">
                <div className="flex items-start justify-between mb-3">
                  <code className="text-discord font-mono text-lg">/userinfo</code>
                  <span className="text-xs bg-green-900 px-2 py-1 rounded text-green-400">Public</span>
                </div>
                <p className="text-text-secondary">Get information about a user</p>
              </div>
              
              <div className="bg-dark-card border border-border-dark rounded-lg p-6 hover:border-discord transition-all">
                <div className="flex items-start justify-between mb-3">
                  <code className="text-discord font-mono text-lg">/stats</code>
                  <span className="text-xs bg-green-900 px-2 py-1 rounded text-green-400">Public</span>
                </div>
                <p className="text-text-secondary">Display bot statistics and uptime</p>
              </div>
            </div>
          </div>

          {/* Moderation Commands */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-1 h-8 bg-discord rounded"></span>
              Moderation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-dark-card border border-border-dark rounded-lg p-6 hover:border-discord transition-all">
                <div className="flex items-start justify-between mb-3">
                  <code className="text-discord font-mono text-lg">/ban</code>
                  <span className="text-xs bg-red-900 px-2 py-1 rounded text-red-400">Admin</span>
                </div>
                <p className="text-text-secondary">Ban a user from the server</p>
              </div>
              
              <div className="bg-dark-card border border-border-dark rounded-lg p-6 hover:border-discord transition-all">
                <div className="flex items-start justify-between mb-3">
                  <code className="text-discord font-mono text-lg">/kick</code>
                  <span className="text-xs bg-red-900 px-2 py-1 rounded text-red-400">Admin</span>
                </div>
                <p className="text-text-secondary">Kick a user from the server</p>
              </div>
              
              <div className="bg-dark-card border border-border-dark rounded-lg p-6 hover:border-discord transition-all">
                <div className="flex items-start justify-between mb-3">
                  <code className="text-discord font-mono text-lg">/clear</code>
                  <span className="text-xs bg-red-900 px-2 py-1 rounded text-red-400">Admin</span>
                </div>
                <p className="text-text-secondary">Clear multiple messages at once (bulk delete)</p>
              </div>
            </div>
          </div>

          {/* Music Commands */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-1 h-8 bg-discord rounded"></span>
              Music
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-dark-card border border-border-dark rounded-lg p-6 hover:border-discord transition-all">
                <div className="flex items-start justify-between mb-3">
                  <code className="text-discord font-mono text-lg">/lofi</code>
                  <span className="text-xs bg-green-900 px-2 py-1 rounded text-green-400">Public</span>
                </div>
                <p className="text-text-secondary">Start 24/7 lofi music stream in voice channel</p>
              </div>
              
              <div className="bg-dark-card border border-border-dark rounded-lg p-6 hover:border-discord transition-all">
                <div className="flex items-start justify-between mb-3">
                  <code className="text-discord font-mono text-lg">/stoplofi</code>
                  <span className="text-xs bg-red-900 px-2 py-1 rounded text-red-400">Admin</span>
                </div>
                <p className="text-text-secondary">Stop the lofi music stream</p>
              </div>
              
              <div className="bg-dark-card border border-border-dark rounded-lg p-6 hover:border-discord transition-all">
                <div className="flex items-start justify-between mb-3">
                  <code className="text-discord font-mono text-lg">/lyrics</code>
                  <span className="text-xs bg-green-900 px-2 py-1 rounded text-green-400">Public</span>
                </div>
                <p className="text-text-secondary">Search and display song lyrics</p>
              </div>
            </div>
          </div>

          {/* Minecraft Commands */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-1 h-8 bg-discord rounded"></span>
              Minecraft
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-dark-card border border-border-dark rounded-lg p-6 hover:border-discord transition-all">
                <div className="flex items-start justify-between mb-3">
                  <code className="text-discord font-mono text-lg">/mcstatus</code>
                  <span className="text-xs bg-green-900 px-2 py-1 rounded text-green-400">Public</span>
                </div>
                <p className="text-text-secondary">Check Minecraft server status and player count</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-dark-secondary text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Need More Information?</h2>
          <p className="text-text-secondary mb-8">Join our support server or check the documentation</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://discord.com/api/oauth2/authorize?client_id=1006542146628751400&permissions=8&scope=bot%20applications.commands" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-discord hover:bg-discord-hover rounded-lg font-semibold text-white transition-all duration-200"
            >
              Add to Discord
            </a>
            <Link 
              href="/" 
              className="px-8 py-3 bg-dark-card hover:bg-dark-hover border border-border-dark rounded-lg font-semibold text-white transition-all duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

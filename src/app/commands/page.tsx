import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Commands - ByteBot',
  description: 'Complete list of available slash commands for ByteBot',
};

interface CommandData {
  name: string;
  category: string;
  description: string;
  adminOnly: boolean;
  ownerOnly: boolean;
}

async function getCommands(): Promise<CommandData[]> {
  try {
    const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:4000/api';
    const res = await fetch(`${BOT_API_URL}/public/commands`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.commands : [];
  } catch (error) {
    console.error('Failed to fetch commands:', error);
    return [];
  }
}

export default async function CommandsPage() {
  const commands = await getCommands();
  
  // Group commands by category
  const groupedCommands = commands.reduce((acc, cmd) => {
    // Capitalize category name
    const cat = cmd.category.charAt(0).toUpperCase() + cmd.category.slice(1);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(cmd);
    return acc;
  }, {} as Record<string, CommandData[]>);

  // Sort categories alphabetically
  const categories = Object.keys(groupedCommands).sort();

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
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary">Failed to load commands or no commands available.</p>
            </div>
          ) : (
            categories.map((category) => (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-1 h-8 bg-discord rounded"></span>
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedCommands[category].map((cmd) => (
                    <div key={cmd.name} className="bg-dark-card border border-border-dark rounded-lg p-6 hover:border-discord transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <code className="text-discord font-mono text-lg">/{cmd.name}</code>
                        {cmd.adminOnly ? (
                          <span className="text-xs bg-red-900 px-2 py-1 rounded text-red-400">Admin</span>
                        ) : (
                          <span className="text-xs bg-green-900 px-2 py-1 rounded text-green-400">Public</span>
                        )}
                      </div>
                      <p className="text-text-secondary">{cmd.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
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

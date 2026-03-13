import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-secondary border-t border-border-dark mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-row gap-4 justify-center items-center flex-wrap">
          <Link
            href="/dashboard"
            className="text-text-secondary hover:text-white text-sm transition-colors duration-200"
          >
            Dashboard
          </Link>
          <span className="text-border-dark hidden sm:inline">|</span>
          <a
            href="https://discord.com/api/oauth2/authorize?client_id=1006542146628751400&permissions=8&scope=bot%20applications.commands"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-white text-sm transition-colors duration-200"
          >
            Add App
          </a>
          <span className="text-border-dark hidden sm:inline">|</span>
          <a
            href="https://tako.id/Tayen"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-white text-sm transition-colors duration-200"
          >
            Support Server
          </a>
          <span className="text-border-dark hidden sm:inline">|</span>
          <Link
            href="/tos"
            className="text-text-secondary hover:text-white text-sm transition-colors duration-200"
          >
            Terms of Service
          </Link>
          <span className="text-border-dark hidden sm:inline">|</span>
          <Link
            href="/privacy"
            className="text-text-secondary hover:text-white text-sm transition-colors duration-200"
          >
            Privacy Policy
          </Link>
        </div>

        <div className="pt-4 text-center">
          <p className="text-white font-semibold text-sm">&copy; {currentYear} ByteBot.</p>
        </div>
      </div>
    </footer>
  );
}

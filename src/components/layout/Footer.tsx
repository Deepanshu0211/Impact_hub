import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505] pt-16 pb-8">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-16">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Impact Hub</span>
          </div>
          
          <div className="flex gap-8 text-sm text-gray-400">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
        
        <div className="text-center md:text-left text-xs text-gray-600 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Impact Hub. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed for Hackathon Excellence.</p>
        </div>
      </div>
    </footer>
  );
}

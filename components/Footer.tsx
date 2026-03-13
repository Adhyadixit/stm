import Link from 'next/link'
import { Instagram, Facebook, Youtube, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">STM EVENTS</h3>
            <p className="text-gray-400 text-sm">
              Connecting Club Culture To The World
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/events" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Events</Link></li>
              <li><Link href="/gallery" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Gallery</Link></li>
              <li><Link href="/services" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Services</Link></li>
              <li><Link href="/equipment" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Equipment</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Information</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">About</Link></li>
              <li><Link href="/djs" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Resident DJs</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} STM EVENTS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

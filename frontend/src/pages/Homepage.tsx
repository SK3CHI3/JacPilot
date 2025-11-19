import { Link } from 'react-router-dom'
import Navbar from '../components/homepage/Navbar'
import Hero from '../components/homepage/Hero'
import AnimatedCodeSection from '../components/homepage/AnimatedCodeSection'
import FeatureCards from '../components/homepage/FeatureCards'
import { Rocket, Mail, Github, Twitter, Info, Shield } from 'lucide-react'

function Homepage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24">
        <Hero />
      </div>
      <AnimatedCodeSection />
      <FeatureCards />
      
      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div 
          className="rounded-3xl p-16 text-center shadow-2xl relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)' }}
        >
          <div className="relative z-10">
            <h2 className="text-5xl font-bold text-white mb-6">Ready to Start Learning?</h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of developers mastering Jaseci with JacPilot
            </p>
            <Link
              to="/dashboard"
              className="inline-block px-10 py-5 bg-white text-[#FF6B35] rounded-lg font-semibold text-lg transition-all transform hover:scale-105 hover:shadow-xl shadow-lg"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20 py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)' }}>
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <span style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFD23F 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  JacPilot
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">Master Jaseci through adaptive learning powered by AI.</p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-[#FF6B35] transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#FF6B35] transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#FF6B35] transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/product" className="hover:text-[#FF6B35] transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-[#FF6B35] transition-colors">Pricing</Link></li>
                <li><Link to="/integration" className="hover:text-[#FF6B35] transition-colors">Integration</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors flex items-center gap-2"><Info className="w-4 h-4" /> About</a></li>
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors flex items-center gap-2"><Mail className="w-4 h-4" /> Contact</a></li>
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors flex items-center gap-2"><Shield className="w-4 h-4" /> Privacy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-[#FF6B35] transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>© 2025 JacPilot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Homepage


import Navbar from '../components/homepage/Navbar'
import Hero from '../components/homepage/Hero'
import FeatureCards from '../components/homepage/FeatureCards'

function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <Navbar />
      <Hero />
      <FeatureCards />
    </div>
  )
}

export default Homepage


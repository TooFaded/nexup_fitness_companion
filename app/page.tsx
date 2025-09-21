import ExampleCard from '@/components/ExampleCard'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          NexUp Fitness
          <span className="text-brand-600"> Companion</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Transform your fitness journey with our comprehensive companion app. 
          Track workouts, monitor progress, and achieve your goals.
        </p>
      </div>

      {/* Demo Cards Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Features Preview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ExampleCard
            title="Workout Tracking"
            description="Log your workouts, track sets and reps, and monitor your progress over time with detailed analytics."
            badge="Core Feature"
            imageUrl="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
          />
          
          <ExampleCard
            title="Nutrition Monitoring"
            description="Keep track of your daily nutrition intake and maintain a balanced diet with our smart tracking system."
            badge="Health"
            imageUrl="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop"
          />
          
          <ExampleCard
            title="Progress Analytics"
            description="Visualize your fitness journey with comprehensive charts and insights to stay motivated."
            badge="Analytics"
            imageUrl="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop"
          />
        </div>
      </div>

      {/* Tech Stack Info */}
      <div className="bg-white rounded-brand shadow-elev1 p-8">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Built with Modern Technology
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4">
            <div className="text-2xl mb-2">⚛️</div>
            <p className="font-semibold">Next.js 14</p>
            <p className="text-sm text-gray-600">App Router</p>
          </div>
          <div className="p-4">
            <div className="text-2xl mb-2">🔷</div>
            <p className="font-semibold">TypeScript</p>
            <p className="text-sm text-gray-600">Strict Mode</p>
          </div>
          <div className="p-4">
            <div className="text-2xl mb-2">🎨</div>
            <p className="font-semibold">Tailwind CSS</p>
            <p className="text-sm text-gray-600">Custom Design</p>
          </div>
          <div className="p-4">
            <div className="text-2xl mb-2">🚀</div>
            <p className="font-semibold">Supabase Ready</p>
            <p className="text-sm text-gray-600">Backend</p>
          </div>
        </div>
      </div>
    </div>
  )
}
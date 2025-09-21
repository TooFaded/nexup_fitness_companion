export default function ExampleCard() {
  return (
    <div className="bg-white rounded-xl shadow-elev1 p-6 max-w-md mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-brand-charcoal mb-2">
          Nexup
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Know what&apos;s next.
        </p>
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-mint text-white mb-6">
          Brand Badge
        </div>
        <button
          className="w-full bg-brand-ember hover:bg-brand-ember/90 focus:outline-none focus:ring-2 focus:ring-brand-ember focus:ring-offset-2 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          type="button"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}
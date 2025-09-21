import React from 'react'

interface ExampleCardProps {
  title: string
  description: string
  badge?: string
  imageUrl?: string
}

export default function ExampleCard({ 
  title, 
  description, 
  badge,
  imageUrl = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
}: ExampleCardProps) {
  return (
    <div className="card max-w-sm mx-auto hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="mb-4">
        <img 
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover rounded-brand"
        />
      </div>
      
      {/* Badge */}
      {badge && (
        <span className="inline-block bg-brand-100 text-brand-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3">
          {badge}
        </span>
      )}
      
      {/* Content */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          {description}
        </p>
        
        {/* Action Button */}
        <button className="btn-primary w-full">
          Get Started
        </button>
      </div>
    </div>
  )
}
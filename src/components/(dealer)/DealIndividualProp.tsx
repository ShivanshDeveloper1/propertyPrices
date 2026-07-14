import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, BedDouble, Bath, Square, ArrowUpRight } from 'lucide-react';

const DealIndividualProp = ({ properties }) => {
  if (!properties || properties.length === 0) {
    return (
      <div className="mt-12 text-center py-20 border-2 border-dashed border-gray-100 rounded-2xl">
        <p className="text-gray-400 font-medium">This agent hasn't listed any properties yet.</p>
      </div>
    );
  }

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Properties by this Agent</h2>
          <p className="text-gray-500 text-sm mt-1">Showing {properties.length} active listings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map((prop) => (
          <div 
            key={prop._id.toString()} 
            className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
          >
            {/* Image Container */}
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src={prop.images?.[0] || "/placeholder-house.jpg"}
                alt={prop.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-blue-600 text-white rounded-lg">
                  {prop.type}
                </span>
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg">
                  {prop.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {prop.title}
                </h3>
                <p className="text-blue-600 font-bold text-lg">
                  ₹{prop.price.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="flex items-center text-gray-500 text-sm mb-4">
                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="line-clamp-1">{prop.locality}, {prop.city}</span>
              </div>

              {/* Specs Bar */}
              <div className="flex items-center justify-between py-4 border-t border-gray-50 text-gray-600">
                <div className="flex items-center gap-1.5">
                  <BedDouble className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">{prop.bedrooms || 0} Beds</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bath className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">{prop.bathrooms || 0} Baths</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Square className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">{prop.area} sqft</span>
                </div>
              </div>

              <Link 
                href={`/properties/${prop.slug}`}
                className="mt-2 w-full flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-900 font-semibold rounded-xl transition-all duration-200"
              >
                View Details
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DealIndividualProp;
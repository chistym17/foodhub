'use client';

import { 
  TruckIcon, 
  ShieldCheckIcon, 
  ClockIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: TruckIcon,
    title: 'Fast Delivery',
    description: 'Get your favorite meals delivered to your doorstep within 30 minutes'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure Payments',
    description: 'Your payments are protected with industry-leading security'
  },
  {
    icon: ClockIcon,
    title: '24/7 Service',
    description: 'Order anytime, anywhere - we are always here to serve you'
  },
  {
    icon: CurrencyDollarIcon,
    title: 'Best Prices',
    description: 'Enjoy competitive prices and exclusive deals every day'
  }
];

export default function Features() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Why Choose Us
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the best food delivery service with our unique features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
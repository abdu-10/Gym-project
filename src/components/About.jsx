import React from 'react'
import { Award, Users, Dumbbell, TrendingUp, Building2, CheckCircle2 } from 'lucide-react'

function About() {
  const stats = [
    { 
      icon: Award, 
      value: '10+', 
      label: 'Years of Excellence',
      iconBg: 'from-slate-700 via-slate-800 to-slate-900',
      iconColor: 'text-amber-400',
      accentColor: 'border-amber-400/20'
    },
    { 
      icon: Users, 
      value: '15+', 
      label: 'Expert Trainers',
      iconBg: 'from-red-500 via-red-600 to-red-700',
      iconColor: 'text-white',
      accentColor: 'border-red-500/20'
    },
    { 
      icon: Dumbbell, 
      value: '50+', 
      label: 'Weekly Classes',
      iconBg: 'from-slate-600 via-slate-700 to-slate-800',
      iconColor: 'text-emerald-400',
      accentColor: 'border-emerald-400/20'
    },
    { 
      icon: TrendingUp, 
      value: '5000+', 
      label: 'Happy Members',
      iconBg: 'from-red-600 via-red-700 to-slate-900',
      iconColor: 'text-white',
      accentColor: 'border-red-600/20'
    }
  ]

  const features = [
    { icon: CheckCircle2, text: 'State-of-the-art Equipment' },
    { icon: CheckCircle2, text: 'Certified Expert Trainers' },
    { icon: CheckCircle2, text: '24/7 Access Available' },
    { icon: CheckCircle2, text: 'Premium Amenities' }
  ]

  return (
    <div id='about' className='py-28 bg-gradient-to-br from-slate-50 via-white to-slate-100/50 relative overflow-hidden'>
      {/* Sophisticated Background Pattern */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none opacity-40'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-slate-900/5 to-transparent rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-red-500/5 to-transparent rounded-full blur-3xl'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-slate-900/3 to-transparent rounded-full blur-3xl animate-pulse'></div>
      </div>

      {/* Subtle Grid Pattern */}
      <div className='absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]'></div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>
          {/* Content Section */}
          <div className='order-2 lg:order-1 space-y-8'>
            {/* Elite Section Badge */}
            <div className='inline-flex items-center gap-3 px-5 py-2.5 bg-white rounded-full border border-slate-200 shadow-lg shadow-slate-200/50 backdrop-blur-sm'>
              <div className='relative'>
                <div className='w-2 h-2 bg-red-500 rounded-full animate-pulse'></div>
                <div className='absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-ping'></div>
              </div>
              <span className='text-xs font-bold text-slate-900 uppercase tracking-[0.2em] letter-spacing-wider'>Our Legacy</span>
            </div>

            {/* Premium Heading */}
            <div className='space-y-4'>
              <h2 className='text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight'>
                About{' '}
                <span className='relative inline-block'>
                  <span className='text-slate-900'>FIT</span><span className='text-red-500'>ELITE</span>
                  <div className='absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-slate-900 via-red-500 to-slate-900 rounded-full'></div>
                </span>
              </h2>
              <div className='flex items-center gap-3'>
                <div className='h-[3px] w-16 bg-slate-900 rounded-full'></div>
                <div className='h-[3px] w-8 bg-red-500 rounded-full animate-pulse'></div>
                <div className='h-[2px] w-12 bg-slate-300 rounded-full'></div>
              </div>
            </div>

            {/* Refined Description */}
            <div className='space-y-6'>
              <p className='text-lg text-slate-700 leading-[1.8] font-medium'>
                Founded in 2020, <span className='font-black text-slate-900'>FIT<span className='text-red-500'>ELITE</span></span> is dedicated to providing a premium fitness experience for our members. Our state-of-the-art facilities, expert trainers, and diverse class offerings are designed to help you achieve your health and wellness goals.
              </p>
              <p className='text-lg text-slate-700 leading-[1.8] font-medium'>
                We believe in a holistic approach to fitness that encompasses physical health, mental well-being, and community support. Join us and become part of the <span className='font-black text-slate-900'>FIT<span className='text-red-500'>ELITE</span></span> family!
              </p>
            </div>

            {/* Professional Features List */}
            <div className='grid grid-cols-2 gap-4 py-4'>
              {features.map((feature, index) => (
                <div key={index} className='flex items-center gap-2.5 group'>
                  <div className='flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300'>
                    <feature.icon className='w-3 h-3 text-white' strokeWidth={3} />
                  </div>
                  <span className='text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors duration-300'>{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Elite Stats Grid */}
            <div className='grid grid-cols-2 gap-5 pt-4'>
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={`group relative bg-white/80 backdrop-blur-sm p-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 ${stat.accentColor} overflow-hidden`}
                >
                  {/* Premium gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.iconBg} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}></div>
                  
                  {/* Corner accent */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.iconBg} opacity-5 rounded-bl-[100%]`}></div>
                  
                  <div className='relative z-10 space-y-3'>
                    <div className={`inline-flex p-3.5 rounded-xl bg-gradient-to-br ${stat.iconBg} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} strokeWidth={2.5} />
                    </div>
                    <div className='text-5xl font-black text-slate-900 tracking-tight group-hover:scale-105 transition-transform duration-300 origin-left'>
                      {stat.value}
                    </div>
                    <p className='text-sm font-bold text-slate-600 leading-tight uppercase tracking-wide'>{stat.label}</p>
                  </div>

                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.iconBg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                </div>
              ))}
            </div>

            {/* Premium CTA Button */}
            <a 
              href='#contact'
              className='group inline-flex items-center gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-red-600 hover:from-slate-800 hover:via-red-600 hover:to-red-700 text-white px-10 py-5 rounded-xl font-bold text-base shadow-2xl shadow-slate-900/25 hover:shadow-red-500/25 transition-all duration-500 hover:scale-105 relative overflow-hidden'
            >
              <span className='absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000'></span>
              <span className='relative z-10 tracking-wide'>Discover More</span>
              <svg className='w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2.5}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M17 8l4 4m0 0l-4 4m4-4H3' />
              </svg>
            </a>
          </div>

          {/* Premium Image Section */}
          <div className='order-1 lg:order-2'>
            <div className='relative group'>
              {/* Sophisticated glow effect */}
              <div className='absolute -inset-6 bg-gradient-to-r from-slate-900 via-red-500 to-slate-900 rounded-3xl opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-700'></div>
              
              {/* Main Image Container */}
              <div className='relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/20 border-4 border-white'>
                <img 
                  src='https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWJvdXQlMjB1c3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600' 
                  alt='FitElite Premium Gym Interior' 
                  className='w-full h-[600px] object-cover group-hover:scale-110 transition-transform duration-1000 ease-out' 
                />
                {/* Premium overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent'></div>
                
                {/* Overlay badge */}
                <div className='absolute top-6 right-6 bg-white/95 backdrop-blur-md px-5 py-3 rounded-xl shadow-xl border border-slate-200'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse'></div>
                    <span className='text-sm font-bold text-slate-900 tracking-wide'>PREMIUM</span>
                  </div>
                </div>
              </div>

              {/* Elite Feature Card */}
              <div className='absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl shadow-slate-900/20 hidden md:block border-2 border-slate-100 hover:scale-105 hover:-translate-y-2 transition-all duration-500 group/card'>
                <div className='flex items-start gap-5'>
                  <div className='relative'>
                    <div className='absolute inset-0 bg-gradient-to-br from-slate-900 to-red-500 rounded-2xl blur-lg opacity-40'></div>
                    <div className='relative p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-red-600 rounded-2xl shadow-xl group-hover/card:rotate-6 transition-transform duration-300'>
                      <Building2 className='w-9 h-9 text-white' strokeWidth={2} />
                    </div>
                  </div>
                  <div className='space-y-1.5'>
                    <div className='text-3xl font-black text-slate-900 tracking-tight'>Premium Facilities</div>
                    <p className='text-slate-600 font-bold text-sm uppercase tracking-wider'>15,000 sq ft of Elite Space</p>
                  </div>
                </div>
              </div>

              {/* Decorative geometric accents */}
              <div className='absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-slate-900 via-slate-800 to-red-500 rounded-3xl opacity-20 -z-10 rotate-12'></div>
              <div className='absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-red-500 to-slate-900 rounded-2xl opacity-15 -z-10 rotate-45'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
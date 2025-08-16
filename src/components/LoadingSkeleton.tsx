import React from 'react';

export const SquadLoadingSkeleton = () => (
  <div className="floating-section animate-pulse">
    {/* Header skeleton */}
    <div className="section-header">
      <div className="w-32 h-6 bg-white/20 rounded-full mb-4 mx-auto"></div>
      <div className="w-96 h-12 bg-white/20 rounded-lg mb-6 mx-auto"></div>
      <div className="w-64 h-6 bg-white/20 rounded-lg mx-auto"></div>
    </div>

    {/* Stats skeleton */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 xl:gap-8 mb-8 lg:mb-16">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="floating-card">
          <div className="p-4 lg:p-8 text-center">
            <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-6 rounded-2xl bg-white/20"></div>
            <div className="w-16 h-8 bg-white/20 rounded-lg mb-2 mx-auto"></div>
            <div className="w-20 h-4 bg-white/20 rounded-lg mx-auto"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Players skeleton */}
    <div className="space-y-8">
      {[1, 2].map((position) => (
        <div key={position} className="floating-card">
          <div className="overflow-hidden rounded-2xl">
            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl"></div>
                <div>
                  <div className="w-24 h-6 bg-white/20 rounded-lg mb-2"></div>
                  <div className="w-16 h-4 bg-white/20 rounded-lg"></div>
                </div>
              </div>
            </div>
            <div className="p-4 lg:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
                {[1, 2, 3].map((player) => (
                  <div key={player} className="bg-white/10 rounded-xl p-4 h-32"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const TournamentLoadingSkeleton = () => (
  <div className="floating-section animate-pulse">
    {/* Header skeleton */}
    <div className="section-header">
      <div className="w-32 h-6 bg-white/20 rounded-full mb-4 mx-auto"></div>
      <div className="w-96 h-12 bg-white/20 rounded-lg mb-6 mx-auto"></div>
      <div className="w-64 h-6 bg-white/20 rounded-lg mx-auto"></div>
    </div>

    {/* Tabs skeleton */}
    <div className="w-full h-14 bg-white/20 rounded-2xl mb-8"></div>

    {/* Tournament cards skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="floating-card">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/20"></div>
                <div>
                  <div className="w-24 h-5 bg-white/20 rounded-lg mb-2"></div>
                  <div className="w-32 h-4 bg-white/20 rounded-lg"></div>
                </div>
              </div>
              <div className="w-16 h-6 bg-white/20 rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[1, 2, 3, 4].map((stat) => (
                <div key={stat} className="p-3 rounded-xl bg-white/10 h-16"></div>
              ))}
            </div>
            <div className="w-full h-10 bg-white/20 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const MatchLoadingSkeleton = () => (
  <div className="floating-section animate-pulse">
    {/* Header skeleton */}
    <div className="section-header">
      <div className="w-32 h-6 bg-white/20 rounded-full mb-4 mx-auto"></div>
      <div className="w-96 h-12 bg-white/20 rounded-lg mb-6 mx-auto"></div>
      <div className="w-64 h-6 bg-white/20 rounded-lg mx-auto"></div>
    </div>

    {/* Match cards skeleton */}
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="floating-card">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-32 h-6 bg-white/20 rounded-lg"></div>
              <div className="w-20 h-6 bg-white/20 rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="h-20 bg-white/20 rounded-xl"></div>
              <div className="h-20 bg-white/20 rounded-xl"></div>
            </div>
            <div className="w-full h-10 bg-white/20 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

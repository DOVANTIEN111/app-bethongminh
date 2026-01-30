// src/components/mobile/PullToRefresh.jsx
// Pull to refresh component cho mobile

import React, { useState, useRef, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

const PullToRefresh = ({
  onRefresh,
  children,
  threshold = 60,
  resistance = 2.5,
  className = ''
}) => {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = useCallback((e) => {
    // Chi bat dau keo khi scroll o top
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      currentY.current = e.touches[0].clientY;
      setPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!pulling || refreshing) return;

    currentY.current = e.touches[0].clientY;
    const distance = currentY.current - startY.current;

    // Chi xu ly khi keo xuong
    if (distance > 0) {
      // Ap dung resistance de keo cham dan
      const adjustedDistance = Math.min(120, distance / resistance);
      setPullDistance(adjustedDistance);

      // Prevent default scroll khi dang pull
      if (adjustedDistance > 10) {
        e.preventDefault();
      }
    }
  }, [pulling, refreshing, resistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!pulling) return;

    if (pullDistance >= threshold && onRefresh) {
      setRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh error:', error);
      } finally {
        setRefreshing(false);
      }
    }

    setPulling(false);
    setPullDistance(0);
  }, [pulling, pullDistance, threshold, onRefresh]);

  const progress = Math.min(1, pullDistance / threshold);
  const rotation = pullDistance * 3;

  return (
    <div
      ref={containerRef}
      className={`h-full overflow-auto no-pull-refresh ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <div
        className="flex justify-center items-center overflow-hidden transition-all duration-200"
        style={{
          height: refreshing ? 50 : pullDistance,
          opacity: refreshing ? 1 : progress
        }}
      >
        <div className="flex flex-col items-center gap-1">
          <RefreshCw
            className={`w-6 h-6 text-blue-500 transition-transform ${
              refreshing ? 'animate-spin' : ''
            }`}
            style={{
              transform: refreshing ? 'none' : `rotate(${rotation}deg)`,
            }}
          />
          {refreshing ? (
            <span className="text-xs text-gray-500">Dang tai lai...</span>
          ) : pullDistance >= threshold ? (
            <span className="text-xs text-blue-500 font-medium">Tha de lam moi</span>
          ) : pullDistance > 10 ? (
            <span className="text-xs text-gray-400">Keo de lam moi</span>
          ) : null}
        </div>
      </div>

      {children}
    </div>
  );
};

export default PullToRefresh;

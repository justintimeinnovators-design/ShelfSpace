"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
  loading?: "lazy" | "eager";
  onLoad?: () => void;
  onError?: () => void;
  fallback?: React.ReactNode;
}

/**
 * Optimized Image.
 * @param {
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  placeholder = "empty",
  blurDataURL,
  sizes = "100vw",
  quality = 75,
  loading = "lazy",
  onLoad,
  onError,
  fallback
} - { src, alt, width, height, class Name = "", priority = false, placeholder = "empty", blur Data URL, sizes = "100vw", quality = 75, loading = "lazy", on Load, on Error, fallback } value.
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  placeholder = "empty",
  blurDataURL,
  sizes = "100vw",
  quality = 75,
  loading = "lazy",
  onLoad,
  onError,
  fallback
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || loading === "eager") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  // Generate optimized image URL
/**
 * Get Optimized Src.
 * @param originalSrc - original Src value.
 * @param _width - width value.
 * @param _quality - quality value.
 */
  const getOptimizedSrc = (originalSrc: string, _width?: number, _quality?: number) => {
    // If it's a local image, return as-is
    if (originalSrc.startsWith('/') || originalSrc.startsWith('./')) {
      return originalSrc;
    }

    // For external images, you could integrate with an image optimization service
    // For now, return the original src
    return originalSrc;
  };

/**
 * Handle Load.
 */
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

/**
 * Handle Error.
 */
  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
          {placeholder === "blur" && blurDataURL ? (
            <img
              src={blurDataURL}
              alt=""
              className="w-full h-full object-cover filter blur-sm scale-110"
            />
          ) : (
            <div className="w-full h-full bg-amber-100 dark:bg-slate-700 animate-pulse rounded" />
          )}
        </div>
      )}

      {/* Main Image */}
      {isInView && (
        <img
          src={getOptimizedSrc(src, width, quality)}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Error State */}
      {hasError && !fallback && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-slate-400">
            <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Image Gallery Component
interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  className?: string;
}

/**
 * Image Gallery.
 * @param { images, className - { images, class Name value.
 */
export function ImageGallery({ images, className = "" }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image */}
      <div className="relative">
        <OptimizedImage
          src={images[selectedIndex]?.src || ""}
          alt={images[selectedIndex]?.alt || ""}
          {...(images[selectedIndex]?.width && { width: images[selectedIndex].width })}
          {...(images[selectedIndex]?.height && { height: images[selectedIndex].height })}
          className="w-full h-64 md:h-96 rounded-lg"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                index === selectedIndex
                  ? "border-amber-500"
                  : "border-gray-200 dark:border-slate-700 hover:border-amber-300"
              }`}
            >
              <OptimizedImage
                src={image.src}
                alt={image.alt}
                width={64}
                height={64}
                className="w-full h-full"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Responsive Image Component
interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  breakpoints?: Array<{
    media: string;
    src: string;
    width: number;
    height: number;
  }>;
}

/**
 * Responsive Image.
 * @param {
  src,
  alt,
  className = "",
  breakpoints = []
} - { src, alt, class Name = "", breakpoints = [] } value.
 */
export function ResponsiveImage({
  src,
  alt,
  className = "",
  breakpoints = []
}: ResponsiveImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
/**
 * Update Src.
 */
    const updateSrc = () => {
      const matchingBreakpoint = breakpoints.find(bp => 
        window.matchMedia(bp.media).matches
      );
      
      if (matchingBreakpoint) {
        setCurrentSrc(matchingBreakpoint.src);
      } else {
        setCurrentSrc(src);
      }
    };

    updateSrc();
    
    const mediaQueries = breakpoints.map(bp => window.matchMedia(bp.media));
/**
 * Handle Change.
 */
    const handleChange = () => updateSrc();
    
    mediaQueries.forEach(mq => mq.addEventListener('change', handleChange));
    
    return () => {
      mediaQueries.forEach(mq => mq.removeEventListener('change', handleChange));
    };
  }, [src, breakpoints]);

  return (
    <OptimizedImage
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
}
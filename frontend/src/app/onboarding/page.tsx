"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import api from "@/lib/api";
import { getErrorMessage } from "@/lib/api-utils";

import { 
  BookOpen, 
  Check, 
  ArrowRight, 
  User, 
  Settings, 
  Heart,
  Sun,
  Moon,
  Monitor,
  LayoutGrid,
  List,
  Mail,
  Newspaper
} from "lucide-react";

const steps = [
  {
    id: "profile",
    title: "Your Profile",
    description: "Tell us about yourself",
  },
  {
    id: "preferences",
    title: "Preferences",
    description: "Customize your experience",
  },
  {
    id: "interests",
    title: "Reading Interests",
    description: "Select your favorite genres",
  },
];

/**
 * Onboarding Page.
 */
export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    bio: "",
    website: "",
    isPublic: true,
    theme: "SYSTEM" as "LIGHT" | "DARK" | "SYSTEM",
    language: "en",
    notificationsEmail: true,
    dailyDigest: true,
    defaultViewMode: "CARD" as "CARD" | "LIST",
    favoriteGenres: [] as string[],
  });

  const router = useRouter();
  const { data: session, status, update } = useSession();

  // Show loading while session is being fetched
  if (status === "loading") {
    return (
      <div className="min-h-screen h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="w-full max-w-lg animate-pulse px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-amber-200 dark:border-slate-700 p-10 space-y-6">
            <div className="h-6 bg-amber-100 dark:bg-slate-700 rounded w-1/3 mx-auto" />
            <div className="h-4 bg-amber-50 dark:bg-slate-600 rounded w-1/2 mx-auto" />
            <div className="space-y-3 mt-4">
              <div className="h-10 bg-gray-100 dark:bg-slate-700 rounded-xl" />
              <div className="h-10 bg-gray-100 dark:bg-slate-700 rounded-xl" />
              <div className="h-10 bg-gray-100 dark:bg-slate-700 rounded-xl" />
            </div>
            <div className="h-12 bg-amber-100 dark:bg-slate-700 rounded-xl mt-2" />
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  // Redirect to dashboard if already completed onboarding
  if (session && !session.isNewUser && !session.needsPreferences) {
    router.push("/dashboard");
    return null;
  }

/**
 * Handle Next.
 */
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

/**
 * Handle Previous.
 */
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

/**
 * Handle Complete.
 */
  const handleComplete = async () => {
    try {
      setIsLoading(true);

      console.log("=== Starting Onboarding Completion ===");
      console.log("Session user ID:", session?.user?.id);

      // Update user profile if bio or website provided
      if (formData.bio || formData.website || !formData.isPublic) {
        const updateData: any = {
          isPublic: formData.isPublic,
        };
        if (formData.bio) updateData.bio = formData.bio;
        if (formData.website) updateData.website = formData.website;
        
        console.log("Updating user profile...", updateData);
        await api.patch("/api/user/me", updateData, {
          headers: { "Content-Type": "application/json" },
        });
        
        console.log("User profile updated successfully");
      }

      // Update user preferences
      console.log("Updating user preferences with data:", {
        theme: formData.theme,
        language: formData.language,
        notificationsEmail: formData.notificationsEmail,
        dailyDigest: formData.dailyDigest,
        defaultViewMode: formData.defaultViewMode,
      });
      
      const updatedPreferences = await api.put("/api/user/preferences", {
        theme: formData.theme,
        language: formData.language,
        notificationsEmail: formData.notificationsEmail,
        dailyDigest: formData.dailyDigest,
        defaultViewMode: formData.defaultViewMode,
      }, {
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.data);
      console.log("User preferences updated successfully:", updatedPreferences);

      // Update session to mark onboarding as complete
      console.log("Updating session to mark onboarding complete...");
      await update({
        isNewUser: false,
        needsPreferences: false,
      });

      // Small delay to ensure session is propagated
      console.log("Waiting for session propagation...");
      await new Promise(resolve => setTimeout(resolve, 500));

      // Redirect to dashboard
      console.log("Redirecting to dashboard...");
      console.log("=== Onboarding Completion Successful ===");
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error("=== Onboarding Completion Failed ===");
      console.error("Error:", error);
      const message = getErrorMessage(error);
      console.error("Error message:", message);
      alert(`Failed to save your preferences: ${message || 'Unknown error'}. Please try again.`);
      setIsLoading(false);
    }
  };

/**
 * Update Form Data.
 * @param field - field value.
 * @param value - value value.
 */
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

/**
 * Render Step Content.
 */
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-4">
                <User className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2 font-serif">
                Welcome, {session?.user?.name?.split(' ')[0] || 'Reader'}!
              </h3>
              <p className="text-gray-600 dark:text-slate-400">
                Let's personalize your reading experience
              </p>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2">
                About You (Optional)
              </label>
              <textarea
                id="bio"
                placeholder="Share your reading interests, favorite authors, or what brings you to ShelfSpace..."
                value={formData.bio}
                onChange={(e) => updateFormData("bio", e.target.value)}
                className="block w-full rounded-xl border-2 border-gray-300 dark:border-slate-600 shadow-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-slate-800 dark:text-white transition-all duration-200 resize-none"
                rows={4}
              />
            </div>

            <Input
              id="website"
              type="url"
              label="Website or Blog (Optional)"
              placeholder="https://your-website.com"
              value={formData.website}
              onChange={(e) => updateFormData("website", e.target.value)}
            />

            <div className="flex items-center space-x-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => updateFormData("isPublic", e.target.checked)}
                className="h-5 w-5 rounded-md border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="isPublic" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer flex-1">
                Make my profile public so others can discover my reading lists
              </label>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="h-full flex flex-col justify-center max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-4">
                <Settings className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2 font-serif">
                Customize Your Experience
              </h3>
              <p className="text-gray-600 dark:text-slate-400">
                Choose how you want ShelfSpace to look and feel
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-4">
                    Theme Preference
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "LIGHT", label: "Light", icon: Sun },
                      { value: "DARK", label: "Dark", icon: Moon },
                      { value: "SYSTEM", label: "System", icon: Monitor },
                    ].map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => updateFormData("theme", option.value)}
                          className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                            formData.theme === option.value
                              ? "bg-gradient-to-br from-amber-400 to-orange-500 border-transparent text-white shadow-lg scale-105"
                              : "bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 hover:border-amber-400 hover:shadow-md"
                          }`}
                        >
                          <Icon className={`h-7 w-7 mx-auto mb-2 ${formData.theme === option.value ? "text-white" : "text-amber-600"}`} />
                          <div className={`text-sm font-semibold ${formData.theme === option.value ? "text-white" : "text-gray-900 dark:text-white"}`}>
                            {option.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-4">
                    Default View Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "CARD", label: "Card View", icon: LayoutGrid, desc: "Visual grid layout" },
                      { value: "LIST", label: "List View", icon: List, desc: "Compact list layout" },
                    ].map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => updateFormData("defaultViewMode", option.value)}
                          className={`p-5 rounded-xl border-2 transition-all duration-200 text-left ${
                            formData.defaultViewMode === option.value
                              ? "bg-gradient-to-br from-amber-400 to-orange-500 border-transparent text-white shadow-lg scale-105"
                              : "bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 hover:border-amber-400 hover:shadow-md"
                          }`}
                        >
                          <Icon className={`h-7 w-7 mb-2 ${formData.defaultViewMode === option.value ? "text-white" : "text-amber-600"}`} />
                          <div className={`text-sm font-semibold mb-1 ${formData.defaultViewMode === option.value ? "text-white" : "text-gray-900 dark:text-white"}`}>
                            {option.label}
                          </div>
                          <div className={`text-xs ${formData.defaultViewMode === option.value ? "text-white/80" : "text-gray-600 dark:text-slate-400"}`}>
                            {option.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-slate-100 mb-4">
                  Notifications
                </label>
                <div className="space-y-3">
                  <label className="flex items-start space-x-4 p-5 rounded-xl bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 cursor-pointer hover:border-amber-400 transition-all">
                    <input
                      type="checkbox"
                      checked={formData.notificationsEmail}
                      onChange={(e) => updateFormData("notificationsEmail", e.target.checked)}
                      className="h-5 w-5 mt-0.5 rounded-md border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Mail className="h-5 w-5 text-amber-600" />
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          Email Notifications
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-slate-400">
                        Receive updates about your reading activity, new recommendations, and community interactions
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start space-x-4 p-5 rounded-xl bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 cursor-pointer hover:border-amber-400 transition-all">
                    <input
                      type="checkbox"
                      checked={formData.dailyDigest}
                      onChange={(e) => updateFormData("dailyDigest", e.target.checked)}
                      className="h-5 w-5 mt-0.5 rounded-md border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Newspaper className="h-5 w-5 text-amber-600" />
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          Daily Reading Digest
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-slate-400">
                        Get a daily summary of your reading progress, goals, and personalized book suggestions
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="h-full flex flex-col justify-center max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg mb-4">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2 font-serif">
                What Do You Love to Read?
              </h3>
              <p className="text-gray-600 dark:text-slate-400 mb-2">
                Select at least 3 genres to get personalized recommendations
              </p>
              <div className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                {formData.favoriteGenres.length} selected
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                "Fiction",
                "Non-Fiction",
                "Mystery",
                "Romance",
                "Sci-Fi",
                "Fantasy",
                "Biography",
                "History",
                "Self-Help",
                "Horror",
                "Poetry",
                "Comedy",
                "Thriller",
                "Adventure",
                "Drama",
                "Crime",
                "Philosophy",
                "Psychology",
              ].map((genre) => {
                const isSelected = formData.favoriteGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    onClick={() => {
                      if (isSelected) {
                        updateFormData(
                          "favoriteGenres",
                          formData.favoriteGenres.filter((g) => g !== genre)
                        );
                      } else {
                        updateFormData("favoriteGenres", [
                          ...formData.favoriteGenres,
                          genre,
                        ]);
                      }
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 relative ${
                      isSelected
                        ? "bg-gradient-to-br from-amber-400 to-orange-500 border-transparent text-white shadow-lg scale-105"
                        : "bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 hover:border-amber-400 hover:shadow-md"
                    }`}
                  >
                    <div className={`text-sm font-semibold ${isSelected ? "text-white" : "text-gray-900 dark:text-white"}`}>
                      {genre}
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentStepData = steps[currentStep];
  const canProceed = currentStep < 2 || (currentStep === 2 && formData.favoriteGenres.length >= 3);

  if (!currentStepData) {
    return null;
  }

  return (
    <div className="min-h-screen h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 relative flex flex-col">
      {/* Decorative book-themed background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 text-6xl opacity-20">📚</div>
        <div className="absolute top-40 right-20 text-4xl opacity-20">📖</div>
        <div className="absolute bottom-20 left-1/4 text-5xl opacity-20">📝</div>
        <div className="absolute bottom-40 right-1/3 text-3xl opacity-20">✍️</div>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-amber-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100 font-serif">ShelfSpace</h1>
                <p className="text-xs text-gray-600 dark:text-slate-400">Setup your account</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`h-2 w-16 rounded-full transition-all duration-300 ${
                    index <= currentStep
                      ? "bg-gradient-to-r from-amber-400 to-orange-500"
                      : "bg-gray-300 dark:bg-slate-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center overflow-hidden">
        <div className="w-full px-6 py-8">
          {renderStepContent()}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-amber-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </Button>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-slate-400">
                Step {currentStep + 1} of {steps.length}
              </span>
              {currentStep > 0 && (
                <button
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      // Mark onboarding as complete even if skipped
                      await update({
                        isNewUser: false,
                        needsPreferences: false,
                      });
                      
                      // Small delay to ensure session is propagated
                      await new Promise(resolve => setTimeout(resolve, 500));
                      
                      // Use hard redirect to ensure middleware re-evaluates
                      window.location.href = "/dashboard";
                    } catch (error) {
                      console.error("Failed to skip onboarding:", error);
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                  className="text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 disabled:opacity-50"
                >
                  Skip
                </button>
              )}

              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handleComplete}
                  disabled={isLoading || !canProceed}
                  className="px-8 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 rounded bg-white/40 animate-pulse" />
                      <span>Setting up...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5" />
                      <span>Complete Setup</span>
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="px-8 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

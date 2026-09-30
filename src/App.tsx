/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, NavTabType } from './components/Navbar';
import { ScoreMatcher } from './components/ScoreMatcher';
import { SpecialtiesExplorer } from './components/SpecialtiesExplorer';
import { UniversitiesDirectory } from './components/UniversitiesDirectory';
import { GovernmentUniversities } from './components/GovernmentUniversities';
import { PrivateUniversities } from './components/PrivateUniversities';
import { ComparisonModal } from './components/ComparisonModal';
import { FormDraftPlanner } from './components/FormDraftPlanner';
import { MajraAssistantModal } from './components/MajraAssistantModal';
import { Footer } from './components/Footer';
import { StudentProfile, ComparisonItem, ScoreMatchItem } from './types';
import { Sparkles, Check, Info } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabType>('matcher');
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [assistantInitialQuery, setAssistantInitialQuery] = useState<string | undefined>(undefined);

  // Student Profile state with sensible defaults
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('majra_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      score: 88.5,
      branch: 'أحيائي',
      preference: 'الكل',
      governorate: 'بغداد',
      firstAttemptBonus: false,
      frenchLanguageBonus: false,
    };
  });

  // Save profile changes
  useEffect(() => {
    localStorage.setItem('majra_profile', JSON.stringify(profile));
  }, [profile]);

  // Comparison items state
  const [comparisonItems, setComparisonItems] = useState<ComparisonItem[]>(() => {
    const saved = localStorage.getItem('majra_comparison');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('majra_comparison', JSON.stringify(comparisonItems));
  }, [comparisonItems]);

  // Draft form list state
  const [draftItems, setDraftItems] = useState<ScoreMatchItem[]>(() => {
    const saved = localStorage.getItem('majra_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('majra_draft', JSON.stringify(draftItems));
  }, [draftItems]);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Add to comparison handler (max 3 items)
  const handleAddToComparison = (item: ComparisonItem) => {
    if (comparisonItems.some((c) => c.id === item.id)) {
      setComparisonItems((prev) => prev.filter((c) => c.id !== item.id));
      showToast(`تمت إزالة ${item.name} من المقارنة`);
      return;
    }

    if (comparisonItems.length >= 3) {
      showToast('الحد الأقصى للمقارنة هو 3 تخصصات في نفس الوقت.');
      return;
    }

    setComparisonItems((prev) => [...prev, item]);
    showToast(`تمت إضافة ${item.name} إلى المقارنة`);
  };

  const handleRemoveComparisonItem = (id: string) => {
    setComparisonItems((prev) => prev.filter((c) => c.id !== id));
  };

  const handleClearComparison = () => {
    setComparisonItems([]);
    showToast('تم إفراغ قائمة المقارنة');
  };

  // Add to draft handler
  const handleAddToDraft = (item: ScoreMatchItem) => {
    if (draftItems.some((d) => d.id === item.id)) {
      showToast(`التخصص ${item.name} موجود بالفعل في مسودتك`);
      return;
    }

    setDraftItems((prev) => [...prev, item]);
    showToast(`تمت إضافة ${item.name} إلى مسودة استمارتك`);
  };

  const handleRemoveDraftItem = (id: string) => {
    setDraftItems((prev) => prev.filter((d) => d.id !== id));
    showToast('تم حذف الخيار من المسودة');
  };

  const handleMoveDraftItem = (index: number, direction: 'up' | 'down') => {
    setDraftItems((prev) => {
      const copy = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleClearDraft = () => {
    setDraftItems([]);
    showToast('تم تفريغ مسودة الاستمارة');
  };

  // Open assistant helper
  const handleOpenAssistant = (initialQuery?: string) => {
    setAssistantInitialQuery(initialQuery);
    setIsAssistantOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] text-[#1D1D1F] selection:bg-[#0071E3]/20 selection:text-[#0071E3]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom duration-200">
          <div className="px-4 py-3 rounded-2xl bg-[#1D1D1F] text-white text-xs font-semibold shadow-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Floating Assistant Trigger in bottom right */}
      <button
        onClick={() => handleOpenAssistant()}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-tr from-[#0071E3] to-[#409CFF] text-white shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-xs font-bold"
        title="مساعد مجرّة الذكي"
      >
        <Sparkles className="w-4 h-4 text-amber-200 animate-spin-slow" />
        <span className="hidden sm:inline">اسأل مساعد مجرّة</span>
      </button>

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAssistant={handleOpenAssistant}
        comparisonCount={comparisonItems.length}
        draftCount={draftItems.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* TAB 1: Score Matcher */}
        {activeTab === 'matcher' && (
          <ScoreMatcher
            profile={profile}
            setProfile={setProfile}
            onOpenAssistant={handleOpenAssistant}
            onAddToComparison={handleAddToComparison}
            onAddToDraft={handleAddToDraft}
            comparisonItems={comparisonItems}
            draftItems={draftItems}
          />
        )}

        {/* TAB 2: Specialties Directory (قائمة خاصة بالتخصصات) */}
        {activeTab === 'specialties' && (
          <SpecialtiesExplorer
            onOpenAssistant={handleOpenAssistant}
            onAddToComparison={handleAddToComparison}
            onAddToDraft={handleAddToDraft}
            comparisonItems={comparisonItems}
            draftItems={draftItems}
          />
        )}

        {/* TAB 3: Universities & Institutes Directory (قائمة خاصة باسم الجامعات والمعاهد) */}
        {activeTab === 'universities' && (
          <UniversitiesDirectory
            onOpenAssistant={handleOpenAssistant}
            onAddToComparison={handleAddToComparison}
            onAddToDraft={handleAddToDraft}
            comparisonItems={comparisonItems}
            draftItems={draftItems}
          />
        )}

        {/* TAB 4: Government Universities Dedicated View */}
        {activeTab === 'government' && (
          <GovernmentUniversities
            onOpenAssistant={handleOpenAssistant}
            onAddToComparison={handleAddToComparison}
            onAddToDraft={handleAddToDraft}
            comparisonItems={comparisonItems}
            draftItems={draftItems}
          />
        )}

        {/* TAB 5: Private Universities Dedicated View */}
        {activeTab === 'private' && (
          <PrivateUniversities
            onOpenAssistant={handleOpenAssistant}
            onAddToComparison={handleAddToComparison}
            onAddToDraft={handleAddToDraft}
            comparisonItems={comparisonItems}
            draftItems={draftItems}
          />
        )}

        {/* TAB 6: Admission Draft Form Planner */}
        {activeTab === 'planner' && (
          <FormDraftPlanner
            draftItems={draftItems}
            onRemoveDraftItem={handleRemoveDraftItem}
            onMoveDraftItem={handleMoveDraftItem}
            onClearDraft={handleClearDraft}
            onOpenAssistant={handleOpenAssistant}
            profile={profile}
          />
        )}

        {/* TAB 7: Side-by-side Major & University Comparator */}
        {activeTab === 'comparator' && (
          <div className="py-6">
            <ComparisonModal
              isOpen={true}
              onClose={() => setActiveTab('matcher')}
              items={comparisonItems}
              onRemoveItem={handleRemoveComparisonItem}
              onClearAll={handleClearComparison}
              onOpenAssistant={handleOpenAssistant}
            />
          </div>
        )}
      </main>

      {/* AI Assistant Modal */}
      <MajraAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        profile={profile}
        initialQuery={assistantInitialQuery}
      />

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} onOpenAssistant={() => handleOpenAssistant()} />
    </div>
  );
}

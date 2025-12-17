import React from 'react';
import { Check, Star, Users, Zap } from 'lucide-react';
import { setSubscription } from '../services/storageService';
import { SubscriptionTier } from '../types';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (tier: SubscriptionTier) => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) return null;

  const handleSelectTier = (tier: SubscriptionTier) => {
    setSubscription(tier);
    onUpgrade(tier);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] scale-100 animate-in zoom-in-95 duration-200">
        <div className="p-10 text-center border-b border-stone-100">
          <h2 className="text-3xl font-bold text-stone-900 mb-3 tracking-tight">Unlock the full homeschool experience</h2>
          <p className="text-lg text-stone-500 max-w-lg mx-auto leading-relaxed">
            Choose a plan that grows with your family. Save time, track progress, and stay organized.
          </p>
        </div>

        <div className="p-8 overflow-y-auto bg-stone-50 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Free */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 flex flex-col shadow-sm">
              <div className="mb-6">
                <span className="text-sm font-bold text-stone-400 uppercase tracking-widest">Free</span>
                <div className="mt-2 text-4xl font-bold text-stone-900 tracking-tight">$0</div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-stone-600 text-sm font-medium">
                  <div className="p-1 bg-stone-100 rounded-full"><Check className="w-3 h-3 text-stone-400" /></div>
                  <span>1 Student Profile</span>
                </li>
                <li className="flex items-center gap-3 text-stone-600 text-sm font-medium">
                  <div className="p-1 bg-stone-100 rounded-full"><Check className="w-3 h-3 text-stone-400" /></div>
                  <span>Basic Calendar</span>
                </li>
                <li className="flex items-center gap-3 text-stone-600 text-sm font-medium">
                  <div className="p-1 bg-stone-100 rounded-full"><Check className="w-3 h-3 text-stone-400" /></div>
                  <span>7-day History</span>
                </li>
              </ul>
              <button 
                onClick={onClose}
                className="w-full py-3 rounded-xl font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                Current Plan
              </button>
            </div>

            {/* Plus */}
            <div className="bg-white p-8 rounded-3xl border-2 border-indigo-600 shadow-xl shadow-indigo-100 relative flex flex-col transform md:-mt-4 md:mb-4 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                Best Value
              </div>
              <div className="mb-6">
                <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Plus</span>
                <div className="mt-2 text-5xl font-bold text-stone-900 tracking-tight">$6<span className="text-xl font-medium text-stone-400">/mo</span></div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-stone-800 text-sm font-bold">
                  <div className="p-1 bg-indigo-100 rounded-full"><Check className="w-3 h-3 text-indigo-600" /></div>
                  <span>Unlimited Students</span>
                </li>
                <li className="flex items-center gap-3 text-stone-800 text-sm font-bold">
                  <div className="p-1 bg-indigo-100 rounded-full"><Check className="w-3 h-3 text-indigo-600" /></div>
                  <span>Full History & Exports</span>
                </li>
                <li className="flex items-center gap-3 text-stone-800 text-sm font-bold">
                  <div className="p-1 bg-indigo-100 rounded-full"><Check className="w-3 h-3 text-indigo-600" /></div>
                  <span>Advanced Charts</span>
                </li>
                <li className="flex items-center gap-3 text-stone-800 text-sm font-bold">
                  <div className="p-1 bg-indigo-100 rounded-full"><Check className="w-3 h-3 text-indigo-600" /></div>
                  <span>Printable Schedules</span>
                </li>
              </ul>
              <button 
                onClick={() => handleSelectTier('plus')}
                className="w-full py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5"
              >
                Upgrade to Plus
              </button>
            </div>

            {/* Co-op */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 flex flex-col shadow-sm">
              <div className="mb-6">
                <span className="text-sm font-bold text-stone-500 uppercase tracking-widest">Co-op</span>
                <div className="mt-2 text-4xl font-bold text-stone-900 tracking-tight">$12<span className="text-lg font-normal text-stone-400">/mo</span></div>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-stone-600 text-sm font-medium">
                  <div className="p-1 bg-stone-100 rounded-full"><Check className="w-3 h-3 text-stone-400" /></div>
                  <span>Everything in Plus</span>
                </li>
                <li className="flex items-center gap-3 text-stone-600 text-sm font-medium">
                  <div className="p-1 bg-purple-100 rounded-full"><Users className="w-3 h-3 text-purple-600" /></div>
                  <span>Family Sharing</span>
                </li>
                <li className="flex items-center gap-3 text-stone-600 text-sm font-medium">
                  <div className="p-1 bg-purple-100 rounded-full"><Users className="w-3 h-3 text-purple-600" /></div>
                  <span>Group Schedules</span>
                </li>
                <li className="flex items-center gap-3 text-stone-600 text-sm font-medium">
                  <div className="p-1 bg-amber-100 rounded-full"><Zap className="w-3 h-3 text-amber-600" /></div>
                  <span>Priority Support</span>
                </li>
              </ul>
              <button 
                onClick={() => handleSelectTier('coop')}
                className="w-full py-3 rounded-xl font-bold text-stone-600 bg-white border-2 border-stone-200 hover:border-stone-300 transition-colors"
              >
                Select Co-op
              </button>
            </div>
          </div>
        </div>
        <div className="p-5 bg-white border-t border-stone-100 text-center">
            <button onClick={onClose} className="text-sm font-medium text-stone-400 hover:text-stone-600 transition-colors">No thanks, I'll stick with the basics</button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
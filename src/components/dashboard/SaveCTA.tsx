import React from 'react';

interface SaveCTAProps {
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onReset: () => void;
  saving: boolean;
  message?: string;
}

export default function SaveCTA({ hasUnsavedChanges, onSave, onReset, saving, message = 'Unsaved changes detected' }: SaveCTAProps) {
  if (!hasUnsavedChanges) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-dark-secondary text-white px-4 py-3 rounded-lg shadow-xl border border-border-dark flex items-center gap-4 text-sm font-semibold animate-in slide-in-from-bottom-5 fade-in duration-300">
      <span className="flex items-center gap-2">
         {message}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onReset}
          className="px-3 py-1.5 hover:bg-dark-card rounded transition-colors text-sm font-medium"
        >
          Reset
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={onSave}
          className="bg-discord hover:bg-discord-hover disabled:opacity-50 px-4 py-1.5 rounded-md text-sm font-bold transition-colors shadow-lg"
        >
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

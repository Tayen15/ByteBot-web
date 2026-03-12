'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RulesManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Form State
  const [ruleId, setRuleId] = useState('');
  const [ruleTitle, setRuleTitle] = useState('');
  const [ruleDesc, setRuleDesc] = useState('');

  const [rules, setRules] = useState<{ id: string; title: string; description: string }[]>([]);

  useEffect(() => {
    fetch(`/api/bot/guild/${id}/rules`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const rawRules = Array.isArray(data.rules) ? data.rules : (data.rulesConfig?.rules ?? []);
          setRules(rawRules);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const openAddModal = () => {
    setIsEditing(false);
    setRuleId('');
    setRuleTitle('');
    setRuleDesc('');
    setIsModalOpen(true);
  };

  const openEditModal = (rule: typeof rules[0]) => {
    setIsEditing(true);
    setRuleId(rule.id);
    setRuleTitle(rule.title);
    setRuleDesc(rule.description);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRuleId('');
    setRuleTitle('');
    setRuleDesc('');
  };

  const closeOnBgClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleDelete = async (rId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the rule "${title}"?`)) return;
    try {
      const res = await fetch(`/api/bot/guild/${id}/rules/${rId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setRules(prev => prev.filter(r => r.id !== rId));
      } else {
        setAlert({ message: data.error || 'Failed to delete', type: 'error' });
        setTimeout(() => setAlert(null), 3000);
      }
    } catch {
      setAlert({ message: 'Network error', type: 'error' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditing) {
        const res = await fetch(`/api/bot/guild/${id}/rules/${ruleId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: ruleTitle, description: ruleDesc }),
        });
        const data = await res.json();
        if (data.success) {
          setRules(prev => prev.map(r => r.id === ruleId ? { ...r, title: ruleTitle, description: ruleDesc } : r));
          closeModal();
        } else {
          setAlert({ message: data.error || 'Failed to update', type: 'error' });
        }
      } else {
        const res = await fetch(`/api/bot/guild/${id}/rules`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: ruleTitle, description: ruleDesc }),
        });
        const data = await res.json();
        if (data.success) {
          setRules(prev => [...prev, data.rule]);
          closeModal();
        } else {
          setAlert({ message: data.error || 'Failed to add', type: 'error' });
        }
      }
    } catch {
      setAlert({ message: 'Network error', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setAlert(null), 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-border-dark gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Server Rules</h1>
          <p className="text-text-secondary text-sm">Manage your server rules and regulations</p>
        </div>
        <Link
          href={`/dashboard/guild/${id}`}
          className="text-text-secondary hover:text-discord transition-colors duration-200 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-dark-secondary w-fit"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Server Actions</span>
        </Link>
      </div>

      {/* Main Content */}
      <div>
         {/* Add Rule CTA */}
         <div className="mb-8 flex justify-end">
            <button 
              onClick={openAddModal}
              className="flex items-center space-x-2 px-4 py-2.5 bg-discord hover:bg-discord-hover text-white font-semibold rounded-lg transition-colors"
            >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
               </svg>
               <span>Add New Rule</span>
            </button>
         </div>

         {/* Rules List */}
         <div className="space-y-4">
            {rules.length > 0 ? (
               rules.map((rule, idx) => (
                  <div key={rule.id} className="bg-dark-secondary border border-border-dark rounded-xl p-6 hover:border-discord/30 transition-colors group">
                     <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                           <div className="flex items-center gap-3 mb-2">
                              <span className="bg-discord/10 text-discord w-8 h-8 rounded-full flex items-center justify-center font-bold border border-discord/20">
                                 {idx + 1}
                              </span>
                              <h3 className="text-xl font-bold text-white">{rule.title}</h3>
                           </div>
                           <p className="text-text-secondary sm:ml-11">{rule.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 sm:ml-4 sm:opacity-50 group-hover:opacity-100 transition-opacity pl-11 sm:pl-0">
                           <button 
                             onClick={() => openEditModal(rule)}
                             className="p-2 hover:bg-dark-card text-text-secondary hover:text-white rounded-lg transition-colors"
                             title="Edit Rule"
                           >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                              </svg>
                           </button>
                           <button 
                             onClick={() => handleDelete(rule.id, rule.title)}
                             className="p-2 hover:bg-danger/10 text-danger rounded-lg transition-colors"
                             title="Delete Rule"
                           >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                              </svg>
                           </button>
                        </div>
                     </div>
                  </div>
               ))
            ) : (
               <div className="bg-dark-secondary border border-border-dark rounded-xl p-12 text-center">
                  <div className="w-20 h-20 bg-dark-card rounded-full flex items-center justify-center mx-auto mb-6">
                     <svg className="w-10 h-10 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                     </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">No Rules Yet</h3>
                  <p className="text-text-secondary mb-6 max-w-sm mx-auto">
                     Belum ada rules yang dibuat untuk server ini. Set up rules to maintain a healthy community.
                  </p>
                  <button 
                     onClick={openAddModal}
                     className="inline-flex items-center gap-2 bg-discord hover:bg-discord-hover text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                  >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                     </svg>
                     Create Your First Rule
                  </button>
               </div>
            )}
         </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
         <div 
           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in"
           onClick={closeOnBgClick}
         >
            <div 
              className="bg-dark-secondary border border-border-dark rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
               {/* Modal Header */}
               <div className="px-6 py-4 border-b border-border-dark flex items-center justify-between bg-dark-secondary">
                  <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Rule' : 'Add New Rule'}</h2>
                  <button onClick={closeModal} className="text-text-secondary hover:text-white transition-colors p-1 rounded-md hover:bg-dark-card">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                     </svg>
                  </button>
               </div>

               {/* Modal Body */}
               <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto">
                  <div className="space-y-5">
                     <div>
                        <label htmlFor="ruleTitle" className="block text-sm font-medium mb-1.5 text-text-secondary">
                           Rule Title<span className="text-danger ml-1">*</span>
                        </label>
                        <input 
                           type="text" 
                           id="ruleTitle" 
                           value={ruleTitle}
                           onChange={(e) => setRuleTitle(e.target.value)}
                           required
                           className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-colors text-white"
                           placeholder="e.g. No Spamming or Flooding"
                           autoFocus
                        />
                     </div>

                     <div>
                        <label htmlFor="ruleDescription" className="block text-sm font-medium mb-1.5 text-text-secondary">
                           Description<span className="text-danger ml-1">*</span>
                        </label>
                        <textarea 
                           id="ruleDescription" 
                           value={ruleDesc}
                           onChange={(e) => setRuleDesc(e.target.value)}
                           rows={5}
                           required
                           className="w-full bg-dark-card border border-border-dark rounded-lg px-4 py-2.5 focus:outline-none focus:border-discord transition-colors text-white resize-y custom-scrollbar"
                           placeholder="Explain the rule in detail..."
                        />
                     </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex items-center justify-end gap-3 pt-8 mt-4">
                     <button 
                        type="button" 
                        onClick={closeModal}
                        className="px-5 py-2 text-text-secondary hover:text-white hover:bg-dark-card rounded-lg transition-colors font-medium border border-transparent hover:border-border-dark"
                     >
                        Cancel
                     </button>
                     <button 
                        type="submit" 
                        className="px-6 py-2 bg-discord hover:bg-discord-hover text-white font-semibold rounded-lg transition-colors shadow-lg shadow-discord/20"
                     >
                        {isEditing ? 'Save Changes' : 'Create Rule'}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
}

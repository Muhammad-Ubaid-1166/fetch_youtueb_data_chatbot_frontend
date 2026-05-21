import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { CopyButton } from '../ui/CopyButton';
import { Badge } from '../ui/Badge';
import type { VideoDataResponse } from '../../api/types';

interface ScriptStepsSectionProps {
  data: VideoDataResponse;
  copiedSection: string | null;
  onCopy: (text: string, section: string) => void;
}

export const ScriptStepsSection: React.FC<ScriptStepsSectionProps> = ({
  data,
  copiedSection,
  onCopy,
}) => {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());

  if (!data.script_steps || !data.script_steps.steps) {
    return null;
  }

  const { steps, total_steps, total_word_count } = data.script_steps;

  const toggleStep = (stepNumber: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepNumber)) {
      newExpanded.delete(stepNumber);
    } else {
      newExpanded.add(stepNumber);
    }
    setExpandedSteps(newExpanded);
  };

  const copyAllSteps = () => {
    const text = steps
      .map(s => `Step ${s.step_number}: ${s.description}\nTone: ${s.tone}\nWord Count: ${s.word_count}\n\nContinuity: ${s.continuity_note}`)
      .join('\n\n---\n\n');
    onCopy(text, 'allScriptSteps');
  };

  return (
    <Card hoverable>
      <CardHeader
        title={`Script Planning (${total_steps} steps)`}
        gradient="from-indigo-600 to-violet-600"
        action={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg">
              <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-white text-sm font-medium">{total_word_count.toLocaleString()} words</span>
            </div>
            <CopyButton
              onClick={copyAllSteps}
              copied={copiedSection === 'allScriptSteps'}
              label="Copy All"
              variant="primary"
            />
          </div>
        }
      />
      <CardBody>
        <div className="space-y-3">
          {steps.map((step) => {
            const isExpanded = expandedSteps.has(step.step_number);
            const colors = [
              'from-blue-500 to-indigo-500',
              'from-indigo-500 to-violet-500',
              'from-violet-500 to-purple-500',
              'from-purple-500 to-pink-500',
              'from-pink-500 to-rose-500',
              'from-rose-500 to-orange-500',
              'from-orange-500 to-amber-500',
              'from-amber-500 to-yellow-500',
              'from-yellow-500 to-lime-500',
              'from-lime-500 to-emerald-500',
            ];
            const gradient = colors[(step.step_number - 1) % colors.length];

            return (
              <div
                key={step.step_number}
                className="group border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200 hover:border-indigo-300 hover:shadow-md"
              >
                <button
                  onClick={() => toggleStep(step.step_number)}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-lg">{step.step_number}</span>
                    </div>
                    <div className="hidden sm:block">
                      <p className="font-medium text-gray-800 line-clamp-1">{step.description}</p>
                      <p className="text-sm text-gray-500">{step.description.length > 80 ? '...' : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="blue">{step.word_count} words</Badge>
                    <Badge variant="purple">{step.tone}</Badge>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="p-5 bg-gray-50/50 border-t border-gray-100 space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Description</span>
                      <p className="text-gray-700 leading-relaxed">{step.description}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Continuity Note</span>
                      <p className="text-gray-600 italic leading-relaxed">{step.continuity_note}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};
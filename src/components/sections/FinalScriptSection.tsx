import React from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { CopyButton } from '../ui/CopyButton';
import type { VideoDataResponse } from '../../api/types';

interface FinalScriptSectionProps {
  data: VideoDataResponse;
  copiedSection: string | null;
  onCopy: (text: string, section: string) => void;
}

export const FinalScriptSection: React.FC<FinalScriptSectionProps> = ({
  data,
  copiedSection,
  onCopy,
}) => {
  if (!data.final_script) {
    return null;
  }

  const wordCount = data.final_script.split(/\s+/).length;
  const estimatedMinutes = Math.ceil(wordCount / 150);

  return (
    <Card hoverable>
      <CardHeader
        title="Final Polished Script"
        gradient="from-emerald-600 to-teal-600"
        action={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg">
              <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-white text-sm font-medium">~{estimatedMinutes} min read</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg">
              <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-white text-sm font-medium">{wordCount.toLocaleString()} words</span>
            </div>
            <CopyButton
              onClick={() => onCopy(data.final_script!, 'finalScript')}
              copied={copiedSection === 'finalScript'}
              label="Copy Script"
              variant="primary"
            />
          </div>
        }
      />
      <CardBody>
        <div className="relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-teal-500 rounded-l-full"></div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-xl border border-emerald-100 h-[500px] overflow-y-auto">
            <p className="text-gray-800 whitespace-pre-wrap leading-loose">{data.final_script}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
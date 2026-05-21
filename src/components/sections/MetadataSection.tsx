import React from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { CopyButton } from '../ui/CopyButton';
import { Tag } from '../ui/Badge';
import type { VideoDataResponse } from '../../api/types';
import { formatHashtags } from '../../utils/validators';

interface MetadataSectionProps {
  data: VideoDataResponse;
  copiedSection: string | null;
  onCopy: (text: string, section: string) => void;
}

export const MetadataSection: React.FC<MetadataSectionProps> = ({
  data,
  copiedSection,
  onCopy,
}) => {
  const { rewritten_title, rewritten_description, rewritten_hashtags } = data;

  if (!rewritten_title && !rewritten_description && !rewritten_hashtags) {
    return null;
  }

  const hashtags = rewritten_hashtags ? formatHashtags(rewritten_hashtags) : [];

  return (
    <Card hoverable>
      <CardHeader
        title="Rewritten Metadata"
        gradient="from-blue-600 to-violet-600"
      />
      <CardBody>
        <div className="space-y-6">
          {rewritten_title && (
            <div className="group">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800">Title</h3>
                </div>
                <CopyButton
                  onClick={() => onCopy(rewritten_title, 'rewrittenTitle')}
                  copied={copiedSection === 'rewrittenTitle'}
                />
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                <p className="text-gray-800 font-medium leading-relaxed">{rewritten_title}</p>
              </div>
            </div>
          )}

          {rewritten_description && (
            <div className="group">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                </div>
                <CopyButton
                  onClick={() => onCopy(rewritten_description, 'rewrittenDescription')}
                  copied={copiedSection === 'rewrittenDescription'}
                />
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100 max-h-64 overflow-y-auto">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{rewritten_description}</p>
              </div>
            </div>
          )}

          {hashtags.length > 0 && (
            <div className="group">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800">Hashtags</h3>
                </div>
                <CopyButton
                  onClick={() => onCopy(hashtags.map(t => `#${t}`).join(' '), 'rewrittenHashtags')}
                  copied={copiedSection === 'rewrittenHashtags'}
                />
              </div>
              <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-100">
                {hashtags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
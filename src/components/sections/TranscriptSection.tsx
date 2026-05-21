import React from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { CopyButton } from '../ui/CopyButton';
import type { VideoDataResponse } from '../../api/types';

interface TranscriptSectionProps {
  data: VideoDataResponse;
  copiedSection: string | null;
  onCopy: (text: string, section: string) => void;
}

export const TranscriptSection: React.FC<TranscriptSectionProps> = ({
  data,
  copiedSection,
  onCopy,
}) => {
  if (!data.transcript) {
    return null;
  }

  const wordCount = data.transcript.split(/\s+/).length;

  return (
    <Card hoverable>
      <CardHeader
        title={`Original Transcript (${wordCount.toLocaleString()} words)`}
        gradient="from-gray-600 to-slate-700"
        action={
          <CopyButton
            onClick={() => onCopy(data.transcript, 'originalTranscript')}
            copied={copiedSection === 'originalTranscript'}
            label="Copy"
          />
        }
      />
      <CardBody>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 h-96 overflow-y-auto text-gray-700 whitespace-pre-wrap leading-relaxed">
          {data.transcript}
        </div>
      </CardBody>
    </Card>
  );
};
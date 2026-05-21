import React from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { CopyButton } from '../ui/CopyButton';
import type { VideoDataResponse } from '../../api/types';

interface AnnotatedTranscriptSectionProps {
  data: VideoDataResponse;
  copiedSection: string | null;
  onCopy: (text: string, section: string) => void;
}

export const AnnotatedTranscriptSection: React.FC<AnnotatedTranscriptSectionProps> = ({
  data,
  copiedSection,
  onCopy,
}) => {
  if (!data.annotated_transcript) {
    return null;
  }

  return (
    <Card hoverable>
      <CardHeader
        title="Annotated Transcript"
        gradient="from-teal-600 to-cyan-600"
        action={
          <CopyButton
            onClick={() => onCopy(data.annotated_transcript!, 'annotatedTranscript')}
            copied={copiedSection === 'annotatedTranscript'}
            label="Copy"
          />
        }
      />
      <CardBody>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 h-96 overflow-y-auto text-gray-700 font-mono text-sm whitespace-pre-wrap leading-relaxed">
          {data.annotated_transcript}
        </div>
      </CardBody>
    </Card>
  );
};
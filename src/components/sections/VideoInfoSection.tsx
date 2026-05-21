import React from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { CopyButton } from '../ui/CopyButton';
import type { VideoDataResponse } from '../../api/types';

interface VideoInfoSectionProps {
  data: VideoDataResponse;
  copiedSection: string | null;
  onCopy: (text: string, section: string) => void;
}

export const VideoInfoSection: React.FC<VideoInfoSectionProps> = ({
  data,
  copiedSection,
  onCopy,
}) => {
  return (
    <Card hoverable>
      <CardHeader
        title="Video Information"
        gradient="from-slate-600 to-slate-800"
        action={
          <CopyButton
            onClick={() => onCopy(data.video_id, 'videoId')}
            copied={copiedSection === 'videoId'}
            label="Copy ID"
            variant="primary"
          />
        }
      />
      <CardBody>
        <div className="flex flex-col lg:flex-row gap-8">
          {data.thumbnail_url && (
            <div className="flex-shrink-0">
              <div className="relative group">
                <img
                  src={data.thumbnail_url}
                  alt="Video thumbnail"
                  className="w-full lg:w-72 rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 ring-1 ring-black/5 rounded-2xl"></div>
              </div>
            </div>
          )}
          <div className="flex-1 space-y-5">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Video ID</span>
              <p className="text-gray-800 font-mono bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-3 rounded-xl border border-gray-200">
                {data.video_id}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Original Title</span>
              <p className="text-gray-800 bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-3 rounded-xl border border-gray-200 leading-relaxed">
                {data.title}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">Tags ({data.tags.length})</span>
              <div className="flex flex-wrap gap-2">
                {data.tags.slice(0, 12).map((tag, index) => (
                  <span key={index} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
                    {tag}
                  </span>
                ))}
                {data.tags.length > 12 && (
                  <span className="px-3 py-1.5 bg-gray-50 text-gray-500 rounded-lg text-sm font-medium">
                    +{data.tags.length - 12} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
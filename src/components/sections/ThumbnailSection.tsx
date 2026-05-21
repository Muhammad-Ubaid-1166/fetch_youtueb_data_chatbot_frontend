import React from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import type { VideoDataResponse } from '../../api/types';

interface ThumbnailSectionProps {
  data: VideoDataResponse;
  copiedSection: string | null;
  onCopyText: (text: string, section: string) => void;
  onCopyImage: (imageUrl: string, section: string) => void;
}

export const ThumbnailSection: React.FC<ThumbnailSectionProps> = ({
  data,
  copiedSection,
  onCopyText,
  onCopyImage,
}) => {
  const hasOriginal = data.thumbnail_url;
  const hasGenerated = data.generated_thumbnail_url;

  if (!hasOriginal && !hasGenerated) {
    return null;
  }

  return (
    <Card hoverable>
      <CardHeader
        title="Thumbnail Analysis"
        gradient="from-rose-500 to-pink-600"
      />
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {hasOriginal && (
            <div className="group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Original Thumbnail</h3>
                  <p className="text-sm text-gray-500">YouTube default thumbnail</p>
                </div>
              </div>
              <div className="relative group/image">
                <img
                  src={data.thumbnail_url!}
                  alt="Original YouTube thumbnail"
                  className="w-full rounded-2xl shadow-lg transition-transform duration-300 group-hover/image:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity rounded-2xl"></div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <a
                  href={data.thumbnail_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open Full Size
                </a>
              </div>
            </div>
          )}

          {hasGenerated && (
            <div className="group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">AI Regenerated</h3>
                  <p className="text-sm text-gray-500">Custom thumbnail created by AI</p>
                </div>
              </div>
              <div className="relative group/image">
                <img
                  src={data.generated_thumbnail_url!}
                  alt="AI regenerated thumbnail"
                  className="w-full rounded-2xl shadow-lg border-2 border-pink-200 transition-transform duration-300 group-hover/image:scale-[1.02]"
                />
                <div className="absolute top-3 right-3 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-semibold rounded-full shadow-lg">
                  AI Generated
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity rounded-2xl"></div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => onCopyImage(data.generated_thumbnail_url!, 'regeneratedThumbnail')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {copiedSection === 'regeneratedThumbnail' ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy Image
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {!hasGenerated && hasOriginal && (
          <div className="mt-8 p-5 bg-amber-50/80 backdrop-blur rounded-2xl border border-amber-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-amber-800">Thumbnail regeneration skipped</h4>
                <p className="text-amber-700 text-sm mt-1">This may be due to API timeout or invalid thumbnail URL.</p>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
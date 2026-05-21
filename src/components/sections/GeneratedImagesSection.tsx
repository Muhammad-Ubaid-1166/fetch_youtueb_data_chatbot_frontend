import React from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { CopyButton } from '../ui/CopyButton';
import { Badge } from '../ui/Badge';
import type { VideoDataResponse } from '../../api/types';
import { getSuccessRate } from '../../utils/validators';

interface GeneratedImagesSectionProps {
  data: VideoDataResponse;
  copiedSection: string | null;
  onCopyText: (text: string, section: string) => void;
  onCopyImage: (imageUrl: string, section: string) => void;
}

export const GeneratedImagesSection: React.FC<GeneratedImagesSectionProps> = ({
  data,
  copiedSection,
  onCopyText,
  onCopyImage,
}) => {
  if (!data.generated_image_urls || data.generated_image_urls.length === 0) {
    return null;
  }

  const images = data.generated_image_urls;
  const successRate = getSuccessRate(images);
  const successCount = images.filter(img => img.status === 'success').length;
  const failedCount = images.length - successCount;

  const copyAllPrompts = () => {
    const text = images
      .map(img => `Image ${img.image_number}:\n${img.image_prompt}`)
      .join('\n\n---\n\n');
    onCopyText(text, 'allImagePrompts');
  };

  return (
    <Card hoverable>
      <CardHeader
        title={`Generated Images (${successCount}/${images.length})`}
        gradient="from-violet-600 to-fuchsia-600"
        action={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-lg">
              <div className={`w-2.5 h-2.5 rounded-full ${successRate >= 80 ? 'bg-green-400' : successRate >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}></div>
              <span className="text-white text-sm font-medium">{successRate}% success</span>
            </div>
            <CopyButton
              onClick={copyAllPrompts}
              copied={copiedSection === 'allImagePrompts'}
              label="Copy Prompts"
              variant="primary"
            />
          </div>
        }
      />
      <CardBody>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {images.map((image) => (
            <div
              key={image.image_number}
              className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                image.status === 'failed' 
                  ? 'border-red-200 bg-red-50/50' 
                  : 'border-gray-100 bg-gray-50 hover:border-violet-300'
              }`}
            >
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                {image.status === 'success' && image.image_url ? (
                  <img
                    src={image.image_url}
                    alt={`Generated image ${image.image_number}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-center p-4">
                    <div className="w-14 h-14 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <p className="text-red-600 font-medium text-sm">Generation Failed</p>
                    {image.error && (
                      <p className="text-red-500 text-xs mt-1 max-w-full truncate">{image.error}</p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-white">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant={image.status === 'success' ? 'green' : 'red'}>
                    {image.status === 'success' ? '✓ Success' : '✗ Failed'}
                  </Badge>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    #{image.image_number}
                  </span>
                </div>
                
                {image.status === 'success' && (
                  <button
                    onClick={() => onCopyImage(image.image_url, `generatedImage${image.image_number}`)}
                    className="w-full mt-2 py-2 px-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-violet-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {copiedSection === `generatedImage${image.image_number}` ? (
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
                )}
              </div>
            </div>
          ))}
        </div>

        {failedCount > 0 && (
          <div className="mt-6 p-5 bg-red-50/80 backdrop-blur rounded-2xl border border-red-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-red-800">{failedCount} image(s) failed to generate</h4>
                <p className="text-red-600 text-sm mt-1">This may be due to API rate limiting, invalid prompts, or network issues.</p>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { CopyButton } from '../ui/CopyButton';
import { Badge } from '../ui/Badge';
import type { VideoDataResponse } from '../../api/types';

interface ImagePlanSectionProps {
  data: VideoDataResponse;
  copiedSection: string | null;
  onCopy: (text: string, section: string) => void;
}

export const ImagePlanSection: React.FC<ImagePlanSectionProps> = ({
  data,
  copiedSection,
  onCopy,
}) => {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set());

  if (!data.image_plan) {
    return null;
  }

  const { total_images, default_images, step_allocations, image_placements } = data.image_plan;

  const toggleStep = (stepNumber: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepNumber)) {
      newExpanded.delete(stepNumber);
    } else {
      newExpanded.add(stepNumber);
    }
    setExpandedSteps(newExpanded);
  };

  const getPlacementsForStep = (stepNumber: number) => {
    return image_placements.filter(p => p.step_number === stepNumber);
  };

  return (
    <Card hoverable>
      <CardHeader
        title={`Image Plan (${total_images} images, target: ${default_images})`}
        gradient="from-orange-500 to-amber-600"
      />
      <CardBody>
        <div className="space-y-4">
          {step_allocations.map((allocation) => {
            const placements = getPlacementsForStep(allocation.step_number);
            const isExpanded = expandedSteps.has(allocation.step_number);

            return (
              <div
                key={allocation.step_number}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleStep(allocation.step_number)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 bg-orange-600 text-white font-bold rounded-full">
                      {allocation.step_number}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {allocation.step_description.slice(0, 50)}
                      {allocation.step_description.length > 50 ? '...' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="amber">{allocation.allocated_images} images</Badge>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 bg-white border-t border-gray-200 space-y-4">
                    {allocation.image_hints.length > 0 && (
                      <div>
                        <span className="text-sm font-semibold text-gray-500 block mb-2">Visual Hints</span>
                        <div className="flex flex-wrap gap-2">
                          {allocation.image_hints.map((hint, idx) => (
                            <Badge key={idx} variant="default">{hint}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {placements.length > 0 && (
                      <div>
                        <span className="text-sm font-semibold text-gray-500 block mb-2">Image Placements</span>
                        <div className="space-y-3">
                          {placements.map((placement) => (
                            <div key={placement.image_number} className="bg-gray-50 p-3 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <Badge variant="purple">Image #{placement.image_number}</Badge>
                                <CopyButton
                                  onClick={() => onCopy(placement.image_prompt, `imagePrompt${placement.image_number}`)}
                                  copied={copiedSection === `imagePrompt${placement.image_number}`}
                                  label="Copy Prompt"
                                  size="sm"
                                />
                              </div>
                              <p className="text-sm text-gray-700 mb-2">
                                <span className="font-semibold">Context:</span> {placement.placement_context}
                              </p>
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold">Scene:</span> {placement.scene_description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
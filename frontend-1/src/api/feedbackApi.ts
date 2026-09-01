import { apiClient } from './client';
import { FeedbackRequest } from '@/types';
import { mockStore } from '@/lib/mockEngine';

export const feedbackApi = {
  /**
   * Submit analyst feedback
   * POST /api/v1/analyses/{analysisId}/feedback
   */
  async submitFeedback(analysisId: string, payload: FeedbackRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post(`/analyses/${analysisId}/feedback`, payload);
      return { success: true, message: response.data?.message || 'Feedback submitted successfully' };
    } catch (err: any) {
      console.warn('Backend feedback offline, logging mock feedback:', err.message);
      mockStore.recordFeedback(analysisId, payload.actualLabel, payload.comment);
      return { success: true, message: 'Analyst feedback recorded locally for model continuous learning.' };
    }
  },
};

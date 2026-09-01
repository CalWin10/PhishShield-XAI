import { apiClient } from './client';
import {
  AnalysisResult,
  EmailScanRequest,
  HistoryFilterParams,
  HistoryPage,
  ScanMode,
  UrlScanRequest,
} from '@/types';
import { mockStore } from '@/lib/mockEngine';

export const analysisApi = {
  /**
   * Analyse a pasted email (JSON)
   * POST /api/v1/analyses/email
   */
  async analyseEmail(payload: EmailScanRequest): Promise<AnalysisResult> {
    try {
      const response = await apiClient.post<AnalysisResult>('/analyses/email', payload);
      return response.data;
    } catch (err: any) {
      console.warn('Backend unavailable, using client-side analysis simulation:', err.message);
      return mockStore.createEmailAnalysis(payload);
    }
  },

  /**
   * Analyse an EML file (multipart)
   * POST /api/v1/analyses/email-file
   */
  async analyseEmailFile(file: File, mode: ScanMode): Promise<AnalysisResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mode', mode);

      const response = await apiClient.post<AnalysisResult>('/analyses/email-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err: any) {
      console.warn('Backend unavailable, using client-side analysis simulation:', err.message);
      return mockStore.createEmlAnalysis(file, mode);
    }
  },

  /**
   * Analyse a URL (optional – for future/supported)
   * POST /api/v1/analyses/url
   */
  async analyseUrl(payload: UrlScanRequest): Promise<AnalysisResult> {
    try {
      const response = await apiClient.post<AnalysisResult>('/analyses/url', payload);
      return response.data;
    } catch (err: any) {
      console.warn('Backend unavailable, using client-side analysis simulation:', err.message);
      return mockStore.createUrlAnalysis(payload);
    }
  },

  /**
   * Retrieve analysis status/result
   * GET /api/v1/analyses/{analysisId}
   */
  async getAnalysis(analysisId: string): Promise<AnalysisResult> {
    try {
      const response = await apiClient.get<AnalysisResult>(`/analyses/${analysisId}`);
      return response.data;
    } catch (err: any) {
      const mock = mockStore.getAnalysis(analysisId);
      if (mock) {
        return mock;
      }
      throw err;
    }
  },

  /**
   * History
   * GET /api/v1/analyses?page=0&size=20&verdict=CRITICAL&inputType=URL
   */
  async getHistory(params: HistoryFilterParams = {}): Promise<HistoryPage> {
    try {
      const queryParams: Record<string, any> = {
        page: params.page ?? 0,
        size: params.size ?? 20,
      };
      if (params.verdict && params.verdict !== 'ALL') {
        queryParams.verdict = params.verdict;
      }
      if (params.inputType && params.inputType !== 'ALL') {
        queryParams.inputType = params.inputType;
      }

      const response = await apiClient.get<HistoryPage>('/analyses', { params: queryParams });
      return response.data;
    } catch (err: any) {
      return mockStore.getHistory(
        params.page ?? 0,
        params.size ?? 20,
        params.verdict,
        params.inputType,
        params.search
      );
    }
  },
};

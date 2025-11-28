export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: any;
  timestamp: Date;
}
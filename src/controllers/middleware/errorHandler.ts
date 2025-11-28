import { Request, Response, NextFunction } from 'express';

// Classe personalizada para erros da aplicação
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Interface para erros do Mongoose
interface MongooseError extends Error {
  code?: number;
  keyValue?: any;
  errors?: any;
}

// Middleware de tratamento de erros
export const errorHandler = (
  error: Error | AppError | MongooseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error Handler:', error);

  // Erro personalizado da aplicação
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      details: error.details,
      timestamp: new Date()
    });
  }

  // Erro de duplicata do MongoDB
  if ('code' in error && error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0];
    return res.status(409).json({
      success: false,
      error: `${field} já existe`,
      timestamp: new Date()
    });
  }

  // Erro de validação do Mongoose
  if ('errors' in error && error.errors) {
    const validationErrors = Object.values(error.errors).map((err: any) => ({
      field: err.path,
      message: err.message
    }));
    
    return res.status(400).json({
      success: false,
      error: 'Erro de validação',
      details: validationErrors,
      timestamp: new Date()
    });
  }

  // Erro genérico
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    timestamp: new Date()
  });
};
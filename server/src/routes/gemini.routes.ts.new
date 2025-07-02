import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationError } from 'express-validator';
import { geminiService } from '../services/geminiService';
import { logger } from '../utils/logger';
import { BadRequestError } from '../middleware/errorHandler';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface GenerateRequest {
  prompt: string;
}

interface ChatRequest {
  messages: Message[];
}

const router = Router();

router.post(
  '/generate',
  [
    body('prompt')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('Prompt is required')
      .isLength({ max: 10000 })
      .withMessage('Prompt must be less than 10000 characters'),
  ],
  async (req: Request<{}, {}, GenerateRequest>, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new BadRequestError('Validation error', errors.array() as unknown as ValidationError[]);
      }

      const { prompt } = req.body;
      
      logger.info('Received text generation request', { 
        promptLength: prompt.length 
      });

      const generatedText = await geminiService.generateText(prompt);

      res.status(200).json({
        success: true,
        data: { generatedText },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/chat',
  [
    body('messages')
      .isArray()
      .withMessage('Messages must be an array')
      .notEmpty()
      .withMessage('At least one message is required'),
    body('messages.*.role')
      .isIn(['user', 'assistant'])
      .withMessage('Invalid message role'),
    body('messages.*.content')
      .isString()
      .notEmpty()
      .withMessage('Message content is required'),
  ],
  async (req: Request<{}, {}, ChatRequest>, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new BadRequestError('Validation error', errors.array() as unknown as ValidationError[]);
      }

      const { messages } = req.body;
      
      logger.info('Received chat request', { 
        messageCount: messages.length 
      });

      const response = await geminiService.generateChatResponse(messages);

      res.status(200).json({
        success: true,
        data: { response },
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as geminiRouter };

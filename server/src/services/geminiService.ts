import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/config';
import { logger } from '../utils/logger';
import { InternalServerError } from '../middleware/errorHandler';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private static instance: GeminiService;

  private constructor() {
    try {
      this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      logger.info('Gemini service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Gemini service', { error });
      throw new InternalServerError('Failed to initialize AI service');
    }
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  public async generateText(prompt: string): Promise<string> {
    try {
      logger.debug('Generating text with prompt', { prompt: prompt.substring(0, 100) + '...' });
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      logger.debug('Successfully generated text', { 
        promptLength: prompt.length,
        responseLength: text.length 
      });
      
      return text;
    } catch (error: any) {
      logger.error('Error generating text with Gemini', { 
        error: error.message,
        stack: error.stack 
      });
      throw new InternalServerError('Failed to generate text');
    }
  }

  public async generateChatResponse(messages: Array<{role: string, content: string}>): Promise<string> {
    try {
      logger.debug('Generating chat response', { messageCount: messages.length });
      
      // Start a chat session
      const chat = this.model.startChat({
        history: messages.slice(0, -1).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      });

      // Get the last message (user's latest message)
      const lastMessage = messages[messages.length - 1];
      const result = await chat.sendMessage(lastMessage.content);
      const response = await result.response;
      const text = response.text();
      
      logger.debug('Successfully generated chat response', { 
        messagesCount: messages.length,
        responseLength: text.length 
      });
      
      return text;
    } catch (error: any) {
      logger.error('Error generating chat response', { 
        error: error.message,
        stack: error.stack 
      });
      throw new InternalServerError('Failed to generate chat response');
    }
  }
}

// Export a singleton instance
export const geminiService = GeminiService.getInstance();

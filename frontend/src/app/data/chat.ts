
import { Message } from '../../../types/Message';

export const initialMessages: Message[] = [
  {
    id: 1,
    type: 'ai',
    content: "Hello! I'm Shelf AI, your personal book companion. How can I help you today?",
    timestamp: new Date(),
    suggestions: ['Recommend a book', 'Set a reading goal', 'Analyze my reading habits'],
  },
];

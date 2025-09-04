import { Message } from '../../types/Message';

export const generateAIResponse = (userMessage: string, messages: Message[]): Message => {
  const responses = {
    'recommend': {
      content: "Based on your reading history and preferences, I'd recommend 'The Seven Moons of Maali Almeida' by Shehan Karunatilaka. It's a brilliant blend of magical realism and dark comedy that won the Booker Prize. Given your love for literary fiction with unique perspectives, this would be perfect for you.",
      suggestions: ['Tell me more about this book', 'Find similar books', 'Add to my reading list', 'What else have you got?']
    },
    'habits': {
      content: "Looking at your reading patterns, you tend to read most actively in the evenings and prefer finishing books within 2-3 weeks. You've been consistently hitting your monthly goals! I notice you gravitate toward contemporary fiction and self-help books. Would you like me to suggest ways to diversify your reading or optimize your current habits?",
      suggestions: ['How can I read faster?', 'Suggest different genres', 'Set a new reading goal', 'Track my progress better']
    },
    'goal': {
      content: "Let's set up a reading goal that's both challenging and achievable! Based on your current pace of 2 books per month, we could aim for 30 books this year. I can help you track progress, suggest shorter books when you're behind, and celebrate milestones. What type of goal interests you most?",
      suggestions: ['30 books this year', 'Read 12 different genres', 'Finish 5 classics', 'Read 500 pages weekly']
    },
    'discuss': {
      content: "I'd love to discuss your current reads! I see you're reading 'The Seven Husbands of Evelyn Hugo' - what an emotional journey that book is! Where are you in the story? Are you enjoying Taylor Jenkins Reid's storytelling style? I can offer insights without spoilers or dive deep if you've finished it.",
      suggestions: ['No spoilers please!', 'What did you think of the ending?', 'Recommend similar books', 'Discuss themes and characters']
    }
  };

  const lowerMessage = userMessage.toLowerCase();
  let response = responses['recommend']; // default

  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
    response = responses['recommend'];
  } else if (lowerMessage.includes('habit') || lowerMessage.includes('pattern') || lowerMessage.includes('analyz')) {
    response = responses['habits'];
  } else if (lowerMessage.includes('goal') || lowerMessage.includes('target')) {
    response = responses['goal'];
  } else if (lowerMessage.includes('discuss') || lowerMessage.includes('talk') || lowerMessage.includes('evelyn')) {
    response = responses['discuss'];
  }

  return {
    id: messages.length + 2,
    type: 'ai',
    content: response.content,
    timestamp: new Date(),
    suggestions: response.suggestions
  };
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}; 
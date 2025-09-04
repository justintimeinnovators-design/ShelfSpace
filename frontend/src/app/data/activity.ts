import { Activity } from '../../../types/models';

export const initialRecentActivity: Activity[] = [
  { id: 1, action: 'finished', book: '1984', time: '2h ago' },
  { id: 2, action: 'reviewed', book: 'The Great Gatsby', rating: 5, time: '5h ago' },
  { id: 3, action: 'joined', group: 'Sci-Fi Lovers', time: '1d ago' },
];

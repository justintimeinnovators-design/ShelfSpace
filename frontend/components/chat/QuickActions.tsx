import React from 'react';

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  const quickActions = [
    "Recommend a book",
    "Set reading goal", 
    "Analyze my habits",
    "Book discussion"
  ];

  return (
    <div className="flex items-center space-x-2 mt-3">
      <span className="text-xs text-gray-500">Quick actions:</span>
      {quickActions.map((action) => (
        <button
          key={action}
          onClick={() => onActionClick(action)}
          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors"
        >
          {action}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;

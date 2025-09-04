'use client';

import React from 'react';
import { Calendar, Target, TrendingUp } from 'lucide-react';

const QuickActionsCard = () => {
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-h5 text-gray-900 dark:text-white">Quick Actions</h3>
            </div>
            <div className="p-6">
                <div className="space-y-2">
                    <button className="w-full btn-outline justify-start">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Reading Time
                    </button>
                    <button className="w-full btn-outline justify-start">
                        <Target className="h-4 w-4 mr-2" />
                        Set Reading Goal
                    </button>
                    <button className="w-full btn-outline justify-start">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Analytics
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuickActionsCard;
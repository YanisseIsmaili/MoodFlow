// src/components/dashboard/TodaysFocus.jsx
import React, { useState, useEffect } from 'react';
import { Target, Zap, Plus } from 'lucide-react';
import { saveToStorage, getFromStorage } from '../../utils/storageUtils';

const TodaysFocus = () => {
  const [tasks, setTasks] = useState(() => {
    return getFromStorage('todaysTasks', {
      studyHours: { current: 3, target: 8 },
      workInProgress: { current: 1, target: 3 },
      tasksCompleted: { current: 5, target: 10 }
    });
  });

  const [leaves, setLeaves] = useState(() => getFromStorage('leavesEarned', 11));

  useEffect(() => {
    saveToStorage('todaysTasks', tasks);
  }, [tasks]);

  useEffect(() => {
    saveToStorage('leavesEarned', leaves);
  }, [leaves]);

  const updateTask = (taskName, increment = true) => {
    setTasks(prev => {
      const task = prev[taskName];
      const newCurrent = increment 
        ? Math.min(task.current + 1, task.target)
        : Math.max(task.current - 1, 0);
      
      return {
        ...prev,
        [taskName]: { ...task, current: newCurrent }
      };
    });

    if (increment) {
      setLeaves(prev => prev + 1);
    }
  };

  const getProgress = (current, target) => {
    return (current / target) * 100;
  };

  const getProgressColor = (taskName) => {
    switch(taskName) {
      case 'studyHours':
        return 'from-orange-400 to-amber-500';
      case 'workInProgress':
        return 'from-blue-400 to-blue-500';
      case 'tasksCompleted':
        return 'from-green-400 to-green-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-2xl border border-amber-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-amber-700">
          <Target className="w-5 h-5" />
          <span className="font-semibold">Today's Focus</span>
        </div>
        <button className="text-amber-600 hover:text-amber-800">
          <Zap className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Study Hours */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-amber-700">Study Hours</span>
            <div className="flex items-center gap-2">
              <span className="text-amber-900 font-semibold">
                {tasks.studyHours.current}/{tasks.studyHours.target}h
              </span>
              <button
                onClick={() => updateTask('studyHours', true)}
                className="text-green-600 hover:text-green-800 text-xl"
              >
                +
              </button>
              <button
                onClick={() => updateTask('studyHours', false)}
                className="text-red-600 hover:text-red-800 text-xl"
              >
                -
              </button>
            </div>
          </div>
          <div className="h-3 bg-amber-200 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getProgressColor('studyHours')} transition-all duration-500`}
              style={{ width: `${getProgress(tasks.studyHours.current, tasks.studyHours.target)}%` }}
            ></div>
          </div>
        </div>

        {/* Work in Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-amber-700">Work in Progress</span>
            <div className="flex items-center gap-2">
              <span className="text-amber-900 font-semibold">
                {tasks.workInProgress.current}/{tasks.workInProgress.target}
              </span>
              <button
                onClick={() => updateTask('workInProgress', true)}
                className="text-green-600 hover:text-green-800 text-xl"
              >
                +
              </button>
              <button
                onClick={() => updateTask('workInProgress', false)}
                className="text-red-600 hover:text-red-800 text-xl"
              >
                -
              </button>
            </div>
          </div>
          <div className="h-3 bg-amber-200 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getProgressColor('workInProgress')} transition-all duration-500`}
              style={{ width: `${getProgress(tasks.workInProgress.current, tasks.workInProgress.target)}%` }}
            ></div>
          </div>
        </div>

        {/* Tasks Completed */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-amber-700">Tasks Completed</span>
            <div className="flex items-center gap-2">
              <span className="text-amber-900 font-semibold">
                {tasks.tasksCompleted.current}/{tasks.tasksCompleted.target}
              </span>
              <button
                onClick={() => updateTask('tasksCompleted', true)}
                className="text-green-600 hover:text-green-800 text-xl"
              >
                +
              </button>
              <button
                onClick={() => updateTask('tasksCompleted', false)}
                className="text-red-600 hover:text-red-800 text-xl"
              >
                -
              </button>
            </div>
          </div>
          <div className="h-3 bg-amber-200 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${getProgressColor('tasksCompleted')} transition-all duration-500`}
              style={{ width: `${getProgress(tasks.tasksCompleted.current, tasks.tasksCompleted.target)}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-6 p-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl">
          <div className="text-4xl">🎯</div>
          <div className="text-amber-900 font-bold text-2xl">{leaves}</div>
          <div className="text-amber-700 text-sm">September Leaves Earned</div>
        </div>
      </div>
    </div>
  );
};

export default TodaysFocus;
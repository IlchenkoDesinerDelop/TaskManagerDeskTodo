import React, { useState } from 'react';

interface Subtask {
  id: string;
  title: string;
  description?: string;
  subtasks: Subtask[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  subtasks: Subtask[];
}

interface TaskListProps {
  tasks: Task[];
  expandedTasks: boolean[];
  completedSubtasks: Record<number, boolean[]>;
  toggleTask: (taskIndex: number) => void;
  toggleSubtask: (taskIndex: number, subtaskIndex: number) => void;
  selectedTaskIndex: number | null;
  selectTask: (taskIndex: number) => void;
  openAddTaskModal: () => void;
  openEditTaskModal: (taskIndex: number) => void;
  deleteTask: (taskIndex: number) => void;
  openAddSubtaskModal: (taskIndex: number, subtaskIndexes: number[]) => void;
  openEditSubtaskModal: (taskIndex: number, subtaskIndexes: number[]) => void;
  deleteSubtask: (taskIndex: number, subtaskIndexes: number[]) => void;
  selectSubtask: (taskIndex: number, subtaskIndexes: number[]) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  expandedTasks,
  completedSubtasks,
  toggleTask,
  toggleSubtask,
  selectedTaskIndex,
  selectTask,
  openAddTaskModal,
  openEditTaskModal,
  deleteTask,
  openAddSubtaskModal,
  openEditSubtaskModal,
  deleteSubtask,
  selectSubtask,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Фильтрация задач и подзадач по поисковому запросу
  const filteredTasks = tasks.filter((task) => {
    const taskMatches = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const subtaskMatches = task.subtasks.some((subtask) =>
      subtask.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return taskMatches || subtaskMatches;
  });

  const renderSubtasks = (subtasks: Subtask[], taskIndex: number, subtaskIndexes: number[] = []) => {
    return (
      <ul className="list-decimal list-inside ml-4 mt-2">
        {subtasks.map((subtask, subtaskIndex) => {
          const newSubtaskIndexes = [...subtaskIndexes, subtaskIndex];
          return (
            <li key={subtask.id} className="relative">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={completedSubtasks[taskIndex]?.[subtaskIndex] || false}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleSubtask(taskIndex, subtaskIndex);
                  }}
                  className="mr-2"
                />
                <span className="cursor-pointer ml-2" onClick={() => selectSubtask(taskIndex, newSubtaskIndexes)}>
                  {subtask.title}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditSubtaskModal(taskIndex, newSubtaskIndexes);
                  }}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded shadow-md ml-2 text-sm"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSubtask(taskIndex, newSubtaskIndexes);
                  }}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded shadow-md ml-2 text-sm"
                >
                  🗑
                </button>
              </div>
              {/* Отображаем описание подзадачи */}
              {subtask.description && (
                <p className="text-gray-700 ml-6">{subtask.description}</p>
              )}
              {renderSubtasks(subtask.subtasks, taskIndex, newSubtaskIndexes)}
            </li>
          );
        })}
        <button
          onClick={(e) => {
            e.stopPropagation();
            openAddSubtaskModal(taskIndex, subtaskIndexes);
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded shadow-md mt-2 text-sm"
        >
          + Добавить подзадачу
        </button>
      </ul>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-300 p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Список задач</h1>
      <input
        type="text"
        placeholder="Поиск задач"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      <ul className="list-none text-lg text-gray-700 space-y-4">
        {filteredTasks.map((task, taskIndex) => (
          <li
            key={task.id}
            className={`relative ${selectedTaskIndex === taskIndex ? 'bg-blue-100' : ''}`}
            onClick={() => selectTask(taskIndex)}
          >
            <div className="flex items-center">
              <span
                className="cursor-pointer text-blue-600 mr-2"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTask(taskIndex);
                }}
              >
                {expandedTasks[taskIndex] ? '▼' : '▶️'}
              </span>
              <span className="font-bold">{task.title}</span>
              <div className="ml-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditTaskModal(taskIndex);
                  }}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded shadow-md ml-2 text-sm"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(taskIndex);
                  }}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded shadow-md ml-2 text-sm"
                >
                  🗑
                </button>
              </div>
            </div>
            {expandedTasks[taskIndex] && renderSubtasks(task.subtasks, taskIndex)}
          </li>
        ))}
      </ul>

      
    </div>
  );
};

export default TaskList;
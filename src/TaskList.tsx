import React from 'react';

interface Subtask {
  title: string;
  description?: string;
}

interface Task {
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
  selectedTaskIndex: number | null; // Добавьте свойство для индекса выбранной задачи
  selectTask: (taskIndex: number) => void; // Добавьте свойство для установки индекса выбранной задачи
}

const TaskList: React.FC<TaskListProps> = ({ tasks, expandedTasks, completedSubtasks, toggleTask, toggleSubtask, selectedTaskIndex, selectTask }) => {
  return (
    <div className="flex-1 flex flex-col bg-gray-300 p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Список задач</h1>
      <ul className="list-none text-lg text-gray-700 space-y-4">
        {tasks.map((task, taskIndex) => (
          <li 
            key={taskIndex}
            className={`relative ${selectedTaskIndex === taskIndex ? 'bg-blue-100' : ''}`} // Добавьте класс для подсветки
            onClick={() => selectTask(taskIndex)} // Добавьте обработчик клика
          >
            <div className="flex items-center">
              <span className="cursor-pointer text-blue-600 mr-2" onClick={() => toggleTask(taskIndex)}>
                {expandedTasks[taskIndex] ? '^' : '>'}
              </span>
              <span className="font-bold">{task.title}</span>
            </div>
            {expandedTasks[taskIndex] && task.subtasks.length > 0 && (
              <ul className="list-decimal list-inside ml-4">
                {task.subtasks.map((subtask, subtaskIndex) => (
                  <li key={subtaskIndex}>
                    <label>
                      <input
                        type="checkbox"
                        checked={completedSubtasks[taskIndex]?.[subtaskIndex] || false}
                        onChange={() => toggleSubtask(taskIndex, subtaskIndex)}
                        className="mr-2"
                      />
                      {subtask.title}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

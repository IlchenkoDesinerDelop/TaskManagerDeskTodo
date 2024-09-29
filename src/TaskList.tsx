import React, { useState } from 'react';

interface Task {
  title: string;
  subtasks: { title: string }[];
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
  openAddSubtaskModal: (taskIndex: number) => void;
  openEditSubtaskModal: (taskIndex: number, subtaskIndex: number) => void;
  deleteSubtask: (taskIndex: number, subtaskIndex: number) => void;
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
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Фильтрация задач и подзадач по поисковому запросу
  const filteredTasks = tasks.filter((task) => {
    if (searchTerm === '') {
      return true;
    }
    return (
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.subtasks.some((subtask) =>
        subtask.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  return (
    <div className="flex-1 flex flex-col bg-gray-300 p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Список задач</h1>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <ul className="list-none text-lg text-gray-700 space-y-4">
        <button
          onClick={openAddTaskModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded shadow-md text-sm"
        >
          {' '}
          + добавить задачу{' '}
        </button>
        {filteredTasks.map((task, taskIndex) => (
          <li
            key={taskIndex}
            className={`relative ${
              selectedTaskIndex === taskIndex ? 'bg-blue-100' : ''
            }`}
            onClick={() => selectTask(taskIndex)}
          >
            <div className="flex items-center">
              <span
                className="cursor-pointer text-blue-600 mr-2"
                onClick={() => toggleTask(taskIndex)}
              >
                {expandedTasks[taskIndex] ? '^' : '>'}
              </span>
              <span className="font-bold">{task.title}</span>
              <div className="ml-auto">
                <button
                  onClick={() => openEditTaskModal(taskIndex)}
                  className=" text-white font-bold py-1 px-2 rounded shadow-md ml-2 text-sm"
                >
                  {' '}
                  ✏️{' '}
                </button>
                <button
                  onClick={() => deleteTask(taskIndex)}
                  className=" text-white font-bold py-1 px-2 rounded shadow-md ml-2 text-sm"
                >
                  {' '}
                  🗑{' '}
                </button>
              </div>
            </div>
            {expandedTasks[taskIndex] && task.subtasks.length > 0 && (
              <ul className="list-decimal list-inside ml-4">
                {task.subtasks.map((subtask, subtaskIndex) => (
                  <li key={subtaskIndex}>
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          completedSubtasks[taskIndex]?.[subtaskIndex] || false
                        }
                        onChange={() =>
                          toggleSubtask(taskIndex, subtaskIndex)
                        }
                        className="mr-2"
                      />
                      {subtask.title}
                      <div className="ml-auto">
                      <button
                        onClick={() =>
                          openEditSubtaskModal(taskIndex, subtaskIndex)
                        }
                        className=" text-white font-bold py-1 px-2 rounded shadow-md ml-2 text-sm"
                      >
                        {' '}
                        ✏️{' '}
                      </button>
                      <button
                        onClick={() =>
                          deleteSubtask(taskIndex, subtaskIndex)
                        }
                        className=" text-white font-bold py-1 px-2 rounded shadow-md ml-2 text-sm"
                      >
                        {' '}
                        🗑{' '}
                      </button>
                    </div>
                  </label>
                </li>
              ))}
              <button
                onClick={() => openAddSubtaskModal(taskIndex)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded shadow-md mt-2 text-sm"
              >
                {' '}
                + добавить подзадачу{' '}
              </button>
            </ul>
          )}
        </li>
      ))}
    </ul>
  </div>
);
};

// Компонент для поисковой строки
const SearchBar: React.FC<{
searchTerm: string;
setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}> = ({ searchTerm, setSearchTerm }) => {
return (
  <div className="mb-4">
    <input
      type="text"
      placeholder="Поиск... 🔍"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="border border-gray-400 px-3 py-2 rounded-md"
    />
  </div>
);
};

export default TaskList;


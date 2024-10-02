// SubtaskDetails.tsx
import React from 'react';

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

interface SubtaskDetailsProps {
  task: Task;
  selectSubtask: (subtaskIndexes: number[]) => void;
  completedSubtasks: { [taskIndex: number]: boolean[] }; // Добавляем completedSubtasks
}

const SubtaskDetails: React.FC<SubtaskDetailsProps> = ({ task, selectSubtask, completedSubtasks }) => {
  const [expandedSubtaskIndexes, setExpandedSubtaskIndexes] = React.useState<number[]>([]);

  const toggleExpandedSubtask = (subtaskIndexes: number[]) => {
    if (expandedSubtaskIndexes.includes(subtaskIndexes[subtaskIndexes.length - 1])) {
      setExpandedSubtaskIndexes(expandedSubtaskIndexes.filter((index) => index !== subtaskIndexes[subtaskIndexes.length - 1]));
    } else {
      setExpandedSubtaskIndexes([...expandedSubtaskIndexes, subtaskIndexes[subtaskIndexes.length - 1]]);
    }
  };

  const renderSubtasks = (subtasks: Subtask[], subtaskIndexes: number[] = []) => {
    return (
      <ul className="list-decimal list-inside ml-4 mt-2">
        {subtasks.map((subtask, subtaskIndex) => {
          const newSubtaskIndexes = [...subtaskIndexes, subtaskIndex];
          return (
            <li key={subtask.id} className="relative">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={`completedSubtasks && completedSubtasks[0]?.[subtaskIndex] ?? false`}
                  onChange={() => {
                    // Здесь вы должны реализовать логику изменения completedSubtasks
                    // Например, handleToggleSubtask(subtaskIndex)
                  }}
                />
                <span className="cursor-pointer ml-2" onClick={() => selectSubtask(newSubtaskIndexes)}>
                  {subtask.title}
                </span>
              </div>
              {expandedSubtaskIndexes.includes(subtaskIndex) && renderSubtasks(subtask.subtasks, newSubtaskIndexes)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100 p-4">
      <h2 className="text-3xl font-bold text-blue-600 mb-4">{task.title}</h2>
      <p className="text-lg text-gray-700 mb-4">{task.description}</p>
      <h3 className="text-2xl font-bold text-blue-600 mb-4">Подзадачи</h3>
      {renderSubtasks(task.subtasks)}
      {/* Отображение описания подзадачи */}
      {task.subtasks.length > 0 && (
        <div className="mt-4">
          <p className="text-gray-700">Описание: {task.subtasks[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default SubtaskDetails;


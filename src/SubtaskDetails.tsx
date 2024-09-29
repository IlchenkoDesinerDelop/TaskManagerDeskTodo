import React from 'react';

interface SubtaskDetailsProps {
  selectedSubtask: Subtask | null;
}

const SubtaskDetails: React.FC<SubtaskDetailsProps> = ({ selectedSubtask }) => {
  return (
    <div className="flex-1 flex flex-col bg-gray-100 p-4">
      {selectedSubtask ? (
        <div>
          <h2 className="text-4xl font-bold text-blue-600">{selectedSubtask.title}</h2>
          <p>{selectedSubtask.description}</p>
        </div>
      ) : (
        <p className="text-gray-600">Выберите подзадачу для просмотра информации.</p>
      )}
    </div>
  );
};

export default SubtaskDetails;

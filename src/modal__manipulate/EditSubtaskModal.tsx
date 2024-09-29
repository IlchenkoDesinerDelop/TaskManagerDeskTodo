import React, { useState } from 'react';

interface EditSubtaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskIndex: number | null;
  subtaskIndex: number | null;
  subtask: Subtask | null;
  onEditSubtask: (taskIndex: number, subtaskIndex: number, updatedSubtask: Subtask) => void;
}

const EditSubtaskModal: React.FC<EditSubtaskModalProps> = ({
  isOpen,
  onClose,
  taskIndex,
  subtaskIndex,
  subtask,
  onEditSubtask
}) => {
  const [title, setTitle] = useState(subtask?.title || '');
  const [description, setDescription] = useState(subtask?.description || '');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (taskIndex !== null && subtaskIndex !== null) {
      onEditSubtask(taskIndex, subtaskIndex, {
        title,
        description,
      });
    }
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <div className="bg-white rounded-md shadow-md p-6 w-1/3">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">✏️</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
              Название:
            </label>
            <input
              type="text"
              id="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
              Описание:
            </label>
            <textarea
              id="description"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus-shadow-outline"
          >
            Сохранить
          </button>
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2 focus:outline-none focus-shadow-outline"
            onClick={onClose}
          >
            Отмена
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSubtaskModal;

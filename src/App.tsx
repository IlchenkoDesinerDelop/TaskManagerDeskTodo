import React, { useState, useEffect } from 'react';
import TaskList from './TaskList.tsx';
import AddTaskModal from './modal__manipulate/AddTaskModal.tsx';
import AddSubtaskModal from './modal__manipulate/AddSubtaskModal.tsx';
import EditTaskModal from './modal__manipulate/EditTaskModal.tsx';
import EditSubtaskModal from './modal__manipulate/EditSubtaskModal.tsx';
import SubtaskDetails from './SubtaskDetails.tsx';
import './index.css';
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

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddSubtaskModalOpen, setIsAddSubtaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isEditSubtaskModalOpen, setIsEditSubtaskModalOpen] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number | null>(null);
  const [currentSubtaskIndexes, setCurrentSubtaskIndexes] = useState<number[]>([]);
  const [expandedTasks, setExpandedTasks] = useState<boolean[]>([]);
  const [completedSubtasks, setCompletedSubtasks] = useState<Record<number, boolean[]>>({});
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(null);

  useEffect(() => {
    loadFromLocalStorage();
   }, []);

   useEffect(() => {
    saveToLocalStorage();
   }, [tasks, expandedTasks, completedSubtasks]);

  const saveToLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('expandedTasks', JSON.stringify(expandedTasks));
    localStorage.setItem('completedSubtasks', JSON.stringify(completedSubtasks));
  };

  const loadFromLocalStorage = () => {
    const savedTasks = localStorage.getItem('tasks');
    const savedExpandedTasks = localStorage.getItem('expandedTasks');
    const savedCompletedSubtasks = localStorage.getItem('completedSubtasks');

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    if (savedExpandedTasks) {
      setExpandedTasks(JSON.parse(savedExpandedTasks));
    }
    if (savedCompletedSubtasks) {
      setCompletedSubtasks(JSON.parse(savedCompletedSubtasks));
    }
  };

  const handleAddTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
    setExpandedTasks([...expandedTasks, false]);
    setCompletedSubtasks({
      ...completedSubtasks,
      [tasks.length]: Array(newTask.subtasks.length).fill(false)
    });
  };

  const handleAddSubtask = (newSubtask: Subtask) => {
    if (currentTaskIndex !== null) {
      const tasksCopy = [...tasks];
      let subtaskPointer = tasksCopy[currentTaskIndex];
      for (const index of currentSubtaskIndexes) {
        subtaskPointer = subtaskPointer.subtasks[index];
      }
      subtaskPointer.subtasks.push(newSubtask);
      setTasks(tasksCopy);
      saveToLocalStorage(); // Сохранение данных в localStorage после добавления подзадачи
    }
  };

  const handleEditTask = (updatedTask: Task) => {
    if (currentTaskIndex !== null) {
      const tasksCopy = [...tasks];
      tasksCopy[currentTaskIndex] = updatedTask;
      setTasks(tasksCopy);
    }
  };

  const handleEditSubtask = (updatedSubtask: Subtask) => {
    if (currentTaskIndex !== null) {
      const tasksCopy = [...tasks];
      let subtaskPointer = tasksCopy[currentTaskIndex];
      for (const index of currentSubtaskIndexes.slice(0, -1)) {
        subtaskPointer = subtaskPointer.subtasks[index];
      }
      subtaskPointer.subtasks[currentSubtaskIndexes[currentSubtaskIndexes.length - 1]] = updatedSubtask;
      setTasks(tasksCopy);
    }
  };

  const toggleTask = (taskIndex: number) => {
    const newExpandedTasks = [...expandedTasks];
    newExpandedTasks[taskIndex] = !newExpandedTasks[taskIndex];
    setExpandedTasks(newExpandedTasks);
  };

  const toggleSubtask = (taskIndex: number, subtaskIndex: number) => {
    const newCompletedSubtasks = { ...completedSubtasks };
    newCompletedSubtasks[taskIndex][subtaskIndex] = !newCompletedSubtasks[taskIndex][subtaskIndex];
    setCompletedSubtasks(newCompletedSubtasks);
  };

  const selectTask = (taskIndex: number) => {
    setSelectedTaskIndex(taskIndex);
  };

  const openAddSubtaskModal = (taskIndex: number, subtaskIndexes: number[] = []) => {
    setCurrentTaskIndex(taskIndex);
    setCurrentSubtaskIndexes(subtaskIndexes);
    setIsAddSubtaskModalOpen(true);
  };

  const openEditTaskModal = (taskIndex: number) => {
    setCurrentTaskIndex(taskIndex);
    setIsEditTaskModalOpen(true);
  };

  const openEditSubtaskModal = (taskIndex: number, subtaskIndexes: number[]) => {
    setCurrentTaskIndex(taskIndex);
    setCurrentSubtaskIndexes(subtaskIndexes);
    setIsEditSubtaskModalOpen(true);
  };

  const deleteTask = (taskIndex: number) => {
    const tasksCopy = [...tasks];
    tasksCopy.splice(taskIndex, 1);
    setTasks(tasksCopy);

    const newExpandedTasks = [...expandedTasks];
    newExpandedTasks.splice(taskIndex, 1);
    setExpandedTasks(newExpandedTasks);

    const newCompletedSubtasks = { ...completedSubtasks };
    delete newCompletedSubtasks[taskIndex];
    setCompletedSubtasks(newCompletedSubtasks);
  };

  const deleteSubtask = (taskIndex: number, subtaskIndexes: number[]) => {
    const tasksCopy = [...tasks];
    let subtaskPointer = tasksCopy[taskIndex];
    for (const index of subtaskIndexes.slice(0, -1)) {
      subtaskPointer = subtaskPointer.subtasks[index];
    }
    subtaskPointer.subtasks.splice(subtaskIndexes[subtaskIndexes.length - 1], 1);
    setTasks(tasksCopy);
    saveToLocalStorage(); // Сохранение данных в localStorage после удаления подзадачи
  };

  return (
    <div className="flex h-screen bg-gray-200">
      <div className="w-1/2 p-4">
        <button
          className="mb-4 p-2 bg-blue-500 text-white rounded"
          onClick={() => setIsAddTaskModalOpen(true)}
        >
          + Добавить задачу
        </button>
        <TaskList
          tasks={tasks}
          expandedTasks={expandedTasks}
          completedSubtasks={completedSubtasks}
          toggleTask={toggleTask}
          toggleSubtask={toggleSubtask}
          selectedTaskIndex={selectedTaskIndex}
          selectTask={selectTask}
          openAddTaskModal={() => setIsAddTaskModalOpen(true)}
          openEditTaskModal={openEditTaskModal}
          deleteTask={deleteTask}
          openAddSubtaskModal={openAddSubtaskModal}
          openEditSubtaskModal={openEditSubtaskModal}
          deleteSubtask={deleteSubtask}
          selectSubtask={(taskIndex: number, subtaskIndexes: number[]) => {
            setCurrentTaskIndex(taskIndex);
            setCurrentSubtaskIndexes(subtaskIndexes);
            setSelectedTaskIndex(taskIndex);
          }}
        />
      </div>
      <div className="w-1/2 p-4">
        {selectedTaskIndex !== null && (
          <SubtaskDetails
            task={tasks[selectedTaskIndex]}
            selectSubtask={(subtaskIndexes: number[]) => setCurrentSubtaskIndexes(subtaskIndexes)}
          />
        )}
      </div>
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAddTask={handleAddTask}
      />
      <AddSubtaskModal
        isOpen={isAddSubtaskModalOpen}
        onClose={() => setIsAddSubtaskModalOpen(false)}
        onAddSubtask={handleAddSubtask}
      />
      <EditTaskModal
      isOpen={isEditTaskModalOpen}
      onClose={() => setIsEditTaskModalOpen(false)}
      onEditTask={handleEditTask}
      task={currentTaskIndex !== null ? tasks[currentTaskIndex] : undefined}
    />
    <EditSubtaskModal
      isOpen={isEditSubtaskModalOpen}
      onClose={() => setIsEditSubtaskModalOpen(false)}
      onEditSubtask={handleEditSubtask}
      subtask={
        currentTaskIndex !== null
          ? currentSubtaskIndexes.reduce(
              (subtask, index) => subtask.subtasks[index],
              tasks[currentTaskIndex]
            )
          : undefined
      }
    />
  </div>
);
};

export default App;

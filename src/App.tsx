import React, { useState, useEffect } from 'react';
import TaskList from './TaskList.tsx';
import SubtaskDetails from './SubtaskDetails.tsx';
import AddTaskModal from './modal__manipulate/AddTaskModal.tsx';
import EditTaskModal from './modal__manipulate/EditTaskModal.tsx';
import AddSubtaskModal from './modal__manipulate/AddSubtaskModal.tsx';
import EditSubtaskModal from './modal__manipulate/EditSubtaskModal.tsx';
import './index.css';

interface Subtask {
  title: string;
  description?: string;
}

interface Task {
  title: string;
  description: string;
  subtasks: Subtask[];
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedSubtasks, setCompletedSubtasks] = useState<Record<number, boolean[]>>({});
  const [expandedTasks, setExpandedTasks] = useState<boolean[]>([]);
  const [selectedSubtask, setSelectedSubtask] = useState<Subtask | null>(null);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isAddSubtaskModalOpen, setIsAddSubtaskModalOpen] = useState(false);
  const [isEditSubtaskModalOpen, setIsEditSubtaskModalOpen] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number | null>(null);
  const [currentSubtaskIndex, setCurrentSubtaskIndex] = useState<number | null>(null);

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const initializeTestData = () => {
    const testTasks: Task[] = [
      {
        title: 'Задача 1',
        description: 'Описание задачи 1',
        subtasks: [
          { title: 'Подзадача 1.1' },
          { title: 'Подзадача 1.2' },
        ],
      },
      {
        title: 'Задача 2',
        description: 'Описание задачи 2',
        subtasks: [
          { title: 'Подзадача 2.1' },
          { title: 'Подзадача 2.2' },
        ],
      },
    ];

    setTasks(testTasks);
    setCompletedSubtasks(testTasks.map((task) => Array(task.subtasks.length).fill(false)));
    setExpandedTasks(Array(testTasks.length).fill(false));
    saveToLocalStorage(testTasks);
  };

  const loadFromLocalStorage = () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      setTasks(parsedTasks);
      setExpandedTasks(Array(parsedTasks.length).fill(false));
      setCompletedSubtasks(parsedTasks.map((task: Task) => Array(task.subtasks.length).fill(false)));
    } else {
      initializeTestData();
    }
  };

  const handleTaskSelect = (taskIndex: number) => {
    setSelectedTaskIndex(taskIndex);
  };

  const saveToLocalStorage = (tasksToSave: Task[]) => {
    localStorage.setItem('tasks', JSON.stringify(tasksToSave));
  };

  const toggleSubtask = (taskIndex: number, subtaskIndex: number) => {
    const newCompletedSubtasks = { ...completedSubtasks };
    newCompletedSubtasks[taskIndex][subtaskIndex] = !newCompletedSubtasks[taskIndex][subtaskIndex];
    setCompletedSubtasks(newCompletedSubtasks);

    const subtask = tasks[taskIndex].subtasks[subtaskIndex];
    setSelectedSubtask(newCompletedSubtasks[taskIndex][subtaskIndex] ? subtask : null);

    saveToLocalStorage(tasks);
  };

  const toggleTask = (taskIndex: number) => {
    const newExpandedTasks = [...expandedTasks];
    newExpandedTasks[taskIndex] = !newExpandedTasks[taskIndex];
    setExpandedTasks(newExpandedTasks);
    saveToLocalStorage(tasks);
  };

  const addTask = (newTask: Task) => {
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setExpandedTasks([...expandedTasks, false]);
    setCompletedSubtasks({
      ...completedSubtasks,
      [updatedTasks.length - 1]: Array(newTask.subtasks.length).fill(false),
    });
    setIsAddTaskModalOpen(false);
    saveToLocalStorage(updatedTasks);
  };

  const editTask = (taskIndex: number, updatedTask: Task) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = updatedTask;
    setTasks(updatedTasks);
    setIsEditTaskModalOpen(false);
    saveToLocalStorage(updatedTasks);
  };

  const deleteTask = (taskIndex: number) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(taskIndex, 1);
    setTasks(updatedTasks);
    setExpandedTasks(expandedTasks.filter((_, i) => i !== taskIndex));
    const newCompletedSubtasks = { ...completedSubtasks };
    delete newCompletedSubtasks[taskIndex];
    setCompletedSubtasks(newCompletedSubtasks);
    saveToLocalStorage(updatedTasks);
  };

  const addSubtask = (taskIndex: number, newSubtask: Subtask) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].subtasks.push(newSubtask);
    setTasks(updatedTasks);
    const updatedCompletedSubtasks = { ...completedSubtasks };
    if (!updatedCompletedSubtasks[taskIndex]) {
      updatedCompletedSubtasks[taskIndex] = [];
    }
    updatedCompletedSubtasks[taskIndex].push(false);
    setCompletedSubtasks(updatedCompletedSubtasks);
    setIsAddSubtaskModalOpen(false);
    saveToLocalStorage(updatedTasks);
  };

  const editSubtask = (taskIndex: number, subtaskIndex: number, updatedSubtask: Subtask) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].subtasks[subtaskIndex] = updatedSubtask;
    setTasks(updatedTasks);
    setIsEditSubtaskModalOpen(false);
    saveToLocalStorage(updatedTasks);
  };

  const deleteSubtask = (taskIndex: number, subtaskIndex: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].subtasks.splice(subtaskIndex, 1);
    setTasks(updatedTasks);
    const updatedCompletedSubtasks = { ...completedSubtasks };
    updatedCompletedSubtasks[taskIndex].splice(subtaskIndex, 1);
    setCompletedSubtasks(updatedCompletedSubtasks);
    saveToLocalStorage(updatedTasks);
  };

  const openAddTaskModal = () => {
    setIsAddTaskModalOpen(true);
  };

  const closeAddTaskModal = () => {
    setIsAddTaskModalOpen(false);
  };

  const openEditTaskModal = (taskIndex: number) => {
    setCurrentTaskIndex(taskIndex);
    setIsEditTaskModalOpen(true);
  };

  const closeEditTaskModal = () => {
    setCurrentTaskIndex(null);
    setIsEditTaskModalOpen(false);
  };

  const openAddSubtaskModal = (
    taskIndex: number) => {
      setCurrentTaskIndex(taskIndex);
      setIsAddSubtaskModalOpen(true);
    };
  
    const closeAddSubtaskModal = () => {
      setCurrentTaskIndex(null);
      setIsAddSubtaskModalOpen(false);
    };
  
    const openEditSubtaskModal = (taskIndex: number, subtaskIndex: number) => {
      setCurrentTaskIndex(taskIndex);
      setCurrentSubtaskIndex(subtaskIndex);
      setIsEditSubtaskModalOpen(true);
    };
  
    const closeEditSubtaskModal = () => {
      setCurrentTaskIndex(null);
      setCurrentSubtaskIndex(null);
      setIsEditSubtaskModalOpen(false);
    };
  
    return (
      <div className="flex h-screen bg-gray-200">
        <TaskList
          tasks={tasks}
          expandedTasks={expandedTasks}
          completedSubtasks={completedSubtasks}
          toggleTask={toggleTask}
          toggleSubtask={toggleSubtask}
          selectedTaskIndex={selectedTaskIndex}
          selectTask={handleTaskSelect}
          openAddTaskModal={openAddTaskModal}
          openEditTaskModal={openEditTaskModal}
          deleteTask={deleteTask}
          openAddSubtaskModal={openAddSubtaskModal}
          openEditSubtaskModal={openEditSubtaskModal}
          deleteSubtask={deleteSubtask}
        />
  
        <SubtaskDetails selectedSubtask={selectedSubtask} />
  
        <AddTaskModal
          isOpen={isAddTaskModalOpen}
          onClose={closeAddTaskModal}
          onAddTask={addTask}
        />
  
        <EditTaskModal
          isOpen={isEditTaskModalOpen}
          onClose={closeEditTaskModal}
          taskIndex={currentTaskIndex}
          task={tasks[currentTaskIndex]}
          onEditTask={editTask}
        />
  
        <AddSubtaskModal
          isOpen={isAddSubtaskModalOpen}
          onClose={closeAddSubtaskModal}
          taskIndex={currentTaskIndex}
          onAddSubtask={addSubtask}
        />
  
        <EditSubtaskModal
          isOpen={isEditSubtaskModalOpen}
          onClose={closeEditSubtaskModal}
          taskIndex={currentTaskIndex}
          subtaskIndex={currentSubtaskIndex}
          subtask={tasks[currentTaskIndex]?.subtasks[currentSubtaskIndex]}
          onEditSubtask={editSubtask}
        />
      </div>
    );
  };
  
  export default App;
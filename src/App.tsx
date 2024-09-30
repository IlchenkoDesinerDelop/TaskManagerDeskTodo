import React, { useState, useEffect } from 'react';
import TaskList from './TaskList.tsx';
import AddTaskModal from './modal__manipulate/AddTaskModal.tsx';
import AddSubtaskModal from './modal__manipulate/AddSubtaskModal.tsx';
import EditTaskModal from './modal__manipulate/EditTaskModal.tsx';
import EditSubtaskModal from './modal__manipulate/EditSubtaskModal.tsx';
import SubtaskDetails from './SubtaskDetails.tsx';
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
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(null);
  const [selectedSubtask, setSelectedSubtask] = useState<Subtask | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddSubtaskModalOpen, setIsAddSubtaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isEditSubtaskModalOpen, setIsEditSubtaskModalOpen] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number | null>(null);
  const [currentSubtaskIndex, setCurrentSubtaskIndex] = useState<number | null>(null);

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const initializeTestData = () => {
    const testTasks: Task[] = [
      {
        title: "Задача 1: Завершить проект",
        description: "Описание задачи 1: Необходимо завершить проект до конца месяца.",
        subtasks: [
          { title: "Подзадача 1.1: Написать код", description: "Написать код для основной функции." },
          { title: "Подзадача 1.2: Провести тестирование", description: "Провести тестирование написанного кода." },
          { title: "Подзадача 1.3: Подготовить документацию", description: "Подготовить документацию для проекта." }
        ]
      },
      // Другие задачи...
    ];

    setTasks(testTasks);
    setCompletedSubtasks(testTasks.reduce((acc, task, index) => {
      acc[index] = Array(task.subtasks.length).fill(false);
      return acc;
    }, {}));
    setExpandedTasks(Array(testTasks.length).fill(false));
    saveToLocalStorage(testTasks);
  };

  const loadFromLocalStorage = () => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      setTasks(parsedTasks);
      setExpandedTasks(Array(parsedTasks.length).fill(false));
      setCompletedSubtasks(parsedTasks.reduce((acc: Record<number, boolean[]>, task: Task, index: number) => {
        acc[index] = Array(task.subtasks.length).fill(false);
        return acc;
      }, {}));
    } else {
      initializeTestData();
    }
  };

  const saveToLocalStorage = (tasksToSave: Task[]) => {
    localStorage.setItem('tasks', JSON.stringify(tasksToSave));
  };

  const toggleSubtask = (taskIndex: number, subtaskIndex: number) => {
    const newCompletedSubtasks = { ...completedSubtasks };
    newCompletedSubtasks[taskIndex][subtaskIndex] = !newCompletedSubtasks[taskIndex][subtaskIndex];
    setCompletedSubtasks(newCompletedSubtasks);
    saveToLocalStorage(tasks);
  };

  const toggleTask = (taskIndex: number) => {
    const newExpandedTasks = [...expandedTasks];
    newExpandedTasks[taskIndex] = !newExpandedTasks[taskIndex];
    setExpandedTasks(newExpandedTasks);
    saveToLocalStorage(tasks);
  };

  const handleTaskEdit = (taskIndex: number, updatedTask: Task) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = updatedTask;
    setTasks(updatedTasks);
    saveToLocalStorage(updatedTasks);
  };

  const handleTaskDelete = (taskIndex: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== taskIndex);
    setTasks(updatedTasks);
    setExpandedTasks(expandedTasks.filter((_, i) => i !== taskIndex));
    const newCompletedSubtasks = { ...completedSubtasks };
    delete newCompletedSubtasks[taskIndex];
    setCompletedSubtasks(newCompletedSubtasks);
    saveToLocalStorage(updatedTasks);
  };

  const handleSubtaskEdit = (taskIndex: number, subtaskIndex: number, updatedSubtask: Subtask) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].subtasks[subtaskIndex] = updatedSubtask;
    setTasks(updatedTasks);
    saveToLocalStorage(updatedTasks);
  };

  const handleSubtaskDelete = (taskIndex: number, subtaskIndex: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].subtasks.splice(subtaskIndex, 1);
    setTasks(updatedTasks);
    setCompletedSubtasks({
      ...completedSubtasks,
      [taskIndex]: completedSubtasks[taskIndex].filter((_, i) => i !== subtaskIndex)
    });
    saveToLocalStorage(updatedTasks);
  };

  const handleSubtaskSelect = (taskIndex: number, subtaskIndex: number) => {
    const subtask = tasks[taskIndex].subtasks[subtaskIndex];
    setSelectedSubtask(subtask);
  };

  return (
    <div className="flex h-screen bg-gray-200">
      <div className="flex-1 flex flex-col p-4">
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
          selectTask={setSelectedTaskIndex}
          openAddTaskModal={() => setIsAddTaskModalOpen(true)}
          openEditTaskModal={(taskIndex) => {
            setCurrentTaskIndex(taskIndex);
            setIsEditTaskModalOpen(true);
          }}
          deleteTask={handleTaskDelete}
          openAddSubtaskModal={(taskIndex) => {
            setSelectedTaskIndex(taskIndex);
            setIsAddSubtaskModalOpen(true);
          }}
          openEditSubtaskModal={(taskIndex, subtaskIndex) => {
            setCurrentTaskIndex(taskIndex);
            setCurrentSubtaskIndex(subtaskIndex);
            setIsEditSubtaskModalOpen(true);
          }}
          deleteSubtask={handleSubtaskDelete}
          selectSubtask={handleSubtaskSelect}
        />
      </div>
      <SubtaskDetails selectedSubtask={selectedSubtask} />
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAddTask={(newTask) => {
          const updatedTasks = [...tasks, newTask];
          setTasks(updatedTasks);
          setExpandedTasks([...expandedTasks, false]);
          setCompletedSubtasks({ ...completedSubtasks, [updatedTasks.length - 1]: Array(newTask.subtasks.length).fill(false) });
          setIsAddTaskModalOpen(false);
          saveToLocalStorage(updatedTasks);
        }}
      />
      <AddSubtaskModal
        isOpen={isAddSubtaskModalOpen}
        onClose={() => setIsAddSubtaskModalOpen(false)}
        onAddSubtask={(newSubtask) => {
          if (selectedTaskIndex !== null) {
            const updatedTasks = [...tasks];
            updatedTasks[selectedTaskIndex].subtasks.push(newSubtask);
            setTasks(updatedTasks);
            setCompletedSubtasks({
              ...completedSubtasks,
              [selectedTaskIndex]: [...completedSubtasks[selectedTaskIndex], false]
            });
            setIsAddSubtaskModalOpen(false);
            saveToLocalStorage(updatedTasks);
          }
        }}
      />
      <EditTaskModal
        isOpen={isEditTaskModalOpen}
        onClose={() => setIsEditTaskModalOpen(false)}
        task={currentTaskIndex !== null ? tasks[currentTaskIndex] : null}
        onEditTask={(updatedTask) => {
          if (currentTaskIndex !== null) {
            handleTaskEdit(currentTaskIndex, updatedTask);
            setIsEditTaskModalOpen(false);
          }
        }}
      />

      <EditTaskModal
      isOpen={isEditTaskModalOpen}
      onClose={() => setIsEditTaskModalOpen(false)}
      task={currentTaskIndex !== null ? tasks[currentTaskIndex] : null}
      onEditTask={(updatedTask) => {
        if (currentTaskIndex !== null) {
          handleTaskEdit(currentTaskIndex, updatedTask);
          setIsEditTaskModalOpen(false);
        }
      }}
    />

    <EditSubtaskModal
     isOpen={isEditSubtaskModalOpen}
     onClose={() => setIsEditSubtaskModalOpen(false)}
     subtask={currentTaskIndex !== null && currentSubtaskIndex !== null ? tasks[currentTaskIndex].subtasks[currentSubtaskIndex] : null}
     onEditSubtask={(updatedSubtask) => { // Changed prop name
       if (currentTaskIndex !== null && currentSubtaskIndex !== null) {
         handleSubtaskEdit(currentSubtaskIndex, updatedSubtask);
         setIsEditSubtaskModalOpen(false);
       }
     }}
   />
   

      <AddSubtaskModal
        isOpen={isAddSubtaskModalOpen}
        onClose={() => setIsAddSubtaskModalOpen(false)}
        onAddSubtask={(newSubtask) => {
          if (selectedTaskIndex !== null) {
            const updatedTasks = [...tasks];
            updatedTasks[selectedTaskIndex].subtasks.push(newSubtask);
            setTasks(updatedTasks);
            setCompletedSubtasks({
              ...completedSubtasks,
              [selectedTaskIndex]: [...completedSubtasks[selectedTaskIndex], false]
            });
            setIsAddSubtaskModalOpen(false);
            saveToLocalStorage(updatedTasks);
          }
        }}
      />
    </div>
  );
};

export default App;
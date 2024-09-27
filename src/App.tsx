import React, { useState, useEffect } from 'react';
import TaskList from './TaskList.tsx';
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
  const [selectedSubtask, setSelectedSubtask] = useState<Subtask | null>(null);

  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  const initializeTestData = () => {
    const testTasks: Task[] = [];

    setTasks(testTasks);
    setCompletedSubtasks(testTasks.map(task => Array(task.subtasks.length).fill(false)));
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
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(null);
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
      />
      <SubtaskDetails selectedSubtask={selectedSubtask} />
    </div>
  );
};

export default App;

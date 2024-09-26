
import React, { useState, useEffect } from 'react';
import './index.css'; // Импорт вашего CSS-файла

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
  const [selectedSubtask, setSelectedSubtask] = useState<Subtask | null>(null); // Состояние для хранения выбранной подзадачи

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
      {
        title: "Задача 2: Подготовить отчёт",
        description: "Описание задачи 2: Подготовить отчёт о выполненной работе.",
        subtasks: [
          { title: "Подзадача 2.1: Собрать данные", description: "Собрать все необходимые данные для отчёта." },
          { title: "Подзадача 2.2: Написать выводы", description: "Написать выводы на основе собранных данных." }
        ]
      },
      {
        title: "Задача 3: Встретиться с командой",
        description: "Описание задачи 3: Провести встречу с командой для обсуждения текущих задач.",
        subtasks: []
      },
      {
        title: "Задача 4: Провести ревью кода",
        description: "Описание задачи 4: Провести ревью кода с командой.",
        subtasks: [
          { title: "Подзадача 4.1: Проверить новые функции", description: "Проверить все новые функции кода." },
          { title: "Подзадача 4.2: Написать комментарии", description: "Написать комментарии по коду." }
        ]
      },
      {
        title: "Задача 5: Обновить документацию",
        description: "Описание задачи 5: Обновить документацию проекта.",
        subtasks: []
      }
    ];

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
      initializeTestData(); // Инициализация, если нет данных
    }
  };

  const saveToLocalStorage = (tasksToSave: Task[]) => {
    localStorage.setItem('tasks', JSON.stringify(tasksToSave));
  };

  const toggleSubtask = (taskIndex: number, subtaskIndex: number) => {
    const newCompletedSubtasks = { ...completedSubtasks };
    newCompletedSubtasks[taskIndex][subtaskIndex] = !newCompletedSubtasks[taskIndex][subtaskIndex];
    setCompletedSubtasks(newCompletedSubtasks);

    // Устанавливаем выбранную подзадачу и её описание
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
      {/* Левая половина */}
      <div className="flex-1 flex flex-col bg-gray-300 p-4">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Список задач</h1>
        <ul className="list-none text-lg text-gray-700 space-y-4">
          {tasks.map((task, taskIndex) => (
            <li key={taskIndex}>
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
                          checked={`completedSubtasks[taskIndex]?.[subtaskIndex]  false`}
                          onChange={() => toggleSubtask(taskIndex, subtaskIndex)}
                          className="mr-2"
                        />
                        {subtask.title}
                      </label>
                    </li>))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
    
          {/* Правая половина */}
          <div>
            {selectedSubtask ? (
              <div >
                <h2 className="text-4xl font-bold text-blue-600">{selectedSubtask.title}</h2>
                <p>{selectedSubtask.description}</p>
              </div>
            ) : (
              <p className="text-gray-600">Выберите подзадачу для просмотра информации.</p>
            )}
          </div>
        </div>
      );
    };
    
    export default App;
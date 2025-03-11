import { Link } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import type { Task } from '../types';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';

interface TaskListProps {
  tasks: Task[];
  onStatusChange?: (taskId: string, status: 'completed' | 'incomplete') => void;
  onDelete?: (taskId: string) => void;
}

export default function TaskList({ tasks, onStatusChange, onDelete }: TaskListProps) {
  const { user } = useAuth();

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-center justify-between gap-x-6 py-5">
          <div className="min-w-0">
            <div className="flex items-start gap-x-3">
              <p
                className={clsx(
                  'text-sm font-semibold leading-6',
                  task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'
                )}
              >
                {task.title}
              </p>
              <p
                className={clsx(
                  'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                  task.status === 'completed'
                    ? 'bg-green-50 text-green-700 ring-green-600/20'
                    : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                )}
              >
                {task.status === 'completed' ? 'Tamamlandı' : 'Tamamlanmamış'}
              </p>
            </div>
            <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
              <p className="truncate">Atanan: {task.assignedUser.username}</p>
              <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                <circle cx={1} cy={1} r={1} />
              </svg>
              <p className="whitespace-nowrap">Oluşturan: {task.creator.username}</p>
            </div>
          </div>
          <div className="flex flex-none items-center gap-x-4">
            {(user?.role === 'admin' || task.assignedTo === user?.id) && (
              <>
                <button
                  onClick={() => onStatusChange?.(task.id, task.status === 'completed' ? 'incomplete' : 'completed')}
                  className={clsx(
                    'rounded-full p-1 hover:bg-gray-50',
                    task.status === 'completed' ? 'text-green-600' : 'text-gray-400'
                  )}
                >
                  <CheckCircleIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={() => onDelete?.(task.id)}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-50 hover:text-red-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </>
            )}
            <Link
              to={`/tasks/${task.id}`}
              className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
            >
              Görüntüle
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
} 
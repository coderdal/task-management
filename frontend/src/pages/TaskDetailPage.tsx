import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { tasks } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';
import Layout from '../components/Layout';
import TaskModal from '../components/TaskModal';
import type { CreateTaskInput } from '../types';

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: task, isLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: () => tasks.getById(id!),
  });

  const updateTaskMutation = useMutation({
    mutationFn: (data: Partial<CreateTaskInput>) => tasks.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      toast.success('Görev başarıyla güncellendi');
      setIsEditModalOpen(false);
    },
    onError: () => {
      toast.error('Görev güncellenirken bir hata oluştu');
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: tasks.delete,
    onSuccess: () => {
      navigate('/tasks');
      toast.success('Görev başarıyla silindi');
    },
    onError: () => {
      toast.error('Görev silinirken bir hata oluştu');
    },
  });

  const handleStatusChange = (status: 'completed' | 'incomplete') => {
    updateTaskMutation.mutate({ status });
  };

  const handleDelete = () => {
    if (window.confirm('Görev silinecektir. Emin misiniz?')) {
      deleteTaskMutation.mutate(id!);
    }
  };

  const handleEdit = (data: CreateTaskInput) => {
    updateTaskMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      </Layout>
    );
  }

  if (!task) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] flex-col items-center justify-center">
          <h3 className="text-lg font-semibold">Görev bulunamadı</h3>
          <button
            onClick={() => navigate('/tasks')}
            className="mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
          >
            Görevler'e dön
          </button>
        </div>
      </Layout>
    );
  }

  const canEdit = user?.role === 'admin' || task.assignedTo === user?.id;

  return (
    <Layout>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {task.title}
          </h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span
                className={clsx(
                  'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                  task.status === 'completed'
                    ? 'bg-green-50 text-green-700 ring-green-600/20'
                    : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                )}
              >
                {task.status === 'completed' ? 'Tamamlandı' : 'Tamamlanmamış'}
              </span>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              Atanan: {task.assignedUser.username}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              Oluşturan: {task.creator.username}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              Oluşturulma Tarihi: {new Date(task.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          {canEdit && (
            <>
              <span className="hidden sm:block">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Düzenle
                </button>
              </span>

              <span className="ml-3 hidden sm:block">
                <button
                  type="button"
                  onClick={() => handleStatusChange(task.status === 'completed' ? 'incomplete' : 'completed')}
                  className={clsx(
                    'inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm',
                    task.status === 'completed'
                      ? 'bg-yellow-600 hover:bg-yellow-500'
                      : 'bg-green-600 hover:bg-green-500'
                  )}
                >
                  {task.status === 'completed' ? 'Tamamlanmamış' : 'Tamamlandı'}
                </button>
              </span>

              <span className="ml-3 hidden sm:block">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                >
                  Sil
                </button>
              </span>
            </>
          )}
        </div>
      </div>

      <div className="mt-8 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Açıklama</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{task.description}</dd>
          </div>
        </dl>
      </div>

      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEdit}
        isLoading={updateTaskMutation.isPending}
        initialData={task}
        title="Görev Düzenle"
      />
    </Layout>
  );
} 
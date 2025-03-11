import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { tasks } from '../services/api';
import TaskList from '../components/TaskList';
import TaskModal from '../components/TaskModal';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import type { CreateTaskInput } from '../types';
import { FunnelIcon, PlusIcon } from '@heroicons/react/24/outline';

const statusOptions = [
  { value: 'all', label: 'Tüm Görevler' },
  { value: 'incomplete', label: 'Tamamlanmamış' },
  { value: 'completed', label: 'Tamamlandı' },
];

export default function TasksPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'completed' | 'incomplete'>('all');
  const queryClient = useQueryClient();

  const { data: taskList = [], isLoading } = useQuery({
    queryKey: ['tasks', selectedStatus],
    queryFn: () => tasks.getAll(selectedStatus !== 'all' ? { status: selectedStatus } : undefined),
  });

  const createTaskMutation = useMutation({
    mutationFn: tasks.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Görev başarıyla oluşturuldu');
      setIsCreateModalOpen(false);
    },
    onError: () => {
      toast.error('Görev oluşturulurken bir hata oluştu');
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'completed' | 'incomplete' }) =>
      tasks.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Görev başarıyla güncellendi');
    },
    onError: () => {
      toast.error('Görev güncellenirken bir hata oluştu');
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: tasks.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Görev başarıyla silindi');
    },
    onError: () => {
      toast.error('Görev silinirken bir hata oluştu');
    },
  });

  const handleCreateTask = (data: CreateTaskInput) => {
    createTaskMutation.mutate(data);
  };

  const handleStatusChange = (taskId: string, status: 'completed' | 'incomplete') => {
    updateTaskMutation.mutate({ id: taskId, status });
  };

  const handleDelete = (taskId: string) => {
    if (window.confirm('Görev silinecektir. Emin misiniz?')) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  return (
    <Layout>
      <div className="rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold leading-6 text-gray-900">Görevler</h1>
              <p className="mt-2 text-sm text-gray-700">
                Sistemdeki tüm görevlerin listesi
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                Yeni Görev
              </button>
            </div>
          </div>

          <div className="mt-8 sm:flex sm:items-center">
            <div className="relative max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FunnelIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as typeof selectedStatus)}
                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <div className="min-w-full">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                </div>
              ) : taskList.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                  <h3 className="text-sm font-semibold text-gray-900">Hiç görev yok</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedStatus === 'all'
                      ? 'Yeni bir görev oluşturun.'
                      : `Hiç ${selectedStatus} görev bulunamadı.`}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="mt-6 inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                    Yeni Görev
                  </button>
                </div>
              ) : (
                <TaskList
                  tasks={taskList}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        isLoading={createTaskMutation.isPending}
      />
    </Layout>
  );
} 
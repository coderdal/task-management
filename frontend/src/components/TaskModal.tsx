import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { users } from '../services/api';
import type { CreateTaskInput } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskInput) => void;
  isLoading?: boolean;
  initialData?: Partial<CreateTaskInput>;
  title?: string;
}

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialData,
  title = 'Görev Oluştur',
}: TaskModalProps) {
  const [formData, setFormData] = useState<CreateTaskInput>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'incomplete',
    assignedTo: initialData?.assignedTo || '',
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        description: '',
        status: 'incomplete',
        assignedTo: '',
      });
    } else if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'incomplete',
        assignedTo: initialData.assignedTo || '',
      });
    }
  }, [isOpen, initialData]);

  const { data: userList = [] } = useQuery({
    queryKey: ['users'],
    queryFn: users.getAll,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-lg transform rounded-xl bg-white shadow-2xl transition-all">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Kapat</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="p-6">
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900 mb-6">
                    {title}
                  </Dialog.Title>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                        Görev Adı
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          id="title"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                          className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                        Açıklama
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="description"
                          rows={3}
                          required
                          value={formData.description}
                          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                          className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="assignedTo" className="block text-sm font-medium leading-6 text-gray-900">
                        Atanan
                      </label>
                      <div className="mt-2">
                        <select
                          id="assignedTo"
                          required
                          value={formData.assignedTo}
                          onChange={(e) => setFormData((prev) => ({ ...prev, assignedTo: e.target.value }))}
                          className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                          <option value="">Bir kullanıcı seçin</option>
                          {userList.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.username}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                        Durum
                      </label>
                      <div className="mt-2">
                        <select
                          id="status"
                          required
                          value={formData.status}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              status: e.target.value as 'incomplete' | 'completed',
                            }))
                          }
                          className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        >
                          <option value="incomplete">Tamamlanmamış</option>
                          <option value="completed">Tamamlandı</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-x-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Vazgeç
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                      >
                        {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 
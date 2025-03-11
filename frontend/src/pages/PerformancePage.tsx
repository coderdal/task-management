import { useQuery } from '@tanstack/react-query';
import { tasks, users } from '../services/api';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function PerformancePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Admin olmayan kullanıcılara izin verme
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/tasks');
    }
  }, [user, navigate]);

  const { data: taskList = [] } = useQuery({
    queryKey: ['tasks', 'all'],
    queryFn: () => tasks.getAll(),
  });

  const { data: userList = [] } = useQuery({
    queryKey: ['users'],
    queryFn: users.getAll,
  });

  // Kullanıcı istatistikleri
  const userStats = userList.map(user => {
    const userTasks = taskList.filter(task => task.assignedTo === user.id);
    const completedTasks = userTasks.filter(task => task.status === 'completed');
    const incompleteTasks = userTasks.filter(task => task.status === 'incomplete');
    
    const completionRate = userTasks.length > 0 
      ? (completedTasks.length / userTasks.length) * 100 
      : 0;

    return {
      ...user,
      totalTasks: userTasks.length,
      completedTasks: completedTasks.length,
      incompleteTasks: incompleteTasks.length,
      completionRate: Math.round(completionRate),
    };
  });

  // Toplam istatistikler
  const totalTasks = taskList.length;
  const completedTasks = taskList.filter(task => task.status === 'completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <Layout>
      <div className="rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-6">
            Performans Analizi
          </h2>

          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="overflow-hidden rounded-lg bg-indigo-50 px-4 py-5 sm:p-6">
              <dt className="truncate text-sm font-medium text-indigo-600">Toplam Görev</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-indigo-900">{totalTasks}</dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-green-50 px-4 py-5 sm:p-6">
              <dt className="truncate text-sm font-medium text-green-600">Tamamlanan Görevler</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-900">{completedTasks}</dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-blue-50 px-4 py-5 sm:p-6">
              <dt className="truncate text-sm font-medium text-blue-600">Toplam Tamamlama Oranı</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-blue-900">{completionRate}%</dd>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Kullanıcı Performansı</h3>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Kullanıcı
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Toplam Görev
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Tamamlanan
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Tamamlanmamış
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Tamamlama Oranı
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {userStats.map((userStat) => (
                    <tr key={userStat.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {userStat.username}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {userStat.totalTasks}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-green-600">
                        {userStat.completedTasks}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-yellow-600">
                        {userStat.incompleteTasks}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-x-2">
                          <div className="flex w-24 h-2 rounded-full bg-gray-200 overflow-hidden">
                            <div
                              className="bg-indigo-600"
                              style={{ width: `${userStat.completionRate}%` }}
                            />
                          </div>
                          <span>{userStat.completionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 
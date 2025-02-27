import React from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Backenddan bitta o'qituvchi ma'lumotini olish
const fetchSingleTeacher = async (id: string) => {
  const response = await axios.get(`http://217.114.4.62:30300/api/teachers/one/${id}`);
  return response.data;
};

const User = () => {
  const { id } = useParams(); // URL'dan :id ni olish

  const { isLoading, isError, data, isSuccess } = useQuery({
    queryKey: ['teacher', id],
    queryFn: () => fetchSingleTeacher(id || ''),
  });

  // Toast xabarlari
  React.useEffect(() => {
    if (isLoading) {
      toast.loading('Yuklanmoqda...', { id: 'teacherRead' });
    }
    if (isError) {
      toast.error("Ma'lumotlarni olishda xatolik!", { id: 'teacherRead' });
    }
    if (isSuccess) {
      toast.success('Ma\'lumotlar muvaffaqiyatli yuklandi!', { id: 'teacherRead' });
    }
  }, [isLoading, isError, isSuccess]);

  return (
      <div className="w-full p-4">
        <h2 className="text-2xl font-semibold mb-6 dark:text-white">
          O'qituvchi ma'lumotlari
        </h2>
        <div className="w-full max-w-2xl bg-base-100 rounded-lg shadow p-6">
          {isLoading ? (
              <div className="flex flex-col gap-4">
                <div className="w-full h-10 skeleton dark:bg-neutral"></div>
                <div className="w-full h-10 skeleton dark:bg-neutral"></div>
                <div className="w-full h-10 skeleton dark:bg-neutral"></div>
                <div className="w-full h-10 skeleton dark:bg-neutral"></div>
                <div className="w-full h-10 skeleton dark:bg-neutral"></div>
                <div className="w-full h-10 skeleton dark:bg-neutral"></div>
              </div>
          ) : isError ? (
              <div className="text-error">Ma'lumotlarni yuklashda xatolik!</div>
          ) : isSuccess && data ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Ism</span>
                  <span className="font-semibold">{data.firstName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Familiya</span>
                  <span className="font-semibold">{data.lastName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Telefon</span>
                  <span className="font-semibold">{data.phone}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">PINFL</span>
                  <span className="font-semibold">{data.pinfl}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Ilmiy daraja</span>
                  <span className="font-semibold">{data.degree}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Lavozim</span>
                  <span className="font-semibold">{data.position}</span>
                </div>
              </div>
          ) : null}
        </div>
      </div>
  );
};

export default User;
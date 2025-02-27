import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const TeacherFaceImages = () => {
    const { teacherId } = useParams(); // URL'dan teacherId ni olish
    const navigate = useNavigate();

    // Barcha face images ni olish (GET /api/v1/teacher/face/list/{teacherId})
    const { isLoading, isError, data: faceList, isSuccess } = useQuery({
        queryKey: ['teacherFaces', teacherId],
        queryFn: () => fetchTeacherFaces(teacherId || ''),
    });

    // Har bir rasm ID si orqali rasmni olish uchun funksiya
    const fetchImage = async (imgId: string) => {
        try {
            const response = await axios.get(`http://217.114.4.62:30300/api/v1/file/view/${imgId}`, {
                responseType: 'blob', // Rasmni binary formatda olish uchun
            });
            return URL.createObjectURL(response.data);
        } catch (error) {
            toast.error('Rasmni yuklashda xatolik yuz berdi!');
            throw error;
        }
    };

    // Barcha face images ni olish funksiyasi
    const fetchTeacherFaces = async (teacherId: string) => {
        const response = await axios.get(`http://217.114.4.62:30300/api/v1/teacher/face/list/${teacherId}`);
        return response.data;
    };

    // Toast xabarlari
    React.useEffect(() => {
        if (isLoading) {
            toast.loading('Yuklanmoqda...', { id: 'faceList' });
        }
        if (isError) {
            toast.error('Yuzlar ro\'yxatini olishda xatolik!', { id: 'faceList' });
        }
        if (isSuccess) {
            toast.success('Yuzlar ro\'yxati muvaffaqiyatli yuklandi!', { id: 'faceList' });
        }
    }, [isLoading, isError, isSuccess]);

    return (
        <div className="w-full p-4">
            <h1 className="text-2xl font-semibold mb-6 dark:text-white">
                Teacher Faces | teacher face images management module
            </h1>
            <div className="w-full max-w-4xl bg-base-100 rounded-lg shadow p-6">
                {isLoading ? (
                    <div className="flex flex-col gap-4">
                        <div className="w-full h-20 skeleton dark:bg-neutral"></div>
                        <div className="w-full h-20 skeleton dark:bg-neutral"></div>
                        <div className="w-full h-20 skeleton dark:bg-neutral"></div>
                    </div>
                ) : isError ? (
                    <div className="text-error">Yuzlar ro\'yxatini yuklashda xatolik!</div>
                ) : isSuccess && faceList && faceList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {faceList.map((face: any) => (
                            <div key={face.id} className="border rounded-lg p-4 shadow-md">
                                <h3 className="text-lg font-semibold mb-2">Yuz ID: {face.id}</h3>
                                {face.imgId ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <img
                                            src={face.imageUrl || ''} // Agar imageUrl mavjud bo'lmasa, bo'sh qoldirish
                                            alt={`Teacher face ${face.id}`}
                                            className="w-48 h-48 object-cover rounded"
                                            onError={(e) => {
                                                // Agar imageUrl bo'lmasa, imgId orqali rasmni yuklash
                                                fetchImage(face.imgId).then((url) => {
                                                    (e.target as HTMLImageElement).src = url;
                                                });
                                            }}
                                        />
                                        <button
                                            onClick={() => navigate(`/face/view/${face.imgId}`)} // Rasmni katta ko'rish uchun yo'nalish
                                            className="btn btn-sm btn-primary"
                                        >
                                            Rasmni ko'rish
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Rasm mavjud emas</p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Hech qanday yuz topilmadi.</p>
                )}
            </div>
        </div>
    );
};

export default TeacherFaceImages;
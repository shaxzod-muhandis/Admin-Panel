import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { HiOutlineXMark } from 'react-icons/hi2';
import axios from 'axios';

interface AddDataProps {
  slug: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId?: string | null;
  initialData?: any;
}

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  pinfl: string;
  degree: string;
  position: string;
}

const createTeacher = async (data: FormData) => {
  const response = await axios.post('http://217.114.4.62:30300/api/teachers/create', data);
  return response.data;
};

const updateTeacher = async ({ id, data }: { id: string; data: FormData }) => {
  const response = await axios.put('http://217.114.4.62:30300/api/teachers/update', {
    id,
    ...data,
  });
  return response.data;
};

const AddData: React.FC<AddDataProps> = ({ slug, isOpen, setIsOpen, userId, initialData }) => {
  const [showModal, setShowModal] = React.useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      phone: '',
      pinfl: '',
      degree: '',
      position: '',
    },
  });

  // Sync modal state and populate form when isOpen or initialData changes
  React.useEffect(() => {
    setShowModal(isOpen);
    if (isOpen && initialData) {
      setValue('firstName', initialData.firstName || '');
      setValue('lastName', initialData.lastName || '');
      setValue('phone', initialData.phone || '');
      setValue('pinfl', initialData.pinfl || '');
      setValue('degree', initialData.degree || '');
      setValue('position', initialData.position || '');
    } else if (isOpen && !initialData) {
      reset({
        firstName: '',
        lastName: '',
        phone: '',
        pinfl: '',
        degree: '',
        position: '',
      });
    }
  }, [isOpen, initialData, setValue, reset]);

  const createMutation = useMutation({
    mutationFn: createTeacher,
    onSuccess: () => {
      toast.success('Yangi o\'qituvchi muvaffaqiyatli qo‘shildi!');
      queryClient.invalidateQueries({ queryKey: ['allteachers'] });
      reset();
      setShowModal(false);
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Xatolik: ${error.message || 'Noma\'lum xatolik'}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTeacher,
    onSuccess: () => {
      toast.success('O\'qituvchi muvaffaqiyatli yangilandi!');
      queryClient.invalidateQueries({ queryKey: ['allteachers'] });
      reset();
      setShowModal(false);
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Xatolik: ${error.message || 'Noma\'lum xatolik'}`);
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (userId) {
      updateMutation.mutate({ id: userId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (slug === 'teacher') {
    return (
        <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-black/75 z-[99]">
          <div
              className={`w-[80%] xl:w-[50%] rounded-lg p-7 bg-base-100 relative transition duration-300 flex flex-col items-stretch gap-5 ${
                  showModal ? 'translate-y-0' : 'translate-y-full'
              } ${showModal ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="w-full flex justify-between pb-5 border-b border-base-content border-opacity-30">
              <button
                  onClick={() => {
                    setShowModal(false);
                    setIsOpen(false);
                    reset();
                  }}
                  className="absolute top-5 right-3 btn btn-ghost btn-circle"
              >
                <HiOutlineXMark className="text-xl font-bold" />
              </button>
              <span className="text-2xl font-bold">
              {userId ? 'O\'qituvchini tahrirlash' : 'Yangi o\'qituvchi qo‘shish'}
            </span>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              <div className="form-control w-full">
                <input
                    type="text"
                    placeholder="Ism"
                    className={`input input-bordered w-full ${errors.firstName ? 'input-error' : ''}`}
                    {...register('firstName', {
                      required: 'Ism kiritish majburiy!',
                      minLength: { value: 2, message: 'Ism kamida 2 harfdan iborat bo‘lishi kerak!' },
                    })}
                />
                {errors.firstName && (
                    <span className="text-error text-sm mt-1">{errors.firstName.message}</span>
                )}
              </div>
              <div className="form-control w-full">
                <input
                    type="text"
                    placeholder="Familiya"
                    className={`input input-bordered w-full ${errors.lastName ? 'input-error' : ''}`}
                    {...register('lastName', {
                      required: 'Familiya kiritish majburiy!',
                      minLength: { value: 2, message: 'Familiya kamida 2 harfdan iborat bo‘lishi kerak!' },
                    })}
                />
                {errors.lastName && (
                    <span className="text-error text-sm mt-1">{errors.lastName.message}</span>
                )}
              </div>
              <div className="form-control w-full">
                <input
                    type="text"
                    placeholder="Telefon"
                    className={`input input-bordered w-full ${errors.phone ? 'input-error' : ''}`}
                    {...register('phone', {
                      required: 'Telefon raqami kiritish majburiy!',
                      pattern: {
                        value: /^\+998\d{9}$/,
                        message: 'Telefon raqami +998 bilan boshlanib, 9 ta raqamdan iborat bo‘lishi kerak!',
                      },
                    })}
                />
                {errors.phone && (
                    <span className="text-error text-sm mt-1">{errors.phone.message}</span>
                )}
              </div>
              <div className="form-control w-full">
                <input
                    type="text"
                    placeholder="PINFL"
                    className={`input input-bordered w-full ${errors.pinfl ? 'input-error' : ''}`}
                    {...register('pinfl', {
                      required: 'PINFL kiritish majburiy!',
                      pattern: { value: /^\d{14}$/, message: 'PINFL 14 raqamdan iborat bo‘lishi kerak!' },
                    })}
                />
                {errors.pinfl && (
                    <span className="text-error text-sm mt-1">{errors.pinfl.message}</span>
                )}
              </div>
              <div className="form-control w-full">
                <input
                    type="text"
                    placeholder="Ilmiy daraja"
                    className={`input input-bordered w-full ${errors.degree ? 'input-error' : ''}`}
                    {...register('degree', {
                      required: 'Ilmiy daraja kiritish majburiy!',
                      minLength: { value: 2, message: 'Ilmiy daraja kamida 2 harfdan iborat bo‘lishi kerak!' },
                    })}
                />
                {errors.degree && (
                    <span className="text-error text-sm mt-1">{errors.degree.message}</span>
                )}
              </div>
              <div className="form-control w-full">
                <input
                    type="text"
                    placeholder="Lavozim"
                    className={`input input-bordered w-full ${errors.position ? 'input-error' : ''}`}
                    {...register('position', {
                      required: 'Lavozim kiritish majburiy!',
                      minLength: { value: 2, message: 'Lavozim kamida 2 harfdan iborat bo‘lishi kerak!' },
                    })}
                />
                {errors.position && (
                    <span className="text-error text-sm mt-1">{errors.position.message}</span>
                )}
              </div>
              <button
                  type="submit"
                  className="mt-5 btn btn-primary btn-block col-span-full font-semibold" // Removed disabled condition
              >
                {createMutation.isPending || updateMutation.isPending
                    ? 'Yuborilmoqda...'
                    : userId
                        ? 'Yangilash'
                        : 'Yuborish'}
              </button>
            </form>
          </div>
        </div>
    );
  }

  return null;
};

export default AddData;
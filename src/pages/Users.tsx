import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../components/DataTable';
import toast from 'react-hot-toast';
import AddData from '../components/AddData';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const fetchTeachers = async (page: number, size: number) => {
  const response = await fetch('http://217.114.4.62:30300/api/teachers/filter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "keyword": "",
      "filter": {},
      "paging": {
        "page": page,
        "size": size
      }
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch teachers');
  }

  return response.json();
};

const deleteTeacher = async (id: string) => {
  const response = await axios.delete(`http://217.114.4.62:30300/api/teachers/delete/${id}`);
  return response.data;
};

const Teachers = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = React.useState<string | null>(null);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [pageSize] = React.useState(10);
  const queryClient = useQueryClient();

  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ['allteachers', currentPage, pageSize],
    queryFn: () => fetchTeachers(currentPage, pageSize),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTeacher,
    onSuccess: () => {
      toast.success('O\'qituvchi muvaffaqiyatli o\'chirildi!');
      queryClient.invalidateQueries({ queryKey: ['allteachers'] });
    },
    onError: (error: any) => {
      toast.error(`Xatolik: ${error.message || 'O\'chirishda xatolik yuz berdi'}`);
    },
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'firstName',
      headerName: 'Name',
      minWidth: 220,
      flex: 1,
      renderCell: (params) => (
          <div className="flex gap-3 items-center">
            <div className="avatar">
              <div className="w-6 xl:w-9 rounded-full">
                <img
                    src={params.row.img || '/Portrait_Placeholder.png'}
                    alt="teacher-picture"
                />
              </div>
            </div>
            <span className="mb-0 pb-0 leading-none">
            {params.row.firstName || 'N/A'} {params.row.lastName || ''}
          </span>
          </div>
      ),
    },
    {
      field: 'phone',
      type: 'string',
      headerName: 'Phone',
      minWidth: 120,
      flex: 1,
      renderCell: (params) => <span>{params.row.phone || 'N/A'}</span>,
    },
    {
      field: 'pinfl',
      type: 'string',
      headerName: 'PINFL',
      minWidth: 150,
      flex: 1,
      renderCell: (params) => <span>{params.row.pinfl || 'N/A'}</span>,
    },
    {
      field: 'degree',
      type: 'string',
      headerName: 'Degree',
      minWidth: 150,
      flex: 1,
      renderCell: (params) => <span>{params.row.degree || 'N/A'}</span>,
    },
    {
      field: 'position',
      type: 'string',
      headerName: 'Position',
      minWidth: 150,
      flex: 1,
      renderCell: (params) => <span>{params.row.position || 'N/A'}</span>,
    },
  ];

  React.useEffect(() => {
    if (isLoading) {
      toast.loading('Loading...', { id: 'promiseTeachers' });
    }
    if (isError) {
      toast.error('Error while getting the data!', { id: 'promiseTeachers' });
    }
    if (isSuccess) {
      toast.success('Got the data successfully!', { id: 'promiseTeachers' });
    }
  }, [isError, isLoading, isSuccess]);

  const totalPages = data?.paging?.totalPages || 1;
  const totalItems = data?.paging?.totalItems || 0;

  const handleDelete = (id: string) => {
    if (window.confirm('Haqiqatan ham bu o\'qituvchini o\'chirmoqchimisiz?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
      <div className="w-full p-0 m-0">
        <div className="w-full flex flex-col items-stretch gap-3">
          <div className="w-full flex justify-between mb-5">
            <div className="flex gap-1 justify-start flex-col items-start">
              <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
                Teachers
              </h2>
              {data?.content && data.content.length > 0 && (
                  <span className="text-neutral dark:text-neutral-content font-medium text-base">
                {totalItems} Teachers Found (Page {currentPage + 1} of {totalPages})
              </span>
              )}
            </div>
            <button
                onClick={() => {
                  setSelectedTeacherId(null);
                  setIsOpen(true);
                }}
                className={`btn ${isLoading ? 'btn-disabled' : 'btn-primary'}`}
            >
              Add New Teacher +
            </button>
          </div>

          {isLoading ? (
              <DataTable slug="teachers" columns={columns} rows={[]} includeActionColumn={true} />
          ) : isSuccess ? (
              <DataTable
                  slug="teachers"
                  columns={columns}
                  rows={data?.content || []}
                  includeActionColumn={true}
                  setIsOpen={setIsOpen}
                  setSelectedTeacherId={setSelectedTeacherId}
                  onDelete={handleDelete}
              />
          ) : (
              <>
                <DataTable slug="teachers" columns={columns} rows={[]} includeActionColumn={true} />
                <div className="w-full flex justify-center">Error while getting the data!</div>
              </>
          )}

          {isSuccess && totalPages > 1 && (
              <div className="w-full flex justify-center gap-4 mt-4">
                <button
                    className={`btn ${currentPage === 0 ? 'btn-disabled' : 'btn-primary'}`}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    disabled={currentPage === 0}
                >
                  Previous
                </button>
                <span className="self-center">
              Page {currentPage + 1} of {totalPages}
            </span>
                <button
                    className={`btn ${currentPage >= totalPages - 1 ? 'btn-disabled' : 'btn-primary'}`}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={currentPage >= totalPages - 1}
                >
                  Next
                </button>
              </div>
          )}

          {isOpen && (
              <AddData
                  slug="teacher"
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  userId={selectedTeacherId}
                  initialData={
                    selectedTeacherId && data?.content
                        ? data.content.find((teacher: any) => teacher.id.toString() === selectedTeacherId)
                        : undefined
                  }
              />
          )}
        </div>
      </div>
  );
};

export default Teachers;
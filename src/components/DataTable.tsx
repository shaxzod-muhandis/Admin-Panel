import React from 'react';
import {DataGrid, GridColDef, GridToolbar} from '@mui/x-data-grid';
import {Link} from 'react-router-dom';
import { HiOutlineEye, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import toast from 'react-hot-toast';

interface DataTableProps {
    columns: GridColDef[];
    rows: object[];
    slug: string;
    includeActionColumn: boolean;
    setIsOpen?: (value: boolean) => void;
    setSelectedTeacherId?: (id: string | null) => void;
    onDelete?: (id: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({
                                                 columns,
                                                 rows,
                                                 includeActionColumn,
                                                 setIsOpen,
                                                 setSelectedTeacherId,
                                                 onDelete,
                                             }) => {
    const actionColumn: GridColDef = {
        field: 'action',
        headerName: 'Action',
        minWidth: 200,
        flex: 1,
        renderCell: (params) => (
            <div className="flex items-center gap-2">
                <Link to={`/user/${params.row.id}`}
                    className="btn btn-square btn-ghost"
                    title="View"
                >
                    <HiOutlineEye/>
                </Link>
                <button
                    onClick={() => {
                        if (setIsOpen && setSelectedTeacherId) {
                            setSelectedTeacherId(params.row.id.toString());
                            setIsOpen(true);
                        } else {
                            toast('Jangan diedit!', {icon: '😠'});
                        }
                    }}
                    className="btn btn-square btn-ghost"
                    title="Edit"
                >
                    <HiOutlinePencilSquare/>
                </button>
                <button
                    onClick={() => {
                        if (onDelete) {
                            onDelete(params.row.id.toString());
                        } else {
                            toast('Jangan dihapus!', {icon: '😠'});
                        }
                    }}
                    className="btn btn-square btn-ghost"
                    title="Delete"
                >
                    <HiOutlineTrash/>
                </button>
            </div>
        ),
    };

    if (includeActionColumn) {
        return (
            <div className="w-full bg-base-100 text-base-content">
            <DataGrid
                    className="dataGrid p-0 xl:p-3 w-full bg-base-100 text-white"
                    rows={rows}
                    columns={[...columns, actionColumn]}
                    getRowHeight={() => 'auto'}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 10 },
                        },
                    }}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                            quickFilterProps: { debounceMs: 500 },
                        },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    disableColumnFilter
                    disableDensitySelector
                    disableColumnSelector
                />
            </div>
        );
    } else {
        return (
            <div className="w-full bg-base-100 text-base-content">
                <DataGrid
                    className="dataGrid p-0 xl:p-3 w-full bg-base-100 text-white"
                    rows={rows}
                    columns={columns}
                    getRowHeight={() => 'auto'}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 10 },
                        },
                    }}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                            quickFilterProps: { debounceMs: 500 },
                        },
                    }}
                    pageSizeOptions={[5]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    disableColumnFilter
                    disableDensitySelector
                    disableColumnSelector
                />
            </div>
        );
    }
};

export default DataTable;
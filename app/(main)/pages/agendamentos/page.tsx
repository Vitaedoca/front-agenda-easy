'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react';
import { appointmentsService } from '../../../../service/Appointments'; // Assuming this is your API call

const Profissionais = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointments, setSelectedAppointments] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    // Fetch appointments data when the component mounts
    useEffect(() => {
        // Create an instance of the appointmentsService
        const service = new appointmentsService();
        
        // Call the listarTodos method to fetch the data
        service.listarTodos()
            .then((response) => {
                setAppointments(response.data); // Set the appointments data from the response
            })
            .catch((error) => {
                console.error('Error fetching appointments:', error);
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Could not fetch appointments.' });
            });
    }, []);

    const userNameBodyTemplate = (rowData: any) => {
        return (
            <>
                <span className="p-column-title">E-mail</span>
                {rowData.userName}
            </>
        );
    };

    const professionalNameBodyTemplate = (rowData: any) => {
        return (
            <>
                <span className="p-column-title">Professional Name</span>
                {rowData.professionalName}
            </>
        );
    };

    const serviceNameBodyTemplate = (rowData: any) => {
        return (
            <>
                <span className="p-column-title">Service Name</span>
                {rowData.serviceName || 'N/A'}
            </>
        );
    };

    const appointmentDateBodyTemplate = (rowData: any) => {
        return (
            <>
                <span className="p-column-title">Appointment Date</span>
                {new Date(rowData.appointmentDate).toLocaleDateString()}
            </>
        );
    };

    const statusBodyTemplate = (rowData: any) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`badge status-${rowData.status.toLowerCase()}`}>{rowData.status}</span>
            </>
        );
    };

    const horarioBodyTemplate = (rowData: any) => {
        return (
            <>
                <span className="p-column-title">Time</span>
                {rowData.horario}
            </>
        );
    };

    return (
        <div className="grid profissionais-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />

                    <DataTable
                        ref={dt}
                        value={appointments}
                        selection={selectedAppointments}
                        onSelectionChange={(e) => setSelectedAppointments(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} appointments"
                        globalFilter={globalFilter}
                        emptyMessage="No appointments found."
                        responsiveLayout="scroll"
                    >
                        <Column field="userName" header="E-mail" sortable body={userNameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="professionalName" header="Professional Name" sortable body={professionalNameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="serviceName" header="Service Name" sortable body={serviceNameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="appointmentDate" header="Appointment Date" sortable body={appointmentDateBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="status" header="Status" body={statusBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="horario" header="Time" body={horarioBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default Profissionais;

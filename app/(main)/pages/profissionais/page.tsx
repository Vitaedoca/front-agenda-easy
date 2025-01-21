/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Demo } from '@/types';
import { ProfessionalService } from '@/service/ProfessionalService';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Profissionais = () => {
    let emptyProfessional: Demo.Professional = {
        id: 0,
        name: '',
        email: '',
        image: '',
        phone: '',
        quantity: 0,
        rating: 0,
    };

    const [professionals, setProfessionals] = useState<Demo.Professional[] | null>(null);
    const [professionalDialog, setProfessionalDialog] = useState(false);
    const [deleteProfessionalDialog, setDeleteProfessionalDialog] = useState(false);
    const [deleteProfessionalsDialog, setDeleteProfessionalsDialog] = useState(false);
    const [professional, setProfessional] = useState<Demo.Professional>(emptyProfessional);
    const [selectedProfessionals, setSelectedProfessionals] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const service = new ProfessionalService();
    
    useEffect(() => {
        service.listarTodos()
            .then( response => {
                setProfessionals(response.data)
                console.log(response.data)
            }).catch(error => console.log(error))
    }, [])
    

    const openNew = () => {
        setProfessional(emptyProfessional);
        setSubmitted(false);
        setProfessionalDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProfessionalDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProfessionalDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProfessionalsDialog(false);
    };

    const saveProfessional = async () => {
        setSubmitted(true);
    
        // Verifica se o campo "name" está preenchido antes de prosseguir
        if (professional.name.trim()) {
            let _professional = { ...professional };
            const service = new ProfessionalService();
    
            try {
                if (_professional.id) {
                    // Atualiza um profissional existente
                    await service.editar(_professional);
                    console.log(_professional);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Profissional atualizado com sucesso!',
                        life: 3000
                    });
    
                    // Atualiza o estado de profissionais com o novo valor, tratando caso prevProfessionals seja null
                    setProfessionals((prevProfessionals) => 
                        prevProfessionals 
                            ? prevProfessionals.map((prof) => 
                                prof.id === _professional.id ? _professional : prof
                              )
                            : [_professional] // caso prevProfessionals seja null, inicializa com o profissional atualizado
                    );
                } else {
                    // Adiciona um novo profissional
                    _professional.image = 'product-placeholder.svg'; // Imagem padrão
                    const response = await service.inserir(_professional);
                    _professional.id = Number(response.data.id); // Converte id para número
    
                    setProfessionals((prevProfessionals) => 
                        prevProfessionals ? [...prevProfessionals, _professional] : [_professional]
                    );
    
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Novo profissional adicionado com sucesso!',
                        life: 3000
                    });
                }
    
                // Fecha o diálogo e redefine o formulário
                setProfessionalDialog(false);
                setProfessional(emptyProfessional);
            } catch (error) {
                console.log(_professional.id)
                console.error("Erro ao salvar profissional:", error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível salvar o profissional. Tente novamente.',
                    life: 3000
                });
            }
        }
    };
    
    
    const editProduct = (professional: Demo.Professional) => {
        setProfessional({ ...professional });
        setProfessionalDialog(true);
    };

    const confirmDeleteProduct = (professional: Demo.Professional) => {
        setProfessional(professional);
        setDeleteProfessionalDialog(true);
    };

    const deleteProduct = async () => {
        try {
            // Chama o serviço para deletar o profissional no backend
            const service = new ProfessionalService();
            await service.deletar(professional.id as any); 
            console.log(professional)
    
            // Atualiza a lista local após a exclusão
            const updatedProfessionals = (professionals as any)?.filter((val: any) => val.id !== professional.id);
            setProfessionals(updatedProfessionals);
    
            // Exibe o toast de sucesso
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Professional Deleted',
                life: 3000
            });
        } catch (error) {
            console.error('Error deleting professional:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'There was an error deleting the professional.',
                life: 3000
            });
        }
    
        // Fecha o diálogo e limpa o profissional
        setDeleteProfessionalDialog(false);
        setProfessional(emptyProfessional);
    };
    

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (professionals as any)?.length; i++) {
            if ((professionals as any)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const deleteSelectedProducts = () => {
        let _professionals = (professionals as any)?.filter((val: any) => !(selectedProfessionals as any)?.includes(val));
        setProfessionals(_professionals);
        setDeleteProfessionalsDialog(false);
        setSelectedProfessionals(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000
        });
    };


    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _professional = { ...professional };
        _professional[`${name}`] = val;

        setProfessional(_professional);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    {/* <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProfessionals || !(selectedProfessionals as any).length} /> */}
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };


    const nameBodyTemplate = (rowData: Demo.Professional) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const emailBodyTemplate = (rowData: Demo.Professional) => {
        return (
            <>
                <span className="p-column-title">E-mail</span>
                {rowData.email}
            </>
        );
    };

    const phoneBodyTemplate = (rowData: Demo.Professional) => {
        return (
            <>
                <span className="p-column-title">Phone</span>
                {rowData.phone}
            </>
        );
    };


    const imageBodyTemplate = (rowData: Demo.Professional) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };


    const actionBodyTemplate = (rowData: Demo.Professional) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveProfessional} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );

    return (
        <div className="grid profissionais-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={professionals}
                        selection={selectedProfessionals}
                        onSelectionChange={(e) => setSelectedProfessionals(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando de {first} a {last} de {totalRecords} profissionais"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        // header={header}
                        responsiveLayout="scroll"
                    >
                        {/* <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column> */}
                        <Column header="Image" body={imageBodyTemplate}></Column>
                        <Column field="name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="email" header="E-mail" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="phone" header="Phone" sortable body={phoneBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={professionalDialog} style={{ width: '450px' }} header="Detalhes do profissional" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        {professional.image && <img src={`/demo/images/product/${professional.image}`} alt={professional.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={professional.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !professional.name
                                })}
                            />
                            {submitted && !professional.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <InputText id="email" value={professional.email} onChange={(e) => onInputChange(e, 'email')} />
                        </div>
                        <div className="field">
                            <label htmlFor="phone">Phone</label>
                            <InputText id="phone" value={professional.phone} onChange={(e) => onInputChange(e, 'phone')} />
                        </div>

                    </Dialog>

                    <Dialog 
                        visible={deleteProfessionalDialog} 
                        style={{ width: '450px' }} 
                        header="Confirmar exclusão" 
                        modal 
                        footer={deleteProductDialogFooter} 
                        onHide={hideDeleteProductDialog}>
                        <div className="flex">
                            <i className="pi pi-exclamation-triangle" style={{ fontSize: '2rem', marginRight: '1rem' }} />
                            {professional && <span>Tem certeza de que deseja excluir o profissional <p><b>{professional.name}?</b></p></span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Profissionais;

/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Demo } from '@/types';
import { serviceService } from '@/service/ServicesService';
import { InputTextarea } from 'primereact/inputtextarea';
import { professionalService } from '@/service/ProfessionalService';
import { Dropdown } from 'primereact/dropdown';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Profissionais = () => {
    let emptyService: Demo.Services = {
        id: 0,
        name: "",
        photo: "",
        description: "",
        duration: 0,
        price: 0,
        professionalId: 0
    };

    const [services, setServices] = useState<Demo.Services[] | null>(null);
    const [serviceDialog, setServiceDialog] = useState(false);
    const [deleteServiceDialog, setDeleteServiceDialog] = useState(false);
    const [deleteServicesDialog, setDeleteServicesDialog] = useState(false);
    const [service, setService] = useState<Demo.Services>(emptyService);
    const [selectedServices, setSelectedServices] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    // Supondo que você tenha uma lista de profissionais obtida via API
    const [profissionais, setProfissionais] = useState<{ name: string; id: number }[]>([]);

    useEffect(() => {
        const service = new professionalService();
        service.listarTodos()
            .then(response => setProfissionais(response.data))
            .catch(error => console.log(error));
    }, []);


    const MyComponent = () => {
        
            useEffect(() => {
                const service = new serviceService();
                service.listarTodos()
                    .then(response => setServices(response.data))
                    .catch(error => console.log(error));
            }, []);
    }

    // // Função para exibir o nome do profissional corretamente para cada serviço
    // const profissionalNome = (professionalId: number) => {
    //     const profissional = profissionais.find(p => p.id === professionalId);
    //     return profissional ? profissional.name : 'Profissional não encontrado';
    // };
   
    MyComponent();

    const openNew = () => {
        setService(emptyService);
        setSubmitted(false);
        setServiceDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setServiceDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteServiceDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteServicesDialog(false);
    };

    const saveService = async () => {
        setSubmitted(true);
    
        if (service.name.trim()) {
            let _service = { ...service };
            const serviceApi = new serviceService();
    
            try {
                if (_service.id) {
                    // Atualização de serviço existente
                    await serviceApi.editar(_service);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Serviço atualizado com sucesso!',
                        life: 3000
                    });
    
                    // Atualiza o estado de serviços
                    setServices((prevServices) =>
                        prevServices
                            ? prevServices.map((s) => (s.id === _service.id ? _service : s))
                            : [_service]
                    );
                } else {
                    // Criação de novo serviço
                    const response = await serviceApi.inserir(_service);
                    _service.id = Number(response.data.id);
    
                    setServices((prevServices) =>
                        prevServices ? [...prevServices, _service] : [_service]
                    );
    
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Novo serviço adicionado com sucesso!',
                        life: 3000
                    });
                }
    
                setServiceDialog(false);
                setService(emptyService);
            } catch (error) {
                console.error("Erro ao salvar serviço:", error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível salvar o serviço. Tente novamente.',
                    life: 3000
                });
            }
        }
    };
    
    
    const editProduct = (service: Demo.Services) => {
        setService({ ...service });
        setServiceDialog(true);
    };

    const confirmDeleteProduct = (service: Demo.Services) => {
        setService(service);
        setDeleteServiceDialog(true);
    };

    const deleteProduct = async () => {
        if (!service.id) return;
    
        try {
            // Chama o serviço para deletar o serviço no backend
            const serviceApi = new serviceService();
            await serviceApi.deletar(service); // Passa o ID do serviço a ser deletado
    
            console.log(service.id)
            // Atualiza a lista local após a exclusão
            const updatedServices = services?.filter((s) => s.id !== service.id) || [];
            setServices(updatedServices);            
    
            // Exibe o toast de sucesso
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Serviço excluído com sucesso!',
                life: 3000
            });
        } catch (error) {
            console.error('Erro ao excluir serviço:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Houve um erro ao excluir o serviço.',
                life: 3000
            });
        }
    
        // Fecha o diálogo e limpa o serviço
        setDeleteServiceDialog(false);
        setService(emptyService);
    };
    
    

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (services as any)?.length; i++) {
            if ((services as any)[i].id === id) {
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
        let _services = (services as any)?.filter((val: any) => !(selectedServices as any)?.includes(val));
        setServices(_services);
        setDeleteServicesDialog(false);
        setSelectedServices(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000
        });
    };

    type Service = {
    id?: number;
    name: string;
    photo?: string;
    description: string;
    duration: number;
    price: number;
    professionalId: number;
    };

    const onInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        name: keyof Service // 'name' agora é uma chave válida de Service
      ) => {
        const val = e.target.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value;
      
        // Usando 'any' para a variável '_service'
        let _service: any = { ...service };  // Aqui, usamos 'any' para _service
      
        // Agora atribuímos o valor ao campo específico de _service
        _service[name] = val;
      
        // Atualizando o estado com o serviço modificado
        setService(_service);
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


    const nameBodyTemplate = (rowData: Demo.Services) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };


    // const imageBodyTemplate = (rowData: Demo.Services) => {
    //     return (
    //         <>
    //             <span className="p-column-title">Image</span>
    //             <img src={`/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
    //         </>
    //     );
    // };


    const actionBodyTemplate = (rowData: Demo.Services) => {
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
            <Button label="Save" icon="pi pi-check" text onClick={saveService} />
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
                        value={services}
                        selection={selectedServices}
                        onSelectionChange={(e) => setSelectedServices(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando de {first} a {last} de {totalRecords} serviços"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum serviço encontrado."
                        responsiveLayout="scroll"
                    >
                        {/* Coluna de Foto */}
                        <Column field="photo" header="Foto" body={(rowData) => (
                            rowData.photo ? <img src={rowData.photo} alt={rowData.name} style={{ width: '100px', height: 'auto' }} /> : <span>Sem imagem</span>
                        )} headerStyle={{ minWidth: '10rem' }} />
                        {/* Coluna de Nome */}
                        <Column field="name" header="Nome" sortable body={(rowData) => <span>{rowData.name}</span>} headerStyle={{ minWidth: '15rem' }} />

                        {/* Coluna de Descrição */}
                        <Column field="description" header="Descrição" sortable body={(rowData) => <span>{rowData.description}</span>} headerStyle={{ minWidth: '20rem' }} />

                        {/* Coluna de Duração */}
                        <Column field="duration" header="Duração (min)" sortable body={(rowData) => <span>{rowData.duration} min</span>} headerStyle={{ minWidth: '10rem' }} />

                        {/* Coluna de Preço */}
                        <Column field="price" header="Preço (R$)" sortable body={(rowData) => <span>R$ {rowData.price.toFixed(2)}</span>} headerStyle={{ minWidth: '10rem' }} />
                    

                        {/* Ações (Editar/Excluir) */}
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }} />
                    </DataTable>



                    <Dialog visible={serviceDialog} style={{ width: '450px' }} header="Detalhes do profissional" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        {/* {service.image && <img src={`/demo/images/product/${service.image}`} alt={service.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />} */}
                        <div className="field">
                            <label htmlFor="name">Name</label>
                            <InputText
                                id="name"
                                value={service.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !service.name
                                })}
                            />
                            {submitted && !service.name && <small className="p-invalid">Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="Descrição">Descrição</label>
                            <InputTextarea id="description" value={service.description} onChange={(e) => onInputChange(e, 'description')} />
                        </div>

                        <div className="field">
                            <label htmlFor="Preço">Preço</label>
                            <div className="p-inputgroup">
                            <input 
                                placeholder="Duração (min)" 
                                type="number"
                                value={service.duration}
                                onChange={(e) => onInputChange(e, 'duration')}
                                min={0}
                                style={{
                                    WebkitAppearance: 'none',  // Chrome, Safari, Edge, Opera
                                    MozAppearance: 'textfield' // Firefox
                                }}
                            />
                                <span className="p-inputgroup-addon">$</span>
                                <span className="p-inputgroup-addon">.00</span>
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="Duração">Duração</label>
                            <div className="p-inputgroup">
                            <input 
                                className='bord'
                                placeholder="Preço (R$)" 
                                type="number"
                                value={service.price}
                                onChange={(e) => onInputChange(e, 'price')}
                                min={0}
                                style={{
                                    WebkitAppearance: 'none',  // Chrome, Safari, Edge, Opera
                                    MozAppearance: 'textfield' // Firefox
                                }}
                            />
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-clock"></i>
                                </span>
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="professional">Profissional</label>
                            <Dropdown
                                value={service.professionalId}
                                onChange={(e) => setService(prevService => ({ ...prevService, professionalId: e.value }))}
                                options={profissionais}
                                optionLabel="name"
                                optionValue="id"
                                placeholder="Selecione um profissional"
                            />
                            {submitted && !service.professionalId && <small className="p-invalid">Selecione um profissional.</small>}
                        </div>

                    </Dialog>

                    <Dialog 
                        visible={deleteServiceDialog} 
                        style={{ width: '450px' }} 
                        header="Confirmar exclusão" 
                        modal 
                        footer={deleteProductDialogFooter} 
                        onHide={hideDeleteProductDialog}>
                        <div className="flex">
                            <i className="pi pi-exclamation-triangle" style={{ fontSize: '2rem', marginRight: '1rem' }} />
                            {service && <span>Tem certeza de que deseja excluir o profissional <p><b>{service.name}?</b></p></span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Profissionais;

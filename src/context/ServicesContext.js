import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

//Criação do contexto
export const ServicesContext = createContext();

//Provedor do contexto
export const ServicesProvider = ({ children}) => {
    const [services, setServices] = useState([]);
    const [passwordLength, setPasswordLength] = useState(12);
    const [expandedItem, setExpandedItem] = useState(null) //Estado para controlar a expansão de cada serviço.

    //Carregar serviços do AsyncStorage
    useEffect(() => {
        const loadServices = async () => {
            try {
                const storedServices = await AsyncStorage.getItem('services');
                if(storedServices) {
                    setServices(JSON.parse(storedServices));
                }
            } catch (error) {
                console.error("Erro ao carregar os serviços", error);
            }
        };
        loadServices(); 
    }, [services]);

    //Função para salvar um novo serviço (com múltiplos logins)
    const saveService = async (newService) => {
        try {
            const serviceIndex = services.findIndex(service => service.service === newService.service);
            if(serviceIndex === -1) {
                //se o serviço não existir, cria um novo
                setServices(prevServices => {
                    const updatedServices = [...prevServices, newService];
                    AsyncStorage.setItem('services', JSON.stringify(updatedServices));
                    return updatedServices;
                });
            } else {
                //Se o serviço já existir, adiciona osnovos logins daquele serviço
                const updatedServices = services.map(service => {
                    if(service.service === newService.service) {
                        return { ...service, entries: [...service.entries, ...newService.entries] 
                        };   
                    }
                    return service;
                });

                setServices(updatedServices); //atualiza o estado local.
                await AsyncStorage.setItem('services', JSON.stringify(updatedServices));
            }
        } catch (error) {
            console.error("Erro ao salvar o serviço", error);
        }
    };

    const updateService = async (updatedService) => {
        try {
            const updatedServices = services.map(service =>
                service.service === updateService.service ?
                updatedService : service
            );

            setServices(updatedServices); //atualiza o estado local.
            await AsyncStorage.setItem('services', JSON.stringify(updatedServices));
            console.log('Serviço atualizado', updateService);
        } catch(error) {
            console.error("Erro ao atualizar o serviço", error);
        }
    };

    //Função para deletar um serviço
    const deleteService = async (serviceName, entryUsername) => {
        try {
            const updatedServices = services.map(service => {
                if(service.service === serviceName) {
                    if(entryUsername) {
                        //exclui um login específico
                        const filteredEntries = service.entries.filter(entry => entry.username !== entryUsername);
                        return {...service, entries: filteredEntries};
                    }
                    //exclui o serviço inteiro
                    return null;
                }
                return service;
            }).filter(service => service !== null); //remove serviços excluidos

            setServices(updatedServices);
            //Salva a lista de serviços atualizada no AsyncStorage
            await AsyncStorage.setItem('services', JSON.stringify(updatedServices));
        } catch (error) {
            console.error("Erro ao excluir o login", error);
        }
    };

    return (
        <ServicesContext.Provider value={{ services, expandedItem, setExpandedItem, saveService, deleteService, updateService }}>
            {children}
        </ServicesContext.Provider>
    );
};
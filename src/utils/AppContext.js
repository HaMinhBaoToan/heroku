import { createContext } from 'react';

const defaultValue = {};
const AppContext = createContext(defaultValue);
const ManagerUserContext = createContext(defaultValue);


export  {AppContext,ManagerUserContext };
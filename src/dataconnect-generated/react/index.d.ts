import { InsertPartRequestData, InsertPartRequestVariables, GetPartRequestsByMechanicData, GetPartRequestsByMechanicVariables, CreateShopProfileData, CreateShopProfileVariables, ListShopProfilesData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useInsertPartRequest(options?: useDataConnectMutationOptions<InsertPartRequestData, FirebaseError, InsertPartRequestVariables>): UseDataConnectMutationResult<InsertPartRequestData, InsertPartRequestVariables>;
export function useInsertPartRequest(dc: DataConnect, options?: useDataConnectMutationOptions<InsertPartRequestData, FirebaseError, InsertPartRequestVariables>): UseDataConnectMutationResult<InsertPartRequestData, InsertPartRequestVariables>;

export function useGetPartRequestsByMechanic(vars: GetPartRequestsByMechanicVariables, options?: useDataConnectQueryOptions<GetPartRequestsByMechanicData>): UseDataConnectQueryResult<GetPartRequestsByMechanicData, GetPartRequestsByMechanicVariables>;
export function useGetPartRequestsByMechanic(dc: DataConnect, vars: GetPartRequestsByMechanicVariables, options?: useDataConnectQueryOptions<GetPartRequestsByMechanicData>): UseDataConnectQueryResult<GetPartRequestsByMechanicData, GetPartRequestsByMechanicVariables>;

export function useCreateShopProfile(options?: useDataConnectMutationOptions<CreateShopProfileData, FirebaseError, CreateShopProfileVariables>): UseDataConnectMutationResult<CreateShopProfileData, CreateShopProfileVariables>;
export function useCreateShopProfile(dc: DataConnect, options?: useDataConnectMutationOptions<CreateShopProfileData, FirebaseError, CreateShopProfileVariables>): UseDataConnectMutationResult<CreateShopProfileData, CreateShopProfileVariables>;

export function useListShopProfiles(options?: useDataConnectQueryOptions<ListShopProfilesData>): UseDataConnectQueryResult<ListShopProfilesData, undefined>;
export function useListShopProfiles(dc: DataConnect, options?: useDataConnectQueryOptions<ListShopProfilesData>): UseDataConnectQueryResult<ListShopProfilesData, undefined>;

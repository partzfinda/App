import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateShopProfileData {
  shopProfile_insert: ShopProfile_Key;
}

export interface CreateShopProfileVariables {
  userId: UUIDString;
  deliveryOptions?: string[] | null;
  inventorySpecialties?: string[] | null;
  primaryContactPerson: string;
  shopName: string;
}

export interface GetPartRequestsByMechanicData {
  partRequests: ({
    id: UUIDString;
    VIN?: string | null;
    createdAt: TimestampString;
    partDescription: string;
    urgency?: string | null;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: number;
  } & PartRequest_Key)[];
}

export interface GetPartRequestsByMechanicVariables {
  mechanicId: UUIDString;
}

export interface InsertPartRequestData {
  partRequest_insert: PartRequest_Key;
}

export interface InsertPartRequestVariables {
  mechanicId: UUIDString;
  VIN?: string | null;
  partDescription: string;
  urgency?: string | null;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
}

export interface ListShopProfilesData {
  shopProfiles: ({
    id: UUIDString;
    userId: UUIDString;
    deliveryOptions?: string[] | null;
    inventorySpecialties?: string[] | null;
    primaryContactPerson: string;
    shopName: string;
  } & ShopProfile_Key)[];
}

export interface MechanicProfile_Key {
  id: UUIDString;
  __typename?: 'MechanicProfile_Key';
}

export interface Message_Key {
  id: UUIDString;
  __typename?: 'Message_Key';
}

export interface PartRequest_Key {
  id: UUIDString;
  __typename?: 'PartRequest_Key';
}

export interface Quote_Key {
  id: UUIDString;
  __typename?: 'Quote_Key';
}

export interface ShopProfile_Key {
  id: UUIDString;
  __typename?: 'ShopProfile_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface InsertPartRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertPartRequestVariables): MutationRef<InsertPartRequestData, InsertPartRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: InsertPartRequestVariables): MutationRef<InsertPartRequestData, InsertPartRequestVariables>;
  operationName: string;
}
export const insertPartRequestRef: InsertPartRequestRef;

export function insertPartRequest(vars: InsertPartRequestVariables): MutationPromise<InsertPartRequestData, InsertPartRequestVariables>;
export function insertPartRequest(dc: DataConnect, vars: InsertPartRequestVariables): MutationPromise<InsertPartRequestData, InsertPartRequestVariables>;

interface GetPartRequestsByMechanicRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPartRequestsByMechanicVariables): QueryRef<GetPartRequestsByMechanicData, GetPartRequestsByMechanicVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPartRequestsByMechanicVariables): QueryRef<GetPartRequestsByMechanicData, GetPartRequestsByMechanicVariables>;
  operationName: string;
}
export const getPartRequestsByMechanicRef: GetPartRequestsByMechanicRef;

export function getPartRequestsByMechanic(vars: GetPartRequestsByMechanicVariables): QueryPromise<GetPartRequestsByMechanicData, GetPartRequestsByMechanicVariables>;
export function getPartRequestsByMechanic(dc: DataConnect, vars: GetPartRequestsByMechanicVariables): QueryPromise<GetPartRequestsByMechanicData, GetPartRequestsByMechanicVariables>;

interface CreateShopProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateShopProfileVariables): MutationRef<CreateShopProfileData, CreateShopProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateShopProfileVariables): MutationRef<CreateShopProfileData, CreateShopProfileVariables>;
  operationName: string;
}
export const createShopProfileRef: CreateShopProfileRef;

export function createShopProfile(vars: CreateShopProfileVariables): MutationPromise<CreateShopProfileData, CreateShopProfileVariables>;
export function createShopProfile(dc: DataConnect, vars: CreateShopProfileVariables): MutationPromise<CreateShopProfileData, CreateShopProfileVariables>;

interface ListShopProfilesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListShopProfilesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListShopProfilesData, undefined>;
  operationName: string;
}
export const listShopProfilesRef: ListShopProfilesRef;

export function listShopProfiles(): QueryPromise<ListShopProfilesData, undefined>;
export function listShopProfiles(dc: DataConnect): QueryPromise<ListShopProfilesData, undefined>;


# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetPartRequestsByMechanic*](#getpartrequestsbymechanic)
  - [*ListShopProfiles*](#listshopprofiles)
- [**Mutations**](#mutations)
  - [*InsertPartRequest*](#insertpartrequest)
  - [*CreateShopProfile*](#createshopprofile)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetPartRequestsByMechanic
You can execute the `GetPartRequestsByMechanic` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getPartRequestsByMechanic(vars: GetPartRequestsByMechanicVariables): QueryPromise<GetPartRequestsByMechanicData, GetPartRequestsByMechanicVariables>;

interface GetPartRequestsByMechanicRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPartRequestsByMechanicVariables): QueryRef<GetPartRequestsByMechanicData, GetPartRequestsByMechanicVariables>;
}
export const getPartRequestsByMechanicRef: GetPartRequestsByMechanicRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPartRequestsByMechanic(dc: DataConnect, vars: GetPartRequestsByMechanicVariables): QueryPromise<GetPartRequestsByMechanicData, GetPartRequestsByMechanicVariables>;

interface GetPartRequestsByMechanicRef {
  ...
  (dc: DataConnect, vars: GetPartRequestsByMechanicVariables): QueryRef<GetPartRequestsByMechanicData, GetPartRequestsByMechanicVariables>;
}
export const getPartRequestsByMechanicRef: GetPartRequestsByMechanicRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPartRequestsByMechanicRef:
```typescript
const name = getPartRequestsByMechanicRef.operationName;
console.log(name);
```

### Variables
The `GetPartRequestsByMechanic` query requires an argument of type `GetPartRequestsByMechanicVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPartRequestsByMechanicVariables {
  mechanicId: UUIDString;
}
```
### Return Type
Recall that executing the `GetPartRequestsByMechanic` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPartRequestsByMechanicData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetPartRequestsByMechanic`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPartRequestsByMechanic, GetPartRequestsByMechanicVariables } from '@dataconnect/generated';

// The `GetPartRequestsByMechanic` query requires an argument of type `GetPartRequestsByMechanicVariables`:
const getPartRequestsByMechanicVars: GetPartRequestsByMechanicVariables = {
  mechanicId: ..., 
};

// Call the `getPartRequestsByMechanic()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPartRequestsByMechanic(getPartRequestsByMechanicVars);
// Variables can be defined inline as well.
const { data } = await getPartRequestsByMechanic({ mechanicId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPartRequestsByMechanic(dataConnect, getPartRequestsByMechanicVars);

console.log(data.partRequests);

// Or, you can use the `Promise` API.
getPartRequestsByMechanic(getPartRequestsByMechanicVars).then((response) => {
  const data = response.data;
  console.log(data.partRequests);
});
```

### Using `GetPartRequestsByMechanic`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPartRequestsByMechanicRef, GetPartRequestsByMechanicVariables } from '@dataconnect/generated';

// The `GetPartRequestsByMechanic` query requires an argument of type `GetPartRequestsByMechanicVariables`:
const getPartRequestsByMechanicVars: GetPartRequestsByMechanicVariables = {
  mechanicId: ..., 
};

// Call the `getPartRequestsByMechanicRef()` function to get a reference to the query.
const ref = getPartRequestsByMechanicRef(getPartRequestsByMechanicVars);
// Variables can be defined inline as well.
const ref = getPartRequestsByMechanicRef({ mechanicId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPartRequestsByMechanicRef(dataConnect, getPartRequestsByMechanicVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.partRequests);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.partRequests);
});
```

## ListShopProfiles
You can execute the `ListShopProfiles` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listShopProfiles(): QueryPromise<ListShopProfilesData, undefined>;

interface ListShopProfilesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListShopProfilesData, undefined>;
}
export const listShopProfilesRef: ListShopProfilesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listShopProfiles(dc: DataConnect): QueryPromise<ListShopProfilesData, undefined>;

interface ListShopProfilesRef {
  ...
  (dc: DataConnect): QueryRef<ListShopProfilesData, undefined>;
}
export const listShopProfilesRef: ListShopProfilesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listShopProfilesRef:
```typescript
const name = listShopProfilesRef.operationName;
console.log(name);
```

### Variables
The `ListShopProfiles` query has no variables.
### Return Type
Recall that executing the `ListShopProfiles` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListShopProfilesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListShopProfiles`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listShopProfiles } from '@dataconnect/generated';


// Call the `listShopProfiles()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listShopProfiles();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listShopProfiles(dataConnect);

console.log(data.shopProfiles);

// Or, you can use the `Promise` API.
listShopProfiles().then((response) => {
  const data = response.data;
  console.log(data.shopProfiles);
});
```

### Using `ListShopProfiles`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listShopProfilesRef } from '@dataconnect/generated';


// Call the `listShopProfilesRef()` function to get a reference to the query.
const ref = listShopProfilesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listShopProfilesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.shopProfiles);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.shopProfiles);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## InsertPartRequest
You can execute the `InsertPartRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
insertPartRequest(vars: InsertPartRequestVariables): MutationPromise<InsertPartRequestData, InsertPartRequestVariables>;

interface InsertPartRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: InsertPartRequestVariables): MutationRef<InsertPartRequestData, InsertPartRequestVariables>;
}
export const insertPartRequestRef: InsertPartRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
insertPartRequest(dc: DataConnect, vars: InsertPartRequestVariables): MutationPromise<InsertPartRequestData, InsertPartRequestVariables>;

interface InsertPartRequestRef {
  ...
  (dc: DataConnect, vars: InsertPartRequestVariables): MutationRef<InsertPartRequestData, InsertPartRequestVariables>;
}
export const insertPartRequestRef: InsertPartRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the insertPartRequestRef:
```typescript
const name = insertPartRequestRef.operationName;
console.log(name);
```

### Variables
The `InsertPartRequest` mutation requires an argument of type `InsertPartRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface InsertPartRequestVariables {
  mechanicId: UUIDString;
  VIN?: string | null;
  partDescription: string;
  urgency?: string | null;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
}
```
### Return Type
Recall that executing the `InsertPartRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `InsertPartRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface InsertPartRequestData {
  partRequest_insert: PartRequest_Key;
}
```
### Using `InsertPartRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, insertPartRequest, InsertPartRequestVariables } from '@dataconnect/generated';

// The `InsertPartRequest` mutation requires an argument of type `InsertPartRequestVariables`:
const insertPartRequestVars: InsertPartRequestVariables = {
  mechanicId: ..., 
  VIN: ..., // optional
  partDescription: ..., 
  urgency: ..., // optional
  vehicleMake: ..., 
  vehicleModel: ..., 
  vehicleYear: ..., 
};

// Call the `insertPartRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await insertPartRequest(insertPartRequestVars);
// Variables can be defined inline as well.
const { data } = await insertPartRequest({ mechanicId: ..., VIN: ..., partDescription: ..., urgency: ..., vehicleMake: ..., vehicleModel: ..., vehicleYear: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await insertPartRequest(dataConnect, insertPartRequestVars);

console.log(data.partRequest_insert);

// Or, you can use the `Promise` API.
insertPartRequest(insertPartRequestVars).then((response) => {
  const data = response.data;
  console.log(data.partRequest_insert);
});
```

### Using `InsertPartRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, insertPartRequestRef, InsertPartRequestVariables } from '@dataconnect/generated';

// The `InsertPartRequest` mutation requires an argument of type `InsertPartRequestVariables`:
const insertPartRequestVars: InsertPartRequestVariables = {
  mechanicId: ..., 
  VIN: ..., // optional
  partDescription: ..., 
  urgency: ..., // optional
  vehicleMake: ..., 
  vehicleModel: ..., 
  vehicleYear: ..., 
};

// Call the `insertPartRequestRef()` function to get a reference to the mutation.
const ref = insertPartRequestRef(insertPartRequestVars);
// Variables can be defined inline as well.
const ref = insertPartRequestRef({ mechanicId: ..., VIN: ..., partDescription: ..., urgency: ..., vehicleMake: ..., vehicleModel: ..., vehicleYear: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = insertPartRequestRef(dataConnect, insertPartRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.partRequest_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.partRequest_insert);
});
```

## CreateShopProfile
You can execute the `CreateShopProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createShopProfile(vars: CreateShopProfileVariables): MutationPromise<CreateShopProfileData, CreateShopProfileVariables>;

interface CreateShopProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateShopProfileVariables): MutationRef<CreateShopProfileData, CreateShopProfileVariables>;
}
export const createShopProfileRef: CreateShopProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createShopProfile(dc: DataConnect, vars: CreateShopProfileVariables): MutationPromise<CreateShopProfileData, CreateShopProfileVariables>;

interface CreateShopProfileRef {
  ...
  (dc: DataConnect, vars: CreateShopProfileVariables): MutationRef<CreateShopProfileData, CreateShopProfileVariables>;
}
export const createShopProfileRef: CreateShopProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createShopProfileRef:
```typescript
const name = createShopProfileRef.operationName;
console.log(name);
```

### Variables
The `CreateShopProfile` mutation requires an argument of type `CreateShopProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateShopProfileVariables {
  userId: UUIDString;
  deliveryOptions?: string[] | null;
  inventorySpecialties?: string[] | null;
  primaryContactPerson: string;
  shopName: string;
}
```
### Return Type
Recall that executing the `CreateShopProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateShopProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateShopProfileData {
  shopProfile_insert: ShopProfile_Key;
}
```
### Using `CreateShopProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createShopProfile, CreateShopProfileVariables } from '@dataconnect/generated';

// The `CreateShopProfile` mutation requires an argument of type `CreateShopProfileVariables`:
const createShopProfileVars: CreateShopProfileVariables = {
  userId: ..., 
  deliveryOptions: ..., // optional
  inventorySpecialties: ..., // optional
  primaryContactPerson: ..., 
  shopName: ..., 
};

// Call the `createShopProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createShopProfile(createShopProfileVars);
// Variables can be defined inline as well.
const { data } = await createShopProfile({ userId: ..., deliveryOptions: ..., inventorySpecialties: ..., primaryContactPerson: ..., shopName: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createShopProfile(dataConnect, createShopProfileVars);

console.log(data.shopProfile_insert);

// Or, you can use the `Promise` API.
createShopProfile(createShopProfileVars).then((response) => {
  const data = response.data;
  console.log(data.shopProfile_insert);
});
```

### Using `CreateShopProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createShopProfileRef, CreateShopProfileVariables } from '@dataconnect/generated';

// The `CreateShopProfile` mutation requires an argument of type `CreateShopProfileVariables`:
const createShopProfileVars: CreateShopProfileVariables = {
  userId: ..., 
  deliveryOptions: ..., // optional
  inventorySpecialties: ..., // optional
  primaryContactPerson: ..., 
  shopName: ..., 
};

// Call the `createShopProfileRef()` function to get a reference to the mutation.
const ref = createShopProfileRef(createShopProfileVars);
// Variables can be defined inline as well.
const ref = createShopProfileRef({ userId: ..., deliveryOptions: ..., inventorySpecialties: ..., primaryContactPerson: ..., shopName: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createShopProfileRef(dataConnect, createShopProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.shopProfile_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.shopProfile_insert);
});
```


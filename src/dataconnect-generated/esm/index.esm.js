import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'app',
  location: 'us-central1'
};

export const insertPartRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertPartRequest', inputVars);
}
insertPartRequestRef.operationName = 'InsertPartRequest';

export function insertPartRequest(dcOrVars, vars) {
  return executeMutation(insertPartRequestRef(dcOrVars, vars));
}

export const getPartRequestsByMechanicRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPartRequestsByMechanic', inputVars);
}
getPartRequestsByMechanicRef.operationName = 'GetPartRequestsByMechanic';

export function getPartRequestsByMechanic(dcOrVars, vars) {
  return executeQuery(getPartRequestsByMechanicRef(dcOrVars, vars));
}

export const createShopProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateShopProfile', inputVars);
}
createShopProfileRef.operationName = 'CreateShopProfile';

export function createShopProfile(dcOrVars, vars) {
  return executeMutation(createShopProfileRef(dcOrVars, vars));
}

export const listShopProfilesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListShopProfiles');
}
listShopProfilesRef.operationName = 'ListShopProfiles';

export function listShopProfiles(dc) {
  return executeQuery(listShopProfilesRef(dc));
}


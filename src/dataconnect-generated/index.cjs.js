const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'app',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const insertPartRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'InsertPartRequest', inputVars);
}
insertPartRequestRef.operationName = 'InsertPartRequest';
exports.insertPartRequestRef = insertPartRequestRef;

exports.insertPartRequest = function insertPartRequest(dcOrVars, vars) {
  return executeMutation(insertPartRequestRef(dcOrVars, vars));
};

const getPartRequestsByMechanicRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPartRequestsByMechanic', inputVars);
}
getPartRequestsByMechanicRef.operationName = 'GetPartRequestsByMechanic';
exports.getPartRequestsByMechanicRef = getPartRequestsByMechanicRef;

exports.getPartRequestsByMechanic = function getPartRequestsByMechanic(dcOrVars, vars) {
  return executeQuery(getPartRequestsByMechanicRef(dcOrVars, vars));
};

const createShopProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateShopProfile', inputVars);
}
createShopProfileRef.operationName = 'CreateShopProfile';
exports.createShopProfileRef = createShopProfileRef;

exports.createShopProfile = function createShopProfile(dcOrVars, vars) {
  return executeMutation(createShopProfileRef(dcOrVars, vars));
};

const listShopProfilesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListShopProfiles');
}
listShopProfilesRef.operationName = 'ListShopProfiles';
exports.listShopProfilesRef = listShopProfilesRef;

exports.listShopProfiles = function listShopProfiles(dc) {
  return executeQuery(listShopProfilesRef(dc));
};

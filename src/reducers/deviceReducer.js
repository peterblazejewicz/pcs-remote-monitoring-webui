// Copyright (c) Microsoft. All rights reserved.

import * as types from '../actions/actionTypes';
import initialState from './initialState';

const deviceReducer = (state = initialState.devices, action) => {
  switch (action.type) {
    case types.LOAD_DEVICES_SUCCESS:
      return {
        ...state,
        devices: action.devices
      };

    case types.UPDATE_DEVICE_LIST:
    console.log('reducer', state.devices)
    console.log('reducer action', action.devices)
      return {
        ...state,
        devices: {
          ...state.devices,
          items: state.devices.items.filter(device => action.devices.every(newDevice => newDevice.Id !== device.Id))
        }
      };

    case types.LOAD_TELEMETRY_MESSAGES_FOR_MAP_UPDATE_SUCCESS:
      return {
        ...state,
        telemetryByDeviceGroup: action.data
      };

    case types.LOAD_DEVICE_TELEMETRY_SUCCESS:
      return {
        ...state,
        alarmsList: action.data.Items
      };

    case types.LOAD_DEVICES_GROUP_SUCCESS:
      return {
        ...state,
        deviceGroup: action.deviceGroup
      };

    default:
      return state;
  }
};

export default deviceReducer;

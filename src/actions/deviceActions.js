// Copyright (c) Microsoft. All rights reserved.

import * as types from './actionTypes';
import { loadFailed } from './ajaxStatusActions';
import ApiService from '../common/apiService';
import { indicatorStart, indicatorEnd } from './indicatorActions';
import * as telemetryActions from './telemetryActions';
import lang from '../common/lang';

export const loadDeviceSuccess = devices => {
  return {
    type: types.LOAD_DEVICES_SUCCESS,
    devices
  };
};

export const loadDeviceGroupSuccess = deviceGroup => {
  return {
    type: types.LOAD_DEVICES_GROUP_SUCCESS,
    deviceGroup
  };
};

export const loadDashboardData = (deviceIds = '', timeRange) => {
  return dispatch => {
    dispatch(loadTelemetryMessagesByDeviceIdsForMap(deviceIds, timeRange));
    dispatch(loadDeviceMapAlaramsList(deviceIds, timeRange));
  };
};

export const loadDashboardDataUpdate = (deviceIds) => {
  return dispatch => {
    dispatch(loadTelemetryMessagesByDeviceIdsForMap(deviceIds));
    dispatch(loadDeviceMapAlaramsList(deviceIds));
  };
};

export const loadTelemetrMessagesForMapUpdateSuccess = data => {
  return {
    type: types.LOAD_TELEMETRY_MESSAGES_FOR_MAP_UPDATE_SUCCESS,
    data
  };
};

export const loadTelemetryMessagesByDeviceIdsForMap = (deviceList, timeRange) => {
  return dispatch => {
    dispatch(indicatorStart('mapInitial'));
    return deviceList === lang.ALLDEVICES
      ? ApiService.getTelemetryMessages({
          from: `NOW-${timeRange}`,
          to: 'NOW',
          order: 'desc'
        })
        .then(data => {
          dispatch(loadTelemetrMessagesForMapUpdateSuccess(data));
          dispatch(indicatorEnd('mapInitial'));
        })
        .catch(error => {
          dispatch(loadFailed(error));
          throw error;
        })
      : ApiService.getTelemetryMessages({
          from: `NOW-${timeRange}`,
          to: 'NOW',
          devices: deviceList,
          order: 'desc'
        })
        .then(data => {
          dispatch(loadTelemetrMessagesForMapUpdateSuccess(data));
          dispatch(indicatorEnd('mapInitial'));
        })
        .catch(error => {
          dispatch(loadFailed(error));
          throw error;
        });

  };
};

export const loadDevicesByTelemetryMessages = () => {
  return dispatch => {
    dispatch(indicatorStart('mapInitial'));
    return ApiService.getAllDevices()
      .then(data => {
        dispatch(indicatorEnd('mapInitial'));
        dispatch(loadDeviceSuccess(data));
        if (data && data.items) {
          const deviceIds = data.items.map(device => device.Id);
          dispatch(
            telemetryActions.loadTelemetryMessagesByDeviceIds(deviceIds)
          );
          dispatch(loadDeviceMapAlaramsList(deviceIds));
        }
      })
      .catch(error => {
        dispatch(loadFailed(error));
        throw error;
      });
  };
};

export const loadDeviceMapAlaramsList = (deviceList, timeRange) => {
  return dispatch => {
    return deviceList === lang.ALLDEVICES
      ? ApiService.getAlarms({
          from: `NOW-${timeRange}`,
          to: 'NOW',
          order: 'desc'
        })
          .then(data => {
            dispatch({
              type: types.LOAD_DEVICE_TELEMETRY_SUCCESS,
              data
            });
          })
          .catch(error => {
            dispatch(loadFailed(error));
            throw error;
          })
      : ApiService.getAlarms({
          from: `NOW-${timeRange}`,
          to: 'NOW',
          devices: deviceList,
          order: 'desc'
        })
          .then(data => {
            dispatch({
              type: types.LOAD_DEVICE_TELEMETRY_SUCCESS,
              data
            });
          })
          .catch(error => {
            dispatch(loadFailed(error));
            throw error;
          });
  };
};

export const loadDevices = () => {
  return dispatch => {
    dispatch(indicatorStart('mapInitial'));
    return ApiService.getAllDevices()
      .then(data => {
        dispatch(indicatorEnd('mapInitial'));
        dispatch(loadDeviceSuccess(data));
      })
      .catch(error => {
        dispatch(loadFailed(error));
        throw error;
      });
  };
};

export const loadDeviceGroup = () => {
  return dispatch => {
    return ApiService.getDeviceGroup()
      .then(devices => {
        dispatch(loadDeviceGroupSuccess(devices));
      })
      .catch(error => {
        dispatch(loadFailed(error));
        throw error;
      });
  };
};

export const updateDevices = devices => {
  return dispatch => {
    return dispatch({
      type: types.UPDATE_DEVICE_LIST,
      devices
    });
  };
};

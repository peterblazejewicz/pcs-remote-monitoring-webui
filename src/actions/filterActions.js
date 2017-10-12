// Copyright (c) Microsoft. All rights reserved.

import * as types from './actionTypes';
import { loadFailed } from './ajaxStatusActions';
import { loadDeviceSuccess } from './deviceActions';
import { indicatorStart, indicatorEnd } from './indicatorActions';
import ApiService from '../common/apiService';
import * as telemetryActions from './telemetryActions';
import lang from '../common/lang';

function setDefaultDeviceGroupId(dispatch, deviceGroups){
  if (deviceGroups.length > 0) {
    let defaultGroupId = '';
    deviceGroups.some(({ Id, Conditions }) => {
      if (Conditions.length === 0) {
        defaultGroupId = Id;
        return true;
      }
      return false;
    });
    defaultGroupId = defaultGroupId || deviceGroups[0].Id;
    dispatch({
      type: types.DEVICE_GROUP_CHANGED,
      data: defaultGroupId
    });
  }
}

export const getRegionByDisplayName = deviceGroup => {
  return dispatch => {
    dispatch(indicatorStart('mapInitial'));
    return ApiService.getRegionByDisplayName(deviceGroup)
      .then(data => {
        dispatch(indicatorEnd('mapInitial'));
        //Creating the action inline for readability purposes
        dispatch({
          type: types.LOAD_DEVICE_GROUPS_SUCCESS,
          data: data.items
        });
        setDefaultDeviceGroupId(dispatch, data.items);
      })
      .catch(error => {
        dispatch(loadFailed(error));
        throw error;
      });
  };
};

export const loadRegionSpecificDevices = (selectedGroupConditions, groupId) => {
  return dispatch => {
    dispatch({
      type: types.DEVICE_GROUP_CHANGED,
      data: groupId
    });
    dispatch(indicatorStart('mapInitial'));
    dispatch(indicatorStart('kpiInitial'));
    selectedGroupConditions.length === 0
      ? ApiService.getDevicesForGroup(selectedGroupConditions)
        .then(data => {
          dispatch(loadDeviceSuccess(data));
          if (data && data.items) {
            dispatch(
              telemetryActions.loadTelemetryMessagesByDeviceIds(lang.ALLDEVICES)
            );
            dispatch(indicatorEnd('mapInitial'));
            dispatch(indicatorEnd('kpiInitial'));
          }
        })
        .catch(error => {
          dispatch(loadFailed(error));
          throw error;
        })
      : ApiService.getDevicesForGroup(selectedGroupConditions)
        .then(data => {
          dispatch(loadDeviceSuccess(data));
          if (data && data.items) {
            const deviceIds = data.items.map(device => device.Id);
            dispatch(
              telemetryActions.loadTelemetryMessagesByDeviceIds(deviceIds)
            );
            dispatch(indicatorEnd('mapInitial'));
            dispatch(indicatorEnd('kpiInitial'));
          }
        })
        .catch(error => {
          dispatch(loadFailed(error));
          throw error;
        });
  };
};

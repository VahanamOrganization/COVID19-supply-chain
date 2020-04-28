import { contractConstants, authConstants } from "../constants";

export function contract(state = {}, action) {
    switch (action.type) {
        case contractConstants.TRANSACTION_STARTED:
            return {
                ...state,
                inProgress: true
            };
        case contractConstants.TRANSACTION_DONE:
            return {
                ...state,
                inProgress: false
            };
        case contractConstants.TRANSACTION_ERROR:
            return {
                ...state,
                inProgress: false,
                error: action.error
            };
        case contractConstants.ROLE_RESULT:
            return {
                ...state,
                inProgress: false,
                role: action.role
            };
        case contractConstants.GET_CAMPAIGN_RESULT:
            return {
                ...state,
                inProgress: false,
                campaign: action.campaign
            };
        case authConstants.LOGOUT:
            return {};
        default:
            return state;
    }
}

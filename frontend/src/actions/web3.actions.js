import Web3 from "web3";
import config from "config";
import { history } from "../helpers";
import { alertActions } from "./";
import { web3Constants } from "../constants";
import campaignGenerator from "../assets/contracts/CampaignGenerator.json";

export const web3Actions = {
    loadWeb3,
    loadAccount,
    loadNetwork
};

function loadAccount() {
    return async (dispatch, getState) => {
        dispatch(started());
        let account;
        try {
            const { web3 } = getState().web3;
            const accounts = await web3.eth.getAccounts();
            account = accounts[0];
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            let error = "Could not load Web3 Account";
            dispatch(alertActions.error(error));
            return;
        }
        dispatch(loaded({account}));
        dispatch(alertActions.success("Reloaded Web3 Account"));
    };
}

function loadNetwork() {
    return async (dispatch, getState) => {
        dispatch(started());
        let networkId;
        try {
            const { web3 } = getState().web3;
            networkId = await web3.eth.net.getId();
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            let error = "Could not load Web3 Account";
            dispatch(alertActions.error(error));
            return;
        }
        if (networkId !== config.networkId) {
            let error = "Incorrect NetworkID, Expecting " + config.networkId;
            dispatch(failure(error));
            dispatch(alertActions.error(error));
            return;
        }
        dispatch(loaded({networkId}));
        dispatch(alertActions.success("Reloaded Web3 Network"));
    };
}

function loadWeb3() {
    return async dispatch => {
        dispatch(started());
        let web3;
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else {
            let error = "MetaMask not found";
            dispatch(failure(error));
            dispatch(alertActions.error(error));
            return;
        }
        let account;
        try {
            const accounts = await web3.eth.getAccounts();
            account = accounts[0];
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            let error = "Could not load Web3 Account";
            dispatch(alertActions.error(error));
            return;
        }
        let networkId;
        try {
            networkId = await web3.eth.net.getId();
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            let error = "Could not load Web3 Network";
            dispatch(alertActions.error(error));
            return;
        }
        if (networkId !== config.networkId) {
            let error = "Incorrect NetworkID, Expecting " + config.networkId;
            dispatch(failure(error));
            dispatch(alertActions.error(error));
            return;
        }
        let contract;
        try {
            contract = await new web3.eth.Contract(
                campaignGenerator["abi"],
                config.contractAddress,
                {
                    from: account
                }
            );
        } catch (e) {
            console.log(e);
            dispatch(failure(e));
            let error = "Could not load CampaignGenerator Contract";
            dispatch(alertActions.error(error));
            return;
        }
        dispatch(loaded({web3, account, networkId, contract}));
        dispatch(alertActions.success("Web3 Connected"));
        return contract;
    };

}

function started() {
    return {
        type: web3Constants.WEB3_STARTED
    };
}

function loaded(web3) {
    return {
        type: web3Constants.WEB3_LOADED,
        ...web3
    };
}

function failure(error) {
    return {
        type: web3Constants.WEB3_ERROR,
        error
    };
}

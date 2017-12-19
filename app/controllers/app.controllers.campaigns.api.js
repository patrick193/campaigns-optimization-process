'use strict';

const API_DATA = require('./../api').api_campaigns,
    API_ENDPOINTS = require('./../configs').api_points,
    LogModel = require('./../models').log_model,
    getOptions = require('./../api').api_get_options;


class CampaignsController {

    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    /**
     * getting all or one campaigns
     * @param id
     */
    campaignsAction(id = null) {
        API_DATA.getCampaigns(getOptions(API_ENDPOINTS.getCampaigns, {id: id}))
            .then(campaigns => {
                this.response.send(campaigns);
            })
            .catch(err => {
                console.log(err);
                this.response.statusCode = 500;
                this.response.send("Server Internal error");
            })
    }

    /**
     * getting a resources for campaign
     * @param id
     */
    resourceAction(id) {
        API_DATA.getResource(getOptions(API_ENDPOINTS.getResources, {campaignId: id}))
            .then(resource => {
                this.response.send(resource);
            })
            .catch(err => {
                console.log(err);
                this.response.statusCode = 500;
                this.response.send("Server Internal error");
            })
    }

    /**
     * get a logs
     * @param filter
     */
    getLogAction(filter = "desc") {
        if (["DESC", "ASC"].indexOf(filter.toUpperCase()) === -1) {
            filter = "DESC";
        }

        LogModel.findAsync({order: {field: "campaign_id", sort: filter}})
            .then(logs => {
                this.response.send(logs)
            })
            .catch(err => {
                console.log(err);
                this.response.statusCode = 500;
                this.response.send("Server Internal error")
            })

    }
}

module.exports = CampaignsController;
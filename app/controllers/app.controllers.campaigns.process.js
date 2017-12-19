'use strict';

const API_DATA = require('./../api').api_campaigns,
    API_ENDPOINTS = require('./../configs').api_points,
    Logger = require('./../api').logger,
    Range = require('./../api').range,
    getOptions = require('./../api').api_get_options;

const THRESHOLD = 0.5;
let errors = [];


class CampaignsProcessController {

    /**
     * decide whether to update the campaign's "max bid"
     */
    index() {
        API_DATA.getCampaigns(getOptions(API_ENDPOINTS.getCampaigns))//getting all campaigns
            .then(campaigns => {
                return campaigns.map(campaign => {
                    let resources = API_DATA.getResource(getOptions(API_ENDPOINTS.getResources, {campaignId: campaign.id}));
                    let returnObject = {};

                    returnObject[campaign.id] = resources;

                    return returnObject;//return {<string>: Promise.<*>}
                });
            })
            .then(async (campaignWithResources) => {//have all campaigns with there resources
                let forUpdateResources = [];

                for (let data of resourcesWalker(campaignWithResources)) {// decide whether to update
                    let singleForUpdate = await analyzeForUpdate(data);
                    forUpdateResources = forUpdateResources.concat(singleForUpdate);
                }

                return forUpdateResources;
            })
            .then(dataForUpdate => {//have array [{id: <String>, app_id: <String>, bid: <float>}...] where id - campaign id
                dataForUpdate.forEach(singleRecord => {
                    API_DATA.updateCampaign(getOptions(API_ENDPOINTS.updateResource, {campaignId: singleRecord.id}), {//update via put method; see file WTF
                        app_id: singleRecord.app_id,
                        bid: singleRecord.bid
                    })
                        .then(mes => {
                            // save logs
                            Logger.log({
                                campaign_id: singleRecord.id,
                                app_id: singleRecord.app_id,
                                old_bid: 0,//use 0; see wtf file p3
                                new_bid: 1,//use 1; see wtf file p3
                                ratio: singleRecord.bid
                            })
                        })
                        .catch(err => {
                            throw new Error(err);
                        });
                })
            });
    }
}

/**
 * function for deciding what we need update
 * @param {Object} preparedCampaignWithResources {cam: <String>, resources: <Promise>} where cam - campaign id
 * @returns {Promise.<TResult>}
 */
function analyzeForUpdate(preparedCampaignWithResources) {
    return preparedCampaignWithResources.resources
        .then(res => {
            let returnValue = [];
            if (!Array.isArray(res)) {
                errors.push({campaignId: preparedCampaignWithResources.cam, err: res.error});//have an error from server
                return [];
            }
            res.forEach(resource => {
                let range = new Range({impression: resource.impressions, opportunities: resource.opportunities});// using range
                if (range.ratio < THRESHOLD) {
                    returnValue.push({
                        id: preparedCampaignWithResources.cam,
                        app_id: resource.app_id,
                        bid: range.ratio// what value should be for bid?????
                    });
                }
            });

            return returnValue;
        })
}


/**
 * Generator for array like [{<string>: Promise.<*>}]
 * @param resources
 */
function* resourcesWalker(resources) {
    for (let j = 0; j < resources.length; j++) {
        let key = Object.keys(resources[j])[0];
        yield {cam: key, resources: resources[j][key]}
    }
}

module.exports = CampaignsProcessController;
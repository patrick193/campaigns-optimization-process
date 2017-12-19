//as we have a small project, so it's no sence to split endpoints
module.exports = {
    getCampaigns: {
        method: 'GET',
        point: '/campaigns'
    },
    getResources: {
        method: 'GET',
        point: '/campaigns/{campaignId}/stats/apps'
    },
    updateResource: {
        method: 'PUT',
        point: '/campaigns/{campaignId}/update_bid'
    }
};
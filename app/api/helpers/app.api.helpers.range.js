'use strict';

/**
 * Range class for calculating;
 * somthing like https://martinfowler.com/eaaDev/Range.html
 */
class Range {
    constructor({
                    impression = 0,
                    opportunities = 0
                } = {}) {
        this.impression = impression;
        this.opportunities = opportunities;
    }

    /**
     * calculate ratio
     * @returns {number}
     */
    get ratio() {
        return (this.impression / this.opportunities);
    }
}

module.exports = Range;
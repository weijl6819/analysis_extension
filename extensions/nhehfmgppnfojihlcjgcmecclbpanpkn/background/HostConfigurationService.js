"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HostConfigurationService {
    getHostConfiguration() {
        //TODO (srulyt, 2017-01-20) fetch feature switches from versioned endpoint as soon as we have login support 
        return new Promise((resolve) => resolve({ featureSwitches: {} }));
    }
}
exports.HostConfigurationService = HostConfigurationService;
//# sourceMappingURL=HostConfigurationService.js.map
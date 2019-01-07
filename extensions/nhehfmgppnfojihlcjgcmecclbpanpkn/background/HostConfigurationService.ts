export class HostConfigurationService {
    public getHostConfiguration():Promise<any>{
        //TODO (srulyt, 2017-01-20) fetch feature switches from versioned endpoint as soon as we have login support 
        return new Promise((resolve) => resolve({ featureSwitches: {} }));
    }
}
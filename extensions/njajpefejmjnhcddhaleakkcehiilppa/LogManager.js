function LogManager(){ //jshint ignore: line
    function logErrorMessage(message){
        console.log("ERROR: " + message);
    }

    function logDebugMessage(message){
        console.log("DEBUG: " + message);
    }

    this.logErrorMessage = logErrorMessage;
    this.logDebugMessage = logDebugMessage;

    return this;
}

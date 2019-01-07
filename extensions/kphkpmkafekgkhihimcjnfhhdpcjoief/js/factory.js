angular
    .module('bearApp')
    .factory('someFactory', someFactory);

function someFactory($http) {
    return {
        sayhello : function(){
            console.log('say hello test');
        }
    }
}

window.location.href = 'javascript: (' + doAllTheStuff.toString() + ')();';

function doAllTheStuff() {
    window.URL.createObjectURLOld = window.URL.createObjectURL;
    window.URL.createObjectURL = function(obj) {
        console.log("Creating object URL:", obj);
        window.lastRevoked = obj;
        return window.URL.createObjectURLOld(obj);
    }
}
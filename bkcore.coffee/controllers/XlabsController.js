var Xlabs={};
Xlabs.isXlabReady = false;
Xlabs.isCamOn = false;

Xlabs.webCamController = function(){
    this.roll = 0;
    this.isFaceDetected = true;
    this.autoAcc = false;
    this.init();
    this.breakPointsX = [-1.0,-0.8,-0.5,0,0.5,0.8,1.0];
    this.breakPointsY = [-1.0,-0.8,-0.5,0,0.5,0.8,1.0];
}

Xlabs.webCamController.prototype={
    onApiState : function(state){
        this.roll= state.kvHeadRoll;
//        this.isFaceDetected = state.
//        console.log(this.roll);
    },
    init : function(){
        var self = this;
        if(Xlabs.isXlabReady){
            window.postMessage({target:"xLabs", payload:{overlayEnabled:0}}, "*" );
            window.postMessage({target:"xLabs", payload:{overlayMode:0}}, "*");
            window.postMessage({target:"xLabs", payload:{realtimeEnabled:1}}, "*");
            window.postMessage({target:"xLabs", payload:{pinpointEnabled:0}}, "*" );
            document.addEventListener( "xLabsApiState", function( event ){self.onApiState( event.detail );});
            Xlabs.isCamOn = true;
        }
    },
    close : function(){
        if(Xlabs.isXlabReady){
            window.postMessage({target:"xLabs", payload:{realtimeEnabled:0}}, "*");
        }
    }
}

Xlabs.onApiReady = function(){
    Xlabs.isXlabReady=true;
}

Xlabs.convertValue = function (value){
    var result;
    if(value>0){
        result =  1/ (1+Math.pow(Math.E,(-(8*(value-0.5))) ));  //'e^(-(14（x-0.5）))'
    }
    else{
        result= - 1/ (1+Math.pow(Math.E,(-(8*(-value-0.5))) ));
    }
    return result;
}
document.addEventListener( "xLabsApiReady", function(){Xlabs.onApiReady();});


Xlabs.convertValue2 = function(input, breakPointsX, breakPointsY){
    if (input>breakPointsX[breakPointsX.length-1]){
        return breakPointsY[breakPointsY.length-1];
    }
    else if(input<breakPointsX[0]){
        return breakPointsY[0];
    }
    else{
        for(var i = 0; i<breakPointsX.length; i++){
            if(input>=breakPointsX[i] && input<breakPointsX[i+1]){
                p = (breakPointsY[i+1]-breakPointsY[i]) / (breakPointsX[i+1]-breakPointsX[i]);
                return input*p;
            }
        }
    }
}

$(window).bind("beforeunload", function() {
//    window.hexGL.components.shipControls.xlabController.close();
    if(Xlabs.isCamOn){
        window.postMessage({target:"xLabs", payload:{realtimeEnabled:0}}, "*");
        Xlabs.isCamOn=false
    }
//    return confirm("Do you really want to close?");
})
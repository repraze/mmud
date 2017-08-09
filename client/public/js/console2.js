const isMobile = ('ontouchstart' in document.documentElement);
var app = angular.module('MMUDApp', []);

app.factory('socket', ['$rootScope', function($rootScope){
    class Socket{
        constructor(settings){
            this.settings = Object.assign({
                origin  : window.location.origin,
                port    : 8888
            }, settings);
            this.socket = io(this.url);
        }
        on(eventName, callback){
            this.socket.on(eventName, function(){
                var args = arguments;
                $rootScope.$apply(function(){callback.apply(this.socket, args);}.bind(this));
            }.bind(this));
        }
        emit(eventName, data, callback){
            this.socket.emit(eventName, data, function(){
                var args = arguments;
                $rootScope.$apply(function(){
                    if(callback){callback.apply(this.socket, args);}
                }.bind(this));
            }.bind(this));
        }
        get url(){
            return this.settings.origin+':'+this.settings.port;
        }
    }

    return Socket;
}]);

app.component('console', {
    controller: ["$scope", "socket", function($scope, socket){
        var $ctrl = this;
        var settings = Object.assign({
            max : 100,
            lineWidth : 80
        }, settings);

        var client = new socket();
        $scope.title = client.url;
        $scope.lines = [];
        $scope.action = "";

        var count = 0;
        var add = function(str){
            console.log(str);
            $scope.lines.push({text : str});
            return ;
            if(str.indexOf("\n")==-1){
                lines[lines.length-1]+=str;
            }else{
                str.split(/\r?\n/).forEach(function(line){
                    lines[lines.length-1]+=line;
                    if(line !== ""){
                        lines.push({text : ""});
                    }
                });
            }
        };

        client.on('text', add);

        $ctrl.submit = function(e){
            e.preventDefault();
            var str = $scope.action;
            add(str+"\n");
            if(str !== ""){
                client.emit("action", str);
            }
            $scope.action = "";
            //autosize.update(input);
        };

        $ctrl.inputChange = function(e){
            if(!isMobile && e.which === 13 && !e.shiftKey){
                $ctrl.submit(e);
            }
        };
    }],
    templateUrl: 'templates/console.html'
});

const isMobile = ('ontouchstart' in document.documentElement);

var module = angular.module('console', []);

module.factory('socket', ['$rootScope', function($rootScope){
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

module.component('console', {
    controller: ["$scope", "$element", "$timeout", "socket", function($scope, $element, $timeout, socket){
        var $ctrl = this;
        var settings = Object.assign({
            max : 100,
            lineWidth : 80
        }, settings);

        var client = new socket();

        $scope.title = client.url;
        $scope.lines = [];
        $scope.action = "";
        $scope.connected = false;

        client.on('connect', function(){
            console.log("Connected");
            $scope.connected = true;
        });
        client.on('disconnect', function(){
            console.log("Disconected");
            $scope.connected = false;
        });

        var input = $element.find('textarea')[0];
        var scroller = $element[0].getElementsByClassName('mmud-screen-scroll')[0];

        autosize(input);
        var add = (function(){
            var scroll = function(){
                var h = scroller.scrollHeight;
                scroller.scrollTop = h;
            }
            var last = function(){
                return $scope.lines[$scope.lines.length-1];
            };
            var newLine = function(){
                $scope.lines.push({text : ""});
                if($scope.lines.length > settings.max){
                    $scope.lines.shift();
                }
            };
            newLine();
            var addStr = function(str){
                var linelength = last().text.length;
                var available = settings.lineWidth-linelength;
                if(str.length < available){
                    last().text += str;
                }else{
                    last().text += str.substring(0,available);
                    newLine();
                    addStr(str.substring(available,str.length));
                }
            };
            return function(str){
                var shouldScroll = scroller.scrollHeight===scroller.scrollTop+scroller.offsetHeight;
                if(str.indexOf("\n")==-1){
                    addStr(str);
                }else{
                    str.split(/\r?\n/).forEach(function(line){
                        addStr(line);
                        if(line !== ""){
                            newLine();
                        }
                    });
                }
                if(shouldScroll){
                    $timeout(function(){
                        scroll();
                    }, 0);
                }
            };
        })();

        client.on('text', add);

        $ctrl.submit = function(e){
            e.preventDefault();
            var str = $scope.action;
            add(str+"\n");
            if(str !== ""){
                client.emit("action", str);
            }
            $scope.action = "";
            $timeout(function(){
                autosize.update(input);
                input.focus();
            }, 0);
        };

        $ctrl.inputChange = function(e){
            if(!isMobile && e.which === 13 && !e.shiftKey){
                $ctrl.submit(e);
            }
        };
    }],
    templateUrl: 'templates/console.html'
});

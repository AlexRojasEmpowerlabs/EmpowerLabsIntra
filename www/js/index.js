user="nouser";

var myProfile="[]";
todos={};
var module = ons.bootstrap('my-app', ['onsen'],function($httpProvider) {
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */ 
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

    for(name in obj) {
      value = obj[name];

      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  };

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
});
module.controller('AppController', function($scope,$http) {
	
    $scope.miPerfil=function(){
    	$http.get('http://empowerlabs.com/proyectos/helpDesk/getUserData.php?user='+user).
  success(function(data, status, headers, config) {
  	//$scope.ons.notification.alert({message: ""+data.firstname,title: "intellibanks"});
    $myDataProfile=data;
    myProfile=data;
    $scope.mydata = $myDataProfile;
    //ons.notification.alert({message: ''+user, title:"Intellibanks"});
  }).
  error(function(data, status, headers, config) {
  	
  });
    };
});

module.controller('PageController', function($scope) {
	
	ons.ready(function() {
		// Init code here
  	
	});
	
	
	$scope.miPerfil();
}); 

module.controller('MensajeController', function($scope,$timeout,$http) {
	  
  	if(user=="nouser"){
  		 menu.setMainPage('login2.html');
  	}
	$scope.timeInMs = 0;
	$scope.res={};
	$scope.mensajeBox={};
  
    
    $scope.getMensajes=function(){
     $http.get('http://webestoque.com.br/api/chatsend.asmx/GETCHAT?ROOMID=rs9b804f98592a&LAST=2015-05-07%2016:26:00')
                       .success(function (data) {
                       	cad=data.split('<string xmlns="http://174.122.236.154/">');
                       	cad2=cad[1].split('</string>');
                       	s=cad2[0];
						var obj = JSON.parse(s);
                          $scope.res= obj.WEBCHATTEXT.reverse();
                          
                       });
    };
    $scope.getMensajes();
    var countUp = function() {
        $scope.timeInMs+= 500;
        $scope.getMensajes();
        $timeout(countUp, 500);
    };
    $timeout(countUp, 500);
	$scope.nuevoMensaje=function(){
		$scope.ons.navigator.pushPage('nuevoMensaje.html',{animation:'lift'});
	};
	$scope.enviarMensaje=function(){
		//$scope.ons.notification.alert({title:'EmpowerLabsIntra', message:'Enviando ...'});
		$http.get('http://webestoque.com.br/api/chatsend.asmx/SendChat?roomid=rs9b804f98592a&username='+user+'&msg='+$scope.mensajeBox.message)
                       .success(function (data) {
						
    $scope.getMensajes();
	$scope.mensajeBox={};

                       });
	};
}).config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.timeout = 5000;
}]); 

module.controller('newMessageController', function($scope) {
}); 

module.controller('TicketsController', function($scope,$dataTickets,$http) {
  	$scope.items=todos;
	$http.get('http://empowerlabs.com/proyectos/trackersAPI/EmpowerLabsIntra/tickettracker/todos.php').
	success(function(data, status, headers, config){
		
  	data.reverse();
    $dataTickets.items=data;
    todos=data;
    $scope.items = $dataTickets.items; 
	});
}); 

  module.factory('$dataTickets', function() {
      var dataTickets = {};
      		dataTickets.items=todos;
      
      return dataTickets;
  });

module.controller('NewTicketController', function($scope) {
}); 

  
  module.controller('LoginController',function($scope,$http){
  	$scope.formLogin={};
  		$scope.login=function(){
  			$http.get('http://empowerlabs.com/landing-pages/Martin/Usuarios/ingreso.php?nombre='+$scope.formLogin.nombre+'&pass='+$scope.formLogin.pass).
  			success(function(data,status,headers,config){
  				if(data.code=="OK"){
  					user=data.user;
  					//ons.notification.alert({message: ''+data.respuesta, title:"Intellibanks"});
  					$scope.miPerfil();
  					menu.setMainPage('mensajes.html');
  				}
  				else{
  					ons.notification.alert({message: ''+data.respuesta, title:"Intellibanks"});
  				}
  			});
  		};
  		
  });
   module.factory('$myDataProfile', function() {
      var myDataProfile;
      		myDataProfile=myProfile;
      
      return myDataProfile;
  });


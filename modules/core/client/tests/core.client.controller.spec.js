"use strict";
beforeEach(module("data-uploader"));
describe("CoreController", function() {
  beforeEach(module("core"));

  var $q;
  var $scope;
  var deferred;
  var coreCtrl;
  var client1;
  var client2;
  var location;
  beforeEach(
    inject(function($controller, _$rootScope_, _$q_) {
      $q = _$q_;
      $scope = _$rootScope_.$new();

      client1 = {
        Name: "Medicins Sans Frontieres",
        Acronym: "MSF",
        _id: 1
      };

      client2 = {
        Name: "Taronga",
        Acronym: "TZ",
        _id: 2
      };

      var auth = {
        authenticate: function() {
          return true;
        }
      };
      var ClientService = {
        receiveClients: function() {
          deferred = $q.defer();

          deferred.resolve([client1]);
          return deferred.promise;
        },
        removeClient: function() {
          deferred = $q.defer();
          deferred.resolve(client1);
          return deferred.promise;
        }
      };
      location = {
        path: sinon.spy()
      };

      var modalService = {
        createModal: function() {
          deferred = $q.defer();

          deferred.resolve(client2);
          return { result: deferred.promise };
        }
      };

      coreCtrl = $controller("CoreCtrl", {
        ClientService: ClientService,
        authentication: auth,
        ModalService: modalService,
        $scope: $scope,
        $location: location
      });
    })
  );

  it("should set vm.clients on activation", function() {
    $scope.$apply();

    expect(coreCtrl.clients).to.eql([client1]);
  });

  it("should add a client to vm.clients", function() {
    coreCtrl.addClientModal();
    $scope.$apply();

    expect(coreCtrl.clients).to.eql([client1, client2]);
  });

  it("should remove a client from vm.clients", function() {
    coreCtrl.addClientModal();
    $scope.$apply();

    coreCtrl.deleteClientModal();
    $scope.$apply();

    expect(coreCtrl.clients).to.eql([client2]);
  });

  it("should select the right client when opening the client page", function() {
    $scope.$apply();
    coreCtrl.openClientPage(1);
    sinon.assert.calledOnce(location.path);
    sinon.assert.calledWith(location.path, "/client/MSF/");
  });
});

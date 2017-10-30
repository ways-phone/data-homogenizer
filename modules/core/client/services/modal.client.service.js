(function() {
  "use strict";

  angular.module("core").factory("ModalService", ModalService);

  ModalService.$inject = ["$document", "$uibModal"];

  function ModalService($document, $uibModal) {
    var service = {
      createModal: createModal,
      markModalClosed: markModalClosed
    };

    return service;

    function createModal(config) {
      return returnModal(createModalConfig(config));
    }

    function returnModal(modalConf) {
      var parentElem = angular.element($document[0].querySelector(".base"));
      var config = {
        animationsEnable: true,
        ariaLabelledBy: "panel-heading",
        ariaDescribedBy: "panel-body",
        templateUrl: modalConf.templateUrl,
        controller: modalConf.ctrlName,
        controllerAs: "vm",
        size: modalConf.size,
        backdrop: modalConf.backdrop || "static",
        appendTo: parentElem
      };
      if (!!modalConf.resolve) {
        config.resolve = modalConf.resolve;
      }
      return $uibModal.open(config);
    }

    // Re-enables the open modal button
    function markModalClosed(modalState, result, name) {
      result.finally(function() {
        modalState[name] = false;
      });
    }

    // Sends the Client and Campaign to the Modal CTRL
    function createResolve(data) {
      return { data: data };
    }

    // Creates a Modal Instance
    function createModalInstance(modalConfig) {
      return createModal(modalConfig);
    }

    // Specifies the modal view and controller
    function createModalConfig(config) {
      if (config.modalState) {
        config.modalState[config.name] = true;
      }
      var lower = config.name.toLowerCase();
      var location = config.location || lower;
      var ctrl = (config.name.replace("-", "") + "Controller").toString();
      return {
        ctrlName: ctrl,
        templateUrl:
          "/" + location + "/client/views/" + lower + ".client.view.html",
        size: config.size || "xl",
        resolve: createResolve(config.resolve),
        backdrop: config.backdrop || "static"
      };
    }

    function closeModal(instance, data) {
      instance.close(data);
    }
  }
})();

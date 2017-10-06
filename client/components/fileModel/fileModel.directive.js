export default angular.module('kupikiHotspotAdminApp.fileModel', [])
  .directive('fileModel', fileModelDirective)
  .name;

fileModelDirective.$inject = ['$parse'];
function fileModelDirective($parse) {
  var directive = {
    restrict: 'A',
    link: link
  };
  return directive;

  function link(scope, element, attrs) {
    var model = $parse(attrs.fileModel);
    var modelSetter = model.assign;

    element.bind('change', function(){
        scope.$apply(function(){
            modelSetter(scope, element[0].files[0]);
        });
      });
  }
}

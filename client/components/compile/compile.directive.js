export default angular.module('kupikiHotspotAdminApp.compile', [])
  .directive('compile', compileHTML)
  .name;

compileHTML.$inject = ['$compile'];
function compileHTML($compile) {
  var directive = {
    restrict: 'A',
    link: compileFunction
  };
  return directive;

  function compileFunction(scope, element, attrs) {
    scope.$watch(
      function(scope) {
        return scope.$eval(attrs.compile);
      },
      function(value) {
        element.html(value);
        $compile(element.contents())(scope);
      }
    );
  }
}

'use strict';

angular.module('db-monitor', ['chayka-modals', 'chayka-utils'])
    .controller('db_monitor', ['$scope', '$timeout', 'modals', 'utils', function($scope, $timeout, modals, utils){
        angular.extend($scope, {

            _: {
                dbMonitorModal: null
            },

            tree: {
                title: 'Wordpress',
                items: [],
                time: 0,
                total: 0
            },

            parseQueries: function(rawQueries) {
                rawQueries = rawQueries || window.Chayka.DB.queries || [];
                var queries = [];
                var tree = $scope.tree;
                var pathArr = [];
                for (var i = 0, c = rawQueries.length; i < c; i++) {
                    var raw = rawQueries[i];
                    var sql = raw[0];
                    sql = sql.replace(/\s+(FROM|LEFT|RIGHT|INNER|OUTER|CROSS|WHERE|ORDER|GROUP|HAVING|LIMIT|OR|VALUES)\b/g, '\n$1');
                    sql = sql.replace(/\s+(AND)\b/g, '\n  $1');
                    var time = raw[1];
                    var path = raw[2].split(', ');
                    var query = {
                        sql: sql,
                        time: time,
                        path: path
                    };
                    queries.push(query);
                    var node = null;
                    for (var j = 0, cc = path.length; j < cc; j++) {
                        var part = path[j];
                        var parentNode = j ? utils.getItem(pathArr, j - 1) : tree;
                        node = utils.getItem(pathArr, j);
                        if (!node || node.title !== part) {
                            node = {
                                'title': part,
                                items: [],
                                time: 0,
                                total: 0
                            };
                            parentNode.items.push(node);
                            pathArr[j] = node;
                            pathArr = pathArr.slice(0, j + 1);
                        }
                    }
                    node.items.push({
                        sql: sql,
                        time: time
                    });

                    for (j = path.length - 1; j >= 0; j--) {
                        node = pathArr[j];
                        node.time += time;
                        node.total++;
                    }
                    tree.time += time;
                    tree.total++;
                }

            },

            showMonitor: function(){
                $scope._.dbMonitorModal.show();
                window.localStorage.openDbMonitor = '1';
            },

            hideMonitor: function(){
                window.localStorage.openDbMonitor = '';
            }
        });

        $scope.parseQueries();

        if(window.localStorage.openDbMonitor){
            $timeout($scope.showMonitor, 300);
        }

        utils.ensure('Chayka.DB', {
            showMonitor: function(){
                $scope.showMonitor();
                $scope.$apply();
            }
        });

    }])
    .directive('dbMonitorNode', ['utils', function(utils){
        return {
            restrict: 'AE',
            scope: {
                node: '=dbMonitorNode'
            },
            replace: true,
            template:
                '<div class="node" data-ng-class="{open: !!unfold, sql: !!node.sql, func: !!node.title}" data-ng-init="unfold=($parent && !!$parent.unfold && $parent.node.items.length===1)">' +
                '   <div class="item" data-ng-click="unfoldNode()" data-ng-style="{color: getColor()}">' +
                '       <span class="time">{{node.time | number : 5 }}</span> ' +
                '       <span class="title">{{node.title}}</span> ' +
                '       <span class="sql">{{node.sql}}</span> ' +
                '       <span class="total">{{node.total || ""}}</span>' +
                '   </div>' +
                '   <div class="items">' +
                '       <div data-ng-repeat="item in getItems()" data-db-monitor-node="item" >' +
                '       </div>' +
                '   </div>' +
                '</div>',
            controller: ['$scope', function($scope){
                angular.extend($scope, {
                    //unfold: false,

                    unfoldNode: function(){
                        $scope.unfold = !$scope.unfold;
                        if($scope.unfold){
                            $scope.$broadcast('dbMonitor.nodeUnfolded');
                        }
                    },

                    getColor: function(){
                        return $scope.$parent.node && 'hsl(240, '+ Math.round(100 * $scope.node.time / $scope.$parent.node.time) +'%, 50%)' || 'black';
                        //child.find('> .item').css('color', 'hsl(240, '+ Math.round(100 * node.items[i].time / node.time) +'%, 50%)');
                    },

                    getItems: function(){
                        return $scope.unfold && $scope.node.items || [];
                    }
                });

                $scope.$on('dbMonitor.nodeUnfolded', function(){
                    if($scope.node && $scope.node.items && $scope.node.items.length === 1 && !$scope.unfold){
                        $scope.unfoldNode();
                    }
                });
                //$element.find('>.item').css('color', $scope.getColor());
            }],

            compile: function(element){
                return utils.recursiveDirectiveCompile(element);
            }

        };
    }])
;
/**
 * Basket Service
 *
 * Operations around a basket, including retrieve, query
 */
(function(Parse) {
  angular.module('maybe.services')
    .factory('BasketService', [
      '$q',
      '$state',
      'localStorageService',
      'CONSTANTS',
      'NotifyService',
      'LogService',
      'ParseService',
      'AuthService',
      BasketService
    ]);

  function BasketService(
    $q,
    $state,
    localStorageService,
    CONSTANTS,
    NotifyService,
    LogService,
    ParseService,
    AuthService
  ) {
    'use strict';

    var
      _myBaskets = [],
      _allBaskets = [];

    /**
     * General error handler
     * @param response
     * @returns {Promise}
     * @private
     */
    function _findErrorHandler(response) {
      LogService.log($state, null, response);
      return response;
    }

    /**
     * Collect comments and votes for an item
     * @param {object} item
     * @returns {Promise}
     * @private
     */
    function _compileItem(item) {
      var promises = [];
      var commentQuery = {
        type: 'query',
        className: 'Comment',
        equalTo: {
          'item': item,
          'softDeleted': null
        },
        include: ['voter']
      };
      var yesVoteQuery = {
        type: 'count',
        className: 'Vote',
        equalTo: {
          'item': item,
          'vote': true,
          'softDeleted': null
        },
        include: ['voter']
      };
      var noVoteQuery = {
        type: 'count',
        className: 'Vote',
        equalTo: {
          'item': item,
          'vote': false,
          'softDeleted': null
        },
        include: ['voter']
      };

      if (item) {
        promises.push(ParseService.query(commentQuery));
        promises.push(ParseService.query(yesVoteQuery));
        promises.push(ParseService.query(noVoteQuery));
      } else {
        return (new Parse.Promise()).reject(null);
      }

      return Parse.Promise.when(promises)
        .then(
          function(promises) {
            var comments = promises[0];
            var yesVoteCount = promises[1];
            var noVoteCount = promises[2];

            item.comments = comments;
            item.yesCount = yesVoteCount;
            item.noCount = noVoteCount;

            return item;
          }
        );
    }

    /**
     * Helper method to sort items, votes, comments, activity feed in a basket
     * @param basket
     * @returns {Promise}
     * @private
     */
    function _findItems(basket) {
      var
        itemPromise = null,
        commentPromise = null,
        votePromise = null,
        itemQuery = {
          type: 'query',
          className: 'Item',
          equalTo: {
            'basket': basket,
            'softDeleted': null
          },
          select: ['name', 'context', 'image', 'basket', 'location', 'price', 'retailer', 'symbol', 'title', 'url', 'shopper'],
          descending: ['updatedAt'],
          include: ['basket']
        },
        commentQuery = {
          type: 'query',
          className: 'Comment',
          equalTo: {
            'basket': basket,
            'softDeleted': null
          },
          include: ['voter'],
          descending: ['createdAt']
        },
        voteQuery = {
          type: 'query',
          className: 'Vote',
          equalTo: {
            'basket': basket,
            'softDeleted': null
          },
          include: ['voter'],
          descending: ['createdAt']
        };

      if (basket) {
        itemPromise = ParseService
          .query(itemQuery)
          .then(
            function(items) {
              basket.items = items;
              return items;
            }
          );

        commentPromise = ParseService
          .query(commentQuery)
          .then(
            function(comments) {
              basket.comments = comments;
              return comments;
            }
          );

        votePromise = ParseService
          .query(voteQuery)
          .then(
            function(votes) {
              basket.votes = votes;
              return votes;
            }
          );

        return $q
          .all([itemPromise, commentPromise, votePromise])
          .then(
            function(promises) {
              return itemPromise.then(
                function(items) {
                  angular.forEach(items, function(item) {
                    var
                      itemComments,
                      itemYesCount,
                      itemNoCount,
                      itemFeed = [];

                    item.votes = [];
                    itemComments = basket.comments.filter(function(comment) {
                      if (item.id === comment.get('item').id) {
                        itemFeed.push(comment);
                        return true;
                      } else {
                        return false;
                      }
                    });

                    itemYesCount = basket.votes.filter(function(vote) {
                      if ((item.id === vote.get('item').id) && vote.get('vote')) {
                        item.votes.push(vote);
                        itemFeed.push(vote);
                        return true;
                      } else {
                        return false;
                      }
                    }).length;

                    itemNoCount = basket.votes.filter(function(vote) {
                      if ((item.id === vote.get('item').id) && !vote.get('vote')) {
                        item.votes.push(vote);
                        itemFeed.push(vote);
                        return true;
                      } else {
                        return false;
                      }
                    }).length;

                    item.comments = itemComments;
                    item.yesCount = itemYesCount;
                    item.noCount = itemNoCount;
                    item.feed = itemFeed;
                  });

                  return basket;
                }
              );
            }
          );
      } else {
        return {};
      }
    }

    /**
     * Find all baskets that belong to current user
     * @returns {Promise}
     * @private
     */
    function _findMine(sort, limit, offset) {
      var
        currentUser = ParseService.current(),
        basketQuery = {
          type: 'query',
          className: 'Basket',
          equalTo: {
            'shopper': currentUser
          },
          notEqualTo: {
            'objectId': currentUser && currentUser.attributes.suggestionBasket ? currentUser.attributes.suggestionBasket.id : null,
            'softDeleted': true
          },
          select: ['name', 'context', 'privacy', 'lastCommentAddedAt', 'lastItemAddedAt'],
          limit: limit ? limit : 1000,
          skip: offset ? offset : 0
        };

      if (sort) {
        basketQuery['ascending'] = sort;
      } else {
        basketQuery['descending'] = ['isWelcomeBasket', 'lastItemAddedAt', 'updatedAt'];
      }

      if (offset === 0) { _myBaskets = []; }

      return ParseService.query(basketQuery)
        .then(
          function(baskets) {
            if (limit) {
              _myBaskets = _myBaskets.concat(baskets);
              return _myBaskets;
            } else {
              return baskets;
            }
          }
        );
    }

    /**
     * Find all public baskets
     * @returns {Promise}
     * @private
     */
    function _findPublic(limit, offset) {
      var basketQuery = {
        type: 'query',
        className: 'Basket',
        notEqualTo: {
          'privacy': CONSTANTS.BASKET.PRIVACY.SECRET,
          'latestItem': null,
          'softDeleted': true
        },
        descending: ['lastItemAddedAt'],
        select: ['name', 'context', 'privacy', 'lastCommentAddedAt', 'lastItemAddedAt', 'shopper'],
        include: ['shopper'],
        limit: limit ? limit : 1000,
        skip: offset ? offset : 0
      };

      if (offset === 0) { _allBaskets = []; }

      return ParseService.query(basketQuery)
        .then(
          function(baskets) {
            _allBaskets = _allBaskets.concat(baskets);
            return _allBaskets;
          }
        );
    }

    /**
     * Get a basket
     * @param {string} id
     * @param {boolean} organizeItems - flag to whether compile the items within a basket or not
     * @returns {*}
     * @private
     */
    function _get(id, organizeItems) {
      var basketQuery = {
        type: 'first',
        className: 'Basket',
        equalTo: {
          'objectId': id
        },
        notEqualTo: {
          'softDeleted': true
        },
        select: ['name', 'context', 'privacy', 'lastCommentAddedAt', 'lastItemAddedAt', 'shopper'],
        include: ['shopper']
      };

      if (organizeItems) {
        return ParseService
          .query(basketQuery)
          .then(_findItems, _findErrorHandler);
      } else {
        return ParseService.query(basketQuery);
      }
    }

    /**
     * Create a basket
     * @param name
     * @param context
     * @param privacy
     * @private
     */
    function _create(name, context, privacy) {
      var Basket = Parse.Object.extend('Basket');
      var basket = new Basket();
      var currentUser = Parse.User.current();

      NotifyService.notify(CONSTANTS.EVENTS.LOADING.START, '');

      basket.setACL(ParseService.configACL([currentUser]));
      basket.set('name', name);
      basket.set('context', context);
      basket.set('shopper', currentUser);
      basket.set('privacy', privacy);

      return basket.save();
    }

    function _findVote(vote, item) {
      var
        currentUser = ParseService.current(),
        voteQuery = {
          type: 'first',
          className: 'Vote',
          equalTo: {
            'item': item,
            'basket': item.get('basket'),
            'voter': currentUser ? currentUser : null
          }
        };

      return ParseService.query(voteQuery);
    }

    /**
     * Place a vote on an item, updates existing vote if user has already voted
     * @param {object} vote
     * @param {object} item
     * @returns {Promise}
     * @private
     */
    function _vote(vote, item) {
      var
        Vote = Parse.Object.extend('Vote'),
        newVote;

      if (!AuthService.currentUser()) {
        localStorageService.set('maybe.' + CONSTANTS.COOKIES.AUTH_DEEPLINK, 'basket.view:' + item.get('basket').id);
        NotifyService.notify(CONSTANTS.EVENTS.AUTH.MODAL.OPEN, {item: item, vote: vote});

        return Parse.Promise.reject('not logged in');
      } else {
        return _findVote(vote, item)
          .then(
            function(oldVote) {
              if (!oldVote) {
                newVote = new Vote();

                newVote.set('vote', vote);
                newVote.set('basket', item.get('basket'));
                newVote.set('item', item);
                newVote.set('voter', ParseService.current());
                return newVote.save();
              } else {
                oldVote.set('vote', vote);
                return oldVote.save();
              }
            }
          ).then(
            function(response) {
              return item.fetch().then(_compileItem);
            }
          );
      }
    }

    /**
     * Add a comment for a user
     * @param {string} comment
     * @param {object} item
     * @returns {Promise}
     * @private
     */
    function _comment(comment, item) {
      var
        Comment = Parse.Object.extend('Comment'),
        newComment;

      if (!ParseService.current()) {
        localStorageService.set('maybe.' + CONSTANTS.COOKIES.AUTH_DEEPLINK, 'basket.view:' + item.get('basket').id);
        NotifyService.notify(CONSTANTS.EVENTS.AUTH.MODAL.OPEN, {item: item, comment: comment});

        return Parse.Promise.reject('not logged in');
      } else {
        newComment = new Comment();
        newComment.set('body', comment);
        newComment.set('basket', item.get('basket'));
        newComment.set('item', item);
        newComment.set('voter', ParseService.current());

        return newComment
          .save()
          .then(
            function(response) {
              return item.fetch().then(_compileItem);
            }
          );
      }
    }

    function _editActivity(data, activity, item) {
      return activity
        .save(data)
        .then(
          function(response) {
            return item.fetch().then(_compileItem);
          }
        );
    }

    function _trashActivity(activity, item) {
      return activity
        .destroy()
        .then(
          function(response) {
            return item.fetch().then(_compileItem);
          }
        );
    }

    /**
     * Returns a set of flags for allowed modifications based on activity type and current user
     * @param {object} activity
     * @returns {{editable: boolean, trashable: boolean}}
     * @private
     */
    function _modifiable(activity) {
      var
        modifiable = {
          editable: false,
          trashable: false
        },
        currentUser = ParseService.current();

      if (currentUser && activity.get('voter')) {
        modifiable.editable = (activity.get('body') && activity.get('voter').id === currentUser.id);
        modifiable.trashable = (activity.get('voter').id === currentUser.id);
      }

      return modifiable;
    }

    return {
      findMine: _findMine,
      findPublic: _findPublic,
      get: _get,
      create: _create,
      findVote: _findVote,
      vote: _vote,
      comment: _comment,
      editActivity: _editActivity,
      trashActivity: _trashActivity,
      modifiable: _modifiable
    };
  }
})(window.Parse);

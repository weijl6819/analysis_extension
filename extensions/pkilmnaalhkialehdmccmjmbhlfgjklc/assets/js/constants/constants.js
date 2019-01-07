(function() {
  angular.module('maybe.constants')
    .factory('CONSTANTS', [function() {
      'use strict';

      return {
        'API_ROOT': '/api/v1',
        'ENDPOINTS': {
          'BASKET': {
            'GET': '/basket/[id]'
          }
        },
        'ACTIONS': {
          'AUTH': {
            'SIGNIN': 'auth.signin',
            'LOGIN': 'auth.login',
            'LOGOUT': 'auth.logout'
          }
        },
        'BASKET': {
          'PRIVACY': {
            'PUBLIC': 'Public',
            'SECRET': 'Secret'
          },
          'LIMIT': 10,
          'PHOTO_LIMIT': 4
        },
        'ITEM': {
          'TELL_ME_MORE': {
            'YES': 'Tell me more...',
            'NO': 'Why not?'
          }
        },
        'STATUSES': {
          'SUCCESS': 0,
          'ERROR_ACCOUNT_EXIST': 202,
          'ERROR_LOGIN': 400,
          'ERROR_ACCESS': 403,
          'ERROR_SEND': 503
        },
        'MESSAGES': {
          'ERROR_CONNECTION': 'Unable to connect, please try again later.',
          'ERROR_PRIVATE': 'Please log in without private/incognito mode enabled.',
          'ERROR_PARSE_INITIALIZE': 'Parse.initialize'
        },
        'COOKIES': {
          'POLICY_DISMISSED': 'cookies.policy.dismissed',
          'INTRO': 'cookies.intro',
          'AUTH_DEEPLINK': 'cookies.auth.deeplink',
          'ONBOARD': 'cookies.onboard',
          'SHARED': 'cookies.shared',
          'MAYBE': 'maybe_user_id'
        },
        'ORIGIN': 'Chrome',
        'EVENTS': {
          'STATE': {
            'CHANGE': 'state.change'
          },
          'COOKIES': {
            'CHANGE': 'cookies.change'
          },
          'PARSE': {
            'READY': 'parse.ready'
          },
          'LOADING': {
            'START': 'loading.start',
            'DONE': 'loading.done'
          },
          'IMAGE': {
            'DONE': 'image.done',
            'ERROR': 'image.error'
          },
          'AUTH': {
            'CHANGE': 'auth.change',
            'MODAL': {
              'OPEN': 'auth.modal.open',
              'CLOSE': 'auth.modal.close'
            },
            'SIGNUP': {
              'SUCCESS': 'auth.signup.success',
              'FAIL': 'auth.signup.fail'
            },
            'SIGNIN': {
              'EMAIL_SENT': 'auth.signup.email.sent',
              'SUCCESS': 'auth.signin.success',
              'FAIL': 'auth.signin.fail'
            },
            'PASSWORD': {
              'SET': {
                'SUCCESS': 'auth.password.set.success',
                'FAIL': 'auth.password.set.fail'
              },
              'RESET': {
                'EMAIL_SENT': 'auth.password.reset.email.sent',
                'EMAIL_FAIL': 'auth.password.reset.email.fail',
                'SUCCESS': 'auth.password.reset.success',
                'FAIL': 'auth.password.reset.fail'
              }
            }
          },
          'SHARE': {
            'OPEN': 'share.open'
          },
          'PARTIAL_LOADING': {
            'START': 'partial_loading.start',
            'DONE': 'partial_loading.done'
          },
          'VOTE': {
            'VOTE': 'vote.vote',
            'VOTED': 'vote.voted',
            'DONE': 'vote.done'
          },
          'COMMENT': {
            'COMMENT': 'comment.comment'
          },
          'ACTIVITY': {
            'EDIT': 'activity.edit',
            'TRASH': 'activity.trash',
            'DONE': 'activity.done'
          },
          'LAYOUT': {
            'REFRESH': 'layout.refresh'
          }
        }
      };
    }]);
})();


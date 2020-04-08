const middleware = {}

middleware['authenticated'] = require('../middleware/authenticated.js')
middleware['authenticated'] = middleware['authenticated'].default || middleware['authenticated']

middleware['logout'] = require('../middleware/logout.js')
middleware['logout'] = middleware['logout'].default || middleware['logout']

middleware['notAuthenticated'] = require('../middleware/notAuthenticated.js')
middleware['notAuthenticated'] = middleware['notAuthenticated'].default || middleware['notAuthenticated']

middleware['profileComplete'] = require('../middleware/profileComplete.js')
middleware['profileComplete'] = middleware['profileComplete'].default || middleware['profileComplete']

middleware['redirection'] = require('../middleware/redirection.js')
middleware['redirection'] = middleware['redirection'].default || middleware['redirection']

export default middleware

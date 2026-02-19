(function () {

function getParameterByName(name, url) {
    if (!url) url = window.location.href
    name = name.replace(/[\[\]]/g, '\\$&')
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

function getCookieValue(a) {
    var b = document.cookie.match('(^|[^;]+)\\s*' + a + '\\s*=\\s*([^;]+)')
    return b ? b.pop() : ''
}

// find first parent with tagName [tagname]
function findParent(tagname, el){
    while (el){
        if ((el.nodeName || el.tagName).toLowerCase()===tagname.toLowerCase()){
          return el
        }
        el = el.parentNode
    }
    return null
}

// remember to set allowed_domains in index.php too
var allowed_domains = ['nozbe.com', 'sliwinski.com', 'productivemag.com', 
'michael.team', 'nozbe.help', 'nooffice.org'];
var top_domain_regexp = new RegExp('^.*?\.?([^\.\/]+\.[^\.\/]+)$')
var top_domain = new URL(location.href).origin.replace(top_domain_regexp, '$1')

var xhr = new XMLHttpRequest()

var ref = getParameterByName('ref')
var campaign = null

if (ref) {
    var ref_matches = ref.match('(.+)\/(.+)')
    if (ref_matches) {
        ref = ref_matches[1]
        campaign = ref_matches[2]
    }
}

var params = {
    id:  getParameterByName('hello_id'),
    data: {
        url: location.href,
        campaign: getParameterByName('campaign') || getParameterByName('c') || 
            campaign || getParameterByName('utm_campaign'),
        aff_code: ref || getParameterByName('a') || getParameterByName('code'),
        http_referer: document.referrer,
        order: window.hello_order,
        user_id: window.hello_user_id
    }
}

var start_time = new Date().getTime()

xhr.open('POST', 'https://hello.' + top_domain)
xhr.withCredentials = true
xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        var response = JSON.parse(xhr.responseText)
//console.log(response)
        if (response && response.user_id) {
            /*var x = 0
            var intervalID = setInterval(function () {
                if (++x === 20 || window.UE) {
                   window.clearInterval(intervalID)
                }
                // update user_id in User.com
                if (window.UE && window.userengage) {
                    userengage('client.update', { user_id: response.user_id })
                }
            }, 200)*/
            var x2 = 0
            var intervalID2 = setInterval(function () {
                if (++x2 === 20 || window.ga) {
                    window.clearInterval(intervalID2)
                }
                // update user_id in GA
                if (window.ga) {
                    ga('set', 'userId', response.user_id)
                    ga('send', 'event', 'authentication', 'user-id available')
                }
            }, 200)
        }
        
        function additionalPost(data) {        
			var xhr = new XMLHttpRequest()
			xhr.open('POST', 'https://hello.' + top_domain)
			xhr.withCredentials = true
			xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
			xhr.send(JSON.stringify(data))
        }
        
        if (response && response.view_id) {
            window.view_hello_event = function(name) {
                additionalPost({
                    view_id: response.view_id,
                    data: {
                        event: name,
                    }
                })
            }
			window.visit_hello_ab_group = function(name) {
                additionalPost({
                    visit_id: response.visit_id,
                    data: {
                        ab_group: name,
                    }
                })
			}
        }
    }
}
xhr.send(JSON.stringify(params))

document.addEventListener('click', function(e){
    var from = findParent('a', e.target || e.srcElement)
    if (from) {
        var href = from.getAttribute('href')
        if (href && href.match('://')) {
            var top_domain_href = new URL(href).origin.replace(top_domain_regexp, '$1')
            if (allowed_domains.indexOf(top_domain_href) !== -1 &&
                top_domain_href !== top_domain) {
                location.href = href + (href.match('[?]') ? '&' : '?') + 'hello_id=' + getCookieValue('hello');
                e.preventDefault()
            }
        }
    }
})

}());

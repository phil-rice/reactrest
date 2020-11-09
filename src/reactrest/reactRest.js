class ReactRestCache {

    /** loader takes a url and returns a promise. The sha of the string is checked against the final segment of the url when loaded,  then evaled
     * The results are remembered in the cache*/
    constructor(httploader, digester) {
        if (!digester) throw Error('Digester not defined')
        if (!httploader) throw Error('httploader not defined')
        this.httploader = httploader
        this.digester = digester
        console.log("ReactRestCache", this.digester)
        this.cache = {}
    }


    findAllRenderUrls(jsonBlob) {    //terribly implemented: should make more efficient
        var result = []
        if (typeof jsonBlob === 'array')
            jsonBlob.forEach(child => result = result.concat(this.findAllRenderUrls(child)))
        else if (typeof jsonBlob === 'object') {
            if (jsonBlob.hasOwnProperty("_render")) {
                for (var key in jsonBlob._render) {
                    result.push(jsonBlob._render[key])
                }
            }
            for (key in jsonBlob) {
                result = result.concat(this.findAllRenderUrls(jsonBlob[key]))
            }
        }
        return result
    }

    loadFromBlob(jsonBlob) {
        var urls = this.findAllRenderUrls(jsonBlob)
        return Promise.all(urls.map(url => this.loadifNeededAndCheck(url)))
    }

    getFromCache(url) {
        return this.cache[url]
    }

    loadifNeededAndCheck(url) {
        if (this.cache.hasOwnProperty(url)) {
            return Promise.resolve(this.cache[url])
        }
        var lastSegment = /([^/]+)$/.exec(url)[1]

        return this.httploader(url).then(string => {
            console.log("httploader", this.digester)

            var digest = this.digester(string) + ""
            console.log("lastSegment was", lastSegment)
            console.log("the digest was", digest)
            if (digest !== lastSegment) throw Error(`Digest mismatch for ${url} actually had ${digest}`)
            try {
                var result = eval(string)

                this.cache[url] = result
                return result
            } catch (e) {
                console.log("have an issue with code from the backend", string)
                console.log("error", e)
                throw e
            }
        })
    }
}


class ReactRest {
    /** Create will usually be React.createElement. Using it via dependency inject to allow testing more easily, and because that decouples this from React
     * reactCache will turn a url into a string. It is 'expected' that this securely changes the url into a string (checking the sha) and has been preloaded because we can't do async in the rendering  */
    constructor(create, reactRestCache, knownUrls) {
        this.create = create
        this.reactRestCache = reactRestCache
        this.knownUrls = knownUrls == null ? [] : knownUrls
    }

    withUrls(newUrls) {
        var newKnownUrls = Object.assign({}, this.knownUrls)
        newKnownUrls = Object.assign(newKnownUrls, newUrls)
        delete newKnownUrls._self
        return new ReactRest(this.create, this.reactRestCache, newKnownUrls)
    }

    renderSelf(obj) {
        return this.renderUsing("_self", obj)
    }

    renderUrl(name, obj) {
        if (obj._render && name in obj._render) return obj._render[name]
        if (name in this.knownUrls) return this.knownUrls[name]
        throw `Cannot find renderUrl for  ${name}`
    }

    renderUsing(name, obj) {
        var renderUrl = this.renderUrl(name, obj)
        var renderClass = this.reactRestCache.getFromCache(renderUrl)
        console.log("renderingUsing has class", name, renderUrl, renderClass)
        var newReact = this.withUrls(obj._render)
        let result = this.create(renderClass, {reactRest: newReact, data: obj});
        console.log("renderingUsing", name, renderUrl, obj)
        console.log("creates", result)
        return result
    }
}

export {ReactRestCache, ReactRest}
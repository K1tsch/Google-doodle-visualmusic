/****  @license! howler.js v2.0.2 | (c) 2013-2016, James Simpson of GoldFire Studios | MIT License | howlerjs.com */
!function() {
    "use strict";		//将"use strict"放在函数体的第一行，则整个函数以"严格模式"运行
    var e = function() {
        this.init()		
    };
    e.prototype = {
        init: function() {
            var e = this || n;	//?
            return e._codecs = {}, e._howls = [], e._muted = !1, e._volume = 1, e._canPlayEvent = "canplaythrough", e._navigator = "undefined" != typeof window && window.navigator ? window.navigator : null, e.masterGain = null, e.noAudio = !1, e.usingWebAudio = !0, e.autoSuspend = !0, e.ctx = null, e.mobileAutoEnable = !0, e._setup(), e
        },
        volume: function(e) {
            var t = this || n;
            if (e = parseFloat(e), t.ctx || _(), "undefined" != typeof e && e >= 0 && e <= 1) {		//ctx：WebAudioAPI的AudioContext()音频文件？
                if (t._volume = e, t._muted) return t;
                t.usingWebAudio && (t.masterGain.gain.value = e);
                for (var o = 0; o < t._howls.length; o++)
                    if (!t._howls[o]._webAudio)
                        for (var r = t._howls[o]._getSoundIds(), u = 0; u < r.length; u++) {
                            var a = t._howls[o]._soundById(r[u]);
                            a && a._node && (a._node.volume = a._volume * e)
                        }
                return t
            }
            return t._volume
        },
        mute: function(e) {
            var t = this || n;
            t.ctx || _(), t._muted = e, t.usingWebAudio && (t.masterGain.gain.value = e ? 0 : t._volume);
            for (var o = 0; o < t._howls.length; o++)
                if (!t._howls[o]._webAudio)
                    for (var r = t._howls[o]._getSoundIds(), u = 0; u < r.length; u++) {
                        var a = t._howls[o]._soundById(r[u]);
                        a && a._node && (a._node.muted = !!e || a._muted)
                    }
            return t
        },
        unload: function() {
            for (var e = this || n, t = e._howls.length - 1; t >= 0; t--) e._howls[t].unload();
            return e.usingWebAudio && e.ctx && "undefined" != typeof e.ctx.close && (e.ctx.close(), e.ctx = null, _()), e
        },
        codecs: function(e) {
            return (this || n)._codecs[e.replace(/^x-/, "")]
        },
        _setup: function() {
            var e = this || n;
            if (e.state = e.ctx ? e.ctx.state || "running" : "running", e._autoSuspend(), !e.usingWebAudio)
                if ("undefined" != typeof Audio) try {
                    var t = new Audio;
                    "undefined" == typeof t.oncanplaythrough && (e._canPlayEvent = "canplay")
                } catch (n) {
                    e.noAudio = !0
                } else e.noAudio = !0;
            try {
                var t = new Audio;
                t.muted && (e.noAudio = !0)
            } catch (e) {}
            return e.noAudio || e._setupCodecs(), e
        },
        _setupCodecs: function() {
            var e = this || n,
                t = null;
            try {
                t = "undefined" != typeof Audio ? new Audio : null
            } catch (n) {
                return e
            }
            if (!t || "function" != typeof t.canPlayType) return e;
            var o = t.canPlayType("audio/mpeg;").replace(/^no$/, ""),
                r = e._navigator && e._navigator.userAgent.match(/OPR\/([0-6].)/g),
                u = r && parseInt(r[0].split("/")[1], 10) < 33;
            return e._codecs = {
                mp3: !(u || !o && !t.canPlayType("audio/mp3;").replace(/^no$/, "")),
                mpeg: !!o,
                opus: !!t.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
                ogg: !!t.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
                oga: !!t.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
                wav: !!t.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""),
                aac: !!t.canPlayType("audio/aac;").replace(/^no$/, ""),
                caf: !!t.canPlayType("audio/x-caf;").replace(/^no$/, ""),
                m4a: !!(t.canPlayType("audio/x-m4a;") || t.canPlayType("audio/m4a;") || t.canPlayType("audio/aac;")).replace(/^no$/, ""),
                mp4: !!(t.canPlayType("audio/x-mp4;") || t.canPlayType("audio/mp4;") || t.canPlayType("audio/aac;")).replace(/^no$/, ""),
                weba: !!t.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""),
                webm: !!t.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""),
                dolby: !!t.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""),
                flac: !!(t.canPlayType("audio/x-flac;") || t.canPlayType("audio/flac;")).replace(/^no$/, "")
            }, e
        },
        _enableMobileAudio: function() {
            var e = this || n,
                t = /iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi/i.test(e._navigator && e._navigator.userAgent),
                o = !!("ontouchend" in window || e._navigator && e._navigator.maxTouchPoints > 0 || e._navigator && e._navigator.msMaxTouchPoints > 0);
            if (!e._mobileEnabled && e.ctx && (t || o)) {
                e._mobileEnabled = !1, e._mobileUnloaded || 44100 === e.ctx.sampleRate || (e._mobileUnloaded = !0, e.unload()), e._scratchBuffer = e.ctx.createBuffer(1, 1, 22050);
                var r = function() {
                    var n = e.ctx.createBufferSource();
                    n.buffer = e._scratchBuffer, n.connect(e.ctx.destination), "undefined" == typeof n.start ? n.noteOn(0) : n.start(0), n.onended = function() {
                        n.disconnect(0), e._mobileEnabled = !0, e.mobileAutoEnable = !1, document.removeEventListener("touchend", r, !0)
                    }
                };
                return document.addEventListener("touchend", r, !0), e
            }
        },
        _autoSuspend: function() {
            var e = this;
            if (e.autoSuspend && e.ctx && "undefined" != typeof e.ctx.suspend && n.usingWebAudio) {
                for (var t = 0; t < e._howls.length; t++)
                    if (e._howls[t]._webAudio)
                        for (var o = 0; o < e._howls[t]._sounds.length; o++)
                            if (!e._howls[t]._sounds[o]._paused) return e;
                return e._suspendTimer && clearTimeout(e._suspendTimer), e._suspendTimer = setTimeout(function() {
                    e.autoSuspend && (e._suspendTimer = null, e.state = "suspending", e.ctx.suspend().then(function() {
                        e.state = "suspended", e._resumeAfterSuspend && (delete e._resumeAfterSuspend, e._autoResume())
                    }))
                }, 3e4), e
            }
        },
        _autoResume: function() {
            var e = this;
            if (e.ctx && "undefined" != typeof e.ctx.resume && n.usingWebAudio) return "running" === e.state && e._suspendTimer ? (clearTimeout(e._suspendTimer), e._suspendTimer = null) : "suspended" === e.state ? (e.state = "resuming", e.ctx.resume().then(function() {
                e.state = "running";
                for (var n = 0; n < e._howls.length; n++) e._howls[n]._emit("resume")
            }), e._suspendTimer && (clearTimeout(e._suspendTimer), e._suspendTimer = null)) : "suspending" === e.state && (e._resumeAfterSuspend = !0), e
        }
    };
    var n = new e,
        t = function(e) {
            var n = this;
            return e.src && 0 !== e.src.length ? void n.init(e) : void console.error("An array of source files must be passed with any new Howl.")
        };
    t.prototype = {
        init: function(e) {
            var t = this;
            return n.ctx || _(), t._autoplay = e.autoplay || !1, t._format = "string" != typeof e.format ? e.format : [e.format], t._html5 = e.html5 || !1, t._muted = e.mute || !1, t._loop = e.loop || !1, t._pool = e.pool || 5, t._preload = "boolean" != typeof e.preload || e.preload, t._rate = e.rate || 1, t._sprite = e.sprite || {}, t._src = "string" != typeof e.src ? e.src : [e.src], t._volume = void 0 !== e.volume ? e.volume : 1, t._duration = 0, t._state = "unloaded", t._sounds = [], t._endTimers = {}, t._queue = [], t._onend = e.onend ? [{
                fn: e.onend
            }] : [], t._onfade = e.onfade ? [{
                fn: e.onfade
            }] : [], t._onload = e.onload ? [{
                fn: e.onload
            }] : [], t._onloaderror = e.onloaderror ? [{
                fn: e.onloaderror
            }] : [], t._onpause = e.onpause ? [{
                fn: e.onpause
            }] : [], t._onplay = e.onplay ? [{
                fn: e.onplay
            }] : [], t._onstop = e.onstop ? [{
                fn: e.onstop
            }] : [], t._onmute = e.onmute ? [{
                fn: e.onmute
            }] : [], t._onvolume = e.onvolume ? [{
                fn: e.onvolume
            }] : [], t._onrate = e.onrate ? [{
                fn: e.onrate
            }] : [], t._onseek = e.onseek ? [{
                fn: e.onseek
            }] : [], t._onresume = [], t._webAudio = n.usingWebAudio && !t._html5, "undefined" != typeof n.ctx && n.ctx && n.mobileAutoEnable && n._enableMobileAudio(), n._howls.push(t), t._autoplay && t._queue.push({
                event: "play",
                action: function() {
                    t.play()
                }
            }), t._preload && t.load(), t
        },
        load: function() {
            var e = this,
                t = null;
            if (n.noAudio) return void e._emit("loaderror", null, "No audio support.");
            "string" == typeof e._src && (e._src = [e._src]);
            for (var r = 0; r < e._src.length; r++) {
                var a, d;
                if (e._format && e._format[r]) a = e._format[r];
                else {
                    if (d = e._src[r], "string" != typeof d) {
                        e._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
                        continue
                    }
                    a = /^data:audio\/([^;,]+);/i.exec(d), a || (a = /\.([^.]+)$/.exec(d.split("?", 1)[0])), a && (a = a[1].toLowerCase())
                }
                if (n.codecs(a)) {
                    t = e._src[r];
                    break
                }
            }
            return t ? (e._src = t, e._state = "loading", "https:" === window.location.protocol && "http:" === t.slice(0, 5) && (e._html5 = !0, e._webAudio = !1), new o(e), e._webAudio && u(e), e) : void e._emit("loaderror", null, "No codec support for selected audio sources.")
        },
        play: function(e, t) {
            var o = this,
                r = null;
            if ("number" == typeof e) r = e, e = null;
            else {
                if ("string" == typeof e && "loaded" === o._state && !o._sprite[e]) return null;
                if ("undefined" == typeof e) {
                    e = "__default";
                    for (var u = 0, a = 0; a < o._sounds.length; a++) o._sounds[a]._paused && !o._sounds[a]._ended && (u++, r = o._sounds[a]._id);
                    1 === u ? e = null : r = null
                }
            }
            var d = r ? o._soundById(r) : o._inactiveSound();
            if (!d) return null;
            if (r && !e && (e = d._sprite || "__default"), "loaded" !== o._state && !o._sprite[e]) return o._queue.push({
                event: "play",
                action: function() {
                    o.play(o._soundById(d._id) ? d._id : void 0)
                }
            }), d._id;
            if (r && !d._paused) return t || setTimeout(function() {
                o._emit("play", d._id)
            }, 0), d._id;
            o._webAudio && n._autoResume();
            var i = Math.max(0, d._seek > 0 ? d._seek : o._sprite[e][0] / 1e3),
                _ = Math.max(0, (o._sprite[e][0] + o._sprite[e][1]) / 1e3 - i),
                s = 1e3 * _ / Math.abs(d._rate);
            d._paused = !1, d._ended = !1, d._sprite = e, d._seek = i, d._start = o._sprite[e][0] / 1e3, d._stop = (o._sprite[e][0] + o._sprite[e][1]) / 1e3, d._loop = !(!d._loop && !o._sprite[e][2]);
            var l = d._node;
            if (o._webAudio) {
                var f = function() {
                        o._refreshBuffer(d);
                        var e = d._muted || o._muted ? 0 : d._volume;
                        l.gain.setValueAtTime(e, n.ctx.currentTime), d._playStart = n.ctx.currentTime, "undefined" == typeof l.bufferSource.start ? d._loop ? l.bufferSource.noteGrainOn(0, i, 86400) : l.bufferSource.noteGrainOn(0, i, _) : d._loop ? l.bufferSource.start(0, i, 86400) : l.bufferSource.start(0, i, _), s !== 1 / 0 && (o._endTimers[d._id] = setTimeout(o._ended.bind(o, d), s)), t || setTimeout(function() {
                            o._emit("play", d._id)
                        }, 0)
                    },
                    c = "running" === n.state;
                "loaded" === o._state && c ? f() : (o.once(c ? "load" : "resume", f, c ? d._id : null), o._clearTimer(d._id))
            } else {
                var p = function() {
                        l.currentTime = i, l.muted = d._muted || o._muted || n._muted || l.muted, l.volume = d._volume * n.volume(), l.playbackRate = d._rate, setTimeout(function() {
                            l.play(), s !== 1 / 0 && (o._endTimers[d._id] = setTimeout(o._ended.bind(o, d), s)), t || o._emit("play", d._id)
                        }, 0)
                    },
                    m = "loaded" === o._state && (window && window.ejecta || !l.readyState && n._navigator.isCocoonJS);
                if (4 === l.readyState || m) p();
                else {
                    var v = function() {
                        p(), l.removeEventListener(n._canPlayEvent, v, !1)
                    };
                    l.addEventListener(n._canPlayEvent, v, !1), o._clearTimer(d._id)
                }
            }
            return d._id
        },
        pause: function(e) {
            var n = this;
            if ("loaded" !== n._state) return n._queue.push({
                event: "pause",
                action: function() {
                    n.pause(e)
                }
            }), n;
            for (var t = n._getSoundIds(e), o = 0; o < t.length; o++) {
                n._clearTimer(t[o]);
                var r = n._soundById(t[o]);
                if (r && !r._paused && (r._seek = n.seek(t[o]), r._rateSeek = 0, r._paused = !0, n._stopFade(t[o]), r._node))
                    if (n._webAudio) {
                        if (!r._node.bufferSource) return n;
                        "undefined" == typeof r._node.bufferSource.stop ? r._node.bufferSource.noteOff(0) : r._node.bufferSource.stop(0), n._cleanBuffer(r._node)
                    } else isNaN(r._node.duration) && r._node.duration !== 1 / 0 || r._node.pause();
                arguments[1] || n._emit("pause", r ? r._id : null)
            }
            return n
        },
        stop: function(e, n) {
            var t = this;
            if ("loaded" !== t._state) return t._queue.push({
                event: "stop",
                action: function() {
                    t.stop(e)
                }
            }), t;
            for (var o = t._getSoundIds(e), r = 0; r < o.length; r++) {
                t._clearTimer(o[r]);
                var u = t._soundById(o[r]);
                if (u && (u._seek = u._start || 0, u._rateSeek = 0, u._paused = !0, u._ended = !0, t._stopFade(o[r]), u._node))
                    if (t._webAudio) {
                        if (!u._node.bufferSource) return n || t._emit("stop", u._id), t;
                        "undefined" == typeof u._node.bufferSource.stop ? u._node.bufferSource.noteOff(0) : u._node.bufferSource.stop(0), t._cleanBuffer(u._node)
                    } else isNaN(u._node.duration) && u._node.duration !== 1 / 0 || (u._node.currentTime = u._start || 0, u._node.pause());
                u && !n && t._emit("stop", u._id)
            }
            return t
        },
        mute: function(e, t) {
            var o = this;
            if ("loaded" !== o._state) return o._queue.push({
                event: "mute",
                action: function() {
                    o.mute(e, t)
                }
            }), o;
            if ("undefined" == typeof t) {
                if ("boolean" != typeof e) return o._muted;
                o._muted = e
            }
            for (var r = o._getSoundIds(t), u = 0; u < r.length; u++) {
                var a = o._soundById(r[u]);
                a && (a._muted = e, o._webAudio && a._node ? a._node.gain.setValueAtTime(e ? 0 : a._volume, n.ctx.currentTime) : a._node && (a._node.muted = !!n._muted || e), o._emit("mute", a._id))
            }
            return o
        },
        volume: function() {
            var e, t, o = this,
                r = arguments;
            if (0 === r.length) return o._volume;
            if (1 === r.length || 2 === r.length && "undefined" == typeof r[1]) {
                var u = o._getSoundIds(),
                    a = u.indexOf(r[0]);
                a >= 0 ? t = parseInt(r[0], 10) : e = parseFloat(r[0])
            } else r.length >= 2 && (e = parseFloat(r[0]), t = parseInt(r[1], 10));
            var d;
            if (!("undefined" != typeof e && e >= 0 && e <= 1)) return d = t ? o._soundById(t) : o._sounds[0], d ? d._volume : 0;
            if ("loaded" !== o._state) return o._queue.push({
                event: "volume",
                action: function() {
                    o.volume.apply(o, r)
                }
            }), o;
            "undefined" == typeof t && (o._volume = e), t = o._getSoundIds(t);
            for (var i = 0; i < t.length; i++) d = o._soundById(t[i]), d && (d._volume = e, r[2] || o._stopFade(t[i]), o._webAudio && d._node && !d._muted ? d._node.gain.setValueAtTime(e, n.ctx.currentTime) : d._node && !d._muted && (d._node.volume = e * n.volume()), o._emit("volume", d._id));
            return o
        },
        fade: function(e, t, o, r) {
            var u = this,
                a = Math.abs(e - t),
                d = e > t ? "out" : "in",
                i = a / .01,
                _ = i > 0 ? o / i : o;
            if (_ < 4 && (i = Math.ceil(i / (4 / _)), _ = 4), "loaded" !== u._state) return u._queue.push({
                event: "fade",
                action: function() {
                    u.fade(e, t, o, r)
                }
            }), u;
            u.volume(e, r);
            for (var s = u._getSoundIds(r), l = 0; l < s.length; l++) {
                var f = u._soundById(s[l]);
                if (f) {
                    if (r || u._stopFade(s[l]), u._webAudio && !f._muted) {
                        var c = n.ctx.currentTime,
                            p = c + o / 1e3;
                        f._volume = e, f._node.gain.setValueAtTime(e, c), f._node.gain.linearRampToValueAtTime(t, p)
                    }
                    var m = e;
                    f._interval = setInterval(function(e, n) {
                        i > 0 && (m += "in" === d ? .01 : -.01), m = Math.max(0, m), m = Math.min(1, m), m = Math.round(100 * m) / 100, u._webAudio ? ("undefined" == typeof r && (u._volume = m), n._volume = m) : u.volume(m, e, !0), m === t && (clearInterval(n._interval), n._interval = null, u.volume(m, e), u._emit("fade", e))
                    }.bind(u, s[l], f), _)
                }
            }
            return u
        },
        _stopFade: function(e) {
            var t = this,
                o = t._soundById(e);
            return o && o._interval && (t._webAudio && o._node.gain.cancelScheduledValues(n.ctx.currentTime), clearInterval(o._interval), o._interval = null, t._emit("fade", e)), t
        },
        loop: function() {
            var e, n, t, o = this,
                r = arguments;
            if (0 === r.length) return o._loop;
            if (1 === r.length) {
                if ("boolean" != typeof r[0]) return t = o._soundById(parseInt(r[0], 10)), !!t && t._loop;
                e = r[0], o._loop = e
            } else 2 === r.length && (e = r[0], n = parseInt(r[1], 10));
            for (var u = o._getSoundIds(n), a = 0; a < u.length; a++) t = o._soundById(u[a]), t && (t._loop = e, o._webAudio && t._node && t._node.bufferSource && (t._node.bufferSource.loop = e, e && (t._node.bufferSource.loopStart = t._start || 0, t._node.bufferSource.loopEnd = t._stop)));
            return o
        },
        rate: function() {
            var e, t, o = this,
                r = arguments;
            if (0 === r.length) t = o._sounds[0]._id;
            else if (1 === r.length) {
                var u = o._getSoundIds(),
                    a = u.indexOf(r[0]);
                a >= 0 ? t = parseInt(r[0], 10) : e = parseFloat(r[0])
            } else 2 === r.length && (e = parseFloat(r[0]), t = parseInt(r[1], 10));
            var d;
            if ("number" != typeof e) return d = o._soundById(t), d ? d._rate : o._rate;
            if ("loaded" !== o._state) return o._queue.push({
                event: "rate",
                action: function() {
                    o.rate.apply(o, r)
                }
            }), o;
            "undefined" == typeof t && (o._rate = e), t = o._getSoundIds(t);
            for (var i = 0; i < t.length; i++)
                if (d = o._soundById(t[i])) {
                    d._rateSeek = o.seek(t[i]), d._playStart = o._webAudio ? n.ctx.currentTime : d._playStart, d._rate = e, o._webAudio && d._node && d._node.bufferSource ? d._node.bufferSource.playbackRate.value = e : d._node && (d._node.playbackRate = e);
                    var _ = o.seek(t[i]),
                        s = (o._sprite[d._sprite][0] + o._sprite[d._sprite][1]) / 1e3 - _,
                        l = 1e3 * s / Math.abs(d._rate);
                    !o._endTimers[t[i]] && d._paused || (o._clearTimer(t[i]), o._endTimers[t[i]] = setTimeout(o._ended.bind(o, d), l)), o._emit("rate", d._id)
                }
            return o
        },
        seek: function() {
            var e, t, o = this,
                r = arguments;
            if (0 === r.length) t = o._sounds[0]._id;
            else if (1 === r.length) {
                var u = o._getSoundIds(),
                    a = u.indexOf(r[0]);
                a >= 0 ? t = parseInt(r[0], 10) : (t = o._sounds[0]._id, e = parseFloat(r[0]))
            } else 2 === r.length && (e = parseFloat(r[0]), t = parseInt(r[1], 10));
            if ("undefined" == typeof t) return o;
            if ("loaded" !== o._state) return o._queue.push({
                event: "seek",
                action: function() {
                    o.seek.apply(o, r)
                }
            }), o;
            var d = o._soundById(t);
            if (d) {
                if (!("number" == typeof e && e >= 0)) {
                    if (o._webAudio) {
                        var i = o.playing(t) ? n.ctx.currentTime - d._playStart : 0,
                            _ = d._rateSeek ? d._rateSeek - d._seek : 0;
                        return d._seek + (_ + i * Math.abs(d._rate))
                    }
                    return d._node.currentTime
                }
                var s = o.playing(t);
                s && o.pause(t, !0), d._seek = e, d._ended = !1, o._clearTimer(t), s && o.play(t, !0), !o._webAudio && d._node && (d._node.currentTime = e), o._emit("seek", t)
            }
            return o
        },
        playing: function(e) {
            var n = this;
            if ("number" == typeof e) {
                var t = n._soundById(e);
                return !!t && !t._paused
            }
            for (var o = 0; o < n._sounds.length; o++)
                if (!n._sounds[o]._paused) return !0;
            return !1
        },
        duration: function(e) {
            var n = this,
                t = n._duration,
                o = n._soundById(e);
            return o && (t = n._sprite[o._sprite][1] / 1e3), t
        },
        state: function() {
            return this._state
        },
        unload: function() {
            for (var e = this, t = e._sounds, o = 0; o < t.length; o++) {
                t[o]._paused || (e.stop(t[o]._id), e._emit("end", t[o]._id)), e._webAudio || (t[o]._node.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=", t[o]._node.removeEventListener("error", t[o]._errorFn, !1), t[o]._node.removeEventListener(n._canPlayEvent, t[o]._loadFn, !1)), delete t[o]._node, e._clearTimer(t[o]._id);
                var u = n._howls.indexOf(e);
                u >= 0 && n._howls.splice(u, 1)
            }
            var a = !0;
            for (o = 0; o < n._howls.length; o++)
                if (n._howls[o]._src === e._src) {
                    a = !1;
                    break
                }
            return r && a && delete r[e._src], n.noAudio = !1, e._state = "unloaded", e._sounds = [], e = null, null
        },
        on: function(e, n, t, o) {
            var r = this,
                u = r["_on" + e];
            return "function" == typeof n && u.push(o ? {
                id: t,
                fn: n,
                once: o
            } : {
                id: t,
                fn: n
            }), r
        },
        off: function(e, n, t) {
            var o = this,
                r = o["_on" + e],
                u = 0;
            if (n) {
                for (u = 0; u < r.length; u++)
                    if (n === r[u].fn && t === r[u].id) {
                        r.splice(u, 1);
                        break
                    }
            } else if (e) o["_on" + e] = [];
            else {
                var a = Object.keys(o);
                for (u = 0; u < a.length; u++) 0 === a[u].indexOf("_on") && Array.isArray(o[a[u]]) && (o[a[u]] = [])
            }
            return o
        },
        once: function(e, n, t) {
            var o = this;
            return o.on(e, n, t, 1), o
        },
        _emit: function(e, n, t) {
            for (var o = this, r = o["_on" + e], u = r.length - 1; u >= 0; u--) r[u].id && r[u].id !== n && "load" !== e || (setTimeout(function(e) {
                e.call(this, n, t)
            }.bind(o, r[u].fn), 0), r[u].once && o.off(e, r[u].fn, r[u].id));
            return o
        },
        _loadQueue: function() {
            var e = this;
            if (e._queue.length > 0) {
                var n = e._queue[0];
                e.once(n.event, function() {
                    e._queue.shift(), e._loadQueue()
                }), n.action()
            }
            return e
        },
        _ended: function(e) {
            var t = this,
                o = e._sprite,
                r = !(!e._loop && !t._sprite[o][2]);
            if (t._emit("end", e._id), !t._webAudio && r && t.stop(e._id, !0).play(e._id), t._webAudio && r) {
                t._emit("play", e._id), e._seek = e._start || 0, e._rateSeek = 0, e._playStart = n.ctx.currentTime;
                var u = 1e3 * (e._stop - e._start) / Math.abs(e._rate);
                t._endTimers[e._id] = setTimeout(t._ended.bind(t, e), u)
            }
            return t._webAudio && !r && (e._paused = !0, e._ended = !0, e._seek = e._start || 0, e._rateSeek = 0, t._clearTimer(e._id), t._cleanBuffer(e._node), n._autoSuspend()), t._webAudio || r || t.stop(e._id), t
        },
        _clearTimer: function(e) {
            var n = this;
            return n._endTimers[e] && (clearTimeout(n._endTimers[e]), delete n._endTimers[e]), n
        },
        _soundById: function(e) {
            for (var n = this, t = 0; t < n._sounds.length; t++)
                if (e === n._sounds[t]._id) return n._sounds[t];
            return null
        },
        _inactiveSound: function() {
            var e = this;
            e._drain();
            for (var n = 0; n < e._sounds.length; n++)
                if (e._sounds[n]._ended) return e._sounds[n].reset();
            return new o(e)
        },
        _drain: function() {
            var e = this,
                n = e._pool,
                t = 0,
                o = 0;
            if (!(e._sounds.length < n)) {
                for (o = 0; o < e._sounds.length; o++) e._sounds[o]._ended && t++;
                for (o = e._sounds.length - 1; o >= 0; o--) {
                    if (t <= n) return;
                    e._sounds[o]._ended && (e._webAudio && e._sounds[o]._node && e._sounds[o]._node.disconnect(0), e._sounds.splice(o, 1), t--)
                }
            }
        },
        _getSoundIds: function(e) {
            var n = this;
            if ("undefined" == typeof e) {
                for (var t = [], o = 0; o < n._sounds.length; o++) t.push(n._sounds[o]._id);
                return t
            }
            return [e]
        },
        _refreshBuffer: function(e) {
            var t = this;
            return e._node.bufferSource = n.ctx.createBufferSource(), e._node.bufferSource.buffer = r[t._src], e._panner ? e._node.bufferSource.connect(e._panner) : e._node.bufferSource.connect(e._node), e._node.bufferSource.loop = e._loop, e._loop && (e._node.bufferSource.loopStart = e._start || 0, e._node.bufferSource.loopEnd = e._stop), e._node.bufferSource.playbackRate.value = e._rate, t
        },
        _cleanBuffer: function(e) {
            var n = this;
            if (n._scratchBuffer) {
                e.bufferSource.onended = null, e.bufferSource.disconnect(0);
                try {
                    e.bufferSource.buffer = n._scratchBuffer
                } catch (e) {}
            }
            return e.bufferSource = null, n
        }
    };
    var o = function(e) {
        this._parent = e, this.init()
    };
    o.prototype = {
        init: function() {
            var e = this,
                n = e._parent;
            return e._muted = n._muted, e._loop = n._loop, e._volume = n._volume, e._muted = n._muted, e._rate = n._rate, e._seek = 0, e._paused = !0, e._ended = !0, e._sprite = "__default", e._id = Math.round(Date.now() * Math.random()), n._sounds.push(e), e.create(), e
        },
        create: function() {
            var e = this,
                t = e._parent,
                o = n._muted || e._muted || e._parent._muted ? 0 : e._volume;
            return t._webAudio ? (e._node = "undefined" == typeof n.ctx.createGain ? n.ctx.createGainNode() : n.ctx.createGain(), e._node.gain.setValueAtTime(o, n.ctx.currentTime), e._node.paused = !0, e._node.connect(n.masterGain)) : (e._node = new Audio, e._errorFn = e._errorListener.bind(e), e._node.addEventListener("error", e._errorFn, !1), e._loadFn = e._loadListener.bind(e), e._node.addEventListener(n._canPlayEvent, e._loadFn, !1), e._node.src = t._src, e._node.preload = "auto", e._node.volume = o * n.volume(), e._node.load()), e
        },
        reset: function() {
            var e = this,
                n = e._parent;
            return e._muted = n._muted, e._loop = n._loop, e._volume = n._volume, e._muted = n._muted, e._rate = n._rate, e._seek = 0, e._rateSeek = 0, e._paused = !0, e._ended = !0, e._sprite = "__default", e._id = Math.round(Date.now() * Math.random()), e
        },
        _errorListener: function() {
            var e = this;
            e._parent._emit("loaderror", e._id, e._node.error ? e._node.error.code : 0), e._node.removeEventListener("error", e._errorListener, !1)
        },
        _loadListener: function() {
            var e = this,
                t = e._parent;
            t._duration = Math.ceil(10 * e._node.duration) / 10, 0 === Object.keys(t._sprite).length && (t._sprite = {
                __default: [0, 1e3 * t._duration]
            }), "loaded" !== t._state && (t._state = "loaded", t._emit("load"), t._loadQueue()), e._node.removeEventListener(n._canPlayEvent, e._loadFn, !1)
        }
    };
    var r = {},
        u = function(e) {
            var n = e._src;
            if (r[n]) return e._duration = r[n].duration, void i(e);
            if (/^data:[^;]+;base64,/.test(n)) {
                for (var t = atob(n.split(",")[1]), o = new Uint8Array(t.length), u = 0; u < t.length; ++u) o[u] = t.charCodeAt(u);
                d(o.buffer, e)
            } else {
                var _ = new XMLHttpRequest;
                _.open("GET", n, !0), _.responseType = "arraybuffer", _.onload = function() {
                    var n = (_.status + "")[0];
                    return "0" !== n && "2" !== n && "3" !== n ? void e._emit("loaderror", null, "Failed loading audio file with status: " + _.status + ".") : void d(_.response, e)
                }, _.onerror = function() {
                    e._webAudio && (e._html5 = !0, e._webAudio = !1, e._sounds = [], delete r[n], e.load())
                }, a(_)
            }
        },
        a = function(e) {
            try {
                e.send()
            } catch (n) {
                e.onerror()
            }
        },
        d = function(e, t) {
            n.ctx.decodeAudioData(e, function(e) {
                e && t._sounds.length > 0 && (r[t._src] = e, i(t, e))
            }, function() {
                t._emit("loaderror", null, "Decoding audio data failed.")
            })
        },
        i = function(e, n) {
            n && !e._duration && (e._duration = n.duration), 0 === Object.keys(e._sprite).length && (e._sprite = {
                __default: [0, 1e3 * e._duration]
            }), "loaded" !== e._state && (e._state = "loaded", e._emit("load"), e._loadQueue())
        },
        _ = function() {
            try {
                "undefined" != typeof AudioContext ? n.ctx = new AudioContext : "undefined" != typeof webkitAudioContext ? n.ctx = new webkitAudioContext : n.usingWebAudio = !1
            } catch (e) {
                n.usingWebAudio = !1
            }
            var e = /iP(hone|od|ad)/.test(n._navigator && n._navigator.platform),
                t = n._navigator && n._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),
                o = t ? parseInt(t[1], 10) : null;
            if (e && o && o < 9) {
                var r = /safari/.test(n._navigator && n._navigator.userAgent.toLowerCase());
                (n._navigator && n._navigator.standalone && !r || n._navigator && !n._navigator.standalone && !r) && (n.usingWebAudio = !1)
            }
            n.usingWebAudio && (n.masterGain = "undefined" == typeof n.ctx.createGain ? n.ctx.createGainNode() : n.ctx.createGain(), n.masterGain.gain.value = 1, n.masterGain.connect(n.ctx.destination)), n._setup()
        };
    "function" == typeof define && define.amd && define([], function() {
        return {
            Howler: n,
            Howl: t
        }
    }), "undefined" != typeof exports && (exports.Howler = n, exports.Howl = t), "undefined" != typeof window ? (window.HowlerGlobal = e, window.Howler = n, window.Howl = t, window.Sound = o) : "undefined" != typeof global && (global.HowlerGlobal = e, global.Howler = n, global.Howl = t, global.Sound = o)
}();
/*! Spatial Plugin */
! function() {
    "use strict";
    HowlerGlobal.prototype._pos = [0, 0, 0], HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0], HowlerGlobal.prototype.stereo = function(e) {
        var n = this;
        if (!n.ctx || !n.ctx.listener) return n;
        for (var t = n._howls.length - 1; t >= 0; t--) n._howls[t].stereo(e);
        return n
    }, HowlerGlobal.prototype.pos = function(e, n, t) {
        var o = this;
        return o.ctx && o.ctx.listener ? (n = "number" != typeof n ? o._pos[1] : n, t = "number" != typeof t ? o._pos[2] : t, "number" != typeof e ? o._pos : (o._pos = [e, n, t], o.ctx.listener.setPosition(o._pos[0], o._pos[1], o._pos[2]), o)) : o
    }, HowlerGlobal.prototype.orientation = function(e, n, t, o, r, i) {
        var a = this;
        if (!a.ctx || !a.ctx.listener) return a;
        var p = a._orientation;
        return n = "number" != typeof n ? p[1] : n, t = "number" != typeof t ? p[2] : t, o = "number" != typeof o ? p[3] : o, r = "number" != typeof r ? p[4] : r, i = "number" != typeof i ? p[5] : i, "number" != typeof e ? p : (a._orientation = [e, n, t, o, r, i], a.ctx.listener.setOrientation(e, n, t, o, r, i), a)
    }, Howl.prototype.init = function(e) {
        return function(n) {
            var t = this;
            return t._orientation = n.orientation || [1, 0, 0], t._stereo = n.stereo || null, t._pos = n.pos || null, t._pannerAttr = {
                coneInnerAngle: "undefined" != typeof n.coneInnerAngle ? n.coneInnerAngle : 360,
                coneOuterAngle: "undefined" != typeof n.coneOuterAngle ? n.coneOuterAngle : 360,
                coneOuterGain: "undefined" != typeof n.coneOuterGain ? n.coneOuterGain : 0,
                distanceModel: "undefined" != typeof n.distanceModel ? n.distanceModel : "inverse",
                maxDistance: "undefined" != typeof n.maxDistance ? n.maxDistance : 1e4,
                panningModel: "undefined" != typeof n.panningModel ? n.panningModel : "HRTF",
                refDistance: "undefined" != typeof n.refDistance ? n.refDistance : 1,
                rolloffFactor: "undefined" != typeof n.rolloffFactor ? n.rolloffFactor : 1
            }, t._onstereo = n.onstereo ? [{
                fn: n.onstereo
            }] : [], t._onpos = n.onpos ? [{
                fn: n.onpos
            }] : [], t._onorientation = n.onorientation ? [{
                fn: n.onorientation
            }] : [], e.call(this, n)
        }
    }(Howl.prototype.init), Howl.prototype.stereo = function(n, t) {
        var o = this;
        if (!o._webAudio) return o;
        if ("loaded" !== o._state) return o._queue.push({
            event: "stereo",
            action: function() {
                o.stereo(n, t)
            }
        }), o;
        var r = "undefined" == typeof Howler.ctx.createStereoPanner ? "spatial" : "stereo";
        if ("undefined" == typeof t) {
            if ("number" != typeof n) return o._stereo;
            o._stereo = n, o._pos = [n, 0, 0]
        }
        for (var i = o._getSoundIds(t), a = 0; a < i.length; a++) {
            var p = o._soundById(i[a]);
            if (p) {
                if ("number" != typeof n) return p._stereo;
                p._stereo = n, p._pos = [n, 0, 0], p._node && (p._pannerAttr.panningModel = "equalpower", p._panner && p._panner.pan || e(p, r), "spatial" === r ? p._panner.setPosition(n, 0, 0) : p._panner.pan.value = n), o._emit("stereo", p._id)
            }
        }
        return o
    }, Howl.prototype.pos = function(n, t, o, r) {
        var i = this;
        if (!i._webAudio) return i;
        if ("loaded" !== i._state) return i._queue.push({
            event: "pos",
            action: function() {
                i.pos(n, t, o, r)
            }
        }), i;
        if (t = "number" != typeof t ? 0 : t, o = "number" != typeof o ? -.5 : o, "undefined" == typeof r) {
            if ("number" != typeof n) return i._pos;
            i._pos = [n, t, o]
        }
        for (var a = i._getSoundIds(r), p = 0; p < a.length; p++) {
            var f = i._soundById(a[p]);
            if (f) {
                if ("number" != typeof n) return f._pos;
                f._pos = [n, t, o], f._node && (f._panner && !f._panner.pan || e(f, "spatial"), f._panner.setPosition(n, t, o)), i._emit("pos", f._id)
            }
        }
        return i
    }, Howl.prototype.orientation = function(n, t, o, r) {
        var i = this;
        if (!i._webAudio) return i;
        if ("loaded" !== i._state) return i._queue.push({
            event: "orientation",
            action: function() {
                i.orientation(n, t, o, r)
            }
        }), i;
        if (t = "number" != typeof t ? i._orientation[1] : t, o = "number" != typeof o ? i._orientation[2] : o, "undefined" == typeof r) {
            if ("number" != typeof n) return i._orientation;
            i._orientation = [n, t, o]
        }
        for (var a = i._getSoundIds(r), p = 0; p < a.length; p++) {
            var f = i._soundById(a[p]);
            if (f) {
                if ("number" != typeof n) return f._orientation;
                f._orientation = [n, t, o], f._node && (f._panner || (f._pos || (f._pos = i._pos || [0, 0, -.5]), e(f, "spatial")), f._panner.setOrientation(n, t, o)), i._emit("orientation", f._id)
            }
        }
        return i
    }, Howl.prototype.pannerAttr = function() {
        var n, t, o, r = this,
            i = arguments;
        if (!r._webAudio) return r;
        if (0 === i.length) return r._pannerAttr;
        if (1 === i.length) {
            if ("object" != typeof i[0]) return o = r._soundById(parseInt(i[0], 10)), o ? o._pannerAttr : r._pannerAttr;
            n = i[0], "undefined" == typeof t && (r._pannerAttr = {
                coneInnerAngle: "undefined" != typeof n.coneInnerAngle ? n.coneInnerAngle : r._coneInnerAngle,
                coneOuterAngle: "undefined" != typeof n.coneOuterAngle ? n.coneOuterAngle : r._coneOuterAngle,
                coneOuterGain: "undefined" != typeof n.coneOuterGain ? n.coneOuterGain : r._coneOuterGain,
                distanceModel: "undefined" != typeof n.distanceModel ? n.distanceModel : r._distanceModel,
                maxDistance: "undefined" != typeof n.maxDistance ? n.maxDistance : r._maxDistance,
                panningModel: "undefined" != typeof n.panningModel ? n.panningModel : r._panningModel,
                refDistance: "undefined" != typeof n.refDistance ? n.refDistance : r._refDistance,
                rolloffFactor: "undefined" != typeof n.rolloffFactor ? n.rolloffFactor : r._rolloffFactor
            })
        } else 2 === i.length && (n = i[0], t = parseInt(i[1], 10));
        for (var a = r._getSoundIds(t), p = 0; p < a.length; p++)
            if (o = r._soundById(a[p])) {
                var f = o._pannerAttr;
                f = {
                    coneInnerAngle: "undefined" != typeof n.coneInnerAngle ? n.coneInnerAngle : f.coneInnerAngle,
                    coneOuterAngle: "undefined" != typeof n.coneOuterAngle ? n.coneOuterAngle : f.coneOuterAngle,
                    coneOuterGain: "undefined" != typeof n.coneOuterGain ? n.coneOuterGain : f.coneOuterGain,
                    distanceModel: "undefined" != typeof n.distanceModel ? n.distanceModel : f.distanceModel,
                    maxDistance: "undefined" != typeof n.maxDistance ? n.maxDistance : f.maxDistance,
                    panningModel: "undefined" != typeof n.panningModel ? n.panningModel : f.panningModel,
                    refDistance: "undefined" != typeof n.refDistance ? n.refDistance : f.refDistance,
                    rolloffFactor: "undefined" != typeof n.rolloffFactor ? n.rolloffFactor : f.rolloffFactor
                };
                var s = o._panner;
                s ? (s.coneInnerAngle = f.coneInnerAngle, s.coneOuterAngle = f.coneOuterAngle, s.coneOuterGain = f.coneOuterGain, s.distanceModel = f.distanceModel, s.maxDistance = f.maxDistance, s.panningModel = f.panningModel, s.refDistance = f.refDistance, s.rolloffFactor = f.rolloffFactor) : (o._pos || (o._pos = r._pos || [0, 0, -.5]), e(o, "spatial"))
            }
        return r
    }, Sound.prototype.init = function(e) {
        return function() {
            var n = this,
                t = n._parent;
            n._orientation = t._orientation, n._stereo = t._stereo, n._pos = t._pos, n._pannerAttr = t._pannerAttr, e.call(this), n._stereo ? t.stereo(n._stereo) : n._pos && t.pos(n._pos[0], n._pos[1], n._pos[2], n._id)
        }
    }(Sound.prototype.init), Sound.prototype.reset = function(e) {
        return function() {
            var n = this,
                t = n._parent;
            return n._orientation = t._orientation, n._pos = t._pos, n._pannerAttr = t._pannerAttr, e.call(this)
        }
    }(Sound.prototype.reset);
    var e = function(e, n) {
        n = n || "spatial", "spatial" === n ? (e._panner = Howler.ctx.createPanner(), e._panner.coneInnerAngle = e._pannerAttr.coneInnerAngle, e._panner.coneOuterAngle = e._pannerAttr.coneOuterAngle, e._panner.coneOuterGain = e._pannerAttr.coneOuterGain, e._panner.distanceModel = e._pannerAttr.distanceModel, e._panner.maxDistance = e._pannerAttr.maxDistance, e._panner.panningModel = e._pannerAttr.panningModel, e._panner.refDistance = e._pannerAttr.refDistance, e._panner.rolloffFactor = e._pannerAttr.rolloffFactor, e._panner.setPosition(e._pos[0], e._pos[1], e._pos[2]), e._panner.setOrientation(e._orientation[0], e._orientation[1], e._orientation[2])) : (e._panner = Howler.ctx.createStereoPanner(), e._panner.pan.value = e._stereo), e._panner.connect(e._node), e._paused || e._parent.pause(e._id, !0).play(e._id)
    }
}();
/*
 @license
 Copyright (c) 2012 DinahMoe AB & Oskar Eriksson

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy,
 modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software
 is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
! function() {
    function a() {
        return b
    }

    function b(a) {
        if (!(this instanceof b)) return new b(a);
        var d = "undefined" == typeof window ? {} : window;
        if (d.AudioContext || (d.AudioContext = d.webkitAudioContext), a || (console.log("tuna.js: Missing audio context! Creating a new context for you."), a = d.AudioContext && new d.AudioContext), !a) throw new Error("Tuna cannot initialize because this environment does not support web audio.");
        c(a), i = a, j = this
    }

    function c(a) {
        function b() {
            var a = arguments[0];
            return arguments[0] = l.isPrototypeOf ? l.isPrototypeOf(a) ? a.input : a : a.input || a, e.apply(this, arguments), a
        }
        if (a.__connectified__ !== !0) {
            var c = a.createGain(),
                d = Object.getPrototypeOf(Object.getPrototypeOf(c)),
                e = d.connect;
            d.connect = b, a.__connectified__ = !0
        }
    }

    function d(a) {
        return Math.max(0, Math.round(100 * Math.pow(2, a / 6)) / 100)
    }

    function e(a, b) {
        var c, d, e = 0,
            f = 0,
            g = 0,
            h = 0;
        return c = a.toExponential().match(/^.\.?(.*)e(.+)$/), e = parseInt(c[2], 10) - (c[1] + "").length, c = b.toExponential().match(/^.\.?(.*)e(.+)$/), f = parseInt(c[2], 10) - (c[1] + "").length, f > e && (e = f), d = a % b, -100 > e || e > 20 ? (g = Math.round(Math.log(d) / Math.log(10)), h = Math.pow(10, g), (d / h).toFixed(g - e) * h) : parseFloat(d.toFixed(-e))
    }

    function f(a) {
        return 0 === a ? 1 : Math.abs(a) / a
    }

    function g(a) {
        return (Math.exp(a) - Math.exp(-a)) / (Math.exp(a) + Math.exp(-a))
    }

    function h(a, b) {
        return void 0 === a ? b : a
    }
    var i, j, k = function(a, b) {
            a.value = b
        },
        l = Object.create(null, {
            activate: {
                writable: !0,
                value: function(a) {
                    a ? (this.input.disconnect(), this.input.connect(this.activateNode), this.activateCallback && this.activateCallback(a)) : (this.input.disconnect(), this.input.connect(this.output))
                }
            },
            bypass: {
                get: function() {
                    return this._bypass
                },
                set: function(a) {
                    this._lastBypassValue !== a && (this._bypass = a, this.activate(!a), this._lastBypassValue = a)
                }
            },
            connect: {
                value: function(a) {
                    this.output.connect(a)
                }
            },
            disconnect: {
                value: function(a) {
                    this.output.disconnect(a)
                }
            },
            connectInOrder: {
                value: function(a) {
                    for (var b = a.length - 1; b--;) {
                        if (!a[b].connect) return console.error("AudioNode.connectInOrder: TypeError: Not an AudioNode.", a[b]);
                        a[b + 1].input ? a[b].connect(a[b + 1].input) : a[b].connect(a[b + 1])
                    }
                }
            },
            getDefaults: {
                value: function() {
                    var a = {};
                    for (var b in this.defaults) a[b] = this.defaults[b].value;
                    return a
                }
            },
            automate: {
                value: function(a, b, c, d) {
                    var e, f = d ? ~~(d / 1e3) : i.currentTime,
                        g = c ? ~~(c / 1e3) : 0,
                        h = this.defaults[a],
                        j = this[a];
                    j ? h.automatable ? (c ? (e = "linearRampToValueAtTime", j.cancelScheduledValues(f), j.setValueAtTime(j.value, f)) : e = "setValueAtTime", j[e](b, g + f)) : j = b : console.error("Invalid Property for " + this.name)
                }
            }
        }),
        m = "float",
        n = "boolean",
        o = "string",
        p = "int";
    "undefined" != typeof module && module.exports ? module.exports = b : "function" == typeof define ? window.define("Tuna", a) : window.Tuna = b, b.prototype.Bitcrusher = function(a) {
        a || (a = this.getDefaults()), this.bufferSize = a.bufferSize || this.defaults.bufferSize.value, this.input = i.createGain(), this.activateNode = i.createGain(), this.processor = i.createScriptProcessor(this.bufferSize, 1, 1), this.output = i.createGain(), this.activateNode.connect(this.processor), this.processor.connect(this.output);
        var b, c, d, e, f, g = 0,
            j = 0;
        this.processor.onaudioprocess = function(a) {
            for (b = a.inputBuffer.getChannelData(0), c = a.outputBuffer.getChannelData(0), d = Math.pow(.5, this.bits), f = b.length, e = 0; f > e; e++) g += this.normfreq, g >= 1 && (g -= 1, j = d * Math.floor(b[e] / d + .5)), c[e] = j
        }, this.bits = a.bits || this.defaults.bits.value, this.normfreq = h(a.normfreq, this.defaults.normfreq.value), this.bypass = a.bypass || !1
    }, b.prototype.Bitcrusher.prototype = Object.create(l, {
        name: {
            value: "Bitcrusher"
        },
        defaults: {
            writable: !0,
            value: {
                bits: {
                    value: 4,
                    min: 1,
                    max: 16,
                    automatable: !1,
                    type: p
                },
                bufferSize: {
                    value: 4096,
                    min: 256,
                    max: 16384,
                    automatable: !1,
                    type: p
                },
                bypass: {
                    value: !1,
                    automatable: !1,
                    type: n
                },
                normfreq: {
                    value: .1,
                    min: 1e-4,
                    max: 1,
                    automatable: !1,
                    type: m
                }
            }
        },
        bits: {
            enumerable: !0,
            get: function() {
                return this.processor.bits
            },
            set: function(a) {
                this.processor.bits = a
            }
        },
        normfreq: {
            enumerable: !0,
            get: function() {
                return this.processor.normfreq
            },
            set: function(a) {
                this.processor.normfreq = a
            }
        }
    }), b.prototype.Cabinet = function(a) {
        a || (a = this.getDefaults()), this.input = i.createGain(), this.activateNode = i.createGain(), this.convolver = this.newConvolver(a.impulsePath || "../impulses/impulse_guitar.wav"), this.makeupNode = i.createGain(), this.output = i.createGain(), this.activateNode.connect(this.convolver.input), this.convolver.output.connect(this.makeupNode), this.makeupNode.connect(this.output), this.makeupGain = h(a.makeupGain, this.defaults.makeupGain), this.bypass = a.bypass || !1
    }, b.prototype.Cabinet.prototype = Object.create(l, {
        name: {
            value: "Cabinet"
        },
        defaults: {
            writable: !0,
            value: {
                makeupGain: {
                    value: 1,
                    min: 0,
                    max: 20,
                    automatable: !0,
                    type: m
                },
                bypass: {
                    value: !1,
                    automatable: !1,
                    type: n
                }
            }
        },
        makeupGain: {
            enumerable: !0,
            get: function() {
                return this.makeupNode.gain
            },
            set: function(a) {
                this.makeupNode.gain.value = a
            }
        },
        newConvolver: {
            value: function(a) {
                return new j.Convolver({
                    impulse: a,
                    dryLevel: 0,
                    wetLevel: 1
                })
            }
        }
    }), b.prototype.Chorus = function(a) {
        a || (a = this.getDefaults()), this.input = i.createGain(), this.attenuator = this.activateNode = i.createGain(), this.splitter = i.createChannelSplitter(2), this.delayL = i.createDelay(), this.delayR = i.createDelay(), this.feedbackGainNodeLR = i.createGain(), this.feedbackGainNodeRL = i.createGain(), this.merger = i.createChannelMerger(2), this.output = i.createGain(), this.lfoL = new j.LFO({
            target: this.delayL.delayTime,
            callback: k
        }), this.lfoR = new j.LFO({
            target: this.delayR.delayTime,
            callback: k
        }), this.input.connect(this.attenuator), this.attenuator.connect(this.output), this.attenuator.connect(this.splitter), this.splitter.connect(this.delayL, 0), this.splitter.connect(this.delayR, 1), this.delayL.connect(this.feedbackGainNodeLR), this.delayR.connect(this.feedbackGainNodeRL), this.feedbackGainNodeLR.connect(this.delayR), this.feedbackGainNodeRL.connect(this.delayL), this.delayL.connect(this.merger, 0, 0), this.delayR.connect(this.merger, 0, 1), this.merger.connect(this.output), this.feedback = h(a.feedback, this.defaults.feedback.value), this.rate = h(a.rate, this.defaults.rate.value), this.delay = h(a.delay, this.defaults.delay.value), this.depth = h(a.depth, this.defaults.depth.value), this.lfoR.phase = Math.PI / 2, this.attenuator.gain.value = .6934, this.lfoL.activate(!0), this.lfoR.activate(!0), this.bypass = a.bypass || !1
    }, b.prototype.Chorus.prototype = Object.create(l, {
        name: {
            value: "Chorus"
        },
        defaults: {
            writable: !0,
            value: {
                feedback: {
                    value: .4,
                    min: 0,
                    max: .95,
                    automatable: !1,
                    type: m
                },
                delay: {
                    value: .0045,
                    min: 0,
                    max: 1,
                    automatable: !1,
                    type: m
                },
                depth: {
                    value: .7,
                    min: 0,
                    max: 1,
                    automatable: !1,
                    type: m
                },
                rate: {
                    value: 1.5,
                    min: 0,
                    max: 8,
                    automatable: !1,
                    type: m
                },
                bypass: {
                    value: !1,
                    automatable: !1,
                    type: n
                }
            }
        },
        delay: {
            enumerable: !0,
            get: function() {
                return this._delay
            },
            set: function(a) {
                this._delay = 2e-4 * (2 * Math.pow(10, a)), this.lfoL.offset = this._delay, this.lfoR.offset = this._delay, this._depth = this._depth
            }
        },
        depth: {
            enumerable: !0,
            get: function() {
                return this._depth
            },
            set: function(a) {
                this._depth = a, this.lfoL.oscillation = this._depth * this._delay, this.lfoR.oscillation = this._depth * this._delay
            }
        },
        feedback: {
            enumerable: !0,
            get: function() {
                return this._feedback
            },
            set: function(a) {
                this._feedback = a, this.feedbackGainNodeLR.gain.value = this._feedback, this.feedbackGainNodeRL.gain.value = this._feedback
            }
        },
        rate: {
            enumerable: !0,
            get: function() {
                return this._rate
            },
            set: function(a) {
                this._rate = a, this.lfoL.frequency = this._rate, this.lfoR.frequency = this._rate
            }
        }
    }), b.prototype.Compressor = function(a) {
        a || (a = this.getDefaults()), this.input = i.createGain(), this.compNode = this.activateNode = i.createDynamicsCompressor(), this.makeupNode = i.createGain(), this.output = i.createGain(), this.compNode.connect(this.makeupNode), this.makeupNode.connect(this.output), this.automakeup = h(a.automakeup, this.defaults.automakeup.value), this.makeupGain = h(a.makeupGain, this.defaults.makeupGain.value), this.threshold = h(a.threshold, this.defaults.threshold.value), this.release = h(a.release, this.defaults.release.value), this.attack = h(a.attack, this.defaults.attack.value), this.ratio = a.ratio || this.defaults.ratio.value, this.knee = h(a.knee, this.defaults.knee.value), this.bypass = a.bypass || !1
    }, b.prototype.Compressor.prototype = Object.create(l, {
        name: {
            value: "Compressor"
        },
        defaults: {
            writable: !0,
            value: {
                threshold: {
                    value: -20,
                    min: -60,
                    max: 0,
                    automatable: !0,
                    type: m
                },
                release: {
                    value: 250,
                    min: 10,
                    max: 2e3,
                    automatable: !0,
                    type: m
                },
                makeupGain: {
                    value: 1,
                    min: 1,
                    max: 100,
                    automatable: !0,
                    type: m
                },
                attack: {
                    value: 1,
                    min: 0,
                    max: 1e3,
                    automatable: !0,
                    type: m
                },
                ratio: {
                    value: 4,
                    min: 1,
                    max: 50,
                    automatable: !0,
                    type: m
                },
                knee: {
                    value: 5,
                    min: 0,
                    max: 40,
                    automatable: !0,
                    type: m
                },
                automakeup: {
                    value: !1,
                    automatable: !1,
                    type: n
                },
                bypass: {
                    value: !1,
                    automatable: !1,
                    type: n
                }
            }
        },
        computeMakeup: {
            value: function() {
                var a = 4,
                    b = this.compNode;
                return -(b.threshold.value - b.threshold.value / b.ratio.value) / a
            }
        },
        automakeup: {
            enumerable: !0,
            get: function() {
                return this._automakeup
            },
            set: function(a) {
                this._automakeup = a, this._automakeup && (this.makeupGain = this.computeMakeup())
            }
        },
        threshold: {
            enumerable: !0,
            get: function() {
                return this.compNode.threshold
            },
            set: function(a) {
                this.compNode.threshold.value = a, this._automakeup && (this.makeupGain = this.computeMakeup())
            }
        },
        ratio: {
            enumerable: !0,
            get: function() {
                return this.compNode.ratio
            },
            set: function(a) {
                this.compNode.ratio.value = a, this._automakeup && (this.makeupGain = this.computeMakeup())
            }
        },
        knee: {
            enumerable: !0,
            get: function() {
                return this.compNode.knee
            },
            set: function(a) {
                this.compNode.knee.value = a, this._automakeup && (this.makeupGain = this.computeMakeup())
            }
        },
        attack: {
            enumerable: !0,
            get: function() {
                return this.compNode.attack
            },
            set: function(a) {
                this.compNode.attack.value = a / 1e3
            }
        },
        release: {
            enumerable: !0,
            get: function() {
                return this.compNode.release
            },
            set: function(a) {
                this.compNode.release.value = a / 1e3
            }
        },
        makeupGain: {
            enumerable: !0,
            get: function() {
                return this.makeupNode.gain
            },
            set: function(a) {
                this.makeupNode.gain.value = d(a)
            }
        }
    }), b.prototype.Convolver = function(a) {
        a || (a = this.getDefaults()), this.input = i.createGain(), this.activateNode = i.createGain(), this.convolver = i.createConvolver(), this.dry = i.createGain(), this.filterLow = i.createBiquadFilter(), this.filterHigh = i.createBiquadFilter(), this.wet = i.createGain(), this.output = i.createGain(), this.activateNode.connect(this.filterLow), this.activateNode.connect(this.dry), this.filterLow.connect(this.filterHigh), this.filterHigh.connect(this.convolver), this.convolver.connect(this.wet), this.wet.connect(this.output), this.dry.connect(this.output), this.dryLevel = h(a.dryLevel, this.defaults.dryLevel.value), this.wetLevel = h(a.wetLevel, this.defaults.wetLevel.value), this.highCut = a.highCut || this.defaults.highCut.value, this.buffer = a.impulse || "../impulses/ir_rev_short.wav", this.lowCut = a.lowCut || this.defaults.lowCut.value, this.level = h(a.level, this.defaults.level.value), this.filterHigh.type = "lowpass", this.filterLow.type = "highpass", this.bypass = a.bypass || !1
    }, b.prototype.Convolver.prototype = Object.create(l, {
        name: {
            value: "Convolver"
        },
        defaults: {
            writable: !0,
            value: {
                highCut: {
                    value: 22050,
                    min: 20,
                    max: 22050,
                    automatable: !0,
                    type: m
                },
                lowCut: {
                    value: 20,
                    min: 20,
                    max: 22050,
                    automatable: !0,
                    type: m
                },
                dryLevel: {
                    value: 1,
                    min: 0,
                    max: 1,
                    automatable: !0,
                    type: m
                },
                wetLevel: {
                    value: 1,
                    min: 0,
                    max: 1,
                    automatable: !0,
                    type: m
                },
                level: {
                    value: 1,
                    min: 0,
                    max: 1,
                    automatable: !0,
                    type: m
                }
            }
        },
        lowCut: {
            get: function() {
                return this.filterLow.frequency
            },
            set: function(a) {
                this.filterLow.frequency.value = a
            }
        },
        highCut: {
            get: function() {
                return this.filterHigh.frequency
            },
            set: function(a) {
                this.filterHigh.frequency.value = a
            }
        },
        level: {
            get: function() {
                return this.output.gain
            },
            set: function(a) {
                this.output.gain.value = a
            }
        },
        dryLevel: {
            get: function() {
                return this.dry.gain
            },
            set: function(a) {
                this.dry.gain.value = a
            }
        },
        wetLevel: {
            get: function() {
                return this.wet.gain
            },
            set: function(a) {
                this.wet.gain.value = a
            }
        },
        buffer: {
            enumerable: !1,
            get: function() {
                return this.convolver.buffer
            },
            set: function(a) {
                var b = this.convolver,
                    c = new XMLHttpRequest;
                return a ? (c.open("GET", a, !0), c.responseType = "arraybuffer", c.onreadystatechange = function() {
                    4 === c.readyState && (c.status < 300 && c.status > 199 || 302 === c.status) && i.decodeAudioData(c.response, function(a) {
                        b.buffer = a
                    }, function(a) {
                        a && console.log("Tuna.Convolver.setBuffer: Error decoding data" + a)
                    })
                }, void c.send(null)) : void console.log("Tuna.Convolver.setBuffer: Missing impulse path!")
            }
        }
    }), b.prototype.Delay = function(a) {
        a || (a = this.getDefaults()), this.input = i.createGain(), this.activateNode = i.createGain(), this.dry = i.createGain(), this.wet = i.createGain(), this.filter = i.createBiquadFilter(), this.delay = i.createDelay(10), this.feedbackNode = i.createGain(), this.output = i.createGain(), this.activateNode.connect(this.delay), this.activateNode.connect(this.dry), this.delay.connect(this.filter), this.filter.connect(this.feedbackNode), this.feedbackNode.connect(this.delay), this.feedbackNode.connect(this.wet), this.wet.connect(this.output), this.dry.connect(this.output), this.delayTime = a.delayTime || this.defaults.delayTime.value, this.feedback = h(a.feedback, this.defaults.feedback.value), this.wetLevel = h(a.wetLevel, this.defaults.wetLevel.value), this.dryLevel = h(a.dryLevel, this.defaults.dryLevel.value), this.cutoff = a.cutoff || this.defaults.cutoff.value, this.filter.type = "lowpass", this.bypass = a.bypass || !1
    }, b.prototype.Delay.prototype = Object.create(l, {
        name: {
            value: "Delay"
        },
        defaults: {
            writable: !0,
            value: {
                delayTime: {
                    value: 100,
                    min: 20,
                    max: 1e3,
                    automatable: !1,
                    type: m
                },
                feedback: {
                    value: .45,
                    min: 0,
                    max: .9,
                    automatable: !0,
                    type: m
                },
                cutoff: {
                    value: 2e4,
                    min: 20,
                    max: 2e4,
                    automatable: !0,
                    type: m
                },
                wetLevel: {
                    value: .5,
                    min: 0,
                    max: 1,
                    automatable: !0,
                    type: m
                },
                dryLevel: {
                    value: 1,
                    min: 0,
                    max: 1,
                    automatable: !0,
                    type: m
                }
            }
        },
        delayTime: {
            enumerable: !0,
            get: function() {
                return this.delay.delayTime
            },
            set: function(a) {
                this.delay.delayTime.value = a / 1e3
            }
        },
        wetLevel: {
            enumerable: !0,
            get: function() {
                return this.wet.gain
            },
            set: function(a) {
                this.wet.gain.value = a
            }
        },
        dryLevel: {
            enumerable: !0,
            get: function() {
                return this.dry.gain
            },
            set: function(a) {
                this.dry.gain.value = a
            }
        },
        feedback: {
            enumerable: !0,
            get: function() {
                return this.feedbackNode.gain
            },
            set: function(a) {
                this.feedbackNode.gain.value = a
            }
        },
        cutoff: {
            enumerable: !0,
            get: function() {
                return this.filter.frequency
            },
            set: function(a) {
                this.filter.frequency.value = a
            }
        }
    }), b.prototype.Filter = function(a) {
        a || (a = this.getDefaults()), this.input = i.createGain(), this.activateNode = i.createGain(), this.filter = i.createBiquadFilter(), this.output = i.createGain(), this.activateNode.connect(this.filter), this.filter.connect(this.output), this.frequency = a.frequency || this.defaults.frequency.value, this.Q = a.resonance || this.defaults.Q.value, this.filterType = h(a.filterType, this.defaults.filterType.value), this.gain = h(a.gain, this.defaults.gain.value), this.bypass = a.bypass || !1
    }, b.prototype.Filter.prototype = Object.create(l, {
        name: {
            value: "Filter"
        },
        defaults: {
            writable: !0,
            value: {
                frequency: {
                    value: 800,
                    min: 20,
                    max: 22050,
                    automatable: !0,
                    type: m
                },
                Q: {
                    value: 1,
                    min: .001,
                    max: 100,
                    automatable: !0,
                    type: m
                },
                gain: {
                    value: 0,
                    min: -40,
                    max: 40,
                    automatable: !0,
                    type: m
                },
                bypass: {
                    value: !1,
                    automatable: !1,
                    type: n
                },
                filterType: {
                    value: "lowpass",
                    automatable: !1,
                    type: o
                }
            }
        },
        filterType: {
            enumerable: !0,
            get: function() {
                return this.filter.type
            },
            set: function(a) {
                this.filter.type = a
            }
        },
        Q: {
            enumerable: !0,
            get: function() {
                return this.filter.Q
            },
            set: function(a) {
                this.filter.Q.value = a
            }
        },
        gain: {
            enumerable: !0,
            get: function() {
                return this.filter.gain
            },
            set: function(a) {
                this.filter.gain.value = a
            }
        },
        frequency: {
            enumerable: !0,
            get: function() {
                return this.filter.frequency
            },
            set: function(a) {
                this.filter.frequency.value = a
            }
        }
    }), b.prototype.Gain = function(a) {
        a || (a = this.getDefaults()), this.input = i.createGain(), this.activateNode = i.createGain(), this.gainNode = i.createGain(), this.output = i.createGain(), this.activateNode.connect(this.gainNode), this.gainNode.connect(this.output), this.gain = h(a.gain, this.defaults.gain.value), this.bypass = a.bypass || !1
    }, b.prototype.Gain.prototype = Object.create(l, {
        name: {
            value: "Gain"
        },
        defaults: {
            writable: !0,
            value: {
                bypass: {
                    value: !1,
                    automatable: !1,
                    type: n
                },
                gain: {
                    value: 1,
                    automatable: !0,
                    type: m
                }
            }
        },
        gain: {
            enumerable: !0,
            get: function() {
                return this.gainNode.gain
            },
            set: function(a) {
                this.gainNode.gain.value = a
            }
        }
    }), b.prototype.MoogFilter = function(a) {
        a || (a = this.getDefaults()), this.bufferSize = a.bufferSize || this.defaults.bufferSize.value, this.input = i.createGain(), this.activateNode = i.createGain(), this.processor = i.createScriptProcessor(this.bufferSize, 1, 1), this.output = i.createGain(), this.activateNode.connect(this.processor), this.processor.connect(this.output);
        var b, c, d, e, f, g, j, k;
        b = c = d = e = f = g = j = k = 0;
        var l, m, n, o, p, q, r;
        this.processor.onaudioprocess = function(a) {
            for (l = a.inputBuffer.getChannelData(0), m = a.outputBuffer.getChannelData(0), n = 1.16 * this.cutoff, r = .35013 * (n * n) * (n * n), o = this.resonance * (1 - .15 * n * n), q = l.length, p = 0; q > p; p++) l[p] -= k * o, l[p] *= r, f = l[p] + .3 * b + (1 - n) * f, b = l[p], g = f + .3 * c + (1 - n) * g, c = f, j = g + .3 * d + (1 - n) * j, d = g, k = j + .3 * e + (1 - n) * k, e = j, m[p] = k
        }, this.cutoff = h(a.cutoff, this.defaults.cutoff.value), this.resonance = h(a.resonance, this.defaults.resonance.value), this.bypass = a.bypass || !1
    }, b.prototype.MoogFilter.prototype = Object.create(l, {
        name: {
            value: "MoogFilter"
        },
        defaults: {
            writable: !0,
            value: {
                bufferSize: {
                    value: 4096,
                    min: 256,
                    max: 16384,
                    automatable: !1,
                    type: p
                },
                bypass: {
                    value: !1,
                    automatable: !1,
                    type: n
                },
                cutoff: {
                    value: .065,
                    min: 1e-4,
                    max: 1,
                    automatable: !1,
                    type: m
                },
                resonance: {
                    value: 3.5,
                    min: 0,
                    max: 4,
                    automatable: !1,
                    type: m
                }
            }
        },
        cutoff: {
            enumerable: !0,
            get: function() {
                return this.processor.cutoff
            },
            set: function(a) {
                this.processor.cutoff = a
            }
        },
        resonance: {
            enumerable: !0,
            get: function() {
                return this.processor.resonance
            },
            set: function(a) {
                this.processor.resonance = a
            }
        }
    }), b.prototype.Overdrive = function(a) {
        a || (a = this.getDefaults()), this.input = i.createGain(), this.activateNode = i.createGain(), this.inputDrive = i.createGain(), this.waveshaper = i.createWaveShaper(), this.outputDrive = i.createGain(), this.output = i.createGain(), this.activateNode.connect(this.inputDrive), this.inputDrive.connect(this.waveshaper), this.waveshaper.connect(this.outputDrive), this.outputDrive.connect(this.output), this.ws_table = new Float32Array(this.k_nSamples), this.drive = h(a.drive, this.defaults.drive.value), this.outputGain = h(a.outputGain, this.defaults.outputGain.value), this.curveAmount = h(a.curveAmount, this.defaults.curveAmount.value), this.algorithmIndex = h(a.algorithmIndex, this.defaults.algorithmIndex.value), this.bypass = a.bypass || !1
    }, b.prototype.Overdrive.prototype = Object.create(l, {
        name: {
            value: "Overdrive"
        },
        defaults: {
            writable: !0,
            value: {
                drive: {
                    value: 1,
                    min: 0,
                    max: 1,
                    automatable: !0,
                    type: m,
                    scaled: !0
                },
                outputGain: {
                    value: 1,
                    min: 0,
                    max: 1,
                    automatable: !0,
                    type: m,
                    scaled: !0
                },
                curveAmount: {
                    value: .725,
                    min: 0,
                    max: 1,
                    automatable: !1,
                    type: m
                },
                algorithmIndex: {
                    value: 0,
                    min: 0,
                    max: 5,
                    automatable: !1,
                    type: p
                }
            }
        },
        k_nSamples: {
            value: 8192
        },
        drive: {
            get: function() {
                return this.inputDrive.gain
            },
            set: function(a) {
                this._drive = a
            }
        },
        curveAmount: {
            get: function() {
                return this._curveAmount
            },
            set: function(a) {
                this._curveAmount = a, void 0 === this._algorithmIndex && (this._algorithmIndex = 0), this.waveshaperAlgorithms[this._algorithmIndex](this._curveAmount, this.k_nSamples, this.ws_table), this.waveshaper.curve = this.ws_table
            }
        },
        outputGain: {
            get: function() {
                return this.outputDrive.gain
            },
            set: function(a) {
                this._outputGain = d(a)
            }
        },
        algorithmIndex: {
            get: function() {
                return this._algorithmIndex
            },
            set: function(a) {
                this._algorithmIndex = a, this.curveAmount = this._curveAmount
            }
        },
        waveshaperAlgorithms: {
            value: [function(a, b, c) {
                a = Math.min(a, .9999);
                var d, e, f = 2 * a / (1 - a);
                for (d = 0; b > d; d++) e = 2 * d / b - 1, c[d] = (1 + f) * e / (1 + f * Math.abs(e))
            }, function(a, b, c) {
                var d, e, f;
                for (d = 0; b > d; d++) e = 2 * d / b - 1, f = (.5 * Math.pow(e + 1.4, 2) - 1) * f >= 0 ? 5.8 : 1.2, c[d] = g(f)
            }, function(a, b, c) {
                var d, e, f, h = 1 - a;
                for (d = 0; b > d; d++) e = 2 * d / b - 1, f = 0 > e ? -Math.pow(Math.abs(e), h + .04) : Math.pow(e, h), c[d] = g(2 * f)
            }, function(a, b, c) {
                var d, e, g, h, i = 1 - a > .99 ? .99 : 1 - a;
                for (d = 0; b > d; d++) e = 2 * d / b - 1, h = Math.abs(e), i > h ? g = h : h > i ? g = i + (h - i) / (1 + Math.pow((h - i) / (1 - i), 2)) : h > 1 && (g = h), c[d] = f(e) * g * (1 / ((i + 1) / 2))
            }, function(a, b, c) {
                var d, e;
                for (d = 0; b > d; d++) e = 2 * d / b - 1, -.08905 > e ? c[d] = -3 / 4 * (1 - Math.pow(1 - (Math.abs(e) - .032857), 12) + 1 / 3 * (Math.abs(e) - .032847)) + .01 : e >= -.08905 && .320018 > e ? c[d] = -6.153 * (e * e) + 3.9375 * e : c[d] = .630035
            }, function(a, b, c) {
                var d, e, f = 2 + Math.round(14 * a),
                    g = Math.round(Math.pow(2, f - 1));
                for (d = 0; b > d; d++) e = 2 * d / b - 1, c[d] = Math.round(e * g) / g
            }]
        }
    }), b.prototype.Panner = function(a) {
        a || (a = this.getDefaults()), this.input = i.createGain(), this.activateNode = i.createGain(), this.panner = i.createStereoPanner(), this.output = i.createGain(), this.activateNode.connect(this.panner), this.panner.connect(this.output), this.pan = h(a.pan, this.defaults.pan.value), this.bypass = a.bypass || !1
    }, b.prototype.Panner.prototype = Object.create(l, {
        name: {
            value: "Panner"
        },
        defaults: {
            writable: !0,
            value: {
                bypass: {
                    value: !1,
                    automatable: !1,
                    type: n
                },
                pan: {
                    value: 0,
                    min: -1,
                    max: 1,
                    automatable: !0,
                    type: m
                }
            }
        },
        pan: {
            enumerable: !0,
            get: function() {
                return this.panner.pan
            },
            set: function(a) {
                this.panner.pan.value = a
            }
        }
    }), b.prototype.Phaser = function(a) {
        a || (a = this.getDefaults()), this.input = i.createGain(), this.splitter = this.activateNode = i.createChannelSplitter(2), this.filtersL = [], this.filtersR = [], this.feedbackGainNodeL = i.createGain(), this.feedbackGainNodeR = i.createGain(), this.merger = i.createChannelMerger(2), this.filteredSignal = i.createGain(), this.output = i.createGain(), this.lfoL = new j.LFO({
            target: this.filtersL,
            callback: this.callback
        }), this.lfoR = new j.LFO({
            target: this.filtersR,
            callback: this.callback
        });
        for (var b = this.stage; b--;) this.filtersL[b] = i.createBiquadFilter(), this.filtersR[b] = i.createBiquadFilter(), this.filtersL[b].type = "allpass", this.filtersR[b].type = "allpass";
        this.input.connect(this.splitter), this.input.connect(this.output), this.splitter.connect(this.filtersL[0], 0, 0), this.splitter.connect(this.filtersR[0], 1, 0), this.connectInOrder(this.filtersL), this.connectInOrder(this.filtersR), this.filtersL[this.stage - 1].connect(this.feedbackGainNodeL), this.filtersL[this.stage - 1].connect(this.merger, 0, 0), this.filtersR[this.stage - 1].connect(this.feedbackGainNodeR), this.filtersR[this.stage - 1].connect(this.merger, 0, 1), this.feedbackGainNodeL.connect(this.filtersL[0]), this.feedbackGainNodeR.connect(this.filtersR[0]), this.merger.connect(this.output), this.rate = h(a.rate, this.defaults.rate.value), this.baseModulationFrequency = a.baseModulationFrequency || this.defaults.baseModulationFrequency.value, this.depth = h(a.depth, this.defaults.depth.value), this.feedback = h(a.feedback, this.defaults.feedback.value), this.stereoPhase = h(a.stereoPhase, this.defaults.stereoPhase.value), this.lfoL.activate(!0), this.lfoR.activate(!0), this.bypass = a.bypass || !1
    }, b.prototype.Phaser.prototype = Object.create(l, {
        name: {
            value: "Phaser"
        },
        stage: {
            value: 4
        },
        defaults: {
            writable: !0,
            value: {
                rate: {
                    value: .1,
                    min: 0,
                    max: 8,
                    automatable: !1,
                    type: m
                },
                depth: {
                    value: .6,
                    min: 0,
                    max: 1,
                    automatable: !1,
                    type: m
                },
                feedback: {
                    value: .7,
                    min: 0,
                    max: 1,
                    automatable: !1,
                    type: m
                },
                stereoPhase: {
                    value: 40,
                    min: 0,
                    max: 180,
                    automatable: !1,
                    type: m
                },
                baseModulationFrequency: {
                    value: 700,
                    min: 500,
                    max: 1500,
                    automatable: !1,
                    type: m
                }
            }
        },
        callback: {
            value: function(a, b) {
                for (var c = 0; 4 > c; c++) a[c].frequency.value = b
            }
        },
        depth: {
            get: function() {
                return this._depth
            },
            set: function(a) {
                this._depth = a, this.lfoL.oscillation = this._baseModulationFrequency * this._depth, this.lfoR.oscillation = this._baseModulationFrequency * this._depth
            }
        },
        rate: {
            get: function() {
                return this._rate
            },
            set: function(a) {
                this._rate = a, this.lfoL.frequency = this._rate, this.lfoR.frequency = this._rate
            }
        },
        baseModulationFrequency: {
            enumerable: !0,
            get: function() {
                return this._baseModulationFrequency
            },
            set: function(a) {
                this._baseModulationFrequency = a, this.lfoL.offset = this._baseModulationFrequency, this.lfoR.offset = this._baseModulationFrequency, this._depth = this._depth
            }
        },
        feedback: {
            get: function() {
                return this._feedback
            },
            set: function(a) {
                this._feedback = a, this.feedbackGainNodeL.gain.value = this._feedback, this.feedbackGainNodeR.gain.value = this._feedback
            }
        },
        stereoPhase: {
            get: function() {
                return this._stereoPhase
            },
            set: function(a) {
                this._stereoPhase = a;
                var b = this.lfoL._phase + this._stereoPhase * Math.PI / 180;
                b = e(b, 2 * Math.PI), this.lfoR._phase = b
            }
        }
    }), b.prototype.PingPongDelay = function(a) {
        a || (a = this.getDefaults()), this.input = i.createGain(), this.wetLevel = i.createGain(), this.stereoToMonoMix = i.createGain(), this.feedbackLevel = i.createGain(), this.output = i.createGain(), this.delayLeft = i.createDelay(10), this.delayRight = i.createDelay(10), this.activateNode = i.createGain(), this.splitter = i.createChannelSplitter(2), this.merger = i.createChannelMerger(2), this.activateNode.connect(this.splitter), this.splitter.connect(this.stereoToMonoMix, 0, 0), this.splitter.connect(this.stereoToMonoMix, 1, 0), this.stereoToMonoMix.gain.value = .5, this.stereoToMonoMix.connect(this.wetLevel), this.wetLevel.connect(this.delayLeft), this.feedbackLevel.connect(this.delayLeft), this.delayLeft.connect(this.delayRight), this.delayRight.connect(this.feedbackLevel), this.delayLeft.connect(this.merger, 0, 0), this.delayRight.connect(this.merger, 0, 1), this.merger.connect(this.output), this.activateNode.connect(this.output), this.delayTimeLeft = void 0 !== a.delayTimeLeft ? a.delayTimeLeft : this.defaults.delayTimeLeft.value, this.delayTimeRight = void 0 !== a.delayTimeRight ? a.delayTimeRight : this.defaults.delayTimeRight.value, this.feedbackLevel.gain.value = void 0 !== a.feedback ? a.feedback : this.defaults.feedback.value, this.wetLevel.gain.value = void 0 !== a.wetLevel ? a.wetLevel : this.defaults.wetLevel.value, this.bypass = a.bypass || !1
    }, b.prototype.PingPongDelay.prototype = Object.create(l, {
        name: {
            value: "PingPongDelay"
        },
        delayTimeLeft: {
            enumerable: !0,
            get: function() {
                return this._delayTimeLeft
            },
            set: function(a) {
                this._delayTimeLeft = a, this.delayLeft.delayTime.value = a / 1e3
            }
        },
        delayTimeRight: {
            enumerable: !0,
            get: function() {
                return this._delayTimeRight
            },
            set: function(a) {
                this._delayTimeRight = a, this.delayRight.delayTime.value = a / 1e3
            }
        },
        defaults: {
            writable: !0,
            value: {
                delayTimeLeft: {
                    value: 200,
                    min: 1,
                    max: 1e4,
                    automatable: !1,
                    type: p
                },
                delayTimeRight: {
                    value: 400,
                    min: 1,
                    max: 1e4,
                    automatable: !1,
                    type: p
                },
                feedback: {
                    value: .3,
                    min: 0,
                    max: 1,
                    automatable: !1,
                    type: m
                },
                wetLevel: {
                    value: .5,
                    min: 0,
                    max: 1,
                    automatable: !1,
                    type: m
                }
            }
        }
    }), b.prototype.Tremolo = function(a) {
        a || (a = this.getDefaults()), this.input = i.createGain(), this.splitter = this.activateNode = i.createChannelSplitter(2), this.amplitudeL = i.createGain(), this.amplitudeR = i.createGain(), this.merger = i.createChannelMerger(2), this.output = i.createGain(), this.lfoL = new j.LFO({
            target: this.amplitudeL.gain,
            callback: k
        }), this.lfoR = new j.LFO({
            target: this.amplitudeR.gain,
            callback: k
        }), this.input.connect(this.splitter), this.splitter.connect(this.amplitudeL, 0), this.splitter.connect(this.amplitudeR, 1), this.amplitudeL.connect(this.merger, 0, 0), this.amplitudeR.connect(this.merger, 0, 1), this.merger.connect(this.output), this.rate = a.rate || this.defaults.rate.value, this.intensity = h(a.intensity, this.defaults.intensity.value), this.stereoPhase = h(a.stereoPhase, this.defaults.stereoPhase.value), this.lfoL.offset = 1 - this.intensity / 2, this.lfoR.offset = 1 - this.intensity / 2, this.lfoL.phase = this.stereoPhase * Math.PI / 180, this.lfoL.activate(!0), this.lfoR.activate(!0), this.bypass = a.bypass || !1
    }, b.prototype.Tremolo.prototype = Object.create(l, {
        name: {
            value: "Tremolo"
        },
        defaults: {
            writable: !0,
            value: {
                intensity: {
                    value: .3,
                    min: 0,
                    max: 1,
                    automatable: !1,
                    type: m
                },
                stereoPhase: {
                    value: 0,
                    min: 0,
                    max: 180,
                    automatable: !1,
                    type: m
                },
                rate: {
                    value: 5,
                    min: .1,
                    max: 11,
                    automatable: !1,
                    type: m
                }
            }
        },
        intensity: {
            enumerable: !0,
            get: function() {
                return this._intensity
            },
            set: function(a) {
                this._intensity = a, this.lfoL.offset = 1 - this._intensity / 2, this.lfoR.offset = 1 - this._intensity / 2, this.lfoL.oscillation = this._intensity, this.lfoR.oscillation = this._intensity
            }
        },
        rate: {
            enumerable: !0,
            get: function() {
                return this._rate
            },
            set: function(a) {
                this._rate = a, this.lfoL.frequency = this._rate, this.lfoR.frequency = this._rate
            }
        },
        stereoPhase: {
            enumerable: !0,
            get: function() {
                return this._stereoPhase
            },
            set: function(a) {
                this._stereoPhase = a;
                var b = this.lfoL._phase + this._stereoPhase * Math.PI / 180;
                b = e(b, 2 * Math.PI), this.lfoR.phase = b
            }
        }
    }), b.prototype.WahWah = function(a) {
        a || (a = this.getDefaults()), this.input = i.createGain(), this.activateNode = i.createGain(), this.envelopeFollower = new j.EnvelopeFollower({
            target: this,
            callback: function(a, b) {
                a.sweep = b
            }
        }), this.filterBp = i.createBiquadFilter(), this.filterPeaking = i.createBiquadFilter(), this.output = i.createGain(), this.activateNode.connect(this.filterBp), this.filterBp.connect(this.filterPeaking), this.filterPeaking.connect(this.output), this.init(), this.automode = h(a.automode, this.defaults.automode.value), this.resonance = a.resonance || this.defaults.resonance.value, this.sensitivity = h(a.sensitivity, this.defaults.sensitivity.value), this.baseFrequency = h(a.baseFrequency, this.defaults.baseFrequency.value), this.excursionOctaves = a.excursionOctaves || this.defaults.excursionOctaves.value, this.sweep = h(a.sweep, this.defaults.sweep.value), this.activateNode.gain.value = 2, this.envelopeFollower.activate(!0), this.bypass = a.bypass || !1
    }, b.prototype.WahWah.prototype = Object.create(l, {
        name: {
            value: "WahWah"
        },
        defaults: {
            writable: !0,
            value: {
                automode: {
                    value: !0,
                    automatable: !1,
                    type: n
                },
                baseFrequency: {
                    value: .5,
                    min: 0,
                    max: 1,
                    automatable: !1,
                    type: m
                },
                excursionOctaves: {
                    value: 2,
                    min: 1,
                    max: 6,
                    automatable: !1,
                    type: m
                },
                sweep: {
                    value: .2,
                    min: 0,
                    max: 1,
                    automatable: !1,
                    type: m
                },
                resonance: {
                    value: 10,
                    min: 1,
                    max: 100,
                    automatable: !1,
                    type: m
                },
                sensitivity: {
                    value: .5,
                    min: -1,
                    max: 1,
                    automatable: !1,
                    type: m
                }
            }
        },
        automode: {
            get: function() {
                return this._automode
            },
            set: function(a) {
                this._automode = a, a ? (this.activateNode.connect(this.envelopeFollower.input), this.envelopeFollower.activate(!0)) : (this.envelopeFollower.activate(!1), this.activateNode.disconnect(), this.activateNode.connect(this.filterBp))
            }
        },
        filterFreqTimeout: {
            value: 0
        },
        setFilterFreq: {
            value: function() {
                try {
                    this.filterBp.frequency.value = Math.min(22050, this._baseFrequency + this._excursionFrequency * this._sweep), this.filterPeaking.frequency.value = Math.min(22050, this._baseFrequency + this._excursionFrequency * this._sweep)
                } catch (a) {
                    clearTimeout(this.filterFreqTimeout), this.filterFreqTimeout = setTimeout(function() {
                        this.setFilterFreq()
                    }.bind(this), 0)
                }
            }
        },
        sweep: {
            enumerable: !0,
            get: function() {
                return this._sweep
            },
            set: function(a) {
                this._sweep = Math.pow(a > 1 ? 1 : 0 > a ? 0 : a, this._sensitivity), this.setFilterFreq()
            }
        },
        baseFrequency: {
            enumerable: !0,
            get: function() {
                return this._baseFrequency
            },
            set: function(a) {
                this._baseFrequency = 50 * Math.pow(10, 2 * a), this._excursionFrequency = Math.min(i.sampleRate / 2, this.baseFrequency * Math.pow(2, this._excursionOctaves)), this.setFilterFreq()
            }
        },
        excursionOctaves: {
            enumerable: !0,
            get: function() {
                return this._excursionOctaves
            },
            set: function(a) {
                this._excursionOctaves = a, this._excursionFrequency = Math.min(i.sampleRate / 2, this.baseFrequency * Math.pow(2, this._excursionOctaves)), this.setFilterFreq()
            }
        },
        sensitivity: {
            enumerable: !0,
            get: function() {
                return this._sensitivity
            },
            set: function(a) {
                this._sensitivity = Math.pow(10, a)
            }
        },
        resonance: {
            enumerable: !0,
            get: function() {
                return this._resonance
            },
            set: function(a) {
                this._resonance = a, this.filterPeaking.Q = this._resonance
            }
        },
        init: {
            value: function() {
                this.output.gain.value = 1, this.filterPeaking.type = "peaking", this.filterBp.type = "bandpass", this.filterPeaking.frequency.value = 100, this.filterPeaking.gain.value = 20, this.filterPeaking.Q.value = 5, this.filterBp.frequency.value = 100, this.filterBp.Q.value = 1
            }
        }
    }), b.prototype.EnvelopeFollower = function(a) {
        a || (a = this.getDefaults()), this.input = i.createGain(), this.jsNode = this.output = i.createScriptProcessor(this.buffersize, 1, 1), this.input.connect(this.output), this.attackTime = h(a.attackTime, this.defaults.attackTime.value), this.releaseTime = h(a.releaseTime, this.defaults.releaseTime.value), this._envelope = 0, this.target = a.target || {}, this.callback = a.callback || function() {}, this.bypass = a.bypass || !1
    }, b.prototype.EnvelopeFollower.prototype = Object.create(l, {
        name: {
            value: "EnvelopeFollower"
        },
        defaults: {
            value: {
                attackTime: {
                    value: .003,
                    min: 0,
                    max: .5,
                    automatable: !1,
                    type: m
                },
                releaseTime: {
                    value: .5,
                    min: 0,
                    max: .5,
                    automatable: !1,
                    type: m
                }
            }
        },
        buffersize: {
            value: 256
        },
        envelope: {
            value: 0
        },
        sampleRate: {
            value: 44100
        },
        attackTime: {
            enumerable: !0,
            get: function() {
                return this._attackTime
            },
            set: function(a) {
                this._attackTime = a, this._attackC = Math.exp(-1 / this._attackTime * this.sampleRate / this.buffersize)
            }
        },
        releaseTime: {
            enumerable: !0,
            get: function() {
                return this._releaseTime
            },
            set: function(a) {
                this._releaseTime = a, this._releaseC = Math.exp(-1 / this._releaseTime * this.sampleRate / this.buffersize)
            }
        },
        callback: {
            get: function() {
                return this._callback
            },
            set: function(a) {
                "function" == typeof a ? this._callback = a : console.error("tuna.js: " + this.name + ": Callback must be a function!")
            }
        },
        target: {
            get: function() {
                return this._target
            },
            set: function(a) {
                this._target = a
            }
        },
        activate: {
            value: function(a) {
                this.activated = a, a ? (this.jsNode.connect(i.destination), this.jsNode.onaudioprocess = this.returnCompute(this)) : (this.jsNode.disconnect(), this.jsNode.onaudioprocess = null), this.activateCallback && this.activateCallback(a)
            }
        },
        returnCompute: {
            value: function(a) {
                return function(b) {
                    a.compute(b)
                }
            }
        },
        compute: {
            value: function(a) {
                var b, c, d, e, f = a.inputBuffer.getChannelData(0).length,
                    g = a.inputBuffer.numberOfChannels;
                if (c = d = e = 0, g > 1)
                    for (e = 0; f > e; ++e)
                        for (; g > c; ++c) b = a.inputBuffer.getChannelData(c)[e],
                            d += b * b / g;
                else
                    for (e = 0; f > e; ++e) b = a.inputBuffer.getChannelData(0)[e], d += b * b;
                d = Math.sqrt(d), this._envelope < d ? (this._envelope *= this._attackC, this._envelope += (1 - this._attackC) * d) : (this._envelope *= this._releaseC, this._envelope += (1 - this._releaseC) * d), this._callback(this._target, this._envelope)
            }
        }
    }), b.prototype.LFO = function(a) {
        a || (a = this.getDefaults()), this.input = i.createGain(), this.output = i.createScriptProcessor(256, 1, 1), this.activateNode = i.destination, this.frequency = h(a.frequency, this.defaults.frequency.value), this.offset = h(a.offset, this.defaults.offset.value), this.oscillation = h(a.oscillation, this.defaults.oscillation.value), this.phase = h(a.phase, this.defaults.phase.value), this.target = a.target || {}, this.output.onaudioprocess = this.callback(a.callback || function() {}), this.bypass = a.bypass || !1
    }, b.prototype.LFO.prototype = Object.create(l, {
        name: {
            value: "LFO"
        },
        bufferSize: {
            value: 256
        },
        sampleRate: {
            value: 44100
        },
        defaults: {
            value: {
                frequency: {
                    value: 1,
                    min: 0,
                    max: 20,
                    automatable: !1,
                    type: m
                },
                offset: {
                    value: .85,
                    min: 0,
                    max: 22049,
                    automatable: !1,
                    type: m
                },
                oscillation: {
                    value: .3,
                    min: -22050,
                    max: 22050,
                    automatable: !1,
                    type: m
                },
                phase: {
                    value: 0,
                    min: 0,
                    max: 2 * Math.PI,
                    automatable: !1,
                    type: m
                }
            }
        },
        frequency: {
            get: function() {
                return this._frequency
            },
            set: function(a) {
                this._frequency = a, this._phaseInc = 2 * Math.PI * this._frequency * this.bufferSize / this.sampleRate
            }
        },
        offset: {
            get: function() {
                return this._offset
            },
            set: function(a) {
                this._offset = a
            }
        },
        oscillation: {
            get: function() {
                return this._oscillation
            },
            set: function(a) {
                this._oscillation = a
            }
        },
        phase: {
            get: function() {
                return this._phase
            },
            set: function(a) {
                this._phase = a
            }
        },
        target: {
            get: function() {
                return this._target
            },
            set: function(a) {
                this._target = a
            }
        },
        activate: {
            value: function(a) {
                a ? (this.output.connect(i.destination), this.activateCallback && this.activateCallback(a)) : this.output.disconnect()
            }
        },
        callback: {
            value: function(a) {
                var b = this;
                return function() {
                    b._phase += b._phaseInc, b._phase > 2 * Math.PI && (b._phase = 0), a(b._target, b._offset + b._oscillation * Math.sin(b._phase))
                }
            }
        }
    }), b.toString = b.prototype.toString = function() {
        return "Please visit https://github.com/Theodeus/tuna/wiki for instructions on how to use Tuna.js"
    }
}();
/** @license ISC License (ISC)
 Copyright 2016 Alexander Wallin <office@alexanderwallin.com> (http://alexanderwallin.com)

 Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

 THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */
! function() {
    function e() {
        return void 0 === Howler.ctx.createGain ? Howler.ctx.createGainNode() : Howler.ctx.createGain()
    }
    HowlerGlobal.prototype._setup = function(t) {
        return function(n) {
            var o = this || Howler;
            return o.effectChain = {
                debug: !1
            }, o._effects = [], o._effectChain = e(), o._effectChainOut = e(), o.masterGain && (o._effectChain.connect(o._effectChainOut), o._effectChainOut.connect(o.masterGain)), t.call(o, n)
        }
    }(HowlerGlobal.prototype._setup), HowlerGlobal.prototype.unload = function(e) {
        return function() {
            var t = this || Howler;
            return t.effectChain.debug && console.warn("[Howler Effects Chain] Calling Howler.unload() creates a new audio context, which will invalidate the effects you have created with the old context."), e.call(t)
        }
    }(HowlerGlobal.prototype.unload), Sound.prototype.create = function(e) {
        return function() {
            var t = e.call(this);
            return t._parent._webAudio && Howler._effectChain && (t._node.disconnect(Howler.masterGain), t._node.connect(Howler._effectChain)), t
        }
    }(Sound.prototype.create), HowlerGlobal.prototype.addEffect = function(e) {
        var t = this || Howler,
            n = t._effects[t._effects.length - 1];
        return n ? (n.disconnect(), n.connect(e)) : (t._effectChain.disconnect(), t._effectChain.connect(e)), e.connect(t._effectChainOut), t._effects.push(e), t
    }, HowlerGlobal.prototype.removeEffect = function(e) {
        var t = this || Howler,
            n = t._effects.indexOf(e);
        if (-1 === n) return console.warn("[Howler effects chain] Cannot remove the effect as it is not added to the chain:", e), t;
        var o = 0 === n ? t._effectChain : t._effects[n - 1],
            c = n === t._effects.length - 1 ? t._effectChainOut : t._effects[n + 1];
        return e.disconnect(), o.disconnect(), o.connect(c), t._effects = t._effects.filter(function(t) {
            return t !== e
        }), t
    }
}();

//Pixi.js使用WebGL，是一个超快的HTML5 2D渲染引擎。
/**
 * @license
 * pixi.js - v4.0.3
 * Compiled Thu Sep 29 2016 12:09:36 GMT-0400 (EDT)
 *
 * pixi.js is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 *
 * The MIT License (MIT)
 * Copyright (c) 2016 Goodboy Digital Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
! function(t) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = t();
    else if ("function" == typeof define && define.amd) define([], t);
    else {
        var e;
        e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, e.PIXI = t()
    }
}(function() {
    var t;
    return function t(e, r, i) {
        function n(o, a) {
            if (!r[o]) {
                if (!e[o]) {
                    var h = "function" == typeof require && require;
                    if (!a && h) return h(o, !0);
                    if (s) return s(o, !0);
                    var u = new Error("Cannot find module '" + o + "'");
                    throw u.code = "MODULE_NOT_FOUND", u
                }
                var l = r[o] = {
                    exports: {}
                };
                e[o][0].call(l.exports, function(t) {
                    var r = e[o][1][t];
                    return n(r ? r : t)
                }, l, l.exports, t, e, r, i)
            }
            return r[o].exports
        }
        for (var s = "function" == typeof require && require, o = 0; o < i.length; o++) n(i[o]);
        return n
    }({
        1: [function(t, e, r) {		//"bit-twiddle": 1
            "use strict";
            "use restrict";		//?

            function i(t) {
                var e = 32;
                return t &= -t, t && e--, 65535 & t && (e -= 16), 16711935 & t && (e -= 8), 252645135 & t && (e -= 4), 858993459 & t && (e -= 2), 1431655765 & t && (e -= 1), e
            }
            var n = 32;
            r.INT_BITS = n, r.INT_MAX = 2147483647, r.INT_MIN = -1 << n - 1, r.sign = function(t) {
                return (t > 0) - (t < 0)
            }, r.abs = function(t) {
                var e = t >> n - 1;
                return (t ^ e) - e
            }, r.min = function(t, e) {
                return e ^ (t ^ e) & -(t < e)
            }, r.max = function(t, e) {
                return t ^ (t ^ e) & -(t < e)
            }, r.isPow2 = function(t) {
                return !(t & t - 1 || !t)
            }, r.log2 = function(t) {
                var e, r;
                return e = (t > 65535) << 4, t >>>= e, r = (t > 255) << 3, t >>>= r, e |= r, r = (t > 15) << 2, t >>>= r, e |= r, r = (t > 3) << 1, t >>>= r, e |= r, e | t >> 1
            }, r.log10 = function(t) {
                return t >= 1e9 ? 9 : t >= 1e8 ? 8 : t >= 1e7 ? 7 : t >= 1e6 ? 6 : t >= 1e5 ? 5 : t >= 1e4 ? 4 : t >= 1e3 ? 3 : t >= 100 ? 2 : t >= 10 ? 1 : 0
            }, r.popCount = function(t) {
                return t -= t >>> 1 & 1431655765, t = (858993459 & t) + (t >>> 2 & 858993459), 16843009 * (t + (t >>> 4) & 252645135) >>> 24
            }, r.countTrailingZeros = i, r.nextPow2 = function(t) {
                return t += 0 === t, --t, t |= t >>> 1, t |= t >>> 2, t |= t >>> 4, t |= t >>> 8, t |= t >>> 16, t + 1
            }, r.prevPow2 = function(t) {
                return t |= t >>> 1, t |= t >>> 2, t |= t >>> 4, t |= t >>> 8, t |= t >>> 16, t - (t >>> 1)
            }, r.parity = function(t) {
                return t ^= t >>> 16, t ^= t >>> 8, t ^= t >>> 4, t &= 15, 27030 >>> t & 1
            };
            var s = new Array(256);
            ! function(t) {
                for (var e = 0; e < 256; ++e) {
                    var r = e,
                        i = e,
                        n = 7;
                    for (r >>>= 1; r; r >>>= 1) i <<= 1, i |= 1 & r, --n;
                    t[e] = i << n & 255
                }
            }(s), r.reverse = function(t) {
                return s[255 & t] << 24 | s[t >>> 8 & 255] << 16 | s[t >>> 16 & 255] << 8 | s[t >>> 24 & 255]
            }, r.interleave2 = function(t, e) {
                return t &= 65535, t = 16711935 & (t | t << 8), t = 252645135 & (t | t << 4), t = 858993459 & (t | t << 2), t = 1431655765 & (t | t << 1), e &= 65535, e = 16711935 & (e | e << 8), e = 252645135 & (e | e << 4), e = 858993459 & (e | e << 2), e = 1431655765 & (e | e << 1), t | e << 1
            }, r.deinterleave2 = function(t, e) {
                return t = t >>> e & 1431655765, t = 858993459 & (t | t >>> 1), t = 252645135 & (t | t >>> 2), t = 16711935 & (t | t >>> 4), t = 65535 & (t | t >>> 16), t << 16 >> 16
            }, r.interleave3 = function(t, e, r) {
                return t &= 1023, t = 4278190335 & (t | t << 16), t = 251719695 & (t | t << 8), t = 3272356035 & (t | t << 4), t = 1227133513 & (t | t << 2), e &= 1023, e = 4278190335 & (e | e << 16), e = 251719695 & (e | e << 8), e = 3272356035 & (e | e << 4), e = 1227133513 & (e | e << 2), t |= e << 1, r &= 1023, r = 4278190335 & (r | r << 16), r = 251719695 & (r | r << 8), r = 3272356035 & (r | r << 4), r = 1227133513 & (r | r << 2), t | r << 2
            }, r.deinterleave3 = function(t, e) {
                return t = t >>> e & 1227133513, t = 3272356035 & (t | t >>> 2), t = 251719695 & (t | t >>> 4), t = 4278190335 & (t | t >>> 8), t = 1023 & (t | t >>> 16), t << 22 >> 22
            }, r.nextCombination = function(t) {
                var e = t | t - 1;
                return e + 1 | (~e & -~e) - 1 >>> i(t) + 1
            }
        }, {}],
        2: [function(t, e, r) {
            "use strict";

            function i(t, e, r) {
                r = r || 2;
                var i = e && e.length,
                    s = i ? e[0] * r : t.length,
                    a = n(t, 0, s, r, !0),
                    h = [];
                if (!a) return h;
                var u, l, d, p, f, v, g;
                if (i && (a = c(t, e, a, r)), t.length > 80 * r) {
                    u = d = t[0], l = p = t[1];
                    for (var y = r; y < s; y += r) f = t[y], v = t[y + 1], f < u && (u = f), v < l && (l = v), f > d && (d = f), v > p && (p = v);
                    g = Math.max(d - u, p - l)
                }
                return o(a, h, r, u, l, g), h
            }

            function n(t, e, r, i, n) {
                var s, o;
                if (n === D(t, e, r, i) > 0)
                    for (s = e; s < r; s += i) o = M(s, t[s], t[s + 1], o);
                else
                    for (s = r - i; s >= e; s -= i) o = M(s, t[s], t[s + 1], o);
                return o && T(o, o.next) && (A(o), o = o.next), o
            }

            function s(t, e) {
                if (!t) return t;
                e || (e = t);
                var r, i = t;
                do
                    if (r = !1, i.steiner || !T(i, i.next) && 0 !== b(i.prev, i, i.next)) i = i.next;
                    else {
                        if (A(i), i = e = i.prev, i === i.next) return null;
                        r = !0
                    }
                while (r || i !== e);
                return e
            }

            function o(t, e, r, i, n, c, d) {
                if (t) {
                    !d && c && v(t, i, n, c);
                    for (var p, f, g = t; t.prev !== t.next;)
                        if (p = t.prev, f = t.next, c ? h(t, i, n, c) : a(t)) e.push(p.i / r), e.push(t.i / r), e.push(f.i / r), A(t), t = f.next, g = f.next;
                        else if (t = f, t === g) {
                            d ? 1 === d ? (t = u(t, e, r), o(t, e, r, i, n, c, 2)) : 2 === d && l(t, e, r, i, n, c) : o(s(t), e, r, i, n, c, 1);
                            break
                        }
                }
            }

            function a(t) {
                var e = t.prev,
                    r = t,
                    i = t.next;
                if (b(e, r, i) >= 0) return !1;
                for (var n = t.next.next; n !== t.prev;) {
                    if (m(e.x, e.y, r.x, r.y, i.x, i.y, n.x, n.y) && b(n.prev, n, n.next) >= 0) return !1;
                    n = n.next
                }
                return !0
            }

            function h(t, e, r, i) {
                var n = t.prev,
                    s = t,
                    o = t.next;
                if (b(n, s, o) >= 0) return !1;
                for (var a = n.x < s.x ? n.x < o.x ? n.x : o.x : s.x < o.x ? s.x : o.x, h = n.y < s.y ? n.y < o.y ? n.y : o.y : s.y < o.y ? s.y : o.y, u = n.x > s.x ? n.x > o.x ? n.x : o.x : s.x > o.x ? s.x : o.x, l = n.y > s.y ? n.y > o.y ? n.y : o.y : s.y > o.y ? s.y : o.y, c = y(a, h, e, r, i), d = y(u, l, e, r, i), p = t.nextZ; p && p.z <= d;) {
                    if (p !== t.prev && p !== t.next && m(n.x, n.y, s.x, s.y, o.x, o.y, p.x, p.y) && b(p.prev, p, p.next) >= 0) return !1;
                    p = p.nextZ
                }
                for (p = t.prevZ; p && p.z >= c;) {
                    if (p !== t.prev && p !== t.next && m(n.x, n.y, s.x, s.y, o.x, o.y, p.x, p.y) && b(p.prev, p, p.next) >= 0) return !1;
                    p = p.prevZ
                }
                return !0
            }

            function u(t, e, r) {
                var i = t;
                do {
                    var n = i.prev,
                        s = i.next.next;
                    !T(n, s) && E(n, i, i.next, s) && S(n, s) && S(s, n) && (e.push(n.i / r), e.push(i.i / r), e.push(s.i / r), A(i), A(i.next), i = t = s), i = i.next
                } while (i !== t);
                return i
            }

            function l(t, e, r, i, n, a) {
                var h = t;
                do {
                    for (var u = h.next.next; u !== h.prev;) {
                        if (h.i !== u.i && _(h, u)) {
                            var l = R(h, u);
                            return h = s(h, h.next), l = s(l, l.next), o(h, e, r, i, n, a), void o(l, e, r, i, n, a)
                        }
                        u = u.next
                    }
                    h = h.next
                } while (h !== t)
            }

            function c(t, e, r, i) {
                var o, a, h, u, l, c = [];
                for (o = 0, a = e.length; o < a; o++) h = e[o] * i, u = o < a - 1 ? e[o + 1] * i : t.length, l = n(t, h, u, i, !1), l === l.next && (l.steiner = !0), c.push(x(l));
                for (c.sort(d), o = 0; o < c.length; o++) p(c[o], r), r = s(r, r.next);
                return r
            }

            function d(t, e) {
                return t.x - e.x
            }

            function p(t, e) {
                if (e = f(t, e)) {
                    var r = R(e, t);
                    s(r, r.next)
                }
            }

            function f(t, e) {
                var r, i = e,
                    n = t.x,
                    s = t.y,
                    o = -(1 / 0);
                do {
                    if (s <= i.y && s >= i.next.y) {
                        var a = i.x + (s - i.y) * (i.next.x - i.x) / (i.next.y - i.y);
                        if (a <= n && a > o) {
                            if (o = a, a === n) {
                                if (s === i.y) return i;
                                if (s === i.next.y) return i.next
                            }
                            r = i.x < i.next.x ? i : i.next
                        }
                    }
                    i = i.next
                } while (i !== e);
                if (!r) return null;
                if (n === o) return r.prev;
                var h, u = r,
                    l = r.x,
                    c = r.y,
                    d = 1 / 0;
                for (i = r.next; i !== u;) n >= i.x && i.x >= l && m(s < c ? n : o, s, l, c, s < c ? o : n, s, i.x, i.y) && (h = Math.abs(s - i.y) / (n - i.x), (h < d || h === d && i.x > r.x) && S(i, t) && (r = i, d = h)), i = i.next;
                return r
            }

            function v(t, e, r, i) {
                var n = t;
                do null === n.z && (n.z = y(n.x, n.y, e, r, i)), n.prevZ = n.prev, n.nextZ = n.next, n = n.next; while (n !== t);
                n.prevZ.nextZ = null, n.prevZ = null, g(n)
            }

            function g(t) {
                var e, r, i, n, s, o, a, h, u = 1;
                do {
                    for (r = t, t = null, s = null, o = 0; r;) {
                        for (o++, i = r, a = 0, e = 0; e < u && (a++, i = i.nextZ, i); e++);
                        for (h = u; a > 0 || h > 0 && i;) 0 === a ? (n = i, i = i.nextZ, h--) : 0 !== h && i ? r.z <= i.z ? (n = r, r = r.nextZ, a--) : (n = i, i = i.nextZ, h--) : (n = r, r = r.nextZ, a--), s ? s.nextZ = n : t = n, n.prevZ = s, s = n;
                        r = i
                    }
                    s.nextZ = null, u *= 2
                } while (o > 1);
                return t
            }

            function y(t, e, r, i, n) {
                return t = 32767 * (t - r) / n, e = 32767 * (e - i) / n, t = 16711935 & (t | t << 8), t = 252645135 & (t | t << 4), t = 858993459 & (t | t << 2), t = 1431655765 & (t | t << 1), e = 16711935 & (e | e << 8), e = 252645135 & (e | e << 4), e = 858993459 & (e | e << 2), e = 1431655765 & (e | e << 1), t | e << 1
            }

            function x(t) {
                var e = t,
                    r = t;
                do e.x < r.x && (r = e), e = e.next; while (e !== t);
                return r
            }

            function m(t, e, r, i, n, s, o, a) {
                return (n - o) * (e - a) - (t - o) * (s - a) >= 0 && (t - o) * (i - a) - (r - o) * (e - a) >= 0 && (r - o) * (s - a) - (n - o) * (i - a) >= 0
            }

            function _(t, e) {
                return t.next.i !== e.i && t.prev.i !== e.i && !w(t, e) && S(t, e) && S(e, t) && C(t, e)
            }

            function b(t, e, r) {
                return (e.y - t.y) * (r.x - e.x) - (e.x - t.x) * (r.y - e.y)
            }

            function T(t, e) {
                return t.x === e.x && t.y === e.y
            }

            function E(t, e, r, i) {
                return !!(T(t, e) && T(r, i) || T(t, i) && T(r, e)) || b(t, e, r) > 0 != b(t, e, i) > 0 && b(r, i, t) > 0 != b(r, i, e) > 0
            }

            function w(t, e) {
                var r = t;
                do {
                    if (r.i !== t.i && r.next.i !== t.i && r.i !== e.i && r.next.i !== e.i && E(r, r.next, t, e)) return !0;
                    r = r.next
                } while (r !== t);
                return !1
            }

            function S(t, e) {
                return b(t.prev, t, t.next) < 0 ? b(t, e, t.next) >= 0 && b(t, t.prev, e) >= 0 : b(t, e, t.prev) < 0 || b(t, t.next, e) < 0
            }

            function C(t, e) {
                var r = t,
                    i = !1,
                    n = (t.x + e.x) / 2,
                    s = (t.y + e.y) / 2;
                do r.y > s != r.next.y > s && n < (r.next.x - r.x) * (s - r.y) / (r.next.y - r.y) + r.x && (i = !i), r = r.next; while (r !== t);
                return i
            }

            function R(t, e) {
                var r = new O(t.i, t.x, t.y),
                    i = new O(e.i, e.x, e.y),
                    n = t.next,
                    s = e.prev;
                return t.next = e, e.prev = t, r.next = n, n.prev = r, i.next = r, r.prev = i, s.next = i, i.prev = s, i
            }

            function M(t, e, r, i) {
                var n = new O(t, e, r);
                return i ? (n.next = i.next, n.prev = i, i.next.prev = n, i.next = n) : (n.prev = n, n.next = n), n
            }

            function A(t) {
                t.next.prev = t.prev, t.prev.next = t.next, t.prevZ && (t.prevZ.nextZ = t.nextZ), t.nextZ && (t.nextZ.prevZ = t.prevZ)
            }

            function O(t, e, r) {
                this.i = t, this.x = e, this.y = r, this.prev = null, this.next = null, this.z = null, this.prevZ = null, this.nextZ = null, this.steiner = !1
            }

            function D(t, e, r, i) {
                for (var n = 0, s = e, o = r - i; s < r; s += i) n += (t[o] - t[s]) * (t[s + 1] + t[o + 1]), o = s;
                return n
            }
            e.exports = i, i.deviation = function(t, e, r, i) {
                var n = e && e.length,
                    s = n ? e[0] * r : t.length,
                    o = Math.abs(D(t, 0, s, r));
                if (n)
                    for (var a = 0, h = e.length; a < h; a++) {
                        var u = e[a] * r,
                            l = a < h - 1 ? e[a + 1] * r : t.length;
                        o -= Math.abs(D(t, u, l, r))
                    }
                var c = 0;
                for (a = 0; a < i.length; a += 3) {
                    var d = i[a] * r,
                        p = i[a + 1] * r,
                        f = i[a + 2] * r;
                    c += Math.abs((t[d] - t[f]) * (t[p + 1] - t[d + 1]) - (t[d] - t[p]) * (t[f + 1] - t[d + 1]))
                }
                return 0 === o && 0 === c ? 0 : Math.abs((c - o) / o)
            }, i.flatten = function(t) {
                for (var e = t[0][0].length, r = {
                    vertices: [],
                    holes: [],
                    dimensions: e
                }, i = 0, n = 0; n < t.length; n++) {
                    for (var s = 0; s < t[n].length; s++)
                        for (var o = 0; o < e; o++) r.vertices.push(t[n][s][o]);
                    n > 0 && (i += t[n - 1].length, r.holes.push(i))
                }
                return r
            }
        }, {}],
        3: [function(t, e, r) {		//eventemitter3: 3
            "use strict";

            function i(t, e, r) {
                this.fn = t, this.context = e, this.once = r || !1
            }

            function n() {}
            var s = Object.prototype.hasOwnProperty,
                o = "function" != typeof Object.create && "~";
            n.prototype._events = void 0, n.prototype.eventNames = function() {
                var t, e = this._events,
                    r = [];
                if (!e) return r;
                for (t in e) s.call(e, t) && r.push(o ? t.slice(1) : t);
                return Object.getOwnPropertySymbols ? r.concat(Object.getOwnPropertySymbols(e)) : r
            }, n.prototype.listeners = function(t, e) {
                var r = o ? o + t : t,
                    i = this._events && this._events[r];
                if (e) return !!i;
                if (!i) return [];
                if (i.fn) return [i.fn];
                for (var n = 0, s = i.length, a = new Array(s); n < s; n++) a[n] = i[n].fn;
                return a
            }, n.prototype.emit = function(t, e, r, i, n, s) {
                var a = o ? o + t : t;
                if (!this._events || !this._events[a]) return !1;
                var h, u, l = this._events[a],
                    c = arguments.length;
                if ("function" == typeof l.fn) {
                    switch (l.once && this.removeListener(t, l.fn, void 0, !0), c) {
                        case 1:
                            return l.fn.call(l.context), !0;
                        case 2:
                            return l.fn.call(l.context, e), !0;
                        case 3:
                            return l.fn.call(l.context, e, r), !0;
                        case 4:
                            return l.fn.call(l.context, e, r, i), !0;
                        case 5:
                            return l.fn.call(l.context, e, r, i, n), !0;
                        case 6:
                            return l.fn.call(l.context, e, r, i, n, s), !0
                    }
                    for (u = 1, h = new Array(c - 1); u < c; u++) h[u - 1] = arguments[u];
                    l.fn.apply(l.context, h)
                } else {
                    var d, p = l.length;
                    for (u = 0; u < p; u++) switch (l[u].once && this.removeListener(t, l[u].fn, void 0, !0), c) {
                        case 1:
                            l[u].fn.call(l[u].context);
                            break;
                        case 2:
                            l[u].fn.call(l[u].context, e);
                            break;
                        case 3:
                            l[u].fn.call(l[u].context, e, r);
                            break;
                        default:
                            if (!h)
                                for (d = 1, h = new Array(c - 1); d < c; d++) h[d - 1] = arguments[d];
                            l[u].fn.apply(l[u].context, h)
                    }
                }
                return !0
            }, n.prototype.on = function(t, e, r) {
                var n = new i(e, r || this),
                    s = o ? o + t : t;
                return this._events || (this._events = o ? {} : Object.create(null)), this._events[s] ? this._events[s].fn ? this._events[s] = [this._events[s], n] : this._events[s].push(n) : this._events[s] = n, this
            }, n.prototype.once = function(t, e, r) {
                var n = new i(e, r || this, (!0)),
                    s = o ? o + t : t;
                return this._events || (this._events = o ? {} : Object.create(null)), this._events[s] ? this._events[s].fn ? this._events[s] = [this._events[s], n] : this._events[s].push(n) : this._events[s] = n, this
            }, n.prototype.removeListener = function(t, e, r, i) {
                var n = o ? o + t : t;
                if (!this._events || !this._events[n]) return this;
                var s = this._events[n],
                    a = [];
                if (e)
                    if (s.fn)(s.fn !== e || i && !s.once || r && s.context !== r) && a.push(s);
                    else
                        for (var h = 0, u = s.length; h < u; h++)(s[h].fn !== e || i && !s[h].once || r && s[h].context !== r) && a.push(s[h]);
                return a.length ? this._events[n] = 1 === a.length ? a[0] : a : delete this._events[n], this
            }, n.prototype.removeAllListeners = function(t) {
                return this._events ? (t ? delete this._events[o ? o + t : t] : this._events = o ? {} : Object.create(null), this) : this
            }, n.prototype.off = n.prototype.removeListener, n.prototype.addListener = n.prototype.on, n.prototype.setMaxListeners = function() {
                return this
            }, n.prefixed = o, "undefined" != typeof e && (e.exports = n)
        }, {}],
        4: [function(e, r, i) {		//设备型号ismobilejs: 4
            ! function(e) {
                var i = /iPhone/i,
                    n = /iPod/i,
                    s = /iPad/i,
                    o = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,
                    a = /Android/i,
                    h = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,
                    u = /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,
                    l = /IEMobile/i,
                    c = /(?=.*\bWindows\b)(?=.*\bARM\b)/i,
                    d = /BlackBerry/i,
                    p = /BB10/i,
                    f = /Opera Mini/i,
                    v = /(CriOS|Chrome)(?=.*\bMobile\b)/i,
                    g = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,
                    y = new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)", "i"),
                    x = function(t, e) {
                        return t.test(e)
                    },
                    m = function(t) {
                        var e = t || navigator.userAgent,
                            r = e.split("[FBAN");
                        if ("undefined" != typeof r[1] && (e = r[0]), r = e.split("Twitter"), "undefined" != typeof r[1] && (e = r[0]), this.apple = {
                                phone: x(i, e),
                                ipod: x(n, e),
                                tablet: !x(i, e) && x(s, e),
                                device: x(i, e) || x(n, e) || x(s, e)
                            }, this.amazon = {
                                phone: x(h, e),
                                tablet: !x(h, e) && x(u, e),
                                device: x(h, e) || x(u, e)
                            }, this.android = {
                                phone: x(h, e) || x(o, e),
                                tablet: !x(h, e) && !x(o, e) && (x(u, e) || x(a, e)),
                                device: x(h, e) || x(u, e) || x(o, e) || x(a, e)
                            }, this.windows = {
                                phone: x(l, e),
                                tablet: x(c, e),
                                device: x(l, e) || x(c, e)
                            }, this.other = {
                                blackberry: x(d, e),
                                blackberry10: x(p, e),
                                opera: x(f, e),
                                firefox: x(g, e),
                                chrome: x(v, e),
                                device: x(d, e) || x(p, e) || x(f, e) || x(g, e) || x(v, e)
                            }, this.seven_inch = x(y, e), this.any = this.apple.device || this.android.device || this.windows.device || this.other.device || this.seven_inch, this.phone = this.apple.phone || this.android.phone || this.windows.phone, this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet, "undefined" == typeof window) return this
                    },
                    _ = function() {
                        var t = new m;
                        return t.Class = m, t
                    };
                "undefined" != typeof r && r.exports && "undefined" == typeof window ? r.exports = m : "undefined" != typeof r && r.exports && "undefined" != typeof window ? r.exports = _() : "function" == typeof t && t.amd ? t("isMobile", [], e.isMobile = _()) : e.isMobile = _()
            }(this)
        }, {}],
        5: [function(t, e, r) {		//"object-assign": 5
            "use strict";

            function i(t) {
                if (null === t || void 0 === t) throw new TypeError("Object.assign cannot be called with null or undefined");
                return Object(t)
            }

            function n() {
                try {
                    if (!Object.assign) return !1;
                    var t = new String("abc");
                    if (t[5] = "de", "5" === Object.getOwnPropertyNames(t)[0]) return !1;
                    for (var e = {}, r = 0; r < 10; r++) e["_" + String.fromCharCode(r)] = r;
                    var i = Object.getOwnPropertyNames(e).map(function(t) {
                        return e[t]
                    });
                    if ("0123456789" !== i.join("")) return !1;
                    var n = {};
                    return "abcdefghijklmnopqrst".split("").forEach(function(t) {
                        n[t] = t
                    }), "abcdefghijklmnopqrst" === Object.keys(Object.assign({}, n)).join("")
                } catch (t) {
                    return !1
                }
            }
            var s = Object.prototype.hasOwnProperty,
                o = Object.prototype.propertyIsEnumerable;
            e.exports = n() ? Object.assign : function(t, e) {
                for (var r, n, a = i(t), h = 1; h < arguments.length; h++) {
                    r = Object(arguments[h]);
                    for (var u in r) s.call(r, u) && (a[u] = r[u]);
                    if (Object.getOwnPropertySymbols) {
                        n = Object.getOwnPropertySymbols(r);
                        for (var l = 0; l < n.length; l++) o.call(r, n[l]) && (a[n[l]] = r[n[l]])
                    }
                }
                return a
            }
        }, {}],
        6: [function(t, e, r) {		//GLBuffer: 6
            var i = new ArrayBuffer(0),
                n = function(t, e, r, n) {
                    this.gl = t, this.buffer = t.createBuffer(), this.type = e || t.ARRAY_BUFFER, this.drawType = n || t.STATIC_DRAW, this.data = i, r && this.upload(r)
                };
            n.prototype.upload = function(t, e, r) {
                r || this.bind();
                var i = this.gl;
                t = t || this.data, e = e || 0, this.data.byteLength >= t.byteLength ? i.bufferSubData(this.type, e, t) : i.bufferData(this.type, t, this.drawType), this.data = t
            }, n.prototype.bind = function() {
                var t = this.gl;
                t.bindBuffer(this.type, this.buffer)
            }, n.createVertexBuffer = function(t, e, r) {
                return new n(t, t.ARRAY_BUFFER, e, r)
            }, n.createIndexBuffer = function(t, e, r) {
                return new n(t, t.ELEMENT_ARRAY_BUFFER, e, r)
            }, n.create = function(t, e, r, i) {
                return new n(t, e, i)
            }, n.prototype.destroy = function() {
                this.gl.deleteBuffer(this.buffer)
            }, e.exports = n
        }, {}],
        7: [function(t, e, r) {		//GLFramebuffer: 7
            var i = t("./GLTexture"),
                n = function(t, e, r) {
                    this.gl = t, this.framebuffer = t.createFramebuffer(), this.stencil = null, this.texture = null, this.width = e || 100, this.height = r || 100
                };
            n.prototype.enableTexture = function(t) {
                var e = this.gl;
                this.texture = t || new i(e), this.texture.bind(), this.bind(), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, this.texture.texture, 0)
            }, n.prototype.enableStencil = function() {
                if (!this.stencil) {
                    var t = this.gl;
                    this.stencil = t.createRenderbuffer(), t.bindRenderbuffer(t.RENDERBUFFER, this.stencil), t.framebufferRenderbuffer(t.FRAMEBUFFER, t.DEPTH_STENCIL_ATTACHMENT, t.RENDERBUFFER, this.stencil), t.renderbufferStorage(t.RENDERBUFFER, t.DEPTH_STENCIL, this.width, this.height)
                }
            }, n.prototype.clear = function(t, e, r, i) {
                this.bind();
                var n = this.gl;
                n.clearColor(t, e, r, i), n.clear(n.COLOR_BUFFER_BIT)
            }, n.prototype.bind = function() {
                var t = this.gl;
                this.texture && this.texture.unbind(), t.bindFramebuffer(t.FRAMEBUFFER, this.framebuffer)
            }, n.prototype.unbind = function() {
                var t = this.gl;
                t.bindFramebuffer(t.FRAMEBUFFER, null)
            }, n.prototype.resize = function(t, e) {
                var r = this.gl;
                this.width = t, this.height = e, this.texture && this.texture.uploadData(null, t, e), this.stencil && (r.bindRenderbuffer(r.RENDERBUFFER, this.stencil), r.renderbufferStorage(r.RENDERBUFFER, r.DEPTH_STENCIL, t, e))
            }, n.prototype.destroy = function() {
                var t = this.gl;
                this.texture && this.texture.destroy(), t.deleteFramebuffer(this.framebuffer), this.gl = null, this.stencil = null, this.texture = null
            }, n.createRGBA = function(t, e, r) {
                var s = i.fromData(t, null, e, r);
                s.enableNearestScaling(), s.enableWrapClamp();
                var o = new n(t, e, r);
                return o.enableTexture(s), o.unbind(), o
            }, n.createFloat32 = function(t, e, r, s) {
                var o = new i.fromData(t, s, e, r);
                o.enableNearestScaling(), o.enableWrapClamp();
                var a = new n(t, e, r);
                return a.enableTexture(o), a.unbind(), a
            }, e.exports = n
        }, {
            "./GLTexture": 9
        }],
        8: [function(t, e, r) {		//GLShader": 8
            var i = t("./shader/compileProgram"),
                n = t("./shader/extractAttributes"),
                s = t("./shader/extractUniforms"),
                o = t("./shader/generateUniformAccessObject"),
                a = function(t, e, r) {
                    this.gl = t, this.program = i(t, e, r), this.attributes = n(t, this.program);
                    var a = s(t, this.program);
                    this.uniforms = o(t, a)
                };
            a.prototype.bind = function() {
                this.gl.useProgram(this.program)
            }, a.prototype.destroy = function() {}, e.exports = a
        }, {
            "./shader/compileProgram": 14,
            "./shader/extractAttributes": 16,
            "./shader/extractUniforms": 17,
            "./shader/generateUniformAccessObject": 18
        }],
        9: [function(t, e, r) {		//GLTexture: 9
            var i = function(t, e, r, i, n) {
                this.gl = t, this.texture = t.createTexture(), this.mipmap = !1, this.premultiplyAlpha = !1, this.width = e || 0, this.height = r || 0, this.format = i || t.RGBA, this.type = n || t.UNSIGNED_BYTE
            };
            i.prototype.upload = function(t) {
                this.bind();
                var e = this.gl;
                this.width = t.videoWidth || t.width, this.height = t.videoHeight || t.height, e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha), e.texImage2D(e.TEXTURE_2D, 0, this.format, this.format, this.type, t)
            };
            var n = !1;
            i.prototype.uploadData = function(t, e, r) {
                this.bind();
                var i = this.gl;
                if (this.width = e || this.width, this.height = r || this.height, t instanceof Float32Array) {
                    if (!n) {
                        var s = i.getExtension("OES_texture_float");
                        if (!s) throw new Error("floating point textures not available");
                        n = !0
                    }
                    this.type = i.FLOAT
                } else this.type = i.UNSIGNED_BYTE;
                i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha), i.texImage2D(i.TEXTURE_2D, 0, this.format, this.width, this.height, 0, this.format, this.type, t || null)
            }, i.prototype.bind = function(t) {
                var e = this.gl;
                void 0 !== t && e.activeTexture(e.TEXTURE0 + t), e.bindTexture(e.TEXTURE_2D, this.texture)
            }, i.prototype.unbind = function() {
                var t = this.gl;
                t.bindTexture(t.TEXTURE_2D, null)
            }, i.prototype.minFilter = function(t) {
                var e = this.gl;
                this.bind(), this.mipmap ? e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, t ? e.LINEAR_MIPMAP_LINEAR : e.NEAREST_MIPMAP_NEAREST) : e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, t ? e.LINEAR : e.NEAREST)
            }, i.prototype.magFilter = function(t) {
                var e = this.gl;
                this.bind(), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, t ? e.LINEAR : e.NEAREST)
            }, i.prototype.enableMipmap = function() {
                var t = this.gl;
                this.bind(), this.mipmap = !0, t.generateMipmap(t.TEXTURE_2D)
            }, i.prototype.enableLinearScaling = function() {
                this.minFilter(!0), this.magFilter(!0)
            }, i.prototype.enableNearestScaling = function() {
                this.minFilter(!1), this.magFilter(!1)
            }, i.prototype.enableWrapClamp = function() {
                var t = this.gl;
                this.bind(), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE)
            }, i.prototype.enableWrapRepeat = function() {
                var t = this.gl;
                this.bind(), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.REPEAT), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.REPEAT)
            }, i.prototype.enableWrapMirrorRepeat = function() {
                var t = this.gl;
                this.bind(), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.MIRRORED_REPEAT), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.MIRRORED_REPEAT)
            }, i.prototype.destroy = function() {
                var t = this.gl;
                t.deleteTexture(this.texture)
            }, i.fromSource = function(t, e, r) {
                var n = new i(t);
                return n.premultiplyAlpha = r || !1, n.upload(e), n
            }, i.fromData = function(t, e, r, n) {
                var s = new i(t);
                return s.uploadData(e, r, n), s
            }, e.exports = i
        }, {}],
        10: [function(t, e, r) {			//VertexArrayObject": 10
            function i(t, e) {
                if (this.nativeVaoExtension = null, i.FORCE_NATIVE || (this.nativeVaoExtension = t.getExtension("OES_vertex_array_object") || t.getExtension("MOZ_OES_vertex_array_object") || t.getExtension("WEBKIT_OES_vertex_array_object")), this.nativeState = e, this.nativeVaoExtension) {
                    this.nativeVao = this.nativeVaoExtension.createVertexArrayOES();
                    var r = t.getParameter(t.MAX_VERTEX_ATTRIBS);
                    this.nativeState = {
                        tempAttribState: new Array(r),
                        attribState: new Array(r)
                    }
                }
                this.gl = t, this.attributes = [], this.indexBuffer = null, this.dirty = !1
            }
            var n = t("./setVertexAttribArrays");
            i.prototype.constructor = i, e.exports = i, i.FORCE_NATIVE = !1, i.prototype.bind = function() {
                return this.nativeVao ? (this.nativeVaoExtension.bindVertexArrayOES(this.nativeVao), this.dirty && (this.dirty = !1, this.activate())) : this.activate(), this
            }, i.prototype.unbind = function() {
                return this.nativeVao && this.nativeVaoExtension.bindVertexArrayOES(null), this
            }, i.prototype.activate = function() {
                for (var t = this.gl, e = null, r = 0; r < this.attributes.length; r++) {
                    var i = this.attributes[r];
                    e !== i.buffer && (i.buffer.bind(), e = i.buffer), t.vertexAttribPointer(i.attribute.location, i.attribute.size, i.type || t.FLOAT, i.normalized || !1, i.stride || 0, i.start || 0)
                }
                return n(t, this.attributes, this.nativeState), this.indexBuffer.bind(), this
            }, i.prototype.addAttribute = function(t, e, r, i, n, s) {
                return this.attributes.push({
                    buffer: t,
                    attribute: e,
                    location: e.location,
                    type: r || this.gl.FLOAT,
                    normalized: i || !1,
                    stride: n || 0,
                    start: s || 0
                }), this.dirty = !0, this
            }, i.prototype.addIndex = function(t) {
                return this.indexBuffer = t, this.dirty = !0, this
            }, i.prototype.clear = function() {
                return this.nativeVao && this.nativeVaoExtension.bindVertexArrayOES(this.nativeVao), this.attributes.length = 0, this.indexBuffer = null, this
            }, i.prototype.draw = function(t, e, r) {
                var i = this.gl;
                return i.drawElements(t, e, i.UNSIGNED_SHORT, r || 0), this
            }, i.prototype.destroy = function() {
                this.gl = null, this.indexBuffer = null, this.attributes = null, this.nativeState = null, this.nativeVao && this.nativeVaoExtension.deleteVertexArrayOES(this.nativeVao), this.nativeVaoExtension = null, this.nativeVao = null
            }
        }, {
            "./setVertexAttribArrays": 13
        }],
        11: [function(t, e, r) {		//createContext": 11
            var i = function(t, e) {
                var r = t.getContext("webgl", e) || t.getContext("experimental-webgl", e);
                if (!r) throw new Error("This browser does not support webGL. Try using the canvas renderer");
                return r
            };
            e.exports = i
        }, {}],
        12: [function(t, e, r) {	
            var i = {
                createContext: t("./createContext"),
                setVertexAttribArrays: t("./setVertexAttribArrays"),
                GLBuffer: t("./GLBuffer"),		//缓冲
                GLFramebuffer: t("./GLFramebuffer"),
                GLShader: t("./GLShader"),		//着色器
                GLTexture: t("./GLTexture"),
                VertexArrayObject: t("./VertexArrayObject"),
                shader: t("./shader")
            };
            "undefined" != typeof e && e.exports && (e.exports = i), "undefined" != typeof window && (window.pixi = {
                gl: i
            })
        }, {
            "./GLBuffer": 6,
            "./GLFramebuffer": 7,
            "./GLShader": 8,
            "./GLTexture": 9,
            "./VertexArrayObject": 10,
            "./createContext": 11,
            "./setVertexAttribArrays": 13,
            "./shader": 19
        }],
        13: [function(t, e, r) {		//setVertexAttribArrays": 13
            var i = function(t, e, r) {
                var i;
                if (r) {
                    var n = r.tempAttribState,
                        s = r.attribState;
                    for (i = 0; i < n.length; i++) n[i] = !1;
                    for (i = 0; i < e.length; i++) n[e[i].attribute.location] = !0;
                    for (i = 0; i < s.length; i++) s[i] !== n[i] && (s[i] = n[i], r.attribState[i] ? t.enableVertexAttribArray(i) : t.disableVertexAttribArray(i))
                } else
                    for (i = 0; i < e.length; i++) {
                        var o = e[i];
                        t.enableVertexAttribArray(o.attribute.location)
                    }
            };
            e.exports = i
        }, {}],
        14: [function(t, e, r) {			//compileProgram: 14
            var i = function(t, e, r) {
                    var i = n(t, t.VERTEX_SHADER, e),
                        s = n(t, t.FRAGMENT_SHADER, r),
                        o = t.createProgram();
                    return t.attachShader(o, i), t.attachShader(o, s), t.linkProgram(o), t.getProgramParameter(o, t.LINK_STATUS) || (console.error("Pixi.js Error: Could not initialize shader."), console.error("gl.VALIDATE_STATUS", t.getProgramParameter(o, t.VALIDATE_STATUS)), console.error("gl.getError()", t.getError()), "" !== t.getProgramInfoLog(o) && console.warn("Pixi.js Warning: gl.getProgramInfoLog()", t.getProgramInfoLog(o)), t.deleteProgram(o), o = null), t.deleteShader(i), t.deleteShader(s), o
                },
                n = function(t, e, r) {
                    var i = t.createShader(e);
                    return t.shaderSource(i, r), t.compileShader(i), t.getShaderParameter(i, t.COMPILE_STATUS) ? i : (console.log(t.getShaderInfoLog(i)), null)
                };
            e.exports = i
        }, {}],
        15: [function(t, e, r) {		//15：defaultValue
            var i = function(t, e) {
                    switch (t) {
                        case "float":
                            return 0;
                        case "vec2":
                            return new Float32Array(2 * e);
                        case "vec3":
                            return new Float32Array(3 * e);
                        case "vec4":
                            return new Float32Array(4 * e);
                        case "int":
                        case "sampler2D":
                            return 0;
                        case "ivec2":
                            return new Int32Array(2 * e);
                        case "ivec3":
                            return new Int32Array(3 * e);
                        case "ivec4":
                            return new Int32Array(4 * e);
                        case "bool":
                            return !1;
                        case "bvec2":
                            return n(2 * e);
                        case "bvec3":
                            return n(3 * e);
                        case "bvec4":
                            return n(4 * e);
                        case "mat2":
                            return new Float32Array([1, 0, 0, 1]);
                        case "mat3":
                            return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
                        case "mat4":
                            return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
                    }
                },
                n = function(t) {
                    for (var e = new Array(t), r = 0; r < e.length; r++) e[r] = !1;
                    return e
                };
            e.exports = i
        }, {}],
        16: [function(t, e, r) {			//extractAttributes: 16
            var i = t("./mapType"),
                n = t("./mapSize"),
                s = function(t, e) {
                    for (var r = {}, s = t.getProgramParameter(e, t.ACTIVE_ATTRIBUTES), a = 0; a < s; a++) {
                        var h = t.getActiveAttrib(e, a),
                            u = i(t, h.type);
                        r[h.name] = {
                            type: u,
                            size: n(u),
                            location: t.getAttribLocation(e, h.name),
                            pointer: o
                        }
                    }
                    return r
                },
                o = function(t, e, r, i) {
                    gl.vertexAttribPointer(this.location, this.size, t || gl.FLOAT, e || !1, r || 0, i || 0)
                };
            e.exports = s
        }, {
            "./mapSize": 20,
            "./mapType": 21
        }],
        17: [function(t, e, r) {			//extractUniforms: 17
            var i = t("./mapType"),
                n = t("./defaultValue"),
                s = function(t, e) {
                    for (var r = {}, s = t.getProgramParameter(e, t.ACTIVE_UNIFORMS), o = 0; o < s; o++) {
                        var a = t.getActiveUniform(e, o),
                            h = a.name.replace(/\[.*?\]/, ""),
                            u = i(t, a.type);
                        r[h] = {
                            type: u,
                            size: a.size,
                            location: t.getUniformLocation(e, h),
                            value: n(u, a.size)
                        }
                    }
                    return r
                };
            e.exports = s
        }, {
            "./defaultValue": 15,
            "./mapType": 21
        }],
        18: [function(t, e, r) {			//generateUniformAccessObject: 18
            var i = function(t, e) {
                    var r = {
                        data: {}
                    };
                    r.gl = t;
                    for (var i = Object.keys(e), a = 0; a < i.length; a++) {
                        var h = i[a],
                            u = h.split("."),
                            l = u[u.length - 1],
                            c = o(u, r),
                            d = e[h];
                        c.data[l] = d, c.gl = t, Object.defineProperty(c, l, {
                            get: n(l),
                            set: s(l, d)
                        })
                    }
                    return r
                },
                n = function(t) {
                    var e = a.replace("%%", t);
                    return new Function(e)
                },
                s = function(t, e) {
                    var r, i = h.replace(/%%/g, t);
                    return r = 1 === e.size ? u[e.type] : l[e.type], r && (i += "\nthis.gl." + r + ";"), new Function("value", i)
                },
                o = function(t, e) {
                    for (var r = e, i = 0; i < t.length - 1; i++) {
                        var n = r[t[i]] || {
                                data: {}
                            };
                        r[t[i]] = n, r = n
                    }
                    return r
                },
                a = ["return this.data.%%.value;"].join("\n"),
                h = ["this.data.%%.value = value;", "var location = this.data.%%.location;"].join("\n"),
                u = {	
                    float: "uniform1f(location, value)",		//f表示32位浮点型
                    vec2: "uniform2f(location, value[0], value[1])",		//location指明要更改的uniform变量的位置,value[x]指明在指定的uniform变量中要使用的新值
                    vec3: "uniform3f(location, value[0], value[1], value[2])",
                    vec4: "uniform4f(location, value[0], value[1], value[2], value[3])",
                    int: "uniform1i(location, value)",		//i表示32位整型
                    ivec2: "uniform2i(location, value[0], value[1])",
                    ivec3: "uniform3i(location, value[0], value[1], value[2])",
                    ivec4: "uniform4i(location, value[0], value[1], value[2], value[3])",
                    bool: "uniform1i(location, value)",
                    bvec2: "uniform2i(location, value[0], value[1])",
                    bvec3: "uniform3i(location, value[0], value[1], value[2])",
                    bvec4: "uniform4i(location, value[0], value[1], value[2], value[3])",
                    mat2: "uniformMatrix2fv(location, false, value)",	
                    mat3: "uniformMatrix3fv(location, false, value)",
                    mat4: "uniformMatrix4fv(location, false, value)",
                    //location指明要更改的uniform变量的位置
					//指明是否要转置矩阵，并将它作为uniform变量的值。必须为GL_FALSE。
					//value指明一个指向count个元素的指针，用来更新指定的uniform变量。
                    sampler2D: "uniform1i(location, value)"
                },
                l = {
                    float: "uniform1fv(location, value)",
                    vec2: "uniform2fv(location, value)",
                    vec3: "uniform3fv(location, value)",
                    vec4: "uniform4fv(location, value)",
                    int: "uniform1iv(location, value)",
                    ivec2: "uniform2iv(location, value)",
                    ivec3: "uniform3iv(location, value)",
                    ivec4: "uniform4iv(location, value)",
                    bool: "uniform1iv(location, value)",
                    bvec2: "uniform2iv(location, value)",
                    bvec3: "uniform3iv(location, value)",
                    bvec4: "uniform4iv(location, value)",
                    sampler2D: "uniform1iv(location, value)"
                };
            e.exports = i
        }, {}],
        19: [function(t, e, r) {			//shader: 19
            e.exports = {
                compileProgram: t("./compileProgram"),
                defaultValue: t("./defaultValue"),
                extractAttributes: t("./extractAttributes"),
                extractUniforms: t("./extractUniforms"),
                generateUniformAccessObject: t("./generateUniformAccessObject"),
                mapSize: t("./mapSize"),
                mapType: t("./mapType")
            }
        }, {
            "./compileProgram": 14,
            "./defaultValue": 15,
            "./extractAttributes": 16,
            "./extractUniforms": 17,
            "./generateUniformAccessObject": 18,
            "./mapSize": 20,
            "./mapType": 21
        }],
        20: [function(t, e, r) {			//"./mapSize": 20
            var i = function(t) {
                    return n[t]
                },
                n = {
                    float: 1,
                    vec2: 2,
                    vec3: 3,
                    vec4: 4,
                    int: 1,
                    ivec2: 2,
                    ivec3: 3,
                    ivec4: 4,
                    bool: 1,
                    bvec2: 2,
                    bvec3: 3,
                    bvec4: 4,
                    mat2: 4,
                    mat3: 9,
                    mat4: 16,
                    sampler2D: 1
                };
            e.exports = i
        }, {}],
        21: [function(t, e, r) {			//"./mapType": 21
            var i = function(t, e) {
                    if (!n) {
                        var r = Object.keys(s);
                        n = {};
                        for (var i = 0; i < r.length; ++i) {
                            var o = r[i];
                            n[t[o]] = s[o]
                        }
                    }
                    return n[e]
                },
                n = null,
                s = {
                    FLOAT: "float",
                    FLOAT_VEC2: "vec2",
                    FLOAT_VEC3: "vec3",
                    FLOAT_VEC4: "vec4",
                    INT: "int",
                    INT_VEC2: "ivec2",
                    INT_VEC3: "ivec3",
                    INT_VEC4: "ivec4",
                    BOOL: "bool",
                    BOOL_VEC2: "bvec2",
                    BOOL_VEC3: "bvec3",
                    BOOL_VEC4: "bvec4",
                    FLOAT_MAT2: "mat2",
                    FLOAT_MAT3: "mat3",
                    FLOAT_MAT4: "mat4",
                    SAMPLER_2D: "sampler2D"
                };
            e.exports = i
        }, {}],
        22: [function(t, e, r) {
            (function(t) {
                function e(t, e) {
                    for (var r = 0, i = t.length - 1; i >= 0; i--) {
                        var n = t[i];
                        "." === n ? t.splice(i, 1) : ".." === n ? (t.splice(i, 1), r++) : r && (t.splice(i, 1), r--)
                    }
                    if (e)
                        for (; r--; r) t.unshift("..");
                    return t
                }

                function i(t, e) {
                    if (t.filter) return t.filter(e);
                    for (var r = [], i = 0; i < t.length; i++) e(t[i], i, t) && r.push(t[i]);
                    return r
                }
                var n = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,
                    s = function(t) {
                        return n.exec(t).slice(1)
                    };
                r.resolve = function() {
                    for (var r = "", n = !1, s = arguments.length - 1; s >= -1 && !n; s--) {
                        var o = s >= 0 ? arguments[s] : t.cwd();
                        if ("string" != typeof o) throw new TypeError("Arguments to path.resolve must be strings");
                        o && (r = o + "/" + r, n = "/" === o.charAt(0))
                    }
                    return r = e(i(r.split("/"), function(t) {
                        return !!t
                    }), !n).join("/"), (n ? "/" : "") + r || "."
                }, r.normalize = function(t) {
                    var n = r.isAbsolute(t),
                        s = "/" === o(t, -1);
                    return t = e(i(t.split("/"), function(t) {
                        return !!t
                    }), !n).join("/"), t || n || (t = "."), t && s && (t += "/"), (n ? "/" : "") + t
                }, r.isAbsolute = function(t) {
                    return "/" === t.charAt(0)
                }, r.join = function() {
                    var t = Array.prototype.slice.call(arguments, 0);
                    return r.normalize(i(t, function(t, e) {
                        if ("string" != typeof t) throw new TypeError("Arguments to path.join must be strings");
                        return t
                    }).join("/"))
                }, r.relative = function(t, e) {
                    function i(t) {
                        for (var e = 0; e < t.length && "" === t[e]; e++);
                        for (var r = t.length - 1; r >= 0 && "" === t[r]; r--);
                        return e > r ? [] : t.slice(e, r - e + 1)
                    }
                    t = r.resolve(t).substr(1), e = r.resolve(e).substr(1);
                    for (var n = i(t.split("/")), s = i(e.split("/")), o = Math.min(n.length, s.length), a = o, h = 0; h < o; h++)
                        if (n[h] !== s[h]) {
                            a = h;
                            break
                        }
                    for (var u = [], h = a; h < n.length; h++) u.push("..");
                    return u = u.concat(s.slice(a)), u.join("/")
                }, r.sep = "/", r.delimiter = ":", r.dirname = function(t) {
                    var e = s(t),
                        r = e[0],
                        i = e[1];
                    return r || i ? (i && (i = i.substr(0, i.length - 1)), r + i) : "."
                }, r.basename = function(t, e) {
                    var r = s(t)[2];
                    return e && r.substr(-1 * e.length) === e && (r = r.substr(0, r.length - e.length)), r
                }, r.extname = function(t) {
                    return s(t)[3]
                };
                var o = "b" === "ab".substr(-1) ? function(t, e, r) {
                    return t.substr(e, r)
                } : function(t, e, r) {
                    return e < 0 && (e = t.length + e), t.substr(e, r)
                }
            }).call(this, t("_process"))
        }, {
            _process: 23
        }],
        23: [function(t, e, r) {		//_process: 23
            function i() {
                throw new Error("setTimeout has not been defined")
            }

            function n() {
                throw new Error("clearTimeout has not been defined")
            }

            function s(t) {
                if (c === setTimeout) return setTimeout(t, 0);
                if ((c === i || !c) && setTimeout) return c = setTimeout, setTimeout(t, 0);
                try {
                    return c(t, 0)
                } catch (e) {
                    try {
                        return c.call(null, t, 0)
                    } catch (e) {
                        return c.call(this, t, 0)
                    }
                }
            }

            function o(t) {
                if (d === clearTimeout) return clearTimeout(t);
                if ((d === n || !d) && clearTimeout) return d = clearTimeout, clearTimeout(t);
                try {
                    return d(t)
                } catch (e) {
                    try {
                        return d.call(null, t)
                    } catch (e) {
                        return d.call(this, t)
                    }
                }
            }

            function a() {
                g && f && (g = !1, f.length ? v = f.concat(v) : y = -1, v.length && h())
            }

            function h() {
                if (!g) {
                    var t = s(a);
                    g = !0;
                    for (var e = v.length; e;) {
                        for (f = v, v = []; ++y < e;) f && f[y].run();
                        y = -1, e = v.length
                    }
                    f = null, g = !1, o(t)
                }
            }

            function u(t, e) {
                this.fun = t, this.array = e
            }

            function l() {}
            var c, d, p = e.exports = {};
            ! function() {
                try {
                    c = "function" == typeof setTimeout ? setTimeout : i
                } catch (t) {
                    c = i
                }
                try {
                    d = "function" == typeof clearTimeout ? clearTimeout : n
                } catch (t) {
                    d = n
                }
            }();
            var f, v = [],
                g = !1,
                y = -1;
            p.nextTick = function(t) {
                var e = new Array(arguments.length - 1);
                if (arguments.length > 1)
                    for (var r = 1; r < arguments.length; r++) e[r - 1] = arguments[r];
                v.push(new u(t, e)), 1 !== v.length || g || s(h)
            }, u.prototype.run = function() {
                this.fun.apply(null, this.array)
            }, p.title = "browser", p.browser = !0, p.env = {}, p.argv = [], p.version = "", p.versions = {}, p.on = l, p.addListener = l, p.once = l, p.off = l, p.removeListener = l,
                p.removeAllListeners = l, p.emit = l, p.binding = function(t) {
                throw new Error("process.binding is not supported")
            }, p.cwd = function() {
                return "/"
            }, p.chdir = function(t) {
                throw new Error("process.chdir is not supported")
            }, p.umask = function() {
                return 0
            }
        }, {}],
        24: [function(e, r, i) {			//punycode: 24
            (function(e) {
                ! function(n) {
                    function s(t) {
                        throw new RangeError(L[t])
                    }

                    function o(t, e) {
                        for (var r = t.length, i = []; r--;) i[r] = e(t[r]);
                        return i
                    }

                    function a(t, e) {
                        var r = t.split("@"),
                            i = "";
                        r.length > 1 && (i = r[0] + "@", t = r[1]), t = t.replace(I, ".");
                        var n = t.split("."),
                            s = o(n, e).join(".");
                        return i + s
                    }

                    function h(t) {
                        for (var e, r, i = [], n = 0, s = t.length; n < s;) e = t.charCodeAt(n++), e >= 55296 && e <= 56319 && n < s ? (r = t.charCodeAt(n++), 56320 == (64512 & r) ? i.push(((1023 & e) << 10) + (1023 & r) + 65536) : (i.push(e), n--)) : i.push(e);
                        return i
                    }

                    function u(t) {
                        return o(t, function(t) {
                            var e = "";
                            return t > 65535 && (t -= 65536, e += N(t >>> 10 & 1023 | 55296), t = 56320 | 1023 & t), e += N(t)
                        }).join("")
                    }

                    function l(t) {
                        return t - 48 < 10 ? t - 22 : t - 65 < 26 ? t - 65 : t - 97 < 26 ? t - 97 : E
                    }

                    function c(t, e) {
                        return t + 22 + 75 * (t < 26) - ((0 != e) << 5)
                    }

                    function d(t, e, r) {
                        var i = 0;
                        for (t = r ? B(t / R) : t >> 1, t += B(t / e); t > F * S >> 1; i += E) t = B(t / F);
                        return B(i + (F + 1) * t / (t + C))
                    }

                    function p(t) {
                        var e, r, i, n, o, a, h, c, p, f, v = [],
                            g = t.length,
                            y = 0,
                            x = A,
                            m = M;
                        for (r = t.lastIndexOf(O), r < 0 && (r = 0), i = 0; i < r; ++i) t.charCodeAt(i) >= 128 && s("not-basic"), v.push(t.charCodeAt(i));
                        for (n = r > 0 ? r + 1 : 0; n < g;) {
                            for (o = y, a = 1, h = E; n >= g && s("invalid-input"), c = l(t.charCodeAt(n++)), (c >= E || c > B((T - y) / a)) && s("overflow"), y += c * a, p = h <= m ? w : h >= m + S ? S : h - m, !(c < p); h += E) f = E - p, a > B(T / f) && s("overflow"), a *= f;
                            e = v.length + 1, m = d(y - o, e, 0 == o), B(y / e) > T - x && s("overflow"), x += B(y / e), y %= e, v.splice(y++, 0, x)
                        }
                        return u(v)
                    }

                    function f(t) {
                        var e, r, i, n, o, a, u, l, p, f, v, g, y, x, m, _ = [];
                        for (t = h(t), g = t.length, e = A, r = 0, o = M, a = 0; a < g; ++a) v = t[a], v < 128 && _.push(N(v));
                        for (i = n = _.length, n && _.push(O); i < g;) {
                            for (u = T, a = 0; a < g; ++a) v = t[a], v >= e && v < u && (u = v);
                            for (y = i + 1, u - e > B((T - r) / y) && s("overflow"), r += (u - e) * y, e = u, a = 0; a < g; ++a)
                                if (v = t[a], v < e && ++r > T && s("overflow"), v == e) {
                                    for (l = r, p = E; f = p <= o ? w : p >= o + S ? S : p - o, !(l < f); p += E) m = l - f, x = E - f, _.push(N(c(f + m % x, 0))), l = B(m / x);
                                    _.push(N(c(l, 0))), o = d(r, y, i == n), r = 0, ++i
                                }++r, ++e
                        }
                        return _.join("")
                    }

                    function v(t) {
                        return a(t, function(t) {
                            return D.test(t) ? p(t.slice(4).toLowerCase()) : t
                        })
                    }

                    function g(t) {
                        return a(t, function(t) {
                            return P.test(t) ? "xn--" + f(t) : t
                        })
                    }
                    var y = "object" == typeof i && i && !i.nodeType && i,
                        x = "object" == typeof r && r && !r.nodeType && r,
                        m = "object" == typeof e && e;
                    m.global !== m && m.window !== m && m.self !== m || (n = m);
                    var _, b, T = 2147483647,
                        E = 36,
                        w = 1,
                        S = 26,
                        C = 38,
                        R = 700,
                        M = 72,
                        A = 128,
                        O = "-",
                        D = /^xn--/,
                        P = /[^\x20-\x7E]/,
                        I = /[\x2E\u3002\uFF0E\uFF61]/g,
                        L = {
                            overflow: "Overflow: input needs wider integers to process",
                            "not-basic": "Illegal input >= 0x80 (not a basic code point)",
                            "invalid-input": "Invalid input"
                        },
                        F = E - w,
                        B = Math.floor,
                        N = String.fromCharCode;
                    if (_ = {
                            version: "1.4.1",
                            ucs2: {
                                decode: h,
                                encode: u
                            },
                            decode: p,
                            encode: f,
                            toASCII: g,
                            toUnicode: v
                        }, "function" == typeof t && "object" == typeof t.amd && t.amd) t("punycode", function() {
                        return _
                    });
                    else if (y && x)
                        if (r.exports == y) x.exports = _;
                        else
                            for (b in _) _.hasOwnProperty(b) && (y[b] = _[b]);
                    else n.punycode = _
                }(this)
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}],
        25: [function(t, e, r) {		//decode: 25
            "use strict";

            function i(t, e) {
                return Object.prototype.hasOwnProperty.call(t, e)
            }
            e.exports = function(t, e, r, s) {
                e = e || "&", r = r || "=";
                var o = {};
                if ("string" != typeof t || 0 === t.length) return o;
                var a = /\+/g;
                t = t.split(e);
                var h = 1e3;
                s && "number" == typeof s.maxKeys && (h = s.maxKeys);
                var u = t.length;
                h > 0 && u > h && (u = h);
                for (var l = 0; l < u; ++l) {
                    var c, d, p, f, v = t[l].replace(a, "%20"),
                        g = v.indexOf(r);
                    g >= 0 ? (c = v.substr(0, g), d = v.substr(g + 1)) : (c = v, d = ""), p = decodeURIComponent(c), f = decodeURIComponent(d), i(o, p) ? n(o[p]) ? o[p].push(f) : o[p] = [o[p], f] : o[p] = f
                }
                return o
            };
            var n = Array.isArray || function(t) {
                    return "[object Array]" === Object.prototype.toString.call(t)
                }
        }, {}],
        26: [function(t, e, r) {		//encode: 26
            "use strict";

            function i(t, e) {
                if (t.map) return t.map(e);
                for (var r = [], i = 0; i < t.length; i++) r.push(e(t[i], i));
                return r
            }
            var n = function(t) {
                switch (typeof t) {
                    case "string":
                        return t;
                    case "boolean":
                        return t ? "true" : "false";
                    case "number":
                        return isFinite(t) ? t : "";
                    default:
                        return ""
                }
            };
            e.exports = function(t, e, r, a) {
                return e = e || "&", r = r || "=", null === t && (t = void 0), "object" == typeof t ? i(o(t), function(o) {
                    var a = encodeURIComponent(n(o)) + r;
                    return s(t[o]) ? i(t[o], function(t) {
                        return a + encodeURIComponent(n(t))
                    }).join(e) : a + encodeURIComponent(n(t[o]))
                }).join(e) : a ? encodeURIComponent(n(a)) + r + encodeURIComponent(n(t)) : ""
            };
            var s = Array.isArray || function(t) {
                        return "[object Array]" === Object.prototype.toString.call(t)
                    },
                o = Object.keys || function(t) {
                        var e = [];
                        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && e.push(r);
                        return e
                    }
        }, {}],
        27: [function(t, e, r) {		//querystring: 27
            "use strict";
            r.decode = r.parse = t("./decode"), r.encode = r.stringify = t("./encode")
        }, {
            "./decode": 25,
            "./encode": 26
        }],
        28: [function(t, e, r) {			//url: 28
            "use strict";

            function i() {
                this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null
            }

            function n(t, e, r) {
                if (t && u.isObject(t) && t instanceof i) return t;
                var n = new i;
                return n.parse(t, e, r), n
            }

            function s(t) {
                return u.isString(t) && (t = n(t)), t instanceof i ? t.format() : i.prototype.format.call(t)
            }

            function o(t, e) {
                return n(t, !1, !0).resolve(e)
            }

            function a(t, e) {
                return t ? n(t, !1, !0).resolveObject(e) : e
            }
            var h = t("punycode"),
                u = t("./util");
            r.parse = n, r.resolve = o, r.resolveObject = a, r.format = s, r.Url = i;
            var l = /^([a-z0-9.+-]+:)/i,
                c = /:[0-9]*$/,
                d = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
                p = ["<", ">", '"', "`", " ", "\r", "\n", "\t"],
                f = ["{", "}", "|", "\\", "^", "`"].concat(p),
                v = ["'"].concat(f),
                g = ["%", "/", "?", ";", "#"].concat(v),
                y = ["/", "?", "#"],
                x = 255,
                m = /^[+a-z0-9A-Z_-]{0,63}$/,
                _ = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
                b = {
                    javascript: !0,
                    "javascript:": !0
                },
                T = {
                    javascript: !0,
                    "javascript:": !0
                },
                E = {
                    http: !0,
                    https: !0,
                    ftp: !0,
                    gopher: !0,
                    file: !0,
                    "http:": !0,
                    "https:": !0,
                    "ftp:": !0,
                    "gopher:": !0,
                    "file:": !0
                },
                w = t("querystring");
            i.prototype.parse = function(t, e, r) {
                if (!u.isString(t)) throw new TypeError("Parameter 'url' must be a string, not " + typeof t);
                var i = t.indexOf("?"),
                    n = i !== -1 && i < t.indexOf("#") ? "?" : "#",
                    s = t.split(n),
                    o = /\\/g;
                s[0] = s[0].replace(o, "/"), t = s.join(n);
                var a = t;
                if (a = a.trim(), !r && 1 === t.split("#").length) {
                    var c = d.exec(a);
                    if (c) return this.path = a, this.href = a, this.pathname = c[1], c[2] ? (this.search = c[2], e ? this.query = w.parse(this.search.substr(1)) : this.query = this.search.substr(1)) : e && (this.search = "", this.query = {}), this
                }
                var p = l.exec(a);
                if (p) {
                    p = p[0];
                    var f = p.toLowerCase();
                    this.protocol = f, a = a.substr(p.length)
                }
                if (r || p || a.match(/^\/\/[^@\/]+@[^@\/]+/)) {
                    var S = "//" === a.substr(0, 2);
                    !S || p && T[p] || (a = a.substr(2), this.slashes = !0)
                }
                if (!T[p] && (S || p && !E[p])) {
                    for (var C = -1, R = 0; R < y.length; R++) {
                        var M = a.indexOf(y[R]);
                        M !== -1 && (C === -1 || M < C) && (C = M)
                    }
                    var A, O;
                    O = C === -1 ? a.lastIndexOf("@") : a.lastIndexOf("@", C), O !== -1 && (A = a.slice(0, O), a = a.slice(O + 1), this.auth = decodeURIComponent(A)), C = -1;
                    for (var R = 0; R < g.length; R++) {
                        var M = a.indexOf(g[R]);
                        M !== -1 && (C === -1 || M < C) && (C = M)
                    }
                    C === -1 && (C = a.length), this.host = a.slice(0, C), a = a.slice(C), this.parseHost(), this.hostname = this.hostname || "";
                    var D = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
                    if (!D)
                        for (var P = this.hostname.split(/\./), R = 0, I = P.length; R < I; R++) {
                            var L = P[R];
                            if (L && !L.match(m)) {
                                for (var F = "", B = 0, N = L.length; B < N; B++) F += L.charCodeAt(B) > 127 ? "x" : L[B];
                                if (!F.match(m)) {
                                    var U = P.slice(0, R),
                                        k = P.slice(R + 1),
                                        j = L.match(_);
                                    j && (U.push(j[1]), k.unshift(j[2])), k.length && (a = "/" + k.join(".") + a), this.hostname = U.join(".");
                                    break
                                }
                            }
                        }
                    this.hostname.length > x ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), D || (this.hostname = h.toASCII(this.hostname));
                    var W = this.port ? ":" + this.port : "",
                        G = this.hostname || "";
                    this.host = G + W, this.href += this.host, D && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), "/" !== a[0] && (a = "/" + a))
                }
                if (!b[f])
                    for (var R = 0, I = v.length; R < I; R++) {
                        var X = v[R];
                        if (a.indexOf(X) !== -1) {
                            var H = encodeURIComponent(X);
                            H === X && (H = escape(X)), a = a.split(X).join(H)
                        }
                    }
                var z = a.indexOf("#");
                z !== -1 && (this.hash = a.substr(z), a = a.slice(0, z));
                var V = a.indexOf("?");
                if (V !== -1 ? (this.search = a.substr(V), this.query = a.substr(V + 1), e && (this.query = w.parse(this.query)), a = a.slice(0, V)) : e && (this.search = "", this.query = {}), a && (this.pathname = a), E[f] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
                    var W = this.pathname || "",
                        Y = this.search || "";
                    this.path = W + Y
                }
                return this.href = this.format(), this
            }, i.prototype.format = function() {
                var t = this.auth || "";
                t && (t = encodeURIComponent(t), t = t.replace(/%3A/i, ":"), t += "@");
                var e = this.protocol || "",
                    r = this.pathname || "",
                    i = this.hash || "",
                    n = !1,
                    s = "";
                this.host ? n = t + this.host : this.hostname && (n = t + (this.hostname.indexOf(":") === -1 ? this.hostname : "[" + this.hostname + "]"), this.port && (n += ":" + this.port)), this.query && u.isObject(this.query) && Object.keys(this.query).length && (s = w.stringify(this.query));
                var o = this.search || s && "?" + s || "";
                return e && ":" !== e.substr(-1) && (e += ":"), this.slashes || (!e || E[e]) && n !== !1 ? (n = "//" + (n || ""), r && "/" !== r.charAt(0) && (r = "/" + r)) : n || (n = ""), i && "#" !== i.charAt(0) && (i = "#" + i), o && "?" !== o.charAt(0) && (o = "?" + o), r = r.replace(/[?#]/g, function(t) {
                    return encodeURIComponent(t)
                }), o = o.replace("#", "%23"), e + n + r + o + i
            }, i.prototype.resolve = function(t) {
                return this.resolveObject(n(t, !1, !0)).format()
            }, i.prototype.resolveObject = function(t) {
                if (u.isString(t)) {
                    var e = new i;
                    e.parse(t, !1, !0), t = e
                }
                for (var r = new i, n = Object.keys(this), s = 0; s < n.length; s++) {
                    var o = n[s];
                    r[o] = this[o]
                }
                if (r.hash = t.hash, "" === t.href) return r.href = r.format(), r;
                if (t.slashes && !t.protocol) {
                    for (var a = Object.keys(t), h = 0; h < a.length; h++) {
                        var l = a[h];
                        "protocol" !== l && (r[l] = t[l])
                    }
                    return E[r.protocol] && r.hostname && !r.pathname && (r.path = r.pathname = "/"), r.href = r.format(), r
                }
                if (t.protocol && t.protocol !== r.protocol) {
                    if (!E[t.protocol]) {
                        for (var c = Object.keys(t), d = 0; d < c.length; d++) {
                            var p = c[d];
                            r[p] = t[p]
                        }
                        return r.href = r.format(), r
                    }
                    if (r.protocol = t.protocol, t.host || T[t.protocol]) r.pathname = t.pathname;
                    else {
                        for (var f = (t.pathname || "").split("/"); f.length && !(t.host = f.shift()););
                        t.host || (t.host = ""), t.hostname || (t.hostname = ""), "" !== f[0] && f.unshift(""), f.length < 2 && f.unshift(""), r.pathname = f.join("/")
                    }
                    if (r.search = t.search, r.query = t.query, r.host = t.host || "", r.auth = t.auth, r.hostname = t.hostname || t.host, r.port = t.port, r.pathname || r.search) {
                        var v = r.pathname || "",
                            g = r.search || "";
                        r.path = v + g
                    }
                    return r.slashes = r.slashes || t.slashes, r.href = r.format(), r
                }
                var y = r.pathname && "/" === r.pathname.charAt(0),
                    x = t.host || t.pathname && "/" === t.pathname.charAt(0),
                    m = x || y || r.host && t.pathname,
                    _ = m,
                    b = r.pathname && r.pathname.split("/") || [],
                    f = t.pathname && t.pathname.split("/") || [],
                    w = r.protocol && !E[r.protocol];
                if (w && (r.hostname = "", r.port = null, r.host && ("" === b[0] ? b[0] = r.host : b.unshift(r.host)), r.host = "", t.protocol && (t.hostname = null, t.port = null, t.host && ("" === f[0] ? f[0] = t.host : f.unshift(t.host)), t.host = null), m = m && ("" === f[0] || "" === b[0])), x) r.host = t.host || "" === t.host ? t.host : r.host, r.hostname = t.hostname || "" === t.hostname ? t.hostname : r.hostname, r.search = t.search, r.query = t.query, b = f;
                else if (f.length) b || (b = []), b.pop(), b = b.concat(f), r.search = t.search, r.query = t.query;
                else if (!u.isNullOrUndefined(t.search)) {
                    if (w) {
                        r.hostname = r.host = b.shift();
                        var S = !!(r.host && r.host.indexOf("@") > 0) && r.host.split("@");
                        S && (r.auth = S.shift(), r.host = r.hostname = S.shift())
                    }
                    return r.search = t.search, r.query = t.query, u.isNull(r.pathname) && u.isNull(r.search) || (r.path = (r.pathname ? r.pathname : "") + (r.search ? r.search : "")), r.href = r.format(), r
                }
                if (!b.length) return r.pathname = null, r.search ? r.path = "/" + r.search : r.path = null, r.href = r.format(), r;
                for (var C = b.slice(-1)[0], R = (r.host || t.host || b.length > 1) && ("." === C || ".." === C) || "" === C, M = 0, A = b.length; A >= 0; A--) C = b[A], "." === C ? b.splice(A, 1) : ".." === C ? (b.splice(A, 1), M++) : M && (b.splice(A, 1), M--);
                if (!m && !_)
                    for (; M--; M) b.unshift("..");
                !m || "" === b[0] || b[0] && "/" === b[0].charAt(0) || b.unshift(""), R && "/" !== b.join("/").substr(-1) && b.push("");
                var O = "" === b[0] || b[0] && "/" === b[0].charAt(0);
                if (w) {
                    r.hostname = r.host = O ? "" : b.length ? b.shift() : "";
                    var S = !!(r.host && r.host.indexOf("@") > 0) && r.host.split("@");
                    S && (r.auth = S.shift(), r.host = r.hostname = S.shift())
                }
                return m = m || r.host && b.length, m && !O && b.unshift(""), b.length ? r.pathname = b.join("/") : (r.pathname = null, r.path = null), u.isNull(r.pathname) && u.isNull(r.search) || (r.path = (r.pathname ? r.pathname : "") + (r.search ? r.search : "")), r.auth = t.auth || r.auth, r.slashes = r.slashes || t.slashes, r.href = r.format(), r
            }, i.prototype.parseHost = function() {
                var t = this.host,
                    e = c.exec(t);
                e && (e = e[0], ":" !== e && (this.port = e.substr(1)), t = t.substr(0, t.length - e.length)), t && (this.hostname = t)
            }
        }, {
            "./util": 29,
            punycode: 24,
            querystring: 27
        }],
        29: [function(t, e, r) {		//util: 29
            "use strict";
            e.exports = {
                isString: function(t) {
                    return "string" == typeof t
                },
                isObject: function(t) {
                    return "object" == typeof t && null !== t
                },
                isNull: function(t) {
                    return null === t
                },
                isNullOrUndefined: function(t) {
                    return null == t
                }
            }
        }, {}],
        30: [function(t, e, r) {		//eventemitter3: 30
            "use strict";

            function i() {}

            function n(t, e, r) {
                this.fn = t, this.context = e, this.once = r || !1
            }

            function s() {
                this._events = new i, this._eventsCount = 0
            }
            var o = Object.prototype.hasOwnProperty,
                a = "~";
            Object.create && (i.prototype = Object.create(null), (new i).__proto__ || (a = !1)), s.prototype.eventNames = function() {
                var t, e, r = [];
                if (0 === this._eventsCount) return r;
                for (e in t = this._events) o.call(t, e) && r.push(a ? e.slice(1) : e);
                return Object.getOwnPropertySymbols ? r.concat(Object.getOwnPropertySymbols(t)) : r
            }, s.prototype.listeners = function(t, e) {
                var r = a ? a + t : t,
                    i = this._events[r];
                if (e) return !!i;
                if (!i) return [];
                if (i.fn) return [i.fn];
                for (var n = 0, s = i.length, o = new Array(s); n < s; n++) o[n] = i[n].fn;
                return o
            }, s.prototype.emit = function(t, e, r, i, n, s) {
                var o = a ? a + t : t;
                if (!this._events[o]) return !1;
                var h, u, l = this._events[o],
                    c = arguments.length;
                if (l.fn) {
                    switch (l.once && this.removeListener(t, l.fn, void 0, !0), c) {
                        case 1:
                            return l.fn.call(l.context), !0;
                        case 2:
                            return l.fn.call(l.context, e), !0;
                        case 3:
                            return l.fn.call(l.context, e, r), !0;
                        case 4:
                            return l.fn.call(l.context, e, r, i), !0;
                        case 5:
                            return l.fn.call(l.context, e, r, i, n), !0;
                        case 6:
                            return l.fn.call(l.context, e, r, i, n, s), !0
                    }
                    for (u = 1, h = new Array(c - 1); u < c; u++) h[u - 1] = arguments[u];
                    l.fn.apply(l.context, h)
                } else {
                    var d, p = l.length;
                    for (u = 0; u < p; u++) switch (l[u].once && this.removeListener(t, l[u].fn, void 0, !0), c) {
                        case 1:
                            l[u].fn.call(l[u].context);
                            break;
                        case 2:
                            l[u].fn.call(l[u].context, e);
                            break;
                        case 3:
                            l[u].fn.call(l[u].context, e, r);
                            break;
                        case 4:
                            l[u].fn.call(l[u].context, e, r, i);
                            break;
                        default:
                            if (!h)
                                for (d = 1, h = new Array(c - 1); d < c; d++) h[d - 1] = arguments[d];
                            l[u].fn.apply(l[u].context, h)
                    }
                }
                return !0
            }, s.prototype.on = function(t, e, r) {
                var i = new n(e, r || this),
                    s = a ? a + t : t;
                return this._events[s] ? this._events[s].fn ? this._events[s] = [this._events[s], i] : this._events[s].push(i) : (this._events[s] = i, this._eventsCount++), this
            }, s.prototype.once = function(t, e, r) {
                var i = new n(e, r || this, (!0)),
                    s = a ? a + t : t;
                return this._events[s] ? this._events[s].fn ? this._events[s] = [this._events[s], i] : this._events[s].push(i) : (this._events[s] = i, this._eventsCount++), this
            }, s.prototype.removeListener = function(t, e, r, n) {
                var s = a ? a + t : t;
                if (!this._events[s]) return this;
                if (!e) return 0 === --this._eventsCount ? this._events = new i : delete this._events[s], this;
                var o = this._events[s];
                if (o.fn) o.fn !== e || n && !o.once || r && o.context !== r || (0 === --this._eventsCount ? this._events = new i : delete this._events[s]);
                else {
                    for (var h = 0, u = [], l = o.length; h < l; h++)(o[h].fn !== e || n && !o[h].once || r && o[h].context !== r) && u.push(o[h]);
                    u.length ? this._events[s] = 1 === u.length ? u[0] : u : 0 === --this._eventsCount ? this._events = new i : delete this._events[s]
                }
                return this
            }, s.prototype.removeAllListeners = function(t) {
                var e;
                return t ? (e = a ? a + t : t, this._events[e] && (0 === --this._eventsCount ? this._events = new i : delete this._events[e])) : (this._events = new i, this._eventsCount = 0), this
            }, s.prototype.off = s.prototype.removeListener, s.prototype.addListener = s.prototype.on, s.prototype.setMaxListeners = function() {
                return this
            }, s.prefixed = a, s.EventEmitter = s, "undefined" != typeof e && (e.exports = s)
        }, {}],
        31: [function(t, e, r) {		//"parse-uri": 31
            "use strict";
            e.exports = function(t, e) {
                e = e || {};
                for (var r = {
                    key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
                    q: {
                        name: "queryKey",
                        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
                    },
                    parser: {
                        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                        loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
                    }
                }, i = r.parser[e.strictMode ? "strict" : "loose"].exec(t), n = {}, s = 14; s--;) n[r.key[s]] = i[s] || "";
                return n[r.q.name] = {}, n[r.key[12]].replace(r.q.parser, function(t, e, i) {
                    e && (n[r.q.name][e] = i)
                }), n
            }
        }, {}],
        32: [function(t, e, r) {		//"./Loader": 32
            "use strict";

            function i(t, e) {
                a.call(this), e = e || h, this.baseUrl = t || "", this.progress = 0, this.loading = !1, this._progressChunk = 0, this._beforeMiddleware = [], this._afterMiddleware = [], this._boundLoadResource = this._loadResource.bind(this), this._buffer = [], this._numToLoad = 0, this._queue = s.queue(this._boundLoadResource, e), this.resources = {}
            }
            var n = t("parse-uri"),
                s = t("./async"),
                o = t("./Resource"),
                a = t("eventemitter3"),
                h = 10,
                u = 100;
            i.prototype = Object.create(a.prototype), i.prototype.constructor = i, e.exports = i, i.prototype.add = i.prototype.enqueue = function(t, e, r, i) {
                if (Array.isArray(t)) {
                    for (var n = 0; n < t.length; ++n) this.add(t[n]);
                    return this
                }
                if ("object" == typeof t && (i = e || t.callback || t.onComplete, r = t, e = t.url, t = t.name || t.key || t.url), "string" != typeof e && (i = r, r = e, e = t), "string" != typeof e) throw new Error("No url passed to add resource to loader.");
                if ("function" == typeof r && (i = r, r = null), this.resources[t]) throw new Error('Resource with name "' + t + '" already exists.');
                return e = this._prepareUrl(e), this.resources[t] = new o(t, e, r), "function" == typeof i && this.resources[t].once("afterMiddleware", i), this._numToLoad++, this._queue.started ? (this._queue.push(this.resources[t]), this._progressChunk = (u - this.progress) / (this._queue.length() + this._queue.running())) : (this._buffer.push(this.resources[t]), this._progressChunk = u / this._buffer.length), this
            }, i.prototype.before = i.prototype.pre = function(t) {
                return this._beforeMiddleware.push(t), this
            }, i.prototype.after = i.prototype.use = function(t) {
                return this._afterMiddleware.push(t), this
            }, i.prototype.reset = function() {
                this.progress = 0, this.loading = !1, this._progressChunk = 0, this._buffer.length = 0, this._numToLoad = 0, this._queue.kill(), this._queue.started = !1;
                for (var t in this.resources) {
                    var e = this.resources[t];
                    e.off("complete", this._onLoad, this), e.isLoading && e.abort()
                }
                return this.resources = {}, this
            }, i.prototype.load = function(t) {
                if ("function" == typeof t && this.once("complete", t), this._queue.started) return this;
                this.emit("start", this), this.loading = !0;
                for (var e = 0; e < this._buffer.length; ++e) this._queue.push(this._buffer[e]);
                return this._buffer.length = 0, this
            }, i.prototype._prepareUrl = function(t) {
                var e = n(t, {
                    strictMode: !0
                });
                return e.protocol || !e.path || 0 === e.path.indexOf("//") ? t : this.baseUrl.length && this.baseUrl.lastIndexOf("/") !== this.baseUrl.length - 1 && "/" !== t.charAt(0) ? this.baseUrl + "/" + t : this.baseUrl + t
            }, i.prototype._loadResource = function(t, e) {
                var r = this;
                t._dequeue = e, s.eachSeries(this._beforeMiddleware, function(e, i) {
                    e.call(r, t, function() {
                        i(t.isComplete ? {} : null)
                    })
                }, function() {
                    t.isComplete ? r._onLoad(t) : (t.once("complete", r._onLoad, r), t.load())
                })
            }, i.prototype._onComplete = function() {
                this.loading = !1, this.emit("complete", this, this.resources)
            }, i.prototype._onLoad = function(t) {
                var e = this;
                s.eachSeries(this._afterMiddleware, function(r, i) {
                    r.call(e, t, i)
                }, function() {
                    t.emit("afterMiddleware", t), e._numToLoad--, e.progress += e._progressChunk, e.emit("progress", e, t), t.error ? e.emit("error", t.error, e, t) : e.emit("load", e, t), 0 === e._numToLoad && (e.progress = 100, e._onComplete())
                }), t._dequeue()
            }, i.LOAD_TYPE = o.LOAD_TYPE, i.XHR_RESPONSE_TYPE = o.XHR_RESPONSE_TYPE
        }, {
            "./Resource": 33,
            "./async": 34,
            eventemitter3: 30,
            "parse-uri": 31
        }],
        33: [function(t, e, r) {		//"./Resource": 33
            "use strict";

            function i(t, e, r) {
                if (o.call(this), r = r || {}, "string" != typeof t || "string" != typeof e) throw new Error("Both name and url are required for constructing a resource.");
                this.name = t, this.url = e, this.isDataUrl = 0 === this.url.indexOf("data:"), this.data = null, this.crossOrigin = r.crossOrigin === !0 ? "anonymous" : r.crossOrigin, this.loadType = r.loadType || this._determineLoadType(), this.xhrType = r.xhrType, this.metadata = r.metadata || {}, this.error = null, this.xhr = null, this.isJson = !1, this.isXml = !1, this.isImage = !1, this.isAudio = !1, this.isVideo = !1, this.isComplete = !1, this.isLoading = !1, this._dequeue = null, this._boundComplete = this.complete.bind(this), this._boundOnError = this._onError.bind(this), this._boundOnProgress = this._onProgress.bind(this), this._boundXhrOnError = this._xhrOnError.bind(this), this._boundXhrOnAbort = this._xhrOnAbort.bind(this), this._boundXhrOnLoad = this._xhrOnLoad.bind(this), this._boundXdrOnTimeout = this._xdrOnTimeout.bind(this)
            }

            function n(t) {
                return t.toString().replace("object ", "")
            }

            function s(t, e, r) {
                e && 0 === e.indexOf(".") && (e = e.substring(1)), e && (t[e] = r)
            }
            var o = t("eventemitter3"),
                a = t("parse-uri"),
                h = !(!window.XDomainRequest || "withCredentials" in new XMLHttpRequest),
                u = null,
                l = 0,
                c = 200,
                d = 204;
            i.prototype = Object.create(o.prototype), i.prototype.constructor = i, e.exports = i, i.prototype.complete = function() {
                if (this.data && this.data.removeEventListener && (this.data.removeEventListener("error", this._boundOnError, !1), this.data.removeEventListener("load", this._boundComplete, !1), this.data.removeEventListener("progress", this._boundOnProgress, !1), this.data.removeEventListener("canplaythrough", this._boundComplete, !1)), this.xhr && (this.xhr.removeEventListener ? (this.xhr.removeEventListener("error", this._boundXhrOnError, !1), this.xhr.removeEventListener("abort", this._boundXhrOnAbort, !1), this.xhr.removeEventListener("progress", this._boundOnProgress, !1), this.xhr.removeEventListener("load", this._boundXhrOnLoad, !1)) : (this.xhr.onerror = null, this.xhr.ontimeout = null, this.xhr.onprogress = null, this.xhr.onload = null)), this.isComplete) throw new Error("Complete called again for an already completed resource.");
                this.isComplete = !0, this.isLoading = !1, this.emit("complete", this)
            }, i.prototype.abort = function(t) {
                if (!this.error) {
                    if (this.error = new Error(t), this.xhr) this.xhr.abort();
                    else if (this.xdr) this.xdr.abort();
                    else if (this.data)
                        if ("undefined" != typeof this.data.src) this.data.src = "";
                        else
                            for (; this.data.firstChild;) this.data.removeChild(this.data.firstChild);
                    this.complete()
                }
            }, i.prototype.load = function(t) {
                if (!this.isLoading)
                    if (this.isComplete) {
                        if (t) {
                            var e = this;
                            setTimeout(function() {
                                t(e)
                            }, 1)
                        }
                    } else switch (t && this.once("complete", t), this.isLoading = !0, this.emit("start", this), this.crossOrigin !== !1 && "string" == typeof this.crossOrigin || (this.crossOrigin = this._determineCrossOrigin(this.url)), this.loadType) {
                        case i.LOAD_TYPE.IMAGE:
                            this._loadElement("image");
                            break;
                        case i.LOAD_TYPE.AUDIO:
                            this._loadSourceElement("audio");
                            break;
                        case i.LOAD_TYPE.VIDEO:
                            this._loadSourceElement("video");
                            break;
                        case i.LOAD_TYPE.XHR:
                        default:
                            h && this.crossOrigin ? this._loadXdr() : this._loadXhr()
                    }
            }, i.prototype._loadElement = function(t) {
                this.metadata.loadElement ? this.data = this.metadata.loadElement : "image" === t && "undefined" != typeof window.Image ? this.data = new Image : this.data = document.createElement(t), this.crossOrigin && (this.data.crossOrigin = this.crossOrigin), this.metadata.skipSource || (this.data.src = this.url);
                var e = "is" + t[0].toUpperCase() + t.substring(1);
                this[e] === !1 && (this[e] = !0), this.data.addEventListener("error", this._boundOnError, !1), this.data.addEventListener("load", this._boundComplete, !1), this.data.addEventListener("progress", this._boundOnProgress, !1)
            }, i.prototype._loadSourceElement = function(t) {
                if (this.metadata.loadElement ? this.data = this.metadata.loadElement : "audio" === t && "undefined" != typeof window.Audio ? this.data = new Audio : this.data = document.createElement(t), null === this.data) return void this.abort("Unsupported element " + t);
                if (!this.metadata.skipSource)
                    if (navigator.isCocoonJS) this.data.src = Array.isArray(this.url) ? this.url[0] : this.url;
                    else if (Array.isArray(this.url))
                        for (var e = 0; e < this.url.length; ++e) this.data.appendChild(this._createSource(t, this.url[e]));
                    else this.data.appendChild(this._createSource(t, this.url));
                this["is" + t[0].toUpperCase() + t.substring(1)] = !0, this.data.addEventListener("error", this._boundOnError, !1), this.data.addEventListener("load", this._boundComplete, !1), this.data.addEventListener("progress", this._boundOnProgress, !1), this.data.addEventListener("canplaythrough", this._boundComplete, !1), this.data.load()
            }, i.prototype._loadXhr = function() {
                "string" != typeof this.xhrType && (this.xhrType = this._determineXhrType());
                var t = this.xhr = new XMLHttpRequest;
                t.open("GET", this.url, !0), this.xhrType === i.XHR_RESPONSE_TYPE.JSON || this.xhrType === i.XHR_RESPONSE_TYPE.DOCUMENT ? t.responseType = i.XHR_RESPONSE_TYPE.TEXT : t.responseType = this.xhrType, t.addEventListener("error", this._boundXhrOnError, !1), t.addEventListener("abort", this._boundXhrOnAbort, !1), t.addEventListener("progress", this._boundOnProgress, !1), t.addEventListener("load", this._boundXhrOnLoad, !1), t.send()
            }, i.prototype._loadXdr = function() {
                "string" != typeof this.xhrType && (this.xhrType = this._determineXhrType());
                var t = this.xhr = new XDomainRequest;
                t.timeout = 5e3, t.onerror = this._boundXhrOnError, t.ontimeout = this._boundXdrOnTimeout, t.onprogress = this._boundOnProgress, t.onload = this._boundXhrOnLoad, t.open("GET", this.url, !0), setTimeout(function() {
                    t.send()
                }, 0)
            }, i.prototype._createSource = function(t, e, r) {
                r || (r = t + "/" + e.substr(e.lastIndexOf(".") + 1));
                var i = document.createElement("source");
                return i.src = e, i.type = r, i
            }, i.prototype._onError = function(t) {
                this.abort("Failed to load element using " + t.target.nodeName)
            }, i.prototype._onProgress = function(t) {
                t && t.lengthComputable && this.emit("progress", this, t.loaded / t.total)
            }, i.prototype._xhrOnError = function() {
                var t = this.xhr;
                this.abort(n(t) + " Request failed. Status: " + t.status + ', text: "' + t.statusText + '"')
            }, i.prototype._xhrOnAbort = function() {
                this.abort(n(this.xhr) + " Request was aborted by the user.")
            }, i.prototype._xdrOnTimeout = function() {
                this.abort(n(this.xhr) + " Request timed out.")
            }, i.prototype._xhrOnLoad = function() {
                var t = this.xhr,
                    e = "undefined" == typeof t.status ? t.status : c;
                if (!(e === c || e === d || e === l && t.responseText.length > 0)) return void this.abort("[" + t.status + "]" + t.statusText + ":" + t.responseURL);
                if (this.xhrType === i.XHR_RESPONSE_TYPE.TEXT) this.data = t.responseText;
                else if (this.xhrType === i.XHR_RESPONSE_TYPE.JSON) try {
                    this.data = JSON.parse(t.responseText), this.isJson = !0
                } catch (t) {
                    return void this.abort("Error trying to parse loaded json:", t)
                } else if (this.xhrType === i.XHR_RESPONSE_TYPE.DOCUMENT) try {
                    if (window.DOMParser) {
                        var r = new DOMParser;
                        this.data = r.parseFromString(t.responseText, "text/xml")
                    } else {
                        var n = document.createElement("div");
                        n.innerHTML = t.responseText, this.data = n
                    }
                    this.isXml = !0
                } catch (t) {
                    return void this.abort("Error trying to parse loaded xml:", t)
                } else this.data = t.response || t.responseText;
                this.complete()
            }, i.prototype._determineCrossOrigin = function(t, e) {
                if (0 === t.indexOf("data:")) return "";
                e = e || window.location, u || (u = document.createElement("a")), u.href = t, t = a(u.href, {
                    strictMode: !0
                });
                var r = !t.port && "" === e.port || t.port === e.port,
                    i = t.protocol ? t.protocol + ":" : "";
                return t.host === e.hostname && r && i === e.protocol ? "" : "anonymous"
            }, i.prototype._determineXhrType = function() {
                return i._xhrTypeMap[this._getExtension()] || i.XHR_RESPONSE_TYPE.TEXT
            }, i.prototype._determineLoadType = function() {
                return i._loadTypeMap[this._getExtension()] || i.LOAD_TYPE.XHR
            }, i.prototype._getExtension = function() {
                var t = this.url,
                    e = "";
                if (this.isDataUrl) {
                    var r = t.indexOf("/");
                    e = t.substring(r + 1, t.indexOf(";", r))
                } else {
                    var i = t.indexOf("?");
                    i !== -1 && (t = t.substring(0, i)), e = t.substring(t.lastIndexOf(".") + 1)
                }
                return e.toLowerCase()
            }, i.prototype._getMimeFromXhrType = function(t) {
                switch (t) {
                    case i.XHR_RESPONSE_TYPE.BUFFER:
                        return "application/octet-binary";
                    case i.XHR_RESPONSE_TYPE.BLOB:
                        return "application/blob";
                    case i.XHR_RESPONSE_TYPE.DOCUMENT:
                        return "application/xml";
                    case i.XHR_RESPONSE_TYPE.JSON:
                        return "application/json";
                    case i.XHR_RESPONSE_TYPE.DEFAULT:
                    case i.XHR_RESPONSE_TYPE.TEXT:
                    default:
                        return "text/plain"
                }
            }, i.LOAD_TYPE = {
                XHR: 1,
                IMAGE: 2,
                AUDIO: 3,
                VIDEO: 4
            }, i.XHR_RESPONSE_TYPE = {
                DEFAULT: "text",
                BUFFER: "arraybuffer",
                BLOB: "blob",
                DOCUMENT: "document",
                JSON: "json",
                TEXT: "text"
            }, i._loadTypeMap = {
                gif: i.LOAD_TYPE.IMAGE,
                png: i.LOAD_TYPE.IMAGE,
                bmp: i.LOAD_TYPE.IMAGE,
                jpg: i.LOAD_TYPE.IMAGE,
                jpeg: i.LOAD_TYPE.IMAGE,
                tif: i.LOAD_TYPE.IMAGE,
                tiff: i.LOAD_TYPE.IMAGE,
                webp: i.LOAD_TYPE.IMAGE,
                tga: i.LOAD_TYPE.IMAGE,
                "svg+xml": i.LOAD_TYPE.IMAGE
            }, i._xhrTypeMap = {
                xhtml: i.XHR_RESPONSE_TYPE.DOCUMENT,
                html: i.XHR_RESPONSE_TYPE.DOCUMENT,
                htm: i.XHR_RESPONSE_TYPE.DOCUMENT,
                xml: i.XHR_RESPONSE_TYPE.DOCUMENT,
                tmx: i.XHR_RESPONSE_TYPE.DOCUMENT,
                tsx: i.XHR_RESPONSE_TYPE.DOCUMENT,
                svg: i.XHR_RESPONSE_TYPE.DOCUMENT,
                gif: i.XHR_RESPONSE_TYPE.BLOB,
                png: i.XHR_RESPONSE_TYPE.BLOB,
                bmp: i.XHR_RESPONSE_TYPE.BLOB,
                jpg: i.XHR_RESPONSE_TYPE.BLOB,
                jpeg: i.XHR_RESPONSE_TYPE.BLOB,
                tif: i.XHR_RESPONSE_TYPE.BLOB,
                tiff: i.XHR_RESPONSE_TYPE.BLOB,
                webp: i.XHR_RESPONSE_TYPE.BLOB,
                tga: i.XHR_RESPONSE_TYPE.BLOB,
                json: i.XHR_RESPONSE_TYPE.JSON,
                text: i.XHR_RESPONSE_TYPE.TEXT,
                txt: i.XHR_RESPONSE_TYPE.TEXT
            }, i.setExtensionLoadType = function(t, e) {
                s(i._loadTypeMap, t, e)
            }, i.setExtensionXhrType = function(t, e) {
                s(i._xhrTypeMap, t, e)
            }
        }, {
            eventemitter3: 30,
            "parse-uri": 31
            
        }],
        34: [function(t, e, r) {		//"./async": 34
            "use strict";

            function i() {}

            function n(t, e, r) {
                var i = 0,
                    n = t.length;
                ! function s(o) {
                    return o || i === n ? void(r && r(o)) : void e(t[i++], s)
                }()
            }

            function s(t) {
                return function() {
                    if (null === t) throw new Error("Callback was already called.");
                    var e = t;
                    t = null, e.apply(this, arguments)
                }
            }

            function o(t, e) {
                function r(t, e, r) {
                    if (null != r && "function" != typeof r) throw new Error("task callback must be a function");
                    if (a.started = !0, null == t && a.idle()) return void setTimeout(function() {
                        a.drain()
                    }, 1);
                    var n = {
                        data: t,
                        callback: "function" == typeof r ? r : i
                    };
                    e ? a._tasks.unshift(n) : a._tasks.push(n), setTimeout(function() {
                        a.process()
                    }, 1)
                }

                function n(t) {
                    return function() {
                        o -= 1, t.callback.apply(t, arguments), null != arguments[0] && a.error(arguments[0], t.data), o <= a.concurrency - a.buffer && a.unsaturated(), a.idle() && a.drain(), a.process()
                    }
                }
                if (null == e) e = 1;
                else if (0 === e) throw new Error("Concurrency must not be zero");
                var o = 0,
                    a = {
                        _tasks: [],
                        concurrency: e,
                        saturated: i,
                        unsaturated: i,
                        buffer: e / 4,
                        empty: i,
                        drain: i,
                        error: i,
                        started: !1,
                        paused: !1,
                        push: function(t, e) {
                            r(t, !1, e)
                        },
                        kill: function() {
                            a.drain = i, a._tasks = []
                        },
                        unshift: function(t, e) {
                            r(t, !0, e)
                        },
                        process: function() {
                            for (; !a.paused && o < a.concurrency && a._tasks.length;) {
                                var e = a._tasks.shift();
                                0 === a._tasks.length && a.empty(), o += 1, o === a.concurrency && a.saturated(), t(e.data, s(n(e)))
                            }
                        },
                        length: function() {
                            return a._tasks.length
                        },
                        running: function() {
                            return o
                        },
                        idle: function() {
                            return a._tasks.length + o === 0
                        },
                        pause: function() {
                            a.paused !== !0 && (a.paused = !0)
                        },
                        resume: function() {
                            if (a.paused !== !1) {
                                a.paused = !1;
                                for (var t = 1; t <= a.concurrency; t++) a.process()
                            }
                        }
                    };
                return a
            }
            e.exports = {
                eachSeries: n,
                queue: o
            }
        }, {}],
        35: [function(t, e, r) {		//"../../b64": 35
            "use strict";
            e.exports = {
                _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                encodeBinary: function(t) {
                    for (var e, r = "", i = new Array(4), n = 0, s = 0, o = 0; n < t.length;) {
                        for (e = new Array(3), s = 0; s < e.length; s++) n < t.length ? e[s] = 255 & t.charCodeAt(n++) : e[s] = 0;
                        switch (i[0] = e[0] >> 2, i[1] = (3 & e[0]) << 4 | e[1] >> 4, i[2] = (15 & e[1]) << 2 | e[2] >> 6, i[3] = 63 & e[2], o = n - (t.length - 1)) {
                            case 2:
                                i[3] = 64, i[2] = 64;
                                break;
                            case 1:
                                i[3] = 64
                        }
                        for (s = 0; s < i.length; s++) r += this._keyStr.charAt(i[s])
                    }
                    return r
                }
            }
        }, {}],
        36: [function(t, e, r) {
            "use strict";
            e.exports = t("./Loader"), e.exports.Resource = t("./Resource"), e.exports.middleware = {
                caching: {
                    memory: t("./middlewares/caching/memory")
                },
                parsing: {
                    blob: t("./middlewares/parsing/blob")
                }
            }, e.exports.async = t("./async")
        }, {
            "./Loader": 32,
            "./Resource": 33,
            "./async": 34,
            "./middlewares/caching/memory": 37,
            "./middlewares/parsing/blob": 38
        }],
        37: [function(t, e, r) {			//"./middlewares/caching/memory": 37
            "use strict";
            var i = {};
            e.exports = function() {
                return function(t, e) {
                    i[t.url] ? (t.data = i[t.url], t.complete()) : t.once("complete", function() {
                        i[this.url] = this.data
                    }), e()
                }
            }
        }, {}],
        38: [function(t, e, r) {			//"./middlewares/parsing/blob": 38
            "use strict";
            var i = t("../../Resource"),
                n = t("../../b64"),
                s = window.URL || window.webkitURL;
            e.exports = function() {
                return function(t, e) {
                    if (!t.data) return void e();
                    if (t.xhr && t.xhrType === i.XHR_RESPONSE_TYPE.BLOB)
                        if (window.Blob && "string" != typeof t.data) {
                            if (0 === t.data.type.indexOf("image")) {
                                var r = s.createObjectURL(t.data);
                                return t.blob = t.data, t.data = new Image, t.data.src = r, t.isImage = !0, void(t.data.onload = function() {
                                    s.revokeObjectURL(r), t.data.onload = null, e()
                                })
                            }
                        } else {
                            var o = t.xhr.getResponseHeader("content-type");
                            if (o && 0 === o.indexOf("image")) return t.data = new Image, t.data.src = "data:" + o + ";base64," + n.encodeBinary(t.xhr.responseText), t.isImage = !0, void(t.data.onload = function() {
                                t.data.onload = null, e()
                            })
                        }
                    e()
                }
            }
        }, {
            "../../Resource": 33,
            "../../b64": 35
        }],
        39: [function(t, e, r) {			//"./AccessibilityManager": 39
            function i(t) {
                !s.tablet && !s.phone || navigator.isCocoonJS || this.createTouchHook();
                var e = document.createElement("div");
                e.style.width = "100px", e.style.height = "100px", e.style.position = "absolute", e.style.top = 0, e.style.left = 0, e.style.zIndex = 2, this.div = e, this.pool = [], this.renderId = 0, this.debug = !1, this.renderer = t, this.children = [], this._onKeyDown = this._onKeyDown.bind(this), this._onMouseMove = this._onMouseMove.bind(this), this.isActive = !1, this.isMobileAccessabillity = !1, window.addEventListener("keydown", this._onKeyDown, !1)
            }
            var n = t("../core"),
                s = t("ismobilejs");
            Object.assign(n.DisplayObject.prototype, t("./accessibleTarget")), i.prototype.constructor = i, e.exports = i, i.prototype.createTouchHook = function() {
                var t = document.createElement("button");
                t.style.width = "1px", t.style.height = "1px", t.style.position = "absolute", t.style.top = "-1000px", t.style.left = "-1000px", t.style.zIndex = 2, t.style.backgroundColor = "#FF0000", t.title = "HOOK DIV", t.addEventListener("focus", function() {
                    this.isMobileAccessabillity = !0, this.activate(), document.body.removeChild(t)
                }.bind(this)), document.body.appendChild(t)
            }, i.prototype.activate = function() {
                this.isActive || (this.isActive = !0, window.document.addEventListener("mousemove", this._onMouseMove, !0), window.removeEventListener("keydown", this._onKeyDown, !1), this.renderer.on("postrender", this.update, this), this.renderer.view.parentNode && this.renderer.view.parentNode.appendChild(this.div))
            }, i.prototype.deactivate = function() {
                this.isActive && !this.isMobileAccessabillity && (this.isActive = !1, window.document.removeEventListener("mousemove", this._onMouseMove), window.addEventListener("keydown", this._onKeyDown, !1), this.renderer.off("postrender", this.update), this.div.parentNode && this.div.parentNode.removeChild(this.div))
            }, i.prototype.updateAccessibleObjects = function(t) {
                if (t.visible) {
                    t.accessible && t.interactive && (t._accessibleActive || this.addChild(t), t.renderId = this.renderId);
                    for (var e = t.children, r = e.length - 1; r >= 0; r--) this.updateAccessibleObjects(e[r])
                }
            }, i.prototype.update = function() {
                if (this.renderer.renderingToScreen) {
                    this.updateAccessibleObjects(this.renderer._lastObjectRendered);
                    var t = this.renderer.view.getBoundingClientRect(),
                        e = t.width / this.renderer.width,
                        r = t.height / this.renderer.height,
                        i = this.div;
                    i.style.left = t.left + "px", i.style.top = t.top + "px", i.style.width = this.renderer.width + "px", i.style.height = this.renderer.height + "px";
                    for (var s = 0; s < this.children.length; s++) {
                        var o = this.children[s];
                        if (o.renderId !== this.renderId) o._accessibleActive = !1, n.utils.removeItems(this.children, s, 1), this.div.removeChild(o._accessibleDiv), this.pool.push(o._accessibleDiv), o._accessibleDiv = null, s--, 0 === this.children.length && this.deactivate();
                        else {
                            i = o._accessibleDiv;
                            var a = o.hitArea,
                                h = o.worldTransform;
                            o.hitArea ? (i.style.left = (h.tx + a.x * h.a) * e + "px", i.style.top = (h.ty + a.y * h.d) * r + "px", i.style.width = a.width * h.a * e + "px", i.style.height = a.height * h.d * r + "px") : (a = o.getBounds(), this.capHitArea(a), i.style.left = a.x * e + "px", i.style.top = a.y * r + "px", i.style.width = a.width * e + "px", i.style.height = a.height * r + "px")
                        }
                    }
                    this.renderId++
                }
            }, i.prototype.capHitArea = function(t) {
                t.x < 0 && (t.width += t.x, t.x = 0), t.y < 0 && (t.height += t.y, t.y = 0), t.x + t.width > this.renderer.width && (t.width = this.renderer.width - t.x), t.y + t.height > this.renderer.height && (t.height = this.renderer.height - t.y)
            }, i.prototype.addChild = function(t) {
                var e = this.pool.pop();
                e || (e = document.createElement("button"), e.style.width = "100px", e.style.height = "100px", e.style.backgroundColor = this.debug ? "rgba(255,0,0,0.5)" : "transparent", e.style.position = "absolute", e.style.zIndex = 2, e.style.borderStyle = "none", e.addEventListener("click", this._onClick.bind(this)), e.addEventListener("focus", this._onFocus.bind(this)), e.addEventListener("focusout", this._onFocusOut.bind(this))), t.accessibleTitle ? e.title = t.accessibleTitle : t.accessibleTitle || t.accessibleHint || (e.title = "displayObject " + this.tabIndex), t.accessibleHint && e.setAttribute("aria-label", t.accessibleHint), t._accessibleActive = !0, t._accessibleDiv = e, e.displayObject = t, this.children.push(t), this.div.appendChild(t._accessibleDiv), t._accessibleDiv.tabIndex = t.tabIndex
            }, i.prototype._onClick = function(t) {
                var e = this.renderer.plugins.interaction;
                e.dispatchEvent(t.target.displayObject, "click", e.eventData)
            }, i.prototype._onFocus = function(t) {
                var e = this.renderer.plugins.interaction;
                e.dispatchEvent(t.target.displayObject, "mouseover", e.eventData)
            }, i.prototype._onFocusOut = function(t) {
                var e = this.renderer.plugins.interaction;
                e.dispatchEvent(t.target.displayObject, "mouseout", e.eventData)
            }, i.prototype._onKeyDown = function(t) {
                9 === t.keyCode && this.activate()
            }, i.prototype._onMouseMove = function() {
                this.deactivate()
            }, i.prototype.destroy = function() {
                this.div = null;
                for (var t = 0; t < this.children.length; t++) this.children[t].div = null;
                window.document.removeEventListener("mousemove", this._onMouseMove), window.removeEventListener("keydown", this._onKeyDown), this.pool = null, this.children = null, this.renderer = null
            }, n.WebGLRenderer.registerPlugin("accessibility", i), n.CanvasRenderer.registerPlugin("accessibility", i)
        }, {
            "../core": 62,
            "./accessibleTarget": 40,
            ismobilejs: 4
        }],
        40: [function(t, e, r) {		//"./accessibleTarget": 40
            var i = {
                accessible: !1,
                accessibleTitle: null,
                accessibleHint: null,
                tabIndex: 0,
                _accessibleActive: !1,
                _accessibleDiv: !1
            };
            e.exports = i
        }, {}],
        41: [function(t, e, r) {
            e.exports = {
                accessibleTarget: t("./accessibleTarget"),
                AccessibilityManager: t("./AccessibilityManager")
            }
        }, {
            "./AccessibilityManager": 39,
            "./accessibleTarget": 40
        }],
        42: [function(t, e, r) {			//"./Shader": 42
            function i(t) {
                if (t instanceof Array) {
                    if ("precision" !== t[0].substring(0, 9)) {
                        var e = t.slice(0);
                        return e.unshift("precision " + s.PRECISION.DEFAULT + " float;"), e
                    }
                } else if ("precision" !== t.substring(0, 9)) return "precision " + s.PRECISION.DEFAULT + " float;\n" + t;
                return t
            }
            var n = t("pixi-gl-core").GLShader,
                s = t("./const"),
                o = function(t, e, r, s) {
                    n.call(this, t, i(e), i(r), s)
                };
            o.prototype = Object.create(n.prototype), o.prototype.constructor = o, e.exports = o
        }, {
            "./const": 43,
            "pixi-gl-core": 12
        }],
        43: [function(t, e, r) {		//"./const": 43
            var i = {
                VERSION: "4.0.3",
                PI_2: 2 * Math.PI,
                RAD_TO_DEG: 180 / Math.PI,
                DEG_TO_RAD: Math.PI / 180,
                TARGET_FPMS: .06,
                RENDERER_TYPE: {
                    UNKNOWN: 0,
                    WEBGL: 1,
                    CANVAS: 2
                },
                BLEND_MODES: {		//混合模式同ps，对象颜色与底层对象的颜色混合，左边模式右边键值
                    NORMAL: 0,
                    ADD: 1,
                    MULTIPLY: 2,
                    SCREEN: 3,
                    OVERLAY: 4,
                    DARKEN: 5,
                    LIGHTEN: 6,
                    COLOR_DODGE: 7,
                    COLOR_BURN: 8,
                    HARD_LIGHT: 9,
                    SOFT_LIGHT: 10,
                    DIFFERENCE: 11,
                    EXCLUSION: 12,
                    HUE: 13,
                    SATURATION: 14,
                    COLOR: 15,
                    LUMINOSITY: 16
                },
                DRAW_MODES: {
                    POINTS: 0,
                    LINES: 1,
                    LINE_LOOP: 2,
                    LINE_STRIP: 3,
                    TRIANGLES: 4,
                    TRIANGLE_STRIP: 5,
                    TRIANGLE_FAN: 6
                },
                SCALE_MODES: {		//缩放模式
                    DEFAULT: 0,
                    LINEAR: 0,		//线性缩放
                    NEAREST: 1		//模糊缩放
                },
                WRAP_MODES: {
                    DEFAULT: 0,
                    CLAMP: 0,
                    REPEAT: 1,
                    MIRRORED_REPEAT: 2
                },
                GC_MODES: {
                    DEFAULT: 0,
                    AUTO: 0,
                    MANUAL: 1
                },
                MIPMAP_TEXTURES: !0,
                RETINA_PREFIX: /@(.+)x/,
                RESOLUTION: 1,
                FILTER_RESOLUTION: 1,
                DEFAULT_RENDER_OPTIONS: {
                    view: null,
                    resolution: 1,
                    antialias: !1,
                    forceFXAA: !1,
                    autoResize: !1,
                    transparent: !1,
                    backgroundColor: 0,
                    clearBeforeRender: !0,
                    preserveDrawingBuffer: !1,
                    roundPixels: !1
                },
                SHAPES: {
                    POLY: 0,
                    RECT: 1,
                    CIRC: 2,
                    ELIP: 3,
                    RREC: 4
                },
                PRECISION: {
                    DEFAULT: "mediump",
                    LOW: "lowp",
                    MEDIUM: "mediump",
                    HIGH: "highp"
                },
                TRANSFORM_MODE: {
                    DEFAULT: 0,
                    STATIC: 0,
                    DYNAMIC: 1
                },
                TEXT_GRADIENT: {
                    LINEAR_VERTICAL: 0,
                    LINEAR_HORIZONTAL: 1
                },
                SPRITE_BATCH_SIZE: 4096,
                SPRITE_MAX_TEXTURES: t("./utils/maxRecommendedTextures")(32)
            };
            e.exports = i
        }, {
            "./utils/maxRecommendedTextures": 117
        }],
        44: [function(t, e, r) {			//
            function i() {
                this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -(1 / 0), this.maxY = -(1 / 0), this.rect = null
            }
            var n = t("../math"),
                s = n.Rectangle;
            i.prototype.constructor = i, e.exports = i, i.prototype.isEmpty = function() {
                return this.minX > this.maxX || this.minY > this.maxY
            }, i.prototype.clear = function() {
                this.updateID++, this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -(1 / 0), this.maxY = -(1 / 0)
            }, i.prototype.getRectangle = function(t) {
                return this.minX > this.maxX || this.minY > this.maxY ? s.EMPTY : (t = t || new s(0, 0, 1, 1), t.x = this.minX, t.y = this.minY, t.width = this.maxX - this.minX, t.height = this.maxY - this.minY, t)
            }, i.prototype.addPoint = function(t) {
                this.minX = Math.min(this.minX, t.x), this.maxX = Math.max(this.maxX, t.x), this.minY = Math.min(this.minY, t.y), this.maxY = Math.max(this.maxY, t.y)
            }, i.prototype.addQuad = function(t) {
                var e = this.minX,
                    r = this.minY,
                    i = this.maxX,
                    n = this.maxY,
                    s = t[0],
                    o = t[1];
                e = s < e ? s : e, r = o < r ? o : r, i = s > i ? s : i, n = o > n ? o : n, s = t[2], o = t[3], e = s < e ? s : e, r = o < r ? o : r, i = s > i ? s : i, n = o > n ? o : n, s = t[4], o = t[5], e = s < e ? s : e, r = o < r ? o : r, i = s > i ? s : i, n = o > n ? o : n, s = t[6], o = t[7], e = s < e ? s : e, r = o < r ? o : r, i = s > i ? s : i, n = o > n ? o : n, this.minX = e, this.minY = r, this.maxX = i, this.maxY = n
            }, i.prototype.addFrame = function(t, e, r, i, n) {
                var s = t.worldTransform,
                    o = s.a,
                    a = s.b,
                    h = s.c,
                    u = s.d,
                    l = s.tx,
                    c = s.ty,
                    d = this.minX,
                    p = this.minY,
                    f = this.maxX,
                    v = this.maxY,
                    g = o * e + h * r + l,
                    y = a * e + u * r + c;
                d = g < d ? g : d, p = y < p ? y : p, f = g > f ? g : f, v = y > v ? y : v, g = o * i + h * r + l, y = a * i + u * r + c, d = g < d ? g : d, p = y < p ? y : p, f = g > f ? g : f, v = y > v ? y : v, g = o * e + h * n + l, y = a * e + u * n + c, d = g < d ? g : d, p = y < p ? y : p, f = g > f ? g : f, v = y > v ? y : v, g = o * i + h * n + l, y = a * i + u * n + c, d = g < d ? g : d, p = y < p ? y : p, f = g > f ? g : f, v = y > v ? y : v, this.minX = d, this.minY = p, this.maxX = f, this.maxY = v
            }, i.prototype.addVertices = function(t, e, r, i) {
                for (var n = t.worldTransform, s = n.a, o = n.b, a = n.c, h = n.d, u = n.tx, l = n.ty, c = this.minX, d = this.minY, p = this.maxX, f = this.maxY, v = r; v < i; v += 2) {
                    var g = e[v],
                        y = e[v + 1],
                        x = s * g + a * y + u,
                        m = h * y + o * g + l;
                    c = x < c ? x : c, d = m < d ? m : d, p = x > p ? x : p, f = m > f ? m : f
                }
                this.minX = c, this.minY = d, this.maxX = p, this.maxY = f
            }, i.prototype.addBounds = function(t) {
                var e = this.minX,
                    r = this.minY,
                    i = this.maxX,
                    n = this.maxY;
                this.minX = t.minX < e ? t.minX : e, this.minY = t.minY < r ? t.minY : r, this.maxX = t.maxX > i ? t.maxX : i, this.maxY = t.maxY > n ? t.maxY : n
            }
        }, {
            "../math": 67
        }],
        45: [function(t, e, r) {		//"./display/Container": 45
            function i() {
                s.call(this), this.children = []
            }
            var n = t("../utils"),
                s = t("./DisplayObject");
            i.prototype = Object.create(s.prototype), i.prototype.constructor = i, e.exports = i, Object.defineProperties(i.prototype, {
                width: {
                    get: function() {
                        return this.scale.x * this.getLocalBounds().width
                    },
                    set: function(t) {
                        var e = this.getLocalBounds().width;
                        0 !== e ? this.scale.x = t / e : this.scale.x = 1, this._width = t
                    }
                },
                height: {
                    get: function() {
                        return this.scale.y * this.getLocalBounds().height
                    },
                    set: function(t) {
                        var e = this.getLocalBounds().height;
                        0 !== e ? this.scale.y = t / e : this.scale.y = 1, this._height = t
                    }
                }
            }), i.prototype.onChildrenChange = function() {}, i.prototype.addChild = function(t) {
                var e = arguments.length;
                if (e > 1)
                    for (var r = 0; r < e; r++) this.addChild(arguments[r]);
                else t.parent && t.parent.removeChild(t), t.parent = this, this.transform._parentID = -1, this.children.push(t), this.onChildrenChange(this.children.length - 1), t.emit("added", this);
                return t
            }, i.prototype.addChildAt = function(t, e) {
                if (e >= 0 && e <= this.children.length) return t.parent && t.parent.removeChild(t), t.parent = this, this.children.splice(e, 0, t), this.onChildrenChange(e), t.emit("added", this), t;
                throw new Error(t + "addChildAt: The index " + e + " supplied is out of bounds " + this.children.length)
            }, i.prototype.swapChildren = function(t, e) {
                if (t !== e) {
                    var r = this.getChildIndex(t),
                        i = this.getChildIndex(e);
                    if (r < 0 || i < 0) throw new Error("swapChildren: Both the supplied DisplayObjects must be children of the caller.");
                    this.children[r] = e, this.children[i] = t, this.onChildrenChange(r < i ? r : i)
                }
            }, i.prototype.getChildIndex = function(t) {
                var e = this.children.indexOf(t);
                if (e === -1) throw new Error("The supplied DisplayObject must be a child of the caller");
                return e
            }, i.prototype.setChildIndex = function(t, e) {
                if (e < 0 || e >= this.children.length) throw new Error("The supplied index is out of bounds");
                var r = this.getChildIndex(t);
                n.removeItems(this.children, r, 1), this.children.splice(e, 0, t), this.onChildrenChange(e)
            }, i.prototype.getChildAt = function(t) {
                if (t < 0 || t >= this.children.length) throw new Error("getChildAt: Supplied index " + t + " does not exist in the child list, or the supplied DisplayObject is not a child of the caller");
                return this.children[t]
            }, i.prototype.removeChild = function(t) {
                var e = arguments.length;
                if (e > 1)
                    for (var r = 0; r < e; r++) this.removeChild(arguments[r]);
                else {
                    var i = this.children.indexOf(t);
                    if (i === -1) return;
                    t.parent = null, n.removeItems(this.children, i, 1), this.onChildrenChange(i), t.emit("removed", this)
                }
                return t
            }, i.prototype.removeChildAt = function(t) {
                var e = this.getChildAt(t);
                return e.parent = null, n.removeItems(this.children, t, 1), this.onChildrenChange(t), e.emit("removed", this), e
            }, i.prototype.removeChildren = function(t, e) {
                var r, i, n = t || 0,
                    s = "number" == typeof e ? e : this.children.length,
                    o = s - n;
                if (o > 0 && o <= s) {
                    for (r = this.children.splice(n, o), i = 0; i < r.length; ++i) r[i].parent = null;
                    for (this.onChildrenChange(t), i = 0; i < r.length; ++i) r[i].emit("removed", this);
                    return r
                }
                if (0 === o && 0 === this.children.length) return [];
                throw new RangeError("removeChildren: numeric values are outside the acceptable range.")
            }, i.prototype.updateTransform = function() {
                if (this._boundsID++, this.visible) {
                    this.transform.updateTransform(this.parent.transform), this.worldAlpha = this.alpha * this.parent.worldAlpha;
                    for (var t = 0, e = this.children.length; t < e; ++t) this.children[t].updateTransform()
                }
            }, i.prototype.containerUpdateTransform = i.prototype.updateTransform, i.prototype.calculateBounds = function() {
                if (this._bounds.clear(), this.visible) {
                    this._calculateBounds();
                    for (var t = 0; t < this.children.length; t++) {
                        var e = this.children[t];
                        e.calculateBounds(), this._bounds.addBounds(e._bounds)
                    }
                    this._boundsID = this._lastBoundsID
                }
            }, i.prototype._calculateBounds = function() {}, i.prototype.renderWebGL = function(t) {
                if (this.visible && !(this.worldAlpha <= 0) && this.renderable)
                    if (this._mask || this._filters) this.renderAdvancedWebGL(t);
                    else {
                        this._renderWebGL(t);
                        for (var e = 0, r = this.children.length; e < r; ++e) this.children[e].renderWebGL(t)
                    }
            }, i.prototype.renderAdvancedWebGL = function(t) {
                t.currentRenderer.flush();
                var e, r, i = this._filters,
                    n = this._mask;
                if (i) {
                    for (this._enabledFilters || (this._enabledFilters = []), this._enabledFilters.length = 0, e = 0; e < i.length; e++) i[e].enabled && this._enabledFilters.push(i[e]);
                    this._enabledFilters.length && t.filterManager.pushFilter(this, this._enabledFilters)
                }
                for (n && t.maskManager.pushMask(this, this._mask), t.currentRenderer.start(), this._renderWebGL(t), e = 0, r = this.children.length; e < r; e++) this.children[e].renderWebGL(t);
                t.currentRenderer.flush(), n && t.maskManager.popMask(this, this._mask), i && this._enabledFilters && this._enabledFilters.length && t.filterManager.popFilter(), t.currentRenderer.start()
            }, i.prototype._renderWebGL = function(t) {}, i.prototype._renderCanvas = function(t) {}, i.prototype.renderCanvas = function(t) {
                if (this.visible && !(this.alpha <= 0) && this.renderable) {
                    this._mask && t.maskManager.pushMask(this._mask), this._renderCanvas(t);
                    for (var e = 0, r = this.children.length; e < r; ++e) this.children[e].renderCanvas(t);
                    this._mask && t.maskManager.popMask(t)
                }
            }, i.prototype.destroy = function(t) {
                s.prototype.destroy.call(this);
                var e = "boolean" == typeof t ? t : t && t.children,
                    r = this.children;
                if (this.children = null, e)
                    for (var i = r.length - 1; i >= 0; i--) {
                        var n = r[i];
                        n.parent = null, n.destroy(t)
                    }
            }
        }, {
            "../utils": 116,
            "./DisplayObject": 46
        }],
        46: [function(t, e, r) {		//"./display/DisplayObject": 46
            function i() {
                n.call(this);
                var t = s.TRANSFORM_MODE.DEFAULT === s.TRANSFORM_MODE.STATIC ? o : a;
                this.transform = new t, this.alpha = 1, this.visible = !0, this.renderable = !0, this.parent = null, this.worldAlpha = 1, this.filterArea = null, this._filters = null, this._enabledFilters = null, this._bounds = new h, this._boundsID = 0, this._lastBoundsID = -1, this._boundsRect = null, this._localBoundsRect = null, this._mask = null
            }
            var n = t("eventemitter3"),
                s = t("../const"),
                o = t("./TransformStatic"),
                a = t("./Transform"),
                h = t("./Bounds"),
                u = t("../math"),
                l = new i;
            i.prototype = Object.create(n.prototype), i.prototype.constructor = i, e.exports = i, Object.defineProperties(i.prototype, {
                x: {
                    get: function() {
                        return this.position.x
                    },
                    set: function(t) {
                        this.transform.position.x = t
                    }
                },
                y: {
                    get: function() {
                        return this.position.y
                    },
                    set: function(t) {
                        this.transform.position.y = t
                    }
                },
                worldTransform: {
                    get: function() {
                        return this.transform.worldTransform
                    }
                },
                localTransform: {
                    get: function() {
                        return this.transform.localTransform
                    }
                },
                position: {
                    get: function() {
                        return this.transform.position
                    },
                    set: function(t) {
                        this.transform.position.copy(t)
                    }
                },
                scale: {
                    get: function() {
                        return this.transform.scale
                    },
                    set: function(t) {
                        this.transform.scale.copy(t)
                    }
                },
                pivot: {
                    get: function() {
                        return this.transform.pivot
                    },
                    set: function(t) {
                        this.transform.pivot.copy(t)
                    }
                },
                skew: {
                    get: function() {
                        return this.transform.skew
                    },
                    set: function(t) {
                        this.transform.skew.copy(t)
                    }
                },
                rotation: {
                    get: function() {
                        return this.transform.rotation
                    },
                    set: function(t) {
                        this.transform.rotation = t
                    }
                },
                worldVisible: {
                    get: function() {
                        var t = this;
                        do {
                            if (!t.visible) return !1;
                            t = t.parent
                        } while (t);
                        return !0
                    }
                },
                mask: {
                    get: function() {
                        return this._mask
                    },
                    set: function(t) {
                        this._mask && (this._mask.renderable = !0), this._mask = t, this._mask && (this._mask.renderable = !1)
                    }
                },
                filters: {
                    get: function() {
                        return this._filters && this._filters.slice()
                    },
                    set: function(t) {
                        this._filters = t && t.slice()
                    }
                }
            }), i.prototype.updateTransform = function() {
                this.transform.updateTransform(this.parent.transform), this.worldAlpha = this.alpha * this.parent.worldAlpha, this._bounds.updateID++
            }, i.prototype.displayObjectUpdateTransform = i.prototype.updateTransform, i.prototype._recursivePostUpdateTransform = function() {
                this.parent ? (this.parent._recursivePostUpdateTransform(), this.transform.updateTransform(this.parent.transform)) : this.transform.updateTransform(l.transform)
            }, i.prototype.getBounds = function(t, e) {
                return t || (this.parent ? (this._recursivePostUpdateTransform(), this.updateTransform()) : (this.parent = l, this.parent.transform._worldID++, this.updateTransform(), this.parent = null)), this._boundsID !== this._lastBoundsID && this.calculateBounds(), e || (this._boundsRect || (this._boundsRect = new u.Rectangle), e = this._boundsRect), this._bounds.getRectangle(e)
            }, i.prototype.getLocalBounds = function(t) {
                var e = this.transform,
                    r = this.parent;
                this.parent = null, this.transform = l.transform, t || (this._localBoundsRect || (this._localBoundsRect = new u.Rectangle), t = this._localBoundsRect);
                var i = this.getBounds(!1, t);
                return this.parent = r, this.transform = e, i
            }, i.prototype.toGlobal = function(t, e, r) {
                return r || (this._recursivePostUpdateTransform(), this.parent ? this.displayObjectUpdateTransform() : (this.parent = l, this.displayObjectUpdateTransform(), this.parent = null)), this.worldTransform.apply(t, e)
            }, i.prototype.toLocal = function(t, e, r, i) {
                return e && (t = e.toGlobal(t, r, i)), i || (this._recursivePostUpdateTransform(), this.parent ? this.displayObjectUpdateTransform() : (this.parent = l, this.displayObjectUpdateTransform(), this.parent = null)), this.worldTransform.applyInverse(t, r)
            }, i.prototype.renderWebGL = function(t) {}, i.prototype.renderCanvas = function(t) {}, i.prototype.setParent = function(t) {
                if (!t || !t.addChild) throw new Error("setParent: Argument must be a Container");
                return t.addChild(this), t
            }, i.prototype.setTransform = function(t, e, r, i, n, s, o, a, h) {
                return this.position.x = t || 0, this.position.y = e || 0, this.scale.x = r ? r : 1, this.scale.y = i ? i : 1, this.rotation = n || 0, this.skew.x = s || 0, this.skew.y = o || 0, this.pivot.x = a || 0, this.pivot.y = h || 0, this
            }, i.prototype.destroy = function() {
                this.removeAllListeners(), this.parent && this.parent.removeChild(this), this.transform = null, this.parent = null, this._bounds = null, this._currentBounds = null, this._mask = null, this.filterArea = null, this.interactive = !1, this.interactiveChildren = !1
            }
        }, {
            "../const": 43,
            "../math": 67,
            "./Bounds": 44,
            "./Transform": 47,
            "./TransformStatic": 49,
            eventemitter3: 3
        }],
        47: [function(t, e, r) {			// "./display/Transform": 47
            function i() {
                s.call(this), this.position = new n.Point(0, 0), this.scale = new n.Point(1, 1), this.skew = new n.ObservablePoint(this.updateSkew, this, 0, 0), this.pivot = new n.Point(0, 0), this._rotation = 0, this._sr = Math.sin(0), this._cr = Math.cos(0), this._cy = Math.cos(0), this._sy = Math.sin(0), this._nsx = Math.sin(0), this._cx = Math.cos(0)
            }
            var n = t("../math"),
                s = t("./TransformBase");
            i.prototype = Object.create(s.prototype), i.prototype.constructor = i, i.prototype.updateSkew = function() {
                this._cy = Math.cos(this.skew.y), this._sy = Math.sin(this.skew.y), this._nsx = Math.sin(this.skew.x), this._cx = Math.cos(this.skew.x)
            }, i.prototype.updateLocalTransform = function() {
                var t, e, r, i, n = this.localTransform;
                t = this._cr * this.scale.x, e = this._sr * this.scale.x, r = -this._sr * this.scale.y, i = this._cr * this.scale.y, n.a = this._cy * t + this._sy * r, n.b = this._cy * e + this._sy * i, n.c = this._nsx * t + this._cx * r, n.d = this._nsx * e + this._cx * i
            }, i.prototype.updateTransform = function(t) {
                var e, r, i, n, s = t.worldTransform,
                    o = this.worldTransform,
                    a = this.localTransform;
                e = this._cr * this.scale.x, r = this._sr * this.scale.x, i = -this._sr * this.scale.y, n = this._cr * this.scale.y, a.a = this._cy * e + this._sy * i, a.b = this._cy * r + this._sy * n, a.c = this._nsx * e + this._cx * i, a.d = this._nsx * r + this._cx * n, a.tx = this.position.x - (this.pivot.x * a.a + this.pivot.y * a.c), a.ty = this.position.y - (this.pivot.x * a.b + this.pivot.y * a.d), o.a = a.a * s.a + a.b * s.c, o.b = a.a * s.b + a.b * s.d, o.c = a.c * s.a + a.d * s.c, o.d = a.c * s.b + a.d * s.d, o.tx = a.tx * s.a + a.ty * s.c + s.tx, o.ty = a.tx * s.b + a.ty * s.d + s.ty, this._worldID++
            }, i.prototype.setFromMatrix = function(t) {
                t.decompose(this)
            }, Object.defineProperties(i.prototype, {
                rotation: {
                    get: function() {
                        return this._rotation
                    },
                    set: function(t) {
                        this._rotation = t, this._sr = Math.sin(t), this._cr = Math.cos(t)
                    }
                }
            }), e.exports = i
        }, {
            "../math": 67,
            "./TransformBase": 48
        }],
        48: [function(t, e, r) {			// "./display/TransformBase": 48
            function i() {
                this.worldTransform = new n.Matrix, this.localTransform = new n.Matrix, this._worldID = 0
            }
            var n = t("../math");
            i.prototype.constructor = i, i.prototype.updateLocalTransform = function() {}, i.prototype.updateTransform = function(t) {
                var e = t.worldTransform,
                    r = this.worldTransform,
                    i = this.localTransform;
                r.a = i.a * e.a + i.b * e.c, r.b = i.a * e.b + i.b * e.d, r.c = i.c * e.a + i.d * e.c, r.d = i.c * e.b + i.d * e.d, r.tx = i.tx * e.a + i.ty * e.c + e.tx, r.ty = i.tx * e.b + i.ty * e.d + e.ty, this._worldID++
            }, i.prototype.updateWorldTransform = i.prototype.updateTransform, i.IDENTITY = new i, e.exports = i
        }, {
            "../math": 67
        }],
        49: [function(t, e, r) {			//"./display/TransformStatic": 49
            function i() {
                s.call(this), this.position = new n.ObservablePoint(this.onChange, this, 0, 0), this.scale = new n.ObservablePoint(this.onChange, this, 1, 1), this.pivot = new n.ObservablePoint(this.onChange, this, 0, 0), this.skew = new n.ObservablePoint(this.updateSkew, this, 0, 0), this._rotation = 0, this._sr = Math.sin(0), this._cr = Math.cos(0), this._cy = Math.cos(0), this._sy = Math.sin(0), this._nsx = Math.sin(0), this._cx = Math.cos(0), this._localID = 0, this._currentLocalID = 0
            }
            var n = t("../math"),
                s = t("./TransformBase");
            i.prototype = Object.create(s.prototype), i.prototype.constructor = i, i.prototype.onChange = function() {
                this._localID++
            }, i.prototype.updateSkew = function() {
                this._cy = Math.cos(this.skew._y), this._sy = Math.sin(this.skew._y), this._nsx = Math.sin(this.skew._x), this._cx = Math.cos(this.skew._x), this._localID++
            }, i.prototype.updateLocalTransform = function() {
                var t = this.localTransform;
                if (this._localID !== this._currentLocalID) {
                    var e, r, i, n;
                    e = this._cr * this.scale._x, r = this._sr * this.scale._x, i = -this._sr * this.scale._y, n = this._cr * this.scale._y, t.a = this._cy * e + this._sy * i, t.b = this._cy * r + this._sy * n, t.c = this._nsx * e + this._cx * i, t.d = this._nsx * r + this._cx * n, t.tx = this.position._x - (this.pivot._x * t.a + this.pivot._y * t.c), t.ty = this.position._y - (this.pivot._x * t.b + this.pivot._y * t.d), this._currentLocalID = this._localID, this._parentID = -1
                }
            }, i.prototype.updateTransform = function(t) {
                var e = t.worldTransform,
                    r = this.worldTransform,
                    i = this.localTransform;
                if (this._localID !== this._currentLocalID) {
                    var n, s, o, a;
                    n = this._cr * this.scale._x, s = this._sr * this.scale._x, o = -this._sr * this.scale._y, a = this._cr * this.scale._y, i.a = this._cy * n + this._sy * o, i.b = this._cy * s + this._sy * a, i.c = this._nsx * n + this._cx * o, i.d = this._nsx * s + this._cx * a, i.tx = this.position._x - (this.pivot._x * i.a + this.pivot._y * i.c), i.ty = this.position._y - (this.pivot._x * i.b + this.pivot._y * i.d), this._currentLocalID = this._localID, this._parentID = -1
                }
                this._parentID !== t._worldID && (r.a = i.a * e.a + i.b * e.c, r.b = i.a * e.b + i.b * e.d, r.c = i.c * e.a + i.d * e.c, r.d = i.c * e.b + i.d * e.d, r.tx = i.tx * e.a + i.ty * e.c + e.tx, r.ty = i.tx * e.b + i.ty * e.d + e.ty, this._parentID = t._worldID, this._worldID++)
            }, i.prototype.setFromMatrix = function(t) {
                t.decompose(this), this._localID++
            }, Object.defineProperties(i.prototype, {
                rotation: {
                    get: function() {
                        return this._rotation
                    },
                    set: function(t) {
                        this._rotation = t, this._sr = Math.sin(t), this._cr = Math.cos(t), this._localID++
                    }
                }
            }), e.exports = i
        }, {
            "../math": 67,
            "./TransformBase": 48
        }],
        50: [function(t, e, r) {			//"./graphics/Graphics": 50
            function i() {
                s.call(this), this.fillAlpha = 1, this.lineWidth = 0, this.lineColor = 0, this.graphicsData = [], this.tint = 16777215, this._prevTint = 16777215, this.blendMode = c.BLEND_MODES.NORMAL, this.currentPath = null, this._webGL = {}, this.isMask = !1, this.boundsPadding = 0, this._localBounds = new p, this.dirty = 0, this.fastRectDirty = -1, this.clearDirty = 0, this.boundsDirty = -1, this.cachedSpriteDirty = !1, this._spriteRect = null, this._fastRect = !1
            }
            var n, s = t("../display/Container"),
                o = t("../textures/RenderTexture"),
                a = t("../textures/Texture"),
                h = t("./GraphicsData"),
                u = t("../sprites/Sprite"),
                l = t("../math"),
                c = t("../const"),
                d = t("../utils"),
                p = t("../display/Bounds"),
                f = t("./utils/bezierCurveTo"),
                v = t("../renderers/canvas/CanvasRenderer"),
                g = new l.Matrix,
                y = new l.Point,
                x = new Float32Array(4),
                m = new Float32Array(4);
            i._SPRITE_TEXTURE = null, i.prototype = Object.create(s.prototype), i.prototype.constructor = i, e.exports = i, i.prototype.clone = function() {
                var t = new i;
                t.renderable = this.renderable, t.fillAlpha = this.fillAlpha, t.lineWidth = this.lineWidth, t.lineColor = this.lineColor, t.tint = this.tint, t.blendMode = this.blendMode, t.isMask = this.isMask, t.boundsPadding = this.boundsPadding, t.dirty = 0, t.cachedSpriteDirty = this.cachedSpriteDirty;
                for (var e = 0; e < this.graphicsData.length; ++e) t.graphicsData.push(this.graphicsData[e].clone());
                return t.currentPath = t.graphicsData[t.graphicsData.length - 1], t.updateLocalBounds(), t
            }, i.prototype.lineStyle = function(t, e, r) {
                if (this.lineWidth = t || 0, this.lineColor = e || 0, this.lineAlpha = void 0 === r ? 1 : r, this.currentPath)
                    if (this.currentPath.shape.points.length) {
                        var i = new l.Polygon(this.currentPath.shape.points.slice(-2));
                        i.closed = !1, this.drawShape(i)
                    } else this.currentPath.lineWidth = this.lineWidth, this.currentPath.lineColor = this.lineColor, this.currentPath.lineAlpha = this.lineAlpha;
                return this
            }, i.prototype.moveTo = function(t, e) {
                var r = new l.Polygon([t, e]);
                return r.closed = !1, this.drawShape(r), this
            }, i.prototype.lineTo = function(t, e) {
                return this.currentPath.shape.points.push(t, e), this.dirty++, this
            }, i.prototype.quadraticCurveTo = function(t, e, r, i) {
                this.currentPath ? 0 === this.currentPath.shape.points.length && (this.currentPath.shape.points = [0, 0]) : this.moveTo(0, 0);
                var n, s, o = 20,
                    a = this.currentPath.shape.points;
                0 === a.length && this.moveTo(0, 0);
                for (var h = a[a.length - 2], u = a[a.length - 1], l = 0, c = 1; c <= o; ++c) l = c / o, n = h + (t - h) * l, s = u + (e - u) * l, a.push(n + (t + (r - t) * l - n) * l, s + (e + (i - e) * l - s) * l);
                return this.dirty++, this
            }, i.prototype.bezierCurveTo = function(t, e, r, i, n, s) {
                this.currentPath ? 0 === this.currentPath.shape.points.length && (this.currentPath.shape.points = [0, 0]) : this.moveTo(0, 0);
                var o = this.currentPath.shape.points,
                    a = o[o.length - 2],
                    h = o[o.length - 1];
                return o.length -= 2, f(a, h, t, e, r, i, n, s, o), this.dirty++, this
            }, i.prototype.arcTo = function(t, e, r, i, n) {
                this.currentPath ? 0 === this.currentPath.shape.points.length && this.currentPath.shape.points.push(t, e) : this.moveTo(t, e);
                var s = this.currentPath.shape.points,
                    o = s[s.length - 2],
                    a = s[s.length - 1],
                    h = a - e,
                    u = o - t,
                    l = i - e,
                    c = r - t,
                    d = Math.abs(h * c - u * l);
                if (d < 1e-8 || 0 === n) s[s.length - 2] === t && s[s.length - 1] === e || s.push(t, e);
                else {
                    var p = h * h + u * u,
                        f = l * l + c * c,
                        v = h * l + u * c,
                        g = n * Math.sqrt(p) / d,
                        y = n * Math.sqrt(f) / d,
                        x = g * v / p,
                        m = y * v / f,
                        _ = g * c + y * u,
                        b = g * l + y * h,
                        T = u * (y + x),
                        E = h * (y + x),
                        w = c * (g + m),
                        S = l * (g + m),
                        C = Math.atan2(E - b, T - _),
                        R = Math.atan2(S - b, w - _);
                    this.arc(_ + t, b + e, n, C, R, u * l > c * h)
                }
                return this.dirty++, this
            }, i.prototype.arc = function(t, e, r, i, n, s) {
                if (s = s || !1, i === n) return this;
                !s && n <= i ? n += 2 * Math.PI : s && i <= n && (i += 2 * Math.PI);
                var o = s ? (i - n) * -1 : n - i,
                    a = 40 * Math.ceil(Math.abs(o) / (2 * Math.PI));
                if (0 === o) return this;
                var h = t + Math.cos(i) * r,
                    u = e + Math.sin(i) * r;
                this.currentPath ? this.currentPath.shape.points.push(h, u) : this.moveTo(h, u);
                for (var l = this.currentPath.shape.points, c = o / (2 * a), d = 2 * c, p = Math.cos(c), f = Math.sin(c), v = a - 1, g = v % 1 / v, y = 0; y <= v; y++) {
                    var x = y + g * y,
                        m = c + i + d * x,
                        _ = Math.cos(m),
                        b = -Math.sin(m);
                    l.push((p * _ + f * b) * r + t, (p * -b + f * _) * r + e)
                }
                return this.dirty++, this
            }, i.prototype.beginFill = function(t, e) {
                return this.filling = !0, this.fillColor = t || 0, this.fillAlpha = void 0 === e ? 1 : e, this.currentPath && this.currentPath.shape.points.length <= 2 && (this.currentPath.fill = this.filling, this.currentPath.fillColor = this.fillColor, this.currentPath.fillAlpha = this.fillAlpha), this
            }, i.prototype.endFill = function() {
                return this.filling = !1, this.fillColor = null, this.fillAlpha = 1, this
            }, i.prototype.drawRect = function(t, e, r, i) {
                return this.drawShape(new l.Rectangle(t, e, r, i)), this
            }, i.prototype.drawRoundedRect = function(t, e, r, i, n) {
                return this.drawShape(new l.RoundedRectangle(t, e, r, i, n)), this
            }, i.prototype.drawCircle = function(t, e, r) {
                return this.drawShape(new l.Circle(t, e, r)), this
            }, i.prototype.drawEllipse = function(t, e, r, i) {
                return this.drawShape(new l.Ellipse(t, e, r, i)), this
            }, i.prototype.drawPolygon = function(t) {
                var e = t,
                    r = !0;
                if (e instanceof l.Polygon && (r = e.closed, e = e.points), !Array.isArray(e)) {
                    e = new Array(arguments.length);
                    for (var i = 0; i < e.length; ++i) e[i] = arguments[i]
                }
                var n = new l.Polygon(e);
                return n.closed = r, this.drawShape(n), this
            }, i.prototype.clear = function() {
                return this.lineWidth = 0, this.filling = !1, this.dirty++, this.clearDirty++, this.graphicsData = [], this
            }, i.prototype.isFastRect = function() {
                return 1 === this.graphicsData.length && this.graphicsData[0].shape.type === c.SHAPES.RECT && !this.graphicsData[0].lineWidth
            }, i.prototype._renderWebGL = function(t) {
                this.dirty !== this.fastRectDirty && (this.fastRectDirty = this.dirty, this._fastRect = this.isFastRect()), this._fastRect ? this._renderSpriteRect(t) : (t.setObjectRenderer(t.plugins.graphics), t.plugins.graphics.render(this))
            }, i.prototype._renderSpriteRect = function(t) {
                var e = this.graphicsData[0].shape;
                if (!this._spriteRect) {
                    if (!i._SPRITE_TEXTURE) {
                        var r = document.createElement("canvas");
                        r.width = 10, r.height = 10;
                        var n = r.getContext("2d");
                        n.fillStyle = "white", n.fillRect(0, 0, 10, 10), i._SPRITE_TEXTURE = a.fromCanvas(r)
                    }
                    this._spriteRect = new u(i._SPRITE_TEXTURE)
                }
                if (16777215 === this.tint) this._spriteRect.tint = this.graphicsData[0].fillColor;
                else {
                    var s = x,
                        o = m;
                    d.hex2rgb(this.graphicsData[0].fillColor, s), d.hex2rgb(this.tint, o), s[0] *= o[0], s[1] *= o[1], s[2] *= o[2], this._spriteRect.tint = d.rgb2hex(s)
                }
                this._spriteRect.alpha = this.graphicsData[0].fillAlpha, this._spriteRect.worldAlpha = this.worldAlpha * this._spriteRect.alpha, i._SPRITE_TEXTURE._frame.width = e.width, i._SPRITE_TEXTURE._frame.height = e.height, this._spriteRect.transform.worldTransform = this.transform.worldTransform, this._spriteRect.anchor.set(-e.x / e.width, -e.y / e.height), this._spriteRect.onAnchorUpdate(), this._spriteRect._renderWebGL(t)
            }, i.prototype._renderCanvas = function(t) {
                this.isMask !== !0 && t.plugins.graphics.render(this)
            }, i.prototype._calculateBounds = function() {
                if (this.renderable) {
                    this.boundsDirty !== this.dirty && (this.boundsDirty = this.dirty, this.updateLocalBounds(), this.dirty++, this.cachedSpriteDirty = !0);
                    var t = this._localBounds;
                    this._bounds.addFrame(this.transform, t.minX, t.minY, t.maxX, t.maxY)
                }
            }, i.prototype.containsPoint = function(t) {
                this.worldTransform.applyInverse(t, y);
                for (var e = this.graphicsData, r = 0; r < e.length; r++) {
                    var i = e[r];
                    if (i.fill && i.shape && i.shape.contains(y.x, y.y)) return !0
                }
                return !1
            }, i.prototype.updateLocalBounds = function() {
                var t = 1 / 0,
                    e = -(1 / 0),
                    r = 1 / 0,
                    i = -(1 / 0);
                if (this.graphicsData.length)
                    for (var n, s, o, a, h, u, l = 0; l < this.graphicsData.length; l++) {
                        var d = this.graphicsData[l],
                            p = d.type,
                            f = d.lineWidth;
                        if (n = d.shape, p === c.SHAPES.RECT || p === c.SHAPES.RREC) o = n.x - f / 2, a = n.y - f / 2, h = n.width + f, u = n.height + f, t = o < t ? o : t, e = o + h > e ? o + h : e, r = a < r ? a : r, i = a + u > i ? a + u : i;
                        else if (p === c.SHAPES.CIRC) o = n.x, a = n.y, h = n.radius + f / 2, u = n.radius + f / 2, t = o - h < t ? o - h : t, e = o + h > e ? o + h : e, r = a - u < r ? a - u : r, i = a + u > i ? a + u : i;
                        else if (p === c.SHAPES.ELIP) o = n.x, a = n.y, h = n.width + f / 2, u = n.height + f / 2, t = o - h < t ? o - h : t, e = o + h > e ? o + h : e, r = a - u < r ? a - u : r, i = a + u > i ? a + u : i;
                        else {
                            s = n.points;
                            for (var v = 0; v < s.length; v += 2) o = s[v], a = s[v + 1], t = o - f < t ? o - f : t, e = o + f > e ? o + f : e, r = a - f < r ? a - f : r, i = a + f > i ? a + f : i
                        }
                    } else t = 0, e = 0, r = 0, i = 0;
                var g = this.boundsPadding;
                this._localBounds.minX = t - g, this._localBounds.maxX = e + 2 * g, this._localBounds.minY = r - g, this._localBounds.maxY = i + 2 * g
            }, i.prototype.drawShape = function(t) {
                this.currentPath && this.currentPath.shape.points.length <= 2 && this.graphicsData.pop(), this.currentPath = null;
                var e = new h(this.lineWidth, this.lineColor, this.lineAlpha, this.fillColor, this.fillAlpha, this.filling, t);
                return this.graphicsData.push(e), e.type === c.SHAPES.POLY && (e.shape.closed = e.shape.closed || this.filling, this.currentPath = e), this.dirty++, e
            }, i.prototype.generateCanvasTexture = function(t, e) {
                e = e || 1;
                var r = this.getLocalBounds(),
                    i = new o.create(r.width * e, r.height * e);
                n || (n = new v), g.tx = -r.x, g.ty = -r.y, n.render(this, i, !1, g);
                var s = a.fromCanvas(i.baseTexture._canvasRenderTarget.canvas, t);
                return s.baseTexture.resolution = e, s
            }, i.prototype.closePath = function() {
                var t = this.currentPath;
                return t && t.shape && t.shape.close(), this
            }, i.prototype.addHole = function() {
                var t = this.graphicsData.pop();
                return this.currentPath = this.graphicsData[this.graphicsData.length - 1], this.currentPath.addHole(t.shape), this.currentPath = null, this
            }, i.prototype.destroy = function() {
                s.prototype.destroy.apply(this, arguments);
                for (var t = 0; t < this.graphicsData.length; ++t) this.graphicsData[t].destroy();
                for (var e in this._webgl)
                    for (var r = 0; r < this._webgl[e].data.length; ++r) this._webgl[e].data[r].destroy();
                this._spriteRect && this._spriteRect.destroy(), this.graphicsData = null, this.currentPath = null, this._webgl = null, this._localBounds = null
            }
        }, {
            "../const": 43,
            "../display/Bounds": 44,
            "../display/Container": 45,
            "../math": 67,
            "../renderers/canvas/CanvasRenderer": 74,
            "../sprites/Sprite": 98,
            "../textures/RenderTexture": 108,
            "../textures/Texture": 109,
            "../utils": 116,
            "./GraphicsData": 51,
            "./utils/bezierCurveTo": 53
        }],
        51: [function(t, e, r) {			//"./graphics/GraphicsData": 51
            function i(t, e, r, i, n, s, o) {
                this.lineWidth = t, this.lineColor = e, this.lineAlpha = r, this._lineTint = e, this.fillColor = i, this.fillAlpha = n, this._fillTint = i, this.fill = s, this.holes = [], this.shape = o, this.type = o.type
            }
            i.prototype.constructor = i, e.exports = i, i.prototype.clone = function() {
                return new i(this.lineWidth, this.lineColor, this.lineAlpha, this.fillColor, this.fillAlpha, this.fill, this.shape)
            }, i.prototype.addHole = function(t) {
                this.holes.push(t)
            }, i.prototype.destroy = function() {
                this.shape = null, this.holes = null
            }
        }, {}],
        52: [function(t, e, r) {			//"./graphics/canvas/CanvasGraphicsRenderer": 52
            function i(t) {
                this.renderer = t
            }
            var n = t("../../renderers/canvas/CanvasRenderer"),
                s = t("../../const");
            i.prototype.constructor = i, e.exports = i, n.registerPlugin("graphics", i), i.prototype.render = function(t) {
                var e = this.renderer,
                    r = e.context,
                    i = t.worldAlpha,
                    n = t.transform.worldTransform,
                    o = e.resolution;
                this._prevTint !== this.tint && (this.dirty = !0), r.setTransform(n.a * o, n.b * o, n.c * o, n.d * o, n.tx * o, n.ty * o), t.dirty && (this.updateGraphicsTint(t), t.dirty = !1), e.setBlendMode(t.blendMode);
                for (var a = 0; a < t.graphicsData.length; a++) {
                    var h = t.graphicsData[a],
                        u = h.shape,
                        l = h._fillTint,
                        c = h._lineTint;
                    if (r.lineWidth = h.lineWidth, h.type === s.SHAPES.POLY) {
                        r.beginPath(), this.renderPolygon(u.points, u.closed, r);
                        for (var d = 0; d < h.holes.length; d++) {
                            var p = h.holes[d];
                            this.renderPolygon(p.points, !0, r)
                        }
                        h.fill && (r.globalAlpha = h.fillAlpha * i, r.fillStyle = "#" + ("00000" + (0 | l).toString(16)).substr(-6), r.fill()), h.lineWidth && (r.globalAlpha = h.lineAlpha * i, r.strokeStyle = "#" + ("00000" + (0 | c).toString(16)).substr(-6), r.stroke())
                    } else if (h.type === s.SHAPES.RECT)(h.fillColor || 0 === h.fillColor) && (r.globalAlpha = h.fillAlpha * i, r.fillStyle = "#" + ("00000" + (0 | l).toString(16)).substr(-6), r.fillRect(u.x, u.y, u.width, u.height)), h.lineWidth && (r.globalAlpha = h.lineAlpha * i, r.strokeStyle = "#" + ("00000" + (0 | c).toString(16)).substr(-6), r.strokeRect(u.x, u.y, u.width, u.height));
                    else if (h.type === s.SHAPES.CIRC) r.beginPath(), r.arc(u.x, u.y, u.radius, 0, 2 * Math.PI), r.closePath(), h.fill && (r.globalAlpha = h.fillAlpha * i, r.fillStyle = "#" + ("00000" + (0 | l).toString(16)).substr(-6), r.fill()), h.lineWidth && (r.globalAlpha = h.lineAlpha * i, r.strokeStyle = "#" + ("00000" + (0 | c).toString(16)).substr(-6), r.stroke());
                    else if (h.type === s.SHAPES.ELIP) {
                        var f = 2 * u.width,
                            v = 2 * u.height,
                            g = u.x - f / 2,
                            y = u.y - v / 2;
                        r.beginPath();
                        var x = .5522848,
                            m = f / 2 * x,
                            _ = v / 2 * x,
                            b = g + f,
                            T = y + v,
                            E = g + f / 2,
                            w = y + v / 2;
                        r.moveTo(g, w), r.bezierCurveTo(g, w - _, E - m, y, E, y), r.bezierCurveTo(E + m, y, b, w - _, b, w), r.bezierCurveTo(b, w + _, E + m, T, E, T), r.bezierCurveTo(E - m, T, g, w + _, g, w), r.closePath(), h.fill && (r.globalAlpha = h.fillAlpha * i, r.fillStyle = "#" + ("00000" + (0 | l).toString(16)).substr(-6), r.fill()), h.lineWidth && (r.globalAlpha = h.lineAlpha * i, r.strokeStyle = "#" + ("00000" + (0 | c).toString(16)).substr(-6), r.stroke())
                    } else if (h.type === s.SHAPES.RREC) {
                        var S = u.x,
                            C = u.y,
                            R = u.width,
                            M = u.height,
                            A = u.radius,
                            O = Math.min(R, M) / 2 | 0;
                        A = A > O ? O : A, r.beginPath(), r.moveTo(S, C + A), r.lineTo(S, C + M - A), r.quadraticCurveTo(S, C + M, S + A, C + M), r.lineTo(S + R - A, C + M), r.quadraticCurveTo(S + R, C + M, S + R, C + M - A), r.lineTo(S + R, C + A), r.quadraticCurveTo(S + R, C, S + R - A, C), r.lineTo(S + A, C), r.quadraticCurveTo(S, C, S, C + A), r.closePath(), (h.fillColor || 0 === h.fillColor) && (r.globalAlpha = h.fillAlpha * i, r.fillStyle = "#" + ("00000" + (0 | l).toString(16)).substr(-6), r.fill()), h.lineWidth && (r.globalAlpha = h.lineAlpha * i, r.strokeStyle = "#" + ("00000" + (0 | c).toString(16)).substr(-6), r.stroke())
                    }
                }
            }, i.prototype.updateGraphicsTint = function(t) {
                t._prevTint = t.tint;
                for (var e = (t.tint >> 16 & 255) / 255, r = (t.tint >> 8 & 255) / 255, i = (255 & t.tint) / 255, n = 0; n < t.graphicsData.length; n++) {
                    var s = t.graphicsData[n],
                        o = 0 | s.fillColor,
                        a = 0 | s.lineColor;
                    s._fillTint = ((o >> 16 & 255) / 255 * e * 255 << 16) + ((o >> 8 & 255) / 255 * r * 255 << 8) + (255 & o) / 255 * i * 255, s._lineTint = ((a >> 16 & 255) / 255 * e * 255 << 16) + ((a >> 8 & 255) / 255 * r * 255 << 8) + (255 & a) / 255 * i * 255
                }
            }, i.prototype.renderPolygon = function(t, e, r) {
                r.moveTo(t[0], t[1]);
                for (var i = 1; i < t.length / 2; i++) r.lineTo(t[2 * i], t[2 * i + 1]);
                e && r.closePath()
            }, i.prototype.destroy = function() {
                this.renderer = null
            }
        }, {
            "../../const": 43,
            "../../renderers/canvas/CanvasRenderer": 74
        }],
        53: [function(t, e, r) {			//
            var i = function(t, e, r, i, n, s, o, a, h) {
                h = h || [];
                var u, l, c, d, p, f = 20;
                h.push(t, e);
                for (var v = 0, g = 1; g <= f; ++g) v = g / f, u = 1 - v, l = u * u, c = l * u, d = v * v, p = d * v, h.push(c * t + 3 * l * v * r + 3 * u * d * n + p * o, c * e + 3 * l * v * i + 3 * u * d * s + p * a);
                return h
            };
            e.exports = i
        }, {}],
        54: [function(t, e, r) {			//"./graphics/webgl/GraphicsRenderer": 54,
            function i(t) {
                o.call(this, t), this.graphicsDataPool = [], this.primitiveShader = null, this.gl = t.gl, this.CONTEXT_UID = 0
            }
            var n = t("../../utils"),
                s = t("../../const"),
                o = t("../../renderers/webgl/utils/ObjectRenderer"),
                a = t("../../renderers/webgl/WebGLRenderer"),
                h = t("./WebGLGraphicsData"),
                u = t("./shaders/PrimitiveShader"),
                l = t("./utils/buildPoly"),
                c = t("./utils/buildRectangle"),
                d = t("./utils/buildRoundedRectangle"),
                p = t("./utils/buildCircle");
            i.prototype = Object.create(o.prototype), i.prototype.constructor = i, e.exports = i, a.registerPlugin("graphics", i), i.prototype.onContextChange = function() {
                this.gl = this.renderer.gl, this.CONTEXT_UID = this.renderer.CONTEXT_UID, this.primitiveShader = new u(this.gl)
            }, i.prototype.destroy = function() {
                o.prototype.destroy.call(this);
                for (var t = 0; t < this.graphicsDataPool.length; ++t) this.graphicsDataPool[t].destroy();
                this.graphicsDataPool = null
            }, i.prototype.render = function(t) {
                var e, r = this.renderer,
                    i = r.gl,
                    s = t._webGL[this.CONTEXT_UID];
                s && t.dirty === s.dirty || (this.updateGraphics(t), s = t._webGL[this.CONTEXT_UID]);
                var o = this.primitiveShader;
                r.bindShader(o), r.state.setBlendMode(t.blendMode);
                for (var a = 0, h = s.data.length; a < h; a++) {
                    e = s.data[a];
                    var u = e.shader;
                    r.bindShader(u), u.uniforms.translationMatrix = t.transform.worldTransform.toArray(!0), u.uniforms.tint = n.hex2rgb(t.tint), u.uniforms.alpha = t.worldAlpha, e.vao.bind().draw(i.TRIANGLE_STRIP, e.indices.length).unbind()
                }
            }, i.prototype.updateGraphics = function(t) {
                var e = this.renderer.gl,
                    r = t._webGL[this.CONTEXT_UID];
                r || (r = t._webGL[this.CONTEXT_UID] = {
                    lastIndex: 0,
                    data: [],
                    gl: e,
                    clearDirty: -1,
                    dirty: -1
                }), r.dirty = t.dirty;
                var i;
                if (t.clearDirty !== r.clearDirty) {
                    for (r.clearDirty = t.clearDirty, i = 0; i < r.data.length; i++) {
                        var n = r.data[i];
                        this.graphicsDataPool.push(n)
                    }
                    r.data = [], r.lastIndex = 0
                }
                var o;
                for (i = r.lastIndex; i < t.graphicsData.length; i++) {
                    var a = t.graphicsData[i];
                    o = this.getWebGLData(r, 0), a.type === s.SHAPES.POLY && l(a, o), a.type === s.SHAPES.RECT ? c(a, o) : a.type === s.SHAPES.CIRC || a.type === s.SHAPES.ELIP ? p(a, o) : a.type === s.SHAPES.RREC && d(a, o), r.lastIndex++
                }
                for (i = 0; i < r.data.length; i++) o = r.data[i], o.dirty && o.upload()
            }, i.prototype.getWebGLData = function(t, e) {
                var r = t.data[t.data.length - 1];
                return (!r || r.points.length > 32e4) && (r = this.graphicsDataPool.pop() || new h(this.renderer.gl, this.primitiveShader, this.renderer.state.attribsState), r.reset(e), t.data.push(r)), r.dirty = !0, r
            }
        }, {
            "../../const": 43,
            "../../renderers/webgl/WebGLRenderer": 81,
            "../../renderers/webgl/utils/ObjectRenderer": 91,
            "../../utils": 116,
            "./WebGLGraphicsData": 55,
            "./shaders/PrimitiveShader": 56,
            "./utils/buildCircle": 57,
            "./utils/buildPoly": 59,
            "./utils/buildRectangle": 60,
            "./utils/buildRoundedRectangle": 61
        }],
        55: [function(t, e, r) {
            function i(t, e, r) {
                this.gl = t, this.color = [0, 0, 0], this.points = [], this.indices = [], this.buffer = n.GLBuffer.createVertexBuffer(t), this.indexBuffer = n.GLBuffer.createIndexBuffer(t), this.dirty = !0, this.glPoints = null, this.glIndices = null, this.shader = e, this.vao = new n.VertexArrayObject(t, r).addIndex(this.indexBuffer).addAttribute(this.buffer, e.attributes.aVertexPosition, t.FLOAT, !1, 24, 0).addAttribute(this.buffer, e.attributes.aColor, t.FLOAT, !1, 24, 8)
            }
            var n = t("pixi-gl-core");
            i.prototype.constructor = i, e.exports = i, i.prototype.reset = function() {
                this.points.length = 0, this.indices.length = 0
            }, i.prototype.upload = function() {
                this.glPoints = new Float32Array(this.points), this.buffer.upload(this.glPoints), this.glIndices = new Uint16Array(this.indices), this.indexBuffer.upload(this.glIndices), this.dirty = !1
            }, i.prototype.destroy = function() {
                this.color = null, this.points = null, this.indices = null, this.vao.destroy(), this.buffer.destroy(), this.indexBuffer.destroy(), this.gl = null, this.buffer = null, this.indexBuffer = null, this.glPoints = null, this.glIndices = null
            }
        }, {
            "pixi-gl-core": 12
        }],
        56: [function(t, e, r) {
            function i(t) {
                n.call(this, t, ["attribute vec2 aVertexPosition;", "attribute vec4 aColor;", "uniform mat3 translationMatrix;", "uniform mat3 projectionMatrix;", "uniform float alpha;", "uniform vec3 tint;", "varying vec4 vColor;", "void main(void){", "   gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);", "   vColor = aColor * vec4(tint * alpha, alpha);", "}"].join("\n"), ["varying vec4 vColor;", "void main(void){", "   gl_FragColor = vColor;", "}"].join("\n"))
            }
            var n = t("../../../Shader");
            i.prototype = Object.create(n.prototype), i.prototype.constructor = i, e.exports = i
        }, {
            "../../../Shader": 42
        }],
        57: [function(t, e, r) {
            var i = t("./buildLine"),
                n = t("../../../const"),
                s = t("../../../utils"),
                o = function(t, e) {
                    var r, o, a = t.shape,
                        h = a.x,
                        u = a.y;
                    t.type === n.SHAPES.CIRC ? (r = a.radius, o = a.radius) : (r = a.width, o = a.height);
                    var l = Math.floor(30 * Math.sqrt(a.radius)) || Math.floor(15 * Math.sqrt(a.width + a.height)),
                        c = 2 * Math.PI / l,
                        d = 0;
                    if (t.fill) {
                        var p = s.hex2rgb(t.fillColor),
                            f = t.fillAlpha,
                            v = p[0] * f,
                            g = p[1] * f,
                            y = p[2] * f,
                            x = e.points,
                            m = e.indices,
                            _ = x.length / 6;
                        for (m.push(_), d = 0; d < l + 1; d++) x.push(h, u, v, g, y, f), x.push(h + Math.sin(c * d) * r, u + Math.cos(c * d) * o, v, g, y, f), m.push(_++, _++);
                        m.push(_ - 1)
                    }
                    if (t.lineWidth) {
                        var b = t.points;
                        for (t.points = [], d = 0; d < l + 1; d++) t.points.push(h + Math.sin(c * d) * r, u + Math.cos(c * d) * o);
                        i(t, e), t.points = b
                    }
                };
            e.exports = o
        }, {
            "../../../const": 43,
            "../../../utils": 116,
            "./buildLine": 58
        }],
        58: [function(t, e, r) {
            var i = t("../../../math"),
                n = t("../../../utils"),
                s = function(t, e) {
                    var r = 0,
                        s = t.points;
                    if (0 !== s.length) {
                        var o = new i.Point(s[0], s[1]),
                            a = new i.Point(s[s.length - 2], s[s.length - 1]);
                        if (o.x === a.x && o.y === a.y) {
                            s = s.slice(), s.pop(), s.pop(), a = new i.Point(s[s.length - 2], s[s.length - 1]);
                            var h = a.x + .5 * (o.x - a.x),
                                u = a.y + .5 * (o.y - a.y);
                            s.unshift(h, u), s.push(h, u)
                        }
                        var l, c, d, p, f, v, g, y, x, m, _, b, T, E, w, S, C, R, M, A, O, D, P, I = e.points,
                            L = e.indices,
                            F = s.length / 2,
                            B = s.length,
                            N = I.length / 6,
                            U = t.lineWidth / 2,
                            k = n.hex2rgb(t.lineColor),
                            j = t.lineAlpha,
                            W = k[0] * j,
                            G = k[1] * j,
                            X = k[2] * j;
                        for (d = s[0], p = s[1], f = s[2], v = s[3], x = -(p - v), m = d - f, P = Math.sqrt(x * x + m * m), x /= P, m /= P, x *= U, m *= U, I.push(d - x, p - m, W, G, X, j), I.push(d + x, p + m, W, G, X, j), r = 1; r < F - 1; r++) d = s[2 * (r - 1)], p = s[2 * (r - 1) + 1], f = s[2 * r], v = s[2 * r + 1], g = s[2 * (r + 1)], y = s[2 * (r + 1) + 1], x = -(p - v), m = d - f, P = Math.sqrt(x * x + m * m), x /= P, m /= P, x *= U, m *= U, _ = -(v - y), b = f - g, P = Math.sqrt(_ * _ + b * b), _ /= P, b /= P, _ *= U, b *= U, w = -m + p - (-m + v), S = -x + f - (-x + d), C = (-x + d) * (-m + v) - (-x + f) * (-m + p), R = -b + y - (-b + v), M = -_ + f - (-_ + g), A = (-_ + g) * (-b + v) - (-_ + f) * (-b + y), O = w * M - R * S, Math.abs(O) < .1 ? (O += 10.1, I.push(f - x, v - m, W, G, X, j), I.push(f + x, v + m, W, G, X, j)) : (l = (S * A - M * C) / O, c = (R * C - w * A) / O, D = (l - f) * (l - f) + (c - v) * (c - v), D > 19600 ? (T = x - _, E = m - b, P = Math.sqrt(T * T + E * E), T /= P, E /= P, T *= U, E *= U, I.push(f - T, v - E), I.push(W, G, X, j), I.push(f + T, v + E), I.push(W, G, X, j), I.push(f - T, v - E), I.push(W, G, X, j), B++) : (I.push(l, c), I.push(W, G, X, j), I.push(f - (l - f), v - (c - v)), I.push(W, G, X, j)));
                        for (d = s[2 * (F - 2)], p = s[2 * (F - 2) + 1], f = s[2 * (F - 1)], v = s[2 * (F - 1) + 1], x = -(p - v), m = d - f, P = Math.sqrt(x * x + m * m), x /= P, m /= P, x *= U, m *= U, I.push(f - x, v - m), I.push(W, G, X, j), I.push(f + x, v + m), I.push(W, G, X, j), L.push(N), r = 0; r < B; r++) L.push(N++);
                        L.push(N - 1)
                    }
                };
            e.exports = s
        }, {
            "../../../math": 67,
            "../../../utils": 116
        }],
        59: [function(t, e, r) {
            var i = t("./buildLine"),
                n = t("../../../utils"),
                s = t("earcut"),
                o = function(t, e) {
                    t.points = t.shape.points.slice();
                    var r = t.points;
                    if (t.fill && r.length >= 6) {
                        for (var o = [], a = t.holes, h = 0; h < a.length; h++) {
                            var u = a[h];
                            o.push(r.length / 2), r = r.concat(u.points)
                        }
                        var l = e.points,
                            c = e.indices,
                            d = r.length / 2,
                            p = n.hex2rgb(t.fillColor),
                            f = t.fillAlpha,
                            v = p[0] * f,
                            g = p[1] * f,
                            y = p[2] * f,
                            x = s(r, o, 2);
                        if (!x) return;
                        var m = l.length / 6;
                        for (h = 0; h < x.length; h += 3) c.push(x[h] + m), c.push(x[h] + m), c.push(x[h + 1] + m), c.push(x[h + 2] + m), c.push(x[h + 2] + m);
                        for (h = 0; h < d; h++) l.push(r[2 * h], r[2 * h + 1], v, g, y, f)
                    }
                    t.lineWidth > 0 && i(t, e)
                };
            e.exports = o
        }, {
            "../../../utils": 116,
            "./buildLine": 58,
            earcut: 2
        }],
        60: [function(t, e, r) {
            var i = t("./buildLine"),
                n = t("../../../utils"),
                s = function(t, e) {
                    var r = t.shape,
                        s = r.x,
                        o = r.y,
                        a = r.width,
                        h = r.height;
                    if (t.fill) {
                        var u = n.hex2rgb(t.fillColor),
                            l = t.fillAlpha,
                            c = u[0] * l,
                            d = u[1] * l,
                            p = u[2] * l,
                            f = e.points,
                            v = e.indices,
                            g = f.length / 6;
                        f.push(s, o), f.push(c, d, p, l), f.push(s + a, o), f.push(c, d, p, l), f.push(s, o + h), f.push(c, d, p, l), f.push(s + a, o + h), f.push(c, d, p, l), v.push(g, g, g + 1, g + 2, g + 3, g + 3)
                    }
                    if (t.lineWidth) {
                        var y = t.points;
                        t.points = [s, o, s + a, o, s + a, o + h, s, o + h, s, o], i(t, e), t.points = y
                    }
                };
            e.exports = s
        }, {
            "../../../utils": 116,
            "./buildLine": 58
        }],
        61: [function(t, e, r) {
            var i = t("earcut"),
                n = t("./buildLine"),
                s = t("../../../utils"),
                o = function(t, e) {
                    var r = t.shape,
                        o = r.x,
                        h = r.y,
                        u = r.width,
                        l = r.height,
                        c = r.radius,
                        d = [];
                    if (d.push(o, h + c), a(o, h + l - c, o, h + l, o + c, h + l, d), a(o + u - c, h + l, o + u, h + l, o + u, h + l - c, d), a(o + u, h + c, o + u, h, o + u - c, h, d), a(o + c, h, o, h, o, h + c + 1e-10, d), t.fill) {
                        var p = s.hex2rgb(t.fillColor),
                            f = t.fillAlpha,
                            v = p[0] * f,
                            g = p[1] * f,
                            y = p[2] * f,
                            x = e.points,
                            m = e.indices,
                            _ = x.length / 6,
                            b = i(d, null, 2),
                            T = 0;
                        for (T = 0; T < b.length; T += 3) m.push(b[T] + _), m.push(b[T] + _), m.push(b[T + 1] + _), m.push(b[T + 2] + _), m.push(b[T + 2] + _);
                        for (T = 0; T < d.length; T++) x.push(d[T], d[++T], v, g, y, f)
                    }
                    if (t.lineWidth) {
                        var E = t.points;
                        t.points = d, n(t, e), t.points = E
                    }
                },
                a = function(t, e, r, i, n, s, o) {
                    function a(t, e, r) {
                        var i = e - t;
                        return t + i * r
                    }
                    for (var h, u, l, c, d, p, f = 20, v = o || [], g = 0, y = 0; y <= f; y++) g = y / f, h = a(t, r, g), u = a(e, i, g), l = a(r, n, g), c = a(i, s, g), d = a(h, l, g), p = a(u, c, g), v.push(d, p);
                    return v
                };
            e.exports = o
        }, {
            "../../../utils": 116,
            "./buildLine": 58,
            earcut: 2
        }],
        62: [function(t, e, r) {		//"../core": 62
            var i = e.exports = Object.assign(t("./const"), t("./math"), {
                utils: t("./utils"),
                ticker: t("./ticker"),
                DisplayObject: t("./display/DisplayObject"),
                Container: t("./display/Container"),
                Transform: t("./display/Transform"),
                TransformStatic: t("./display/TransformStatic"),
                TransformBase: t("./display/TransformBase"),
                Sprite: t("./sprites/Sprite"),
                CanvasSpriteRenderer: t("./sprites/canvas/CanvasSpriteRenderer"),
                CanvasTinter: t("./sprites/canvas/CanvasTinter"),
                SpriteRenderer: t("./sprites/webgl/SpriteRenderer"),
                Text: t("./text/Text"),
                TextStyle: t("./text/TextStyle"),
                Graphics: t("./graphics/Graphics"),
                GraphicsData: t("./graphics/GraphicsData"),
                GraphicsRenderer: t("./graphics/webgl/GraphicsRenderer"),
                CanvasGraphicsRenderer: t("./graphics/canvas/CanvasGraphicsRenderer"),
                Texture: t("./textures/Texture"),
                BaseTexture: t("./textures/BaseTexture"),
                RenderTexture: t("./textures/RenderTexture"),
                BaseRenderTexture: t("./textures/BaseRenderTexture"),
                VideoBaseTexture: t("./textures/VideoBaseTexture"),
                TextureUvs: t("./textures/TextureUvs"),
                CanvasRenderer: t("./renderers/canvas/CanvasRenderer"),
                CanvasRenderTarget: t("./renderers/canvas/utils/CanvasRenderTarget"),
                Shader: t("./Shader"),
                WebGLRenderer: t("./renderers/webgl/WebGLRenderer"),
                WebGLManager: t("./renderers/webgl/managers/WebGLManager"),
                ObjectRenderer: t("./renderers/webgl/utils/ObjectRenderer"),
                RenderTarget: t("./renderers/webgl/utils/RenderTarget"),
                Quad: t("./renderers/webgl/utils/Quad"),
                SpriteMaskFilter: t("./renderers/webgl/filters/spriteMask/SpriteMaskFilter"),
                Filter: t("./renderers/webgl/filters/Filter"),
                glCore: t("pixi-gl-core"),
                autoDetectRenderer: function(t, e, r, n) {
                    return t = t || 800, e = e || 600, !n && i.utils.isWebGLSupported() ? new i.WebGLRenderer(t, e, r) : new i.CanvasRenderer(t, e, r)
                }
            })
        }, {
            "./Shader": 42,
            "./const": 43,
            "./display/Container": 45,
            "./display/DisplayObject": 46,
            "./display/Transform": 47,
            "./display/TransformBase": 48,
            "./display/TransformStatic": 49,
            "./graphics/Graphics": 50,
            "./graphics/GraphicsData": 51,
            "./graphics/canvas/CanvasGraphicsRenderer": 52,
            "./graphics/webgl/GraphicsRenderer": 54,
            "./math": 67,
            "./renderers/canvas/CanvasRenderer": 74,
            "./renderers/canvas/utils/CanvasRenderTarget": 76,
            "./renderers/webgl/WebGLRenderer": 81,
            "./renderers/webgl/filters/Filter": 83,
            "./renderers/webgl/filters/spriteMask/SpriteMaskFilter": 86,
            "./renderers/webgl/managers/WebGLManager": 90,
            "./renderers/webgl/utils/ObjectRenderer": 91,
            "./renderers/webgl/utils/Quad": 92,
            "./renderers/webgl/utils/RenderTarget": 93,
            "./sprites/Sprite": 98,
            "./sprites/canvas/CanvasSpriteRenderer": 99,
            "./sprites/canvas/CanvasTinter": 100,
            "./sprites/webgl/SpriteRenderer": 102,
            "./text/Text": 104,
            "./text/TextStyle": 105,
            "./textures/BaseRenderTexture": 106,
            "./textures/BaseTexture": 107,
            "./textures/RenderTexture": 108,
            "./textures/Texture": 109,
            "./textures/TextureUvs": 110,
            "./textures/VideoBaseTexture": 111,
            "./ticker": 113,
            "./utils": 116,
            "pixi-gl-core": 12
        }],
        63: [function(t, e, r) {
            function i(t) {
                return t < 0 ? -1 : t > 0 ? 1 : 0
            }

            function n() {
                for (var t = 0; t < 16; t++) {
                    var e = [];
                    c.push(e);
                    for (var r = 0; r < 16; r++)
                        for (var n = i(s[t] * s[r] + a[t] * o[r]), d = i(o[t] * s[r] + h[t] * o[r]), p = i(s[t] * a[r] + a[t] * h[r]), f = i(o[t] * a[r] + h[t] * h[r]), v = 0; v < 16; v++)
                            if (s[v] === n && o[v] === d && a[v] === p && h[v] === f) {
                                e.push(v);
                                break
                            }
                }
                for (t = 0; t < 16; t++) {
                    var g = new l;
                    g.set(s[t], o[t], a[t], h[t], 0, 0), u.push(g)
                }
            }
            var s = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1],
                o = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1],
                a = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1],
                h = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1],
                u = [],
                l = t("./Matrix"),
                c = [];
            n();
            var d = {
                E: 0,
                SE: 1,
                S: 2,
                SW: 3,
                W: 4,
                NW: 5,
                N: 6,
                NE: 7,
                MIRROR_VERTICAL: 8,
                MIRROR_HORIZONTAL: 12,
                uX: function(t) {
                    return s[t]
                },
                uY: function(t) {
                    return o[t]
                },
                vX: function(t) {
                    return a[t]
                },
                vY: function(t) {
                    return h[t]
                },
                inv: function(t) {
                    return 8 & t ? 15 & t : 7 & -t
                },
                add: function(t, e) {
                    return c[t][e]
                },
                sub: function(t, e) {
                    return c[t][d.inv(e)]
                },
                rotate180: function(t) {
                    return 4 ^ t
                },
                isSwapWidthHeight: function(t) {
                    return 2 === (3 & t)
                },
                byDirection: function(t, e) {
                    return 2 * Math.abs(t) <= Math.abs(e) ? e >= 0 ? d.S : d.N : 2 * Math.abs(e) <= Math.abs(t) ? t > 0 ? d.E : d.W : e > 0 ? t > 0 ? d.SE : d.SW : t > 0 ? d.NE : d.NW
                },
                matrixAppendRotationInv: function(t, e, r, i) {
                    var n = u[d.inv(e)];
                    r = r || 0, i = i || 0, n.tx = r, n.ty = i, t.append(n)
                }
            };
            e.exports = d
        }, {
            "./Matrix": 64
        }],
        64: [function(t, e, r) {
            function i() {
                this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0, this.array = null
            }
            var n = t("./Point");
            i.prototype.constructor = i, e.exports = i, i.prototype.fromArray = function(t) {
                this.a = t[0], this.b = t[1], this.c = t[3], this.d = t[4], this.tx = t[2], this.ty = t[5]
            }, i.prototype.set = function(t, e, r, i, n, s) {
                return this.a = t, this.b = e, this.c = r, this.d = i, this.tx = n, this.ty = s, this
            }, i.prototype.toArray = function(t, e) {
                this.array || (this.array = new Float32Array(9));
                var r = e || this.array;
                return t ? (r[0] = this.a, r[1] = this.b, r[2] = 0, r[3] = this.c, r[4] = this.d, r[5] = 0, r[6] = this.tx, r[7] = this.ty, r[8] = 1) : (r[0] = this.a, r[1] = this.c, r[2] = this.tx, r[3] = this.b, r[4] = this.d, r[5] = this.ty, r[6] = 0, r[7] = 0, r[8] = 1), r
            }, i.prototype.apply = function(t, e) {
                e = e || new n;
                var r = t.x,
                    i = t.y;
                return e.x = this.a * r + this.c * i + this.tx, e.y = this.b * r + this.d * i + this.ty, e
            }, i.prototype.applyInverse = function(t, e) {
                e = e || new n;
                var r = 1 / (this.a * this.d + this.c * -this.b),
                    i = t.x,
                    s = t.y;
                return e.x = this.d * r * i + -this.c * r * s + (this.ty * this.c - this.tx * this.d) * r, e.y = this.a * r * s + -this.b * r * i + (-this.ty * this.a + this.tx * this.b) * r, e
            }, i.prototype.translate = function(t, e) {
                return this.tx += t, this.ty += e, this
            }, i.prototype.scale = function(t, e) {
                return this.a *= t, this.d *= e, this.c *= t, this.b *= e, this.tx *= t, this.ty *= e, this
            }, i.prototype.rotate = function(t) {
                var e = Math.cos(t),
                    r = Math.sin(t),
                    i = this.a,
                    n = this.c,
                    s = this.tx;
                return this.a = i * e - this.b * r, this.b = i * r + this.b * e, this.c = n * e - this.d * r, this.d = n * r + this.d * e, this.tx = s * e - this.ty * r, this.ty = s * r + this.ty * e, this
            }, i.prototype.append = function(t) {
                var e = this.a,
                    r = this.b,
                    i = this.c,
                    n = this.d;
                return this.a = t.a * e + t.b * i, this.b = t.a * r + t.b * n, this.c = t.c * e + t.d * i, this.d = t.c * r + t.d * n, this.tx = t.tx * e + t.ty * i + this.tx, this.ty = t.tx * r + t.ty * n + this.ty, this
            }, i.prototype.setTransform = function(t, e, r, i, n, s, o, a, h) {
                var u, l, c, d, p, f, v, g, y, x;
                return p = Math.sin(o), f = Math.cos(o), v = Math.cos(h), g = Math.sin(h), y = -Math.sin(a), x = Math.cos(a), u = f * n, l = p * n, c = -p * s, d = f * s, this.a = v * u + g * c, this.b = v * l + g * d, this.c = y * u + x * c, this.d = y * l + x * d, this.tx = t + (r * u + i * c), this.ty = e + (r * l + i * d), this
            }, i.prototype.prepend = function(t) {
                var e = this.tx;
                if (1 !== t.a || 0 !== t.b || 0 !== t.c || 1 !== t.d) {
                    var r = this.a,
                        i = this.c;
                    this.a = r * t.a + this.b * t.c, this.b = r * t.b + this.b * t.d, this.c = i * t.a + this.d * t.c, this.d = i * t.b + this.d * t.d
                }
                return this.tx = e * t.a + this.ty * t.c + t.tx, this.ty = e * t.b + this.ty * t.d + t.ty, this
            }, i.prototype.decompose = function(t) {
                var e = this.a,
                    r = this.b,
                    i = this.c,
                    n = this.d,
                    s = Math.atan2(-i, n),
                    o = Math.atan2(r, e),
                    a = Math.abs(1 - s / o);
                return a < 1e-5 ? (t.rotation = o, e < 0 && n >= 0 && (t.rotation += t.rotation <= 0 ? Math.PI : -Math.PI), t.skew.x = t.skew.y = 0) : (t.skew.x = s, t.skew.y = o), t.scale.x = Math.sqrt(e * e + r * r), t.scale.y = Math.sqrt(i * i + n * n), t.position.x = this.tx, t.position.y = this.ty, t
            }, i.prototype.invert = function() {
                var t = this.a,
                    e = this.b,
                    r = this.c,
                    i = this.d,
                    n = this.tx,
                    s = t * i - e * r;
                return this.a = i / s, this.b = -e / s, this.c = -r / s, this.d = t / s, this.tx = (r * this.ty - i * n) / s, this.ty = -(t * this.ty - e * n) / s, this
            }, i.prototype.identity = function() {
                return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0, this
            }, i.prototype.clone = function() {
                var t = new i;
                return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t
            }, i.prototype.copy = function(t) {
                return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t
            }, i.IDENTITY = new i, i.TEMP_MATRIX = new i
        }, {
            "./Point": 66
        }],
        65: [function(t, e, r) {
            function i(t, e, r, i) {
                this._x = r || 0, this._y = i || 0, this.cb = t, this.scope = e
            }
            i.prototype.constructor = i, e.exports = i, Object.defineProperties(i.prototype, {
                x: {
                    get: function() {
                        return this._x
                    },
                    set: function(t) {
                        this._x !== t && (this._x = t, this.cb.call(this.scope))
                    }
                },
                y: {
                    get: function() {
                        return this._y
                    },
                    set: function(t) {
                        this._y !== t && (this._y = t, this.cb.call(this.scope))
                    }
                }
            }), i.prototype.set = function(t, e) {
                var r = t || 0,
                    i = e || (0 !== e ? r : 0);
                this._x === r && this._y === i || (this._x = r, this._y = i, this.cb.call(this.scope))
            }, i.prototype.copy = function(t) {
                this._x === t.x && this._y === t.y || (this._x = t.x, this._y = t.y, this.cb.call(this.scope))
            }
        }, {}],
        66: [function(t, e, r) {
            function i(t, e) {
                this.x = t || 0, this.y = e || 0
            }
            i.prototype.constructor = i, e.exports = i, i.prototype.clone = function() {
                return new i(this.x, this.y)
            }, i.prototype.copy = function(t) {
                this.set(t.x, t.y)
            }, i.prototype.equals = function(t) {
                return t.x === this.x && t.y === this.y
            }, i.prototype.set = function(t, e) {
                this.x = t || 0, this.y = e || (0 !== e ? this.x : 0)
            }
        }, {}],
        67: [function(t, e, r) {
            e.exports = {
                Point: t("./Point"),
                ObservablePoint: t("./ObservablePoint"),
                Matrix: t("./Matrix"),
                GroupD8: t("./GroupD8"),
                Circle: t("./shapes/Circle"),
                Ellipse: t("./shapes/Ellipse"),
                Polygon: t("./shapes/Polygon"),
                Rectangle: t("./shapes/Rectangle"),
                RoundedRectangle: t("./shapes/RoundedRectangle")
            }
        }, {
            "./GroupD8": 63,
            "./Matrix": 64,
            "./ObservablePoint": 65,
            "./Point": 66,
            "./shapes/Circle": 68,
            "./shapes/Ellipse": 69,
            "./shapes/Polygon": 70,
            "./shapes/Rectangle": 71,
            "./shapes/RoundedRectangle": 72
        }],
        68: [function(t, e, r) {
            function i(t, e, r) {
                this.x = t || 0, this.y = e || 0, this.radius = r || 0, this.type = s.SHAPES.CIRC
            }
            var n = t("./Rectangle"),
                s = t("../../const");
            i.prototype.constructor = i, e.exports = i, i.prototype.clone = function() {
                return new i(this.x, this.y, this.radius)
            }, i.prototype.contains = function(t, e) {
                if (this.radius <= 0) return !1;
                var r = this.x - t,
                    i = this.y - e,
                    n = this.radius * this.radius;
                return r *= r, i *= i, r + i <= n
            }, i.prototype.getBounds = function() {
                return new n(this.x - this.radius, this.y - this.radius, 2 * this.radius, 2 * this.radius)
            }
        }, {
            "../../const": 43,
            "./Rectangle": 71
        }],
        69: [function(t, e, r) {
            function i(t, e, r, i) {
                this.x = t || 0, this.y = e || 0, this.width = r || 0, this.height = i || 0, this.type = s.SHAPES.ELIP
            }
            var n = t("./Rectangle"),
                s = t("../../const");
            i.prototype.constructor = i, e.exports = i, i.prototype.clone = function() {
                return new i(this.x, this.y, this.width, this.height)
            }, i.prototype.contains = function(t, e) {
                if (this.width <= 0 || this.height <= 0) return !1;
                var r = (t - this.x) / this.width,
                    i = (e - this.y) / this.height;
                return r *= r, i *= i, r + i <= 1
            }, i.prototype.getBounds = function() {
                return new n(this.x - this.width, this.y - this.height, this.width, this.height)
            }
        }, {
            "../../const": 43,
            "./Rectangle": 71
        }],
        70: [function(t, e, r) {
            function i(t) {
                var e = t;
                if (!Array.isArray(e)) {
                    e = new Array(arguments.length);
                    for (var r = 0; r < e.length; ++r) e[r] = arguments[r]
                }
                if (e[0] instanceof n) {
                    for (var i = [], o = 0, a = e.length; o < a; o++) i.push(e[o].x, e[o].y);
                    e = i
                }
                this.closed = !0, this.points = e, this.type = s.SHAPES.POLY
            }
            var n = t("../Point"),
                s = t("../../const");
            i.prototype.constructor = i, e.exports = i, i.prototype.clone = function() {
                return new i(this.points.slice())
            }, i.prototype.close = function() {
                var t = this.points;
                t[0] === t[t.length - 2] && t[1] === t[t.length - 1] || t.push(t[0], t[1])
            }, i.prototype.contains = function(t, e) {
                for (var r = !1, i = this.points.length / 2, n = 0, s = i - 1; n < i; s = n++) {
                    var o = this.points[2 * n],
                        a = this.points[2 * n + 1],
                        h = this.points[2 * s],
                        u = this.points[2 * s + 1],
                        l = a > e != u > e && t < (h - o) * (e - a) / (u - a) + o;
                    l && (r = !r)
                }
                return r
            }
        }, {
            "../../const": 43,
            "../Point": 66
        }],
        71: [function(t, e, r) {
            function i(t, e, r, i) {
                this.x = t || 0, this.y = e || 0, this.width = r || 0, this.height = i || 0, this.type = n.SHAPES.RECT
            }
            var n = t("../../const");
            i.prototype.constructor = i, e.exports = i, Object.defineProperties(i.prototype, {
                left: {
                    get: function() {
                        return this.x
                    }
                },
                right: {
                    get: function() {
                        return this.x + this.width
                    }
                },
                top: {
                    get: function() {
                        return this.y
                    }
                },
                bottom: {
                    get: function() {
                        return this.y + this.height
                    }
                }
            }), i.EMPTY = new i(0, 0, 0, 0), i.prototype.clone = function() {
                return new i(this.x, this.y, this.width, this.height)
            }, i.prototype.copy = function(t) {
                return this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height, this
            }, i.prototype.contains = function(t, e) {
                return !(this.width <= 0 || this.height <= 0) && (t >= this.x && t < this.x + this.width && e >= this.y && e < this.y + this.height)
            }, i.prototype.pad = function(t, e) {
                t = t || 0, e = e || (0 !== e ? t : 0), this.x -= t, this.y -= e, this.width += 2 * t, this.height += 2 * e
            }, i.prototype.fit = function(t) {
                this.x < t.x && (this.width += this.x, this.width < 0 && (this.width = 0), this.x = t.x), this.y < t.y && (this.height += this.y, this.height < 0 && (this.height = 0), this.y = t.y), this.x + this.width > t.x + t.width && (this.width = t.width - this.x, this.width < 0 && (this.width = 0)), this.y + this.height > t.y + t.height && (this.height = t.height - this.y, this.height < 0 && (this.height = 0))
            }, i.prototype.enlarge = function(t) {
                if (t !== i.EMPTY) {
                    var e = Math.min(this.x, t.x),
                        r = Math.max(this.x + this.width, t.x + t.width),
                        n = Math.min(this.y, t.y),
                        s = Math.max(this.y + this.height, t.y + t.height);
                    this.x = e, this.width = r - e, this.y = n, this.height = s - n
                }
            }
        }, {
            "../../const": 43
        }],
        72: [function(t, e, r) {
            function i(t, e, r, i, s) {
                this.x = t || 0, this.y = e || 0, this.width = r || 0, this.height = i || 0, this.radius = s || 20, this.type = n.SHAPES.RREC
            }
            var n = t("../../const");
            i.prototype.constructor = i, e.exports = i, i.prototype.clone = function() {
                return new i(this.x, this.y, this.width, this.height, this.radius)
            }, i.prototype.contains = function(t, e) {
                return !(this.width <= 0 || this.height <= 0) && (t >= this.x && t <= this.x + this.width && e >= this.y && e <= this.y + this.height)
            }
        }, {
            "../../const": 43
        }],
        73: [function(t, e, r) {
            function i(t, e, r, i) {
                if (u.call(this), n.sayHello(t), i)
                    for (var s in o.DEFAULT_RENDER_OPTIONS) "undefined" == typeof i[s] && (i[s] = o.DEFAULT_RENDER_OPTIONS[s]);
                else i = o.DEFAULT_RENDER_OPTIONS;
                this.type = o.RENDERER_TYPE.UNKNOWN, this.width = e || 800, this.height = r || 600, this.view = i.view || document.createElement("canvas"), this.resolution = i.resolution, this.transparent = i.transparent, this.autoResize = i.autoResize || !1, this.blendModes = null, this.preserveDrawingBuffer = i.preserveDrawingBuffer, this.clearBeforeRender = i.clearBeforeRender, this.roundPixels = i.roundPixels, this._backgroundColor = 0, this._backgroundColorRgba = [0, 0, 0, 0], this._backgroundColorString = "#000000", this.backgroundColor = i.backgroundColor || this._backgroundColor, this._tempDisplayObjectParent = new a, this._lastObjectRendered = this._tempDisplayObjectParent
            }
            var n = t("../utils"),
                s = t("../math"),
                o = t("../const"),
                a = t("../display/Container"),
                h = t("../textures/RenderTexture"),
                u = t("eventemitter3"),
                l = new s.Matrix;
            i.prototype = Object.create(u.prototype), i.prototype.constructor = i, e.exports = i, Object.defineProperties(i.prototype, {
                backgroundColor: {
                    get: function() {
                        return this._backgroundColor
                    },
                    set: function(t) {
                        this._backgroundColor = t, this._backgroundColorString = n.hex2string(t), n.hex2rgb(t, this._backgroundColorRgba)
                    }
                }
            }), i.prototype.resize = function(t, e) {
                this.width = t * this.resolution, this.height = e * this.resolution, this.view.width = this.width, this.view.height = this.height, this.autoResize && (this.view.style.width = this.width / this.resolution + "px", this.view.style.height = this.height / this.resolution + "px")
            }, i.prototype.generateTexture = function(t, e, r) {
                var i = t.getLocalBounds(),
                    n = h.create(0 | i.width, 0 | i.height, e, r);
                return l.tx = -i.x, l.ty = -i.y, this.render(t, n, !1, l, !0), n
            }, i.prototype.destroy = function(t) {
                t && this.view.parentNode && this.view.parentNode.removeChild(this.view), this.type = o.RENDERER_TYPE.UNKNOWN, this.width = 0, this.height = 0, this.view = null, this.resolution = 0, this.transparent = !1, this.autoResize = !1, this.blendModes = null, this.preserveDrawingBuffer = !1, this.clearBeforeRender = !1, this.roundPixels = !1, this._backgroundColor = 0, this._backgroundColorRgba = null, this._backgroundColorString = null, this.backgroundColor = 0, this._tempDisplayObjectParent = null, this._lastObjectRendered = null
            }
        }, {
            "../const": 43,
            "../display/Container": 45,
            "../math": 67,
            "../textures/RenderTexture": 108,
            "../utils": 116,
            eventemitter3: 3
        }],
        74: [function(t, e, r) {			//"../../renderers/canvas/CanvasRenderer": 74
            function i(t, e, r) {
                r = r || {}, n.call(this, "Canvas", t, e, r), this.type = u.RENDERER_TYPE.CANVAS, this.rootContext = this.view.getContext("2d", {
                    alpha: this.transparent
                }), this.rootResolution = this.resolution, this.refresh = !0, this.maskManager = new s(this), this.smoothProperty = "imageSmoothingEnabled", this.rootContext.imageSmoothingEnabled || (this.rootContext.webkitImageSmoothingEnabled ? this.smoothProperty = "webkitImageSmoothingEnabled" : this.rootContext.mozImageSmoothingEnabled ? this.smoothProperty = "mozImageSmoothingEnabled" : this.rootContext.oImageSmoothingEnabled ? this.smoothProperty = "oImageSmoothingEnabled" : this.rootContext.msImageSmoothingEnabled && (this.smoothProperty = "msImageSmoothingEnabled")), this.initPlugins(), this.blendModes = a(), this._activeBlendMode = null, this.context = null, this.renderingToScreen = !1, this.resize(t, e)
            }
            var n = t("../SystemRenderer"),
                s = t("./utils/CanvasMaskManager"),
                o = t("./utils/CanvasRenderTarget"),
                a = t("./utils/mapCanvasBlendModesToPixi"),
                h = t("../../utils"),
                u = t("../../const");
            i.prototype = Object.create(n.prototype), i.prototype.constructor = i, e.exports = i, h.pluginTarget.mixin(i), i.prototype.render = function(t, e, r, i, n) {
                if (this.view) {
                    this.renderingToScreen = !e, this.emit("prerender"), e ? (e = e.baseTexture || e, e._canvasRenderTarget || (e._canvasRenderTarget = new o(e.width, e.height, e.resolution), e.source = e._canvasRenderTarget.canvas, e.valid = !0), this.context = e._canvasRenderTarget.context, this.resolution = e._canvasRenderTarget.resolution) : (this.context = this.rootContext, this.resolution = this.rootResolution);
                    var s = this.context;
                    if (e || (this._lastObjectRendered = t), !n) {
                        var a = t.parent,
                            h = this._tempDisplayObjectParent.transform.worldTransform;
                        i ? i.copy(h) : h.identity(), t.parent = this._tempDisplayObjectParent, t.updateTransform(), t.parent = a
                    }
                    s.setTransform(1, 0, 0, 1, 0, 0), s.globalAlpha = 1, s.globalCompositeOperation = this.blendModes[u.BLEND_MODES.NORMAL], navigator.isCocoonJS && this.view.screencanvas && (s.fillStyle = "black", s.clear()), (void 0 !== r ? r : this.clearBeforeRender) && this.renderingToScreen && (this.transparent ? s.clearRect(0, 0, this.width, this.height) : (s.fillStyle = this._backgroundColorString, s.fillRect(0, 0, this.width, this.height)));
                    var l = this.context;
                    this.context = s, t.renderCanvas(this), this.context = l, this.emit("postrender")
                }
            }, i.prototype.setBlendMode = function(t) {
                this._activeBlendMode !== t && (this.context.globalCompositeOperation = this.blendModes[t])
            }, i.prototype.destroy = function(t) {
                this.destroyPlugins(), n.prototype.destroy.call(this, t), this.context = null, this.refresh = !0, this.maskManager.destroy(), this.maskManager = null, this.smoothProperty = null
            }, i.prototype.resize = function(t, e) {
                n.prototype.resize.call(this, t, e), this.smoothProperty && (this.rootContext[this.smoothProperty] = u.SCALE_MODES.DEFAULT === u.SCALE_MODES.LINEAR)
            }
        }, {
            "../../const": 43,
            "../../utils": 116,
            "../SystemRenderer": 73,
            "./utils/CanvasMaskManager": 75,
            "./utils/CanvasRenderTarget": 76,
            "./utils/mapCanvasBlendModesToPixi": 78
        }],
        75: [function(t, e, r) {
            function i(t) {
                this.renderer = t
            }
            var n = t("../../../const");
            i.prototype.constructor = i, e.exports = i, i.prototype.pushMask = function(t) {
                var e = this.renderer;
                e.context.save();
                var r = t.alpha,
                    i = t.transform.worldTransform,
                    n = e.resolution;
                e.context.setTransform(i.a * n, i.b * n, i.c * n, i.d * n, i.tx * n, i.ty * n), t._texture || (this.renderGraphicsShape(t), e.context.clip()), t.worldAlpha = r
            }, i.prototype.renderGraphicsShape = function(t) {
                var e = this.renderer.context,
                    r = t.graphicsData.length;
                if (0 !== r) {
                    e.beginPath();
                    for (var i = 0; i < r; i++) {
                        var s = t.graphicsData[i],
                            o = s.shape;
                        if (s.type === n.SHAPES.POLY) {
                            var a = o.points;
                            e.moveTo(a[0], a[1]);
                            for (var h = 1; h < a.length / 2; h++) e.lineTo(a[2 * h], a[2 * h + 1]);
                            a[0] === a[a.length - 2] && a[1] === a[a.length - 1] && e.closePath()
                        } else if (s.type === n.SHAPES.RECT) e.rect(o.x, o.y, o.width, o.height),
                            e.closePath();
                        else if (s.type === n.SHAPES.CIRC) e.arc(o.x, o.y, o.radius, 0, 2 * Math.PI), e.closePath();
                        else if (s.type === n.SHAPES.ELIP) {
                            var u = 2 * o.width,
                                l = 2 * o.height,
                                c = o.x - u / 2,
                                d = o.y - l / 2,
                                p = .5522848,
                                f = u / 2 * p,
                                v = l / 2 * p,
                                g = c + u,
                                y = d + l,
                                x = c + u / 2,
                                m = d + l / 2;
                            e.moveTo(c, m), e.bezierCurveTo(c, m - v, x - f, d, x, d), e.bezierCurveTo(x + f, d, g, m - v, g, m), e.bezierCurveTo(g, m + v, x + f, y, x, y), e.bezierCurveTo(x - f, y, c, m + v, c, m), e.closePath()
                        } else if (s.type === n.SHAPES.RREC) {
                            var _ = o.x,
                                b = o.y,
                                T = o.width,
                                E = o.height,
                                w = o.radius,
                                S = Math.min(T, E) / 2 | 0;
                            w = w > S ? S : w, e.moveTo(_, b + w), e.lineTo(_, b + E - w), e.quadraticCurveTo(_, b + E, _ + w, b + E), e.lineTo(_ + T - w, b + E), e.quadraticCurveTo(_ + T, b + E, _ + T, b + E - w), e.lineTo(_ + T, b + w), e.quadraticCurveTo(_ + T, b, _ + T - w, b), e.lineTo(_ + w, b), e.quadraticCurveTo(_, b, _, b + w), e.closePath()
                        }
                    }
                }
            }, i.prototype.popMask = function(t) {
                t.context.restore()
            }, i.prototype.destroy = function() {}
        }, {
            "../../../const": 43
        }],
        76: [function(t, e, r) {
            function i(t, e, r) {
                this.canvas = document.createElement("canvas"), this.context = this.canvas.getContext("2d"), this.resolution = r || n.RESOLUTION, this.resize(t, e)
            }
            var n = t("../../../const");
            i.prototype.constructor = i, e.exports = i, Object.defineProperties(i.prototype, {
                width: {
                    get: function() {
                        return this.canvas.width
                    },
                    set: function(t) {
                        this.canvas.width = t
                    }
                },
                height: {
                    get: function() {
                        return this.canvas.height
                    },
                    set: function(t) {
                        this.canvas.height = t
                    }
                }
            }), i.prototype.clear = function() {
                this.context.setTransform(1, 0, 0, 1, 0, 0), this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
            }, i.prototype.resize = function(t, e) {
                this.canvas.width = t * this.resolution, this.canvas.height = e * this.resolution
            }, i.prototype.destroy = function() {
                this.context = null, this.canvas = null
            }
        }, {
            "../../../const": 43
        }],
        77: [function(t, e, r) {		//"./canUseNewCanvasBlendModes": 77
            var i = function(t) {
                    var e = document.createElement("canvas");
                    e.width = 6, e.height = 1;
                    var r = e.getContext("2d");
                    return r.fillStyle = t, r.fillRect(0, 0, 6, 1), e
                },
                n = function() {
                    if ("undefined" == typeof document) return !1;
                    var t = i("#ff00ff"),
                        e = i("#ffff00"),
                        r = document.createElement("canvas");
                    r.width = 6, r.height = 1;
                    var n = r.getContext("2d");
                    n.globalCompositeOperation = "multiply", n.drawImage(t, 0, 0), n.drawImage(e, 2, 0);
                    var s = n.getImageData(2, 0, 1, 1);
                    if (!s) return !1;
                    var o = s.data;
                    return 255 === o[0] && 0 === o[1] && 0 === o[2]
                };
            e.exports = n
        }, {}],
        78: [function(t, e, r) {
            function i(t) {
                return t = t || [], s() ? (t[n.BLEND_MODES.NORMAL] = "source-over", t[n.BLEND_MODES.ADD] = "lighter", t[n.BLEND_MODES.MULTIPLY] = "multiply", t[n.BLEND_MODES.SCREEN] = "screen", t[n.BLEND_MODES.OVERLAY] = "overlay", t[n.BLEND_MODES.DARKEN] = "darken", t[n.BLEND_MODES.LIGHTEN] = "lighten", t[n.BLEND_MODES.COLOR_DODGE] = "color-dodge", t[n.BLEND_MODES.COLOR_BURN] = "color-burn", t[n.BLEND_MODES.HARD_LIGHT] = "hard-light", t[n.BLEND_MODES.SOFT_LIGHT] = "soft-light", t[n.BLEND_MODES.DIFFERENCE] = "difference", t[n.BLEND_MODES.EXCLUSION] = "exclusion", t[n.BLEND_MODES.HUE] = "hue", t[n.BLEND_MODES.SATURATION] = "saturate", t[n.BLEND_MODES.COLOR] = "color", t[n.BLEND_MODES.LUMINOSITY] = "luminosity") : (t[n.BLEND_MODES.NORMAL] = "source-over", t[n.BLEND_MODES.ADD] = "lighter", t[n.BLEND_MODES.MULTIPLY] = "source-over", t[n.BLEND_MODES.SCREEN] = "source-over", t[n.BLEND_MODES.OVERLAY] = "source-over", t[n.BLEND_MODES.DARKEN] = "source-over", t[n.BLEND_MODES.LIGHTEN] = "source-over", t[n.BLEND_MODES.COLOR_DODGE] = "source-over", t[n.BLEND_MODES.COLOR_BURN] = "source-over", t[n.BLEND_MODES.HARD_LIGHT] = "source-over", t[n.BLEND_MODES.SOFT_LIGHT] = "source-over", t[n.BLEND_MODES.DIFFERENCE] = "source-over", t[n.BLEND_MODES.EXCLUSION] = "source-over", t[n.BLEND_MODES.HUE] = "source-over", t[n.BLEND_MODES.SATURATION] = "source-over", t[n.BLEND_MODES.COLOR] = "source-over", t[n.BLEND_MODES.LUMINOSITY] = "source-over"), t
            }
            var n = t("../../../const"),
                s = t("./canUseNewCanvasBlendModes");
            e.exports = i
        }, {
            "../../../const": 43,
            "./canUseNewCanvasBlendModes": 77
        }],
        79: [function(t, e, r) {
            function i(t) {
                this.renderer = t, this.count = 0, this.checkCount = 0, this.maxIdle = 3600, this.checkCountMax = 600, this.mode = n.GC_MODES.DEFAULT
            }
            var n = t("../../const");
            i.prototype.constructor = i, e.exports = i, i.prototype.update = function() {
                this.count++, this.mode !== n.GC_MODES.MANUAL && (this.checkCount++, this.checkCount > this.checkCountMax && (this.checkCount = 0, this.run()))
            }, i.prototype.run = function() {
                var t, e, r = this.renderer.textureManager,
                    i = r._managedTextures,
                    n = !1;
                for (t = 0; t < i.length; t++) {
                    var s = i[t];
                    !s._glRenderTargets && this.count - s.touched > this.maxIdle && (r.destroyTexture(s, !0), i[t] = null, n = !0)
                }
                if (n) {
                    for (e = 0, t = 0; t < i.length; t++) null !== i[t] && (i[e++] = i[t]);
                    i.length = e
                }
            }, i.prototype.unload = function(t) {
                var e = this.renderer.textureManager;
                t._texture && e.destroyTexture(t._texture, !0);
                for (var r = t.children.length - 1; r >= 0; r--) this.unload(t.children[r])
            }
        }, {
            "../../const": 43
        }],
        80: [function(t, e, r) {
            var i = t("pixi-gl-core").GLTexture,
                n = t("../../const"),
                s = t("./utils/RenderTarget"),
                o = t("../../utils"),
                a = function(t) {
                    this.renderer = t, this.gl = t.gl, this._managedTextures = []
                };
            a.prototype.bindTexture = function() {}, a.prototype.getTexture = function() {}, a.prototype.updateTexture = function(t) {
                t = t.baseTexture || t;
                var e = !!t._glRenderTargets;
                if (t.hasLoaded) {
                    var r = t._glTextures[this.renderer.CONTEXT_UID];
                    if (r) e ? t._glRenderTargets[this.renderer.CONTEXT_UID].resize(t.width, t.height) : r.upload(t.source);
                    else {
                        if (e) {
                            var o = new s(this.gl, t.width, t.height, t.scaleMode, t.resolution);
                            o.resize(t.width, t.height), t._glRenderTargets[this.renderer.CONTEXT_UID] = o, r = o.texture
                        } else r = new i(this.gl), r.premultiplyAlpha = !0, r.upload(t.source);
                        t._glTextures[this.renderer.CONTEXT_UID] = r, t.on("update", this.updateTexture, this), t.on("dispose", this.destroyTexture, this), this._managedTextures.push(t), t.isPowerOfTwo ? (t.mipmap && r.enableMipmap(), t.wrapMode === n.WRAP_MODES.CLAMP ? r.enableWrapClamp() : t.wrapMode === n.WRAP_MODES.REPEAT ? r.enableWrapRepeat() : r.enableWrapMirrorRepeat()) : r.enableWrapClamp(), t.scaleMode === n.SCALE_MODES.NEAREST ? r.enableNearestScaling() : r.enableLinearScaling()
                    }
                    return r
                }
            }, a.prototype.destroyTexture = function(t, e) {
                if (t = t.baseTexture || t, t.hasLoaded && t._glTextures[this.renderer.CONTEXT_UID] && (t._glTextures[this.renderer.CONTEXT_UID].destroy(), t.off("update", this.updateTexture, this), t.off("dispose", this.destroyTexture, this), delete t._glTextures[this.renderer.CONTEXT_UID], !e)) {
                    var r = this._managedTextures.indexOf(t);
                    r !== -1 && o.removeItems(this._managedTextures, r, 1)
                }
            }, a.prototype.removeAll = function() {
                for (var t = 0; t < this._managedTextures.length; ++t) {
                    var e = this._managedTextures[t];
                    e._glTextures[this.renderer.CONTEXT_UID] && delete e._glTextures[this.renderer.CONTEXT_UID]
                }
            }, a.prototype.destroy = function() {
                for (var t = 0; t < this._managedTextures.length; ++t) {
                    var e = this._managedTextures[t];
                    this.destroyTexture(e, !0), e.off("update", this.updateTexture, this), e.off("dispose", this.destroyTexture, this)
                }
                this._managedTextures = null
            }, e.exports = a
        }, {
            "../../const": 43,
            "../../utils": 116,
            "./utils/RenderTarget": 93,
            "pixi-gl-core": 12
        }],
        81: [function(t, e, r) {
            function i(t, e, r) {
                r = r || {}, n.call(this, "WebGL", t, e, r), this.type = x.RENDERER_TYPE.WEBGL, this.handleContextLost = this.handleContextLost.bind(this), this.handleContextRestored = this.handleContextRestored.bind(this), this.view.addEventListener("webglcontextlost", this.handleContextLost, !1), this.view.addEventListener("webglcontextrestored", this.handleContextRestored, !1), this._contextOptions = {
                    alpha: this.transparent,
                    antialias: r.antialias,
                    premultipliedAlpha: this.transparent && "notMultiplied" !== this.transparent,
                    stencil: !0,
                    preserveDrawingBuffer: r.preserveDrawingBuffer
                }, this._backgroundColorRgba[3] = this.transparent ? 0 : 1, this.maskManager = new s(this), this.stencilManager = new o(this), this.emptyRenderer = new u(this), this.currentRenderer = this.emptyRenderer, this.initPlugins(), r.context && v(r.context), this.gl = r.context || p(this.view, this._contextOptions), this.CONTEXT_UID = m++, this.state = new d(this.gl), this.renderingToScreen = !0, this._initContext(), this.filterManager = new a(this), this.drawModes = f(this.gl), this._activeShader = null, this._activeRenderTarget = null, this._activeTextureLocation = 999, this._activeTexture = null, this.setBlendMode(0)
            }
            var n = t("../SystemRenderer"),
                s = t("./managers/MaskManager"),
                o = t("./managers/StencilManager"),
                a = t("./managers/FilterManager"),
                h = t("./utils/RenderTarget"),
                u = t("./utils/ObjectRenderer"),
                l = t("./TextureManager"),
                c = t("./TextureGarbageCollector"),
                d = t("./WebGLState"),
                p = t("pixi-gl-core").createContext,
                f = t("./utils/mapWebGLDrawModesToPixi"),
                v = t("./utils/validateContext"),
                g = t("../../utils"),
                y = t("pixi-gl-core"),
                x = t("../../const"),
                m = 0;
            i.prototype = Object.create(n.prototype), i.prototype.constructor = i, e.exports = i, g.pluginTarget.mixin(i), i.prototype._initContext = function() {
                var t = this.gl;
                this.textureManager = new l(this), this.textureGC = new c(this), this.state.resetToDefault(), this.rootRenderTarget = new h(t, this.width, this.height, null, this.resolution, (!0)), this.rootRenderTarget.clearColor = this._backgroundColorRgba, this.bindRenderTarget(this.rootRenderTarget), this.emit("context", t), this.resize(this.width, this.height)
            }, i.prototype.render = function(t, e, r, i, n) {
                if (this.renderingToScreen = !e, this.emit("prerender"), this.gl && !this.gl.isContextLost()) {
                    if (e || (this._lastObjectRendered = t), !n) {
                        var s = t.parent;
                        t.parent = this._tempDisplayObjectParent, t.updateTransform(), t.parent = s
                    }
                    this.bindRenderTexture(e, i), this.currentRenderer.start(), (void 0 !== r ? r : this.clearBeforeRender) && this._activeRenderTarget.clear(), t.renderWebGL(this), this.currentRenderer.flush(), this.textureGC.update(), this.emit("postrender")
                }
            }, i.prototype.setObjectRenderer = function(t) {
                this.currentRenderer !== t && (this.currentRenderer.stop(), this.currentRenderer = t, this.currentRenderer.start())
            }, i.prototype.flush = function() {
                this.setObjectRenderer(this.emptyRenderer)
            }, i.prototype.resize = function(t, e) {
                n.prototype.resize.call(this, t, e), this.rootRenderTarget.resize(t, e), this._activeRenderTarget === this.rootRenderTarget && (this.rootRenderTarget.activate(), this._activeShader && (this._activeShader.uniforms.projectionMatrix = this.rootRenderTarget.projectionMatrix.toArray(!0)))
            }, i.prototype.setBlendMode = function(t) {
                this.state.setBlendMode(t)
            }, i.prototype.clear = function(t) {
                this._activeRenderTarget.clear(t)
            }, i.prototype.setTransform = function(t) {
                this._activeRenderTarget.transform = t
            }, i.prototype.bindRenderTexture = function(t, e) {
                var r;
                if (t) {
                    var i = t.baseTexture,
                        n = this.gl;
                    i._glRenderTargets[this.CONTEXT_UID] ? (this._activeTextureLocation = i._id, n.activeTexture(n.TEXTURE0 + i._id), n.bindTexture(n.TEXTURE_2D, null)) : (this.textureManager.updateTexture(i), n.bindTexture(n.TEXTURE_2D, null)), r = i._glRenderTargets[this.CONTEXT_UID], r.setFrame(t.frame)
                } else r = this.rootRenderTarget;
                return r.transform = e, this.bindRenderTarget(r), this
            }, i.prototype.bindRenderTarget = function(t) {
                return t !== this._activeRenderTarget && (this._activeRenderTarget = t, t.activate(), this._activeShader && (this._activeShader.uniforms.projectionMatrix = t.projectionMatrix.toArray(!0)), this.stencilManager.setMaskStack(t.stencilMaskStack)), this
            }, i.prototype.bindShader = function(t) {
                return this._activeShader !== t && (this._activeShader = t, t.bind(), t.uniforms.projectionMatrix = this._activeRenderTarget.projectionMatrix.toArray(!0)), this
            }, i.prototype.bindTexture = function(t, e) {
                t = t.baseTexture || t;
                var r = this.gl;
                return e = e || 0, this._activeTextureLocation !== e && (this._activeTextureLocation = e, r.activeTexture(r.TEXTURE0 + e)), this._activeTexture = t, t._glTextures[this.CONTEXT_UID] ? (t.touched = this.textureGC.count, t._glTextures[this.CONTEXT_UID].bind()) : this.textureManager.updateTexture(t), this
            }, i.prototype.createVao = function() {
                return new y.VertexArrayObject(this.gl, this.state.attribState)
            }, i.prototype.reset = function() {
                return this.setObjectRenderer(this.emptyRenderer), this._activeShader = null, this._activeRenderTarget = this.rootRenderTarget, this._activeTextureLocation = 999, this._activeTexture = null, this.rootRenderTarget.activate(), this.state.resetToDefault(), this
            }, i.prototype.handleContextLost = function(t) {
                t.preventDefault()
            }, i.prototype.handleContextRestored = function() {
                this._initContext(), this.textureManager.removeAll()
            }, i.prototype.destroy = function(t) {
                this.destroyPlugins(), this.view.removeEventListener("webglcontextlost", this.handleContextLost), this.view.removeEventListener("webglcontextrestored", this.handleContextRestored), this.textureManager.destroy(), n.prototype.destroy.call(this, t), this.uid = 0, this.maskManager.destroy(), this.stencilManager.destroy(), this.filterManager.destroy(), this.maskManager = null, this.filterManager = null, this.textureManager = null, this.currentRenderer = null, this.handleContextLost = null, this.handleContextRestored = null, this._contextOptions = null, this.gl.useProgram(null), this.gl.getExtension("WEBGL_lose_context") && this.gl.getExtension("WEBGL_lose_context").loseContext(), this.gl = null
            }
        }, {
            "../../const": 43,
            "../../utils": 116,
            "../SystemRenderer": 73,
            "./TextureGarbageCollector": 79,
            "./TextureManager": 80,
            "./WebGLState": 82,
            "./managers/FilterManager": 87,
            "./managers/MaskManager": 88,
            "./managers/StencilManager": 89,
            "./utils/ObjectRenderer": 91,
            "./utils/RenderTarget": 93,
            "./utils/mapWebGLDrawModesToPixi": 96,
            "./utils/validateContext": 97,
            "pixi-gl-core": 12
        }],
        82: [function(t, e, r) {
            function i(t) {
                this.activeState = new Uint8Array(16), this.defaultState = new Uint8Array(16), this.defaultState[0] = 1, this.stackIndex = 0, this.stack = [], this.gl = t, this.maxAttribs = t.getParameter(t.MAX_VERTEX_ATTRIBS), this.attribState = {
                    tempAttribState: new Array(this.maxAttribs),
                    attribState: new Array(this.maxAttribs)
                }, this.blendModes = n(t), this.nativeVaoExtension = t.getExtension("OES_vertex_array_object") || t.getExtension("MOZ_OES_vertex_array_object") || t.getExtension("WEBKIT_OES_vertex_array_object")
            }
            var n = t("./utils/mapWebGLBlendModesToPixi");
            i.prototype.push = function() {
                var t = this.stack[++this.stackIndex];
                t || (t = this.stack[this.stackIndex] = new Uint8Array(16));
                for (var e = 0; e < this.activeState.length; e++) this.activeState[e] = t[e]
            };
            var s = 0,
                o = 1,
                a = 2,
                h = 3,
                u = 4;
            i.prototype.pop = function() {
                var t = this.stack[--this.stackIndex];
                this.setState(t)
            }, i.prototype.setState = function(t) {
                this.setBlend(t[s]), this.setDepthTest(t[o]), this.setFrontFace(t[a]), this.setCullFace(t[h]), this.setBlendMode(t[u])
            }, i.prototype.setBlend = function(t) {
                if (!(this.activeState[s] === t | 0)) {
                    this.activeState[s] = 0 | t;
                    var e = this.gl;
                    t ? e.enable(e.BLEND) : e.disable(e.BLEND)
                }
            }, i.prototype.setBlendMode = function(t) {
                t !== this.activeState[u] && (this.activeState[u] = t, this.gl.blendFunc(this.blendModes[t][0], this.blendModes[t][1]))
            }, i.prototype.setDepthTest = function(t) {
                if (!(this.activeState[o] === t | 0)) {
                    this.activeState[o] = 0 | t;
                    var e = this.gl;
                    t ? e.enable(e.DEPTH_TEST) : e.disable(e.DEPTH_TEST)
                }
            }, i.prototype.setCullFace = function(t) {
                if (!(this.activeState[h] === t | 0)) {
                    this.activeState[h] = 0 | t;
                    var e = this.gl;
                    t ? e.enable(e.CULL_FACE) : e.disable(e.CULL_FACE)
                }
            }, i.prototype.setFrontFace = function(t) {
                if (!(this.activeState[a] === t | 0)) {
                    this.activeState[a] = 0 | t;
                    var e = this.gl;
                    t ? e.frontFace(e.CW) : e.frontFace(e.CCW)
                }
            }, i.prototype.resetAttributes = function() {
                var t;
                for (t = 0; t < this.attribState.tempAttribState.length; t++) this.attribState.tempAttribState[t] = 0;
                for (t = 0; t < this.attribState.attribState.length; t++) this.attribState.attribState[t] = 0;
                var e = this.gl;
                for (t = 1; t < this.maxAttribs; t++) e.disableVertexAttribArray(t)
            }, i.prototype.resetToDefault = function() {
                this.nativeVaoExtension && this.nativeVaoExtension.bindVertexArrayOES(null), this.resetAttributes();
                for (var t = 0; t < this.activeState.length; t++) this.activeState[t] = 32;
                var e = this.gl;
                e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !1), this.setState(this.defaultState)
            }, e.exports = i
        }, {
            "./utils/mapWebGLBlendModesToPixi": 95
        }],
        83: [function(t, e, r) {			//"../Filter": 83
            function i(t, e, r) {
                this.vertexSrc = t || i.defaultVertexSrc, this.fragmentSrc = e || i.defaultFragmentSrc, this.blendMode = o.BLEND_MODES.NORMAL, this.uniformData = r || n(this.vertexSrc, this.fragmentSrc, "projectionMatrix|uSampler"), this.uniforms = {};
                for (var h in this.uniformData) this.uniforms[h] = this.uniformData[h].value;
                this.glShaders = [], a[this.vertexSrc + this.fragmentSrc] || (a[this.vertexSrc + this.fragmentSrc] = s.uid()), this.glShaderKey = a[this.vertexSrc + this.fragmentSrc], this.padding = 4, this.resolution = 1, this.enabled = !0
            }
            var n = t("./extractUniformsFromSrc"),
                s = t("../../../utils"),
                o = t("../../../const"),
                a = {};
            e.exports = i, i.prototype.apply = function(t, e, r, i) {
                t.applyFilter(this, e, r, i)
            }, i.defaultVertexSrc = ["attribute vec2 aVertexPosition;", "attribute vec2 aTextureCoord;", "uniform mat3 projectionMatrix;", "uniform mat3 filterMatrix;", "varying vec2 vTextureCoord;", "varying vec2 vFilterCoord;", "void main(void){", "   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);", "   vFilterCoord = ( filterMatrix * vec3( aTextureCoord, 1.0)  ).xy;", "   vTextureCoord = aTextureCoord ;", "}"].join("\n"), i.defaultFragmentSrc = ["varying vec2 vTextureCoord;", "varying vec2 vFilterCoord;", "uniform sampler2D uSampler;", "uniform sampler2D filterSampler;", "void main(void){", "   vec4 masky = texture2D(filterSampler, vFilterCoord);", "   vec4 sample = texture2D(uSampler, vTextureCoord);", "   vec4 color;", "   if(mod(vFilterCoord.x, 1.0) > 0.5)", "   {", "     color = vec4(1.0, 0.0, 0.0, 1.0);", "   }", "   else", "   {", "     color = vec4(0.0, 1.0, 0.0, 1.0);", "   }", "   gl_FragColor = mix(sample, masky, 0.5);", "   gl_FragColor *= sample.a;", "}"].join("\n")
        }, {
            "../../../const": 43,
            "../../../utils": 116,
            "./extractUniformsFromSrc": 84
        }],
        84: [function(t, e, r) {
            function i(t, e, r) {
                var i = n(t, r),
                    s = n(e, r);
                return Object.assign(i, s)
            }

            function n(t) {
                for (var e, r = new RegExp("^(projectionMatrix|uSampler|filterArea)$"), i = {}, n = t.replace(/\s+/g, " ").split(/\s*;\s*/), o = 0; o < n.length; o++) {
                    var a = n[o].trim();
                    if (a.indexOf("uniform") > -1) {
                        var h = a.split(" "),
                            u = h[1],
                            l = h[2],
                            c = 1;
                        l.indexOf("[") > -1 && (e = l.split(/\[|\]/), l = e[0], c *= Number(e[1])), l.match(r) || (i[l] = {
                            value: s(u, c),
                            name: l,
                            type: u
                        })
                    }
                }
                return i
            }
            var s = t("pixi-gl-core").shader.defaultValue;
            e.exports = i
        }, {
            "pixi-gl-core": 12
        }],
        85: [function(t, e, r) {
            var i = t("../../../math"),
                n = function(t, e, r) {
                    var i = t.identity();
                    return i.translate(e.x / r.width, e.y / r.height), i.scale(r.width, r.height), i
                },
                s = function(t, e, r) {
                    var i = t.identity();
                    i.translate(e.x / r.width, e.y / r.height);
                    var n = r.width / e.width,
                        s = r.height / e.height;
                    return i.scale(n, s), i
                },
                o = function(t, e, r, n) {
                    var s = n.worldTransform.copy(i.Matrix.TEMP_MATRIX),
                        o = n._texture.baseTexture,
                        a = t.identity(),
                        h = r.height / r.width;
                    a.translate(e.x / r.width, e.y / r.height), a.scale(1, h);
                    var u = r.width / o.width,
                        l = r.height / o.height;
                    return s.tx /= o.width * u, s.ty /= o.width * u, s.invert(), a.prepend(s), a.scale(1, 1 / h), a.scale(u, l), a.translate(n.anchor.x, n.anchor.y), a
                };
            e.exports = {
                calculateScreenSpaceMatrix: n,
                calculateNormalizedScreenSpaceMatrix: s,
                calculateSpriteMatrix: o
            }
        }, {
            "../../../math": 67
        }],
        86: [function(t, e, r) {
            function i(t) {
                var e = new s.Matrix;
                n.call(this, "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 otherMatrix;\n\nvarying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n}\n", "#define GLSLIFY 1\nvarying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float alpha;\nuniform sampler2D mask;\n\nvoid main(void)\n{\n    // check clip! this will stop the mask bleeding out from the edges\n    vec2 text = abs( vMaskCoord - 0.5 );\n    text = step(0.5, text);\n    float clip = 1.0 - max(text.y, text.x);\n    vec4 original = texture2D(uSampler, vTextureCoord);\n    vec4 masky = texture2D(mask, vMaskCoord);\n    original *= (masky.r * masky.a * alpha * clip);\n    gl_FragColor = original;\n}\n"), t.renderable = !1, this.maskSprite = t, this.maskMatrix = e
            }
            var n = t("../Filter"),
                s = t("../../../../math");
            i.prototype = Object.create(n.prototype), i.prototype.constructor = i, e.exports = i, i.prototype.apply = function(t, e, r) {
                var i = this.maskSprite;
                this.uniforms.mask = i._texture, this.uniforms.otherMatrix = t.calculateSpriteMatrix(this.maskMatrix, i), this.uniforms.alpha = i.worldAlpha, t.applyFilter(this, e, r)
            }
        }, {
            "../../../../math": 67,
            "../Filter": 83
        }],
        87: [function(t, e, r) {
            function i(t) {
                n.call(this, t), this.gl = this.renderer.gl, this.quad = new o(this.gl, t.state.attribState), this.shaderCache = {}, this.pool = {}, this.filterData = null
            }
            var n = t("./WebGLManager"),
                s = t("../utils/RenderTarget"),
                o = t("../utils/Quad"),
                a = t("../../../math"),
                h = t("../../../Shader"),
                u = t("../filters/filterTransforms"),
                l = t("bit-twiddle"),
                c = function() {
                    this.renderTarget = null, this.sourceFrame = new a.Rectangle, this.destinationFrame = new a.Rectangle, this.filters = [], this.target = null, this.resolution = 1
                };
            i.prototype = Object.create(n.prototype), i.prototype.constructor = i, e.exports = i, i.prototype.pushFilter = function(t, e) {
                var r = this.renderer,
                    i = this.filterData;
                if (!i) {
                    i = this.renderer._activeRenderTarget.filterStack;
                    var n = new c;
                    n.sourceFrame = n.destinationFrame = this.renderer._activeRenderTarget.size, n.renderTarget = r._activeRenderTarget, this.renderer._activeRenderTarget.filterData = i = {
                        index: 0,
                        stack: [n]
                    }, this.filterData = i
                }
                var s = i.stack[++i.index];
                s || (s = i.stack[i.index] = new c);
                var o = e[0].resolution,
                    a = e[0].padding,
                    h = t.filterArea || t.getBounds(!0),
                    u = s.sourceFrame,
                    l = s.destinationFrame;
                u.x = (h.x * o | 0) / o, u.y = (h.y * o | 0) / o, u.width = (h.width * o | 0) / o, u.height = (h.height * o | 0) / o, i.stack[0].renderTarget.transform || u.fit(i.stack[0].destinationFrame), u.pad(a), l.width = u.width, l.height = u.height;
                var d = this.getPotRenderTarget(r.gl, u.width, u.height, o);
                s.target = t, s.filters = e, s.resolution = o, s.renderTarget = d, d.setFrame(l, u), r.bindRenderTarget(d), r.clear()
            }, i.prototype.popFilter = function() {
                var t = this.filterData,
                    e = t.stack[t.index - 1],
                    r = t.stack[t.index];
                this.quad.map(r.renderTarget.size, r.sourceFrame).upload();
                var i = r.filters;
                if (1 === i.length) i[0].apply(this, r.renderTarget, e.renderTarget, !1), this.freePotRenderTarget(r.renderTarget);
                else {
                    var n = r.renderTarget,
                        s = this.getPotRenderTarget(this.renderer.gl, r.sourceFrame.width, r.sourceFrame.height, 1);
                    s.setFrame(r.destinationFrame, r.sourceFrame);
                    for (var o = 0; o < i.length - 1; o++) {
                        i[o].apply(this, n, s, !0);
                        var a = n;
                        n = s, s = a
                    }
                    i[o].apply(this, n, e.renderTarget, !1), this.freePotRenderTarget(n), this.freePotRenderTarget(s)
                }
                t.index--, 0 === t.index && (this.filterData = null)
            }, i.prototype.applyFilter = function(t, e, r, i) {
                var n = this.renderer,
                    s = t.glShaders[n.CONTEXT_UID];
                if (s || (t.glShaderKey ? (s = this.shaderCache[t.glShaderKey], s || (s = t.glShaders[n.CONTEXT_UID] = this.shaderCache[t.glShaderKey] = new h(this.gl, t.vertexSrc, t.fragmentSrc))) : s = t.glShaders[n.CONTEXT_UID] = new h(this.gl, t.vertexSrc, t.fragmentSrc), this.quad.initVao(s)), n.bindRenderTarget(r), i) {
                    var o = n.gl;
                    o.disable(o.SCISSOR_TEST), n.clear(), o.enable(o.SCISSOR_TEST)
                }
                r === n.maskManager.scissorRenderTarget && n.maskManager.pushScissorMask(null, n.maskManager.scissorData), n.bindShader(s), this.syncUniforms(s, t), e.texture.bind(0), n._activeTextureLocation = 0, n.state.setBlendMode(t.blendMode), this.quad.draw()
            }, i.prototype.syncUniforms = function(t, e) {
                var r, i = e.uniformData,
                    n = e.uniforms,
                    s = 1;
                if (t.uniforms.data.filterArea) {
                    r = this.filterData.stack[this.filterData.index];
                    var o = t.uniforms.filterArea;
                    o[0] = r.renderTarget.size.width, o[1] = r.renderTarget.size.height, o[2] = r.sourceFrame.x, o[3] = r.sourceFrame.y, t.uniforms.filterArea = o
                }
                if (t.uniforms.data.filterClamp) {
                    r = this.filterData.stack[this.filterData.index];
                    var a = t.uniforms.filterClamp;
                    a[0] = .5 / r.renderTarget.size.width, a[1] = .5 / r.renderTarget.size.height, a[2] = (r.sourceFrame.width - .5) / r.renderTarget.size.width, a[3] = (r.sourceFrame.height - .5) / r.renderTarget.size.height, t.uniforms.filterClamp = a
                }
                var h;
                for (var u in i)
                    if ("sampler2D" === i[u].type) {
                        if (t.uniforms[u] = s, n[u].baseTexture) this.renderer.bindTexture(n[u].baseTexture, s);
                        else {
                            var l = this.renderer.gl;
                            this.renderer._activeTextureLocation = l.TEXTURE0 + s, l.activeTexture(l.TEXTURE0 + s), n[u].texture.bind()
                        }
                        s++
                    } else "mat3" === i[u].type ? void 0 !== n[u].a ? t.uniforms[u] = n[u].toArray(!0) : t.uniforms[u] = n[u] : "vec2" === i[u].type ? void 0 !== n[u].x ? (h = t.uniforms[u] || new Float32Array(2), h[0] = n[u].x, h[1] = n[u].y, t.uniforms[u] = h) : t.uniforms[u] = n[u] : "float" === i[u].type ? t.uniforms.data[u].value !== i[u] && (t.uniforms[u] = n[u]) : t.uniforms[u] = n[u]
            }, i.prototype.getRenderTarget = function(t, e) {
                var r = this.filterData.stack[this.filterData.index],
                    i = this.getPotRenderTarget(this.renderer.gl, r.sourceFrame.width, r.sourceFrame.height, e || r.resolution);
                return i.setFrame(r.destinationFrame, r.sourceFrame), i
            }, i.prototype.returnRenderTarget = function(t) {
                return this.freePotRenderTarget(t)
            }, i.prototype.calculateScreenSpaceMatrix = function(t) {
                var e = this.filterData.stack[this.filterData.index];
                return u.calculateScreenSpaceMatrix(t, e.sourceFrame, e.renderTarget.size)
            }, i.prototype.calculateNormalizedScreenSpaceMatrix = function(t) {
                var e = this.filterData.stack[this.filterData.index];
                return u.calculateNormalizedScreenSpaceMatrix(t, e.sourceFrame, e.renderTarget.size, e.destinationFrame)
            }, i.prototype.calculateSpriteMatrix = function(t, e) {
                var r = this.filterData.stack[this.filterData.index];
                return u.calculateSpriteMatrix(t, r.sourceFrame, r.renderTarget.size, e)
            }, i.prototype.destroy = function() {
                this.shaderCache = [], this.emptyPool()
            }, i.prototype.getPotRenderTarget = function(t, e, r, i) {
                e = l.nextPow2(e * i), r = l.nextPow2(r * i);
                var n = (65535 & e) << 16 | 65535 & r;
                this.pool[n] || (this.pool[n] = []);
                var o = this.pool[n].pop() || new s(t, e, r, null, 1);
                return o.resolution = i, o.defaultFrame.width = o.size.width = e / i, o.defaultFrame.height = o.size.height = r / i, o
            }, i.prototype.emptyPool = function() {
                for (var t in this.pool) {
                    var e = this.pool[t];
                    if (e)
                        for (var r = 0; r < e.length; r++) e[r].destroy(!0)
                }
                this.pool = {}
            }, i.prototype.freePotRenderTarget = function(t) {
                var e = t.size.width * t.resolution,
                    r = t.size.height * t.resolution,
                    i = (65535 & e) << 16 | 65535 & r;
                this.pool[i].push(t)
            }
        }, {
            "../../../Shader": 42,
            "../../../math": 67,
            "../filters/filterTransforms": 85,
            "../utils/Quad": 92,
            "../utils/RenderTarget": 93,
            "./WebGLManager": 90,
            "bit-twiddle": 1
        }],
        88: [function(t, e, r) {
            function i(t) {
                n.call(this, t), this.scissor = !1, this.scissorData = null, this.scissorRenderTarget = null, this.enableScissor = !0, this.alphaMaskPool = [], this.alphaMaskIndex = 0
            }
            var n = t("./WebGLManager"),
                s = t("../filters/spriteMask/SpriteMaskFilter");
            i.prototype = Object.create(n.prototype), i.prototype.constructor = i, e.exports = i, i.prototype.pushMask = function(t, e) {
                if (e.texture) this.pushSpriteMask(t, e);
                else if (this.enableScissor && !this.scissor && !this.renderer.stencilManager.stencilMaskStack.length && e.isFastRect()) {
                    var r = e.worldTransform,
                        i = Math.atan2(r.b, r.a);
                    i = Math.round(i * (180 / Math.PI)), i % 90 ? this.pushStencilMask(e) : this.pushScissorMask(t, e)
                } else this.pushStencilMask(e)
            }, i.prototype.popMask = function(t, e) {
                e.texture ? this.popSpriteMask(t, e) : this.enableScissor && !this.renderer.stencilManager.stencilMaskStack.length ? this.popScissorMask(t, e) : this.popStencilMask(t, e)
            }, i.prototype.pushSpriteMask = function(t, e) {
                var r = this.alphaMaskPool[this.alphaMaskIndex];
                r || (r = this.alphaMaskPool[this.alphaMaskIndex] = [new s(e)]), r[0].resolution = this.renderer.resolution, r[0].maskSprite = e, t.filterArea = e.getBounds(!0), this.renderer.filterManager.pushFilter(t, r), this.alphaMaskIndex++
            }, i.prototype.popSpriteMask = function() {
                this.renderer.filterManager.popFilter(), this.alphaMaskIndex--
            }, i.prototype.pushStencilMask = function(t) {
                this.renderer.currentRenderer.stop(), this.renderer.stencilManager.pushStencil(t)
            }, i.prototype.popStencilMask = function() {
                this.renderer.currentRenderer.stop(), this.renderer.stencilManager.popStencil()
            }, i.prototype.pushScissorMask = function(t, e) {
                e.renderable = !0;
                var r = this.renderer._activeRenderTarget,
                    i = e.getBounds();
                i.fit(r.size), e.renderable = !1, this.renderer.gl.enable(this.renderer.gl.SCISSOR_TEST);
                var n = this.renderer.resolution;
                this.renderer.gl.scissor(i.x * n, (r.root ? r.size.height - i.y - i.height : i.y) * n, i.width * n, i.height * n), this.scissorRenderTarget = r, this.scissorData = e, this.scissor = !0
            }, i.prototype.popScissorMask = function() {
                this.scissorRenderTarget = null, this.scissorData = null, this.scissor = !1;
                var t = this.renderer.gl;
                t.disable(t.SCISSOR_TEST)
            }
        }, {
            "../filters/spriteMask/SpriteMaskFilter": 86,
            "./WebGLManager": 90
        }],
        89: [function(t, e, r) {
            function i(t) {
                n.call(this, t), this.stencilMaskStack = null
            }
            var n = t("./WebGLManager");
            i.prototype = Object.create(n.prototype), i.prototype.constructor = i, e.exports = i, i.prototype.setMaskStack = function(t) {
                this.stencilMaskStack = t;
                var e = this.renderer.gl;
                0 === t.length ? e.disable(e.STENCIL_TEST) : e.enable(e.STENCIL_TEST)
            }, i.prototype.pushStencil = function(t) {
                this.renderer.setObjectRenderer(this.renderer.plugins.graphics), this.renderer._activeRenderTarget.attachStencilBuffer();
                var e = this.renderer.gl,
                    r = this.stencilMaskStack;
                0 === r.length && (e.enable(e.STENCIL_TEST), e.clear(e.STENCIL_BUFFER_BIT), e.stencilFunc(e.ALWAYS, 1, 1)), r.push(t), e.colorMask(!1, !1, !1, !1), e.stencilOp(e.KEEP, e.KEEP, e.INCR), this.renderer.plugins.graphics.render(t), e.colorMask(!0, !0, !0, !0), e.stencilFunc(e.NOTEQUAL, 0, r.length), e.stencilOp(e.KEEP, e.KEEP, e.KEEP)
            }, i.prototype.popStencil = function() {
                this.renderer.setObjectRenderer(this.renderer.plugins.graphics);
                var t = this.renderer.gl,
                    e = this.stencilMaskStack,
                    r = e.pop();
                0 === e.length ? t.disable(t.STENCIL_TEST) : (t.colorMask(!1, !1, !1, !1), t.stencilOp(t.KEEP, t.KEEP, t.DECR), this.renderer.plugins.graphics.render(r), t.colorMask(!0, !0, !0, !0), t.stencilFunc(t.NOTEQUAL, 0, e.length), t.stencilOp(t.KEEP, t.KEEP, t.KEEP))
            }, i.prototype.destroy = function() {
                n.prototype.destroy.call(this), this.stencilMaskStack.stencilStack = null
            }
        }, {
            "./WebGLManager": 90
        }],
        90: [function(t, e, r) {
            function i(t) {
                this.renderer = t, this.renderer.on("context", this.onContextChange, this)
            }
            i.prototype.constructor = i, e.exports = i, i.prototype.onContextChange = function() {}, i.prototype.destroy = function() {
                this.renderer.off("context", this.onContextChange, this), this.renderer = null
            }
        }, {}],
        91: [function(t, e, r) {
            function i(t) {
                n.call(this, t)
            }
            var n = t("../managers/WebGLManager");
            i.prototype = Object.create(n.prototype), i.prototype.constructor = i, e.exports = i, i.prototype.start = function() {}, i.prototype.stop = function() {
                this.flush()
            }, i.prototype.flush = function() {}, i.prototype.render = function(t) {}
        }, {
            "../managers/WebGLManager": 90
        }],
        92: [function(t, e, r) {		//
            function i(t, e) {
                this.gl = t, this.vertices = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), this.uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), this.interleaved = new Float32Array(16);
                for (var r = 0; r < 4; r++) this.interleaved[4 * r] = this.vertices[2 * r], this.interleaved[4 * r + 1] = this.vertices[2 * r + 1], this.interleaved[4 * r + 2] = this.uvs[2 * r], this.interleaved[4 * r + 3] = this.uvs[2 * r + 1];
                this.indices = s(1), this.vertexBuffer = n.GLBuffer.createVertexBuffer(t, this.interleaved, t.STATIC_DRAW), this.indexBuffer = n.GLBuffer.createIndexBuffer(t, this.indices, t.STATIC_DRAW), this.vao = new n.VertexArrayObject(t, e)
            }
            var n = t("pixi-gl-core"),
                s = t("../../../utils/createIndicesForQuads");
            i.prototype.constructor = i, i.prototype.initVao = function(t) {
                this.vao.clear().addIndex(this.indexBuffer).addAttribute(this.vertexBuffer, t.attributes.aVertexPosition, this.gl.FLOAT, !1, 16, 0).addAttribute(this.vertexBuffer, t.attributes.aTextureCoord, this.gl.FLOAT, !1, 16, 8)
            }, i.prototype.map = function(t, e) {
                var r = 0,
                    i = 0;
                return this.uvs[0] = r, this.uvs[1] = i, this.uvs[2] = r + e.width / t.width, this.uvs[3] = i, this.uvs[4] = r + e.width / t.width, this.uvs[5] = i + e.height / t.height, this.uvs[6] = r, this.uvs[7] = i + e.height / t.height, r = e.x, i = e.y, this.vertices[0] = r, this.vertices[1] = i, this.vertices[2] = r + e.width, this.vertices[3] = i, this.vertices[4] = r + e.width, this.vertices[5] = i + e.height, this.vertices[6] = r, this.vertices[7] = i + e.height, this
            }, i.prototype.draw = function() {
                return this.vao.bind().draw(this.gl.TRIANGLES, 6, 0).unbind(), this
            }, i.prototype.upload = function() {
                for (var t = 0; t < 4; t++) this.interleaved[4 * t] = this.vertices[2 * t], this.interleaved[4 * t + 1] = this.vertices[2 * t + 1], this.interleaved[4 * t + 2] = this.uvs[2 * t], this.interleaved[4 * t + 3] = this.uvs[2 * t + 1];
                return this.vertexBuffer.upload(this.interleaved), this
            }, i.prototype.destroy = function() {
                var t = this.gl;
                t.deleteBuffer(this.vertexBuffer), t.deleteBuffer(this.indexBuffer)
            }, e.exports = i
        }, {
            "../../../utils/createIndicesForQuads": 114,
            "pixi-gl-core": 12
        }],
        93: [function(t, e, r) {			//"./utils/RenderTarget": 93
            var i = t("../../../math"),
                n = t("../../../const"),
                s = t("pixi-gl-core").GLFramebuffer,
                o = function(t, e, r, o, a, h) {
                    this.gl = t, this.frameBuffer = null, this.texture = null, this.clearColor = [0, 0, 0, 0], this.size = new i.Rectangle(0, 0, 1, 1), this.resolution = a || n.RESOLUTION, this.projectionMatrix = new i.Matrix, this.transform = null, this.frame = null, this.defaultFrame = new i.Rectangle, this.destinationFrame = null, this.sourceFrame = null, this.stencilBuffer = null, this.stencilMaskStack = [], this.filterData = null, this.scaleMode = o || n.SCALE_MODES.DEFAULT, this.root = h, this.root ? (this.frameBuffer = new s(t, 100, 100), this.frameBuffer.framebuffer = null) : (this.frameBuffer = s.createRGBA(t, 100, 100), this.scaleMode === n.SCALE_MODES.NEAREST ? this.frameBuffer.texture.enableNearestScaling() : this.frameBuffer.texture.enableLinearScaling(),
                        this.texture = this.frameBuffer.texture), this.setFrame(), this.resize(e, r)
                };
            o.prototype.constructor = o, e.exports = o, o.prototype.clear = function(t) {
                var e = t || this.clearColor;
                this.frameBuffer.clear(e[0], e[1], e[2], e[3])
            }, o.prototype.attachStencilBuffer = function() {
                this.root || this.frameBuffer.enableStencil()
            }, o.prototype.setFrame = function(t, e) {
                this.destinationFrame = t || this.destinationFrame || this.defaultFrame, this.sourceFrame = e || this.sourceFrame || t
            }, o.prototype.activate = function() {
                var t = this.gl;
                this.frameBuffer.bind(), this.calculateProjection(this.destinationFrame, this.sourceFrame), this.transform && this.projectionMatrix.append(this.transform), this.destinationFrame !== this.sourceFrame ? (t.enable(t.SCISSOR_TEST), t.scissor(0 | this.destinationFrame.x, 0 | this.destinationFrame.y, this.destinationFrame.width * this.resolution | 0, this.destinationFrame.height * this.resolution | 0)) : t.disable(t.SCISSOR_TEST), t.viewport(0 | this.destinationFrame.x, 0 | this.destinationFrame.y, this.destinationFrame.width * this.resolution | 0, this.destinationFrame.height * this.resolution | 0)
            }, o.prototype.calculateProjection = function(t, e) {
                var r = this.projectionMatrix;
                e = e || t, r.identity(), this.root ? (r.a = 1 / t.width * 2, r.d = -1 / t.height * 2, r.tx = -1 - e.x * r.a, r.ty = 1 - e.y * r.d) : (r.a = 1 / t.width * 2, r.d = 1 / t.height * 2, r.tx = -1 - e.x * r.a, r.ty = -1 - e.y * r.d)
            }, o.prototype.resize = function(t, e) {
                if (t = 0 | t, e = 0 | e, this.size.width !== t || this.size.height !== e) {
                    this.size.width = t, this.size.height = e, this.defaultFrame.width = t, this.defaultFrame.height = e, this.frameBuffer.resize(t * this.resolution, e * this.resolution);
                    var r = this.frame || this.size;
                    this.calculateProjection(r)
                }
            }, o.prototype.destroy = function() {
                this.frameBuffer.destroy(), this.frameBuffer = null, this.texture = null
            }
        }, {
            "../../../const": 43,
            "../../../math": 67,
            "pixi-gl-core": 12
        }],
        94: [function(t, e, r) {
            function i(t) {
                for (var e = "", r = 0; r < t; r++) r > 0 && (e += "\nelse "), r < t - 1 && (e += "if(test == " + r + ".0){}");
                return e
            }
            var n = t("pixi-gl-core"),
                s = ["precision mediump float;", "void main(void){", "float test = 0.1;", "%forloop%", "gl_FragColor = vec4(0.0);", "}"].join("\n"),
                o = function(t, e) {
                    var r = !e;
                    if (r) {
                        var o = document.createElement("canvas");
                        o.width = 1, o.height = 1, e = n.createContext(o)
                    }
                    for (var a = e.createShader(e.FRAGMENT_SHADER);;) {
                        var h = s.replace(/%forloop%/gi, i(t));
                        if (e.shaderSource(a, h), e.compileShader(a), e.getShaderParameter(a, e.COMPILE_STATUS)) break;
                        t = t / 2 | 0
                    }
                    return r && e.getExtension("WEBGL_lose_context") && e.getExtension("WEBGL_lose_context").loseContext(), t
                };
            e.exports = o
        }, {
            "pixi-gl-core": 12
        }],
        95: [function(t, e, r) {			//"./utils/mapWebGLBlendModesToPixi": 95
            function i(t, e) {
                return e = e || [], e[n.BLEND_MODES.NORMAL] = [t.ONE, t.ONE_MINUS_SRC_ALPHA], e[n.BLEND_MODES.ADD] = [t.ONE, t.DST_ALPHA], e[n.BLEND_MODES.MULTIPLY] = [t.DST_COLOR, t.ONE_MINUS_SRC_ALPHA], e[n.BLEND_MODES.SCREEN] = [t.ONE, t.ONE_MINUS_SRC_COLOR], e[n.BLEND_MODES.OVERLAY] = [t.ONE, t.ONE_MINUS_SRC_ALPHA], e[n.BLEND_MODES.DARKEN] = [t.ONE, t.ONE_MINUS_SRC_ALPHA], e[n.BLEND_MODES.LIGHTEN] = [t.ONE, t.ONE_MINUS_SRC_ALPHA], e[n.BLEND_MODES.COLOR_DODGE] = [t.ONE, t.ONE_MINUS_SRC_ALPHA], e[n.BLEND_MODES.COLOR_BURN] = [t.ONE, t.ONE_MINUS_SRC_ALPHA], e[n.BLEND_MODES.HARD_LIGHT] = [t.ONE, t.ONE_MINUS_SRC_ALPHA], e[n.BLEND_MODES.SOFT_LIGHT] = [t.ONE, t.ONE_MINUS_SRC_ALPHA], e[n.BLEND_MODES.DIFFERENCE] = [t.ONE, t.ONE_MINUS_SRC_ALPHA], e[n.BLEND_MODES.EXCLUSION] = [t.ONE, t.ONE_MINUS_SRC_ALPHA], e[n.BLEND_MODES.HUE] = [t.ONE, t.ONE_MINUS_SRC_ALPHA], e[n.BLEND_MODES.SATURATION] = [t.ONE, t.ONE_MINUS_SRC_ALPHA], e[n.BLEND_MODES.COLOR] = [t.ONE, t.ONE_MINUS_SRC_ALPHA], e[n.BLEND_MODES.LUMINOSITY] = [t.ONE, t.ONE_MINUS_SRC_ALPHA], e
            }
            var n = t("../../../const");
            e.exports = i
        }, {
            "../../../const": 43
        }],
        96: [function(t, e, r) {
            function i(t, e) {
                e = e || {}, e[n.DRAW_MODES.POINTS] = t.POINTS, e[n.DRAW_MODES.LINES] = t.LINES, e[n.DRAW_MODES.LINE_LOOP] = t.LINE_LOOP, e[n.DRAW_MODES.LINE_STRIP] = t.LINE_STRIP, e[n.DRAW_MODES.TRIANGLES] = t.TRIANGLES, e[n.DRAW_MODES.TRIANGLE_STRIP] = t.TRIANGLE_STRIP, e[n.DRAW_MODES.TRIANGLE_FAN] = t.TRIANGLE_FAN
            }
            var n = t("../../../const");
            e.exports = i
        }, {
            "../../../const": 43
        }],
        97: [function(t, e, r) {
            function i(t) {
                var e = t.getContextAttributes();
                e.stencil || console.warn("Provided WebGL context does not have a stencil buffer, masks may not render correctly")
            }
            e.exports = i
        }, {}],
        98: [function(t, e, r) {
            function i(t) {
                o.call(this), this.anchor = new n.ObservablePoint(this.onAnchorUpdate, this), this._texture = null, this._width = 0, this._height = 0, this._tint = null, this._tintRGB = null, this.tint = 16777215, this.blendMode = h.BLEND_MODES.NORMAL, this.shader = null, this.cachedTint = 16777215, this.texture = t || s.EMPTY, this.vertexData = new Float32Array(8), this.vertexTrimmedData = null, this._transformID = -1, this._textureID = -1
            }
            var n = t("../math"),
                s = t("../textures/Texture"),
                o = t("../display/Container"),
                a = t("../utils"),
                h = t("../const"),
                u = new n.Point;
            i.prototype = Object.create(o.prototype), i.prototype.constructor = i, e.exports = i, Object.defineProperties(i.prototype, {
                width: {
                    get: function() {
                        return Math.abs(this.scale.x) * this.texture.orig.width
                    },
                    set: function(t) {
                        var e = a.sign(this.scale.x) || 1;
                        this.scale.x = e * t / this.texture.orig.width, this._width = t
                    }
                },
                height: {
                    get: function() {
                        return Math.abs(this.scale.y) * this.texture.orig.height
                    },
                    set: function(t) {
                        var e = a.sign(this.scale.y) || 1;
                        this.scale.y = e * t / this.texture.orig.height, this._height = t
                    }
                },
                tint: {
                    get: function() {
                        return this._tint
                    },
                    set: function(t) {
                        this._tint = t, this._tintRGB = (t >> 16) + (65280 & t) + ((255 & t) << 16)
                    }
                },
                texture: {
                    get: function() {
                        return this._texture
                    },
                    set: function(t) {
                        this._texture !== t && (this._texture = t, this.cachedTint = 16777215, this._textureID = -1, t && (t.baseTexture.hasLoaded ? this._onTextureUpdate() : t.once("update", this._onTextureUpdate, this)))
                    }
                }
            }), i.prototype._onTextureUpdate = function() {
                this._textureID = -1, this._width && (this.scale.x = a.sign(this.scale.x) * this._width / this.texture.orig.width), this._height && (this.scale.y = a.sign(this.scale.y) * this._height / this.texture.orig.height)
            }, i.prototype.onAnchorUpdate = function() {
                this._transformID = -1
            }, i.prototype.calculateVertices = function() {
                if (this._transformID !== this.transform._worldID || this._textureID !== this._texture._updateID) {
                    this._transformID = this.transform._worldID, this._textureID = this._texture._updateID;
                    var t, e, r, i, n = this._texture,
                        s = this.transform.worldTransform,
                        o = s.a,
                        a = s.b,
                        h = s.c,
                        u = s.d,
                        l = s.tx,
                        c = s.ty,
                        d = this.vertexData,
                        p = n.trim,
                        f = n.orig;
                    p ? (e = p.x - this.anchor._x * f.width, t = e + p.width, i = p.y - this.anchor._y * f.height, r = i + p.height) : (t = f.width * (1 - this.anchor._x), e = f.width * -this.anchor._x, r = f.height * (1 - this.anchor._y), i = f.height * -this.anchor._y), d[0] = o * e + h * i + l, d[1] = u * i + a * e + c, d[2] = o * t + h * i + l, d[3] = u * i + a * t + c, d[4] = o * t + h * r + l, d[5] = u * r + a * t + c, d[6] = o * e + h * r + l, d[7] = u * r + a * e + c
                }
            }, i.prototype.calculateTrimmedVertices = function() {
                this.vertexTrimmedData || (this.vertexTrimmedData = new Float32Array(8));
                var t, e, r, i, n = this._texture,
                    s = this.vertexTrimmedData,
                    o = n.orig,
                    a = this.transform.worldTransform,
                    h = a.a,
                    u = a.b,
                    l = a.c,
                    c = a.d,
                    d = a.tx,
                    p = a.ty;
                t = o.width * (1 - this.anchor._x), e = o.width * -this.anchor._x, r = o.height * (1 - this.anchor._y), i = o.height * -this.anchor._y, s[0] = h * e + l * i + d, s[1] = c * i + u * e + p, s[2] = h * t + l * i + d, s[3] = c * i + u * t + p, s[4] = h * t + l * r + d, s[5] = c * r + u * t + p, s[6] = h * e + l * r + d, s[7] = c * r + u * e + p
            }, i.prototype._renderWebGL = function(t) {
                this.calculateVertices(), t.setObjectRenderer(t.plugins.sprite), t.plugins.sprite.render(this)
            }, i.prototype._renderCanvas = function(t) {
                t.plugins.sprite.render(this)
            }, i.prototype._calculateBounds = function() {
                var t = this._texture.trim,
                    e = this._texture.orig;
                !t || t.width === e.width && t.height === e.height ? (this.calculateVertices(), this._bounds.addQuad(this.vertexData)) : (this.calculateTrimmedVertices(), this._bounds.addQuad(this.vertexTrimmedData))
            }, i.prototype.getLocalBounds = function(t) {
                return 0 === this.children.length ? (this._bounds.minX = -this._texture.orig.width * this.anchor._x, this._bounds.minY = -this._texture.orig.height * this.anchor._y, this._bounds.maxX = this._texture.orig.width, this._bounds.maxY = this._texture.orig.height, t || (this._localBoundsRect || (this._localBoundsRect = new n.Rectangle), t = this._localBoundsRect), this._bounds.getRectangle(t)) : o.prototype.getLocalBounds.call(this, t)
            }, i.prototype.containsPoint = function(t) {
                this.worldTransform.applyInverse(t, u);
                var e, r = this._texture.orig.width,
                    i = this._texture.orig.height,
                    n = -r * this.anchor.x;
                return u.x > n && u.x < n + r && (e = -i * this.anchor.y, u.y > e && u.y < e + i)
            }, i.prototype.destroy = function(t) {
                o.prototype.destroy.call(this, t), this.anchor = null;
                var e = "boolean" == typeof t ? t : t && t.texture;
                if (e) {
                    var r = "boolean" == typeof t ? t : t && t.baseTexture;
                    this._texture.destroy(!!r)
                }
                this._texture = null, this.shader = null
            }, i.from = function(t) {
                return new i(s.from(t))
            }, i.fromFrame = function(t) {
                var e = a.TextureCache[t];
                if (!e) throw new Error('The frameId "' + t + '" does not exist in the texture cache');
                return new i(e)
            }, i.fromImage = function(t, e, r) {
                return new i(s.fromImage(t, e, r))
            }
        }, {
            "../const": 43,
            "../display/Container": 45,
            "../math": 67,
            "../textures/Texture": 109,
            "../utils": 116
        }],
        99: [function(t, e, r) {
            function i(t) {
                this.renderer = t
            }
            var n = t("../../renderers/canvas/CanvasRenderer"),
                s = t("../../const"),
                o = t("../../math"),
                a = new o.Matrix,
                h = t("./CanvasTinter");
            i.prototype.constructor = i, e.exports = i, n.registerPlugin("sprite", i), i.prototype.render = function(t) {
                var e, r, i = t._texture,
                    n = this.renderer,
                    u = t.transform.worldTransform,
                    l = i._frame.width,
                    c = i._frame.height;
                if (!(i.orig.width <= 0 || i.orig.height <= 0) && i.baseTexture.source && (n.setBlendMode(t.blendMode), i.valid)) {
                    n.context.globalAlpha = t.worldAlpha;
                    var d = i.baseTexture.scaleMode === s.SCALE_MODES.LINEAR;
                    n.smoothProperty && n.context[n.smoothProperty] !== d && (n.context[n.smoothProperty] = d), i.trim ? (e = i.trim.width / 2 + i.trim.x - t.anchor.x * i.orig.width, r = i.trim.height / 2 + i.trim.y - t.anchor.y * i.orig.height) : (e = (.5 - t.anchor.x) * i.orig.width, r = (.5 - t.anchor.y) * i.orig.height), i.rotate && (u.copy(a), u = a, o.GroupD8.matrixAppendRotationInv(u, i.rotate, e, r), e = 0, r = 0), e -= l / 2, r -= c / 2, n.roundPixels ? (n.context.setTransform(u.a, u.b, u.c, u.d, u.tx * n.resolution | 0, u.ty * n.resolution | 0), e = 0 | e, r = 0 | r) : n.context.setTransform(u.a, u.b, u.c, u.d, u.tx * n.resolution, u.ty * n.resolution);
                    var p = i.baseTexture.resolution;
                    16777215 !== t.tint ? (t.cachedTint !== t.tint && (t.cachedTint = t.tint, t.tintedTexture = h.getTintedTexture(t, t.tint)), n.context.drawImage(t.tintedTexture, 0, 0, l * p, c * p, e * n.resolution, r * n.resolution, l * n.resolution, c * n.resolution)) : n.context.drawImage(i.baseTexture.source, i._frame.x * p, i._frame.y * p, l * p, c * p, e * n.resolution, r * n.resolution, l * n.resolution, c * n.resolution)
                }
            }, i.prototype.destroy = function() {
                this.renderer = null
            }
        }, {
            "../../const": 43,
            "../../math": 67,
            "../../renderers/canvas/CanvasRenderer": 74,
            "./CanvasTinter": 100
        }],
        100: [function(t, e, r) {		//"../core/sprites/canvas/CanvasTinter": 100
            var i = t("../../utils"),
                n = t("../../renderers/canvas/utils/canUseNewCanvasBlendModes"),
                s = e.exports = {
                    getTintedTexture: function(t, e) {
                        var r = t.texture;
                        e = s.roundColor(e);
                        var i = "#" + ("00000" + (0 | e).toString(16)).substr(-6);
                        if (r.tintCache = r.tintCache || {}, r.tintCache[i]) return r.tintCache[i];
                        var n = s.canvas || document.createElement("canvas");
                        if (s.tintMethod(r, e, n), s.convertTintToImage) {
                            var o = new Image;
                            o.src = n.toDataURL(), r.tintCache[i] = o
                        } else r.tintCache[i] = n, s.canvas = null;
                        return n
                    },
                    tintWithMultiply: function(t, e, r) {
                        var i = r.getContext("2d"),
                            n = t._frame.clone(),
                            s = t.baseTexture.resolution;
                        n.x *= s, n.y *= s, n.width *= s, n.height *= s, r.width = n.width, r.height = n.height, i.fillStyle = "#" + ("00000" + (0 | e).toString(16)).substr(-6), i.fillRect(0, 0, n.width, n.height), i.globalCompositeOperation = "multiply", i.drawImage(t.baseTexture.source, n.x, n.y, n.width, n.height, 0, 0, n.width, n.height), i.globalCompositeOperation = "destination-atop", i.drawImage(t.baseTexture.source, n.x, n.y, n.width, n.height, 0, 0, n.width, n.height)
                    },
                    tintWithOverlay: function(t, e, r) {
                        var i = r.getContext("2d"),
                            n = t._frame.clone(),
                            s = t.baseTexture.resolution;
                        n.x *= s, n.y *= s, n.width *= s, n.height *= s, r.width = n.width, r.height = n.height, i.globalCompositeOperation = "copy", i.fillStyle = "#" + ("00000" + (0 | e).toString(16)).substr(-6), i.fillRect(0, 0, n.width, n.height), i.globalCompositeOperation = "destination-atop", i.drawImage(t.baseTexture.source, n.x, n.y, n.width, n.height, 0, 0, n.width, n.height)
                    },
                    tintWithPerPixel: function(t, e, r) {
                        var n = r.getContext("2d"),
                            s = t._frame.clone(),
                            o = t.baseTexture.resolution;
                        s.x *= o, s.y *= o, s.width *= o, s.height *= o, r.width = s.width, r.height = s.height, n.globalCompositeOperation = "copy", n.drawImage(t.baseTexture.source, s.x, s.y, s.width, s.height, 0, 0, s.width, s.height);
                        for (var a = i.hex2rgb(e), h = a[0], u = a[1], l = a[2], c = n.getImageData(0, 0, s.width, s.height), d = c.data, p = 0; p < d.length; p += 4) d[p + 0] *= h, d[p + 1] *= u, d[p + 2] *= l;
                        n.putImageData(c, 0, 0)
                    },
                    roundColor: function(t) {
                        var e = s.cacheStepsPerColorChannel,
                            r = i.hex2rgb(t);
                        return r[0] = Math.min(255, r[0] / e * e), r[1] = Math.min(255, r[1] / e * e), r[2] = Math.min(255, r[2] / e * e), i.rgb2hex(r)
                    },
                    cacheStepsPerColorChannel: 8,
                    convertTintToImage: !1,
                    canUseMultiply: n(),
                    tintMethod: 0
                };
            s.tintMethod = s.canUseMultiply ? s.tintWithMultiply : s.tintWithPerPixel
        }, {
            "../../renderers/canvas/utils/canUseNewCanvasBlendModes": 77,
            "../../utils": 116
        }],
        101: [function(t, e, r) {
            var i = function(t) {
                this.vertices = new ArrayBuffer(t), this.float32View = new Float32Array(this.vertices), this.uint32View = new Uint32Array(this.vertices)
            };
            e.exports = i, i.prototype.destroy = function() {
                this.vertices = null, this.positions = null, this.uvs = null, this.colors = null
            }
        }, {}],
        102: [function(t, e, r) {
            function i(t) {
                n.call(this, t), this.vertSize = 5, this.vertByteSize = 4 * this.vertSize, this.size = l.SPRITE_BATCH_SIZE, this.buffers = [];
                for (var e = 1; e <= d.nextPow2(this.size); e *= 2) {
                    var r = 4 * e * this.vertByteSize;
                    this.buffers.push(new u(r))
                }
                this.indices = o(this.size), this.shaders = null, this.currentIndex = 0, p = 0, this.groups = [];
                for (var i = 0; i < this.size; i++) this.groups[i] = {
                    textures: [],
                    textureCount: 0,
                    ids: [],
                    size: 0,
                    start: 0,
                    blend: 0
                };
                this.sprites = [], this.vertexBuffers = [], this.vaos = [], this.vaoMax = 2, this.vertexCount = 0, this.renderer.on("prerender", this.onPrerender, this)
            }
            var n = t("../../renderers/webgl/utils/ObjectRenderer"),
                s = t("../../renderers/webgl/WebGLRenderer"),
                o = t("../../utils/createIndicesForQuads"),
                a = t("./generateMultiTextureShader"),
                h = t("../../renderers/webgl/utils/checkMaxIfStatmentsInShader"),
                u = t("./BatchBuffer"),
                l = t("../../const"),
                c = t("pixi-gl-core"),
                d = t("bit-twiddle"),
                p = 0;
            i.prototype = Object.create(n.prototype), i.prototype.constructor = i, e.exports = i, s.registerPlugin("sprite", i), i.prototype.onContextChange = function() {
                var t = this.renderer.gl;
                this.MAX_TEXTURES = Math.min(t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS), l.SPRITE_MAX_TEXTURES), this.MAX_TEXTURES = h(this.MAX_TEXTURES, t), this.shaders = new Array(this.MAX_TEXTURES), this.shaders[0] = a(t, 1), this.shaders[1] = a(t, 2), this.indexBuffer = c.GLBuffer.createIndexBuffer(t, this.indices, t.STATIC_DRAW);
                for (var e = this.shaders[1], r = 0; r < this.vaoMax; r++) this.vertexBuffers[r] = c.GLBuffer.createVertexBuffer(t, null, t.STREAM_DRAW), this.vaos[r] = this.renderer.createVao().addIndex(this.indexBuffer).addAttribute(this.vertexBuffers[r], e.attributes.aVertexPosition, t.FLOAT, !1, this.vertByteSize, 0).addAttribute(this.vertexBuffers[r], e.attributes.aTextureCoord, t.UNSIGNED_SHORT, !0, this.vertByteSize, 8).addAttribute(this.vertexBuffers[r], e.attributes.aColor, t.UNSIGNED_BYTE, !0, this.vertByteSize, 12).addAttribute(this.vertexBuffers[r], e.attributes.aTextureId, t.FLOAT, !1, this.vertByteSize, 16);
                this.vao = this.vaos[0], this.currentBlendMode = 99999
            }, i.prototype.onPrerender = function() {
                this.vertexCount = 0
            }, i.prototype.render = function(t) {
                this.currentIndex >= this.size && this.flush(), t.texture._uvs && (this.sprites[this.currentIndex++] = t)
            }, i.prototype.flush = function() {
                if (0 !== this.currentIndex) {
                    var t, e, r, i, n, s, o, h = this.renderer.gl,
                        u = d.nextPow2(this.currentIndex),
                        l = d.log2(u),
                        f = this.buffers[l],
                        v = this.sprites,
                        g = this.groups,
                        y = f.float32View,
                        x = f.uint32View,
                        m = 0,
                        _ = 1,
                        b = 0,
                        T = g[0],
                        E = v[0].blendMode;
                    T.textureCount = 0, T.start = 0, T.blend = E, p++;
                    for (var w = 0; w < this.currentIndex; w++) {
                        var S = v[w];
                        if (t = S._texture.baseTexture, E !== S.blendMode && (E = S.blendMode, e = null, b = this.MAX_TEXTURES, p++), e !== t && (e = t, t._enabled !== p && (b === this.MAX_TEXTURES && (p++, b = 0, T.size = w - T.start, T = g[_++], T.textureCount = 0, T.blend = E, T.start = w), t._enabled = p, t._id = b, T.textures[T.textureCount++] = t, b++)), r = S.vertexData, i = S._tintRGB + (255 * S.worldAlpha << 24), n = S._texture._uvs.uvsUint32, s = t._id, this.renderer.roundPixels) {
                            var C = this.renderer.resolution;
                            y[m] = (r[0] * C | 0) / C, y[m + 1] = (r[1] * C | 0) / C, y[m + 5] = (r[2] * C | 0) / C, y[m + 6] = (r[3] * C | 0) / C, y[m + 10] = (r[4] * C | 0) / C, y[m + 11] = (r[5] * C | 0) / C, y[m + 15] = (r[6] * C | 0) / C, y[m + 16] = (r[7] * C | 0) / C
                        } else y[m] = r[0], y[m + 1] = r[1], y[m + 5] = r[2], y[m + 6] = r[3], y[m + 10] = r[4], y[m + 11] = r[5], y[m + 15] = r[6], y[m + 16] = r[7];
                        x[m + 2] = n[0], x[m + 7] = n[1], x[m + 12] = n[2], x[m + 17] = n[3], x[m + 3] = x[m + 8] = x[m + 13] = x[m + 18] = i, y[m + 4] = y[m + 9] = y[m + 14] = y[m + 19] = s, m += 20
                    }
                    for (T.size = w - T.start, this.vertexCount++, this.vaoMax <= this.vertexCount && (this.vaoMax++, o = this.shaders[1], this.vertexBuffers[this.vertexCount] = c.GLBuffer.createVertexBuffer(h, null, h.STREAM_DRAW), this.vaos[this.vertexCount] = this.renderer.createVao().addIndex(this.indexBuffer).addAttribute(this.vertexBuffers[this.vertexCount], o.attributes.aVertexPosition, h.FLOAT, !1, this.vertByteSize, 0).addAttribute(this.vertexBuffers[this.vertexCount], o.attributes.aTextureCoord, h.UNSIGNED_SHORT, !0, this.vertByteSize, 8).addAttribute(this.vertexBuffers[this.vertexCount], o.attributes.aColor, h.UNSIGNED_BYTE, !0, this.vertByteSize, 12).addAttribute(this.vertexBuffers[this.vertexCount], o.attributes.aTextureId, h.FLOAT, !1, this.vertByteSize, 16)), this.vertexBuffers[this.vertexCount].upload(f.vertices, 0), this.vao = this.vaos[this.vertexCount].bind(), w = 0; w < _; w++) {
                        var R = g[w],
                            M = R.textureCount;
                        o = this.shaders[M - 1], o || (o = this.shaders[M - 1] = a(h, M)), this.renderer.bindShader(o);
                        for (var A = 0; A < M; A++) this.renderer.bindTexture(R.textures[A], A);
                        this.renderer.state.setBlendMode(R.blend), h.drawElements(h.TRIANGLES, 6 * R.size, h.UNSIGNED_SHORT, 6 * R.start * 2)
                    }
                    this.currentIndex = 0
                }
            }, i.prototype.start = function() {}, i.prototype.stop = function() {
                this.flush(), this.vao.unbind()
            }, i.prototype.destroy = function() {
                for (var t = 0; t < this.vaoMax; t++) this.vertexBuffers[t].destroy(), this.vaos[t].destroy();
                for (this.indexBuffer.destroy(), this.renderer.off("prerender", this.onPrerender, this), n.prototype.destroy.call(this), t = 0; t < this.shaders.length; t++) this.shaders[t] && this.shaders[t].destroy();
                for (this.vertexBuffers = null, this.vaos = null, this.indexBuffer = null, this.indices = null, this.sprites = null, t = 0; t < this.buffers.length; t++) this.buffers[t].destroy()
            }
        }, {
            "../../const": 43,
            "../../renderers/webgl/WebGLRenderer": 81,
            "../../renderers/webgl/utils/ObjectRenderer": 91,
            "../../renderers/webgl/utils/checkMaxIfStatmentsInShader": 94,
            "../../utils/createIndicesForQuads": 114,
            "./BatchBuffer": 101,
            "./generateMultiTextureShader": 103,
            "bit-twiddle": 1,
            "pixi-gl-core": 12
        }],
        103: [function(t, e, r) {
            function i(t, e) {
                var r = "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nvoid main(void){\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vTextureCoord = aTextureCoord;\n   vTextureId = aTextureId;\n   vColor = vec4(aColor.rgb * aColor.a, aColor.a);\n}\n",
                    i = o;
                i = i.replace(/%count%/gi, e), i = i.replace(/%forloop%/gi, n(e));
                for (var a = new s(t, r, i, {
                    aVertexPosition: 3,
                    aColor: 2,
                    aTextureCoord: 1,
                    aTextureId: 0
                }), h = [], u = 0; u < e; u++) h[u] = u;
                return a.bind(), a.uniforms.uSamplers = h, a
            }

            function n(t) {
                var e = "";
                e += "\n", e += "\n";
                for (var r = 0; r < t; r++) r > 0 && (e += "\nelse "), r < t - 1 && (e += "if(textureId == " + r + ".0)"), e += "\n{", e += "\n\tcolor = texture2D(uSamplers[" + r + "], vTextureCoord);", e += "\n}";
                return e += "\n", e += "\n"
            }
            var s = t("../../Shader"),
                o = ["varying vec2 vTextureCoord;", "varying vec4 vColor;", "varying float vTextureId;", "uniform sampler2D uSamplers[%count%];", "void main(void){", "vec4 color;", "float textureId = floor(vTextureId+0.5);", "%forloop%", "gl_FragColor = color * vColor;", "}"].join("\n");
            e.exports = i
        }, {
            "../../Shader": 42
        }],
        104: [function(t, e, r) {
            function i(t, e) {
                this.canvas = document.createElement("canvas"), this.context = this.canvas.getContext("2d"), this.resolution = h.RESOLUTION, this._text = null, this._style = null, this._styleListener = null, this._font = "";
                var r = s.fromCanvas(this.canvas);
                r.orig = new o.Rectangle, r.trim = new o.Rectangle, n.call(this, r), this.text = t, this.style = e, this.localStyleID = -1
            }
            var n = t("../sprites/Sprite"),
                s = t("../textures/Texture"),
                o = t("../math"),
                a = t("../utils"),
                h = t("../const"),
                u = t("./TextStyle"),
                l = {
                    texture: !0,
                    children: !1,
                    baseTexture: !0
                };
            i.prototype = Object.create(n.prototype), i.prototype.constructor = i, e.exports = i, i.fontPropertiesCache = {}, i.fontPropertiesCanvas = document.createElement("canvas"), i.fontPropertiesContext = i.fontPropertiesCanvas.getContext("2d"), Object.defineProperties(i.prototype, {
                width: {
                    get: function() {
                        return this.updateText(!0), Math.abs(this.scale.x) * this.texture.orig.width
                    },
                    set: function(t) {
                        this.updateText(!0);
                        var e = a.sign(this.scale.x) || 1;
                        this.scale.x = e * t / this.texture.orig.width, this._width = t
                    }
                },
                height: {
                    get: function() {
                        return this.updateText(!0), Math.abs(this.scale.y) * this._texture.orig.height
                    },
                    set: function(t) {
                        this.updateText(!0);
                        var e = a.sign(this.scale.y) || 1;
                        this.scale.y = e * t / this.texture.orig.height, this._height = t
                    }
                },
                style: {
                    get: function() {
                        return this._style
                    },
                    set: function(t) {
                        t = t || {}, t instanceof u ? this._style = t : this._style = new u(t), this.localStyleID = -1, this.dirty = !0
                    }
                },
                text: {
                    get: function() {
                        return this._text
                    },
                    set: function(t) {
                        t = t || " ", t = t.toString(), this._text !== t && (this._text = t, this.dirty = !0)
                    }
                }
            }), i.prototype.updateText = function(t) {
                var e = this._style;
                if (this.localStyleID !== e.styleID && (this.dirty = !0, this.localStyleID = e.styleID), this.dirty || !t) {
                    var r = "number" == typeof e.fontSize ? e.fontSize + "px" : e.fontSize;
                    this._font = e.fontStyle + " " + e.fontVariant + " " + e.fontWeight + " " + r + " " + e.fontFamily, this.context.font = this._font;
                    var i, n = e.wordWrap ? this.wordWrap(this._text) : this._text,
                        s = n.split(/(?:\r\n|\r|\n)/),
                        o = new Array(s.length),
                        a = 0,
                        h = this.determineFontProperties(this._font);
                    for (i = 0; i < s.length; i++) {
                        var u = this.context.measureText(s[i]).width + (s[i].length - 1) * e.letterSpacing;
                        o[i] = u, a = Math.max(a, u)
                    }
                    var l = a + e.strokeThickness;
                    e.dropShadow && (l += e.dropShadowDistance), l += 2 * e.padding, this.canvas.width = Math.ceil((l + this.context.lineWidth) * this.resolution);
                    var c = this.style.lineHeight || h.fontSize + e.strokeThickness,
                        d = Math.max(c, h.fontSize + e.strokeThickness) + (s.length - 1) * c;
                    e.dropShadow && (d += e.dropShadowDistance), this.canvas.height = Math.ceil((d + 2 * this._style.padding) * this.resolution), this.context.scale(this.resolution, this.resolution), navigator.isCocoonJS && this.context.clearRect(0, 0, this.canvas.width, this.canvas.height), this.context.font = this._font, this.context.strokeStyle = e.stroke, this.context.lineWidth = e.strokeThickness, this.context.textBaseline = e.textBaseline, this.context.lineJoin = e.lineJoin, this.context.miterLimit = e.miterLimit;
                    var p, f;
                    if (e.dropShadow) {
                        e.dropShadowBlur > 0 ? (this.context.shadowColor = e.dropShadowColor, this.context.shadowBlur = e.dropShadowBlur) : this.context.fillStyle = e.dropShadowColor;
                        var v = Math.cos(e.dropShadowAngle) * e.dropShadowDistance,
                            g = Math.sin(e.dropShadowAngle) * e.dropShadowDistance;
                        for (i = 0; i < s.length; i++) p = e.strokeThickness / 2, f = e.strokeThickness / 2 + i * c + h.ascent, "right" === e.align ? p += a - o[i] : "center" === e.align && (p += (a - o[i]) / 2), e.fill && (this.drawLetterSpacing(s[i], p + v + e.padding, f + g + e.padding), e.stroke && e.strokeThickness && (this.context.strokeStyle = e.dropShadowColor, this.drawLetterSpacing(s[i], p + v + e.padding, f + g + e.padding, !0), this.context.strokeStyle = e.stroke))
                    }
                    for (this.context.fillStyle = this._generateFillStyle(e, s), i = 0; i < s.length; i++) p = e.strokeThickness / 2, f = e.strokeThickness / 2 + i * c + h.ascent, "right" === e.align ? p += a - o[i] : "center" === e.align && (p += (a - o[i]) / 2), e.stroke && e.strokeThickness && this.drawLetterSpacing(s[i], p + e.padding, f + e.padding, !0), e.fill && this.drawLetterSpacing(s[i], p + e.padding, f + e.padding);
                    this.updateTexture()
                }
            }, i.prototype.drawLetterSpacing = function(t, e, r, i) {
                var n = this._style,
                    s = n.letterSpacing;
                if (0 === s) return void(i ? this.context.strokeText(t, e, r) : this.context.fillText(t, e, r));
                for (var o, a = String.prototype.split.call(t, ""), h = 0, u = e; h < t.length;) o = a[h++], i ? this.context.strokeText(o, u, r) : this.context.fillText(o, u, r), u += this.context.measureText(o).width + s
            }, i.prototype.updateTexture = function() {
                var t = this._texture,
                    e = this._style;
                t.baseTexture.hasLoaded = !0, t.baseTexture.resolution = this.resolution, t.baseTexture.realWidth = this.canvas.width, t.baseTexture.realHeight = this.canvas.height, t.baseTexture.width = this.canvas.width / this.resolution, t.baseTexture.height = this.canvas.height / this.resolution, t.trim.width = t._frame.width = this.canvas.width / this.resolution, t.trim.height = t._frame.height = this.canvas.height / this.resolution, t.trim.x = -e.padding, t.trim.y = -e.padding, t.orig.width = t._frame.width - 2 * e.padding, t.orig.height = t._frame.height - 2 * e.padding, this._onTextureUpdate(), t.baseTexture.emit("update", t.baseTexture), this.dirty = !1
            }, i.prototype.renderWebGL = function(t) {
                this.resolution !== t.resolution && (this.resolution = t.resolution, this.dirty = !0), this.updateText(!0), n.prototype.renderWebGL.call(this, t)
            }, i.prototype._renderCanvas = function(t) {
                this.resolution !== t.resolution && (this.resolution = t.resolution, this.dirty = !0), this.updateText(!0), n.prototype._renderCanvas.call(this, t)
            }, i.prototype.determineFontProperties = function(t) {
                var e = i.fontPropertiesCache[t];
                if (!e) {
                    e = {};
                    var r = i.fontPropertiesCanvas,
                        n = i.fontPropertiesContext;
                    n.font = t;
                    var s = Math.ceil(n.measureText("|MÃ‰q").width),
                        o = Math.ceil(n.measureText("M").width),
                        a = 2 * o;
                    o = 1.4 * o | 0, r.width = s, r.height = a, n.fillStyle = "#f00", n.fillRect(0, 0, s, a), n.font = t, n.textBaseline = "alphabetic", n.fillStyle = "#000", n.fillText("|MÃ‰q", 0, o);
                    var h, u, l = n.getImageData(0, 0, s, a).data,
                        c = l.length,
                        d = 4 * s,
                        p = 0,
                        f = !1;
                    for (h = 0; h < o; h++) {
                        for (u = 0; u < d; u += 4)
                            if (255 !== l[p + u]) {
                                f = !0;
                                break
                            }
                        if (f) break;
                        p += d
                    }
                    for (e.ascent = o - h, p = c - d, f = !1, h = a; h > o; h--) {
                        for (u = 0; u < d; u += 4)
                            if (255 !== l[p + u]) {
                                f = !0;
                                break
                            }
                        if (f) break;
                        p -= d
                    }
                    e.descent = h - o, e.fontSize = e.ascent + e.descent, i.fontPropertiesCache[t] = e
                }
                return e
            }, i.prototype.wordWrap = function(t) {
                for (var e = "", r = t.split("\n"), i = this._style.wordWrapWidth, n = 0; n < r.length; n++) {
                    for (var s = i, o = r[n].split(" "), a = 0; a < o.length; a++) {
                        var h = this.context.measureText(o[a]).width;
                        if (this._style.breakWords && h > i)
                            for (var u = o[a].split(""), l = 0; l < u.length; l++) {
                                var c = this.context.measureText(u[l]).width;
                                c > s ? (e += "\n" + u[l], s = i - c) : (0 === l && (e += " "), e += u[l], s -= c)
                            } else {
                            var d = h + this.context.measureText(" ").width;
                            0 === a || d > s ? (a > 0 && (e += "\n"), e += o[a], s = i - h) : (s -= d, e += " " + o[a])
                        }
                    }
                    n < r.length - 1 && (e += "\n")
                }
                return e
            }, i.prototype._calculateBounds = function() {
                this.updateText(!0), this.calculateVertices(), this._bounds.addQuad(this.vertexData)
            }, i.prototype._onStyleChange = function() {
                this.dirty = !0
            }, i.prototype._generateFillStyle = function(t, e) {
                if (Array.isArray(t.fill)) {
                    if (navigator.isCocoonJS) return t.fill[0];
                    var r, i, n, s, o, a = this.canvas.width / this.resolution,
                        u = this.canvas.height / this.resolution;
                    if (t.fillGradientType === h.TEXT_GRADIENT.LINEAR_VERTICAL)
                        for (i = this.context.createLinearGradient(a / 2, 0, a / 2, u), n = (t.fill.length + 1) * e.length, s = 0, r = 0; r < e.length; r++) {
                            s += 1;
                            for (var l = 0; l < t.fill.length; l++) o = s / n, i.addColorStop(o, t.fill[l]), s++
                        } else
                        for (i = this.context.createLinearGradient(0, u / 2, a, u / 2), n = t.fill.length + 1, s = 1, r = 0; r < t.fill.length; r++) o = s / n, i.addColorStop(o, t.fill[r]), s++;
                    return i
                }
                return t.fill
            }, i.prototype.destroy = function(t) {
                "boolean" == typeof t && (t = {
                    children: t
                }), t = Object.assign({}, l, t), n.prototype.destroy.call(this, t), this.context = null, this.canvas = null, this._style = null
            }
        }, {
            "../const": 43,
            "../math": 67,
            "../sprites/Sprite": 98,
            "../textures/Texture": 109,
            "../utils": 116,
            "./TextStyle": 105
        }],
        105: [function(t, e, r) {
            function i(t) {
                this.styleID = 0, Object.assign(this, this._defaults, t)
            }

            function n(t) {
                if ("number" == typeof t) return o.hex2string(t);
                if (Array.isArray(t))
                    for (var e = 0; e < t.length; ++e) "number" == typeof t[e] && (t[e] = o.hex2string(t[e]));
                return t
            }
            var s = t("../const"),
                o = t("../utils");
            i.prototype.constructor = i, e.exports = i, i.prototype._defaults = {
                align: "left",
                breakWords: !1,
                dropShadow: !1,
                dropShadowAngle: Math.PI / 6,
                dropShadowBlur: 0,
                dropShadowColor: "#000000",
                dropShadowDistance: 5,
                fill: "black",
                fillGradientType: s.TEXT_GRADIENT.LINEAR_VERTICAL,
                fontFamily: "Arial",
                fontSize: 26,
                fontStyle: "normal",
                fontVariant: "normal",
                fontWeight: "normal",
                letterSpacing: 0,
                lineHeight: 0,
                lineJoin: "miter",
                miterLimit: 10,
                padding: 0,
                stroke: "black",
                strokeThickness: 0,
                textBaseline: "alphabetic",
                wordWrap: !1,
                wordWrapWidth: 100
            }, i.prototype.clone = function() {
                var t = {};
                for (var e in this._defaults) t[e] = this[e];
                return new i(t)
            }, i.prototype.reset = function() {
                Object.assign(this, this._defaults)
            }, Object.defineProperties(i.prototype, {
                align: {
                    get: function() {
                        return this._align
                    },
                    set: function(t) {
                        this._align !== t && (this._align = t, this.styleID++)
                    }
                },
                breakWords: {
                    get: function() {
                        return this._breakWords
                    },
                    set: function(t) {
                        this._breakWords !== t && (this._breakWords = t, this.styleID++)
                    }
                },
                dropShadow: {
                    get: function() {
                        return this._dropShadow
                    },
                    set: function(t) {
                        this._dropShadow !== t && (this._dropShadow = t, this.styleID++)
                    }
                },
                dropShadowAngle: {
                    get: function() {
                        return this._dropShadowAngle
                    },
                    set: function(t) {
                        this._dropShadowAngle !== t && (this._dropShadowAngle = t, this.styleID++)
                    }
                },
                dropShadowBlur: {
                    get: function() {
                        return this._dropShadowBlur
                    },
                    set: function(t) {
                        this._dropShadowBlur !== t && (this._dropShadowBlur = t, this.styleID++)
                    }
                },
                dropShadowColor: {
                    get: function() {
                        return this._dropShadowColor
                    },
                    set: function(t) {
                        var e = n(t);
                        this._dropShadowColor !== e && (this._dropShadowColor = e, this.styleID++)
                    }
                },
                dropShadowDistance: {
                    get: function() {
                        return this._dropShadowDistance
                    },
                    set: function(t) {
                        this._dropShadowDistance !== t && (this._dropShadowDistance = t, this.styleID++)
                    }
                },
                fill: {
                    get: function() {
                        return this._fill
                    },
                    set: function(t) {
                        var e = n(t);
                        this._fill !== e && (this._fill = e, this.styleID++)
                    }
                },
                fillGradientType: {
                    get: function() {
                        return this._fillGradientType
                    },
                    set: function(t) {
                        this._fillGradientType !== t && (this._fillGradientType = t, this.styleID++)
                    }
                },
                fontFamily: {
                    get: function() {
                        return this._fontFamily
                    },
                    set: function(t) {
                        this.fontFamily !== t && (this._fontFamily = t, this.styleID++)
                    }
                },
                fontSize: {
                    get: function() {
                        return this._fontSize
                    },
                    set: function(t) {
                        this._fontSize !== t && (this._fontSize = t, this.styleID++)
                    }
                },
                fontStyle: {
                    get: function() {
                        return this._fontStyle
                    },
                    set: function(t) {
                        this._fontStyle !== t && (this._fontStyle = t, this.styleID++)
                    }
                },
                fontVariant: {
                    get: function() {
                        return this._fontVariant
                    },
                    set: function(t) {
                        this._fontVariant !== t && (this._fontVariant = t, this.styleID++)
                    }
                },
                fontWeight: {
                    get: function() {
                        return this._fontWeight
                    },
                    set: function(t) {
                        this._fontWeight !== t && (this._fontWeight = t, this.styleID++)
                    }
                },
                letterSpacing: {
                    get: function() {
                        return this._letterSpacing
                    },
                    set: function(t) {
                        this._letterSpacing !== t && (this._letterSpacing = t, this.styleID++)
                    }
                },
                lineHeight: {
                    get: function() {
                        return this._lineHeight
                    },
                    set: function(t) {
                        this._lineHeight !== t && (this._lineHeight = t, this.styleID++)
                    }
                },
                lineJoin: {
                    get: function() {
                        return this._lineJoin
                    },
                    set: function(t) {
                        this._lineJoin !== t && (this._lineJoin = t, this.styleID++)
                    }
                },
                miterLimit: {
                    get: function() {
                        return this._miterLimit
                    },
                    set: function(t) {
                        this._miterLimit !== t && (this._miterLimit = t, this.styleID++)
                    }
                },
                padding: {
                    get: function() {
                        return this._padding
                    },
                    set: function(t) {
                        this._padding !== t && (this._padding = t, this.styleID++)
                    }
                },
                stroke: {
                    get: function() {
                        return this._stroke
                    },
                    set: function(t) {
                        var e = n(t);
                        this._stroke !== e && (this._stroke = e, this.styleID++)
                    }
                },
                strokeThickness: {
                    get: function() {
                        return this._strokeThickness
                    },
                    set: function(t) {
                        this._strokeThickness !== t && (this._strokeThickness = t, this.styleID++)
                    }
                },
                textBaseline: {
                    get: function() {
                        return this._textBaseline
                    },
                    set: function(t) {
                        this._textBaseline !== t && (this._textBaseline = t, this.styleID++)
                    }
                },
                wordWrap: {
                    get: function() {
                        return this._wordWrap
                    },
                    set: function(t) {
                        this._wordWrap !== t && (this._wordWrap = t, this.styleID++)
                    }
                },
                wordWrapWidth: {
                    get: function() {
                        return this._wordWrapWidth
                    },
                    set: function(t) {
                        this._wordWrapWidth !== t && (this._wordWrapWidth = t, this.styleID++)
                    }
                }
            })
        }, {
            "../const": 43,
            "../utils": 116
        }],
        106: [function(t, e, r) {		//"./BaseRenderTexture": 106
            function i(t, e, r, i) {
                n.call(this, null, r), this.resolution = i || s.RESOLUTION, this.width = t || 100, this.height = e || 100, this.realWidth = this.width * this.resolution, this.realHeight = this.height * this.resolution, this.scaleMode = r || s.SCALE_MODES.DEFAULT, this.hasLoaded = !0, this._glRenderTargets = [], this._canvasRenderTarget = null, this.valid = !1
            }
            var n = t("./BaseTexture"),
                s = t("../const");
            i.prototype = Object.create(n.prototype), i.prototype.constructor = i, e.exports = i, i.prototype.resize = function(t, e) {
                t === this.width && e === this.height || (this.valid = t > 0 && e > 0, this.width = t, this.height = e, this.realWidth = this.width * this.resolution, this.realHeight = this.height * this.resolution, this.valid && this.emit("update", this))
            }, i.prototype.destroy = function() {
                n.prototype.destroy.call(this, !0), this.renderer = null
            }
        }, {
            "../const": 43,
            "./BaseTexture": 107
        }],
        107: [function(t, e, r) {		//"./BaseTexture": 107
            function i(t, e, r) {
                o.call(this),
                    this.uid = n.uid(), this.touched = 0, this.resolution = r || s.RESOLUTION, this.width = 100, this.height = 100, this.realWidth = 100, this.realHeight = 100, this.scaleMode = e || s.SCALE_MODES.DEFAULT, this.hasLoaded = !1, this.isLoading = !1, this.source = null, this.premultipliedAlpha = !0, this.imageUrl = null, this.isPowerOfTwo = !1, this.mipmap = s.MIPMAP_TEXTURES, this.wrapMode = s.WRAP_MODES.DEFAULT, this._glTextures = [], this._enabled = 0, this._id = 0, t && this.loadSource(t)
            }
            var n = t("../utils"),
                s = t("../const"),
                o = t("eventemitter3"),
                a = t("../utils/determineCrossOrigin"),
                h = t("bit-twiddle");
            i.prototype = Object.create(o.prototype), i.prototype.constructor = i, e.exports = i, i.prototype.update = function() {
                this.realWidth = this.source.naturalWidth || this.source.videoWidth || this.source.width, this.realHeight = this.source.naturalHeight || this.source.videoHeight || this.source.height, this.width = this.realWidth / this.resolution, this.height = this.realHeight / this.resolution, this.isPowerOfTwo = h.isPow2(this.realWidth) && h.isPow2(this.realHeight), this.emit("update", this)
            }, i.prototype.loadSource = function(t) {
                var e = this.isLoading;
                if (this.hasLoaded = !1, this.isLoading = !1, e && this.source && (this.source.onload = null, this.source.onerror = null), this.source = t, (this.source.complete || this.source.getContext) && this.source.width && this.source.height) this._sourceLoaded();
                else if (!t.getContext) {
                    this.isLoading = !0;
                    var r = this;
                    t.onload = function() {
                        t.onload = null, t.onerror = null, r.isLoading && (r.isLoading = !1, r._sourceLoaded(), r.emit("loaded", r))
                    }, t.onerror = function() {
                        t.onload = null, t.onerror = null, r.isLoading && (r.isLoading = !1, r.emit("error", r))
                    }, t.complete && t.src && (this.isLoading = !1, t.onload = null, t.onerror = null, t.width && t.height ? (this._sourceLoaded(), e && this.emit("loaded", this)) : e && this.emit("error", this))
                }
            }, i.prototype._sourceLoaded = function() {
                this.hasLoaded = !0, this.update()
            }, i.prototype.destroy = function() {
                this.imageUrl ? (delete n.BaseTextureCache[this.imageUrl], delete n.TextureCache[this.imageUrl], this.imageUrl = null, navigator.isCocoonJS || (this.source.src = "")) : this.source && this.source._pixiId && delete n.BaseTextureCache[this.source._pixiId], this.source = null, this.dispose()
            }, i.prototype.dispose = function() {
                this.emit("dispose", this)
            }, i.prototype.updateSourceImage = function(t) {
                this.source.src = t, this.loadSource(this.source)
            }, i.fromImage = function(t, e, r) {
                var s = n.BaseTextureCache[t];
                if (!s) {
                    var o = new Image;
                    void 0 === e && 0 !== t.indexOf("data:") && (o.crossOrigin = a(t)), s = new i(o, r), s.imageUrl = t, o.src = t, n.BaseTextureCache[t] = s, s.resolution = n.getResolutionOfUrl(t)
                }
                return s
            }, i.fromCanvas = function(t, e) {
                t._pixiId || (t._pixiId = "canvas_" + n.uid());
                var r = n.BaseTextureCache[t._pixiId];
                return r || (r = new i(t, e), n.BaseTextureCache[t._pixiId] = r), r
            }
        }, {
            "../const": 43,
            "../utils": 116,
            "../utils/determineCrossOrigin": 115,
            "bit-twiddle": 1,
            eventemitter3: 3
        }],
        108: [function(t, e, r) {
            function i(t, e) {
                if (this.legacyRenderer = null, !(t instanceof n)) {
                    var r = arguments[1],
                        i = arguments[2],
                        o = arguments[3] || 0,
                        a = arguments[4] || 1;
                    console.warn("v4 RenderTexture now expects a new BaseRenderTexture. Please use RenderTexture.create(" + r + ", " + i + ")"), this.legacyRenderer = arguments[0], e = null, t = new n(r, i, o, a)
                }
                s.call(this, t, e), this.valid = !0, this._updateUvs()
            }
            var n = t("./BaseRenderTexture"),
                s = t("./Texture");
            i.prototype = Object.create(s.prototype), i.prototype.constructor = i, e.exports = i, i.prototype.resize = function(t, e, r) {
                this.valid = t > 0 && e > 0, this._frame.width = this.orig.width = t, this._frame.height = this.orig.height = e, r || this.baseTexture.resize(t, e), this._updateUvs()
            }, i.create = function(t, e, r, s) {
                return new i(new n(t, e, r, s))
            }
        }, {
            "./BaseRenderTexture": 106,
            "./Texture": 109
        }],
        109: [function(t, e, r) {		//"../core/textures/Texture": 109
            function i(t, e, r, n, s) {
                if (a.call(this), this.noFrame = !1, e || (this.noFrame = !0, e = new h.Rectangle(0, 0, 1, 1)), t instanceof i && (t = t.baseTexture), this.baseTexture = t, this._frame = e, this.trim = n, this.valid = !1, this.requiresUpdate = !1, this._uvs = null, this.orig = r || e, this._rotate = +(s || 0), s === !0) this._rotate = 2;
                else if (this._rotate % 2 !== 0) throw "attempt to use diamond-shaped UVs. If you are sure, set rotation manually";
                t.hasLoaded ? (this.noFrame && (e = new h.Rectangle(0, 0, t.width, t.height), t.on("update", this.onBaseTextureUpdated, this)), this.frame = e) : t.once("loaded", this.onBaseTextureLoaded, this), this._updateID = 0
            }
            var n = t("./BaseTexture"),
                s = t("./VideoBaseTexture"),
                o = t("./TextureUvs"),
                a = t("eventemitter3"),
                h = t("../math"),
                u = t("../utils");
            i.prototype = Object.create(a.prototype), i.prototype.constructor = i, e.exports = i, Object.defineProperties(i.prototype, {
                frame: {
                    get: function() {
                        return this._frame
                    },
                    set: function(t) {
                        if (this._frame = t, this.noFrame = !1, t.x + t.width > this.baseTexture.width || t.y + t.height > this.baseTexture.height) throw new Error("Texture Error: frame does not fit inside the base Texture dimensions " + this);
                        this.valid = t && t.width && t.height && this.baseTexture.hasLoaded, this.trim || this.rotate || (this.orig = t), this.valid && this._updateUvs()
                    }
                },
                rotate: {
                    get: function() {
                        return this._rotate
                    },
                    set: function(t) {
                        this._rotate = t, this.valid && this._updateUvs()
                    }
                },
                width: {
                    get: function() {
                        return this.orig ? this.orig.width : 0
                    }
                },
                height: {
                    get: function() {
                        return this.orig ? this.orig.height : 0
                    }
                }
            }), i.prototype.update = function() {
                this.baseTexture.update()
            }, i.prototype.onBaseTextureLoaded = function(t) {
                this._updateID++, this.noFrame ? this.frame = new h.Rectangle(0, 0, t.width, t.height) : this.frame = this._frame, this.baseTexture.on("update", this.onBaseTextureUpdated, this), this.emit("update", this)
            }, i.prototype.onBaseTextureUpdated = function(t) {
                this._updateID++, this._frame.width = t.width, this._frame.height = t.height, this.emit("update", this)
            }, i.prototype.destroy = function(t) {
                this.baseTexture && (t && (u.TextureCache[this.baseTexture.imageUrl] && delete u.TextureCache[this.baseTexture.imageUrl], this.baseTexture.destroy()), this.baseTexture.off("update", this.onBaseTextureUpdated, this), this.baseTexture.off("loaded", this.onBaseTextureLoaded, this), this.baseTexture = null), this._frame = null, this._uvs = null, this.trim = null, this.orig = null, this.valid = !1, this.off("dispose", this.dispose, this), this.off("update", this.update, this)
            }, i.prototype.clone = function() {
                return new i(this.baseTexture, this.frame, this.orig, this.trim, this.rotate)
            }, i.prototype._updateUvs = function() {
                this._uvs || (this._uvs = new o), this._uvs.set(this._frame, this.baseTexture, this.rotate), this._updateID++
            }, i.fromImage = function(t, e, r) {
                var s = u.TextureCache[t];
                return s || (s = new i(n.fromImage(t, e, r)), u.TextureCache[t] = s), s
            }, i.fromFrame = function(t) {
                var e = u.TextureCache[t];
                if (!e) throw new Error('The frameId "' + t + '" does not exist in the texture cache');
                return e
            }, i.fromCanvas = function(t, e) {
                return new i(n.fromCanvas(t, e))
            }, i.fromVideo = function(t, e) {
                return "string" == typeof t ? i.fromVideoUrl(t, e) : new i(s.fromVideo(t, e))
            }, i.fromVideoUrl = function(t, e) {
                return new i(s.fromUrl(t, e))
            }, i.from = function(t) {
                if ("string" == typeof t) {
                    var e = u.TextureCache[t];
                    if (!e) {
                        var r = null !== t.match(/\.(mp4|webm|ogg|h264|avi|mov)$/);
                        return r ? i.fromVideoUrl(t) : i.fromImage(t)
                    }
                    return e
                }
                return t instanceof HTMLCanvasElement ? i.fromCanvas(t) : t instanceof HTMLVideoElement ? i.fromVideo(t) : t instanceof n ? new i(n) : t
            }, i.addTextureToCache = function(t, e) {
                u.TextureCache[e] = t
            }, i.removeTextureFromCache = function(t) {
                var e = u.TextureCache[t];
                return delete u.TextureCache[t], delete u.BaseTextureCache[t], e
            }, i.EMPTY = new i(new n), i.EMPTY.destroy = function() {}, i.EMPTY.on = function() {}, i.EMPTY.once = function() {}, i.EMPTY.emit = function() {}
        }, {
            "../math": 67,
            "../utils": 116,
            "./BaseTexture": 107,
            "./TextureUvs": 110,
            "./VideoBaseTexture": 111,
            eventemitter3: 3
        }],
        110: [function(t, e, r) {
            function i() {
                this.x0 = 0, this.y0 = 0, this.x1 = 1, this.y1 = 0, this.x2 = 1, this.y2 = 1, this.x3 = 0, this.y3 = 1, this.uvsUint32 = new Uint32Array(4)
            }
            e.exports = i;
            var n = t("../math/GroupD8");
            i.prototype.set = function(t, e, r) {
                var i = e.width,
                    s = e.height;
                if (r) {
                    var o = t.width / 2 / i,
                        a = t.height / 2 / s,
                        h = t.x / i + o,
                        u = t.y / s + a;
                    r = n.add(r, n.NW), this.x0 = h + o * n.uX(r), this.y0 = u + a * n.uY(r), r = n.add(r, 2), this.x1 = h + o * n.uX(r), this.y1 = u + a * n.uY(r), r = n.add(r, 2), this.x2 = h + o * n.uX(r), this.y2 = u + a * n.uY(r), r = n.add(r, 2), this.x3 = h + o * n.uX(r), this.y3 = u + a * n.uY(r)
                } else this.x0 = t.x / i, this.y0 = t.y / s, this.x1 = (t.x + t.width) / i, this.y1 = t.y / s, this.x2 = (t.x + t.width) / i, this.y2 = (t.y + t.height) / s, this.x3 = t.x / i, this.y3 = (t.y + t.height) / s;
                this.uvsUint32[0] = (65535 * this.y0 & 65535) << 16 | 65535 * this.x0 & 65535, this.uvsUint32[1] = (65535 * this.y1 & 65535) << 16 | 65535 * this.x1 & 65535, this.uvsUint32[2] = (65535 * this.y2 & 65535) << 16 | 65535 * this.x2 & 65535, this.uvsUint32[3] = (65535 * this.y3 & 65535) << 16 | 65535 * this.x3 & 65535
            }
        }, {
            "../math/GroupD8": 63
        }],
        111: [function(t, e, r) {
            function i(t, e) {
                if (!t) throw new Error("No video source element specified.");
                (t.readyState === t.HAVE_ENOUGH_DATA || t.readyState === t.HAVE_FUTURE_DATA) && t.width && t.height && (t.complete = !0), s.call(this, t, e), this.autoUpdate = !1, this._onUpdate = this._onUpdate.bind(this), this._onCanPlay = this._onCanPlay.bind(this), t.complete || (t.addEventListener("canplay", this._onCanPlay), t.addEventListener("canplaythrough", this._onCanPlay), t.addEventListener("play", this._onPlayStart.bind(this)), t.addEventListener("pause", this._onPlayStop.bind(this))), this.__loaded = !1
            }

            function n(t, e) {
                e || (e = "video/" + t.substr(t.lastIndexOf(".") + 1));
                var r = document.createElement("source");
                return r.src = t, r.type = e, r
            }
            var s = t("./BaseTexture"),
                o = t("../utils");
            i.prototype = Object.create(s.prototype), i.prototype.constructor = i, e.exports = i, i.prototype._onUpdate = function() {
                this.autoUpdate && (window.requestAnimationFrame(this._onUpdate), this.update())
            }, i.prototype._onPlayStart = function() {
                this.hasLoaded || this._onCanPlay(), this.autoUpdate || (window.requestAnimationFrame(this._onUpdate), this.autoUpdate = !0)
            }, i.prototype._onPlayStop = function() {
                this.autoUpdate = !1
            }, i.prototype._onCanPlay = function() {
                this.hasLoaded = !0, this.source && (this.source.removeEventListener("canplay", this._onCanPlay), this.source.removeEventListener("canplaythrough", this._onCanPlay), this.width = this.source.videoWidth, this.height = this.source.videoHeight, this.source.play(), this.__loaded || (this.__loaded = !0, this.emit("loaded", this)))
            }, i.prototype.destroy = function() {
                this.source && this.source._pixiId && (delete o.BaseTextureCache[this.source._pixiId], delete this.source._pixiId), s.prototype.destroy.call(this)
            }, i.fromVideo = function(t, e) {
                t._pixiId || (t._pixiId = "video_" + o.uid());
                var r = o.BaseTextureCache[t._pixiId];
                return r || (r = new i(t, e), o.BaseTextureCache[t._pixiId] = r), r
            }, i.fromUrl = function(t, e) {
                var r = document.createElement("video");
                if (Array.isArray(t))
                    for (var s = 0; s < t.length; ++s) r.appendChild(n(t[s].src || t[s], t[s].mime));
                else r.appendChild(n(t.src || t, t.mime));
                return r.load(), r.play(), i.fromVideo(r, e)
            }, i.fromUrls = i.fromUrl
        }, {
            "../utils": 116,
            "./BaseTexture": 107
        }],
        112: [function(t, e, r) {		//"./Ticker": 112
            function i() {
                var t = this;
                this._tick = function(e) {
                    t._requestId = null, t.started && (t.update(e), t.started && null === t._requestId && t._emitter.listeners(o, !0) && (t._requestId = requestAnimationFrame(t._tick)))
                }, this._emitter = new s, this._requestId = null, this._maxElapsedMS = 100, this.autoStart = !1, this.deltaTime = 1, this.elapsedMS = 1 / n.TARGET_FPMS, this.lastTime = 0, this.speed = 1, this.started = !1
            }
            var n = t("../const"),
                s = t("eventemitter3"),
                o = "tick";
            Object.defineProperties(i.prototype, {
                FPS: {
                    get: function() {
                        return 1e3 / this.elapsedMS
                    }
                },
                minFPS: {
                    get: function() {
                        return 1e3 / this._maxElapsedMS
                    },
                    set: function(t) {
                        var e = Math.min(Math.max(0, t) / 1e3, n.TARGET_FPMS);
                        this._maxElapsedMS = 1 / e
                    }
                }
            }), i.prototype._requestIfNeeded = function() {
                null === this._requestId && this._emitter.listeners(o, !0) && (this.lastTime = performance.now(), this._requestId = requestAnimationFrame(this._tick))
            }, i.prototype._cancelIfNeeded = function() {
                null !== this._requestId && (cancelAnimationFrame(this._requestId), this._requestId = null)
            }, i.prototype._startIfPossible = function() {
                this.started ? this._requestIfNeeded() : this.autoStart && this.start()
            }, i.prototype.add = function(t, e) {
                return this._emitter.on(o, t, e), this._startIfPossible(), this
            }, i.prototype.addOnce = function(t, e) {
                return this._emitter.once(o, t, e), this._startIfPossible(), this
            }, i.prototype.remove = function(t, e) {
                return this._emitter.off(o, t, e), this._emitter.listeners(o, !0) || this._cancelIfNeeded(), this
            }, i.prototype.start = function() {
                this.started || (this.started = !0, this._requestIfNeeded())
            }, i.prototype.stop = function() {
                this.started && (this.started = !1, this._cancelIfNeeded())
            }, i.prototype.update = function(t) {
                var e;
                t = t || performance.now(), t > this.lastTime ? (e = this.elapsedMS = t - this.lastTime, e > this._maxElapsedMS && (e = this._maxElapsedMS), this.deltaTime = e * n.TARGET_FPMS * this.speed, this._emitter.emit(o, this.deltaTime)) : this.deltaTime = this.elapsedMS = 0, this.lastTime = t
            }, e.exports = i
        }, {
            "../const": 43,
            eventemitter3: 3
        }],
        113: [function(t, e, r) {
            var i = t("./Ticker"),
                n = new i;
            n.autoStart = !0, e.exports = {
                shared: n,
                Ticker: i
            }
        }, {
            "./Ticker": 112
        }],
        114: [function(t, e, r) {
            var i = function(t) {
                for (var e = 6 * t, r = new Uint16Array(e), i = 0, n = 0; i < e; i += 6, n += 4) r[i + 0] = n + 0, r[i + 1] = n + 1, r[i + 2] = n + 2, r[i + 3] = n + 0, r[i + 4] = n + 2, r[i + 5] = n + 3;
                return r
            };
            e.exports = i
        }, {}],
        115: [function(t, e, r) {
            var i, n = t("url"),
                s = function(t, e) {
                    if (0 === t.indexOf("data:")) return "";
                    e = e || window.location, i || (i = document.createElement("a")), i.href = t, t = n.parse(i.href);
                    var r = !t.port && "" === e.port || t.port === e.port;
                    return t.hostname === e.hostname && r && t.protocol === e.protocol ? "" : "anonymous"
                };
            e.exports = s
        }, {
            url: 28
        }],
        116: [function(t, e, r) {		//"../../utils": 116
            var i = t("../const"),
                n = e.exports = {
                    _uid: 0,
                    _saidHello: !1,
                    EventEmitter: t("eventemitter3"),
                    pluginTarget: t("./pluginTarget"),
                    uid: function() {
                        return ++n._uid
                    },
                    hex2rgb: function(t, e) {
                        return e = e || [], e[0] = (t >> 16 & 255) / 255, e[1] = (t >> 8 & 255) / 255, e[2] = (255 & t) / 255, e
                    },
                    hex2string: function(t) {
                        return t = t.toString(16), t = "000000".substr(0, 6 - t.length) + t, "#" + t
                    },
                    rgb2hex: function(t) {
                        return (255 * t[0] << 16) + (255 * t[1] << 8) + 255 * t[2]
                    },
                    getResolutionOfUrl: function(t) {
                        var e = i.RETINA_PREFIX.exec(t);
                        return e ? parseFloat(e[1]) : 1
                    },
                    sayHello: function(t) {
                        if (!n._saidHello) {
                            if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
                                var e = ["\n %c %c %c Pixi.js " + i.VERSION + " - âœ° " + t + " âœ°  %c  %c  http://www.pixijs.com/  %c %c â™¥%câ™¥%câ™¥ \n\n", "background: #ff66a5; padding:5px 0;", "background: #ff66a5; padding:5px 0;", "color: #ff66a5; background: #030307; padding:5px 0;", "background: #ff66a5; padding:5px 0;", "background: #ffc3dc; padding:5px 0;", "background: #ff66a5; padding:5px 0;", "color: #ff2424; background: #fff; padding:5px 0;", "color: #ff2424; background: #fff; padding:5px 0;", "color: #ff2424; background: #fff; padding:5px 0;"];
                                window.console.log.apply(console, e)
                            } else window.console && window.console.log("Pixi.js " + i.VERSION + " - " + t + " - http://www.pixijs.com/");
                            n._saidHello = !0
                        }
                    },
                    isWebGLSupported: function() {
                        var t = {
                            stencil: !0,
                            failIfMajorPerformanceCaveat: !0
                        };
                        try {
                            if (!window.WebGLRenderingContext) return !1;
                            var e = document.createElement("canvas"),
                                r = e.getContext("webgl", t) || e.getContext("experimental-webgl", t),
                                i = !(!r || !r.getContextAttributes().stencil);
                            if (r) {
                                var n = r.getExtension("WEBGL_lose_context");
                                n && n.loseContext()
                            }
                            return r = null, i
                        } catch (t) {
                            return !1
                        }
                    },
                    sign: function(t) {
                        return t ? t < 0 ? -1 : 1 : 0
                    },
                    removeItems: function(t, e, r) {
                        var i = t.length;
                        if (!(e >= i || 0 === r)) {
                            r = e + r > i ? i - e : r;
                            for (var n = e, s = i - r; n < s; ++n) t[n] = t[n + r];
                            t.length = s
                        }
                    },
                    TextureCache: {},
                    BaseTextureCache: {}
                }
        }, {
            "../const": 43,
            "./pluginTarget": 118,
            eventemitter3: 3
        }],
        117: [function(t, e, r) {		//"./utils/maxRecommendedTextures": 117
            var i = t("ismobilejs"),
                n = function(t) {
                    return i.tablet || i.phone ? 2 : t
                };
            e.exports = n
        }, {
            ismobilejs: 4
        }],
        118: [function(t, e, r) {		//"./pluginTarget": 118
            function i(t) {
                t.__plugins = {}, t.registerPlugin = function(e, r) {
                    t.__plugins[e] = r
                }, t.prototype.initPlugins = function() {
                    this.plugins = this.plugins || {};
                    for (var e in t.__plugins) this.plugins[e] = new t.__plugins[e](this)
                }, t.prototype.destroyPlugins = function() {
                    for (var t in this.plugins) this.plugins[t].destroy(), this.plugins[t] = null;
                    this.plugins = null
                }
            }
            e.exports = {
                mixin: function(t) {
                    i(t)
                }
            }
        }, {}],
        119: [function(t, e, r) {		//"./deprecation": 119
            var i = t("./core"),
                n = t("./mesh"),
                s = t("./particles"),
                o = t("./extras"),
                a = t("./filters");
            i.SpriteBatch = function() {
                throw new ReferenceError("SpriteBatch does not exist any more, please use the new ParticleContainer instead.")
            }, i.AssetLoader = function() {
                throw new ReferenceError("The loader system was overhauled in pixi v3, please see the new PIXI.loaders.Loader class.")
            }, Object.defineProperties(i, {
                Stage: {
                    get: function() {
                        return i.Container
                    }
                },
                DisplayObjectContainer: {
                    get: function() {
                        return i.Container
                    }
                },
                Strip: {
                    get: function() {
                        return n.Mesh
                    }
                },
                Rope: {
                    get: function() {
                        return n.Rope
                    }
                },
                ParticleContainer: {
                    get: function() {
                        return s.ParticleContainer
                    }
                },
                MovieClip: {
                    get: function() {
                        return o.MovieClip
                    }
                },
                TilingSprite: {
                    get: function() {
                        return o.TilingSprite
                    }
                },
                BitmapText: {
                    get: function() {
                        return o.BitmapText
                    }
                },
                blendModes: {
                    get: function() {
                        return i.BLEND_MODES
                    }
                },
                scaleModes: {
                    get: function() {
                        return i.SCALE_MODES
                    }
                },
                BaseTextureCache: {
                    get: function() {
                        return i.utils.BaseTextureCache
                    }
                },
                TextureCache: {
                    get: function() {
                        return i.utils.TextureCache
                    }
                },
                math: {
                    get: function() {
                        return i
                    }
                },
                AbstractFilter: {
                    get: function() {
                        return i.Filter
                    }
                },
                TransformManual: {
                    get: function() {
                        return i.TransformBase
                    }
                }
            }), i.DisplayObject.prototype.generateTexture = function(t, e, r) {
                return t.generateTexture(this, e, r)
            }, i.Graphics.prototype.generateTexture = function(t, e) {
                return this.generateCanvasTexture(t, e)
            }, i.RenderTexture.prototype.render = function(t, e, r, i) {
                this.legacyRenderer.render(t, this, r, e, !i)
            }, i.RenderTexture.prototype.getImage = function(t) {
                return this.legacyRenderer.extract.image(t)
            }, i.RenderTexture.prototype.getBase64 = function(t) {
                return this.legacyRenderer.extract.base64(t)
            }, i.RenderTexture.prototype.getCanvas = function(t) {
                return this.legacyRenderer.extract.canvas(t)
            }, i.RenderTexture.prototype.getPixels = function(t) {
                return this.legacyRenderer.pixels(t)
            }, i.Sprite.prototype.setTexture = function(t) {
                this.texture = t
            }, o.BitmapText.prototype.setText = function(t) {
                this.text = t
            }, i.Text.prototype.setText = function(t) {
                this.text = t
            }, i.Text.prototype.setStyle = function(t) {
                this.style = t
            }, Object.defineProperties(i.TextStyle.prototype, {
                font: {
                    get: function() {
                        var t = "number" == typeof this._fontSize ? this._fontSize + "px" : this._fontSize;
                        return this._fontStyle + " " + this._fontVariant + " " + this._fontWeight + " " + t + " " + this._fontFamily
                    },
                    set: function(t) {
                        t.indexOf("italic") > 1 ? this._fontStyle = "italic" : t.indexOf("oblique") > -1 ? this._fontStyle = "oblique" : this._fontStyle = "normal", t.indexOf("small-caps") > -1 ? this._fontVariant = "small-caps" : this._fontVariant = "normal";
                        var e, r = t.split(" "),
                            i = -1;
                        for (this._fontSize = 26, e = 0; e < r.length; ++e)
                            if (r[e].match(/(px|pt|em|%)/)) {
                                i = e, this._fontSize = r[e];
                                break
                            }
                        for (this._fontWeight = "normal", e = 0; e < i; ++e)
                            if (r[e].match(/(bold|bolder|lighter|100|200|300|400|500|600|700|800|900)/)) {
                                this._fontWeight = r[e];
                                break
                            }
                        if (i > -1 && i < r.length - 1) {
                            for (this._fontFamily = "", e = i + 1; e < r.length; ++e) this._fontFamily += r[e] + " ";
                            this._fontFamily = this._fontFamily.slice(0, -1)
                        } else this._fontFamily = "Arial";
                        this.styleID++
                    }
                }
            }), i.Texture.prototype.setFrame = function(t) {
                this.frame = t
            }, Object.defineProperties(a, {
                AbstractFilter: {
                    get: function() {
                        return i.AbstractFilter
                    }
                },
                SpriteMaskFilter: {
                    get: function() {
                        return i.SpriteMaskFilter
                    }
                }
            }), i.utils.uuid = function() {
                return i.utils.uid()
            }, i.utils.canUseNewCanvasBlendModes = function() {
                return i.CanvasTinter.canUseMultiply
            }
        }, {
            "./core": 62,
            "./extras": 129,
            "./filters": 140,
            "./mesh": 156,
            "./particles": 159
        }],
        120: [function(t, e, r) {		//"./canvas/CanvasExtract": 120
            function i(t) {
                this.renderer = t, t.extract = this
            }
            var n = t("../../core"),
                s = new n.Rectangle;
            i.prototype.constructor = i, e.exports = i, i.prototype.image = function(t) {
                var e = new Image;
                return e.src = this.base64(t), e
            }, i.prototype.base64 = function(t) {
                return this.canvas(t).toDataURL()
            }, i.prototype.canvas = function(t) {
                var e, r, i, o, a = this.renderer;
                t && (o = t instanceof n.RenderTexture ? t : a.generateTexture(t)), o ? (e = o.baseTexture._canvasRenderTarget.context, r = o.baseTexture._canvasRenderTarget.resolution, i = o.frame) : (e = a.rootContext, r = a.rootResolution, i = s, i.width = this.renderer.width, i.height = this.renderer.height);
                var h = i.width * r,
                    u = i.height * r,
                    l = new n.CanvasRenderTarget(h, u),
                    c = e.getImageData(i.x * r, i.y * r, h, u);
                return l.context.putImageData(c, 0, 0), l.canvas
            }, i.prototype.pixels = function(t) {
                var e, r, i, o, a = this.renderer;
                return t && (o = t instanceof n.RenderTexture ? t : a.generateTexture(t)), o ? (e = o.baseTexture._canvasRenderTarget.context, r = o.baseTexture._canvasRenderTarget.resolution, i = o.frame) : (e = a.rootContext, r = a.rootResolution, i = s, i.width = a.width, i.height = a.height), e.getImageData(0, 0, i.width * r, i.height * r).data
            }, i.prototype.destroy = function() {
                this.renderer.extract = null, this.renderer = null
            }, n.CanvasRenderer.registerPlugin("extract", i)
        }, {
            "../../core": 62
        }],
        121: [function(t, e, r) {
            e.exports = {
                webGL: t("./webgl/WebGLExtract"),
                canvas: t("./canvas/CanvasExtract")
            }
        }, {
            "./canvas/CanvasExtract": 120,
            "./webgl/WebGLExtract": 122
        }],
        122: [function(t, e, r) {		//"./webgl/WebGLExtract": 122
            function i(t) {
                this.renderer = t, t.extract = this
            }
            var n = t("../../core"),
                s = new n.Rectangle;
            i.prototype.constructor = i, e.exports = i, i.prototype.image = function(t) {
                var e = new Image;
                return e.src = this.base64(t), e
            }, i.prototype.base64 = function(t) {
                return this.canvas(t).toDataURL()
            }, i.prototype.canvas = function(t) {
                var e, r, i, o, a = this.renderer,
                    h = !1;
                t && (o = t instanceof n.RenderTexture ? t : this.renderer.generateTexture(t)), o ? (e = o.baseTexture._glRenderTargets[this.renderer.CONTEXT_UID], r = e.resolution, i = o.frame, h = !1) : (e = this.renderer.rootRenderTarget, r = e.resolution, h = !0, i = s, i.width = e.size.width, i.height = e.size.height);
                var u = i.width * r,
                    l = i.height * r,
                    c = new n.CanvasRenderTarget(u, l);
                if (e) {
                    a.bindRenderTarget(e);
                    var d = new Uint8Array(4 * u * l),
                        p = a.gl;
                    p.readPixels(i.x * r, i.y * r, u, l, p.RGBA, p.UNSIGNED_BYTE, d);
                    var f = c.context.getImageData(0, 0, u, l);
                    f.data.set(d), c.context.putImageData(f, 0, 0), h && (c.context.scale(1, -1), c.context.drawImage(c.canvas, 0, -l))
                }
                return c.canvas
            }, i.prototype.pixels = function(t) {
                var e, r, i, o, a = this.renderer;
                t && (o = t instanceof n.RenderTexture ? t : this.renderer.generateTexture(t)), o ? (e = o.baseTexture._glRenderTargets[this.renderer.CONTEXT_UID], r = e.resolution, i = o.frame) : (e = this.renderer.rootRenderTarget, r = e.resolution, i = s, i.width = e.size.width, i.height = e.size.height);
                var h = i.width * r,
                    u = i.height * r,
                    l = new Uint8Array(4 * h * u);
                if (e) {
                    a.bindRenderTarget(e);
                    var c = a.gl;
                    c.readPixels(i.x * r, i.y * r, h, u, c.RGBA, c.UNSIGNED_BYTE, l)
                }
                return l
            }, i.prototype.destroy = function() {
                this.renderer.extract = null, this.renderer = null
            }, n.WebGLRenderer.registerPlugin("extract", i)
        }, {
            "../../core": 62
        }],
        123: [function(t, e, r) {		//"./BitmapText": 123
            function i(t, e) {
                n.Container.call(this), e = e || {}, this.textWidth = 0, this.textHeight = 0, this._glyphs = [], this._font = {
                    tint: void 0 !== e.tint ? e.tint : 16777215,
                    align: e.align || "left",
                    name: null,
                    size: 0
                }, this.font = e.font, this._text = t, this.maxWidth = 0, this.maxLineHeight = 0, this._anchor = new s(this.makeDirty, this, 0, 0), this.dirty = !1, this.updateText()
            }
            var n = t("../core"),
                s = t("../core/math/ObservablePoint");
            i.prototype = Object.create(n.Container.prototype), i.prototype.constructor = i, e.exports = i, Object.defineProperties(i.prototype, {
                tint: {
                    get: function() {
                        return this._font.tint
                    },
                    set: function(t) {
                        this._font.tint = "number" == typeof t && t >= 0 ? t : 16777215, this.dirty = !0
                    }
                },
                align: {
                    get: function() {
                        return this._font.align
                    },
                    set: function(t) {
                        this._font.align = t || "left", this.dirty = !0
                    }
                },
                anchor: {
                    get: function() {
                        return this._anchor
                    },
                    set: function(t) {
                        "number" == typeof t ? this._anchor.set(t) : this._anchor.copy(t)
                    }
                },
                font: {
                    get: function() {
                        return this._font
                    },
                    set: function(t) {
                        t && ("string" == typeof t ? (t = t.split(" "), this._font.name = 1 === t.length ? t[0] : t.slice(1).join(" "), this._font.size = t.length >= 2 ? parseInt(t[0], 10) : i.fonts[this._font.name].size) : (this._font.name = t.name, this._font.size = "number" == typeof t.size ? t.size : parseInt(t.size, 10)), this.dirty = !0)
                    }
                },
                text: {
                    get: function() {
                        return this._text
                    },
                    set: function(t) {
                        t = t.toString() || " ", this._text !== t && (this._text = t, this.dirty = !0)
                    }
                }
            }), i.prototype.updateText = function() {
                for (var t = i.fonts[this._font.name], e = new n.Point, r = null, s = [], o = 0, a = 0, h = [], u = 0, l = this._font.size / t.size, c = -1, d = 0, p = 0, f = 0; f < this.text.length; f++) {
                    var v = this.text.charCodeAt(f);
                    if (/(\s)/.test(this.text.charAt(f)) && (c = f, d = o), /(?:\r\n|\r|\n)/.test(this.text.charAt(f))) h.push(o), a = Math.max(a, o), u++, e.x = 0, e.y += t.lineHeight, r = null;
                    else if (c !== -1 && this.maxWidth > 0 && e.x * l > this.maxWidth) n.utils.removeItems(s, c, f - c), f = c, c = -1, h.push(d), a = Math.max(a, d), u++, e.x = 0, e.y += t.lineHeight, r = null;
                    else {
                        var g = t.chars[v];
                        g && (r && g.kerning[r] && (e.x += g.kerning[r]), s.push({
                            texture: g.texture,
                            line: u,
                            charCode: v,
                            position: new n.Point(e.x + g.xOffset, e.y + g.yOffset)
                        }), o = e.x + (g.texture.width + g.xOffset), e.x += g.xAdvance, p = Math.max(p, g.yOffset + g.texture.height), r = v)
                    }
                }
                h.push(o), a = Math.max(a, o);
                var y = [];
                for (f = 0; f <= u; f++) {
                    var x = 0;
                    "right" === this._font.align ? x = a - h[f] : "center" === this._font.align && (x = (a - h[f]) / 2), y.push(x)
                }
                var m = s.length,
                    _ = this.tint;
                for (f = 0; f < m; f++) {
                    var b = this._glyphs[f];
                    b ? b.texture = s[f].texture : (b = new n.Sprite(s[f].texture), this._glyphs.push(b)), b.position.x = (s[f].position.x + y[s[f].line]) * l, b.position.y = s[f].position.y * l, b.scale.x = b.scale.y = l, b.tint = _, b.parent || this.addChild(b)
                }
                for (f = m; f < this._glyphs.length; ++f) this.removeChild(this._glyphs[f]);
                if (this.textWidth = a * l, this.textHeight = (e.y + t.lineHeight) * l, 0 !== this.anchor.x || 0 !== this.anchor.y)
                    for (f = 0; f < m; f++) this._glyphs[f].x -= this.textWidth * this.anchor.x, this._glyphs[f].y -= this.textHeight * this.anchor.y;
                this.maxLineHeight = p * l
            }, i.prototype.updateTransform = function() {
                this.validate(), this.containerUpdateTransform()
            }, i.prototype.getLocalBounds = function() {
                return this.validate(), n.Container.prototype.getLocalBounds.call(this)
            }, i.prototype.validate = function() {
                this.dirty && (this.updateText(), this.dirty = !1)
            }, i.prototype.makeDirty = function() {
                this.dirty = !0
            }, i.fonts = {}
        }, {
            "../core": 62,
            "../core/math/ObservablePoint": 65
        }],
        124: [function(t, e, r) {		//"./MovieClip": 124
            function i(t) {
                n.Sprite.call(this, t[0] instanceof n.Texture ? t[0] : t[0].texture), this._textures = null, this._durations = null, this.textures = t, this.animationSpeed = 1, this.loop = !0, this.onComplete = null, this._currentTime = 0, this.playing = !1
            }
            var n = t("../core");
            i.prototype = Object.create(n.Sprite.prototype), i.prototype.constructor = i, e.exports = i, Object.defineProperties(i.prototype, {
                totalFrames: {
                    get: function() {
                        return this._textures.length
                    }
                },
                textures: {
                    get: function() {
                        return this._textures
                    },
                    set: function(t) {
                        if (t[0] instanceof n.Texture) this._textures = t, this._durations = null;
                        else {
                            this._textures = [], this._durations = [];
                            for (var e = 0; e < t.length; e++) this._textures.push(t[e].texture), this._durations.push(t[e].time)
                        }
                    }
                },
                currentFrame: {
                    get: function() {
                        var t = Math.floor(this._currentTime) % this._textures.length;
                        return t < 0 && (t += this._textures.length), t
                    }
                }
            }), i.prototype.stop = function() {
                this.playing && (this.playing = !1, n.ticker.shared.remove(this.update, this))
            }, i.prototype.play = function() {
                this.playing || (this.playing = !0, n.ticker.shared.add(this.update, this))
            }, i.prototype.gotoAndStop = function(t) {
                this.stop(), this._currentTime = t, this._texture = this._textures[this.currentFrame], this._textureID = -1
            }, i.prototype.gotoAndPlay = function(t) {
                this._currentTime = t, this.play()
            }, i.prototype.update = function(t) {
                var e = this.animationSpeed * t;
                if (null !== this._durations) {
                    var r = this._currentTime % 1 * this._durations[this.currentFrame];
                    for (r += e / 60 * 1e3; r < 0;) this._currentTime--, r += this._durations[this.currentFrame];
                    var i = Math.sign(this.animationSpeed * t);
                    for (this._currentTime = Math.floor(this._currentTime); r >= this._durations[this.currentFrame];) r -= this._durations[this.currentFrame] * i, this._currentTime += i;
                    this._currentTime += r / this._durations[this.currentFrame]
                } else this._currentTime += e;
                this._currentTime < 0 && !this.loop ? (this.gotoAndStop(0), this.onComplete && this.onComplete()) : this._currentTime >= this._textures.length && !this.loop ? (this.gotoAndStop(this._textures.length - 1), this.onComplete && this.onComplete()) : (this._texture = this._textures[this.currentFrame], this._textureID = -1)
            }, i.prototype.destroy = function() {
                this.stop(), n.Sprite.prototype.destroy.call(this)
            }, i.fromFrames = function(t) {
                for (var e = [], r = 0; r < t.length; ++r) e.push(n.Texture.fromFrame(t[r]));
                return new i(e)
            }, i.fromImages = function(t) {
                for (var e = [], r = 0; r < t.length; ++r) e.push(n.Texture.fromImage(t[r]));
                return new i(e)
            }
        }, {
            "../core": 62
        }],
        125: [function(t, e, r) {		//"./TilingSprite": 125
            function i(t, e, r) {
                n.Sprite.call(this, t), this.tileScale = new n.Point(1, 1), this.tilePosition = new n.Point(0, 0), this._width = e || 100, this._height = r || 100, this._uvs = new n.TextureUvs, this._canvasPattern = null, this._glDatas = []
            }
            var n = t("../core"),
                s = new n.Point,
                o = t("../core/textures/Texture"),
                a = t("../core/sprites/canvas/CanvasTinter"),
                h = t("./webgl/TilingShader"),
                u = new Float32Array(4);
            i.prototype = Object.create(n.Sprite.prototype), i.prototype.constructor = i, e.exports = i, Object.defineProperties(i.prototype, {
                width: {
                    get: function() {
                        return this._width
                    },
                    set: function(t) {
                        this._width = t
                    }
                },
                height: {
                    get: function() {
                        return this._height
                    },
                    set: function(t) {
                        this._height = t
                    }
                }
            }), i.prototype._onTextureUpdate = function() {}, i.prototype._renderWebGL = function(t) {
                var e = this._texture;
                if (e && e._uvs) {
                    t.flush();
                    var r = t.gl,
                        i = this._glDatas[t.CONTEXT_UID];
                    i || (i = {
                        shader: new h(r),
                        quad: new n.Quad(r)
                    }, this._glDatas[t.CONTEXT_UID] = i, i.quad.initVao(i.shader));
                    var s = i.quad.vertices;
                    s[0] = s[6] = this._width * -this.anchor.x, s[1] = s[3] = this._height * -this.anchor.y, s[2] = s[4] = this._width * (1 - this.anchor.x), s[5] = s[7] = this._height * (1 - this.anchor.y), i.quad.upload(), t.bindShader(i.shader);
                    var o = e._uvs,
                        a = e._frame.width,
                        l = e._frame.height,
                        c = e.baseTexture.width,
                        d = e.baseTexture.height,
                        p = i.shader.uniforms.uPixelSize;
                    p[0] = 1 / c, p[1] = 1 / d, i.shader.uniforms.uPixelSize = p;
                    var f = i.shader.uniforms.uFrame;
                    f[0] = o.x0, f[1] = o.y0, f[2] = o.x1 - o.x0, f[3] = o.y2 - o.y0, i.shader.uniforms.uFrame = f;
                    var v = i.shader.uniforms.uTransform;
                    v[0] = this.tilePosition.x % (a * this.tileScale.x) / this._width, v[1] = this.tilePosition.y % (l * this.tileScale.y) / this._height, v[2] = c / this._width * this.tileScale.x, v[3] = d / this._height * this.tileScale.y, i.shader.uniforms.uTransform = v, i.shader.uniforms.translationMatrix = this.worldTransform.toArray(!0);
                    var g = u;
                    n.utils.hex2rgb(this.tint, g), g[3] = this.worldAlpha, i.shader.uniforms.uColor = g, t.bindTexture(this._texture, 0), t.state.setBlendMode(this.blendMode), i.quad.draw()
                }
            }, i.prototype._renderCanvas = function(t) {
                var e = this._texture;
                if (e.baseTexture.hasLoaded) {
                    var r = t.context,
                        i = this.worldTransform,
                        s = t.resolution,
                        o = e.baseTexture,
                        h = this.tilePosition.x / this.tileScale.x % e._frame.width,
                        u = this.tilePosition.y / this.tileScale.y % e._frame.height;
                    if (!this._canvasPattern) {
                        var l = new n.CanvasRenderTarget(e._frame.width, e._frame.height);
                        16777215 !== this.tint ? (this.cachedTint !== this.tint && (this.cachedTint = this.tint, this.tintedTexture = a.getTintedTexture(this, this.tint)), l.context.drawImage(this.tintedTexture, 0, 0)) : l.context.drawImage(o.source, -e._frame.x, -e._frame.y), this._canvasPattern = l.context.createPattern(l.canvas, "repeat")
                    }
                    r.globalAlpha = this.worldAlpha, r.setTransform(i.a * s, i.b * s, i.c * s, i.d * s, i.tx * s, i.ty * s), r.scale(this.tileScale.x, this.tileScale.y), r.translate(h + this.anchor.x * -this._width, u + this.anchor.y * -this._height);
                    var c = t.blendModes[this.blendMode];
                    c !== t.context.globalCompositeOperation && (r.globalCompositeOperation = c), r.fillStyle = this._canvasPattern, r.fillRect(-h, -u, this._width / this.tileScale.x, this._height / this.tileScale.y)
                }
            }, i.prototype.getBounds = function() {
                var t, e, r, i, n = this._width,
                    s = this._height,
                    o = n * (1 - this.anchor.x),
                    a = n * -this.anchor.x,
                    h = s * (1 - this.anchor.y),
                    u = s * -this.anchor.y,
                    l = this.worldTransform,
                    c = l.a,
                    d = l.b,
                    p = l.c,
                    f = l.d,
                    v = l.tx,
                    g = l.ty,
                    y = c * a + p * u + v,
                    x = f * u + d * a + g,
                    m = c * o + p * u + v,
                    _ = f * u + d * o + g,
                    b = c * o + p * h + v,
                    T = f * h + d * o + g,
                    E = c * a + p * h + v,
                    w = f * h + d * a + g;
                t = y, t = m < t ? m : t, t = b < t ? b : t, t = E < t ? E : t, r = x, r = _ < r ? _ : r, r = T < r ? T : r, r = w < r ? w : r, e = y, e = m > e ? m : e, e = b > e ? b : e, e = E > e ? E : e, i = x, i = _ > i ? _ : i, i = T > i ? T : i, i = w > i ? w : i;
                var S = this._bounds;
                return S.x = t, S.width = e - t, S.y = r, S.height = i - r, this._currentBounds = S, S
            }, i.prototype.containsPoint = function(t) {
                this.worldTransform.applyInverse(t, s);
                var e, r = this._width,
                    i = this._height,
                    n = -r * this.anchor.x;
                return s.x > n && s.x < n + r && (e = -i * this.anchor.y, s.y > e && s.y < e + i)
            }, i.prototype.destroy = function() {
                n.Sprite.prototype.destroy.call(this), this.tileScale = null, this._tileScaleOffset = null, this.tilePosition = null, this._uvs = null
            }, i.from = function(t, e, r) {
                return new i(o.from(t), e, r)
            }, i.fromFrame = function(t, e, r) {
                var s = n.utils.TextureCache[t];
                if (!s) throw new Error('The frameId "' + t + '" does not exist in the texture cache ' + this);
                return new i(s, e, r)
            }, i.fromImage = function(t, e, r, s, o) {
                return new i(n.Texture.fromImage(t, s, o), e, r)
            }
        }, {
            "../core": 62,
            "../core/sprites/canvas/CanvasTinter": 100,
            "../core/textures/Texture": 109,
            "./webgl/TilingShader": 130
        }],
        126: [function(t, e, r) {		//"./cacheAsBitmap": 126
            var i = t("../core"),
                n = i.DisplayObject,
                s = new i.Matrix;
            n.prototype._cacheAsBitmap = !1, n.prototype._cacheData = !1;
            var o = function() {
                this.originalRenderWebGL = null, this.originalRenderCanvas = null, this.originalCalculateBounds = null, this.originalGetLocalBounds = null, this.originalUpdateTransform = null, this.originalHitTest = null, this.originalDestroy = null, this.originalMask = null, this.originalFilterArea = null, this.sprite = null
            };
            Object.defineProperties(n.prototype, {
                cacheAsBitmap: {
                    get: function() {
                        return this._cacheAsBitmap
                    },
                    set: function(t) {
                        if (this._cacheAsBitmap !== t) {
                            this._cacheAsBitmap = t;
                            var e;
                            t ? (this._cacheData || (this._cacheData = new o), e = this._cacheData, e.originalRenderWebGL = this.renderWebGL, e.originalRenderCanvas = this.renderCanvas, e.originalUpdateTransform = this.updateTransform, e.originalCalculateBounds = this._calculateBounds, e.originalGetLocalBounds = this.getLocalBounds, e.originalDestroy = this.destroy, e.originalContainsPoint = this.containsPoint, e.originalMask = this._mask, e.originalFilterArea = this.filterArea, this.renderWebGL = this._renderCachedWebGL, this.renderCanvas = this._renderCachedCanvas, this.destroy = this._cacheAsBitmapDestroy) : (e = this._cacheData, e.sprite && this._destroyCachedDisplayObject(), this.renderWebGL = e.originalRenderWebGL, this.renderCanvas = e.originalRenderCanvas, this._calculateBounds = e.originalCalculateBounds, this.getLocalBounds = e.originalGetLocalBounds, this.destroy = e.originalDestroy, this.updateTransform = e.originalUpdateTransform, this.containsPoint = e.originalContainsPoint, this._mask = e.originalMask, this.filterArea = e.originalFilterArea)
                        }
                    }
                }
            }), n.prototype._renderCachedWebGL = function(t) {
                !this.visible || this.worldAlpha <= 0 || !this.renderable || (this._initCachedDisplayObject(t), this._cacheData.sprite._transformID = -1, this._cacheData.sprite.worldAlpha = this.worldAlpha, this._cacheData.sprite._renderWebGL(t))
            }, n.prototype._initCachedDisplayObject = function(t) {
                if (!this._cacheData || !this._cacheData.sprite) {
                    var e = this.alpha;
                    this.alpha = 1, t.currentRenderer.flush();
                    var r = this.getLocalBounds().clone();
                    if (this._filters) {
                        var n = this._filters[0].padding;
                        r.pad(n)
                    }
                    var o = t._activeRenderTarget,
                        a = t.filterManager.filterStack,
                        h = i.RenderTexture.create(0 | r.width, 0 | r.height),
                        u = s;
                    u.tx = -r.x, u.ty = -r.y, this.transform.worldTransform.identity(), this.renderWebGL = this._cacheData.originalRenderWebGL, t.render(this, h, !0, u, !0), t.bindRenderTarget(o), t.filterManager.filterStack = a, this.renderWebGL = this._renderCachedWebGL, this.updateTransform = this.displayObjectUpdateTransform, this._mask = null, this.filterArea = null;
                    var l = new i.Sprite(h);
                    l.transform.worldTransform = this.transform.worldTransform, l.anchor.x = -(r.x / r.width), l.anchor.y = -(r.y / r.height), l.alpha = e, l._bounds = this._bounds, this._calculateBounds = this._calculateCachedBounds, this.getLocalBounds = this._getCachedLocalBounds, this._cacheData.sprite = l, this.transform._parentID = -1, this.updateTransform(), this.containsPoint = l.containsPoint.bind(l)
                }
            }, n.prototype._renderCachedCanvas = function(t) {
                !this.visible || this.worldAlpha <= 0 || !this.renderable || (this._initCachedDisplayObjectCanvas(t), this._cacheData.sprite.worldAlpha = this.worldAlpha, this._cacheData.sprite.renderCanvas(t))
            }, n.prototype._initCachedDisplayObjectCanvas = function(t) {
                if (!this._cacheData || !this._cacheData.sprite) {
                    var e = this.getLocalBounds(),
                        r = this.alpha;
                    this.alpha = 1;
                    var n = t.context,
                        o = new i.RenderTexture.create(0 | e.width, 0 | e.height),
                        a = s;
                    this.transform.worldTransform.copy(a), a.invert(), a.tx -= e.x, a.ty -= e.y, this.renderCanvas = this._cacheData.originalRenderCanvas, t.render(this, o, !0, a, !1), t.context = n, this.renderCanvas = this._renderCachedCanvas, this._calculateBounds = this._calculateCachedBounds, this._mask = null, this.filterArea = null;
                    var h = new i.Sprite(o);
                    h.transform.worldTransform = this.transform.worldTransform, h.anchor.x = -(e.x / e.width), h.anchor.y = -(e.y / e.height), h._bounds = this._bounds, h.alpha = r, this.updateTransform(), this.updateTransform = this.displayObjectUpdateTransform, this._cacheData.sprite = h, this.containsPoint = h.containsPoint.bind(h)
                }
            }, n.prototype._calculateCachedBounds = function() {
                return this._cacheData.sprite._calculateBounds()
            }, n.prototype._getCachedLocalBounds = function() {
                return this._cacheData.sprite.getLocalBounds()
            }, n.prototype._destroyCachedDisplayObject = function() {
                this._cacheData.sprite._texture.destroy(!0), this._cacheData.sprite = null
            }, n.prototype._cacheAsBitmapDestroy = function() {
                this.cacheAsBitmap = !1, this.destroy()
            }
        }, {
            "../core": 62
        }],
        127: [function(t, e, r) {		//"./getChildByName": 127
            var i = t("../core");
            i.DisplayObject.prototype.name = null, i.Container.prototype.getChildByName = function(t) {
                for (var e = 0; e < this.children.length; e++)
                    if (this.children[e].name === t) return this.children[e];
                return null
            }
        }, {
            "../core": 62
        }],
        128: [function(t, e, r) {		//"./getGlobalPosition": 128
            var i = t("../core");
            i.DisplayObject.prototype.getGlobalPosition = function(t) {
                return t = t || new i.Point, this.parent ? (this.displayObjectUpdateTransform(), t.x = this.worldTransform.tx, t.y = this.worldTransform.ty) : (t.x = this.position.x, t.y = this.position.y), t
            }
        }, {
            "../core": 62
        }],
        129: [function(t, e, r) {		//"./extras": 129
            t("./cacheAsBitmap"), t("./getChildByName"), t("./getGlobalPosition"), e.exports = {
                MovieClip: t("./MovieClip"),
                TilingSprite: t("./TilingSprite"),
                BitmapText: t("./BitmapText")
            }
        }, {
            "./BitmapText": 123,
            "./MovieClip": 124,
            "./TilingSprite": 125,
            "./cacheAsBitmap": 126,
            "./getChildByName": 127,
            "./getGlobalPosition": 128
        }],
        130: [function(t, e, r) {		//"./webgl/TilingShader": 130
            function i(t) {
                n.call(this, t, "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\n\nuniform vec4 uFrame;\nuniform vec4 uTransform;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vec2 coord = aTextureCoord;\n    coord -= uTransform.xy;\n    coord /= uTransform.zw;\n    vTextureCoord = coord;\n}\n", "#define GLSLIFY 1\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\nuniform vec4 uFrame;\nuniform vec2 uPixelSize;\n\nvoid main(void)\n{\n\n   \tvec2 coord = mod(vTextureCoord, uFrame.zw);\n   \tcoord = clamp(coord, uPixelSize, uFrame.zw - uPixelSize);\n   \tcoord += uFrame.xy;\n\n   \tvec4 sample = texture2D(uSampler, coord);\n  \tvec4 color = vec4(uColor.rgb * uColor.a, uColor.a);\n\n   \tgl_FragColor = sample * color ;\n}\n")
            }
            var n = t("../../core/Shader");
            i.prototype = Object.create(n.prototype), i.prototype.constructor = i, e.exports = i
        }, {
            "../../core/Shader": 42
        }],
        131: [function(t, e, r) {
            function i(t, e, r) {
                n.Filter.call(this), this.blurXFilter = new s, this.blurYFilter = new o, this.resolution = 1, this.padding = 0, this.resolution = r || 1, this.quality = e || 4, this.blur = t || 8
            }
            var n = t("../../core"),
                s = t("./BlurXFilter"),
                o = t("./BlurYFilter");
            i.prototype = Object.create(n.Filter.prototype), i.prototype.constructor = i, e.exports = i, i.prototype.apply = function(t, e, r) {
                var i = t.getRenderTarget(!0);
                this.blurXFilter.apply(t, e, i, !0), this.blurYFilter.apply(t, i, r, !1), t.returnRenderTarget(i)
            }, Object.defineProperties(i.prototype, {
                blur: {
                    get: function() {
                        return this.blurXFilter.blur
                    },
                    set: function(t) {
                        this.blurXFilter.blur = this.blurYFilter.blur = t, this.padding = 2 * Math.max(Math.abs(this.blurYFilter.strength), Math.abs(this.blurYFilter.strength))
                    }
                },
                quality: {
                    get: function() {
                        return this.blurXFilter.quality
                    },
                    set: function(t) {
                        this.blurXFilter.quality = this.blurYFilter.quality = t
                    }
                },
                blurX: {
                    get: function() {
                        return this.blurXFilter.blur
                    },
                    set: function(t) {
                        this.blurXFilter.blur = t, this.padding = 2 * Math.max(Math.abs(this.blurYFilter.strength), Math.abs(this.blurYFilter.strength))
                    }
                },
                blurY: {
                    get: function() {
                        return this.blurYFilter.blur
                    },
                    set: function(t) {
                        this.blurYFilter.blur = t, this.padding = 2 * Math.max(Math.abs(this.blurYFilter.strength), Math.abs(this.blurYFilter.strength))
                    }
                }
            })
        }, {
            "../../core": 62,
            "./BlurXFilter": 132,
            "./BlurYFilter": 133
        }],
        132: [function(t, e, r) {		//"./BlurXFilter": 132
            function i(t, e, r) {
                var i = s(5, !0),
                    a = o(5);
                n.Filter.call(this, i, a), this.resolution = r || 1, this._quality = 0, this.quality = e || 4, this.strength = t || 8, this.firstRun = !0
            }
            var n = t("../../core"),
                s = t("./generateBlurVertSource"),
                o = t("./generateBlurFragSource"),
                a = t("./getMaxBlurKernelSize");
            i.prototype = Object.create(n.Filter.prototype), i.prototype.constructor = i, e.exports = i, i.prototype.apply = function(t, e, r, i) {
                if (this.firstRun) {
                    var n = t.renderer.gl,
                        h = a(n);
                    this.vertexSrc = s(h, !0), this.fragmentSrc = o(h), this.firstRun = !1
                }
                if (this.uniforms.strength = 1 / r.size.width * (r.size.width / e.size.width), this.uniforms.strength *= this.strength, this.uniforms.strength /= this.passes, 1 === this.passes) t.applyFilter(this, e, r, i);
                else {
                    for (var u = t.getRenderTarget(!0), l = e, c = u, d = 0; d < this.passes - 1; d++) {
                        t.applyFilter(this, l, c, !0);
                        var p = c;
                        c = l, l = p
                    }
                    t.applyFilter(this, l, r, i), t.returnRenderTarget(u)
                }
            }, Object.defineProperties(i.prototype, {
                blur: {
                    get: function() {
                        return this.strength
                    },
                    set: function(t) {
                        this.padding = 2 * Math.abs(t), this.strength = t
                    }
                },
                quality: {
                    get: function() {
                        return this._quality
                    },
                    set: function(t) {
                        this._quality = t, this.passes = t
                    }
                }
            })
        }, {
            "../../core": 62,
            "./generateBlurFragSource": 134,
            "./generateBlurVertSource": 135,
            "./getMaxBlurKernelSize": 136
        }],
        133: [function(t, e, r) {		//"./BlurYFilter": 133
            function i(t, e, r) {
                var i = s(5, !1),
                    a = o(5);
                n.Filter.call(this, i, a), this.resolution = r || 1, this._quality = 0, this.quality = e || 4, this.strength = t || 8, this.firstRun = !0
            }
            var n = t("../../core"),
                s = t("./generateBlurVertSource"),
                o = t("./generateBlurFragSource"),
                a = t("./getMaxBlurKernelSize");
            i.prototype = Object.create(n.Filter.prototype), i.prototype.constructor = i, e.exports = i, i.prototype.apply = function(t, e, r, i) {
                if (this.firstRun) {
                    var n = t.renderer.gl,
                        h = a(n);
                    this.vertexSrc = s(h, !1), this.fragmentSrc = o(h), this.firstRun = !1
                }
                if (this.uniforms.strength = 1 / r.size.height * (r.size.height / e.size.height), this.uniforms.strength *= this.strength, this.uniforms.strength /= this.passes, 1 === this.passes) t.applyFilter(this, e, r, i);
                else {
                    for (var u = t.getRenderTarget(!0), l = e, c = u, d = 0; d < this.passes - 1; d++) {
                        t.applyFilter(this, l, c, !0);
                        var p = c;
                        c = l, l = p
                    }
                    t.applyFilter(this, l, r, i), t.returnRenderTarget(u)
                }
            }, Object.defineProperties(i.prototype, {
                blur: {
                    get: function() {
                        return this.strength
                    },
                    set: function(t) {
                        this.padding = 2 * Math.abs(t), this.strength = t
                    }
                },
                quality: {
                    get: function() {
                        return this._quality
                    },
                    set: function(t) {
                        this._quality = t, this.passes = t
                    }
                }
            })
        }, {
            "../../core": 62,
            "./generateBlurFragSource": 134,
            "./generateBlurVertSource": 135,
            "./getMaxBlurKernelSize": 136
        }],
        134: [function(t, e, r) {		//"./generateBlurFragSource": 134
            var i = {
                    5: [.153388, .221461, .250301],
                    7: [.071303, .131514, .189879, .214607],
                    9: [.028532, .067234, .124009, .179044, .20236],
                    11: [.0093, .028002, .065984, .121703, .175713, .198596],
                    13: [.002406, .009255, .027867, .065666, .121117, .174868, .197641],
                    15: [489e-6, .002403, .009246, .02784, .065602, .120999, .174697, .197448]
                },
                n = ["varying vec2 vBlurTexCoords[%size%];", "uniform sampler2D uSampler;", "void main(void)", "{", "\tgl_FragColor = vec4(0.0);", "\t%blur%", "}"].join("\n"),
                s = function(t) {
                    for (var e, r = i[t], s = r.length, o = n, a = "", h = "gl_FragColor += texture2D(uSampler, vBlurTexCoords[%index%]) * %value%;", u = 0; u < t; u++) {
                        var l = h.replace("%index%", u);
                        e = u, u >= s && (e = t - u - 1), l = l.replace("%value%", r[e]), a += l, a += "\n"
                    }
                    return o = o.replace("%blur%", a), o = o.replace("%size%", t)
                };
            e.exports = s
        }, {}],
        135: [function(t, e, r) {		//"./generateBlurVertSource": 135
            var i = ["attribute vec2 aVertexPosition;", "attribute vec2 aTextureCoord;", "uniform float strength;", "uniform mat3 projectionMatrix;", "varying vec2 vBlurTexCoords[%size%];", "void main(void)", "{", "gl_Position = vec4((projectionMatrix * vec3((aVertexPosition), 1.0)).xy, 0.0, 1.0);", "%blur%", "}"].join("\n"),
                n = function(t, e) {
                    var r, n, s = Math.ceil(t / 2),
                        o = i,
                        a = "";
                    r = e ? "vBlurTexCoords[%index%] = aTextureCoord + vec2(%sampleIndex% * strength, 0.0);" : "vBlurTexCoords[%index%] = aTextureCoord + vec2(0.0, %sampleIndex% * strength);";
                    for (var h = 0; h < t; h++) {
                        var u = r.replace("%index%", h);
                        n = h, h >= s && (n = t - h - 1), u = u.replace("%sampleIndex%", h - (s - 1) + ".0"), a += u, a += "\n"
                    }
                    return o = o.replace("%blur%", a), o = o.replace("%size%", t)
                };
            e.exports = n
        }, {}],
        136: [function(t, e, r) {		//"./getMaxBlurKernelSize": 136
            var i = function(t) {
                for (var e = t.getParameter(t.MAX_VARYING_VECTORS), r = 15; r > e;) r -= 2;
                return r
            };
            e.exports = i
        }, {}],
        137: [function(t, e, r) {
            function i() {
                n.Filter.call(this, "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float m[20];\n\nvoid main(void)\n{\n\n    vec4 c = texture2D(uSampler, vTextureCoord);\n\n    gl_FragColor.r = (m[0] * c.r);\n        gl_FragColor.r += (m[1] * c.g);\n        gl_FragColor.r += (m[2] * c.b);\n        gl_FragColor.r += (m[3] * c.a);\n        gl_FragColor.r += m[4] * c.a;\n\n    gl_FragColor.g = (m[5] * c.r);\n        gl_FragColor.g += (m[6] * c.g);\n        gl_FragColor.g += (m[7] * c.b);\n        gl_FragColor.g += (m[8] * c.a);\n        gl_FragColor.g += m[9] * c.a;\n\n     gl_FragColor.b = (m[10] * c.r);\n        gl_FragColor.b += (m[11] * c.g);\n        gl_FragColor.b += (m[12] * c.b);\n        gl_FragColor.b += (m[13] * c.a);\n        gl_FragColor.b += m[14] * c.a;\n\n     gl_FragColor.a = (m[15] * c.r);\n        gl_FragColor.a += (m[16] * c.g);\n        gl_FragColor.a += (m[17] * c.b);\n        gl_FragColor.a += (m[18] * c.a);\n        gl_FragColor.a += m[19] * c.a;\n\n//    gl_FragColor = vec4(m[0]);\n}\n"), this.uniforms.m = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]
            }
            var n = t("../../core");
            i.prototype = Object.create(n.Filter.prototype), i.prototype.constructor = i, e.exports = i, i.prototype._loadMatrix = function(t, e) {
                e = !!e;
                var r = t;
                e && (this._multiply(r, this.uniforms.m, t), r = this._colorMatrix(r)), this.uniforms.m = r
            }, i.prototype._multiply = function(t, e, r) {
                return t[0] = e[0] * r[0] + e[1] * r[5] + e[2] * r[10] + e[3] * r[15], t[1] = e[0] * r[1] + e[1] * r[6] + e[2] * r[11] + e[3] * r[16], t[2] = e[0] * r[2] + e[1] * r[7] + e[2] * r[12] + e[3] * r[17], t[3] = e[0] * r[3] + e[1] * r[8] + e[2] * r[13] + e[3] * r[18], t[4] = e[0] * r[4] + e[1] * r[9] + e[2] * r[14] + e[3] * r[19], t[5] = e[5] * r[0] + e[6] * r[5] + e[7] * r[10] + e[8] * r[15], t[6] = e[5] * r[1] + e[6] * r[6] + e[7] * r[11] + e[8] * r[16], t[7] = e[5] * r[2] + e[6] * r[7] + e[7] * r[12] + e[8] * r[17], t[8] = e[5] * r[3] + e[6] * r[8] + e[7] * r[13] + e[8] * r[18], t[9] = e[5] * r[4] + e[6] * r[9] + e[7] * r[14] + e[8] * r[19], t[10] = e[10] * r[0] + e[11] * r[5] + e[12] * r[10] + e[13] * r[15], t[11] = e[10] * r[1] + e[11] * r[6] + e[12] * r[11] + e[13] * r[16], t[12] = e[10] * r[2] + e[11] * r[7] + e[12] * r[12] + e[13] * r[17], t[13] = e[10] * r[3] + e[11] * r[8] + e[12] * r[13] + e[13] * r[18], t[14] = e[10] * r[4] + e[11] * r[9] + e[12] * r[14] + e[13] * r[19], t[15] = e[15] * r[0] + e[16] * r[5] + e[17] * r[10] + e[18] * r[15], t[16] = e[15] * r[1] + e[16] * r[6] + e[17] * r[11] + e[18] * r[16], t[17] = e[15] * r[2] + e[16] * r[7] + e[17] * r[12] + e[18] * r[17], t[18] = e[15] * r[3] + e[16] * r[8] + e[17] * r[13] + e[18] * r[18], t[19] = e[15] * r[4] + e[16] * r[9] + e[17] * r[14] + e[18] * r[19], t
            }, i.prototype._colorMatrix = function(t) {
                var e = new Float32Array(t);
                return e[4] /= 255, e[9] /= 255, e[14] /= 255, e[19] /= 255, e
            }, i.prototype.brightness = function(t, e) {
                var r = [t, 0, 0, 0, 0, 0, t, 0, 0, 0, 0, 0, t, 0, 0, 0, 0, 0, 1, 0];
                this._loadMatrix(r, e)
            }, i.prototype.greyscale = function(t, e) {
                var r = [t, t, t, 0, 0, t, t, t, 0, 0, t, t, t, 0, 0, 0, 0, 0, 1, 0];
                this._loadMatrix(r, e)
            }, i.prototype.grayscale = i.prototype.greyscale, i.prototype.blackAndWhite = function(t) {
                var e = [.3, .6, .1, 0, 0, .3, .6, .1, 0, 0, .3, .6, .1, 0, 0, 0, 0, 0, 1, 0];
                this._loadMatrix(e, t)
            }, i.prototype.hue = function(t, e) {
                t = (t || 0) / 180 * Math.PI;
                var r = Math.cos(t),
                    i = Math.sin(t),
                    n = Math.sqrt,
                    s = 1 / 3,
                    o = n(s),
                    a = r + (1 - r) * s,
                    h = s * (1 - r) - o * i,
                    u = s * (1 - r) + o * i,
                    l = s * (1 - r) + o * i,
                    c = r + s * (1 - r),
                    d = s * (1 - r) - o * i,
                    p = s * (1 - r) - o * i,
                    f = s * (1 - r) + o * i,
                    v = r + s * (1 - r),
                    g = [a, h, u, 0, 0, l, c, d, 0, 0, p, f, v, 0, 0, 0, 0, 0, 1, 0];
                this._loadMatrix(g, e)
            }, i.prototype.contrast = function(t, e) {
                var r = (t || 0) + 1,
                    i = -128 * (r - 1),
                    n = [r, 0, 0, 0, i, 0, r, 0, 0, i, 0, 0, r, 0, i, 0, 0, 0, 1, 0];
                this._loadMatrix(n, e)
            }, i.prototype.saturate = function(t, e) {
                var r = 2 * (t || 0) / 3 + 1,
                    i = (r - 1) * -.5,
                    n = [r, i, i, 0, 0, i, r, i, 0, 0, i, i, r, 0, 0, 0, 0, 0, 1, 0];
                this._loadMatrix(n, e)
            }, i.prototype.desaturate = function() {
                this.saturate(-1)
            }, i.prototype.negative = function(t) {
                var e = [0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0];
                this._loadMatrix(e, t)
            }, i.prototype.sepia = function(t) {
                var e = [.393, .7689999, .18899999, 0, 0, .349, .6859999, .16799999, 0, 0, .272, .5339999, .13099999, 0, 0, 0, 0, 0, 1, 0];
                this._loadMatrix(e, t)
            }, i.prototype.technicolor = function(t) {
                var e = [1.9125277891456083, -.8545344976951645, -.09155508482755585, 0, 11.793603434377337, -.3087833385928097, 1.7658908555458428, -.10601743074722245, 0, -70.35205161461398, -.231103377548616, -.7501899197440212, 1.847597816108189, 0, 30.950940869491138, 0, 0, 0, 1, 0];
                this._loadMatrix(e, t)
            }, i.prototype.polaroid = function(t) {
                var e = [1.438, -.062, -.062, 0, 0, -.122, 1.378, -.122, 0, 0, -.016, -.016, 1.483, 0, 0, 0, 0, 0, 1, 0];
                this._loadMatrix(e, t)
            }, i.prototype.toBGR = function(t) {
                var e = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0];
                this._loadMatrix(e, t)
            }, i.prototype.kodachrome = function(t) {
                var e = [1.1285582396593525, -.3967382283601348, -.03992559172921793, 0, 63.72958762196502, -.16404339962244616, 1.0835251566291304, -.05498805115633132, 0, 24.732407896706203, -.16786010706155763, -.5603416277695248, 1.6014850761964943, 0, 35.62982807460946, 0, 0, 0, 1, 0];
                this._loadMatrix(e, t)
            }, i.prototype.browni = function(t) {
                var e = [.5997023498159715, .34553243048391263, -.2708298674538042, 0, 47.43192855600873, -.037703249837783157, .8609577587992641, .15059552388459913, 0, -36.96841498319127, .24113635128153335, -.07441037908422492, .44972182064877153, 0, -7.562075277591283, 0, 0, 0, 1, 0];
                this._loadMatrix(e, t)
            }, i.prototype.vintage = function(t) {
                var e = [.6279345635605994, .3202183420819367, -.03965408211312453, 0, 9.651285835294123, .02578397704808868, .6441188644374771, .03259127616149294, 0, 7.462829176470591, .0466055556782719, -.0851232987247891, .5241648018700465, 0, 5.159190588235296, 0, 0, 0, 1, 0];
                this._loadMatrix(e, t)
            }, i.prototype.colorTone = function(t, e, r, i, n) {
                t = t || .2, e = e || .15, r = r || 16770432, i = i || 3375104;
                var s = (r >> 16 & 255) / 255,
                    o = (r >> 8 & 255) / 255,
                    a = (255 & r) / 255,
                    h = (i >> 16 & 255) / 255,
                    u = (i >> 8 & 255) / 255,
                    l = (255 & i) / 255,
                    c = [.3, .59, .11, 0, 0, s, o, a, t, 0, h, u, l, e, 0, s - h, o - u, a - l, 0, 0];
                this._loadMatrix(c, n)
            }, i.prototype.night = function(t, e) {
                t = t || .1;
                var r = [t * -2, -t, 0, 0, 0, -t, 0, t, 0, 0, 0, t, 2 * t, 0, 0, 0, 0, 0, 1, 0];
                this._loadMatrix(r, e)
            }, i.prototype.predator = function(t, e) {
                var r = [11.224130630493164 * t, -4.794486999511719 * t, -2.8746118545532227 * t, 0 * t, .40342438220977783 * t, -3.6330697536468506 * t, 9.193157196044922 * t, -2.951810836791992 * t, 0 * t, -1.316135048866272 * t, -3.2184197902679443 * t, -4.2375030517578125 * t, 7.476448059082031 * t, 0 * t, .8044459223747253 * t, 0, 0, 0, 1, 0];
                this._loadMatrix(r, e)
            }, i.prototype.lsd = function(t) {
                var e = [2, -.4, .5, 0, 0, -.5, 2, -.4, 0, 0, -.4, -.5, 3, 0, 0, 0, 0, 0, 1, 0];
                this._loadMatrix(e, t)
            }, i.prototype.reset = function() {
                var t = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
                this._loadMatrix(t, !1)
            }, Object.defineProperties(i.prototype, {
                matrix: {
                    get: function() {
                        return this.uniforms.m
                    },
                    set: function(t) {
                        this.uniforms.m = t
                    }
                }
            })
        }, {
            "../../core": 62
        }],
        138: [function(t, e, r) {
            function i(t, e) {
                var r = new n.Matrix;
                t.renderable = !1, n.Filter.call(this, "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 filterMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vFilterCoord;\n\nvoid main(void)\n{\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vFilterCoord = ( filterMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n   vTextureCoord = aTextureCoord;\n}", "#define GLSLIFY 1\nvarying vec2 vFilterCoord;\nvarying vec2 vTextureCoord;\n\nuniform vec2 scale;\n\nuniform sampler2D uSampler;\nuniform sampler2D mapSampler;\n\nuniform vec4 filterClamp;\n\nvoid main(void)\n{\n   vec4 map =  texture2D(mapSampler, vFilterCoord);\n\n   map -= 0.5;\n   map.xy *= scale;\n\n   gl_FragColor = texture2D(uSampler, clamp(vec2(vTextureCoord.x + map.x, vTextureCoord.y + map.y), filterClamp.xy, filterClamp.zw));\n}\n"), this.maskSprite = t, this.maskMatrix = r, this.uniforms.mapSampler = t.texture, this.uniforms.filterMatrix = r.toArray(!0), this.uniforms.scale = {
                    x: 1,
                    y: 1
                }, null !== e && void 0 !== e || (e = 20), this.scale = new n.Point(e, e)
            }
            var n = t("../../core");
            i.prototype = Object.create(n.Filter.prototype), i.prototype.constructor = i, e.exports = i, i.prototype.apply = function(t, e, r) {
                var i = 1 / r.destinationFrame.width * (r.size.width / e.size.width);
                this.uniforms.filterMatrix = t.calculateSpriteMatrix(this.maskMatrix, this.maskSprite), this.uniforms.scale.x = this.scale.x * i, this.uniforms.scale.y = this.scale.y * i, t.applyFilter(this, e, r)
            }, Object.defineProperties(i.prototype, {
                map: {
                    get: function() {
                        return this.uniforms.mapSampler
                    },
                    set: function(t) {
                        this.uniforms.mapSampler = t
                    }
                }
            })
        }, {
            "../../core": 62
        }],
        139: [function(t, e, r) {
            function i() {
                n.Filter.call(this, "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nuniform vec4 filterArea;\n\nvarying vec2 vTextureCoord;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvoid texcoords(vec2 fragCoord, vec2 resolution,\n               out vec2 v_rgbNW, out vec2 v_rgbNE,\n               out vec2 v_rgbSW, out vec2 v_rgbSE,\n               out vec2 v_rgbM) {\n    vec2 inverseVP = 1.0 / resolution.xy;\n    v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;\n    v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;\n    v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;\n    v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;\n    v_rgbM = vec2(fragCoord * inverseVP);\n}\n\nvoid main(void) {\n\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n   vTextureCoord = aTextureCoord;\n\n   vec2 fragCoord = vTextureCoord * filterArea.xy;\n\n   texcoords(fragCoord, filterArea.xy, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n}", '#define GLSLIFY 1\nvarying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\n/**\n Basic FXAA implementation based on the code on geeks3d.com with the\n modification that the texture2DLod stuff was removed since it\'s\n unsupported by WebGL.\n \n --\n \n From:\n https://github.com/mitsuhiko/webgl-meincraft\n \n Copyright (c) 2011 by Armin Ronacher.\n \n Some rights reserved.\n \n Redistribution and use in source and binary forms, with or without\n modification, are permitted provided that the following conditions are\n met:\n \n * Redistributions of source code must retain the above copyright\n notice, this list of conditions and the following disclaimer.\n \n * Redistributions in binary form must reproduce the above\n copyright notice, this list of conditions and the following\n disclaimer in the documentation and/or other materials provided\n with the distribution.\n \n * The names of the contributors may not be used to endorse or\n promote products derived from this software without specific\n prior written permission.\n \n THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS\n "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT\n LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR\n A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT\n OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,\n SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,\n DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY\n THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\n OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n */\n\n#ifndef FXAA_REDUCE_MIN\n#define FXAA_REDUCE_MIN   (1.0/ 128.0)\n#endif\n#ifndef FXAA_REDUCE_MUL\n#define FXAA_REDUCE_MUL   (1.0 / 8.0)\n#endif\n#ifndef FXAA_SPAN_MAX\n#define FXAA_SPAN_MAX     8.0\n#endif\n\n//optimized version for mobile, where dependent\n//texture reads can be a bottleneck\nvec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 resolution,\n          vec2 v_rgbNW, vec2 v_rgbNE,\n          vec2 v_rgbSW, vec2 v_rgbSE,\n          vec2 v_rgbM) {\n    vec4 color;\n    mediump vec2 inverseVP = vec2(1.0 / resolution.x, 1.0 / resolution.y);\n    vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;\n    vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;\n    vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;\n    vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;\n    vec4 texColor = texture2D(tex, v_rgbM);\n    vec3 rgbM  = texColor.xyz;\n    vec3 luma = vec3(0.299, 0.587, 0.114);\n    float lumaNW = dot(rgbNW, luma);\n    float lumaNE = dot(rgbNE, luma);\n    float lumaSW = dot(rgbSW, luma);\n    float lumaSE = dot(rgbSE, luma);\n    float lumaM  = dot(rgbM,  luma);\n    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n    \n    mediump vec2 dir;\n    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\n    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\n    \n    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *\n                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n    \n    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),\n              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\n                  dir * rcpDirMin)) * inverseVP;\n    \n    vec3 rgbA = 0.5 * (\n                       texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +\n                       texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);\n    vec3 rgbB = rgbA * 0.5 + 0.25 * (\n                                     texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +\n                                     texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);\n    \n    float lumaB = dot(rgbB, luma);\n    if ((lumaB < lumaMin) || (lumaB > lumaMax))\n        color = vec4(rgbA, texColor.a);\n    else\n        color = vec4(rgbB, texColor.a);\n    return color;\n}\n\nvoid main() {\n\n  \tvec2 fragCoord = vTextureCoord * filterArea.xy;\n\n  \tvec4 color;\n\n    color = fxaa(uSampler, fragCoord, filterArea.xy, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n\n  \tgl_FragColor = color;\n}\n')
            }
            var n = t("../../core");
            i.prototype = Object.create(n.Filter.prototype), i.prototype.constructor = i, e.exports = i
        }, {
            "../../core": 62
        }],
        140: [function(t, e, r) {		//PIXI. filters的类
            e.exports = {
                FXAAFilter: t("./fxaa/FXAAFilter"),			//快速近似抗锯齿
                NoiseFilter: t("./noise/NoiseFilter"),
                DisplacementFilter: t("./displacement/DisplacementFilter"),
                BlurFilter: t("./blur/BlurFilter"),
                BlurXFilter: t("./blur/BlurXFilter"),
                BlurYFilter: t("./blur/BlurYFilter"),
                ColorMatrixFilter: t("./colormatrix/ColorMatrixFilter"),			//颜色矩阵
                VoidFilter: t("./void/VoidFilter")
            }
        }, {
            "./blur/BlurFilter": 131,
            "./blur/BlurXFilter": 132,
            "./blur/BlurYFilter": 133,
            "./colormatrix/ColorMatrixFilter": 137,
            "./displacement/DisplacementFilter": 138,
            "./fxaa/FXAAFilter": 139,
            "./noise/NoiseFilter": 141,
            "./void/VoidFilter": 142
        }],	
        141: [function(t, e, r) {		//"./noise/NoiseFilter": 141
            function i() {
                n.Filter.call(this, "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "precision highp float;\n#define GLSLIFY 1\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform float noise;\nuniform sampler2D uSampler;\n\nfloat rand(vec2 co)\n{\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main()\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    float diff = (rand(gl_FragCoord.xy) - 0.5) * noise;\n\n    color.r += diff;\n    color.g += diff;\n    color.b += diff;\n\n    gl_FragColor = color;\n}\n"), this.noise = .5
            }
            var n = t("../../core");
            i.prototype = Object.create(n.Filter.prototype), i.prototype.constructor = i, e.exports = i, Object.defineProperties(i.prototype, {
                noise: {
                    get: function() {
                        return this.uniforms.noise
                    },
                    set: function(t) {
                        this.uniforms.noise = t
                    }
                }
            })
        }, {
            "../../core": 62
        }],
        142: [function(t, e, r) {		//"./void/VoidFilter": 142
            function i() {
                n.Filter.call(this, "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "#define GLSLIFY 1\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n   gl_FragColor = texture2D(uSampler, vTextureCoord);\n}\n"), this.glShaderKey = "void"
            }
            var n = t("../../core");
            i.prototype = Object.create(n.Filter.prototype), i.prototype.constructor = i, e.exports = i
        }, {
            "../../core": 62
        }],
        143: [function(t, e, r) {		//"./InteractionData": 143
            function i() {
                this.global = new n.Point, this.target = null, this.originalEvent = null
            }
            var n = t("../core");
            i.prototype.constructor = i, e.exports = i, i.prototype.getLocalPosition = function(t, e, r) {
                return t.worldTransform.applyInverse(r || this.global, e)
            }
        }, {
            "../core": 62
        }],
        144: [function(t, e, r) {
            function i(t, e) {
                o.call(this), e = e || {}, this.renderer = t, this.autoPreventDefault = void 0 === e.autoPreventDefault || e.autoPreventDefault, this.interactionFrequency = e.interactionFrequency || 10, this.mouse = new s, this.mouse.global.set(-999999), this.eventData = {
                    stopped: !1,
                    target: null,
                    type: null,
                    data: this.mouse,
                    stopPropagation: function() {
                        this.stopped = !0
                    }
                }, this.interactiveDataPool = [], this.interactionDOMElement = null, this.moveWhenInside = !1, this.eventsAdded = !1, this.onMouseUp = this.onMouseUp.bind(this), this.processMouseUp = this.processMouseUp.bind(this), this.onMouseDown = this.onMouseDown.bind(this), this.processMouseDown = this.processMouseDown.bind(this), this.onMouseMove = this.onMouseMove.bind(this), this.processMouseMove = this.processMouseMove.bind(this), this.onMouseOut = this.onMouseOut.bind(this), this.processMouseOverOut = this.processMouseOverOut.bind(this), this.onMouseOver = this.onMouseOver.bind(this), this.onTouchStart = this.onTouchStart.bind(this), this.processTouchStart = this.processTouchStart.bind(this), this.onTouchEnd = this.onTouchEnd.bind(this), this.processTouchEnd = this.processTouchEnd.bind(this), this.onTouchMove = this.onTouchMove.bind(this), this.processTouchMove = this.processTouchMove.bind(this), this.defaultCursorStyle = "inherit", this.currentCursorStyle = "inherit", this._tempPoint = new n.Point, this.resolution = 1, this.setTargetElement(this.renderer.view, this.renderer.resolution)
            }
            var n = t("../core"),
                s = t("./InteractionData"),
                o = t("eventemitter3");
            Object.assign(n.DisplayObject.prototype, t("./interactiveTarget")), i.prototype = Object.create(o.prototype), i.prototype.constructor = i, e.exports = i, i.prototype.setTargetElement = function(t, e) {
                this.removeEvents(), this.interactionDOMElement = t, this.resolution = e || 1, this.addEvents()
            }, i.prototype.addEvents = function() {
                this.interactionDOMElement && (n.ticker.shared.add(this.update, this), window.navigator.msPointerEnabled && (this.interactionDOMElement.style["-ms-content-zooming"] = "none", this.interactionDOMElement.style["-ms-touch-action"] = "none"), window.document.addEventListener("mousemove", this.onMouseMove, !0), this.interactionDOMElement.addEventListener("mousedown", this.onMouseDown, !0), this.interactionDOMElement.addEventListener("mouseout", this.onMouseOut, !0), this.interactionDOMElement.addEventListener("mouseover", this.onMouseOver, !0), this.interactionDOMElement.addEventListener("touchstart", this.onTouchStart, !0), this.interactionDOMElement.addEventListener("touchend", this.onTouchEnd, !0), this.interactionDOMElement.addEventListener("touchmove", this.onTouchMove, !0), window.addEventListener("mouseup", this.onMouseUp, !0), this.eventsAdded = !0)
            }, i.prototype.removeEvents = function() {
                this.interactionDOMElement && (n.ticker.shared.remove(this.update), window.navigator.msPointerEnabled && (this.interactionDOMElement.style["-ms-content-zooming"] = "", this.interactionDOMElement.style["-ms-touch-action"] = ""), window.document.removeEventListener("mousemove", this.onMouseMove, !0), this.interactionDOMElement.removeEventListener("mousedown", this.onMouseDown, !0), this.interactionDOMElement.removeEventListener("mouseout", this.onMouseOut, !0), this.interactionDOMElement.removeEventListener("mouseover", this.onMouseOver, !0), this.interactionDOMElement.removeEventListener("touchstart", this.onTouchStart, !0), this.interactionDOMElement.removeEventListener("touchend", this.onTouchEnd, !0), this.interactionDOMElement.removeEventListener("touchmove", this.onTouchMove, !0), this.interactionDOMElement = null, window.removeEventListener("mouseup", this.onMouseUp, !0), this.eventsAdded = !1)
            }, i.prototype.update = function(t) {
                if (this._deltaTime += t, !(this._deltaTime < this.interactionFrequency) && (this._deltaTime = 0, this.interactionDOMElement)) {
                    if (this.didMove) return void(this.didMove = !1);
                    this.cursor = this.defaultCursorStyle,
                        this.processInteractive(this.mouse.global, this.renderer._lastObjectRendered, this.processMouseOverOut, !0), this.currentCursorStyle !== this.cursor && (this.currentCursorStyle = this.cursor, this.interactionDOMElement.style.cursor = this.cursor)
                }
            }, i.prototype.dispatchEvent = function(t, e, r) {
                r.stopped || (r.target = t, r.type = e, t.emit(e, r), t[e] && t[e](r))
            }, i.prototype.mapPositionToPoint = function(t, e, r) {
                var i;
                i = this.interactionDOMElement.parentElement ? this.interactionDOMElement.getBoundingClientRect() : {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0
                }, t.x = (e - i.left) * (this.interactionDOMElement.width / i.width) / this.resolution, t.y = (r - i.top) * (this.interactionDOMElement.height / i.height) / this.resolution
            }, i.prototype.processInteractive = function(t, e, r, i, n) {
                if (!e || !e.visible) return !1;
                var s = !1,
                    o = n = e.interactive || n;
                if (e.hitArea && (o = !1), i && e._mask && (e._mask.containsPoint(t) || (i = !1)), i && e.filterArea && (e.filterArea.contains(t.x, t.y) || (i = !1)), e.interactiveChildren)
                    for (var a = e.children, h = a.length - 1; h >= 0; h--) {
                        var u = a[h];
                        if (this.processInteractive(t, u, r, i, o)) {
                            if (!u.parent) continue;
                            s = !0, o = !1, i = !1
                        }
                    }
                return n && (i && !s && (e.hitArea ? (e.worldTransform.applyInverse(t, this._tempPoint), s = e.hitArea.contains(this._tempPoint.x, this._tempPoint.y)) : e.containsPoint && (s = e.containsPoint(t))), e.interactive && r(e, s)), s
            }, i.prototype.onMouseDown = function(t) {
                this.mouse.originalEvent = t, this.eventData.data = this.mouse, this.eventData.stopped = !1, this.mapPositionToPoint(this.mouse.global, t.clientX, t.clientY), this.autoPreventDefault && this.mouse.originalEvent.preventDefault(), this.processInteractive(this.mouse.global, this.renderer._lastObjectRendered, this.processMouseDown, !0);
                var e = 2 === t.button || 3 === t.which;
                this.emit(e ? "rightdown" : "mousedown", this.eventData)
            }, i.prototype.processMouseDown = function(t, e) {
                var r = this.mouse.originalEvent,
                    i = 2 === r.button || 3 === r.which;
                e && (t[i ? "_isRightDown" : "_isLeftDown"] = !0, this.dispatchEvent(t, i ? "rightdown" : "mousedown", this.eventData))
            }, i.prototype.onMouseUp = function(t) {
                this.mouse.originalEvent = t, this.eventData.data = this.mouse, this.eventData.stopped = !1, this.mapPositionToPoint(this.mouse.global, t.clientX, t.clientY), this.processInteractive(this.mouse.global, this.renderer._lastObjectRendered, this.processMouseUp, !0);
                var e = 2 === t.button || 3 === t.which;
                this.emit(e ? "rightup" : "mouseup", this.eventData)
            }, i.prototype.processMouseUp = function(t, e) {
                var r = this.mouse.originalEvent,
                    i = 2 === r.button || 3 === r.which,
                    n = i ? "_isRightDown" : "_isLeftDown";
                e ? (this.dispatchEvent(t, i ? "rightup" : "mouseup", this.eventData), t[n] && (t[n] = !1, this.dispatchEvent(t, i ? "rightclick" : "click", this.eventData))) : t[n] && (t[n] = !1, this.dispatchEvent(t, i ? "rightupoutside" : "mouseupoutside", this.eventData))
            }, i.prototype.onMouseMove = function(t) {
                this.mouse.originalEvent = t, this.eventData.data = this.mouse, this.eventData.stopped = !1, this.mapPositionToPoint(this.mouse.global, t.clientX, t.clientY), this.didMove = !0, this.cursor = this.defaultCursorStyle, this.processInteractive(this.mouse.global, this.renderer._lastObjectRendered, this.processMouseMove, !0), this.emit("mousemove", this.eventData), this.currentCursorStyle !== this.cursor && (this.currentCursorStyle = this.cursor, this.interactionDOMElement.style.cursor = this.cursor)
            }, i.prototype.processMouseMove = function(t, e) {
                this.processMouseOverOut(t, e), this.moveWhenInside && !e || this.dispatchEvent(t, "mousemove", this.eventData)
            }, i.prototype.onMouseOut = function(t) {
                this.mouse.originalEvent = t, this.eventData.data = this.mouse, this.eventData.stopped = !1, this.mapPositionToPoint(this.mouse.global, t.clientX, t.clientY), this.interactionDOMElement.style.cursor = this.defaultCursorStyle, this.mapPositionToPoint(this.mouse.global, t.clientX, t.clientY), this.processInteractive(this.mouse.global, this.renderer._lastObjectRendered, this.processMouseOverOut, !1), this.emit("mouseout", this.eventData)
            }, i.prototype.processMouseOverOut = function(t, e) {
                e ? (t._over || (t._over = !0, this.dispatchEvent(t, "mouseover", this.eventData)), t.buttonMode && (this.cursor = t.defaultCursor)) : t._over && (t._over = !1, this.dispatchEvent(t, "mouseout", this.eventData))
            }, i.prototype.onMouseOver = function(t) {
                this.mouse.originalEvent = t, this.eventData.data = this.mouse, this.eventData.stopped = !1, this.emit("mouseover", this.eventData)
            }, i.prototype.onTouchStart = function(t) {
                this.autoPreventDefault && t.preventDefault();
                for (var e = t.changedTouches, r = e.length, i = 0; i < r; i++) {
                    var n = e[i],
                        s = this.getTouchData(n);
                    s.originalEvent = t, this.eventData.data = s, this.eventData.stopped = !1, this.processInteractive(s.global, this.renderer._lastObjectRendered, this.processTouchStart, !0), this.emit("touchstart", this.eventData), this.returnTouchData(s)
                }
            }, i.prototype.processTouchStart = function(t, e) {
                e && (t._touchDown = !0, this.dispatchEvent(t, "touchstart", this.eventData))
            }, i.prototype.onTouchEnd = function(t) {
                this.autoPreventDefault && t.preventDefault();
                for (var e = t.changedTouches, r = e.length, i = 0; i < r; i++) {
                    var n = e[i],
                        s = this.getTouchData(n);
                    s.originalEvent = t, this.eventData.data = s, this.eventData.stopped = !1, this.processInteractive(s.global, this.renderer._lastObjectRendered, this.processTouchEnd, !0), this.emit("touchend", this.eventData), this.returnTouchData(s)
                }
            }, i.prototype.processTouchEnd = function(t, e) {
                e ? (this.dispatchEvent(t, "touchend", this.eventData), t._touchDown && (t._touchDown = !1, this.dispatchEvent(t, "tap", this.eventData))) : t._touchDown && (t._touchDown = !1, this.dispatchEvent(t, "touchendoutside", this.eventData))
            }, i.prototype.onTouchMove = function(t) {
                this.autoPreventDefault && t.preventDefault();
                for (var e = t.changedTouches, r = e.length, i = 0; i < r; i++) {
                    var n = e[i],
                        s = this.getTouchData(n);
                    s.originalEvent = t, this.eventData.data = s, this.eventData.stopped = !1, this.processInteractive(s.global, this.renderer._lastObjectRendered, this.processTouchMove, this.moveWhenInside), this.emit("touchmove", this.eventData), this.returnTouchData(s)
                }
            }, i.prototype.processTouchMove = function(t, e) {
                this.moveWhenInside && !e || this.dispatchEvent(t, "touchmove", this.eventData)
            }, i.prototype.getTouchData = function(t) {
                var e = this.interactiveDataPool.pop();
                return e || (e = new s), e.identifier = t.identifier, this.mapPositionToPoint(e.global, t.clientX, t.clientY), navigator.isCocoonJS && (e.global.x = e.global.x / this.resolution, e.global.y = e.global.y / this.resolution), t.globalX = e.global.x, t.globalY = e.global.y, e
            }, i.prototype.returnTouchData = function(t) {
                this.interactiveDataPool.push(t)
            }, i.prototype.destroy = function() {
                this.removeEvents(), this.removeAllListeners(), this.renderer = null, this.mouse = null, this.eventData = null, this.interactiveDataPool = null, this.interactionDOMElement = null, this.onMouseUp = null, this.processMouseUp = null, this.onMouseDown = null, this.processMouseDown = null, this.onMouseMove = null, this.processMouseMove = null, this.onMouseOut = null, this.processMouseOverOut = null, this.onMouseOver = null, this.onTouchStart = null, this.processTouchStart = null, this.onTouchEnd = null, this.processTouchEnd = null, this.onTouchMove = null, this.processTouchMove = null, this._tempPoint = null
            }, n.WebGLRenderer.registerPlugin("interaction", i), n.CanvasRenderer.registerPlugin("interaction", i)
        }, {
            "../core": 62,
            "./InteractionData": 143,
            "./interactiveTarget": 146,
            eventemitter3: 3
        }],
        145: [function(t, e, r) {
            e.exports = {
                InteractionData: t("./InteractionData"),
                InteractionManager: t("./InteractionManager"),
                interactiveTarget: t("./interactiveTarget")
            }
        }, {
            "./InteractionData": 143,
            "./InteractionManager": 144,
            "./interactiveTarget": 146
        }],
        146: [function(t, e, r) {		//"./interactiveTarget": 146
            var i = {
                interactive: !1,
                interactiveChildren: !0,
                hitArea: null,
                buttonMode: !1,
                defaultCursor: "pointer",
                _over: !1,
                _isLeftDown: !1,
                _isRightDown: !1,
                _touchDown: !1
            };
            e.exports = i
        }, {}],
        147: [function(t, e, r) {
            function i(t, e) {
                var r = {},
                    i = t.data.getElementsByTagName("info")[0],
                    n = t.data.getElementsByTagName("common")[0];
                r.font = i.getAttribute("face"), r.size = parseInt(i.getAttribute("size"), 10), r.lineHeight = parseInt(n.getAttribute("lineHeight"), 10), r.chars = {};
                for (var a = t.data.getElementsByTagName("char"), h = 0; h < a.length; h++) {
                    var u = parseInt(a[h].getAttribute("id"), 10),
                        l = new s.Rectangle(parseInt(a[h].getAttribute("x"), 10) + e.frame.x, parseInt(a[h].getAttribute("y"), 10) + e.frame.y, parseInt(a[h].getAttribute("width"), 10), parseInt(a[h].getAttribute("height"), 10));
                    r.chars[u] = {
                        xOffset: parseInt(a[h].getAttribute("xoffset"), 10),
                        yOffset: parseInt(a[h].getAttribute("yoffset"), 10),
                        xAdvance: parseInt(a[h].getAttribute("xadvance"), 10),
                        kerning: {},
                        texture: new s.Texture(e.baseTexture, l)
                    }
                }
                var c = t.data.getElementsByTagName("kerning");
                for (h = 0; h < c.length; h++) {
                    var d = parseInt(c[h].getAttribute("first"), 10),
                        p = parseInt(c[h].getAttribute("second"), 10),
                        f = parseInt(c[h].getAttribute("amount"), 10);
                    r.chars[p] && (r.chars[p].kerning[d] = f)
                }
                t.bitmapFont = r, o.BitmapText.fonts[r.font] = r
            }
            var n = t("resource-loader").Resource,
                s = t("../core"),
                o = t("../extras"),
                a = t("path");
            e.exports = function() {
                return function(t, e) {
                    if (!t.data || !t.isXml) return e();
                    if (0 === t.data.getElementsByTagName("page").length || 0 === t.data.getElementsByTagName("info").length || null === t.data.getElementsByTagName("info")[0].getAttribute("face")) return e();
                    var r = t.isDataUrl ? "" : a.dirname(t.url);
                    t.isDataUrl && ("." === r && (r = ""), this.baseUrl && r && ("/" === this.baseUrl.charAt(this.baseUrl.length - 1) && (r += "/"), r = r.replace(this.baseUrl, ""))), r && "/" !== r.charAt(r.length - 1) && (r += "/");
                    var o = r + t.data.getElementsByTagName("page")[0].getAttribute("file");
                    if (s.utils.TextureCache[o]) i(t, s.utils.TextureCache[o]), e();
                    else {
                        var h = {
                            crossOrigin: t.crossOrigin,
                            loadType: n.LOAD_TYPE.IMAGE,
                            metadata: t.metadata.imageMetadata
                        };
                        this.add(t.name + "_image", o, h, function(r) {
                            i(t, r.texture), e()
                        })
                    }
                }
            }
        }, {
            "../core": 62,
            "../extras": 129,
            path: 22,
            "resource-loader": 36
        }],
        148: [function(t, e, r) {
            e.exports = {
                Loader: t("./loader"),
                bitmapFontParser: t("./bitmapFontParser"),
                spritesheetParser: t("./spritesheetParser"),
                textureParser: t("./textureParser"),
                Resource: t("resource-loader").Resource
            }
        }, {
            "./bitmapFontParser": 147,
            "./loader": 149,
            "./spritesheetParser": 150,
            "./textureParser": 151,
            "resource-loader": 36
        }],
        149: [function(t, e, r) {
            function i(t, e) {
                n.call(this, t, e);
                for (var r = 0; r < i._pixiMiddleware.length; ++r) this.use(i._pixiMiddleware[r]())
            }
            var n = t("resource-loader"),
                s = t("./textureParser"),
                o = t("./spritesheetParser"),
                a = t("./bitmapFontParser");
            i.prototype = Object.create(n.prototype), i.prototype.constructor = i, e.exports = i, i._pixiMiddleware = [n.middleware.parsing.blob, s, o, a], i.addPixiMiddleware = function(t) {
                i._pixiMiddleware.push(t)
            };
            var h = n.Resource;
            h.setExtensionXhrType("fnt", h.XHR_RESPONSE_TYPE.DOCUMENT)
        }, {
            "./bitmapFontParser": 147,
            "./spritesheetParser": 150,
            "./textureParser": 151,
            "resource-loader": 36
        }],
        150: [function(t, e, r) {
            var i = t("resource-loader").Resource,
                n = t("path"),
                s = t("../core"),
                o = 1e3;
            e.exports = function() {
                return function(t, e) {
                    var r, a = t.name + "_image";
                    if (!t.data || !t.isJson || !t.data.frames || this.resources[a]) return e();
                    var h = {
                        crossOrigin: t.crossOrigin,
                        loadType: i.LOAD_TYPE.IMAGE,
                        metadata: t.metadata.imageMetadata
                    };
                    r = t.isDataUrl ? t.data.meta.image : n.dirname(t.url.replace(this.baseUrl, "")) + "/" + t.data.meta.image, this.add(a, r, h, function(r) {
                        function i(e, i) {
                            for (var n = e; n - e < i && n < l.length;) {
                                var o = l[n],
                                    a = u[o].frame;
                                if (a) {
                                    var h = null,
                                        d = null,
                                        p = new s.Rectangle(0, 0, u[o].sourceSize.w / c, u[o].sourceSize.h / c);
                                    h = u[o].rotated ? new s.Rectangle(a.x / c, a.y / c, a.h / c, a.w / c) : new s.Rectangle(a.x / c, a.y / c, a.w / c, a.h / c), u[o].trimmed && (d = new s.Rectangle(u[o].spriteSourceSize.x / c, u[o].spriteSourceSize.y / c, u[o].spriteSourceSize.w / c, u[o].spriteSourceSize.h / c)), t.textures[o] = new s.Texture(r.texture.baseTexture, h, p, d, u[o].rotated ? 2 : 0), s.utils.TextureCache[o] = t.textures[o]
                                }
                                n++
                            }
                        }

                        function n() {
                            return d * o < l.length
                        }

                        function a(t) {
                            i(d * o, o), d++, setTimeout(t, 0)
                        }

                        function h() {
                            a(function() {
                                n() ? h() : e()
                            })
                        }
                        t.textures = {};
                        var u = t.data.frames,
                            l = Object.keys(u),
                            c = s.utils.getResolutionOfUrl(t.url),
                            d = 0;
                        l.length <= o ? (i(0, o), e()) : h()
                    })
                }
            }
        }, {
            "../core": 62,
            path: 22,
            "resource-loader": 36
        }],
        151: [function(t, e, r) {
            var i = t("../core");
            e.exports = function() {
                return function(t, e) {
                    if (t.data && t.isImage) {
                        var r = new i.BaseTexture(t.data, null, i.utils.getResolutionOfUrl(t.url));
                        r.imageUrl = t.url, t.texture = new i.Texture(r), i.utils.BaseTextureCache[t.url] = r, i.utils.TextureCache[t.url] = t.texture
                    }
                    e()
                }
            }
        }, {
            "../core": 62
        }],
        152: [function(t, e, r) {		//"./Mesh": 152
            function i(t, e, r, s, o) {
                n.Container.call(this), this._texture = null, this.uvs = r || new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), this.vertices = e || new Float32Array([0, 0, 100, 0, 100, 100, 0, 100]), this.indices = s || new Uint16Array([0, 1, 3, 2]), this.dirty = 0, this.indexDirty = 0, this.blendMode = n.BLEND_MODES.NORMAL, this.canvasPadding = 0, this.drawMode = o || i.DRAW_MODES.TRIANGLE_MESH, this.texture = t, this.shader = null, this.tintRgb = new Float32Array([1, 1, 1]), this._glDatas = []
            }
            var n = t("../core"),
                s = t("pixi-gl-core"),
                o = t("./webgl/MeshShader"),
                a = new n.Point,
                h = new n.Polygon;
            i.prototype = Object.create(n.Container.prototype), i.prototype.constructor = i, e.exports = i, Object.defineProperties(i.prototype, {
                texture: {
                    get: function() {
                        return this._texture
                    },
                    set: function(t) {
                        this._texture !== t && (this._texture = t, t && (t.baseTexture.hasLoaded ? this._onTextureUpdate() : t.once("update", this._onTextureUpdate, this)))
                    }
                },
                tint: {
                    get: function() {
                        return n.utils.rgb2hex(this.tintRgb)
                    },
                    set: function(t) {
                        this.tintRgb = n.utils.hex2rgb(t, this.tintRgb)
                    }
                }
            }), i.prototype._renderWebGL = function(t) {
                t.flush();
                var e = t.gl,
                    r = this._glDatas[t.CONTEXT_UID];
                r || (r = {
                    shader: new o(e),
                    vertexBuffer: s.GLBuffer.createVertexBuffer(e, this.vertices, e.STREAM_DRAW),
                    uvBuffer: s.GLBuffer.createVertexBuffer(e, this.uvs, e.STREAM_DRAW),
                    indexBuffer: s.GLBuffer.createIndexBuffer(e, this.indices, e.STATIC_DRAW),
                    vao: new s.VertexArrayObject(e),
                    dirty: this.dirty,
                    indexDirty: this.indexDirty
                }, r.vao = new s.VertexArrayObject(e).addIndex(r.indexBuffer).addAttribute(r.vertexBuffer, r.shader.attributes.aVertexPosition, e.FLOAT, !1, 8, 0).addAttribute(r.uvBuffer, r.shader.attributes.aTextureCoord, e.FLOAT, !1, 8, 0), this._glDatas[t.CONTEXT_UID] = r), this.dirty !== r.dirty && (r.dirty = this.dirty, r.uvBuffer.upload()), this.indexDirty !== r.indexDirty && (r.indexDirty = this.indexDirty, r.indexBuffer.upload()), r.vertexBuffer.upload(), t.bindShader(r.shader), t.bindTexture(this._texture, 0), t.state.setBlendMode(this.blendMode), r.shader.uniforms.translationMatrix = this.worldTransform.toArray(!0), r.shader.uniforms.alpha = this.worldAlpha, r.shader.uniforms.tint = this.tintRgb;
                var n = this.drawMode === i.DRAW_MODES.TRIANGLE_MESH ? e.TRIANGLE_STRIP : e.TRIANGLES;
                r.vao.bind().draw(n, this.indices.length).unbind()
            }, i.prototype._renderCanvas = function(t) {
                var e = t.context,
                    r = this.worldTransform,
                    n = t.resolution;
                t.roundPixels ? e.setTransform(r.a * n, r.b * n, r.c * n, r.d * n, r.tx * n | 0, r.ty * n | 0) : e.setTransform(r.a * n, r.b * n, r.c * n, r.d * n, r.tx * n, r.ty * n), this.drawMode === i.DRAW_MODES.TRIANGLE_MESH ? this._renderCanvasTriangleMesh(e) : this._renderCanvasTriangles(e)
            }, i.prototype._renderCanvasTriangleMesh = function(t) {
                for (var e = this.vertices, r = this.uvs, i = e.length / 2, n = 0; n < i - 2; n++) {
                    var s = 2 * n;
                    this._renderCanvasDrawTriangle(t, e, r, s, s + 2, s + 4)
                }
            }, i.prototype._renderCanvasTriangles = function(t) {
                for (var e = this.vertices, r = this.uvs, i = this.indices, n = i.length, s = 0; s < n; s += 3) {
                    var o = 2 * i[s],
                        a = 2 * i[s + 1],
                        h = 2 * i[s + 2];
                    this._renderCanvasDrawTriangle(t, e, r, o, a, h)
                }
            }, i.prototype._renderCanvasDrawTriangle = function(t, e, r, i, n, s) {
                var o = this._texture.baseTexture,
                    a = o.source,
                    h = o.width,
                    u = o.height,
                    l = e[i],
                    c = e[n],
                    d = e[s],
                    p = e[i + 1],
                    f = e[n + 1],
                    v = e[s + 1],
                    g = r[i] * o.width,
                    y = r[n] * o.width,
                    x = r[s] * o.width,
                    m = r[i + 1] * o.height,
                    _ = r[n + 1] * o.height,
                    b = r[s + 1] * o.height;
                if (this.canvasPadding > 0) {
                    var T = this.canvasPadding / this.worldTransform.a,
                        E = this.canvasPadding / this.worldTransform.d,
                        w = (l + c + d) / 3,
                        S = (p + f + v) / 3,
                        C = l - w,
                        R = p - S,
                        M = Math.sqrt(C * C + R * R);
                    l = w + C / M * (M + T), p = S + R / M * (M + E), C = c - w, R = f - S, M = Math.sqrt(C * C + R * R), c = w + C / M * (M + T), f = S + R / M * (M + E), C = d - w, R = v - S, M = Math.sqrt(C * C + R * R), d = w + C / M * (M + T), v = S + R / M * (M + E)
                }
                t.save(), t.beginPath(), t.moveTo(l, p), t.lineTo(c, f), t.lineTo(d, v), t.closePath(), t.clip();
                var A = g * _ + m * x + y * b - _ * x - m * y - g * b,
                    O = l * _ + m * d + c * b - _ * d - m * c - l * b,
                    D = g * c + l * x + y * d - c * x - l * y - g * d,
                    P = g * _ * d + m * c * x + l * y * b - l * _ * x - m * y * d - g * c * b,
                    I = p * _ + m * v + f * b - _ * v - m * f - p * b,
                    L = g * f + p * x + y * v - f * x - p * y - g * v,
                    F = g * _ * v + m * f * x + p * y * b - p * _ * x - m * y * v - g * f * b;
                t.transform(O / A, I / A, D / A, L / A, P / A, F / A), t.drawImage(a, 0, 0, h * o.resolution, u * o.resolution, 0, 0, h, u), t.restore()
            }, i.prototype.renderMeshFlat = function(t) {
                var e = this.context,
                    r = t.vertices,
                    i = r.length / 2;
                e.beginPath();
                for (var n = 1; n < i - 2; n++) {
                    var s = 2 * n,
                        o = r[s],
                        a = r[s + 2],
                        h = r[s + 4],
                        u = r[s + 1],
                        l = r[s + 3],
                        c = r[s + 5];
                    e.moveTo(o, u), e.lineTo(a, l), e.lineTo(h, c)
                }
                e.fillStyle = "#FF0000", e.fill(), e.closePath()
            }, i.prototype._onTextureUpdate = function() {}, i.prototype._calculateBounds = function() {
                this._bounds.addVertices(this.transform, this.vertices, 0, this.vertices.length)
            }, i.prototype.containsPoint = function(t) {
                if (!this.getBounds().contains(t.x, t.y)) return !1;
                this.worldTransform.applyInverse(t, a);
                for (var e = this.vertices, r = h.points, n = this.indices, s = this.indices.length, o = this.drawMode === i.DRAW_MODES.TRIANGLES ? 3 : 1, u = 0; u + 2 < s; u += o) {
                    var l = 2 * n[u],
                        c = 2 * n[u + 1],
                        d = 2 * n[u + 2];
                    if (r[0] = e[l], r[1] = e[l + 1], r[2] = e[c], r[3] = e[c + 1], r[4] = e[d], r[5] = e[d + 1], h.contains(a.x, a.y)) return !0
                }
                return !1
            }, i.DRAW_MODES = {
                TRIANGLE_MESH: 0,
                TRIANGLES: 1
            }
        }, {
            "../core": 62,
            "./webgl/MeshShader": 157,
            "pixi-gl-core": 12
        }],
        153: [function(t, e, r) {		//"./NineSlicePlane": 153
            function i(t, e, r, i, o) {
                s.call(this, t, 4, 4);
                var a = this.uvs;
                a[6] = a[14] = a[22] = a[30] = 1, a[25] = a[27] = a[29] = a[31] = 1, this._origWidth = t.width, this._origHeight = t.height, this._uvw = 1 / this._origWidth, this._uvh = 1 / this._origHeight, this.width = t.width, this.height = t.height, a[2] = a[10] = a[18] = a[26] = this._uvw * e, a[4] = a[12] = a[20] = a[28] = 1 - this._uvw * i, a[9] = a[11] = a[13] = a[15] = this._uvh * r, a[17] = a[19] = a[21] = a[23] = 1 - this._uvh * o, this.leftWidth = "undefined" != typeof e ? e : n, this.rightWidth = "undefined" != typeof i ? i : n, this.topHeight = "undefined" != typeof r ? r : n, this.bottomHeight = "undefined" != typeof o ? o : n
            }
            var n = 10,
                s = t("./Plane");
            i.prototype = Object.create(s.prototype), i.prototype.constructor = i, e.exports = i, Object.defineProperties(i.prototype, {
                width: {
                    get: function() {
                        return this._width
                    },
                    set: function(t) {
                        this._width = t, this.updateVerticalVertices()
                    }
                },
                height: {
                    get: function() {
                        return this._height
                    },
                    set: function(t) {
                        this._height = t, this.updateHorizontalVertices()
                    }
                },
                leftWidth: {
                    get: function() {
                        return this._leftWidth
                    },
                    set: function(t) {
                        this._leftWidth = t;
                        var e = this.uvs,
                            r = this.vertices;
                        e[2] = e[10] = e[18] = e[26] = this._uvw * t, r[2] = r[10] = r[18] = r[26] = t, this.dirty = !0
                    }
                },
                rightWidth: {
                    get: function() {
                        return this._rightWidth
                    },
                    set: function(t) {
                        this._rightWidth = t;
                        var e = this.uvs,
                            r = this.vertices;
                        e[4] = e[12] = e[20] = e[28] = 1 - this._uvw * t, r[4] = r[12] = r[20] = r[28] = this._width - t, this.dirty = !0
                    }
                },
                topHeight: {
                    get: function() {
                        return this._topHeight
                    },
                    set: function(t) {
                        this._topHeight = t;
                        var e = this.uvs,
                            r = this.vertices;
                        e[9] = e[11] = e[13] = e[15] = this._uvh * t, r[9] = r[11] = r[13] = r[15] = t, this.dirty = !0
                    }
                },
                bottomHeight: {
                    get: function() {
                        return this._bottomHeight
                    },
                    set: function(t) {
                        this._bottomHeight = t;
                        var e = this.uvs,
                            r = this.vertices;
                        e[17] = e[19] = e[21] = e[23] = 1 - this._uvh * t, r[17] = r[19] = r[21] = r[23] = this._height - t, this.dirty = !0
                    }
                }
            }), i.prototype.updateHorizontalVertices = function() {
                var t = this.vertices;
                t[9] = t[11] = t[13] = t[15] = this._topHeight, t[17] = t[19] = t[21] = t[23] = this._height - this._bottomHeight, t[25] = t[27] = t[29] = t[31] = this._height
            }, i.prototype.updateVerticalVertices = function() {
                var t = this.vertices;
                t[2] = t[10] = t[18] = t[26] = this._leftWidth, t[4] = t[12] = t[20] = t[28] = this._width - this._rightWidth, t[6] = t[14] = t[22] = t[30] = this._width
            }, i.prototype._renderCanvas = function(t) {
                var e = t.context;
                e.globalAlpha = this.worldAlpha;
                var r = this.worldTransform,
                    i = t.resolution;
                t.roundPixels ? e.setTransform(r.a * i, r.b * i, r.c * i, r.d * i, r.tx * i | 0, r.ty * i | 0) : e.setTransform(r.a * i, r.b * i, r.c * i, r.d * i, r.tx * i, r.ty * i);
                var n = this._texture.baseTexture,
                    s = n.source,
                    o = n.width,
                    a = n.height;
                this.drawSegment(e, s, o, a, 0, 1, 10, 11), this.drawSegment(e, s, o, a, 2, 3, 12, 13), this.drawSegment(e, s, o, a, 4, 5, 14, 15), this.drawSegment(e, s, o, a, 8, 9, 18, 19), this.drawSegment(e, s, o, a, 10, 11, 20, 21), this.drawSegment(e, s, o, a, 12, 13, 22, 23), this.drawSegment(e, s, o, a, 16, 17, 26, 27), this.drawSegment(e, s, o, a, 18, 19, 28, 29), this.drawSegment(e, s, o, a, 20, 21, 30, 31)
            }, i.prototype.drawSegment = function(t, e, r, i, n, s, o, a) {
                var h = this.uvs,
                    u = this.vertices,
                    l = (h[o] - h[n]) * r,
                    c = (h[a] - h[s]) * i,
                    d = u[o] - u[n],
                    p = u[a] - u[s];
                l < 1 && (l = 1), c < 1 && (c = 1), d < 1 && (d = 1), p < 1 && (p = 1), t.drawImage(e, h[n] * r, h[s] * i, l, c, u[n], u[s], d, p)
            }
        }, {
            "./Plane": 154
        }],
        154: [function(t, e, r) {		//"./Plane": 154
            function i(t, e, r) {
                n.call(this, t), this._ready = !0, this.verticesX = e || 10, this.verticesY = r || 10, this.drawMode = n.DRAW_MODES.TRIANGLES, this.refresh()
            }
            var n = t("./Mesh");
            i.prototype = Object.create(n.prototype), i.prototype.constructor = i, e.exports = i, i.prototype.refresh = function() {
                var t = this.verticesX * this.verticesY,
                    e = [],
                    r = [],
                    i = [],
                    n = [],
                    s = this.texture,
                    o = this.verticesX - 1,
                    a = this.verticesY - 1,
                    h = 0,
                    u = s.width / o,
                    l = s.height / a;
                for (h = 0; h < t; h++) {
                    var c = h % this.verticesX,
                        d = h / this.verticesX | 0;
                    e.push(c * u, d * l), i.push(s._uvs.x0 + (s._uvs.x1 - s._uvs.x0) * (c / (this.verticesX - 1)), s._uvs.y0 + (s._uvs.y3 - s._uvs.y0) * (d / (this.verticesY - 1)))
                }
                var p = o * a;
                for (h = 0; h < p; h++) {
                    var f = h % o,
                        v = h / o | 0,
                        g = v * this.verticesX + f,
                        y = v * this.verticesX + f + 1,
                        x = (v + 1) * this.verticesX + f,
                        m = (v + 1) * this.verticesX + f + 1;
                    n.push(g, y, x), n.push(y, m, x)
                }
                this.vertices = new Float32Array(e), this.uvs = new Float32Array(i), this.colors = new Float32Array(r), this.indices = new Uint16Array(n), this.indexDirty = !0
            }, i.prototype._onTextureUpdate = function() {
                n.prototype._onTextureUpdate.call(this), this._ready && this.refresh()
            }
        }, {
            "./Mesh": 152
        }],
        155: [function(t, e, r) {		//"./Rope": 155,
            function i(t, e) {
                n.call(this, t), this.points = e, this.vertices = new Float32Array(4 * e.length), this.uvs = new Float32Array(4 * e.length), this.colors = new Float32Array(2 * e.length), this.indices = new Uint16Array(2 * e.length), this._ready = !0, this.refresh()
            }
            var n = t("./Mesh"),
                s = t("../core");
            i.prototype = Object.create(n.prototype), i.prototype.constructor = i, e.exports = i, i.prototype.refresh = function() {
                var t = this.points;
                if (!(t.length < 1) && this._texture._uvs) {
                    var e = this.uvs,
                        r = this.indices,
                        i = this.colors,
                        n = this._texture._uvs,
                        o = new s.Point(n.x0, n.y0),
                        a = new s.Point(n.x2 - n.x0, n.y2 - n.y0);
                    e[0] = 0 + o.x, e[1] = 0 + o.y, e[2] = 0 + o.x, e[3] = 1 * a.y + o.y, i[0] = 1, i[1] = 1, r[0] = 0, r[1] = 1;
                    for (var h, u, l, c = t.length, d = 1; d < c; d++) h = t[d], u = 4 * d, l = d / (c - 1), e[u] = l * a.x + o.x, e[u + 1] = 0 + o.y, e[u + 2] = l * a.x + o.x, e[u + 3] = 1 * a.y + o.y, u = 2 * d, i[u] = 1, i[u + 1] = 1, u = 2 * d, r[u] = u, r[u + 1] = u + 1;
                    this.dirty = !0, this.indexDirty = !0
                }
            }, i.prototype._onTextureUpdate = function() {
                n.prototype._onTextureUpdate.call(this), this._ready && this.refresh()
            }, i.prototype.updateTransform = function() {
                var t = this.points;
                if (!(t.length < 1)) {
                    for (var e, r, i, n, s, o, a = t[0], h = 0, u = 0, l = this.vertices, c = t.length, d = 0; d < c; d++) r = t[d], i = 4 * d, e = d < t.length - 1 ? t[d + 1] : r, u = -(e.x - a.x), h = e.y - a.y, n = 10 * (1 - d / (c - 1)), n > 1 && (n = 1), s = Math.sqrt(h * h + u * u), o = this._texture.height / 2, h /= s, u /= s, h *= o, u *= o, l[i] = r.x + h, l[i + 1] = r.y + u, l[i + 2] = r.x - h, l[i + 3] = r.y - u, a = r;
                    this.containerUpdateTransform()
                }
            }
        }, {
            "../core": 62,
            "./Mesh": 152
        }],
        156: [function(t, e, r) {		//"./mesh": 156
            e.exports = {
                Mesh: t("./Mesh"),
                Plane: t("./Plane"),
                NineSlicePlane: t("./NineSlicePlane"),
                Rope: t("./Rope"),
                MeshShader: t("./webgl/MeshShader")
            }
        }, {
            "./Mesh": 152,
            "./NineSlicePlane": 153,
            "./Plane": 154,
            "./Rope": 155,
            "./webgl/MeshShader": 157
        }],
        157: [function(t, e, r) {		//"./webgl/MeshShader": 157
            function i(t) {
                n.call(this, t, ["attribute vec2 aVertexPosition;", "attribute vec2 aTextureCoord;", "uniform mat3 translationMatrix;", "uniform mat3 projectionMatrix;", "varying vec2 vTextureCoord;", "void main(void){", "   gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);", "   vTextureCoord = aTextureCoord;", "}"].join("\n"), ["varying vec2 vTextureCoord;", "uniform float alpha;", "uniform vec3 tint;", "uniform sampler2D uSampler;", "void main(void){", "   gl_FragColor = texture2D(uSampler, vTextureCoord) * vec4(tint * alpha, alpha);", "}"].join("\n"))
            }
            var n = t("../../core/Shader");
            i.prototype = Object.create(n.prototype), i.prototype.constructor = i, e.exports = i
        }, {
            "../../core/Shader": 42
        }],
        158: [function(t, e, r) {		//"./ParticleContainer": 158
            function i(t, e, r) {
                n.Container.call(this), r = r || 15e3, t = t || 15e3;
                var i = 16384;
                r > i && (r = i), r > t && (r = t), this._properties = [!1, !0, !1, !1, !1], this._maxSize = t, this._batchSize = r, this._glBuffers = [], this._bufferToUpdate = 0, this.interactiveChildren = !1, this.blendMode = n.BLEND_MODES.NORMAL, this.roundPixels = !0, this.baseTexture = null, this.setProperties(e)
            }
            var n = t("../core");
            i.prototype = Object.create(n.Container.prototype), i.prototype.constructor = i, e.exports = i, i.prototype.setProperties = function(t) {
                t && (this._properties[0] = "scale" in t ? !!t.scale : this._properties[0], this._properties[1] = "position" in t ? !!t.position : this._properties[1], this._properties[2] = "rotation" in t ? !!t.rotation : this._properties[2], this._properties[3] = "uvs" in t ? !!t.uvs : this._properties[3], this._properties[4] = "alpha" in t ? !!t.alpha : this._properties[4])
            }, i.prototype.updateTransform = function() {
                this.displayObjectUpdateTransform()
            }, i.prototype.renderWebGL = function(t) {
                this.visible && !(this.worldAlpha <= 0) && this.children.length && this.renderable && (this.baseTexture || (this.baseTexture = this.children[0]._texture.baseTexture, this.baseTexture.hasLoaded || this.baseTexture.once("update", function() {
                    this.onChildrenChange(0)
                }, this)), t.setObjectRenderer(t.plugins.particle), t.plugins.particle.render(this))
            }, i.prototype.onChildrenChange = function(t) {
                var e = Math.floor(t / this._batchSize);
                e < this._bufferToUpdate && (this._bufferToUpdate = e)
            }, i.prototype.renderCanvas = function(t) {
                if (this.visible && !(this.worldAlpha <= 0) && this.children.length && this.renderable) {
                    var e = t.context,
                        r = this.worldTransform,
                        i = !0,
                        n = 0,
                        s = 0,
                        o = 0,
                        a = 0,
                        h = t.blendModes[this.blendMode];
                    h !== e.globalCompositeOperation && (e.globalCompositeOperation = h), e.globalAlpha = this.worldAlpha, this.displayObjectUpdateTransform();
                    for (var u = 0; u < this.children.length; ++u) {
                        var l = this.children[u];
                        if (l.visible) {
                            var c = l.texture.frame;
                            if (e.globalAlpha = this.worldAlpha * l.alpha, l.rotation % (2 * Math.PI) === 0) i && (e.setTransform(r.a, r.b, r.c, r.d, r.tx * t.resolution, r.ty * t.resolution), i = !1), n = l.anchor.x * (-c.width * l.scale.x) + l.position.x + .5, s = l.anchor.y * (-c.height * l.scale.y) + l.position.y + .5, o = c.width * l.scale.x, a = c.height * l.scale.y;
                            else {
                                i || (i = !0), l.displayObjectUpdateTransform();
                                var d = l.worldTransform;
                                t.roundPixels ? e.setTransform(d.a, d.b, d.c, d.d, d.tx * t.resolution | 0, d.ty * t.resolution | 0) : e.setTransform(d.a, d.b, d.c, d.d, d.tx * t.resolution, d.ty * t.resolution), n = l.anchor.x * -c.width + .5, s = l.anchor.y * -c.height + .5, o = c.width, a = c.height
                            }
                            var p = l.texture.baseTexture.resolution;
                            e.drawImage(l.texture.baseTexture.source, c.x * p, c.y * p, c.width * p, c.height * p, n * p, s * p, o * p, a * p)
                        }
                    }
                }
            }, i.prototype.destroy = function() {
                if (n.Container.prototype.destroy.apply(this, arguments), this._buffers)
                    for (var t = 0; t < this._buffers.length; ++t) this._buffers[t].destroy();
                this._properties = null, this._buffers = null
            }
        }, {
            "../core": 62
        }],
        159: [function(t, e, r) {		//"./particles": 159
            e.exports = {
                ParticleContainer: t("./ParticleContainer"),
                ParticleRenderer: t("./webgl/ParticleRenderer")
            }
        }, {
            "./ParticleContainer": 158,
            "./webgl/ParticleRenderer": 161
        }],
        160: [function(t, e, r) {		//"./ParticleBuffer": 160
            function i(t, e, r, i) {
                this.gl = t, this.vertSize = 2, this.vertByteSize = 4 * this.vertSize, this.size = i, this.dynamicProperties = [], this.staticProperties = [];
                for (var n = 0; n < e.length; n++) {
                    var s = e[n];
                    s = {
                        attribute: s.attribute,
                        size: s.size,
                        uploadFunction: s.uploadFunction,
                        offset: s.offset
                    }, r[n] ? this.dynamicProperties.push(s) : this.staticProperties.push(s)
                }
                this.staticStride = 0, this.staticBuffer = null, this.staticData = null, this.dynamicStride = 0, this.dynamicBuffer = null, this.dynamicData = null, this.initBuffers()
            }
            var n = t("pixi-gl-core"),
                s = t("../../core/utils/createIndicesForQuads");			//四倍指数
            i.prototype.constructor = i, e.exports = i, i.prototype.initBuffers = function() {
                var t, e, r = this.gl,
                    i = 0;
                for (this.indices = s(this.size), this.indexBuffer = n.GLBuffer.createIndexBuffer(r, this.indices, r.STATIC_DRAW), this.dynamicStride = 0, t = 0; t < this.dynamicProperties.length; t++) e = this.dynamicProperties[t], e.offset = i, i += e.size, this.dynamicStride += e.size;
                this.dynamicData = new Float32Array(this.size * this.dynamicStride * 4), this.dynamicBuffer = n.GLBuffer.createVertexBuffer(r, this.dynamicData, r.STREAM_DRAW);
                var o = 0;
                for (this.staticStride = 0, t = 0; t < this.staticProperties.length; t++) e = this.staticProperties[t], e.offset = o, o += e.size, this.staticStride += e.size;
                for (this.staticData = new Float32Array(this.size * this.staticStride * 4), this.staticBuffer = n.GLBuffer.createVertexBuffer(r, this.staticData, r.STATIC_DRAW), this.vao = new n.VertexArrayObject(r).addIndex(this.indexBuffer), t = 0; t < this.dynamicProperties.length; t++) e = this.dynamicProperties[t], this.vao.addAttribute(this.dynamicBuffer, e.attribute, r.FLOAT, !1, 4 * this.dynamicStride, 4 * e.offset);
                for (t = 0; t < this.staticProperties.length; t++) e = this.staticProperties[t], this.vao.addAttribute(this.staticBuffer, e.attribute, r.FLOAT, !1, 4 * this.staticStride, 4 * e.offset)
            }, i.prototype.uploadDynamic = function(t, e, r) {
                for (var i = 0; i < this.dynamicProperties.length; i++) {
                    var n = this.dynamicProperties[i];
                    n.uploadFunction(t, e, r, this.dynamicData, this.dynamicStride, n.offset)
                }
                this.dynamicBuffer.upload()
            }, i.prototype.uploadStatic = function(t, e, r) {
                for (var i = 0; i < this.staticProperties.length; i++) {
                    var n = this.staticProperties[i];
                    n.uploadFunction(t, e, r, this.staticData, this.staticStride, n.offset)
                }
                this.staticBuffer.upload()
            }, i.prototype.bind = function() {
                this.vao.bind()
            }, i.prototype.destroy = function() {
                this.dynamicProperties = null, this.dynamicData = null, this.dynamicBuffer.destroy(), this.staticProperties = null, this.staticData = null, this.staticBuffer.destroy()
            }
        }, {
            "../../core/utils/createIndicesForQuads": 114,
            "pixi-gl-core": 12
        }],
        161: [function(t, e, r) {		//"./webgl/ParticleRenderer": 161
            function i(t) {
                n.ObjectRenderer.call(this, t), this.shader = null, this.indexBuffer = null, this.properties = null, this.tempMatrix = new n.Matrix, this.CONTEXT_UID = 0
            }
            var n = t("../../core"),
                s = t("./ParticleShader"),
                o = t("./ParticleBuffer");
            i.prototype = Object.create(n.ObjectRenderer.prototype), i.prototype.constructor = i, e.exports = i, n.WebGLRenderer.registerPlugin("particle", i), i.prototype.onContextChange = function() {
                var t = this.renderer.gl;
                this.CONTEXT_UID = this.renderer.CONTEXT_UID, this.shader = new s(t), this.properties = [{
                    attribute: this.shader.attributes.aVertexPosition,
                    size: 2,
                    uploadFunction: this.uploadVertices,
                    offset: 0
                }, {
                    attribute: this.shader.attributes.aPositionCoord,
                    size: 2,
                    uploadFunction: this.uploadPosition,
                    offset: 0
                }, {
                    attribute: this.shader.attributes.aRotation,
                    size: 1,
                    uploadFunction: this.uploadRotation,
                    offset: 0
                }, {
                    attribute: this.shader.attributes.aTextureCoord,
                    size: 2,
                    uploadFunction: this.uploadUvs,
                    offset: 0
                }, {
                    attribute: this.shader.attributes.aColor,
                    size: 1,
                    uploadFunction: this.uploadAlpha,
                    offset: 0
                }]
            }, i.prototype.start = function() {
                this.renderer.bindShader(this.shader)
            }, i.prototype.render = function(t) {
                var e = t.children,
                    r = e.length,
                    i = t._maxSize,
                    n = t._batchSize;
                if (0 !== r) {
                    r > i && (r = i);
                    var s = t._glBuffers[this.renderer.CONTEXT_UID];
                    s || (s = t._glBuffers[this.renderer.CONTEXT_UID] = this.generateBuffers(t)), this.renderer.setBlendMode(t.blendMode);
                    var o = this.renderer.gl,
                        a = t.worldTransform.copy(this.tempMatrix);
                    a.prepend(this.renderer._activeRenderTarget.projectionMatrix), this.shader.uniforms.projectionMatrix = a.toArray(!0), this.shader.uniforms.uAlpha = t.worldAlpha;
                    var h = e[0]._texture.baseTexture;
                    this.renderer.bindTexture(h);
                    for (var u = 0, l = 0; u < r; u += n, l += 1) {
                        var c = r - u;
                        c > n && (c = n);
                        var d = s[l];
                        d.uploadDynamic(e, u, c), t._bufferToUpdate === l && (d.uploadStatic(e, u, c), t._bufferToUpdate = l + 1), d.vao.bind().draw(o.TRIANGLES, 6 * c).unbind()
                    }
                }
            }, i.prototype.generateBuffers = function(t) {
                var e, r = this.renderer.gl,
                    i = [],
                    n = t._maxSize,
                    s = t._batchSize,
                    a = t._properties;
                for (e = 0; e < n; e += s) i.push(new o(r, this.properties, a, s));
                return i
            }, i.prototype.uploadVertices = function(t, e, r, i, n, s) {
                for (var o, a, h, u, l, c, d, p, f, v, g = 0; g < r; g++) o = t[e + g], a = o._texture, l = o.scale.x, c = o.scale.y, h = a.trim, u = a.orig, h ? (p = h.x - o.anchor.x * u.width, d = p + h.width, v = h.y - o.anchor.y * u.height, f = v + h.height) : (d = u.width * (1 - o.anchor.x), p = u.width * -o.anchor.x, f = u.height * (1 - o.anchor.y), v = u.height * -o.anchor.y), i[s] = p * l, i[s + 1] = v * c, i[s + n] = d * l, i[s + n + 1] = v * c, i[s + 2 * n] = d * l, i[s + 2 * n + 1] = f * c, i[s + 3 * n] = p * l, i[s + 3 * n + 1] = f * c, s += 4 * n
            }, i.prototype.uploadPosition = function(t, e, r, i, n, s) {
                for (var o = 0; o < r; o++) {
                    var a = t[e + o].position;
                    i[s] = a.x, i[s + 1] = a.y, i[s + n] = a.x, i[s + n + 1] = a.y, i[s + 2 * n] = a.x, i[s + 2 * n + 1] = a.y, i[s + 3 * n] = a.x, i[s + 3 * n + 1] = a.y, s += 4 * n
                }
            }, i.prototype.uploadRotation = function(t, e, r, i, n, s) {
                for (var o = 0; o < r; o++) {
                    var a = t[e + o].rotation;
                    i[s] = a, i[s + n] = a, i[s + 2 * n] = a, i[s + 3 * n] = a, s += 4 * n
                }
            }, i.prototype.uploadUvs = function(t, e, r, i, n, s) {
                for (var o = 0; o < r; o++) {
                    var a = t[e + o]._texture._uvs;
                    a ? (i[s] = a.x0, i[s + 1] = a.y0, i[s + n] = a.x1, i[s + n + 1] = a.y1, i[s + 2 * n] = a.x2, i[s + 2 * n + 1] = a.y2, i[s + 3 * n] = a.x3, i[s + 3 * n + 1] = a.y3, s += 4 * n) : (i[s] = 0, i[s + 1] = 0, i[s + n] = 0, i[s + n + 1] = 0, i[s + 2 * n] = 0, i[s + 2 * n + 1] = 0, i[s + 3 * n] = 0, i[s + 3 * n + 1] = 0, s += 4 * n)
                }
            }, i.prototype.uploadAlpha = function(t, e, r, i, n, s) {
                for (var o = 0; o < r; o++) {
                    var a = t[e + o].alpha;
                    i[s] = a, i[s + n] = a, i[s + 2 * n] = a, i[s + 3 * n] = a, s += 4 * n
                }
            }, i.prototype.destroy = function() {
                this.renderer.gl && this.renderer.gl.deleteBuffer(this.indexBuffer), n.ObjectRenderer.prototype.destroy.apply(this, arguments), this.shader.destroy(), this.indices = null, this.tempMatrix = null
            }
        }, {
            "../../core": 62,
            "./ParticleBuffer": 160,
            "./ParticleShader": 162
        }],
        162: [function(t, e, r) {	//"./ParticleShader": 162
            function i(t) {
                n.call(this, t, ["attribute vec2 aVertexPosition;", "attribute vec2 aTextureCoord;", "attribute float aColor;", "attribute vec2 aPositionCoord;", "attribute vec2 aScale;", "attribute float aRotation;", "uniform mat3 projectionMatrix;", "varying vec2 vTextureCoord;", "varying float vColor;", "void main(void){", "   vec2 v = aVertexPosition;", "   v.x = (aVertexPosition.x) * cos(aRotation) - (aVertexPosition.y) * sin(aRotation);", "   v.y = (aVertexPosition.x) * sin(aRotation) + (aVertexPosition.y) * cos(aRotation);", "   v = v + aPositionCoord;", "   gl_Position = vec4((projectionMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);", "   vTextureCoord = aTextureCoord;", "   vColor = aColor;", "}"].join("\n"), ["varying vec2 vTextureCoord;", "varying float vColor;", "uniform sampler2D uSampler;", "uniform float uAlpha;", "void main(void){", "  vec4 color = texture2D(uSampler, vTextureCoord) * vColor * uAlpha;", "  if (color.a == 0.0) discard;", "  gl_FragColor = color;", "}"].join("\n"))
            }
            var n = t("../../core/Shader");
            i.prototype = Object.create(n.prototype), i.prototype.constructor = i, e.exports = i
        }, {
            "../../core/Shader": 42
        }],
        163: [function(t, e, r) {		//"./Math.sign": 163
            Math.sign || (Math.sign = function(t) {
                return t = +t, 0 === t || isNaN(t) ? t : t > 0 ? 1 : -1
            })
        }, {}],
        164: [function(t, e, r) {		//"./Object.assign": 164
            Object.assign || (Object.assign = t("object-assign"))
        }, {
            "object-assign": 5
        }],
        165: [function(t, e, r) {		//"./polyfill": 165
            t("./Object.assign"), t("./requestAnimationFrame"), t("./Math.sign"), window.ArrayBuffer || (window.ArrayBuffer = Array), window.Float32Array || (window.Float32Array = Array), window.Uint32Array || (window.Uint32Array = Array), window.Uint16Array || (window.Uint16Array = Array)
        }, {
            "./Math.sign": 163,
            "./Object.assign": 164,
            "./requestAnimationFrame": 166
        }],
        166: [function(t, e, r) {		//"./requestAnimationFrame": 166
            (function(t) {
                if (Date.now && Date.prototype.getTime || (Date.now = function() {
                        return (new Date).getTime()
                    }), !t.performance || !t.performance.now) {
                    var e = Date.now();
                    t.performance || (t.performance = {}), t.performance.now = function() {
                        return Date.now() - e
                    }
                }
                for (var r = Date.now(), i = ["ms", "moz", "webkit", "o"], n = 0; n < i.length && !t.requestAnimationFrame; ++n) t.requestAnimationFrame = t[i[n] + "RequestAnimationFrame"], t.cancelAnimationFrame = t[i[n] + "CancelAnimationFrame"] || t[i[n] + "CancelRequestAnimationFrame"];
                t.requestAnimationFrame || (t.requestAnimationFrame = function(t) {
                    if ("function" != typeof t) throw new TypeError(t + "is not a function");
                    var e = Date.now(),
                        i = 16 + r - e;
                    return i < 0 && (i = 0), r = e, setTimeout(function() {
                        r = Date.now(), t(performance.now())
                    }, i)
                }), t.cancelAnimationFrame || (t.cancelAnimationFrame = function(t) {
                    clearTimeout(t)
                })
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}],
        167: [function(t, e, r) {		//"./canvas/CanvasPrepare": 167
            function i() {}
            var n = t("../../core");
            i.prototype.constructor = i, e.exports = i, i.prototype.upload = function(t, e) {
                "function" == typeof t && (e = t, t = null), e()
            }, i.prototype.register = function() {
                return this
            }, i.prototype.add = function() {
                return this
            }, i.prototype.destroy = function() {}, n.CanvasRenderer.registerPlugin("prepare", i)
        }, {
            "../../core": 62
        }],
        168: [function(t, e, r) {		//"./prepare": 168
            e.exports = {
                webGL: t("./webgl/WebGLPrepare"),
                canvas: t("./canvas/CanvasPrepare")
            }
        }, {
            "./canvas/CanvasPrepare": 167,
            "./webgl/WebGLPrepare": 169
        }],
        169: [function(t, e, r) {		//"./webgl/WebGLPrepare": 169
            function i(t) {
                this.renderer = t, this.queue = [], this.addHooks = [], this.uploadHooks = [], this.completes = [], this.ticking = !1, this.register(o, n).register(a, s)
            }

            function n(t, e) {
                return e instanceof h.BaseTexture && (t.textureManager.updateTexture(e), !0)
            }

            function s(t, e) {
                return e instanceof h.Graphics && (t.plugins.graphics.updateGraphics(e), !0)
            }

            function o(t, e) {
                if (t instanceof h.BaseTexture) return e.indexOf(t) === -1 && e.push(t), !0;
                if (t._texture && t._texture instanceof h.Texture) {
                    var r = t._texture.baseTexture;
                    return e.indexOf(r) === -1 && e.push(r), !0
                }
                return !1
            }

            function a(t, e) {
                return t instanceof h.Graphics && (e.push(t), !0)
            }
            var h = t("../../core"),
                u = h.ticker.shared;
            i.UPLOADS_PER_FRAME = 4, i.prototype.constructor = i, e.exports = i, i.prototype.upload = function(t, e) {
                "function" == typeof t && (e = t, t = null), t && this.add(t), this.queue.length ? (this.numLeft = i.UPLOADS_PER_FRAME, this.completes.push(e), this.ticking || (this.ticking = !0, u.add(this.tick, this))) : e()
            }, i.prototype.tick = function() {
                for (var t, e; this.queue.length && this.numLeft > 0;) {
                    var r = this.queue[0],
                        n = !1;
                    for (t = 0, e = this.uploadHooks.length; t < e; t++)
                        if (this.uploadHooks[t](this.renderer, r)) {
                            this.numLeft--, this.queue.shift(), n = !0;
                            break
                        }
                    n || this.queue.shift()
                }
                if (this.queue.length) this.numLeft = i.UPLOADS_PER_FRAME;
                else {
                    this.ticking = !1, u.remove(this.tick, this);
                    var s = this.completes.slice(0);
                    for (this.completes.length = 0, t = 0, e = s.length; t < e; t++) s[t]()
                }
            }, i.prototype.register = function(t, e) {
                return t && this.addHooks.push(t), e && this.uploadHooks.push(e), this
            }, i.prototype.add = function(t) {
                var e, r;
                for (e = 0, r = this.addHooks.length; e < r && !this.addHooks[e](t, this.queue); e++);
                if (t instanceof h.Container)
                    for (e = t.children.length - 1; e >= 0; e--) this.add(t.children[e]);
                return this
            }, i.prototype.destroy = function() {
                this.ticking && u.remove(this.tick, this), this.ticking = !1, this.addHooks = null, this.uploadHooks = null, this.renderer = null, this.completes = null, this.queue = null
            }, h.WebGLRenderer.registerPlugin("prepare", i)
        }, {
            "../../core": 62
        }],
        170: [function(t, e, r) {
            (function(r) {
                t("./polyfill");
                var i = e.exports = t("./core");
                i.extras = t("./extras"), i.filters = t("./filters"), i.interaction = t("./interaction"), i.loaders = t("./loaders"), i.mesh = t("./mesh"), i.particles = t("./particles"), i.accessibility = t("./accessibility"), i.extract = t("./extract"), i.prepare = t("./prepare"), i.loader = new i.loaders.Loader, Object.assign(i, t("./deprecation")), r.PIXI = i
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {
            "./accessibility": 41,
            "./core": 62,
            "./deprecation": 119,
            "./extract": 121,
            "./extras": 129,
            "./filters": 140,
            "./interaction": 145,
            "./loaders": 148,
            "./mesh": 156,
            "./particles": 159,
            "./polyfill": 165,
            "./prepare": 168
        }]
    }, {}, [170])(170)
});
//# sourceMappingURL=pixi.min.js.map
/** @license MIT License (MIT)
 Copyright (c) 2013-2016 Mathew Groves, Chad Engler

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

//滤镜
/*!
 * pixi-filters - v1.0.6
 * Compiled Wed Aug 31 2016 08:40:25 GMT-0400 (EDT)
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
! function(t) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = t();
    else if ("function" == typeof define && define.amd) define([], t);
    else {
        var e;
        e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, e.filters = t()
    }
}(function() {
    return function t(e, r, n) {
        function o(l, u) {
            if (!r[l]) {
                if (!e[l]) {
                    var a = "function" == typeof require && require;
                    if (!u && a) return a(l, !0);
                    if (i) return i(l, !0);
                    var c = new Error("Cannot find module '" + l + "'");
                    throw c.code = "MODULE_NOT_FOUND", c
                }
                var s = r[l] = {
                    exports: {}
                };
                e[l][0].call(s.exports, function(t) {
                    var r = e[l][1][t];
                    return o(r ? r : t)
                }, s, s.exports, t, e, r, n)
            }
            return r[l].exports
        }
        for (var i = "function" == typeof require && require, l = 0; l < n.length; l++) o(n[l]);
        return o
    }({
        1: [function(t, e, r) {
            function n() {
                PIXI.Filter.call(this, "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "#define GLSLIFY 1\nvarying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform float pixelSize;\nuniform sampler2D uSampler;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n    return floor( coord / size ) * size;\n}\n\nvec2 getMod(vec2 coord, vec2 size)\n{\n    return mod( coord , size) / size;\n}\n\nfloat character(float n, vec2 p)\n{\n    p = floor(p*vec2(4.0, -4.0) + 2.5);\n    if (clamp(p.x, 0.0, 4.0) == p.x && clamp(p.y, 0.0, 4.0) == p.y)\n    {\n        if (int(mod(n/exp2(p.x + 5.0*p.y), 2.0)) == 1) return 1.0;\n    }\n    return 0.0;\n}\n\nvoid main()\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    // get the rounded color..\n    vec2 pixCoord = pixelate(coord, vec2(pixelSize));\n    pixCoord = unmapCoord(pixCoord);\n\n    vec4 color = texture2D(uSampler, pixCoord);\n\n    // determine the character to use\n    float gray = (color.r + color.g + color.b) / 3.0;\n\n    float n =  65536.0;             // .\n    if (gray > 0.2) n = 65600.0;    // :\n    if (gray > 0.3) n = 332772.0;   // *\n    if (gray > 0.4) n = 15255086.0; // o\n    if (gray > 0.5) n = 23385164.0; // &\n    if (gray > 0.6) n = 15252014.0; // 8\n    if (gray > 0.7) n = 13199452.0; // @\n    if (gray > 0.8) n = 11512810.0; // #\n\n    // get the mod..\n    vec2 modd = getMod(coord, vec2(pixelSize));\n\n    gl_FragColor = color * character( n, vec2(-1.0) + modd * 2.0);\n\n}"), this.size = 8
            }
            n.prototype = Object.create(PIXI.Filter.prototype), n.prototype.constructor = n, e.exports = n, Object.defineProperties(n.prototype, {
                size: {
                    get: function() {
                        return this.uniforms.pixelSize
                    },
                    set: function(t) {
                        this.uniforms.pixelSize = t
                    }
                }
            })
        }, {}],
        2: [function(t, e, r) {
            function n() {
                PIXI.Filter.call(this), this.blurXFilter = new o, this.blurYFilter = new i, this.blurYFilter.blendMode = PIXI.BLEND_MODES.SCREEN, this.defaultFilter = new l
            }
            var o = PIXI.filters.BlurXFilter,
                i = PIXI.filters.BlurYFilter,
                l = PIXI.filters.VoidFilter;
            n.prototype = Object.create(PIXI.Filter.prototype), n.prototype.constructor = n, e.exports = n, n.prototype.apply = function(t, e, r) {
                var n = t.getRenderTarget(!0);
                this.defaultFilter.apply(t, e, r), this.blurXFilter.apply(t, e, n), this.blurYFilter.apply(t, n, r), t.returnRenderTarget(n)
            }, Object.defineProperties(n.prototype, {
                blur: {
                    get: function() {
                        return this.blurXFilter.blur
                    },
                    set: function(t) {
                        this.blurXFilter.blur = this.blurYFilter.blur = t
                    }
                },
                blurX: {
                    get: function() {
                        return this.blurXFilter.blur
                    },
                    set: function(t) {
                        this.blurXFilter.blur = t
                    }
                },
                blurY: {
                    get: function() {
                        return this.blurYFilter.blur
                    },
                    set: function(t) {
                        this.blurYFilter.blur = t
                    }
                }
            })
        }, {}],
        3: [function(t, e, r) {
            if ("undefined" == typeof PIXI) throw new Error("pixi.js is required to be included")
        }, {}],
        4: [function(t, e, r) {
            function n(t, e, r) {
                PIXI.Filter.call(this, "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "precision mediump float;\n#define GLSLIFY 1\n\nvarying mediump vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec2 texelSize;\nuniform float matrix[9];\n\nvoid main(void)\n{\n   vec4 c11 = texture2D(uSampler, vTextureCoord - texelSize); // top left\n   vec4 c12 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - texelSize.y)); // top center\n   vec4 c13 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y - texelSize.y)); // top right\n\n   vec4 c21 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y)); // mid left\n   vec4 c22 = texture2D(uSampler, vTextureCoord); // mid center\n   vec4 c23 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y)); // mid right\n\n   vec4 c31 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y + texelSize.y)); // bottom left\n   vec4 c32 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + texelSize.y)); // bottom center\n   vec4 c33 = texture2D(uSampler, vTextureCoord + texelSize); // bottom right\n\n   gl_FragColor =\n       c11 * matrix[0] + c12 * matrix[1] + c13 * matrix[2] +\n       c21 * matrix[3] + c22 * matrix[4] + c23 * matrix[5] +\n       c31 * matrix[6] + c32 * matrix[7] + c33 * matrix[8];\n\n   gl_FragColor.a = c22.a;\n}\n"), this.matrix = t, this.width = e, this.height = r
            }
            n.prototype = Object.create(PIXI.Filter.prototype), n.prototype.constructor = n, e.exports = n, Object.defineProperties(n.prototype, {
                matrix: {
                    get: function() {
                        return this.uniforms.matrix
                    },
                    set: function(t) {
                        this.uniforms.matrix = new Float32Array(t)
                    }
                },
                width: {
                    get: function() {
                        return 1 / this.uniforms.texelSize[0]
                    },
                    set: function(t) {
                        this.uniforms.texelSize[0] = 1 / t
                    }
                },
                height: {
                    get: function() {
                        return 1 / this.uniforms.texelSize[1]
                    },
                    set: function(t) {
                        this.uniforms.texelSize[1] = 1 / t
                    }
                }
            })
        }, {}],
        5: [function(t, e, r) {
            function n() {
                PIXI.Filter.call(this, "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "precision mediump float;\n#define GLSLIFY 1\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    float lum = length(texture2D(uSampler, vTextureCoord.xy).rgb);\n\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\n    if (lum < 1.00)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.75)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.50)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.3)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n}\n")
            }
            n.prototype = Object.create(PIXI.Filter.prototype), n.prototype.constructor = n, e.exports = n
        }, {}],
        6: [function(t, e, r) {
            function n() {
                PIXI.Filter.call(this, "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "precision mediump float;\n#define GLSLIFY 1\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;\n\nuniform float angle;\nuniform float scale;\n\nfloat pattern()\n{\n   float s = sin(angle), c = cos(angle);\n   vec2 tex = vTextureCoord * filterArea.xy;\n   vec2 point = vec2(\n       c * tex.x - s * tex.y,\n       s * tex.x + c * tex.y\n   ) * scale;\n   return (sin(point.x) * sin(point.y)) * 4.0;\n}\n\nvoid main()\n{\n   vec4 color = texture2D(uSampler, vTextureCoord);\n   float average = (color.r + color.g + color.b) / 3.0;\n   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);\n}\n"), this.scale = 1, this.angle = 5
            }
            n.prototype = Object.create(PIXI.Filter.prototype), n.prototype.constructor = n, e.exports = n, Object.defineProperties(n.prototype, {
                scale: {
                    get: function() {
                        return this.uniforms.scale
                    },
                    set: function(t) {
                        this.uniforms.scale = t
                    }
                },
                angle: {
                    get: function() {
                        return this.uniforms.angle
                    },
                    set: function(t) {
                        this.uniforms.angle = t
                    }
                }
            })
        }, {}],
        7: [function(t, e, r) {
            function n() {
                PIXI.Filter.call(this, "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "precision mediump float;\n#define GLSLIFY 1\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float strength;\nuniform vec4 filterArea;\n\nvoid main(void)\n{\n\tvec2 onePixel = vec2(1.0 / filterArea);\n\n\tvec4 color;\n\n\tcolor.rgb = vec3(0.5);\n\n\tcolor -= texture2D(uSampler, vTextureCoord - onePixel) * strength;\n\tcolor += texture2D(uSampler, vTextureCoord + onePixel) * strength;\n\n\tcolor.rgb = vec3((color.r + color.g + color.b) / 3.0);\n\n\tfloat alpha = texture2D(uSampler, vTextureCoord).a;\n\n\tgl_FragColor = vec4(color.rgb * alpha, alpha);\n}\n"), this.strength = 5
            }
            n.prototype = Object.create(PIXI.Filter.prototype), n.prototype.constructor = n, e.exports = n, Object.defineProperties(n.prototype, {
                strength: {
                    get: function() {
                        return this.uniforms.strength
                    },
                    set: function(t) {
                        this.uniforms.strength = t
                    }
                }
            })
        }, {}],
        8: [function(t, e, r) {
            function n() {
                PIXI.Filter.call(this, "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "precision mediump float;\n#define GLSLIFY 1\n\nvarying vec2 vTextureCoord;\n\nuniform vec2 size;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n\treturn floor( coord / size ) * size;\n}\n\nvoid main(void)\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = pixelate(coord, size);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord);\n}\n"), this.size = [10, 10]
            }
            n.prototype = Object.create(PIXI.Filter.prototype), n.prototype.constructor = n, e.exports = n, Object.defineProperties(n.prototype, {
                size: {
                    get: function() {
                        return this.uniforms.size
                    },
                    set: function(t) {
                        this.uniforms.size.value = t
                    }
                }
            })
        }, {}],
        9: [function(t, e, r) {
            function n() {
                PIXI.Filter.call(this, "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "precision mediump float;\n#define GLSLIFY 1\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nvoid main(void)\n{\n   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/filterArea.xy).r;\n   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/filterArea.xy).g;\n   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/filterArea.xy).b;\n   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;\n}\n"), this.red = [-10, 0], this.green = [0, 10], this.blue = [0, 0]
            }
            n.prototype = Object.create(PIXI.Filter.prototype), n.prototype.constructor = n, e.exports = n, Object.defineProperties(n.prototype, {
                red: {
                    get: function() {
                        return this.uniforms.red
                    },
                    set: function(t) {
                        this.uniforms.red = t
                    }
                },
                green: {
                    get: function() {
                        return this.uniforms.green
                    },
                    set: function(t) {
                        this.uniforms.green = t
                    }
                },
                blue: {
                    get: function() {
                        return this.uniforms.blue.value
                    },
                    set: function(t) {
                        this.uniforms.blue.value = t
                    }
                }
            })
        }, {}],
        10: [function(t, e, r) {
            function n() {
                PIXI.Filter.call(this, "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "#define GLSLIFY 1\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nuniform vec2 center;\nuniform vec3 params; // 10.0, 0.8, 0.1\nuniform float time;\n\nvoid main()\n{\n    vec2 uv = vTextureCoord;\n    vec2 texCoord = uv;\n\n    float dist = distance(uv, center);\n\n    if ( (dist <= (time + params.z)) && (dist >= (time - params.z)) )\n    {\n        float diff = (dist - time);\n        float powDiff = 1.0 - pow(abs(diff*params.x), params.y);\n\n        float diffTime = diff  * powDiff;\n        vec2 diffUV = normalize(uv - center);\n        texCoord = uv + (diffUV * diffTime);\n    }\n\n    gl_FragColor = texture2D(uSampler, texCoord);\n}\n", {
                    center: {
                        type: "v2",
                        value: {
                            x: .5,
                            y: .5
                        }
                    },
                    params: {
                        type: "v3",
                        value: {
                            x: 10,
                            y: .8,
                            z: .1
                        }
                    },
                    time: {
                        type: "1f",
                        value: 0
                    }
                }), this.center = [.5, .5], this.params = [10, .8, .1], this.time = 0
            }
            n.prototype = Object.create(PIXI.Filter.prototype), n.prototype.constructor = n, e.exports = n, Object.defineProperties(n.prototype, {
                center: {
                    get: function() {
                        return this.uniforms.center
                    },
                    set: function(t) {
                        this.uniforms.center = t
                    }
                },
                params: {
                    get: function() {
                        return this.uniforms.params
                    },
                    set: function(t) {
                        this.uniforms.params = t
                    }
                },
                time: {
                    get: function() {
                        return this.uniforms.time
                    },
                    set: function(t) {
                        this.uniforms.time = t
                    }
                }
            })
        }, {}],
        11: [function(t, e, r) {		//"./TiltShiftAxisFilter": 11,中间清晰,上下两端模糊 
            function n() {
                PIXI.Filter.call(this, "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "#define GLSLIFY 1\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float blur;\nuniform float gradientBlur;\nuniform vec2 start;\nuniform vec2 end;\nuniform vec2 delta;\nuniform vec2 texSize;\n\nfloat random(vec3 scale, float seed)\n{\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n    float total = 0.0;\n\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n    vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\n    float radius = smoothstep(0.0, 1.0, abs(dot(vTextureCoord * texSize - start, normal)) / gradientBlur) * blur;\n\n    for (float t = -30.0; t <= 30.0; t++)\n    {\n        float percent = (t + offset - 0.5) / 30.0;\n        float weight = 1.0 - abs(percent);\n        vec4 sample = texture2D(uSampler, vTextureCoord + delta / texSize * percent * radius);\n        sample.rgb *= sample.a;\n        color += sample * weight;\n        total += weight;\n    }\n\n    gl_FragColor = color / total;\n    gl_FragColor.rgb /= gl_FragColor.a + 0.00001;\n}\n"), this.uniforms.blur = 100, this.uniforms.gradientBlur = 600, this.uniforms.start = new PIXI.Point(0, window.innerHeight / 2), this.uniforms.end = new PIXI.Point(600, window.innerHeight / 2), this.uniforms.delta = new PIXI.Point(30, 30), this.uniforms.texSize = new PIXI.Point(window.innerWidth, window.innerHeight), this.updateDelta()
            }
            n.prototype = Object.create(PIXI.Filter.prototype), n.prototype.constructor = n, e.exports = n, n.prototype.updateDelta = function() {
                this.uniforms.delta.x = 0, this.uniforms.delta.y = 0
            }, Object.defineProperties(n.prototype, {
                blur: {
                    get: function() {
                        return this.uniforms.blur
                    },
                    set: function(t) {
                        this.uniforms.blur = t
                    }
                },
                gradientBlur: {
                    get: function() {
                        return this.uniforms.gradientBlur
                    },
                    set: function(t) {
                        this.uniforms.gradientBlur = t
                    }
                },
                start: {
                    get: function() {
                        return this.uniforms.start
                    },
                    set: function(t) {
                        this.uniforms.start = t, this.updateDelta()
                    }
                },
                end: {
                    get: function() {
                        return this.uniforms.end
                    },
                    set: function(t) {
                        this.uniforms.end = t, this.updateDelta()
                    }
                }
            })
        }, {}],
        12: [function(t, e, r) {
            function n() {
                PIXI.Filter.call(this), this.tiltShiftXFilter = new o, this.tiltShiftYFilter = new i
            }
            var o = t("./TiltShiftXFilter"),
                i = t("./TiltShiftYFilter");
            n.prototype = Object.create(PIXI.Filter.prototype), n.prototype.constructor = n, e.exports = n, n.prototype.apply = function(t, e, r) {
                var n = t.getRenderTarget(!0);
                this.tiltShiftXFilter.apply(t, e, n), this.tiltShiftYFilter.apply(t, n, r), t.returnRenderTarget(n)
            }, Object.defineProperties(n.prototype, {
                blur: {
                    get: function() {
                        return this.tiltShiftXFilter.blur
                    },
                    set: function(t) {
                        this.tiltShiftXFilter.blur = this.tiltShiftYFilter.blur = t
                    }
                },
                gradientBlur: {
                    get: function() {
                        return this.tiltShiftXFilter.gradientBlur
                    },
                    set: function(t) {
                        this.tiltShiftXFilter.gradientBlur = this.tiltShiftYFilter.gradientBlur = t
                    }
                },
                start: {
                    get: function() {
                        return this.tiltShiftXFilter.start
                    },
                    set: function(t) {
                        this.tiltShiftXFilter.start = this.tiltShiftYFilter.start = t
                    }
                },
                end: {
                    get: function() {
                        return this.tiltShiftXFilter.end
                    },
                    set: function(t) {
                        this.tiltShiftXFilter.end = this.tiltShiftYFilter.end = t
                    }
                }
            })
        }, {
            "./TiltShiftXFilter": 13,
            "./TiltShiftYFilter": 14
        }],
        13: [function(t, e, r) {
            function n() {
                o.call(this)
            }
            var o = t("./TiltShiftAxisFilter");
            n.prototype = Object.create(o.prototype), n.prototype.constructor = n, e.exports = n, n.prototype.updateDelta = function() {
                var t = this.uniforms.end.x - this.uniforms.start.x,
                    e = this.uniforms.end.y - this.uniforms.start.y,
                    r = Math.sqrt(t * t + e * e);
                this.uniforms.delta.x = t / r, this.uniforms.delta.y = e / r
            }
        }, {
            "./TiltShiftAxisFilter": 11
        }],
        14: [function(t, e, r) {
            function n() {
                o.call(this)
            }
            var o = t("./TiltShiftAxisFilter");
            n.prototype = Object.create(o.prototype), n.prototype.constructor = n, e.exports = n, n.prototype.updateDelta = function() {
                var t = this.uniforms.end.x - this.uniforms.start.x,
                    e = this.uniforms.end.y - this.uniforms.start.y,
                    r = Math.sqrt(t * t + e * e);
                this.uniforms.delta.x = -e / r, this.uniforms.delta.y = t / r
            }
        }, {
            "./TiltShiftAxisFilter": 11
        }],
        15: [function(t, e, r) {
            function n() {
                PIXI.Filter.call(this, "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", "#define GLSLIFY 1\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float radius;\nuniform float angle;\nuniform vec2 offset;\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 twist(vec2 coord)\n{\n    coord -= offset;\n\n    float dist = length(coord);\n\n    if (dist < radius)\n    {\n        float ratioDist = (radius - dist) / radius;\n        float angleMod = ratioDist * ratioDist * angle;\n        float s = sin(angleMod);\n        float c = cos(angleMod);\n        coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);\n    }\n\n    coord += offset;\n\n    return coord;\n}\n\nvoid main(void)\n{\n\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = twist(coord);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord );\n\n}\n"), this.radius = 200, this.angle = 4, this.padding = 20
            }
            n.prototype = Object.create(PIXI.Filter.prototype), n.prototype.constructor = n, e.exports = n, Object.defineProperties(n.prototype, {
                offset: {
                    get: function() {
                        return this.uniforms.offset
                    },
                    set: function(t) {
                        this.uniforms.offset = t
                    }
                },
                radius: {
                    get: function() {
                        return this.uniforms.radius
                    },
                    set: function(t) {
                        this.uniforms.radius = t
                    }
                },
                angle: {
                    get: function() {
                        return this.uniforms.angle
                    },
                    set: function(t) {
                        this.uniforms.angle = t
                    }
                }
            })
        }, {}],
        16: [function(t, e, r) {
            t("./check");
            var n = {
                AsciiFilter: t("./ascii/AsciiFilter"),
                BloomFilter: t("./bloom/BloomFilter"),
                ConvolutionFilter: t("./convolution/ConvolutionFilter"),		//卷积
                CrossHatchFilter: t("./crosshatch/CrossHatchFilter"),		//网线阴影
                DotFilter: t("./dot/DotFilter"),
                EmbossFilter: t("./emboss/EmbossFilter"),				//浮雕
                PixelateFilter: t("./pixelate/PixelateFilter"),			//马赛克
                RGBSplitFilter: t("./rgb/RGBSplitFilter"),				//RGB分离
                ShockwaveFilter: t("./shockwave/ShockwaveFilter"),
                TiltShiftFilter: t("./tiltshift/TiltShiftFilter"),		//移轴
                TiltShiftAxisFilter: t("./tiltshift/TiltShiftAxisFilter"),
                TiltShiftXFilter: t("./tiltshift/TiltShiftXFilter"),
                TiltShiftYFilter: t("./tiltshift/TiltShiftYFilter"),
                TwistFilter: t("./twist/TwistFilter")
            };
            Object.assign(PIXI.filters, n), "undefined" != typeof e && e.exports && (e.exports = n)
        }, {
            "./ascii/AsciiFilter": 1,
            "./bloom/BloomFilter": 2,
            "./check": 3,
            "./convolution/ConvolutionFilter": 4,
            "./crosshatch/CrossHatchFilter": 5,
            "./dot/DotFilter": 6,
            "./emboss/EmbossFilter": 7,
            "./pixelate/PixelateFilter": 8,
            "./rgb/RGBSplitFilter": 9,
            "./shockwave/ShockwaveFilter": 10,
            "./tiltshift/TiltShiftAxisFilter": 11,
            "./tiltshift/TiltShiftFilter": 12,
            "./tiltshift/TiltShiftXFilter": 13,
            "./tiltshift/TiltShiftYFilter": 14,
            "./twist/TwistFilter": 15
        }]
    }, {}, [16])(16)
});
//# sourceMappingURL=filters.min.js.map
(function() {
    var k, ba = function(a, b) {
            function c() {}
            c.prototype = b.prototype;
            a.superClass_ = b.prototype;
            a.prototype = new c;
            a.prototype.constructor = a;
            for (var d in b)
                if (Object.defineProperties) {
                    var e = Object.getOwnPropertyDescriptor(b, d);
                    e && Object.defineProperty(a, d, e)
                } else a[d] = b[d]
        },
        ca = "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
            a != Array.prototype && a != Object.prototype && (a[b] = c.value)
        },
        da = "undefined" != typeof window && window === this ? this : "undefined" != typeof global && null != global ? global :
            this,
        ea = function(a, b) {
            if (b) {
                for (var c = da, d = a.split("."), e = 0; e < d.length - 1; e++) {
                    var f = d[e];
                    f in c || (c[f] = {});
                    c = c[f]
                }
                d = d[d.length - 1];
                e = c[d];
                f = b(e);
                f != e && null != f && ca(c, d, {
                    configurable: !0,
                    writable: !0,
                    value: f
                })
            }
        };
    ea("Array.prototype.fill", function(a) {
        return a ? a : function(a, c, d) {
            var b = this.length || 0;
            0 > c && (c = Math.max(0, b + c));
            if (null == d || d > b) d = b;
            d = Number(d);
            0 > d && (d = Math.max(0, b + d));
            for (c = Number(c || 0); c < d; c++) this[c] = a;
            return this
        }
    });
    ea("Object.is", function(a) {
        return a ? a : function(a, c) {
            return a === c ? 0 !== a || 1 / a === 1 / c : a !== a && c !== c
        }
    });
    ea("Array.prototype.includes", function(a) {
        return a ? a : function(a, c) {
            var b = this;
            b instanceof String && (b = String(b));
            for (var e = b.length, f = c || 0; f < e; f++)
                if (b[f] == a || Object.is(b[f], a)) return !0;
            return !1
        }
    });
    var l = this,
        fa = function(a) {
            return "string" == typeof a
        },
        ha = function(a) {
            return "boolean" == typeof a
        },
        ia = function(a) {
            a.instance_ = void 0;
            a.getInstance = function() {
                return a.instance_ ? a.instance_ : a.instance_ = new a
            }
        },
        ja = function(a) {
            var b = typeof a;
            if ("object" == b)
                if (a) {
                    if (a instanceof Array) return "array";
                    if (a instanceof Object) return b;
                    var c = Object.prototype.toString.call(a);
                    if ("[object Window]" == c) return "object";
                    if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable &&
                        !a.propertyIsEnumerable("splice")) return "array";
                    if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function"
                } else return "null";
            else if ("function" == b && "undefined" == typeof a.call) return "object";
            return b
        },
        ka = function(a) {
            return "array" == ja(a)
        },
        la = function(a) {
            var b = ja(a);
            return "array" == b || "object" == b && "number" == typeof a.length
        },
        ma = function(a) {
            var b = typeof a;
            return "object" == b && null != a || "function" == b
        },
        na = function(a, b, c) {
            return a.call.apply(a.bind,
                arguments)
        },
        oa = function(a, b, c) {
            if (!a) throw Error();
            if (2 < arguments.length) {
                var d = Array.prototype.slice.call(arguments, 2);
                return function() {
                    var c = Array.prototype.slice.call(arguments);
                    Array.prototype.unshift.apply(c, d);
                    return a.apply(b, c)
                }
            }
            return function() {
                return a.apply(b, arguments)
            }
        },
        pa = function(a, b, c) {
            Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? pa = na : pa = oa;
            return pa.apply(null, arguments)
        },
        qa = function(a, b) {
            var c = Array.prototype.slice.call(arguments, 1);
            return function() {
                var b =
                    c.slice();
                b.push.apply(b, arguments);
                return a.apply(this, b)
            }
        },
        m = Date.now || function() {
                return +new Date
            },
        ra = function(a, b) {
            var c = a.split("."),
                d = l;
            c[0] in d || !d.execScript || d.execScript("var " + c[0]);
            for (var e; c.length && (e = c.shift());) c.length || void 0 === b ? d[e] && d[e] !== Object.prototype[e] ? d = d[e] : d = d[e] = {} : d[e] = b
        },
        n = function(a, b) {
            function c() {}
            c.prototype = b.prototype;
            a.superClass_ = b.prototype;
            a.prototype = new c;
            a.prototype.constructor = a;
            a.base = function(a, c, f) {
                for (var d = Array(arguments.length - 2), e = 2; e < arguments.length; e++) d[e -
                2] = arguments[e];
                return b.prototype[c].apply(a, d)
            }
        };
    var sa = function(a, b, c) {
        this.r = a;
        this.g = b;
        this.b = c
    };
    var ta = !!self.localStorage;
    var ua = String.prototype.trim ? function(a) {
            return a.trim()
        } : function(a) {
            return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
        },
        q = function(a, b) {
            return -1 != a.indexOf(b)
        },
        va = function(a, b) {
            return a < b ? -1 : a > b ? 1 : 0
        };
    var wa = function() {
            if (!ta) return !0;
            try {
                var a = window.localStorage.getItem("doodle-fischinger-first")
            } catch (b) {
                return !0
            }
            if (null == a) return !0;
            a = JSON.parse(a);
            return ha && !ha(a) ? !0 : a
        }() ? 1 : .5,
        xa = 1E3 / 30,
        ya = !!window.navigator.userAgent.match("Nexus [57]") || q(window.navigator.userAgent, "CrOS");
    var Ba = function(a) {
            var b = new Image,
                c = za,
                d = "";
            b.onerror = b.onload = b.onabort = function() {
                delete Aa[c]
            };
            Aa[c] = b; - 1 != a.search("&ei=") || (d = "&ei=");
            a = "https://www.google.com/gen_204?atyp=i&ct=doodle&cad=" + a + d + "&zx=" + m();
            /^http:/i.test(a) && "https:" == window.location.protocol ? delete Aa[c] : (b.src = a, za = c + 1)
        },
        Aa = [],
        za = 0;
    var Ca;
    var Da = Array.prototype.indexOf ? function(a, b, c) {
            return Array.prototype.indexOf.call(a, b, c)
        } : function(a, b, c) {
            c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
            if (fa(a)) return fa(b) && 1 == b.length ? a.indexOf(b, c) : -1;
            for (; c < a.length; c++)
                if (c in a && a[c] === b) return c;
            return -1
        },
        Ea = Array.prototype.forEach ? function(a, b, c) {
            Array.prototype.forEach.call(a, b, c)
        } : function(a, b, c) {
            for (var d = a.length, e = fa(a) ? a.split("") : a, f = 0; f < d; f++) f in e && b.call(c, e[f], f, a)
        },
        Fa = Array.prototype.filter ? function(a, b, c) {
            return Array.prototype.filter.call(a,
                b, c)
        } : function(a, b, c) {
            for (var d = a.length, e = [], f = 0, g = fa(a) ? a.split("") : a, h = 0; h < d; h++)
                if (h in g) {
                    var p = g[h];
                    b.call(c, p, h, a) && (e[f++] = p)
                }
            return e
        },
        Ga = function(a) {
            return Array.prototype.concat.apply([], arguments)
        },
        Ha = function(a) {
            var b = a.length;
            if (0 < b) {
                for (var c = Array(b), d = 0; d < b; d++) c[d] = a[d];
                return c
            }
            return []
        };
    var Ia = function(a) {
            if (a.classList) return a.classList;
            a = a.className;
            return fa(a) && a.match(/\S+/g) || []
        },
        Ja = function(a) {
            a.classList ? a = a.classList.contains("hpofdesktop") : (a = Ia(a), a = 0 <= Da(a, "hpofdesktop"));
            return a
        },
        Ka = function() {
            var a = document.body;
            a.classList ? a.classList.remove("hpofdesktop") : Ja(a) && (a.className = Fa(Ia(a), function(a) {
                    return "hpofdesktop" != a
                }).join(" "))
        };
    var La = RegExp("[A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff\u200e\u2c00-\ufb1c\ufe00-\ufe6f\ufefd-\uffff]"),
        Ma = RegExp("^[^A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff\u200e\u2c00-\ufb1c\ufe00-\ufe6f\ufefd-\uffff]*[\u0591-\u06ef\u06fa-\u07ff\u200f\ufb1d-\ufdff\ufe70-\ufefc]"),
        Na = /^http:\/\/.*/,
        Oa = /\s+/,
        Pa = /[\d\u06f0-\u06f9]/;
    var Qa = function(a, b, c) {
        return a + c * (b - a)
    };
    var Ra = "StopIteration" in l ? l.StopIteration : {
            message: "StopIteration",
            stack: ""
        },
        Sa = function() {};
    Sa.prototype.next = function() {
        throw Ra;
    };
    Sa.prototype.__iterator__ = function() {
        return this
    };
    var Ta = function(a, b, c) {
            for (var d in a) b.call(c, a[d], d, a)
        },
        Ua = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),
        Va = function(a, b) {
            for (var c, d, e = 1; e < arguments.length; e++) {
                d = arguments[e];
                for (c in d) a[c] = d[c];
                for (var f = 0; f < Ua.length; f++) c = Ua[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
            }
        };
    var Wa = function(a, b) {
        this.map_ = {};
        this.goog_structs_Map$keys_ = [];
        this.version_ = this.goog_structs_Map$count_ = 0;
        var c = arguments.length;
        if (1 < c) {
            if (c % 2) throw Error("a");
            for (var d = 0; d < c; d += 2) this.set(arguments[d], arguments[d + 1])
        } else if (a) {
            if (a instanceof Wa) {
                var e = a.getKeys();
                d = a.getValues()
            } else {
                var c = [],
                    f = 0;
                for (e in a) c[f++] = e;
                e = c;
                c = [];
                f = 0;
                for (d in a) c[f++] = a[d];
                d = c
            }
            for (c = 0; c < e.length; c++) this.set(e[c], d[c])
        }
    };
    Wa.prototype.getValues = function() {
        Xa(this);
        for (var a = [], b = 0; b < this.goog_structs_Map$keys_.length; b++) a.push(this.map_[this.goog_structs_Map$keys_[b]]);
        return a
    };
    Wa.prototype.getKeys = function() {
        Xa(this);
        return this.goog_structs_Map$keys_.concat()
    };
    var Xa = function(a) {
        var b, c;
        if (a.goog_structs_Map$count_ != a.goog_structs_Map$keys_.length) {
            for (b = c = 0; c < a.goog_structs_Map$keys_.length;) {
                var d = a.goog_structs_Map$keys_[c];
                Ya(a.map_, d) && (a.goog_structs_Map$keys_[b++] = d);
                c++
            }
            a.goog_structs_Map$keys_.length = b
        }
        if (a.goog_structs_Map$count_ != a.goog_structs_Map$keys_.length) {
            var e = {};
            for (b = c = 0; c < a.goog_structs_Map$keys_.length;) d = a.goog_structs_Map$keys_[c], Ya(e, d) || (a.goog_structs_Map$keys_[b++] = d, e[d] = 1), c++;
            a.goog_structs_Map$keys_.length = b
        }
    };
    Wa.prototype.get = function(a, b) {
        return Ya(this.map_, a) ? this.map_[a] : b
    };
    Wa.prototype.set = function(a, b) {
        Ya(this.map_, a) || (this.goog_structs_Map$count_++, this.goog_structs_Map$keys_.push(a), this.version_++);
        this.map_[a] = b
    };
    Wa.prototype.forEach = function(a, b) {
        for (var c = this.getKeys(), d = 0; d < c.length; d++) {
            var e = c[d],
                f = this.get(e);
            a.call(b, f, e, this)
        }
    };
    Wa.prototype.__iterator__ = function(a) {
        Xa(this);
        var b = 0,
            c = this.version_,
            d = this,
            e = new Sa;
        e.next = function() {
            if (c != d.version_) throw Error("b");
            if (b >= d.goog_structs_Map$keys_.length) throw Ra;
            var e = d.goog_structs_Map$keys_[b++];
            return a ? e : d.map_[e]
        };
        return e
    };
    var Ya = function(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b)
    };
    var Za = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/,
        $a = function(a, b) {
            if (a)
                for (var c = a.split("&"), d = 0; d < c.length; d++) {
                    var e = c[d].indexOf("="),
                        f = null;
                    if (0 <= e) {
                        var g = c[d].substring(0, e);
                        f = c[d].substring(e + 1)
                    } else g = c[d];
                    b(g, f ? decodeURIComponent(f.replace(/\+/g, " ")) : "")
                }
        };
    var ab = function(a, b) {
        this.domain_ = this.userInfo_ = this.scheme_ = "";
        this.port_ = null;
        this.fragment_ = this.path_ = "";
        this.goog_Uri$ignoreCase_ = !1;
        if (a instanceof ab) {
            this.goog_Uri$ignoreCase_ = void 0 !== b ? b : a.goog_Uri$ignoreCase_;
            bb(this, a.scheme_);
            this.userInfo_ = a.userInfo_;
            this.domain_ = a.domain_;
            cb(this, a.port_);
            this.path_ = a.path_;
            var c = a.queryData_;
            var d = new db;
            d.encodedQuery_ = c.encodedQuery_;
            c.keyMap_ && (d.keyMap_ = new Wa(c.keyMap_), d.goog_Uri_QueryData$count_ = c.goog_Uri_QueryData$count_);
            eb(this, d);
            this.fragment_ =
                a.fragment_
        } else a && (c = String(a).match(Za)) ? (this.goog_Uri$ignoreCase_ = !!b, bb(this, c[1] || "", !0), this.userInfo_ = fb(c[2] || ""), this.domain_ = fb(c[3] || "", !0), cb(this, c[4]), this.path_ = fb(c[5] || "", !0), eb(this, c[6] || "", !0), this.fragment_ = fb(c[7] || "")) : (this.goog_Uri$ignoreCase_ = !!b, this.queryData_ = new db(null, 0, this.goog_Uri$ignoreCase_))
    };
    ab.prototype.toString = function() {
        var a = [],
            b = this.scheme_;
        b && a.push(gb(b, hb, !0), ":");
        var c = this.domain_;
        if (c || "file" == b) a.push("//"), (b = this.userInfo_) && a.push(gb(b, hb, !0), "@"), a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.port_, null != c && a.push(":", String(c));
        if (c = this.path_) this.domain_ && "/" != c.charAt(0) && a.push("/"), a.push(gb(c, "/" == c.charAt(0) ? ib : jb, !0));
        (c = this.queryData_.toString()) && a.push("?", c);
        (c = this.fragment_) && a.push("#", gb(c, kb));
        return a.join("")
    };
    var bb = function(a, b, c) {
            a.scheme_ = c ? fb(b, !0) : b;
            a.scheme_ && (a.scheme_ = a.scheme_.replace(/:$/, ""))
        },
        cb = function(a, b) {
            if (b) {
                b = Number(b);
                if (isNaN(b) || 0 > b) throw Error("c`" + b);
                a.port_ = b
            } else a.port_ = null
        },
        eb = function(a, b, c) {
            b instanceof db ? (a.queryData_ = b, lb(a.queryData_, a.goog_Uri$ignoreCase_)) : (c || (b = gb(b, mb)), a.queryData_ = new db(b, 0, a.goog_Uri$ignoreCase_))
        },
        nb = function(a) {
            return a instanceof ab ? new ab(a) : new ab(a, void 0)
        },
        fb = function(a, b) {
            return a ? b ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) :
                ""
        },
        gb = function(a, b, c) {
            return fa(a) ? (a = encodeURI(a).replace(b, ob), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null
        },
        ob = function(a) {
            a = a.charCodeAt(0);
            return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
        },
        hb = /[#\/\?@]/g,
        jb = /[\#\?:]/g,
        ib = /[\#\?]/g,
        mb = /[\#\?@]/g,
        kb = /#/g,
        db = function(a, b, c) {
            this.goog_Uri_QueryData$count_ = this.keyMap_ = null;
            this.encodedQuery_ = a || null;
            this.goog_Uri_QueryData$ignoreCase_ = !!c
        },
        pb = function(a) {
            a.keyMap_ || (a.keyMap_ = new Wa, a.goog_Uri_QueryData$count_ = 0, a.encodedQuery_ && $a(a.encodedQuery_,
                function(b, c) {
                    a.add(decodeURIComponent(b.replace(/\+/g, " ")), c)
                }))
        };
    db.prototype.add = function(a, b) {
        pb(this);
        this.encodedQuery_ = null;
        a = qb(this, a);
        var c = this.keyMap_.get(a);
        c || this.keyMap_.set(a, c = []);
        c.push(b);
        this.goog_Uri_QueryData$count_ += 1;
        return this
    };
    var rb = function(a, b) {
            pb(a);
            b = qb(a, b);
            if (Ya(a.keyMap_.map_, b)) {
                a.encodedQuery_ = null;
                a.goog_Uri_QueryData$count_ -= a.keyMap_.get(b).length;
                var c = a.keyMap_,
                    d = b;
                Ya(c.map_, d) && (delete c.map_[d], c.goog_structs_Map$count_--, c.version_++, c.goog_structs_Map$keys_.length > 2 * c.goog_structs_Map$count_ && Xa(c))
            }
        },
        sb = function(a, b) {
            pb(a);
            b = qb(a, b);
            return Ya(a.keyMap_.map_, b)
        };
    k = db.prototype;
    k.forEach = function(a, b) {
        pb(this);
        this.keyMap_.forEach(function(c, d) {
            Ea(c, function(c) {
                a.call(b, c, d, this)
            }, this)
        }, this)
    };
    k.getKeys = function() {
        pb(this);
        for (var a = this.keyMap_.getValues(), b = this.keyMap_.getKeys(), c = [], d = 0; d < b.length; d++)
            for (var e = a[d], f = 0; f < e.length; f++) c.push(b[d]);
        return c
    };
    k.getValues = function(a) {
        pb(this);
        var b = [];
        if (fa(a)) sb(this, a) && (b = Ga(b, this.keyMap_.get(qb(this, a))));
        else {
            a = this.keyMap_.getValues();
            for (var c = 0; c < a.length; c++) b = Ga(b, a[c])
        }
        return b
    };
    k.set = function(a, b) {
        pb(this);
        this.encodedQuery_ = null;
        a = qb(this, a);
        sb(this, a) && (this.goog_Uri_QueryData$count_ -= this.keyMap_.get(a).length);
        this.keyMap_.set(a, [b]);
        this.goog_Uri_QueryData$count_ += 1;
        return this
    };
    k.get = function(a, b) {
        var c = a ? this.getValues(a) : [];
        return 0 < c.length ? String(c[0]) : b
    };
    k.toString = function() {
        if (this.encodedQuery_) return this.encodedQuery_;
        if (!this.keyMap_) return "";
        for (var a = [], b = this.keyMap_.getKeys(), c = 0; c < b.length; c++)
            for (var d = b[c], e = encodeURIComponent(String(d)), d = this.getValues(d), f = 0; f < d.length; f++) {
                var g = e;
                "" !== d[f] && (g += "=" + encodeURIComponent(String(d[f])));
                a.push(g)
            }
        return this.encodedQuery_ = a.join("&")
    };
    var qb = function(a, b) {
            var c = String(b);
            a.goog_Uri_QueryData$ignoreCase_ && (c = c.toLowerCase());
            return c
        },
        lb = function(a, b) {
            b && !a.goog_Uri_QueryData$ignoreCase_ && (pb(a), a.encodedQuery_ = null, a.keyMap_.forEach(function(a, b) {
                var c = b.toLowerCase();
                b != c && (rb(this, b), rb(this, c), 0 < a.length && (this.encodedQuery_ = null, this.keyMap_.set(qb(this, c), Ha(a)), this.goog_Uri_QueryData$count_ += a.length))
            }, a));
            a.goog_Uri_QueryData$ignoreCase_ = b
        };
    var tb, r = navigator.userAgent,
        ub = window.location.href,
        vb = q(r, "iPad") || q(r, "iPhone") || q(r, "iPod"),
        wb = q(r.toLowerCase(), "gsa"),
        xb = vb && wb,
        yb = wb && !vb,
        t = vb || q(r, "Android") || q(r, "Mobile") || q(r, "Silk") || q(r, "UCBrowser") || q(r, "UCWEB"),
        zb = q(r, "Chrome") && q(r, "Mobile") && q(r, "wv"),
        Ab = q(ub, "/logos/") && q(ub, ".html"),
        Bb = ["", "moz", "ms", "o", "webkit"],
        Cb = function(a) {
            var b = document;
            if (!b) return null;
            for (var c = 0; c < Bb.length; c++) {
                var d = Bb[c],
                    e = a;
                0 < d.length && (e = a.charAt(0).toUpperCase() + a.substr(1));
                d += e;
                if ("undefined" !=
                    typeof b[d]) return d
            }
            return null
        },
        Db = function(a, b) {
            b = b && !xb;
            if (google.nav && google.nav.go) {
                var c = a;
                if (0 == a.indexOf("/search")) {
                    c = new ab(window.location);
                    c.path_ = "/search";
                    for (var d = nb(a).queryData_, e = d.getKeys(), f = 0; f < e.length; f++) {
                        var g = e[f],
                            h = c,
                            p = g,
                            g = d.get(g);
                        h.queryData_.set(p, g)
                    }
                    c = c.toString()
                }
                b ? window.open(c) : google.nav.go(c)
            } else b ? window.open(a) : window.parent ? window.parent.location.assign(a) : window.location.assign(a)
        },
        Eb = function(a, b) {
            var c = window.google ? window.google.doodle : null;
            return c &&
            void 0 != c[a] ? c[a] : b
        },
        Fb = Eb("alt", ""),
        Gb = Eb("hl", "en"),
        Hb = function(a) {
            var b = "",
                c = Eb("msgs", {});
            void 0 !== b || (b = a);
            if (!(c = c[a])) {
                var d = Eb("alltranslations", {});
                if (d)
                    if (c = d.messages, d = d.translations, c && d) {
                        for (var e = -1, f = 0; f < c.length; f++)
                            if (c[f] == a) {
                                e = f;
                                break
                            }
                        c = -1 == e ? "" : (d[Gb] || d.en).ALL[e]
                    } else c = "";
                else c = ""
            }
            a = c || b;
            c = b = 0;
            d = !1;
            e = a.split(Oa);
            for (f = 0; f < e.length; f++) {
                var g = e[f];
                Ma.test(g) ? (b++, c++) : Na.test(g) ? d = !0 : La.test(g) ? c++ : Pa.test(g) && (d = !0)
            }
            b = 0 == c ? d ? 1 : 0 : .4 < b / c ? -1 : 1;
            return 1 == b ? "\u202a" + a + "\u202c" :
                -1 == b ? "\u202b" + a + "\u202c" : a
        },
        Ib = function() {
            for (var a = ["requestAnimationFrame", "mozRequestAnimationFrame", "msRequestAnimationFrame", "oRequestAnimationFrame", "webkitRequestAnimationFrame"], b = 0; b < a.length; b++) {
                var c = window[a[b]];
                if (c) return function(a, b, d) {
                    return c(function(b) {
                        return a.call(d, b)
                    }, b)
                }
            }
            var d = 0,
                e = 33,
                f = 50;
            return function(a, b, c) {
                b && 0 > --f && (1.25 < b / e ? (d = 0, e = Math.min(66, ++e)) : 10 < ++d && (d = 0, e = Math.max(17, --e)));
                window.setTimeout(function(b) {
                    a.call(c, b)
                }, e)
            }
        },
        Jb = function(a, b, c) {
            Jb = Ib();
            return Jb(a,
                b, c)
        },
        Kb = function(a, b) {
            if (window.google && window.google.log) {
                if (b) {
                    var c;
                    tb || (c = document.getElementById("hplogoved")) && (tb = c.getAttribute("data-ved"));
                    (c = tb) && (a += "&ved=" + c)
                }
                window.google.log("doodle", a)
            } else Ba(a)
        };
    var Mb = function() {
        PIXI.AbstractFilter.call(this, null, "varying vec2 vTextureCoord;uniform sampler2D uSampler;uniform mat3 mappedMatrix;uniform float pixelAmount;uniform float screenMultiply;uniform float scaleX;void main() {vec3 mapCoord = vec3(vTextureCoord, 1.0) * mappedMatrix;float pixelA = 512.0 / pixelAmount;float sX = 512.0 / scaleX;vec2 uv = floor(vTextureCoord * pixelA) / pixelA;uv.x = floor(vTextureCoord.x * sX) / sX;vec4 color = texture2D(uSampler, uv);color.rgb *= screenMultiply;color.rgb *= screenMultiply;gl_FragColor = color;}",
            null);
        this.resolution = Lb();
        this.uniforms.mappedMatrix = new PIXI.Matrix;
        this.uniforms.screenMultiply = this.fischinger_PixelFilter$screenMultiplyTarget = 1.3;
        this.uniforms.pixelAmount = .1;
        this.uniforms.scaleX = 1
    };
    n(Mb, PIXI.AbstractFilter);
    Mb.prototype.apply = function(a, b, c) {
        a.calculateNormalizedScreenSpaceMatrix(this.uniforms.mappedMatrix);
        a.applyFilter(this, b, c, !1)
    };
    Mb.prototype.update = function() {
        Nb.filterManager.calculateNormalizedScreenSpaceMatrix(this.uniforms.mappedMatrix)
    };
    Mb.prototype.cleanup = function() {};
    var Ob = function() {		//背景电视机老花效果
        PIXI.AbstractFilter.call(this, null, "varying vec2 vTextureCoord;uniform sampler2D uSampler;uniform mat3 mappedMatrix;uniform sampler2D scratchTex;uniform vec2 random;uniform vec2 screenRatio;uniform float screenMultiply;void main() {vec4 color = texture2D(uSampler, vTextureCoord);vec3 mapCoord = vec3(vTextureCoord, 1.0) * mappedMatrix;vec4 scratches =texture2D(scratchTex, mapCoord.xy * screenRatio + random);float dist = distance(mapCoord.xy, vec2(0.5, 0.5));color.rgb *= smoothstep(0.9, 0.25, dist) * screenMultiply;color.rgb += (scratches * 2.0 - 1.0).rgb;gl_FragColor = color;}",
            null);
        this.resolution = Lb();
        this.uniforms.mappedMatrix = new PIXI.Matrix;
        this.uniforms.scratchTex = PIXI.Texture.fromImage("img/scratches.png");
        this.uniforms.scratchTex.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.uniforms.screenRatio = [300 / 220, .5];
        this.uniforms.screenMultiply = this.fischinger_FilmFilter$screenMultiplyTarget = 1.3;
        this.uniforms.random = [Math.random(), Math.random()];
        var a = this;
        this.updateIntervalId = setInterval(function() {
            a.uniforms.random[0] = Math.random();
            a.uniforms.random[1] =
                Math.random();
            a.uniforms.screenMultiply = Qa(a.uniforms.screenMultiply, a.fischinger_FilmFilter$screenMultiplyTarget, Math.min(Math.max(.005 * u, 0), 1))
        }, 100)
    };
    n(Ob, PIXI.AbstractFilter);
    Ob.prototype.apply = function(a, b, c) {
        a.calculateNormalizedScreenSpaceMatrix(this.uniforms.mappedMatrix);
        a.applyFilter(this, b, c, !1)
    };
    Ob.prototype.update = function() {
        Nb.filterManager.calculateNormalizedScreenSpaceMatrix(this.uniforms.mappedMatrix);
        this.uniforms.screenRatio[0] = [.5 * v / w, .5]
    };
    Ob.prototype.cleanup = function() {
        clearInterval(this.updateIntervalId)
    };
    var Pb;
    a: {
        var Qb = l.navigator;
        if (Qb) {
            var Rb = Qb.userAgent;
            if (Rb) {
                Pb = Rb;
                break a
            }
        }
        Pb = ""
    }
    var x = function(a) {
        return q(Pb, a)
    };
    var Sb = function(a) {
        Sb[" "](a);
        return a
    };
    Sb[" "] = function() {};
    var Ub = function(a, b) {
        var c = Tb;
        return Object.prototype.hasOwnProperty.call(c, a) ? c[a] : c[a] = b(a)
    };
    var Vb = x("Opera"),
        Wb = x("Trident") || x("MSIE"),
        Xb = x("Edge"),
        Yb = x("Gecko") && !(q(Pb.toLowerCase(), "webkit") && !x("Edge")) && !(x("Trident") || x("MSIE")) && !x("Edge"),
        Zb = q(Pb.toLowerCase(), "webkit") && !x("Edge"),
        $b = function() {
            var a = l.document;
            return a ? a.documentMode : void 0
        },
        ac;
    a: {
        var bc = "",
            cc = function() {
                var a = Pb;
                if (Yb) return /rv\:([^\);]+)(\)|;)/.exec(a);
                if (Xb) return /Edge\/([\d\.]+)/.exec(a);
                if (Wb) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
                if (Zb) return /WebKit\/(\S+)/.exec(a);
                if (Vb) return /(?:Version)[ \/]?(\S+)/.exec(a)
            }();cc && (bc = cc ? cc[1] : "");
        if (Wb) {
            var dc = $b();
            if (null != dc && dc > parseFloat(bc)) {
                ac = String(dc);
                break a
            }
        }
        ac = bc
    }
    var ec = ac,
        Tb = {},
        fc = function(a) {
            return Ub(a, function() {
                for (var b = 0, c = ua(String(ec)).split("."), d = ua(String(a)).split("."), e = Math.max(c.length, d.length), f = 0; 0 == b && f < e; f++) {
                    var g = c[f] || "",
                        h = d[f] || "";
                    do {
                        g = /(\d*)(\D*)(.*)/.exec(g) || ["", "", "", ""];
                        h = /(\d*)(\D*)(.*)/.exec(h) || ["", "", "", ""];
                        if (0 == g[0].length && 0 == h[0].length) break;
                        b = va(0 == g[1].length ? 0 : parseInt(g[1], 10), 0 == h[1].length ? 0 : parseInt(h[1], 10)) || va(0 == g[2].length, 0 == h[2].length) || va(g[2], h[2]);
                        g = g[3];
                        h = h[3]
                    } while (0 == b)
                }
                return 0 <= b
            })
        },
        gc;
    var hc = l.document;
    gc = hc && Wb ? $b() || ("CSS1Compat" == hc.compatMode ? parseInt(ec, 10) : 5) : void 0;
    !Yb && !Wb || Wb && 9 <= Number(gc) || Yb && fc("1.9.1");
    var ic = Wb && !fc("9");
    var jc = function(a, b) {
        this.width = a;
        this.height = b
    };
    jc.prototype.ceil = function() {
        this.width = Math.ceil(this.width);
        this.height = Math.ceil(this.height);
        return this
    };
    jc.prototype.floor = function() {
        this.width = Math.floor(this.width);
        this.height = Math.floor(this.height);
        return this
    };
    jc.prototype.round = function() {
        this.width = Math.round(this.width);
        this.height = Math.round(this.height);
        return this
    };
    jc.prototype.scale = function(a, b) {
        this.width *= a;
        this.height *= "number" == typeof b ? b : a;
        return this
    };
    var lc = function(a, b, c) {
            function d(c) {
                c && b.appendChild(fa(c) ? a.createTextNode(c) : c)
            }
            for (var e = 1; e < c.length; e++) {
                var f = c[e];
                !la(f) || ma(f) && 0 < f.nodeType ? d(f) : Ea(kc(f) ? Ha(f) : f, d)
            }
        },
        mc = {
            SCRIPT: 1,
            STYLE: 1,
            HEAD: 1,
            IFRAME: 1,
            OBJECT: 1
        },
        nc = {
            IMG: " ",
            BR: "\n"
        },
        oc = function(a, b, c) {
            if (!(a.nodeName in mc))
                if (3 == a.nodeType) c ? b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : b.push(a.nodeValue);
                else if (a.nodeName in nc) b.push(nc[a.nodeName]);
                else
                    for (a = a.firstChild; a;) oc(a, b, c), a = a.nextSibling
        },
        kc = function(a) {
            if (a &&
                "number" == typeof a.length) {
                if (ma(a)) return "function" == typeof a.item || "string" == typeof a.item;
                if ("function" == ja(a)) return "function" == typeof a.item
            }
            return !1
        },
        pc = function(a) {
            this.document_ = a || l.document || document
        };
    pc.prototype.append = function(a, b) {
        lc(9 == a.nodeType ? a : a.ownerDocument || a.document, a, arguments)
    };
    var qc = 0,
        y = {},
        rc = [],
        z = function(a, b, c) {
            y[a] = b;
            c && !rc.includes(a) && rc.push(a)
        },
        sc = function(a) {
            var b = m();
            0 == a && (qc = b);
            y.e = a;
            y.t = 0 == qc ? -1 : Math.floor(b - qc);
            y.m = t ? 1 : 0;
            b = window.document;
            b = "CSS1Compat" == b.compatMode ? b.documentElement : b.body;
            b = new jc(b.clientWidth, b.clientHeight);
            y.w = b.width > b.height ? 1 : 0;
            y.o = "orientation" in window ? parseInt(window.orientation, 10) : "_";
            var b = [],
                c;
            for (c in y) y.hasOwnProperty(c) && b.push(c + ":" + y[c]);
            for (Kb(b.join(","), 10 == a); 0 < rc.length;) delete y[rc.pop()]
        };
    var A = function() {
        y.d = "fischinger";
        this.notesSinceLastLog_ = this.currentInstrument_ = this.lastLogTime_ = 0;
        this.msUntilNextFlush_ = 5E3;
        this.instrumentsPlayed_ = [];
        this.loggedCheckpoints_ = [];
        this.loggedEventIds_ = [];
        var a = tc();
        z("d2", 0 < a.length ? 1 : 0);
        for (var b = -1, c = 0; 3 > c; c++) {
            var d = document.getElementById("preset" + c).getAttribute("source");
            if (a == d) {
                b = c;
                break
            }
        } - 1 != b && uc(this, b, !0)
    };
    ia(A);
    A.prototype.update = function() {
        this.msUntilNextFlush_ -= u;
        0 >= this.msUntilNextFlush_ && (vc(this), this.msUntilNextFlush_ = 5E3)
    };
    var wc = function(a) {
            var b = m(),
                c = b - (a.lastLogTime_ || b);
            a.lastLogTime_ = b;
            z("d1", c)
        },
        zc = function() {
            A.getInstance();
            for (var a = 0, b = B.keys, c = 0; c < b.length; c++)
                for (var d = b[c], e = 0; e < d.length; e++)
                    for (var f = d[e], g = 0; g < f.length; g++) f[g] && a++;
            z("d3", a, !0);
            z("d4", C.delayEffectAdded ? 1 : C.bitCrushEffectAdded ? 2 : C.phaseEffectAdded ? 3 : 0, !0);
            z("d5", xc, !0);
            z("d6", yc, !0)
        },
        uc = function(a, b, c) {
            z("d3", b, !0);
            z("d4", c ? 1 : 0, !0);
            a.log(102)
        },
        vc = function(a) {
            0 < a.notesSinceLastLog_ && (z("d3", a.currentInstrument_, !0), z("d4", a.notesSinceLastLog_, !0), a.log(104), a.notesSinceLastLog_ = 0)
        },
        Ac = function(a) {
            var b = A.getInstance();
            b.loggedCheckpoints_.includes(a) || (wc(b), y.c = a, sc(1), b.loggedCheckpoints_.push(a))
        };
    A.prototype.log = function(a) {
        wc(this);
        sc(a);
        this.loggedEventIds_.push(a)
    };
    var Bc = function(a) {
        var b = A.getInstance();
        b.loggedEventIds_.includes(a) || b.log(a)
    };
    var E = function() {
        this.disposed_ = this.disposed_;
        this.onDisposeCallbacks_ = this.onDisposeCallbacks_
    };
    E.prototype.disposed_ = !1;
    E.prototype.dispose = function() {
        this.disposed_ || (this.disposed_ = !0, this.disposeInternal())
    };
    var Cc = function(a, b) {
        a.disposed_ ? b() : (a.onDisposeCallbacks_ || (a.onDisposeCallbacks_ = []), a.onDisposeCallbacks_.push(b))
    };
    E.prototype.disposeInternal = function() {
        if (this.onDisposeCallbacks_)
            for (; this.onDisposeCallbacks_.length;) this.onDisposeCallbacks_.shift()()
    };
    var Dc = function(a) {
        a && "function" == typeof a.dispose && a.dispose()
    };
    var Ec = function() {
            var a = (Ca || (Ca = new pc)).document_;
            a.webkitCancelFullScreen ? a.webkitCancelFullScreen() : a.mozCancelFullScreen ? a.mozCancelFullScreen() : a.msExitFullscreen ? a.msExitFullscreen() : a.exitFullscreen && a.exitFullscreen()
        },
        Fc = function() {
            var a = (Ca || (Ca = new pc)).document_;
            return !!(a.webkitIsFullScreen || a.mozFullScreen || a.msFullscreenElement || a.fullscreenElement)
        };
    var Gc = function(a) {
        E.call(this);
        this.module$contents$fischinger$Fullscreen_Fullscreen$element_ = a
    };
    ba(Gc, E);
    var Ic = function() {
        var a = Hc.module$contents$fischinger$Fullscreen_Fullscreen$element_;
        a.webkitRequestFullscreen ? a.webkitRequestFullscreen() : a.mozRequestFullScreen ? a.mozRequestFullScreen() : a.msRequestFullscreen ? a.msRequestFullscreen() : a.requestFullscreen && a.requestFullscreen()
    };
    Gc.prototype.update = function() {
        vb && (this.module$contents$fischinger$Fullscreen_Fullscreen$element_.style.maxHeight = window.innerHeight + "px", window.scrollTo(0, 0))
    };
    var Jc = function() {
        this.setup();
        this.gridWidth = this.gridCanvas.width;
        this.gridHeight = this.gridCanvas.height;
        this.numXKeys = 16;
        this.numYKeys = 11;
        this.padding = 0;
        this.keyWidth = this.gridWidth / this.numXKeys - 2 * this.padding;
        this.keyHeight = this.gridHeight / this.numYKeys - 2 * this.padding;
        this.xKeyWidth = this.gridWidth / this.numXKeys;
        this.keyCheck = [];
        for (var a = 0; a < this.numXKeys; a++)
            for (var b = 0; b < this.numYKeys; b++) {
                var c = b * this.numXKeys + a;
                this.keyCheck[c] = [];
                for (var d = 0; 4 > d; d++) this.keyCheck[c].push(!1)
            }
    };
    ia(Jc);
    Jc.prototype.setup = function() {
        var a = this;
        this.gridCanvasAll = document.getElementById("gridcanvasall");
        this.gridAllCtx = this.gridCanvasAll.getContext("2d");
        this.gridCanvas = document.getElementById("gridcanvas");
        this.gridCtx = this.gridCanvas.getContext("2d");
        this.gridOverlayCanvas = document.getElementById("gridoverlaycanvas");
        this.gridOverlayCtx = this.gridOverlayCanvas.getContext("2d");
        this.gridCanvasAll.width = this.gridOverlayCanvas.width = this.gridCanvas.width = 150;
        this.gridCanvasAll.height = this.gridOverlayCanvas.height =
            this.gridCanvas.height = 90;
        this.controlsUIElm = document.getElementById("controlsui");
        this.controlsUIElm.addEventListener("click", function(b) {
            b = b.offsetX ? b.offsetX - 63 : b.layerX - 63;
            0 <= b && 100 >= b && (b = Math.floor(16 * b / 100), B && B.visible && (B.currentBeat = b - 1, Kc(a, b)))
        });
        this.gridFgImg = new Image;
        this.gridFgImg.onload = function() {
            a.gridOverlayCtx.fillStyle = a.gridOverlayCtx.createPattern(a.gridFgImg, "repeat-x");
            Kc(a, 0)
        };
        this.gridFgImg.src = "/logos/2017/fischinger/grid-fg.png"
    };
    var Mc = function(a, b, c) {
            a.gridCtx.clearRect(0, 0, a.gridWidth, a.gridHeight);
            for (var d = 0; d < a.numXKeys; d++)
                for (var e = 0; e < a.numYKeys; e++) b[d][e] && Lc(a, d, e, b[d][e], c)
        },
        Kc = function(a, b) {
            b++;
            a.gridOverlayCtx.clearRect(0, 0, a.gridWidth, a.gridHeight);
            a.gridOverlayCtx.save();
            a.gridOverlayCtx.translate(b * a.xKeyWidth, 0);
            a.gridOverlayCtx.fillRect(-b * a.xKeyWidth, 0, a.gridWidth, a.gridHeight);
            a.gridOverlayCtx.restore()
        },
        Lc = function(a, b, c, d, e) {
            var f = b * (a.keyWidth + 2 * a.padding) + a.padding,
                g = c * (a.keyHeight + 2 * a.padding) + a.padding;
            b = c * a.numXKeys + b;
            a.gridCtx.clearRect(f, g, a.keyWidth, a.keyHeight);
            d ? (a.gridCtx.fillStyle = "#9fccff", a.gridCtx.fillRect(f, g, a.keyWidth, a.keyHeight), a.keyCheck[b][e] = !0) : (a.gridCtx.clearRect(f, g, a.keyWidth, a.keyHeight), a.keyCheck[b][e] = !1);
            a.keyCheck[b][0] || a.keyCheck[b][1] || a.keyCheck[b][2] || a.keyCheck[b][3] ? (a.gridAllCtx.fillStyle = "#22262a", a.gridAllCtx.fillRect(f, g, a.keyWidth, a.keyHeight)) : a.gridAllCtx.clearRect(f, g, a.keyWidth, a.keyHeight)
        },
        Nc = function() {
            var a = Jc.getInstance();
            a.gridAllCtx.clearRect(0,
                0, a.gridCanvasAll.width, a.gridCanvasAll.height);
            for (var b = B, c = function(c) {
                for (var d = 0; d < b.numXKeys; d++)
                    for (var e = 0; e < b.numYKeys; e++) Lc(a, d, e, b.keys[c][d][e], c)
            }, d = 3; 0 <= d; d--) F != d && c(d);
            c(F)
        };
    var Oc = function(a, b, c) {
        if ("" == c) throw Error("e");
        for (var d = !0, e = 0, f = a.length; e < f; e++)
            if (a.charAt(e) != b.charAt(0)) {
                d = !1;
                break
            }
        if (d) return c.charAt(0);
        e = {};
        f = 0;
        for (d = b.length; f < d; f++) e[b.charAt(f)] = f;
        d = [];
        for (f = a.length - 1; 0 <= f; f--) {
            var g = a.charAt(f);
            var h = e[g];
            if ("undefined" == typeof h) throw Error("f`" + a + "`" + b + "`" + g);
            d.push(h)
        }
        var h = b.length,
            p = c.length;
        a = [];
        for (e = d.length - 1; 0 <= e; e--) {
            for (var D = 0, aa = 0, f = a.length; aa < f; aa++) g = a[aa], g = g * h + D, g >= p ? (b = g % p, D = (g - b) / p, g = b) : D = 0, a[aa] = g;
            for (; D;) b = D % p, a.push(b),
                D = (D - b) / p;
            D = d[e];
            for (aa = 0; D;) aa >= a.length && a.push(0), g = a[aa], g += D, g >= p ? (b = g % p, D = (g - b) / p, g = b) : D = 0, a[aa] = g, aa++
        }
        d = [];
        e = c.length;
        for (f = a.length - 1; 0 <= f; f--) {
            b = a[f];
            if (b >= e || 0 > b) throw Error("g`" + a + "`" + b);
            d.push(c.charAt(b))
        }
        return d.join("")
    };
    var Pc = function() {
        this.saveStates = ["", "", "", ""];
        this.currentState = this.saveStates.length - 1
    };
    Pc.prototype.setup = function() {
        this.onNote = function(a) {
            var b = a.value.name + a.value.octave;
            0 == a.value.instrument ? (C.hornInstrument.volume(a.value.velocity, b), C.hornInstrument.play(b)) : 1 == a.value.instrument ? (C.dingInstrument.volume(a.value.velocity, b), C.dingInstrument.play(b)) : 2 == a.value.instrument ? (C.keyInstrument.volume(a.value.velocity, b), C.keyInstrument.play(b)) : 3 == a.value.instrument && (C.pluckInstrument.volume(a.value.velocity, b), C.pluckInstrument.play(b))
        };
        Qc(Rc, this.onNote)
    };
    var tc = function() {
            var a = nb(window.location).queryData_.get("doodle");
            return a && (a = a.split("-")) && 1 < a.length ? a[1] : ""
        },
        Wc = function(a, b, c) {
            a.currentState == a.saveStates.length - 1 && (a.saveStates[a.currentState] = Sc(!1), document.getElementById("preset" + a.currentState).setAttribute("source", a.saveStates[a.currentState]));
            a.currentState = b;
            c ? Tc(c) : Tc(a.saveStates[a.currentState]);
            a.currentState != a.saveStates.length - 1 ? (Uc(G), Vc(H, !0)) : Vc(H, !1)
        },
        Tc = function(a) {
            B.visible = !1;
            Xc();
            if (!(128 > a.length)) {
                var b = a.substring(0,
                    128).match(/.{1,32}/g);
                if (4 == b.length) {
                    for (var c = 0; c < b.length; c++) {
                        B.keys[c] = [];
                        var d = b[c].match(/.{1,2}/g);
                        if (16 != d.length) return;
                        for (var e = 0; e < d.length; e++) {
                            var f = d[e];
                            "0" == f.charAt(0) && (f = f.charAt(1));
                            for (var f = Oc(f, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_", "01"), f = "00000000000" + f, f = f.substr(f.length - 11), g = [], h = 0; h < f.length; h++) "1" == f[h] ? g.push([e / d.length * .8 + .1, h / f.length * .8 + .1]) : g.push(!1);
                            B.keys[c].push(g)
                        }
                    }
                    Nc();
                    a = a.substring(128, a.length);
                    b = parseInt(a.substring(0, a.length -
                        2), 10);
                    0 > b || 500 < b || isNaN(b) || !isFinite(b) || (Yc(B, b), Zc(), document.getElementById("tempoinput").value = document.getElementById("temposlider").value = yc, b = parseInt(a.charAt(a.length - 1), 10), 0 > b || 11 < b || isNaN(b) || !isFinite(b) || (xc = b, document.getElementById("keyselector").value = b, $c(), ad(), bd(), b = document.getElementById("delayeffecton"), c = document.getElementById("bitcrusheffecton"), d = document.getElementById("phasereffecton"), b.checked = !1, c.checked = !1, d.checked = !1, a = a.charAt(a.length - 2), "b" == a ? (cd(), b.checked = !0, dd()) : "c" == a ? (ed(), c.checked = !0, fd()) : "d" == a ? (gd(), d.checked = !0, hd()) : id(), 0 != F && (F = 3, G.instrumentButtonClickHandler())))
                }
            }
        },
        Sc = function(a) {
            var b = jd(0),
                c = jd(1),
                d = jd(2),
                e = jd(3),
                f = b[1] + "" + c[1] + "" + d[1] + "" + e[1],
                g = "" + yc;
            C.delayEffectAdded ? (g += "b", f += "1") : C.bitCrushEffectAdded ? (g += "c", f += "2") : C.phaseEffectAdded ? (g += "d", f += "3") : (g += "a", f += "0");
            g += xc;
            return b[0] + c[0] + d[0] + e[0] + g + (a ? "&thumb=" + f : "")
        },
        jd = function(a) {
            a = B.keys[a];
            for (var b = 0, c = "", d = 0; d < a.length; d++) {
                for (var e = a[d], f = "", g = 0; g < e.length; g++) e[g] ?
                    (f += "1", b++) : f += "0";
                e = Oc(f, "01", "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_");
                1 == e.length && (e = "0" + e);
                c += e
            }
            return [c, 30 < b ? 3 : 10 < b ? 2 : 0 < b ? 1 : 0]
        };
    Pc.prototype.cleanup = function() {
        null != this.onNote && (I(Rc, this.onNote), this.onNote = null)
    };
    var kd = function(a) {
            this.value = a
        },
        md = function(a) {
            a = a || {};
            this.fischinger_Slot$listeners = [];
            a.name && (this.name = a.name);
            ld.push(this)
        },
        ld = [],
        nd = function(a) {
            return new md(a)
        },
        Qc = function(a, b) {
            if (-1 !== a.fischinger_Slot$listeners.indexOf(b)) throw Error("h");
            a.fischinger_Slot$listeners.push(b)
        },
        I = function(a, b) {
            var c = a.fischinger_Slot$listeners.indexOf(b); - 1 != c && a.fischinger_Slot$listeners.splice(c, 1)
        },
        od = function(a, b) {
            for (var c, d = new kd(b), e = 0; e < a.fischinger_Slot$listeners.length; e++) c = a.fischinger_Slot$listeners[e],
                c.call(void 0, d)
        };
    var sd = function(a, b, c) {
            J(a);
            this.fischinger_Tween$object = a;
            this.duration = b;
            this.vars = c;
            this.ease = c.ease || pd;
            delete c.ease;
            this.onUpdate = c.onUpdate ? c.onUpdate : null;
            delete c.onUpdate;
            this.onComplete = c.onComplete ? c.onComplete : null;
            delete c.onComplete;
            this.delay = c.delay ? c.delay : 0;
            delete c.delay;
            this.start = m() + this.delay;
            this.dead = !1;
            this.initialVars = {};
            for (var d in c) this.initialVars[d] = a[d];
            K.push(this);
            qd || (qd = !0, Jb(rd))
        },
        K = [],
        qd = !1,
        td = 0,
        L = function(a, b, c) {
            new sd(a, b, c)
        },
        J = function(a) {
            var b, c, d = [].concat(arguments);
            var e = K;
            var f = 0;
            for (b = e.length; f < b; f++)(c = e[f]) && -1 != d.indexOf(c.fischinger_Tween$object) && (c = K.indexOf(c), -1 !== c && K.splice(c, 1))
        },
        rd = function() {
            if (qd && !td) {
                var a, b;
                try {
                    var c = K;
                    var d = c.length;
                    0 == d && (qd = !1);
                    for (b = 0; b < d; b++) {
                        var e = c[b];
                        var f = m() - e.start - e.delay;
                        if (0 <= f)
                            if (f > e.duration) {
                                for (a in e.vars) e.fischinger_Tween$object[a] = e.vars[a];
                                if (e.onUpdate) e.onUpdate();
                                if (e.onComplete) e.onComplete();
                                e.dead = !0
                            } else {
                                for (a in e.vars) e.fischinger_Tween$object[a] = e.ease(f, e.initialVars[a], e.vars[a] - e.initialVars[a],
                                    e.duration);
                                if (e.onUpdate) e.onUpdate()
                            }
                    }
                    d = K.length;
                    for (b = d - 1; 0 <= b; --b) K[b].dead && K.splice(b, 1);
                    Jb(rd)
                } catch (g) {
                    throw qd = !1, Error(g);
                }
            }
            return qd
        },
        ud = function(a, b, c, d) {
            return c * a / d + b
        },
        vd = function(a, b, c, d) {
            a /= d;
            return c * a * a * a + b
        },
        pd = function(a, b, c, d) {
            a /= d;
            a--;
            return c * (a * a * a + 1) + b
        },
        wd = function(a, b, c, d) {
            a /= d / 2;
            if (1 > a) return c / 2 * a * a * a + b;
            a -= 2;
            return c / 2 * (a * a * a + 2) + b
        },
        xd = function(a, b, c, d) {
            var e = 0,
                f = c;
            if (0 == a) return b;
            if (1 == (a /= d)) return b + c;
            e || (e = .3 * d);
            if (f < Math.abs(c)) {
                f = c;
                var g = e / 4
            } else g = e / (2 * Math.PI) * Math.asin(c /
                    f);
            return f * Math.pow(2, -10 * a) * Math.sin(2 * (a * d - g) * Math.PI / e) + c + b
        };
    var yd = !Wb || 9 <= Number(gc),
        zd = Wb && !fc("9");
    !Zb || fc("528");
    Yb && fc("1.9b") || Wb && fc("8") || Vb && fc("9.5") || Zb && fc("528");
    Yb && !fc("8") || Wb && fc("9");
    var Ad = function() {
        if (!l.addEventListener || !Object.defineProperty) return !1;
        var a = !1,
            b = Object.defineProperty({}, "passive", {
                get: function() {
                    a = !0
                }
            });
        l.addEventListener("test", null, b);
        l.removeEventListener("test", null, b);
        return a
    }();
    var Bd = function(a, b) {
        this.type = a;
        this.goog_events_Event$currentTarget = this.target = b;
        this.propagationStopped_ = !1;
        this.returnValue_ = !0
    };
    Bd.prototype.goog_events_Event_prototype$stopPropagation = function() {
        this.propagationStopped_ = !0
    };
    Bd.prototype.goog_events_Event_prototype$preventDefault = function() {
        this.returnValue_ = !1
    };
    var M = function(a, b) {
        Bd.call(this, a ? a.type : "");
        this.relatedTarget = this.goog_events_Event$currentTarget = this.target = null;
        this.button = this.screenY = this.screenX = this.clientY = this.clientX = this.offsetY = this.offsetX = 0;
        this.key = "";
        this.goog_events_BrowserEvent$keyCode = 0;
        this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
        this.event_ = null;
        a && this.init(a, b)
    };
    n(M, Bd);
    M.prototype.init = function(a, b) {
        var c = this.type = a.type,
            d = a.changedTouches ? a.changedTouches[0] : null;
        this.target = a.target || a.srcElement;
        this.goog_events_Event$currentTarget = b;
        var e = a.relatedTarget;
        if (e) {
            if (Yb) {
                a: {
                    try {
                        Sb(e.nodeName);
                        var f = !0;
                        break a
                    } catch (g) {}
                    f = !1
                }
                f || (e = null)
            }
        } else "mouseover" == c ? e = a.fromElement : "mouseout" == c && (e = a.toElement);
        this.relatedTarget = e;
        null === d ? (this.offsetX = Zb || void 0 !== a.offsetX ? a.offsetX : a.layerX, this.offsetY = Zb || void 0 !== a.offsetY ? a.offsetY : a.layerY, this.clientX = void 0 !==
        a.clientX ? a.clientX : a.pageX, this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0) : (this.clientX = void 0 !== d.clientX ? d.clientX : d.pageX, this.clientY = void 0 !== d.clientY ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0);
        this.button = a.button;
        this.goog_events_BrowserEvent$keyCode = a.keyCode || 0;
        this.key = a.key || "";
        this.ctrlKey = a.ctrlKey;
        this.altKey = a.altKey;
        this.shiftKey = a.shiftKey;
        this.metaKey = a.metaKey;
        this.event_ = a;
        a.defaultPrevented &&
        this.goog_events_Event_prototype$preventDefault()
    };
    M.prototype.goog_events_Event_prototype$stopPropagation = function() {
        M.superClass_.goog_events_Event_prototype$stopPropagation.call(this);
        this.event_.stopPropagation ? this.event_.stopPropagation() : this.event_.cancelBubble = !0
    };
    M.prototype.goog_events_Event_prototype$preventDefault = function() {
        M.superClass_.goog_events_Event_prototype$preventDefault.call(this);
        var a = this.event_;
        if (a.preventDefault) a.preventDefault();
        else if (a.returnValue = !1, zd) try {
            if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) a.keyCode = -1
        } catch (b) {}
    };
    var Cd = "closure_listenable_" + (1E6 * Math.random() | 0),
        Dd = function(a) {
            return !(!a || !a[Cd])
        },
        Ed = 0;
    var Fd = function(a, b, c, d, e) {
            this.listener = a;
            this.proxy = null;
            this.src = b;
            this.type = c;
            this.capture = !!d;
            this.handler = e;
            this.key = ++Ed;
            this.removed = this.callOnce = !1
        },
        Gd = function(a) {
            a.removed = !0;
            a.listener = null;
            a.proxy = null;
            a.src = null;
            a.handler = null
        };
    var Hd = function(a) {
        this.src = a;
        this.goog_events_ListenerMap$listeners = {};
        this.typeCount_ = 0
    };
    Hd.prototype.add = function(a, b, c, d, e) {
        var f = a.toString();
        a = this.goog_events_ListenerMap$listeners[f];
        a || (a = this.goog_events_ListenerMap$listeners[f] = [], this.typeCount_++);
        var g = Id(a, b, d, e); - 1 < g ? (b = a[g], c || (b.callOnce = !1)) : (b = new Fd(b, this.src, f, !!d, e), b.callOnce = c, a.push(b));
        return b
    };
    var Kd = function(a, b) {
            var c = b.type;
            if (!(c in a.goog_events_ListenerMap$listeners)) return !1;
            var d = a.goog_events_ListenerMap$listeners[c],
                e = Da(d, b),
                f;
            (f = 0 <= e) && Array.prototype.splice.call(d, e, 1);
            f && (Gd(b), 0 == a.goog_events_ListenerMap$listeners[c].length && (delete a.goog_events_ListenerMap$listeners[c], a.typeCount_--));
            return f
        },
        Ld = function(a, b) {
            var c = b && b.toString(),
                d = 0,
                e;
            for (e in a.goog_events_ListenerMap$listeners)
                if (!c || e == c) {
                    for (var f = a.goog_events_ListenerMap$listeners[e], g = 0; g < f.length; g++) ++d,
                        Gd(f[g]);
                    delete a.goog_events_ListenerMap$listeners[e];
                    a.typeCount_--
                }
        },
        Md = function(a, b, c, d, e) {
            a = a.goog_events_ListenerMap$listeners[b.toString()];
            b = -1;
            a && (b = Id(a, c, d, e));
            return -1 < b ? a[b] : null
        },
        Id = function(a, b, c, d) {
            for (var e = 0; e < a.length; ++e) {
                var f = a[e];
                if (!f.removed && f.listener == b && f.capture == !!c && f.handler == d) return e
            }
            return -1
        };
    var Nd = "closure_lm_" + (1E6 * Math.random() | 0),
        Od = {},
        Pd = 0,
        N = function(a, b, c, d, e) {
            if (d && d.once) return Qd(a, b, c, d, e);
            if (ka(b)) {
                for (var f = 0; f < b.length; f++) N(a, b[f], c, d, e);
                return null
            }
            c = Rd(c);
            return Dd(a) ? a.listen(b, c, ma(d) ? !!d.capture : !!d, e) : Sd(a, b, c, !1, d, e)
        },
        Sd = function(a, b, c, d, e, f) {
            if (!b) throw Error("i");
            var g = ma(e) ? !!e.capture : !!e,
                h = Td(a);
            h || (a[Nd] = h = new Hd(a));
            c = h.add(b, c, d, g, f);
            if (c.proxy) return c;
            d = Ud();
            c.proxy = d;
            d.src = a;
            d.listener = c;
            if (a.addEventListener) Ad || (e = g), void 0 === e && (e = !1), a.addEventListener(b.toString(),
                d, e);
            else if (a.attachEvent) a.attachEvent(Vd(b.toString()), d);
            else throw Error("j");
            Pd++;
            return c
        },
        Ud = function() {
            var a = Wd,
                b = yd ? function(c) {
                    return a.call(b.src, b.listener, c)
                } : function(c) {
                    c = a.call(b.src, b.listener, c);
                    if (!c) return c
                };
            return b
        },
        Qd = function(a, b, c, d, e) {
            if (ka(b)) {
                for (var f = 0; f < b.length; f++) Qd(a, b[f], c, d, e);
                return null
            }
            c = Rd(c);
            return Dd(a) ? a.eventTargetListeners_.add(String(b), c, !0, ma(d) ? !!d.capture : !!d, e) : Sd(a, b, c, !0, d, e)
        },
        Xd = function(a, b, c, d, e) {
            if (ka(b))
                for (var f = 0; f < b.length; f++) Xd(a, b[f],
                    c, d, e);
            else d = ma(d) ? !!d.capture : !!d, c = Rd(c), Dd(a) ? a.unlisten(b, c, d, e) : a && (a = Td(a)) && (b = Md(a, b, c, d, e)) && Yd(b)
        },
        Yd = function(a) {
            if ("number" == typeof a || !a || a.removed) return !1;
            var b = a.src;
            if (Dd(b)) return Kd(b.eventTargetListeners_, a);
            var c = a.type,
                d = a.proxy;
            b.removeEventListener ? b.removeEventListener(c, d, a.capture) : b.detachEvent && b.detachEvent(Vd(c), d);
            Pd--;
            (c = Td(b)) ? (Kd(c, a), 0 == c.typeCount_ && (c.src = null, b[Nd] = null)) : Gd(a);
            return !0
        },
        Vd = function(a) {
            return a in Od ? Od[a] : Od[a] = "on" + a
        },
        $d = function(a, b, c, d) {
            var e = !0;
            if (a = Td(a))
                if (b = a.goog_events_ListenerMap$listeners[b.toString()])
                    for (b = b.concat(), a = 0; a < b.length; a++) {
                        var f = b[a];
                        f && f.capture == c && !f.removed && (f = Zd(f, d), e = e && !1 !== f)
                    }
            return e
        },
        Zd = function(a, b) {
            var c = a.listener,
                d = a.handler || a.src;
            a.callOnce && Yd(a);
            return c.call(d, b)
        },
        Wd = function(a, b) {
            if (a.removed) return !0;
            if (!yd) {
                var c;
                if (!(c = b)) a: {
                    c = ["window", "event"];
                    for (var d = l, e; e = c.shift();)
                        if (null != d[e]) d = d[e];
                        else {
                            c = null;
                            break a
                        }
                    c = d
                }
                e = c;
                c = new M(e, this);
                d = !0;
                if (!(0 > e.keyCode || void 0 != e.returnValue)) {
                    a: {
                        var f = !1;
                        if (0 == e.keyCode) try {
                            e.keyCode = -1;
                            break a
                        } catch (p) {
                            f = !0
                        }
                        if (f || void 0 == e.returnValue) e.returnValue = !0
                    }
                    e = [];
                    for (f = c.goog_events_Event$currentTarget; f; f = f.parentNode) e.push(f);
                    for (var g = a.type, h = e.length - 1; !c.propagationStopped_ && 0 <= h; h--) c.goog_events_Event$currentTarget = e[h],
                        f = $d(e[h], g, !0, c),
                        d = d && f;
                    for (h = 0; !c.propagationStopped_ && h < e.length; h++) c.goog_events_Event$currentTarget = e[h],
                        f = $d(e[h], g, !1, c),
                        d = d && f
                }
                return d
            }
            return Zd(a, new M(b, this))
        },
        Td = function(a) {
            a = a[Nd];
            return a instanceof Hd ? a : null
        },
        ae = "__closure_events_fn_" + (1E9 * Math.random() >>> 0),
        Rd = function(a) {
            if ("function" == ja(a)) return a;
            a[ae] || (a[ae] = function(b) {
                return a.handleEvent(b)
            });
            return a[ae]
        };
    var be = function(a) {
            return 0 == a && C.hornInstrument ? C.hornInstrument.duration() / 75 : 1 == a && C.dingInstrument ? C.dingInstrument.duration() / 75 : 2 == a && C.keyInstrument ? C.keyInstrument.duration() / 75 : 3 == a && C.pluckInstrument ? C.pluckInstrument.duration() / 75 : -1 == a && C.pluckInstrument ? (C.pluckInstrument.duration() + C.dingInstrument.duration() + C.hornInstrument.duration() + C.keyInstrument.duration()) / 300 : 0
        },
        Hc = new Gc(document.getElementById("hplogo")),
        ce = null,
        H = null,
        de = null,
        C = null,
        B = null,
        yc = 100,
        xc = 0,
        F = 0,
        G = null,
        ee = null,
        Rc = nd({
            name: "note"
        });
    nd({
        name: "instrument"
    });
    var fe = nd({
            name: "tap"
        }),
        ge = nd({
            name: "swipe"
        }),
        he = new Pc,
        ie = nd({
            name: "doodleResize"
        }),
        je = !1,
        ke = !0,
        le = null,
        me = null,
        ne = 0,
        u = 0,
        oe = xa,
        O = null,
        P = null,
        pe = {
            C: 1,
            "C#": 2,
            D: 3,
            "D#": 4,
            E: 5,
            F: 6,
            "F#": 7,
            G: 8,
            "G#": 9,
            A: 10,
            "A#": 11,
            B: 12
        },
        Q = null,
        v = 0,
        w = 0,
        qe = null,
        re = !1,
        se = "",
        ue = function() {
            if (t) te(window.innerWidth, window.innerHeight);
            else {
                te(Math.max(window.innerWidth, 800), Math.max(window.innerHeight, 500));
                var a = document.getElementById("lga");
                a && (se = window.getComputedStyle(a).marginTop, a.style.marginTop = "0");
                if (a = document.getElementById("hplogo")) a.style.left =
                    "0", a.style.position = "absolute", a.style.zIndex = "1000"
            }
        },
        te = function(a, b) {
            var c = document.getElementById("fpdoodle");
            c && (c.style.width = a + "px", c.style.height = b + "px");
            Nb.resize(a, b);
            qe.className = "fullwindow";
            qe.style.width = a + "px";
            qe.style.height = b + "px";
            v = a;
            w = b;
            Q.backgroundSprite.height = Q.backgroundSprite.width = Math.max(a, b);
            od(ie, {})
        },
        R = 1,
        ve = {},
        we = !1,
        Lb = function() {
            return window.devicePixelRatio && 1 < window.devicePixelRatio ? 1.5 : 1
        },
        xe = [],
        S = null,
        T = null,
        U = null,
        V = null,
        id = function() {
            S || (Xc(), S = new Ob, ye(S))
        },
        fd = function() {
            T || (Xc(), T = new Mb, ye(T))
        },
        hd = function() {
            U || (Xc(), U = new PIXI.filters.BloomFilter, U.blurX = 0, ye(U))
        },
        dd = function() {
            V || (Xc(), V = new PIXI.filters.RGBSplitFilter, V.red = [-1, -1], V.green = [1, 1], ye(V))
        },
        Nb = null,
        ze = function(a, b) {
            null == Q && (Q = b, Nb = a, Q.setup(), Q.padding = 0, we || (a.state.blendModes[PIXI.BLEND_MODES.ADD] = [a.gl.ONE, a.gl.ONE]))
        },
        ye = function(a) {
            xe.push(a);
            Q.filters = xe
        },
        Ae = function(a) {
            xe.splice(xe.indexOf(a), 1);
            Q.filters = xe
        },
        Xc = function() {
            V = U = S = T = null;
            xe = Q.filters = []
        },
        Be = function(a, b) {
            var c =
                Hb(b);
            if (a && c)
                if ("textContent" in a) a.textContent = c;
                else if (3 == a.nodeType) a.data = String(c);
                else if (a.firstChild && 3 == a.firstChild.nodeType) {
                    for (; a.lastChild != a.firstChild;) a.removeChild(a.lastChild);
                    a.firstChild.data = String(c)
                } else {
                    for (var d; d = a.firstChild;) a.removeChild(d);
                    a.appendChild((9 == a.nodeType ? a : a.ownerDocument || a.document).createTextNode(String(c)))
                }
        },
        W = function(a, b) {
            Be(document.getElementById(a), b)
        },
        Ce = function() {
            W("hpofquotetext", "Quote");
            W("hpofquotecite", "Quote 2");
            W("loadedcount", "Loading");
            W("instructionscontent", t ? "Instruction Mobile" : "Instruction Desktop");
            W("changeinstrumentsinstructions", "Instruction 2");
            W("fullscreen", "Button - Fullscreen");
            W("hpofmodifylabel", "Button - Modify");
            W("hpofdelay", "Modify - Delay");
            W("hpofphaser", "Modify - Phaser");
            W("hpofbitcrush", "Modify - Bitcrush");
            W("hpofpresets", "Presets");
            W("hpofsharetext", "Share - Text");
            W("newrecording", "Share - Text 2");
            W("hpofkeylabel", "Modify - Key");
            W("hpoftempo", "Modify - Tempo");
            W("hpofsearchlabel", "Search Query");
            var a =
                    document.getElementById("searchquery"),
                b = Hb("Button - Search Hover");
            a && b && (a.title = b);
            if (a = document.getElementById("keyselector"))
                for (var a = a.getElementsByTagName("option"), b = 0, c; c = a[b++];) {
                    var d = c;
                    if (ic && null !== c && "innerText" in c) c = c.innerText.replace(/(\r\n|\r|\n)/g, "\n");
                    else {
                        var e = [];
                        oc(c, e, !0);
                        c = e.join("")
                    }
                    c = c.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
                    c = c.replace(/\u200B/g, "");
                    ic || (c = c.replace(/ +/g, " "));
                    " " != c && (c = c.replace(/^\s*/, ""));
                    Be(d, "Key - " + c)
                }
        },
        De = "https://" + window.location.hostname +
            "/webhp?doodle=32501999-",
        Ee = function() {
            return document.getElementById("shortlinkurl").value
        },
        Fe = function() {
            return Eb("share", "")
        },
        Ge = function() {
            A.getInstance().log(101);
            window.location.reload()
        },
        He = function(a) {
            27 == a.goog_events_BrowserEvent$keyCode && Ge();
            a.goog_events_Event_prototype$preventDefault();
            a.goog_events_Event_prototype$stopPropagation()
        },
        Ie = function() {
            var a = document.getElementById("lst-ib");
            a && N(a, "keydown", He)
        };
    var X = function(a, b, c) {
        this.activeShapes = [];
        this.freeShapes = [];
        ve[a] = this;
        for (a = 0; a < c; a++) this.freeShapes.push(b())
    };
    X.prototype.cleanup = function() {
        for (var a = this.activeShapes.length - 1; 0 <= a; a--) this.release(this.activeShapes[a])
    };
    X.prototype.get = function(a, b, c, d) {
        0 == this.freeShapes.length && this.release(this.activeShapes[0]);
        var e = this.freeShapes.pop();
        e.onSpawn(a, b, c, d);
        this.activeShapes.push(e);
        return e
    };
    X.prototype.release = function(a) {
        var b = this.activeShapes.indexOf(a);
        return -1 != b ? (this.activeShapes.splice(b, 1), a.life = 0, a.parent && a.parent.removeChild(a), this.freeShapes.push(a), a) : null
    };
    var Y = function(a) {
        PIXI.Container.call(this);
        this.life = 1;
        this.pool = a;
        this.initialized = !1
    };
    n(Y, PIXI.Container);
    Y.prototype.update = function() {
        0 >= this.life && this.pool.release(this)
    };
    Y.prototype.init = function() {
        if (this.initialized) return !0;
        this.initialized = !0;
        return !1
    };
    Y.prototype.onSpawn = function(a, b, c) {
        this.init();
        this.life = 1;
        this.x = a;
        this.y = b;
        null == c && (c = Q);
        c.addChild(this);
        return this
    };
    var Je = function() {
        Y.call(this, Z)
    };
    n(Je, Y);
    Je.prototype.init = function() {
        if (Je.superClass_.init.call(this)) return !0;
        this.circles_ = [];
        this.NUM_CIRCLES_ = 10;
        for (var a = 0; a < this.NUM_CIRCLES_; a++) {
            var b = new PIXI.Graphics;
            this.addChild(b);
            b.alpha = .15;
            b.lineStyle(4, 11044555, 1);
            b.drawCircle(0, 0, 40 * this.NUM_CIRCLES_);
            b.scale.x = b.scale.y = a / this.NUM_CIRCLES_;
            this.circles_.push(b)
        }
        return !1
    };
    Je.prototype.onSpawn = function(a, b, c, d) {
        Je.superClass_.onSpawn.call(this, a, b, c, d);
        for (a = 0; a < this.NUM_CIRCLES_; a++) b = this.circles_[a], b.alpha = .15, b.scale.x = b.scale.y = a / this.NUM_CIRCLES_;
        return this
    };
    Je.prototype.update = function() {
        Je.superClass_.update.call(this);
        for (var a = 0; a < this.NUM_CIRCLES_; a++) {
            var b = this.circles_[a];
            b.scale.x += 5E-7 * u * yc;
            b.scale.y = b.scale.x;
            .999 <= b.scale.x && (b.scale.x = b.scale.y = 0);
            b.alpha = .19 * (1 - b.scale.x)
        }
    };
    var Z = new X("OrbitsShape", function() {
        return new Je
    }, 2);
    var Le = function() {
        Y.call(this, Ke)
    };
    n(Le, Y);
    Le.prototype.init = function() {		//google的G
        if (Le.superClass_.init.call(this)) return !0;
        this.points_ = [];
        this.shift_ = this.pulse_ = 0;
        for (var a = 800 / 30, b = 0; 30 > b; b++) this.points_.push(new PIXI.Point(b * a, 0));
        this.rope_ = new PIXI.mesh.Rope(O.textures["bluestrip.png"], this.points_);
        this.rope_.blendMode = PIXI.BLEND_MODES.ADD;
        this.addChild(this.rope_);
        return !1
    };
    Le.prototype.onSpawn = function(a, b, c, d) {
        Le.superClass_.onSpawn.call(this, a, b, c, d);
        this.rope_.rotation = -1.7;
        this.rope_.x = 70;
        this.rope_.y = 55;
        this.rope_.alpha = .9;
        this.rope_.scale.x = this.rope_.scale.y = .23;
        this.shift_ = this.pulse_ = 0;
        this.pivot.x = 70;
        return this
    };
    Le.prototype.update = function() {
        Le.superClass_.update.call(this);
        for (var a = 0; a < this.points_.length; a++) {
            var b = a + this.shift_,
                c = .04 * (b + 10);
            this.points_[a].y = c * Math.sin(.22 * b) * 200 + 201;
            this.points_[a].x = c * Math.cos(.22 * b) * 190 + 201
        }
        this.shift_ = .5 * Math.sin(this.pulse_) * R + 100 * (1 - R);
        this.rope_.scale.x = this.rope_.scale.y = .25 + .01 * Math.sin(.5 * this.pulse_);
        this.pulse_ += .005 * u
    };
    var Ke = new X("LetterGShape", function() {
        return new Le
    }, 1);
    var Ne = function() {
        Y.call(this, Me);
        this.shift_ = this.pulse_ = 0
    };
    n(Ne, Y);
    Ne.prototype.init = function() {		//google的o
        if (Ne.superClass_.init.call(this)) return !0;
        this.sprite_ = new PIXI.Sprite(O.textures["redoh.png"]);
        this.sprite_.blendMode = PIXI.BLEND_MODES.ADD;
        this.sprite_.scale.x = this.sprite_.scale.y = .35;
        this.addChild(this.sprite_);
        this.pivot.x = .5 * this.sprite_.width;
        this.pivot.y = .5 * this.sprite_.height;
        return !1
    };
    Ne.prototype.onSpawn = function(a, b, c, d) {
        Ne.superClass_.onSpawn.call(this, a, b, c, d);
        this.pulse_ = this.shift_ = 0;
        return this
    };
    Ne.prototype.update = function() {
        Ne.superClass_.update.call(this);
        this.sprite_.scale.x = this.sprite_.scale.y = .66 + .06 * this.shift_;
        this.pulse_ += .005 * u;
        this.shift_ = .25 * Math.sin(this.pulse_) * R + 20 * (1 - R)
    };
    var Me = new X("LetterOShape", function() {
        return new Ne
    }, 2);
    var Pe = function() {
        Y.call(this, Oe);
        this.shift_ = this.pulse_ = 0
    };
    n(Pe, Y);
    Pe.prototype.init = function() {		//google的g
        if (Pe.superClass_.init.call(this)) return !0;
        this.points_ = [];
        for (var a = 800 / 30, b = 0; 30 > b; b++) this.points_.push(new PIXI.Point(b * a, 0));
        this.rope_ = new PIXI.mesh.Rope(O.textures["bluestrip.png"], this.points_);
        this.addChild(this.rope_);
        this.rope_.blendMode = PIXI.BLEND_MODES.ADD;
        return !1
    };
    Pe.prototype.onSpawn = function(a, b, c, d) {
        Pe.superClass_.onSpawn.call(this, a, b, c, d);
        this.rope_.rotation = 1.3;
        this.rope_.alpha = .9;
        this.rope_.scale.x = this.rope_.scale.y = .2;
        this.shift_ = this.pulse_ = 0;
        return this
    };
    Pe.prototype.update = function() {
        Pe.superClass_.update.call(this);
        for (var a = 0; a < this.points_.length; a++) {
            var b = a + this.shift_,
                c = .04 * (b + 10);
            this.points_[a].y = c * Math.sin(.25 * b) * 200 + 201;
            this.points_[a].x = c * Math.cos(.25 * b) * 190 + 201
        }
        this.shift_ = .25 * Math.sin(this.pulse_) * R + 20 * (1 - R);
        this.rope_.scale.x = this.rope_.scale.y = .2 + .01 * Math.sin(.5 * this.pulse_);
        this.pulse_ += .005 * u
    };
    var Oe = new X("LetterLittleGShape", function() {
        return new Pe
    }, 1);
    var Re = function() {
        Y.call(this, Qe);
        this.pulse_ = 0
    };
    n(Re, Y);
    Re.prototype.init = function() {			//google的l
        if (Re.superClass_.init.call(this)) return !0;
        this.sprite_ = new PIXI.Sprite(O.textures["greentri.png"]);
        this.addChild(this.sprite_);
        this.sprite_.blendMode = PIXI.BLEND_MODES.ADD;
        return !1
    };
    Re.prototype.onSpawn = function(a, b, c, d) {
        Re.superClass_.onSpawn.call(this, a, b, c, d);
        this.sprite_.scale.y = .48;
        this.sprite_.rotation = -1.2;
        this.pulse_ = 0;
        return this
    };
    Re.prototype.update = function() {
        Re.superClass_.update.call(this);
        this.sprite_.scale.x = .9 + .05 * Math.abs(Math.sin(.1 * this.pulse_)) + (1 - R);
        this.pulse_ += .005 * u
    };
    var Qe = new X("LetterLShape", function() {
        return new Re
    }, 1);
    var Te = function() {
        Y.call(this, Se);
        this.shift_ = this.pulse_ = 0
    };
    n(Te, Y);
    Te.prototype.init = function() {			//google的e
        if (Te.superClass_.init.call(this)) return !0;
        var a = 800 / 30;
        this.points_ = [];
        for (var b = 0; 30 > b; b++) this.points_.push(new PIXI.Point(b * a, 0));
        this.rope_ = new PIXI.mesh.Rope(O.textures["redstrip.png"], this.points_);
        this.addChild(this.rope_);
        this.rope_.blendMode = PIXI.BLEND_MODES.ADD;
        return !1
    };
    Te.prototype.onSpawn = function(a, b, c, d) {
        Te.superClass_.onSpawn.call(this, a, b, c, d);
        this.rope_.rotation = -1;
        this.rope_.x = -60;
        this.rope_.y = 0;
        this.rope_.alpha = .9;
        this.rope_.scale.x = this.rope_.scale.y = .2;
        this.shift_ = this.pulse_ = 0;
        return this
    };
    Te.prototype.update = function() {
        Te.superClass_.update.call(this);
        for (var a = 0; a < this.points_.length; a++) {
            var b = a + this.shift_,
                c = .03 * b;
            this.points_[a].y = c * Math.cos(.25 * b) * 200 + 201;
            this.points_[a].x = c * Math.sin(.25 * b) * 190 + 201
        }
        this.shift_ = .25 * Math.sin(this.pulse_) * R + 20 * (1 - R);
        this.rope_.scale.x = this.rope_.scale.y = .2 + .01 * Math.sin(.5 * this.pulse_);
        this.pulse_ += .005 * u
    };
    var Se = new X("LetterEShape", function() {
        return new Te
    }, 1);
    var Ue = function(a) {
        PIXI.Container.call(this);
        this.textures_ = a;
        this.currentFrameFloor_ = this.currentFrame_ = 0;
        this.totalFrames_ = a.length;
        this.fischinger_MovieClip$animationSpeed = 1;
        this.spriteTint = 16777215;		//十进制的白色
        this.fischinger_MovieClip$loop = !0;
        this.sprite_ = new PIXI.Sprite(a[this.currentFrame_]);
        this.sprite_.blendMode = PIXI.BLEND_MODES.ADD;
        this.addChild(this.sprite_)
    };
    n(Ue, PIXI.Container);
    var Ve = function(a, b) {
            a.currentFrame_ = b;
            !a.fischinger_MovieClip$loop && a.currentFrame_ > a.totalFrames_ || (a.currentFrame_ %= a.totalFrames_, a.currentFrameFloor_ != Math.floor(a.currentFrame_) && (a.currentFrameFloor_ = Math.floor(a.currentFrame_), a.sprite_.texture = a.textures_[a.currentFrameFloor_], a.sprite_.tint = a.spriteTint))
        },
        We = function(a) {
            a.currentFrame_ += .075 * u * a.fischinger_MovieClip$animationSpeed;
            Ve(a, a.currentFrame_)
        };
    var Ye = function() {
        Y.call(this, Xe)
    };
    n(Ye, Y);
    Ye.prototype.init = function() {			//开始前悬浮掉的菱形雨
        if (Ye.superClass_.init.call(this)) return !0;
        this.drops_ = [];
        this.levels = 8;
        this.spacing = 120;
        this.vspacing = 80;
        for (var a = 0; a < this.levels; a++)
            for (var b = 0; b < a; b++)
                for (var c = a == this.levels - 1 ? 1 : 2, d = 0; d < c; d++) {
                    var e = new Ue([O.textures["raindrop0001.png"], O.textures["raindrop0002.png"], O.textures["raindrop0003.png"], O.textures["raindrop0004.png"], O.textures["raindrop0005.png"], O.textures["raindrop0006.png"], O.textures["raindrop0007.png"], O.textures["raindrop0008.png"], O.textures["raindrop0009.png"],
                        O.textures["raindrop0010.png"], O.textures["raindrop0011.png"], O.textures["raindrop0012.png"], O.textures["raindrop0013.png"], O.textures["raindrop0014.png"], O.textures["raindrop0015.png"], O.textures["raindrop0016.png"], O.textures["raindrop0017.png"], O.textures["raindrop0018.png"]
                    ]);
                    this.addChild(e);
                    e.pivot.x = .5 * e.width;
                    e.pivot.y = .5 * e.height;
                    e.x = b * this.spacing - a * this.spacing * .5;
                    e.y = 0 == d ? a * this.vspacing + this.levels * d * this.vspacing : (this.levels - a - 2) * this.vspacing + this.levels * d * this.vspacing;
                    e.scale.x =
                        e.scale.y = 1 + .3 * Math.random();
                    e.level = Math.floor(e.y / this.vspacing);
                    e.x += .5 * this.spacing;
                    e.y += -this.levels * this.vspacing + this.vspacing;
                    e.ix = e.x;
                    e.iy = e.y;
                    e.fischinger_MovieClip$animationSpeed = .5;
                    this.drops_.push(e)
                }
        this.rotation = .2 * Math.PI;
        this.blendMode = PIXI.BLEND_MODES.ADD;
        return !1
    };
    Ye.prototype.onSpawn = function(a, b, c, d) {
        Ye.superClass_.onSpawn.call(this, a, b, c, d);
        this.alpha = 1;
        for (a = 0; a < this.drops_.length; a++) Ve(this.drops_[a], a % this.drops_[a].level), this.drops_[a].x = this.drops_[a].ix + (20 * Math.random() - 10), this.drops_[a].y = this.drops_[a].iy + (20 * Math.random() - 10), this.drops_[a].velocity = .02 * Math.random() + .08, this.drops_[a].scale.x = this.drops_[a].scale.y = 1 + .3 * Math.random();
        return this
    };
    Ye.prototype.update = function() {
        Ye.superClass_.update.call(this);
        for (var a = 0; a < this.drops_.length; a++) this.drops_[a].y += this.drops_[a].velocity * u, this.drops_[a].scale.x -= .007 * u, .01 >= this.drops_[a].scale.x && (this.drops_[a].scale.x = 1), We(this.drops_[a]);
        this.alpha -= .001 * u;
        0 >= this.alpha && (this.alpha = 0, Xe.release(this))
    };
    var Xe = new X("RaindropsShape", function() {
        return new Ye
    }, 5);
    var $e = function() {
        Y.call(this, Ze)
    };
    n($e, Y);
    $e.prototype.init = function() {			//开始前悬浮在G上的菱形动画？
        if ($e.superClass_.init.call(this)) return !0;
        this.NUM_DIAMONDS_ = 8;
        this.THETA_ = 2 * Math.PI / this.NUM_DIAMONDS_;
        this.diamonds_ = [];
        for (var a = 0; a < this.NUM_DIAMONDS_; a++) {
            var b = new Ue([O.textures["diamond0001.png"], O.textures["diamond0002.png"], O.textures["diamond0003.png"], O.textures["diamond0004.png"], O.textures["diamond0005.png"], O.textures["diamond0006.png"], O.textures["diamond0007.png"], O.textures["diamond0008.png"], O.textures["diamond0009.png"], O.textures["diamond0010.png"]]);
            this.addChild(b);
            this.diamonds_.push(b)
        }
        return !1
    };
    $e.prototype.onSpawn = function(a, b, c, d) {
        $e.superClass_.onSpawn.call(this, a, b, c, d);
        this.radius = 30;
        null == d && (d = {
            velocity: .75,
            name: "F",
            octave: 1
        });
        a = pe[d.cnote || d.name];
        for (b = 0; b < this.NUM_DIAMONDS_; b++) {
            c = this.diamonds_[b];
            var e = this.radius * Math.cos(this.THETA_ * b),
                f = this.radius * Math.sin(this.THETA_ * b);
            Ve(c, a / 12 * 9);
            c.pivot.x = .5 * c.width;
            c.pivot.y = .5 * c.height;
            c.scale.y = .75 * a / 12 * (d.octave + 1);
            c.rotation = Math.atan2(-e, f);
            c.x = e;
            c.y = f;
            this.diamonds_.push(c)
        }
        this.speed = .25 + .25 * a / 12 * (d.octave + 1);
        this.scale.x = this.scale.y =
            .25 + d.velocity * d.velocity * d.velocity;
        return this
    };
    $e.prototype.update = function() {
        $e.superClass_.update.call(this);
        this.radius += u * this.speed;
        for (var a = 0; a < this.NUM_DIAMONDS_; a++) {
            var b = this.diamonds_[a],
                c = this.radius * Math.cos(this.THETA_ * a),
                d = this.radius * Math.sin(this.THETA_ * a);
            b.scale.x = .002 * this.radius;
            if (1 <= b.scale.x) {
                b.scale.x = 1;
                Ze.release(this);
                break
            }
            b.spriteTint = PIXI.utils.rgb2hex([1 - .2 * b.scale.y, .8 + .01 * this.radius, 1 - .3 * b.scale.x]);
            b.alpha = 1 - b.scale.x;
            b.x = c;
            b.y = d
        }
    };
    var Ze = new X("StarburstShape", function() {
        return new $e
    }, 16);
    var af, bf = {
            allowedToAnimateCta: !0,
            allowedToExpand: !0,
            shouldDoIosNativeShare: !1,
            shouldFillWindow: !1,
            shouldRotateToLandscape: !1,
            shouldUseFullscreenApi: !1,
            shouldWriteScoreCookie: !1,
            shouldSetMetaViewportUserScaleableNo: !1,
            templatesShouldFetchDoodleArgsFromSlashDoodles: !1,
            allowedToLoadExtraAssetsBeforeCtaClick: !1,
            shouldUseMobileUi: !1,
            shouldLogFirstClickOnLoad: !1,
            name: 0
        },
        cf = {
            allowedToAnimateCta: !0,
            allowedToExpand: !0,
            shouldDoIosNativeShare: !1,
            shouldFillWindow: !1,
            shouldRotateToLandscape: !1,
            shouldUseFullscreenApi: !1,
            shouldWriteScoreCookie: !1,
            shouldSetMetaViewportUserScaleableNo: !0,		//不同
            templatesShouldFetchDoodleArgsFromSlashDoodles: !1,
            allowedToLoadExtraAssetsBeforeCtaClick: !1,
            shouldUseMobileUi: !1,
            shouldLogFirstClickOnLoad: !1,
            name: 1
        },
        df = {
            allowedToAnimateCta: !0,
            allowedToExpand: !1,	
            shouldDoIosNativeShare: !0,
            shouldFillWindow: !0,
            shouldRotateToLandscape: !1,
            shouldUseFullscreenApi: !1,
            shouldWriteScoreCookie: !1,
            shouldSetMetaViewportUserScaleableNo: !1,
            templatesShouldFetchDoodleArgsFromSlashDoodles: !1,
            allowedToLoadExtraAssetsBeforeCtaClick: !0,
            shouldUseMobileUi: !0,
            shouldLogFirstClickOnLoad: !0,
            name: 2
        },
        ef = {
            allowedToAnimateCta: !0,
            allowedToExpand: !1,
            shouldDoIosNativeShare: !1,
            shouldFillWindow: !0,
            shouldRotateToLandscape: !0,
            shouldUseFullscreenApi: !1,
            shouldWriteScoreCookie: !1,
            shouldSetMetaViewportUserScaleableNo: !1,
            templatesShouldFetchDoodleArgsFromSlashDoodles: !1,
            allowedToLoadExtraAssetsBeforeCtaClick: !0,
            shouldUseMobileUi: !0,
            shouldLogFirstClickOnLoad: !0,
            name: 3
        },
        ff = {
            allowedToAnimateCta: !0,
            allowedToExpand: !1,
            shouldDoIosNativeShare: !1,
            shouldFillWindow: !0,
            shouldRotateToLandscape: !1,
            shouldUseFullscreenApi: !1,
            shouldWriteScoreCookie: !0,
            shouldSetMetaViewportUserScaleableNo: !1,
            templatesShouldFetchDoodleArgsFromSlashDoodles: !0,
            allowedToLoadExtraAssetsBeforeCtaClick: !0,
            shouldUseMobileUi: !0,
            shouldLogFirstClickOnLoad: !0,
            name: 4
        },
        gf = {
            allowedToAnimateCta: !1,
            allowedToExpand: !0,
            shouldDoIosNativeShare: !1,
            shouldFillWindow: !1,
            shouldRotateToLandscape: !1,
            shouldUseFullscreenApi: !1,
            shouldWriteScoreCookie: !1,
            shouldSetMetaViewportUserScaleableNo: !1,
            templatesShouldFetchDoodleArgsFromSlashDoodles: !1,
            allowedToLoadExtraAssetsBeforeCtaClick: !1,
            shouldUseMobileUi: !1,
            shouldLogFirstClickOnLoad: !1,
            name: 6
        },
        hf = {
            allowedToAnimateCta: !0,
            allowedToExpand: !1,
            shouldDoIosNativeShare: !1,
            shouldFillWindow: !0,
            shouldRotateToLandscape: !0,
            shouldUseFullscreenApi: !0,
            shouldWriteScoreCookie: !1,
            shouldSetMetaViewportUserScaleableNo: !1,
            templatesShouldFetchDoodleArgsFromSlashDoodles: !1,
            allowedToLoadExtraAssetsBeforeCtaClick: !0,
            shouldUseMobileUi: !0,
            shouldLogFirstClickOnLoad: !0,
            name: 7
        },
        jf = {
            allowedToAnimateCta: !0,
            allowedToExpand: !1,
            shouldDoIosNativeShare: !1,
            shouldFillWindow: !0,
            shouldRotateToLandscape: !1,
            shouldUseFullscreenApi: !1,
            shouldWriteScoreCookie: !1,
            shouldSetMetaViewportUserScaleableNo: !1,
            templatesShouldFetchDoodleArgsFromSlashDoodles: !0,
            allowedToLoadExtraAssetsBeforeCtaClick: !0,
            shouldUseMobileUi: !1,
            shouldLogFirstClickOnLoad: !1,
            name: 9
        },
        kf = {
            allowedToAnimateCta: !0,
            allowedToExpand: !1,
            shouldDoIosNativeShare: !1,
            shouldFillWindow: !0,
            shouldRotateToLandscape: !0,
            shouldUseFullscreenApi: !0,
            shouldWriteScoreCookie: !1,
            shouldSetMetaViewportUserScaleableNo: !1,
            templatesShouldFetchDoodleArgsFromSlashDoodles: !0,
            allowedToLoadExtraAssetsBeforeCtaClick: !0,
            shouldUseMobileUi: !0,
            shouldLogFirstClickOnLoad: !0,
            name: 8
        },
        lf = {
            allowedToAnimateCta: !0,
            allowedToExpand: !1,
            shouldDoIosNativeShare: !1,
            shouldFillWindow: !0,
            shouldRotateToLandscape: !0,
            shouldUseFullscreenApi: !1,
            shouldWriteScoreCookie: !1,
            shouldSetMetaViewportUserScaleableNo: !1,
            templatesShouldFetchDoodleArgsFromSlashDoodles: !0,
            allowedToLoadExtraAssetsBeforeCtaClick: !0,
            shouldUseMobileUi: !0,
            shouldLogFirstClickOnLoad: !0,
            name: 5
        },
        mf = {
            allowedToAnimateCta: !0,
            allowedToExpand: !1,
            shouldDoIosNativeShare: !1,
            shouldFillWindow: !0,
            shouldRotateToLandscape: !0,
            shouldUseFullscreenApi: !1,
            shouldWriteScoreCookie: !1,
            shouldSetMetaViewportUserScaleableNo: !1,
            templatesShouldFetchDoodleArgsFromSlashDoodles: !1,
            allowedToLoadExtraAssetsBeforeCtaClick: !0,
            shouldUseMobileUi: !0,
            shouldLogFirstClickOnLoad: !0,
            name: 10
        },
        nf = {
            allowedToAnimateCta: !0,
            allowedToExpand: !1,
            shouldDoIosNativeShare: !1,
            shouldFillWindow: !0,
            shouldRotateToLandscape: !0,
            shouldUseFullscreenApi: !0,
            shouldWriteScoreCookie: !1,
            shouldSetMetaViewportUserScaleableNo: !1,
            templatesShouldFetchDoodleArgsFromSlashDoodles: !1,
            allowedToLoadExtraAssetsBeforeCtaClick: !0,
            shouldUseMobileUi: !0,
            shouldLogFirstClickOnLoad: !0,
            name: 11
        },
        of = {
            allowedToAnimateCta: !0,
            allowedToExpand: !0,
            shouldDoIosNativeShare: !1,
            shouldFillWindow: !1,
            shouldRotateToLandscape: !1,
            shouldUseFullscreenApi: !1,
            shouldWriteScoreCookie: !1,
            shouldSetMetaViewportUserScaleableNo: !1,
            templatesShouldFetchDoodleArgsFromSlashDoodles: !1,
            allowedToLoadExtraAssetsBeforeCtaClick: !1,
            shouldUseMobileUi: !1,
            shouldLogFirstClickOnLoad: !1,
            name: 12
        };
    var qf = function() {
            pf();
            return af.allowedToAnimateCta
        },
        rf = function() {
            pf();
            return af.shouldDoIosNativeShare
        },
        pf = function() {
            null == af && (af = xb && !Ab ? df : vb ? mf : yb ? ef : q(r, "Gbot") ? ff : document.getElementById("fkbx") && !t ? gf : 0 <= ub.indexOf("fpdoodle=1") && document.getElementById("fpdoodle") ? hf : document.querySelector("body.hp") ? t ? cf : bf : Ab ? zb ? lf : t ? kf : jf : t ? nf : of )
        };
    var sf = function() {
        PIXI.Container.call(this)
    };
    n(sf, PIXI.Container);
    sf.prototype.setup = function() {		//点开始
        if (null == this.playButton) {
            var a = this;
            this.bgBaseColor = new sa(82 / 255, 111 / 255, 187 / 255);
            this.bgColor = new sa(82 / 255, 111 / 255, 187 / 255);
            Q.backgroundTintColorTarget = this.bgColor;
            this.playButton = new PIXI.Container;
            this.yelloPlay = new PIXI.Sprite(O.textures["yelloplay.png"]);
            this.playButton.addChild(this.yelloPlay);
            this.yelloPlay.blendMode = PIXI.BLEND_MODES.ADD;
            this.yelloPlay.x = -50;
            this.yelloPlay.y = -50;
            this.yelloPlay.pivot = new PIXI.Point(50, 50);
            this.yelloPlay.alpha = .8;
            this.addChild(this.playButton);
            this.playButton.x = 338;
            this.playButton.y = 40;
            this.playScale = .9;
            this.whiteScaleX = 0;
            this.playButton.scale.x = this.playButton.scale.y = this.playScale;
            t || (this.yelloPlay.interactive = !0, this.yelloPlay.mouseover = function() {
                tf(a)
            }, this.yelloPlay.mouseout = function() {
                oe = xa;
                L(a, 1E3, {
                    playScale: .9,
                    whiteScaleX: 0,
                    ease: xd
                })
            });
            this.y = .5 * (w || 220);
            this.leftOrbits = Z.get(100, 40, this, null);
            this.rightOrbits = Z.get(470, -40, this, null);
            this.letterO = Me.get(200, -40, this, null);
            this.letterLittleG = Oe.get(440, -20, this, null);
            this.letterL =
                Qe.get(450, 90, this, null);
            this.letterE = Se.get(540, 60, this, null);
            this.yelloPlay.buttonMode = !0;
            this.tapHandler = function() {
                var b = document.getElementById("hplogocanvasdiv");
                b && (b.style.background = "#fff");
                if (document.getElementById("sdoodles")) {
                    var b = nb(window.parent.location.href).queryData_.get("doodle"),
                        d = nb(window.location.href);
                    d.queryData_.set("doodle", b);
                    Db(d.toString())
                } else Ac(1), Bc(10), C.cta.play("start"), a.yelloPlay.interactive = !1, oe = 0, uf(a), t || (b = document.body, b.classList ? b.classList.add("hpofdesktop") :
                    Ja(b) || (b.className += 0 < b.className.length ? " hpofdesktop" : "hpofdesktop"))
            };
            this.letterG = Ke.get(75, 10, this, null);
            if (qf()) Qc(fe, this.tapHandler);
            else {
                var b = document.getElementById("hplogocanvasdiv");
                b && (b.style.background = "#fff");
                this.tapHandler()
            }
            t && (this.orientationHandler = function() {
                Nb.resize(window.innerWidth, window.innerHeight);
                a.scale.x = a.scale.y = window.innerWidth / 600;
                Q.backgroundSprite.width = window.innerWidth;
                Q.backgroundSprite.height = window.innerHeight;
                a.y = .5 * window.innerHeight;
                tf(a)
            }, window.addEventListener("resize",
                this.orientationHandler), this.orientationHandler())
        }
    };
    var uf = function(a) {
        I(fe, a.tapHandler);
        a.yelloPlay.interactive = !1;
        t ? Ic() : Ie();
        L(a, 1E3, {
            alpha: 0,
            ease: vd,
            onUpdate: function() {
                R = Q.alpha = a.alpha
            },
            onComplete: function() {
                vf(Q);
                var a = Q;
                null == a.intro && (a.intro = new wf, a.addChild(a.intro), xf(a))
            }
        })
    };
    sf.prototype.cleanup = function() {
        Z.release(this.leftOrbits);
        Z.release(this.rightOrbits);
        Ke.release(this.letterG);
        Me.release(this.letterO);
        Oe.release(this.letterLittleG);
        Qe.release(this.letterL);
        Se.release(this.letterE);
        Ze.cleanup();
        Xe.cleanup();
        null != this.orientationHandler && (window.removeEventListener("resize", this.orientationHandler), this.orientationHandler = null);
        J(this);
        this.destroy()
    };
    var tf = function(a) {
        oe = 0;
        Ze.get(100, 0, a, null);
        Xe.get(.5 * (v || 600), 0, a, null);
        L(a, 1E3, {
            playScale: 1.1,
            whiteScaleX: .2,
            ease: xd
        })
    };
    sf.prototype.update = function() {
        this.bgColor.r = this.bgBaseColor.r + .15 * Math.sin(.003 * Date.now()) + .15 + .25;
        this.bgColor.b = this.bgBaseColor.b + .25;
        Q.backgroundTintColorTarget = this.bgColor;
        if (!t) {
            this.yelloPlay.scale.x = this.yelloPlay.scale.y = this.playScale * R;
            var a = Q.touchHandler.mouseX / 600;
            this.leftOrbits.scale.x = this.leftOrbits.scale.y = 1 - this.whiteScaleX + a / 5;
            this.rightOrbits.scale.x = this.rightOrbits.scale.y = this.whiteScaleX + 1 + a / 5
        }
    };
    var yf = function() {
        PIXI.Graphics.call(this)
    };
    n(yf, PIXI.Graphics);
    yf.prototype.setup = function() {
        var a = this;
        this.alpha = 0;
        this.activeGridPresses = {};
        this.gridPresses = [];
        this.doodleResizeHandler = function() {
            a.fischinger_Keyboard_prototype$drawGrid()
        };
        Qc(ie, this.doodleResizeHandler);
        t ? (this.instrumentPaddingX = this.x = 30, this.instrumentPaddingY = this.y = 60) : this.instrumentPaddingY = this.y = this.instrumentPaddingX = this.x = 75;
        this.interfaceOn = !1
    };
    yf.prototype.fischinger_Keyboard_prototype$drawGrid = function() {
        this.clear()
    };
    var Af = function(a) {
            a.interfaceOn || (zf(a), J(a), L(a, 500, {
                alpha: 1,
                ease: ud
            }), a.interfaceOn = !0, null != Q.instrument.leftOrbits && (Q.instrument.leftOrbits.visible = Q.instrument.rightOrbits.visible = !1, J(Q.instrument.leftOrbits), J(Q.instrument.rightOrbits), Q.instrument.leftOrbits.alpha = 0, Q.instrument.rightOrbits.alpha = 0), a.hideUITimeout = setTimeout(function() {
                a.interfaceOn && (zf(a), null != Q.instrument.leftOrbits && (J(Q.instrument.leftOrbits), J(Q.instrument.rightOrbits), a.extracontrolsElm && (a.extracontrolsElm.style.opacity =
                    0), Q.instrument.leftOrbits.alpha = 0, Q.instrument.rightOrbits.alpha = 0, Q.instrument.leftOrbits.visible = Q.instrument.rightOrbits.visible = !0, L(Q.instrument.leftOrbits, 1200, {
                    alpha: 1,
                    ease: ud
                }), L(Q.instrument.rightOrbits, 1200, {
                    alpha: 1,
                    ease: ud
                })), J(a), L(a, 500, {
                    alpha: 0,
                    delay: 1E3 * (1 - a.alpha),
                    ease: ud
                }), a.interfaceOn = !1)
            }, 1200))
        },
        zf = function(a) {
            a.hideUITimeout && (clearTimeout(a.hideUITimeout), a.hideUITimeout = null)
        };
    yf.prototype.fischinger_Keyboard_prototype$hide = function() {
        this.visible = !1;
        for (var a in this.activeGridPresses);
    };
    yf.prototype.fischinger_Keyboard_prototype$show = function() {
        this.visible = !0
    };
    yf.prototype.cleanup = function() {
        zf(this);
        this.clear();
        J(this);
        null != this.doodleResizeHandler && (I(ie, this.doodleResizeHandler), this.doodleResizeHandler = null);
        for (var a = 0; a < this.gridPresses.length; a++) Q.instrument.removeChild(this.gridPresses[a]);
        this.destroy()
    };
    var Bf = function() {
        this.mode = "beginner";
        PIXI.Graphics.call(this)
    };
    n(Bf, yf);
    Bf.prototype.setup = function() {
        Bf.superClass_.setup.call(this);
        F = 0;
        this.numXKeys = 16;
        this.numYKeys = 11;
        this.inBetweenChangingInstruments = !1;
        this.visible = !0;
        this.keys = [
            [],
            [],
            [],
            []
        ];
        this.highlightSprites = [];
        for (var a = 0; a < this.numYKeys; a++) {
            var b = new PIXI.Sprite(P.textures["basickey.png"]);
            b.pivot.x = .5 * b.width;
            b.pivot.y = .5 * b.height;
            b.scale.x = b.scale.y = .6;
            b.alpha = .5;
            this.highlightSprites.push(b);
            b.blendMode = PIXI.BLEND_MODES.ADD;
            this.addChild(b)
        }
        for (b = 0; b < this.numXKeys; b++)
            for (a = 0; a < this.numYKeys; a++) {
                var c =
                    new PIXI.Sprite(P.textures["basickey.png"]);
                this.gridPresses.push(c);
                c.pivot.x = .5 * c.width;
                c.pivot.y = .5 * c.height;
                c.scale.x = c.scale.y = .6;
                this.addChild(c);
                c.blendMode = PIXI.BLEND_MODES.ADD;
                c.visible = !1
            }
        for (c = 0; 4 > c; c++)
            for (b = 0; b < this.numXKeys; b++)
                for (a = 0; a < this.numYKeys; a++) this.keys[c][b] = [], this.keys[c][b][a] = !1;
        Q.backgroundTintColorTarget.r = .3;
        Q.backgroundTintColorTarget.g = .3;
        Q.backgroundTintColorTarget.b = .3;
        this.fischinger_Keyboard_prototype$drawGrid();
        a = tc();
        "" == a || Tc(a)
    };
    var Zc = function() {
            var a = B;
            a.inBetweenChangingInstruments = !0;
            J(a);
            zf(a);
            a.interfaceOn = !1;
            var b = F;
            L(a, 150, {
                alpha: 0,
                y: a.instrumentPaddingY + 10,
                onComplete: function() {
                    a.visible = !0;
                    a.y = a.instrumentPaddingY - 10;
                    for (var c = 0, d = 0; d < a.numYKeys; d++)
                        for (var e = 0; e < a.numXKeys; e++) J(a.gridPresses[c].scale), a.gridPresses[c].scale.x = a.gridPresses[c].scale.y = .6, a.gridPresses[c].visible = a.keys[b][e][d], c++;
                    J(a);
                    L(a, 150, {
                        alpha: 1,
                        y: a.instrumentPaddingY,
                        ease: ud,
                        onComplete: function() {
                            a.inBetweenChangingInstruments = !1;
                            Af(a)
                        }
                    })
                },
                ease: ud
            });
            Mc(Jc.getInstance(), a.keys[b], b)
        },
        Df = function(a) {
            a.currentBeat++;
            a.currentBeat >= a.numXKeys && (a.currentBeat = 0, Q.backgroundTintColorTarget.r = .3, Q.backgroundTintColorTarget.g = .3, Q.backgroundTintColorTarget.b = .3);
            Kc(Jc.getInstance(), a.currentBeat);
            var b;
            S ? S.fischinger_FilmFilter$screenMultiplyTarget = 1 : T && (T.fischinger_PixelFilter$screenMultiplyTarget = 1.3);
            for (var c = "C C# D D# E F F# G G# A A# B C C# D D# E F F# G G# A A# B".split(" "), d = [0, 2, 4, 7, 9], e = 0; e < a.keys.length; e++)
                for (var f = 0; f < a.numYKeys; f++)
                    if (a.keys[e][a.currentBeat][f]) {
                        var g =
                            f % 4;
                        var h = c[d[g] + xc];
                        g = c[d[g]];
                        4 > f ? b = 0 : 5 >= f ? b = 1 : 10 >= f ? b = 2 : 15 >= f && (b = 3);
                        S ? S.fischinger_FilmFilter$screenMultiplyTarget += .3 : T ? T.fischinger_PixelFilter$screenMultiplyTarget += .5 : U ? (U.blurY += 6, 10 < U.blurY && (U.blurY = 10)) : V && (V.red[0] += 4, 10 < V.red[0] && (V.red[0] = 10));
                        Q.backgroundTintColorTarget.r = e / 4 * (1 - pe[h] / 12);
                        Q.backgroundTintColorTarget.g = f / a.numYKeys;
                        Q.backgroundTintColorTarget.b = pe[h] / 12;
                        od(Rc, {
                            x: a.keys[e][a.currentBeat][f][0],
                            y: a.keys[e][a.currentBeat][f][1],
                            instrument: e,
                            velocity: F == e ? .6 - f / 15 * .3 : .4 -
                                f / 15 * .35,
                            octave: b,
                            name: h,
                            cnote: g
                        })
                    }
            Cf(a)
        },
        Cf = function(a) {
            if (!(0 > a.currentBeat))
                for (var b = 0; b < a.numYKeys; b++) {
                    var c = a.highlightSprites[b];
                    c.x = a.currentBeat * a.keyWidth + .5 * a.keyWidth;
                    c.y = a.keyHeight * b + .5 * a.keyHeight
                }
        },
        Ef = function(a, b) {
            var c = B;
            if (c.inBetweenChangingInstruments) return "";
            a -= c.instrumentPaddingX;
            b -= c.instrumentPaddingY;
            var d = Math.floor(a / c.gridWidth * c.numXKeys),
                e = Math.floor(b / c.gridHeight * c.numYKeys);
            if (e >= c.numYKeys || 0 > e || d >= c.numXKeys || 0 > d) return "";
            var f = d + e * c.numXKeys;
            c.gridPresses[f].visible ?
                (J(c.gridPresses[f].scale), c.gridPresses[f].visible = !1, c.keys[F][d][e] = !1, Lc(Jc.getInstance(), d, e, !1, F)) : (Lc(Jc.getInstance(), d, e, !0, F), a += c.instrumentPaddingX, b += c.instrumentPaddingY, J(c.gridPresses[f].scale), c.gridPresses[f].scale.x = c.gridPresses[f].scale.y = 3, L(c.gridPresses[f].scale, 200, {
                x: .6,
                y: .6
            }), c.gridPresses[f].visible = !0, c.keys[F][d][e] = [a / (v || 600), b / (w || 220)]);
            Ac(3);
            d = A.getInstance();
            e = F;
            e != d.currentInstrument_ && (vc(d), d.instrumentsPlayed_.includes(e) || (d.instrumentsPlayed_.push(e), z("d3",
                d.instrumentsPlayed_.length, !0), d.log(105)));
            d.currentInstrument_ = e;
            d.notesSinceLastLog_++;
            c.visible ? (Af(c), c = f + "") : c = "";
            return c
        };
    Bf.prototype.fischinger_Keyboard_prototype$show = function() {
        Bf.superClass_.fischinger_Keyboard_prototype$show.call(this);
        Jc.getInstance().setup();
        this.currentBeat = -1;
        Yc(this, yc);
        Df(this)
    };
    var Yc = function(a, b) {
        yc = b;
        a.onBeatInterval && clearInterval(a.onBeatInterval);
        a.onBeatInterval = setInterval(function() {
            Df(a)
        }, 6E4 / (2 * yc))
    };
    Bf.prototype.fischinger_Keyboard_prototype$hide = function() {
        Bf.superClass_.fischinger_Keyboard_prototype$hide.call(this);
        clearInterval(this.onBeatInterval)
    };
    Bf.prototype.fischinger_Keyboard_prototype$drawGrid = function() {
        Bf.superClass_.fischinger_Keyboard_prototype$drawGrid.call(this);
        this.gridHeight = w - 2 * this.instrumentPaddingY;
        this.gridWidth = v - 2 * this.instrumentPaddingX;
        this.keyWidth = this.gridWidth / this.numXKeys;
        this.keyHeight = this.gridHeight / this.numYKeys;
        this.lineStyle(1, 16777215, .15);
        for (var a = 0; a < this.numXKeys; a++)
            for (var b = 0; b < this.numYKeys; b++) {
                var c = this.gridPresses[b * this.numXKeys + a];
                c.x = a * this.keyWidth + .5 * this.keyWidth;
                c.y = b * this.keyHeight + .5 *
                    this.keyHeight;
                this.moveTo(c.x - 8, c.y);
                this.lineTo(c.x, c.y - 8);
                this.lineTo(c.x + 8, c.y);
                this.lineTo(c.x, c.y + 8);
                this.lineTo(c.x - 8, c.y)
            }
        Cf(this)
    };
    var Gf = function() {
        PIXI.Container.call(this)
    };
    n(Gf, PIXI.Container);
    Gf.prototype.setup = function() {
        var a = this;
        B = new Bf;
        B.setup();
        a.addChild(B);
        B.visible = !0;
        Hf();
        if (tc()) If(), Jf(a), Kf(H);
        else {
            var b = "click";
            t && (b = "tap");
            var c = P.textures;
            this.tapInstructionsAnimation = new PIXI.extras.MovieClip([c[b + "0001.png"], c[b + "0002.png"], c[b + "0003.png"], c[b + "0004.png"], c[b + "0005.png"], c[b + "0006.png"], c[b + "0007.png"], c[b + "0008.png"], c[b + "0009.png"], c[b + "0010.png"], c[b + "0011.png"], c[b + "0012.png"], c[b + "0013.png"], c[b + "0014.png"]]);
            this.tapInstructionsAnimation.animationSpeed = .5;
            this.tapInstructionsAnimation.scale.x =
                a.tapInstructionsAnimation.scale.y = .8;
            this.tapInstructionsAnimation.pivot.x = .5 * a.tapInstructionsAnimation.width;
            this.tapInstructionsAnimation.pivot.y = .5 * a.tapInstructionsAnimation.height;
            this.addChild(this.tapInstructionsAnimation);
            this.tapInstructionsAnimation.x = .5 * v;
            this.tapInstructionsAnimation.y = .5 * w;
            this.tapInstructionsAnimation.play();
            this.doodleResizeHandler = function() {
                a.tapInstructionsAnimation.x = .5 * v;
                a.tapInstructionsAnimation.y = .5 * w;
                null != a.leftOrbits && (a.leftOrbits.x = .2 * v, a.leftOrbits.y =
                    .2 * w, a.rightOrbits.x = .8 * v, a.rightOrbits.y = .8 * w)
            };
            b = document.getElementById("instructionscontent");
            b.innerHTML = b.innerHTML.replace("visual music composition", "visual&nbsp;music&nbsp;composition");
            b.style.display = "inline";
            document.getElementById("hpofquote").style.display = "none";
            b.className = "tapinstructions";
            document.getElementById("instructions").className = "reveal";
            this.tapHandler = function() {
                If();
                Jf(a);
                Kf(H)
            };
            Qc(fe, this.tapHandler);
            Qc(ge, this.tapHandler);
            Qc(ie, this.doodleResizeHandler)
        }
    };
    var Jf = function(a) {
        Lf();
        document.getElementById("instructions").className = "hide";
        a.removeChild(a.tapInstructionsAnimation);
        null != a.tapHandler && (I(fe, a.tapHandler), I(ge, a.tapHandler), a.tapHandler = null);
        a.leftOrbits = Z.get(.2 * v, .2 * w, a, null);
        a.rightOrbits = Z.get(.8 * v, .8 * w, a, null);
        a.leftOrbits.alpha = 0;
        a.rightOrbits.alpha = 0;
        a.rightOrbits.visible = !1
    };
    Gf.prototype.start = function() {
        Z.cleanup();
        he.setup();
        B.fischinger_Keyboard_prototype$show();
        Nc()
    };
    Gf.prototype.cleanup = function() {
        null == this.tapInstructionsAnimation && (J(this.tapInstructionsAnimation), this.removeChild(this.tapInstructionsAnimation));
        null != this.tapHandler && (I(fe, this.tapHandler), this.tapHandler = null);
        null != B && (this.removeChild(B), B.cleanup(), B = null);
        null != this.doodleResizeHandler && (Z.cleanup(), I(ie, this.doodleResizeHandler), this.leftOrbits = this.rightOrbits = this.doodleResizeHandler = null);
        Z.cleanup();
        he.cleanup();
        this.destroy()
    };
    var Nf = function() {
        Y.call(this, Mf)
    };
    n(Nf, Y);
    Nf.prototype.init = function() {
        if (Nf.superClass_.init.call(this)) return !0;
        this.anim_ = new Ue([O.textures["sequen0001.png"], O.textures["sequen0002.png"], O.textures["sequen0003.png"], O.textures["sequen0004.png"], O.textures["sequen0005.png"], O.textures["sequen0006.png"], O.textures["sequen0007.png"], O.textures["sequen0008.png"], O.textures["sequen0009.png"]]);
        this.anim_.fischinger_MovieClip$animationSpeed = .5;
        this.anim_.pivot.x = .5 * this.anim_.width;
        this.anim_.pivot.y = .5 * this.anim_.height;
        this.addChild(this.anim_);
        return !1
    };
    Nf.prototype.onSpawn = function(a, b, c, d) {
        Nf.superClass_.onSpawn.call(this, a, b, c, d);
        this.visible = !1;
        this.direction_ = .5 < Math.random() ? -1 : 1;
        a = pe[d.cnote || d.name];
        this.maxScale_ = .5 + d.velocity * (10 - Math.pow(a * d.octave / 6, 2));
        this.scale_ = .01;
        Ve(this.anim_, 0);
        this.anim_.rotation = 0;
        this.anim_.scale.x = this.anim_.scale.y = .1;
        this.anim_.pivot.x = this.anim_.width * d.velocity * .74;
        this.anim_.pivot.y = this.anim_.height * d.velocity * .74;
        this.anim_.scale.x = this.anim_.scale.y = this.scale_;
        this.anim_.alpha = 10 - this.scale_ * this.scale_ /
            2;
        .3 > this.anim_.alpha && (this.anim_.alpha = .3);
        this.anim_.spriteTint = PIXI.utils.rgb2hex([a / 6 + .5, .6 - d.velocity * a / 6, d.velocity * d.velocity * a]);
        this.rotation = this.maxScale_ + 360 * d.velocity;
        return this
    };
    Nf.prototype.update = function() {
        Nf.superClass_.update.call(this);
        this.scale_ += u * this.maxScale_ * .001;
        this.anim_.scale.x = this.anim_.scale.y = this.scale_ + .5 * Math.sin(.002 * u);
        this.anim_.alpha = 1 - this.scale_ / this.maxScale_;
        this.anim_.rotation = .1 * this.scale_ * this.direction_;
        this.anim_.pivot.x += .1 * u;
        We(this.anim_);
        this.visible || (this.visible = !0);
        this.scale_ >= this.maxScale_ && Mf.release(this)
    };
    var Mf = new X("CircleShape", function() {
        return new Nf
    }, 16);
    var Pf = function() {
        Y.call(this, Of)
    };
    n(Pf, Y);
    Pf.prototype.init = function() {			//
        if (Pf.superClass_.init.call(this)) return !0;
        this.anim_ = new Ue([P.textures["confetti0001.png"], P.textures["confetti0002.png"], P.textures["confetti0003.png"], P.textures["confetti0004.png"], P.textures["confetti0005.png"], P.textures["confetti0006.png"], P.textures["confetti0007.png"], P.textures["confetti0008.png"], P.textures["confetti0009.png"], P.textures["confetti0010.png"], P.textures["confetti0011.png"], P.textures["confetti0012.png"], P.textures["confetti0013.png"], P.textures["confetti0014.png"],
            P.textures["confetti0015.png"]
        ]);
        this.anim_.fischinger_MovieClip$animationSpeed = .6;
        this.anim_.pivot.x = this.anim_.width;
        this.anim_.pivot.y = .5 * this.anim_.height;
        this.addChild(this.anim_);
        return !1
    };
    Pf.prototype.onSpawn = function(a, b, c, d) {
        Pf.superClass_.onSpawn.call(this, a, b, c, d);
        null == d && (d = {
            velocity: .9,
            name: "F",
            octave: 1
        });
        a = pe[d.cnote || d.name];
        this.semiTone_ = a * (d.octave + 1) / 24;
        this.visible = !1;
        this.direction_ = .5 < Math.random() ? -1 : 1;
        this.maxScale_ = d.velocity * (10 - Math.pow(a / 6 + d.octave, 2));
        .1 > this.maxScale_ && (this.maxScale_ = .1);
        this.scale_ = .01;
        Ve(this.anim_, 0);
        this.anim_.rotation = 0;
        this.anim_.scale.x = this.anim_.scale.y = 0;
        this.anim_.pivot.x = this.anim_.width;
        this.anim_.pivot.y = this.anim_.height * d.velocity *
            .74;
        this.anim_.scale.x = 2 * this.scale_;
        this.anim_.scale.y = 1 - this.semiTone_ + .2;
        this.anim_.alpha = 1 - this.scale_ * this.scale_ / 4;
        this.anim_.spriteTint = PIXI.utils.rgb2hex([1, 1, .5 + a / 24]);
        return this
    };
    Pf.prototype.update = function() {
        Pf.superClass_.update.call(this);
        this.scale_ += u * this.maxScale_ * .001;
        this.anim_.scale.x = 2 * this.scale_ + Math.sin(.002 * u);
        this.anim_.scale.y -= 5E-4 * u * (1.2 - this.semiTone_);
        this.anim_.alpha = 1 - this.scale_ / this.maxScale_;
        this.anim_.rotation = .1 * this.scale_ * this.direction_;
        this.anim_.pivot.y += .5 * u;
        We(this.anim_);
        this.visible || (this.visible = !0);
        this.scale_ >= this.maxScale_ && Of.release(this)
    };
    var Of = new X("ConfettiShape", function() {
        return new Pf
    }, 16);
    var Rf = function() {
        Y.call(this, Qf)
    };
    n(Rf, Y);
    Rf.prototype.init = function() {
        if (Rf.superClass_.init.call(this)) return !0;
        this.anim_ = new Ue([P.textures["squash0001.png"], P.textures["squash0002.png"], P.textures["squash0003.png"], P.textures["squash0004.png"], P.textures["squash0005.png"], P.textures["squash0006.png"], P.textures["squash0007.png"], P.textures["squash0008.png"], P.textures["squash0009.png"], P.textures["squash0010.png"], P.textures["squash0011.png"], P.textures["squash0012.png"], P.textures["squash0013.png"], P.textures["squash0014.png"], P.textures["squash0015.png"],
            P.textures["squash0016.png"], P.textures["squash0017.png"], P.textures["squash0018.png"], P.textures["squash0019.png"], P.textures["squash0020.png"], P.textures["squash0021.png"], P.textures["squash0021.png"], P.textures["squash0022.png"]
        ]);
        this.anim_.fischinger_MovieClip$loop = !1;
        this.anim_.pivot.x = .5 * this.anim_.width;
        this.anim_.pivot.y = .5 * this.anim_.height;
        this.addChild(this.anim_);
        return !1
    };
    Rf.prototype.onSpawn = function(a, b, c, d) {
        Rf.superClass_.onSpawn.call(this, a, b, c, d);
        this.visible = !1;
        a = pe[d.cnote || d.name];
        this.direction_ = .5 < Math.random() ? -1 : 1;
        this.maxScale_ = d.velocity * (10 - Math.pow(a / 6 + d.octave, 2));
        this.scale_ = .01;
        this.anim_.rotation = 0;
        this.anim_.scale.x = this.anim_.scale.y = this.scale_;
        this.anim_.pivot.x = this.anim_.width * d.velocity * .74;
        this.anim_.pivot.y = this.anim_.height * d.velocity * .74;
        Ve(this.anim_, 0);
        this.anim_.alpha = 10 - this.scale_ * this.scale_ / 2;
        this.anim_.spriteTint = PIXI.utils.rgb2hex([a /
        12, 1 - d.velocity * d.velocity * a / 12, d.velocity * d.velocity
        ]);
        this.rotation = this.maxScale_ + 360 * d.velocity;
        return this
    };
    Rf.prototype.update = function() {
        Rf.superClass_.update.call(this);
        this.scale_ += u * this.maxScale_ * .001;
        this.anim_.scale.x = this.anim_.scale.y = this.scale_ + .5 * Math.sin(.002 * u);
        this.anim_.alpha = 1 - this.scale_ / this.maxScale_;
        this.anim_.rotation = .1 * this.scale_ * this.direction_;
        this.anim_.pivot.x += .1 * u;
        We(this.anim_);
        this.visible || (this.visible = !0);
        this.scale_ >= this.maxScale_ && Qf.release(this)
    };
    var Qf = new X("SquashShape", function() {
        return new Rf
    }, 16);
    var wf = function() {
        PIXI.Container.call(this)
    };
    n(wf, PIXI.Container);
    wf.prototype.setup = function() {
        var a = this;
        this.tapInstructionsElement = document.getElementById("instructions");
        ee = PIXI.loader.add("spritesheets/intro.png").add("spritesheets/intro.json").load(function() {
            P = PIXI.loader.resources["spritesheets/intro.json"];		//在加载图片时，Pixi.JS加载的方式为异步加载，但在实际应用中资源往往需要提前预加载
            Sf(a)
        });
        this.leftOrbits = Z.get(.2 * v, .2 * w, this, null);
        this.rightOrbits = Z.get(.8 * v, .8 * w, this, null);
        this.startSoundLoadingProgress = this.showSoundLoadingProgress = !1
    };
    wf.prototype.update = function() {
        if (this.startSoundLoadingProgress)
            if (1 <= be(-1)) C.cta.volume(.75), Tf(this);
            else {
                var a = de,
                    b = .75 + .25 * be(-1),
                    a = a.introProgressIcons[3];
                a.progress = b;
                a.radius = 8 * b + 30;
                a.update()
            }
        else this.showSoundLoadingProgress && 3 <= this.currentAnimation && !this.startSoundLoadingProgress && .75 == de.introProgressIcons[3].progress && (this.startSoundLoadingProgress = !0)
    };
    var Sf = function(a) {
            S.fischinger_FilmFilter$screenMultiplyTarget = .2;
            a.tapInstructionsElement.className = "reveal";
            a.doodleResizeHandler = function() {
                a.leftOrbits.x = .2 * v;
                a.leftOrbits.y = .2 * w;
                a.rightOrbits.x = .8 * v;
                a.rightOrbits.y = .8 * w
            };
            Qc(ie, a.doodleResizeHandler);
            a.currentAnimation = -1;
            a.currentAnimationStillPlaying = !1;
            Uf(a)
        },
        Uf = function(a) {
            a.onCompleteTweens = [];
            var b = de;
            b.introProgressElem.style.display = "block";
            b.loadedCountElem.className = "reveal";
            Vf(a, -1)
        },
        Vf = function(a, b) {
            a.currentAnimationStillPlaying = !0;
            a.currentAnimation = b + 1;
            if (2 == a.currentAnimation) {
                var c = Wf.sound0;
                var d = c[c.length - 1][0] * wa;
                Q.backgroundTintLerpSpeed = .0015;
                Q.backgroundTintColorTarget = new sa(.11, .7, 1);
                for (var e = 0; e < c.length; e++) {
                    var f = {};
                    a.onCompleteTweens.push(f);
                    L(f, c[e][0] * wa, {
                        onComplete: function(b) {
                            return function() {
                                Mf.get((v || 600) * Math.random(), (w || 220) * Math.random(), a, b[1])
                            }
                        }(c[e])
                    })
                }
            } else if (0 == a.currentAnimation) {
                Q.backgroundTintColorTarget = new sa(.3, .3, .7);
                c = Wf.sound1;
                d = c[c.length - 1][0] * wa;
                for (e = 0; e < c.length; e++) f = {},
                    a.onCompleteTweens.push(f), L(f, c[e][0] * wa, {
                    onComplete: function(b) {
                        return function() {
                            Ze.get((v || 600) * Math.random(), (w || 220) * Math.random(), a, b[1])
                        }
                    }(c[e])
                });
                C.keyInstrument = new Xf;
                C.dingInstrument = new Yf;
                C.pluckInstrument = new Zf;
                C.hornInstrument = new $f
            } else if (1 == a.currentAnimation)
                for (c = Wf.sound2, Q.backgroundTintColorTarget = new sa(.2, .7, .1), d = c[c.length - 1][0] * wa, e = 0; e < c.length; e++) f = {}, a.onCompleteTweens.push(f), L(f, c[e][0] * wa, {
                    onComplete: function(b) {
                        return function() {
                            Of.get((v || 600) * Math.random(),
                                (w || 220) * Math.random(), a, b[1])
                        }
                    }(c[e])
                });
            else if (3 == a.currentAnimation) {
                Q.backgroundTintColorTarget = new sa(.8, .4, 1);
                c = Wf.sound3;
                d = c[c.length - 1][0] * wa;
                for (e = 0; e < c.length; e++) f = {}, a.onCompleteTweens.push(f), L(f, c[e][0] * wa, {
                    onComplete: function(b) {
                        return function() {
                            Qf.get((v || 600) * Math.random(), (w || 220) * Math.random(), a, b[1])
                        }
                    }(c[e])
                });
                I(fe, a.tapHandler);
                a.tapHandler = null
            }
            f = {};
            a.onCompleteTweens.push(f);
            L(f, d + 400, {
                onComplete: function() {
                    a.currentAnimationStillPlaying = !1;
                    4 > a.currentAnimation && (0 == a.currentAnimation &&
                    1 <= be(0) ? (C.hornInstrument.volume(.25), C.hornInstrument.play("D2")) : 1 == a.currentAnimation && 1 <= be(1) ? (C.dingInstrument.volume(.25), C.dingInstrument.play("C2")) : 2 == a.currentAnimation && 1 <= be(2) ? (C.keyInstrument.volume(.25), C.keyInstrument.play("E1")) : 3 == a.currentAnimation && 1 <= be(3) && (C.pluckInstrument.volume(.15), C.pluckInstrument.play("C0")), Vf(a, a.currentAnimation))
                }
            });
            3 > a.currentAnimation ? ag(de.introProgressIcons[a.currentAnimation], 1, d + 1100) : 3 == a.currentAnimation && (1 <= be(-1) ? (ag(de.introProgressIcons[a.currentAnimation],
                    1, d + 1100), f = {}, a.onCompleteTweens.push(f), L(f, 2E3 * wa, {
                    onComplete: function() {
                        C.cta.volume(.75);
                        Tf(a)
                    }
                })) : (a.showSoundLoadingProgress = !0, ag(de.introProgressIcons[a.currentAnimation], .75, d + 1100)))
        },
        Tf = function(a) {
            bg(Q);
            S.fischinger_FilmFilter$screenMultiplyTarget = 1.3;
            a.tapInstructionsElement.className = "hide";
            cg(de);
            H.element.className = "";
            a = Q;
            Ac(2);
            A.getInstance().log(0);
            a.instrument = new Gf;
            a.instrument.setup();
            a.addChild(a.instrument)
        };
    wf.prototype.cleanup = function() {
        Z.release(this.leftOrbits);
        Z.release(this.rightOrbits);
        null != this.quoteTapHandler && (I(fe, this.quoteTapHandler), this.quoteTapHandler = null);
        null != this.doodleResizeHandler && (I(ie, this.doodleResizeHandler), this.doodleResizeHandler = null);
        null != this.tapHandler && (I(fe, this.tapHandler), this.tapHandler = null);
        Ze.cleanup();
        Xe.cleanup();
        Mf.cleanup();
        Of.cleanup();
        Qf.cleanup();
        for (var a = 0; a < this.onCompleteTweens.length; a++) J(this.onCompleteTweens[a]);
        this.onCompleteTweens = [];
        this.destroy()
    };
    var Wf = {
        sound0: [
            [0, {
                x: .5,
                y: .5,
                velocity: .78,
                instrument: 0,
                octave: 1,
                name: "A"
            }],
            [283, {
                x: .5,
                y: .5,
                velocity: .66,
                instrument: 0,
                octave: 1,
                name: "G"
            }],
            [467, {
                x: .5,
                y: .5,
                velocity: .25,
                instrument: 0,
                octave: 1,
                name: "A"
            }],
            [766, {
                x: .5,
                y: .5,
                velocity: .62,
                instrument: 0,
                octave: 1,
                name: "G"
            }],
            [950, {
                x: .5,
                y: .5,
                velocity: .88,
                instrument: 0,
                octave: 1,
                name: "A"
            }],
            [1234, {
                x: .5,
                y: .5,
                velocity: .61,
                instrument: 0,
                octave: 1,
                name: "G"
            }],
            [1450, {
                x: .5,
                y: .5,
                velocity: .92,
                instrument: 0,
                octave: 1,
                name: "C"
            }]
        ],
        sound1: [
            [0, {
                x: .5,
                y: .5,
                velocity: .62,
                instrument: 0,
                octave: 0,
                name: "C"
            }],
            [401, {
                x: .5,
                y: .5,
                velocity: .65,
                instrument: 0,
                octave: 0,
                name: "D"
            }],
            [550, {
                x: .5,
                y: .5,
                velocity: .48,
                instrument: 0,
                octave: 0,
                name: "F"
            }],
            [668, {
                x: .5,
                y: .5,
                velocity: .1,
                instrument: 0,
                octave: 0,
                name: "A"
            }],
            [767, {
                x: .5,
                y: .5,
                velocity: .42,
                instrument: 0,
                octave: 1,
                name: "C"
            }],
            [884, {
                x: .5,
                y: .5,
                velocity: .3,
                instrument: 0,
                octave: 1,
                name: "D"
            }],
            [1134, {
                x: .5,
                y: .5,
                velocity: .89,
                instrument: 0,
                octave: 1,
                name: "F"
            }]
        ],
        sound2: [
            [0, {
                x: .5,
                y: .5,
                velocity: .7,
                instrument: 0,
                octave: 1,
                name: "F"
            }],
            [117, {
                x: .5,
                y: .5,
                velocity: .7,
                instrument: 0,
                octave: 1,
                name: "F"
            }],
            [184, {
                x: .5,
                y: .5,
                velocity: .7,
                instrument: 0,
                octave: 1,
                name: "F"
            }],
            [251, {
                x: .5,
                y: .5,
                velocity: .35,
                instrument: 0,
                octave: 1,
                name: "F"
            }],
            [450, {
                x: .5,
                y: .5,
                velocity: .7,
                instrument: 0,
                octave: 1,
                name: "A"
            }],
            [568, {
                x: .5,
                y: .5,
                velocity: .59,
                instrument: 0,
                octave: 1,
                name: "A#"
            }],
            [683, {
                x: .5,
                y: .5,
                velocity: .67,
                instrument: 0,
                octave: 1,
                name: "B"
            }],
            [817, {
                x: .5,
                y: .5,
                velocity: .71,
                instrument: 0,
                octave: 1,
                name: "C"
            }],
            [934, {
                x: .5,
                y: .5,
                velocity: .58,
                instrument: 0,
                octave: 1,
                name: "C#"
            }],
            [1068, {
                x: .5,
                y: .5,
                velocity: .57,
                instrument: 0,
                octave: 1,
                name: "D"
            }],
            [1185,
                {
                    x: .5,
                    y: .5,
                    velocity: .58,
                    instrument: 0,
                    octave: 0,
                    name: "D#"
                }
            ],
            [1318, {
                x: .5,
                y: .5,
                velocity: .53,
                instrument: 0,
                octave: 0,
                name: "E"
            }],
            [1450, {
                x: .5,
                y: .5,
                velocity: .67,
                instrument: 0,
                octave: 0,
                name: "F"
            }]
        ],
        sound3: [
            [0, {
                x: .5,
                y: .5,
                velocity: .83,
                instrument: 0,
                octave: 1,
                name: "C"
            }],
            [167, {
                x: .5,
                y: .5,
                velocity: .96,
                instrument: 0,
                octave: 1,
                name: "C#"
            }],
            [351, {
                x: .5,
                y: .5,
                velocity: .81,
                instrument: 0,
                octave: 1,
                name: "D"
            }],
            [517, {
                x: .5,
                y: .5,
                velocity: .7,
                instrument: 0,
                octave: 1,
                name: "D#"
            }],
            [734, {
                x: .5,
                y: .5,
                velocity: .81,
                instrument: 0,
                octave: 1,
                name: "E"
            }],
            [1101, {
                x: .5,
                y: .5,
                velocity: .73,
                instrument: 0,
                octave: 1,
                name: "C"
            }]
        ],
        ending: [
            [
                [250, {
                    x: .5,
                    y: .5,
                    velocity: .55,
                    instrument: 0,
                    octave: 1,
                    name: "D"
                }],
                [317, {
                    x: .5,
                    y: .5,
                    velocity: .52,
                    instrument: 0,
                    octave: 1,
                    name: "F"
                }],
                [700, {
                    x: .5,
                    y: .5,
                    velocity: .26,
                    instrument: 0,
                    octave: 1,
                    name: "F"
                }]
            ],
            [
                [250, {
                    x: .5,
                    y: .5,
                    velocity: .67,
                    instrument: 1,
                    octave: 1,
                    name: "F"
                }],
                [384, {
                    x: .5,
                    y: .5,
                    velocity: .677,
                    instrument: 1,
                    octave: 2,
                    name: "C"
                }],
                [499, {
                    x: .5,
                    y: .5,
                    velocity: .677,
                    instrument: 1,
                    octave: 2,
                    name: "E"
                }],
                [567, {
                    x: .5,
                    y: .5,
                    velocity: .677,
                    instrument: 1,
                    octave: 0,
                    name: "F"
                }],
                [817, {
                    x: .5,
                    y: .5,
                    velocity: .53,
                    instrument: 1,
                    octave: 1,
                    name: "C"
                }],
                [883, {
                    x: .5,
                    y: .5,
                    velocity: .53,
                    instrument: 1,
                    octave: 0,
                    name: "G"
                }]
            ],
            [
                [1E3, {
                    x: .5,
                    y: .5,
                    velocity: .732,
                    instrument: 2,
                    octave: 0,
                    name: "F"
                }]
            ],
            [
                [0, {
                    x: .5,
                    y: .5,
                    velocity: .73,
                    instrument: 3,
                    octave: 1,
                    name: "F"
                }],
                [1E3, {
                    x: .5,
                    y: .5,
                    velocity: .732,
                    instrument: 3,
                    octave: 0,
                    name: "F"
                }]
            ]
        ]
    };
    var dg = function(a) {
        this.howl_ = new Howl(a)
    };
    k = dg.prototype;
    k.load = function() {
        this.howl_.load()
    };
    k.play = function(a, b) {
        this.howl_.play(a, b)
    };
    k.mute = function(a, b) {
        this.howl_.mute(a, b)
    };
    k.volume = function(a) {
        this.howl_.volume(a)
    };
    k.duration = function(a) {
        return this.howl_.duration(a)
    };
    k.once = function(a, b, c) {
        this.howl_.once(a, b, c)
    };
    k.setup = function() {};
    k.cleanup = function() {
        this.howl_.unload()
    };
    var eg = function() {
        dg.call(this, {
            src: ["sounds/cta.ogg", "sounds/cta.m4a", "sounds/cta.mp3", "https://www.google.com/logos/2017/fischinger/sounds/cta.ac3"],
            sprite: {
                start: [0, 2400]
            }
        })
    };
    n(eg, dg);
    var Yf = function() {
        dg.call(this, {
            src: ["sounds/instruments/ding.ogg", "sounds/instruments/ding.m4a", "sounds/instruments/ding.mp3", "https://www.google.com/logos/2017/fischinger/sounds/instruments/ding.ac3"],
            sprite: {
                "A#0": [0, 2E3],
                "A#1": [2100, 2E3],
                "A#2": [4200, 2E3],
                A0: [6300, 2E3],
                A1: [8400, 2E3],
                A2: [10500, 2E3],
                B0: [12600, 2E3],
                B1: [14700, 2E3],
                B2: [16800, 2E3],
                "C#0": [18900, 2E3],
                "C#1": [21E3, 2E3],
                "C#2": [23100, 2E3],
                C0: [25200, 2E3],
                C1: [27300, 2E3],
                C2: [29400, 2E3],
                "D#0": [31500,
                    2E3
                ],
                "D#1": [33600, 2E3],
                "D#2": [35700, 2E3],
                D0: [37800, 2E3],
                D1: [39900, 2E3],
                D2: [42E3, 2E3],
                E0: [44100, 2E3],
                E1: [46200, 2E3],
                E2: [48300, 2E3],
                "F#0": [50400, 2E3],
                "F#1": [52500, 2E3],
                "F#2": [54600, 2E3],
                F0: [56700, 2E3],
                F1: [58800, 2E3],
                F2: [60900, 2E3],
                "G#0": [63E3, 2E3],
                "G#1": [65100, 2E3],
                "G#2": [67200, 2E3],
                G0: [69300, 2E3],
                G1: [71400, 2E3],
                G2: [73500, 2E3]
            }
        })
    };
    n(Yf, dg);
    var $f = function() {
        dg.call(this, {
            src: ["sounds/instruments/horn.ogg", "sounds/instruments/horn.m4a", "sounds/instruments/horn.mp3", "/logos/2017/fischinger/sounds/instruments/horn.ac3"],
            sprite: {
                "A#0": [0, 2E3],
                "A#1": [2100, 2E3],
                "A#2": [4200, 2E3],
                A0: [6300, 2E3],
                A1: [8400, 2E3],
                A2: [10500, 2E3],
                B0: [12600, 2E3],
                B1: [14700, 2E3],
                B2: [16800, 2E3],
                "C#0": [18900, 2E3],
                "C#1": [21E3, 2E3],
                "C#2": [23100, 2E3],
                C0: [25200, 2E3],
                C1: [27300, 2E3],
                C2: [29400, 2E3],
                "D#0": [31500,
                    2E3
                ],
                "D#1": [33600, 2E3],
                "D#2": [35700, 2E3],
                D0: [37800, 2E3],
                D1: [39900, 2E3],
                D2: [42E3, 2E3],
                E0: [44100, 2E3],
                E1: [46200, 2E3],
                E2: [48300, 2E3],
                "F#0": [50400, 2E3],
                "F#1": [52500, 2E3],
                "F#2": [54600, 2E3],
                F0: [56700, 2E3],
                F1: [58800, 2E3],
                F2: [60900, 2E3],
                "G#0": [63E3, 2E3],
                "G#1": [65100, 2E3],
                "G#2": [67200, 2E3],
                G0: [69300, 2E3],
                G1: [71400, 2E3],
                G2: [73500, 2E3]
            }
        })
    };
    n($f, dg);
    var Xf = function() {
        dg.call(this, {
            src: ["sounds/instruments/key.ogg", "sounds/instruments/key.m4a", "sounds/instruments/key.mp3", "/logos/2017/fischinger/sounds/instruments/key.ac3"],
            sprite: {
                "A#0": [0, 2E3],
                "A#1": [2100, 2E3],
                "A#2": [4200, 2E3],
                A0: [6300, 2E3],
                A1: [8400, 2E3],
                A2: [10500, 2E3],
                B0: [12600, 2E3],
                B1: [14700, 2E3],
                B2: [16800, 2E3],
                "C#0": [18900, 2E3],
                "C#1": [21E3, 2E3],
                "C#2": [23100, 2E3],
                C0: [25200, 2E3],
                C1: [27300, 2E3],
                C2: [29400, 2E3],
                "D#0": [31500,
                    2E3
                ],
                "D#1": [33600, 2E3],
                "D#2": [35700, 2E3],
                D0: [37800, 2E3],
                D1: [39900, 2E3],
                D2: [42E3, 2E3],
                E0: [44100, 2E3],
                E1: [46200, 2E3],
                E2: [48300, 2E3],
                "F#0": [50400, 2E3],
                "F#1": [52500, 2E3],
                "F#2": [54600, 2E3],
                F0: [56700, 2E3],
                F1: [58800, 2E3],
                F2: [60900, 2E3],
                "G#0": [63E3, 2E3],
                "G#1": [65100, 2E3],
                "G#2": [67200, 2E3],
                G0: [69300, 2E3],
                G1: [71400, 2E3],
                G2: [73500, 2E3]
            }
        })
    };
    n(Xf, dg);
    var Zf = function() {
        dg.call(this, {
            src: ["sounds/instruments/pluck.ogg", "sounds/instruments/pluck.m4a", "sounds/instruments/pluck.mp3", "/logos/2017/fischinger/sounds/instruments/pluck.ac3"],
            sprite: {
                "A#0": [0, 2E3],
                "A#1": [2100, 2E3],
                "A#2": [4200, 2E3],
                A0: [6300, 2E3],
                A1: [8400, 2E3],
                A2: [10500, 2E3],
                B0: [12600, 2E3],
                B1: [14700, 2E3],
                B2: [16800, 2E3],
                "C#0": [18900, 2E3],
                "C#1": [21E3, 2E3],
                "C#2": [23100, 2E3],
                C0: [25200, 2E3],
                C1: [27300, 2E3],
                C2: [29400, 2E3],
                "D#0": [31500,
                    2E3
                ],
                "D#1": [33600, 2E3],
                "D#2": [35700, 2E3],
                D0: [37800, 2E3],
                D1: [39900, 2E3],
                D2: [42E3, 2E3],
                E0: [44100, 2E3],
                E1: [46200, 2E3],
                E2: [48300, 2E3],
                "F#0": [50400, 2E3],
                "F#1": [52500, 2E3],
                "F#2": [54600, 2E3],
                F0: [56700, 2E3],
                F1: [58800, 2E3],
                F2: [60900, 2E3],
                "G#0": [63E3, 2E3],
                "G#1": [65100, 2E3],
                "G#2": [67200, 2E3],
                G0: [69300, 2E3],
                G1: [71400, 2E3],
                G2: [73500, 2E3]
            }
        })
    };
    n(Zf, dg);
    var fg = function() {};
    fg.prototype.setup = function() {
        this.cta = new eg;
        this.tuna = new Tuna(Howler.ctx);
        this.delay = new this.tuna.Delay({
            feedback: .75,
            delayTime: 150,
            wetLevel: 1,
            dryLevel: 0,
            cutoff: 2E3,
            bypass: 0
        });
        this.delayEffectAdded = !1;
        this.bitcrusher = new this.tuna.Bitcrusher({
            bits: 16,
            normfreq: .1,
            bufferSize: 4096
        });
        this.bitCrushEffectAdded = !1;
        this.phaser = new this.tuna.Phaser({
            rate: 2.4,
            depth: .3,
            feedback: .72,
            stereoPhase: 100,
            baseModulationFrequency: 700,
            bypass: 0
        });
        this.phaseEffectAdded = !1;
        if (0 <= r.indexOf("Firefox") || 0 <= r.indexOf("Edge")) {
            var a =
                this.phaser;
            a.splitter.disconnect(a.filtersR[0]);
            a.splitter.connect(a.filtersL[0], 1, 0);
            a.filtersR[a.stage - 1].disconnect(a.feedbackGainNodeR);
            a.filtersR[a.stage - 1].disconnect(a.merger);
            a.feedbackGainNodeL.disconnect(a.filtersL[0]);
            a.feedbackGainNodeR.disconnect(a.filtersR[0]);
            a.filtersL[a.stage - 1].connect(a.feedbackGainNodeR);
            a.filtersL[a.stage - 1].connect(a.merger, 0, 1)
        }
        this.limiter = new gg;
        Howler.addEffect(this.limiter.compressor)
    };
    var gd = function() {
            var a = C;
            a.phaseEffectAdded || (Howler.removeEffect(a.limiter.compressor), Howler.addEffect(a.phaser), a.phaseEffectAdded = !0, Howler.addEffect(a.limiter.compressor))
        },
        bd = function() {
            var a = C;
            a.phaseEffectAdded && (Howler.removeEffect(a.phaser), a.phaseEffectAdded = !1)
        },
        ed = function() {
            var a = C;
            a.bitCrushEffectAdded || (Howler.removeEffect(a.limiter.compressor), Howler.addEffect(a.bitcrusher), a.bitCrushEffectAdded = !0, Howler.addEffect(a.limiter.compressor))
        },
        ad = function() {
            var a = C;
            a.bitCrushEffectAdded &&
            (Howler.removeEffect(a.bitcrusher), a.bitCrushEffectAdded = !1)
        },
        cd = function() {
            var a = C;
            a.delayEffectAdded || (Howler.removeEffect(a.limiter.compressor), Howler.addEffect(a.delay), a.delayEffectAdded = !0, Howler.addEffect(a.limiter.compressor))
        },
        $c = function() {
            var a = C;
            a.delayEffectAdded && (Howler.removeEffect(a.delay), a.delayEffectAdded = !1)
        };
    fg.prototype.cleanup = function() {		//清除
        this.cta && (this.cta.cleanup(), this.cta = null);
        this.dingInstrument && (this.dingInstrument.cleanup(), this.dingInstrument = null);
        this.hornInstrument && (this.hornInstrument.cleanup(), this.hornInstrument = null);
        this.keyInstrument && (this.keyInstrument.cleanup(), this.keyInstrument = null);
        this.pluckInstrument && (this.pluckInstrument.cleanup(), this.pluckInstrument = null)
    };
    var gg = function() {
        Howler.ctx && Howler.ctx.createDynamicsCompressor ? (this.compressor = Howler.ctx.createDynamicsCompressor(), this.compressor.threshold.value = -50, this.compressor.knee.value = 40, this.compressor.ratio.value = 12, this.compressor.reduction.value = -20, this.compressor.attack.value = 0, this.compressor.release.value = .25) : console.log("No webaudio createDynamicsCompressor")
    };
    var hg = function() {
        this.mouseX = 0;
        this.activeTouches = {};
        t ? (N(me, "touchstart", this.fischinger_Touch_prototype$onTouchStart, !1, this), N(me, "touchmove", this.fischinger_Touch_prototype$onTouchMove, !1, this), N(me, "touchend", this.fischinger_Touch_prototype$onTouchEnd, !1, this)) : (N(me, "mousedown", this.fischinger_Touch_prototype$onTouchStart, !1, this), N(window, "mousemove", this.fischinger_Touch_prototype$onTouchMove, !1, this), N(window, "mouseup", this.fischinger_Touch_prototype$onTouchEnd, !1, this))
    };
    hg.prototype.tapHandler = function(a) {
        od(fe, a)
    };
    hg.prototype.fischinger_Touch_prototype$onTouchStart = function(a) {
        if (!(a.target instanceof HTMLInputElement))
            if (ig(le), G && 2 == G.currentMode) jg(G);
            else {
                a.goog_events_Event_prototype$preventDefault();
                a.goog_events_Event_prototype$stopPropagation();
                for (var b, c, d = a.event_, e = d.changedTouches ? d.changedTouches : [d], f = 0; f < e.length; f++) a = e[f].offsetX || e[f].pageX, b = e[f].offsetY || e[f].pageY, null != Q.instrument && Q.instrument.visible && B.visible && (c = Ef(a, b)), this.activeTouches[d.changedTouches ? "touch" + e[f].identifier :
                    "mouse"] = {
                    startTime: ne,
                    startX: a,
                    startY: b,
                    x: a,
                    y: b,
                    noteName: c,
                    lastNoteName: c,
                    isSwipe: !1
                }
            }
    };
    hg.prototype.fischinger_Touch_prototype$onTouchMove = function(a) {
        if (!(a.target instanceof HTMLInputElement || (ig(le), G && 2 == G.currentMode || !B))) {
            a.goog_events_Event_prototype$preventDefault();
            a.goog_events_Event_prototype$stopPropagation();
            var b, c;
            a = a.event_;
            if (a.changedTouches) var d = a.changedTouches;
            else d = [a], this.mouseX = a.offsetX;
            null != Q.instrument && Q.instrument.visible && B && B.visible && !B.inBetweenChangingInstruments && Af(B);
            for (var e = 0; e < d.length; e++) {
                var f = a.changedTouches ? "touch" + d[e].identifier :
                    "mouse";
                if (this.activeTouches.hasOwnProperty(f)) {
                    f = this.activeTouches[f];
                    f.x = b = d[e].offsetX || d[e].pageX;
                    f.y = c = d[e].offsetY || d[e].pageY;
                    var g = b,
                        h = c,
                        p = B,
                        g = g - p.instrumentPaddingX,
                        h = h - p.instrumentPaddingY,
                        g = Math.floor(g / p.gridWidth * p.numXKeys),
                        h = Math.floor(h / p.gridHeight * p.numYKeys);
                    f.lastNoteName != (h >= p.numYKeys || 0 > h || g >= p.numXKeys || 0 > g ? -1 : g + h * p.numXKeys) + "" && (f.lastNoteName = Ef(b, c));
                    !f.isSwipe && (p = f.startX, h = f.startY, b || (b = 0), c || (c = 0), c = Math.sqrt((b - p) * (b - p) + (c - h) * (c - h)), 300 <= ne - f.startTime || 40 <= c) &&
                    (f.isSwipe = !0, od(ge, f))
                }
            }
        }
    };
    hg.prototype.fischinger_Touch_prototype$onTouchEnd = function(a) {
        if (!(a.target instanceof HTMLInputElement)) {
            ig(le);
            pf();
            af.shouldUseFullscreenApi && !Fc() && (Ic(), document.getElementById("hpofclose").style.visibility = "visible");
            a.goog_events_Event_prototype$preventDefault();
            a.goog_events_Event_prototype$stopPropagation();
            a = a.event_;
            for (var b = a.changedTouches ? a.changedTouches : [a], c = 0; c < b.length; c++) {
                var d = a.changedTouches ? "touch" + b[c].identifier : "mouse";
                if (this.activeTouches.hasOwnProperty(d)) {
                    var e = this.activeTouches[d],
                        f = ne - e.startTime;
                    !e.isSwipe && 300 > f && this.tapHandler(e);
                    delete this.activeTouches[d]
                }
            }
        }
    };
    var kg = function() {};
    k = kg.prototype;
    k.setup = function() {
        if (this.element = document.getElementById("hpoffooter"))
            if (this.element.className = "", this.footerUL = document.getElementById("hpoffooterul")) this.modifyButton = this.footerUL.children[0], this.clearMatrixButton = this.footerUL.children[1], this.clearMatrixLabel = document.getElementById("clearmatrixlabel"), this.clearMatrixButtonIsInRevertMode = !1, Vc(this, this.clearMatrixButtonIsInRevertMode), Kf(this), t && 40 < this.footerUL.offsetHeight && (this.footerUL.className = "toolong"), this.normalWidth = this.footerUL.offsetWidth +
                17, this.modifyButton.className = this.clearMatrixButton.className = "hidden", this.withoutModifyWidth = this.footerUL.offsetWidth, this.footerUL.style.width = this.withoutModifyWidth, this.modifyUI = document.getElementById("modifyui"), this.modifyUIListDom = document.getElementById("modifyuilist"), this.keySelector = document.getElementById("keyselector"), N(this.keySelector, "change", this.keyChange, !1, this), N(this.modifyUI, t ? "touchstart" : "mousedown", this.hideModifyUI, !1, this), t && (N(this.modifyUIListDom, "touchstart",
                this.onModifyUIListTouchStart, !1, this), N(this.modifyUIListDom, "touchend", this.onModifyUIListTouchEnd, !1, this)), N(this.modifyButton, "mousedown", this.showModifyUI, !1, this), N(this.clearMatrixButton, "mousedown", this.clearMatrix, !1, this), lg(this)
    };
    k.onModifyUIListTouchStart = function(a) {
        this.swipeStart = new PIXI.Point;
        this.swipeStartTime = ne;
        this.swipeStart.x = a.clientX;
        this.swipeStart.y = a.clientY
    };
    k.onModifyUIListTouchEnd = function(a) {
        a.target.type && "range" == a.target.type || 200 > ne - this.swipeStartTime && 30 > Math.abs(this.swipeStart.y - a.clientY) && 50 < this.swipeStart.x - a.clientX && this.hideModifyUI()
    };
    k.clearMatrix = function() {
        if (this.clearMatrixButtonIsInRevertMode) {
            var a = he;
            Wc(a, a.saveStates.length - 1)
        } else Tc("0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A0A100a0")
    };
    k.keyChange = function(a) {
        xc = parseInt(a.target.value, 10)
    };
    k.showModifyUI = function() {
        Ac(5);
        var a = this;
        this.modifyUI.className = "";
        this.modifyUIDomTimeout && clearTimeout(this.modifyUIDomTimeout);
        this.modifyUIDomTimeout = setTimeout(function() {
            a.modifyUIListDom.className = "show"
        }, 10)
    };
    k.hideModifyUI = function(a) {
        var b = this;
        null == this.modifyUI || a && a.target && "modifyui" != a.target.id || (this.modifyUIListDom.className = "hide", this.modifyUIDomTimeout && clearTimeout(this.modifyUIDomTimeout), this.modifyUIDomTimeout = setTimeout(function() {
            b.modifyUI.className = "hidden"
        }, 50))
    };
    var Vc = function(a, b) {
            Be(a.clearMatrixLabel, b ? "Revert" : "Button - Clear");
            a.clearMatrixButtonIsInRevertMode = b
        },
        Kf = function(a) {
            a.modifyButton.className = a.clearMatrixButton.className = "";
            a.footerUL.style.width = a.normalWidth;
            a.hideModifyUI()
        },
        mg = function() {
            var a = H;
            a.modifyButton.className = a.clearMatrixButton.className = "hidden";
            a.footerUL.style.width = a.withoutModifyWidth
        },
        lg = function(a) {
            a.element && (a.element.className = "hidden", a.hideModifyUI())
        };
    kg.prototype.cleanup = function() {
        lg(this);
        this.modifyUIDomTimeout && clearTimeout(this.modifyUIDomTimeout)
    };
    var ng = function() {};
    ng.prototype.setup = function() {
        if (this.element = document.getElementById("hpofheader")) this.element.style.opacity = 0, xb ? this.element.style.display = "none" : (this.element.style.display = "block", L(this.element.style, 1E3, {
            opacity: 1,
            delay: 500
        }))
    };
    ng.prototype.cleanup = function() {
        this.element && (J(this.element.style), this.element.style.opacity = 0, this.element.style.display = "none")
    };
    var pg = function() {
        E.call(this);
        this.eventTargetListeners_ = new Hd(this);
        this.actualEventTarget_ = this;
        this.parentEventTarget_ = null
    };
    n(pg, E);
    pg.prototype[Cd] = !0;
    pg.prototype.addEventListener = function(a, b, c, d) {
        N(this, a, b, c, d)
    };
    pg.prototype.removeEventListener = function(a, b, c, d) {
        Xd(this, a, b, c, d)
    };
    var rg = function(a, b) {
        var c, d = a.parentEventTarget_;
        if (d)
            for (c = []; d; d = d.parentEventTarget_) c.push(d);
        var d = a.actualEventTarget_,
            e = b,
            f = e.type || e;
        if (fa(e)) e = new Bd(e, d);
        else if (e instanceof Bd) e.target = e.target || d;
        else {
            var g = e,
                e = new Bd(f, d);
            Va(e, g)
        }
        var g = !0;
        if (c)
            for (var h = c.length - 1; !e.propagationStopped_ && 0 <= h; h--) {
                var p = e.goog_events_Event$currentTarget = c[h];
                g = qg(p, f, !0, e) && g
            }
        e.propagationStopped_ || (p = e.goog_events_Event$currentTarget = d, g = qg(p, f, !0, e) && g, e.propagationStopped_ || (g = qg(p, f, !1, e) && g));
        if (c)
            for (h = 0; !e.propagationStopped_ && h < c.length; h++) p = e.goog_events_Event$currentTarget = c[h], g = qg(p, f, !1, e) && g;
        return g
    };
    pg.prototype.disposeInternal = function() {
        pg.superClass_.disposeInternal.call(this);
        this.eventTargetListeners_ && Ld(this.eventTargetListeners_, void 0);
        this.parentEventTarget_ = null
    };
    pg.prototype.listen = function(a, b, c, d) {
        return this.eventTargetListeners_.add(String(a), b, !1, c, d)
    };
    pg.prototype.unlisten = function(a, b, c, d) {
        var e = this.eventTargetListeners_;
        a = String(a).toString();
        if (a in e.goog_events_ListenerMap$listeners) {
            var f = e.goog_events_ListenerMap$listeners[a];
            b = Id(f, b, c, d); - 1 < b ? (Gd(f[b]), Array.prototype.splice.call(f, b, 1), 0 == f.length && (delete e.goog_events_ListenerMap$listeners[a], e.typeCount_--), e = !0) : e = !1
        } else e = !1;
        return e
    };
    var qg = function(a, b, c, d) {
        b = a.eventTargetListeners_.goog_events_ListenerMap$listeners[String(b)];
        if (!b) return !0;
        b = b.concat();
        for (var e = !0, f = 0; f < b.length; ++f) {
            var g = b[f];
            if (g && !g.removed && g.capture == c) {
                var h = g.listener,
                    p = g.handler || g.src;
                g.callOnce && Kd(a.eventTargetListeners_, g);
                e = !1 !== h.call(p, d) && e
            }
        }
        return e && 0 != d.returnValue_
    };
    var tg = function(a) {
        pg.call(this);
        this.goog_events_ActionHandler$element_ = a;
        N(a, sg, this.handleKeyDown_, !1, this);
        N(a, "click", this.handleClick_, !1, this)
    };
    n(tg, pg);
    var sg = Yb ? "keypress" : "keydown";
    tg.prototype.handleKeyDown_ = function(a) {
        (13 == a.goog_events_BrowserEvent$keyCode || Zb && 3 == a.goog_events_BrowserEvent$keyCode) && ug(this, a)
    };
    tg.prototype.handleClick_ = function(a) {
        ug(this, a)
    };
    var ug = function(a, b) {
        var c = new vg(b);
        if (rg(a, c)) {
            c = new wg(b);
            try {
                rg(a, c)
            } finally {
                b.goog_events_Event_prototype$stopPropagation()
            }
        }
    };
    tg.prototype.disposeInternal = function() {
        tg.superClass_.disposeInternal.call(this);
        Xd(this.goog_events_ActionHandler$element_, sg, this.handleKeyDown_, !1, this);
        Xd(this.goog_events_ActionHandler$element_, "click", this.handleClick_, !1, this);
        delete this.goog_events_ActionHandler$element_
    };
    var wg = function(a) {
        M.call(this, a.event_);
        this.type = "action"
    };
    n(wg, M);
    var vg = function(a) {
        M.call(this, a.event_);
        this.type = "beforeaction"
    };
    n(vg, M);
    var xg = function(a) {
        E.call(this);
        this.handler_ = a;
        this.goog_events_EventHandler$keys_ = {}
    };
    n(xg, E);
    var yg = [];
    xg.prototype.listen = function(a, b, c, d) {
        ka(b) || (b && (yg[0] = b.toString()), b = yg);
        for (var e = 0; e < b.length; e++) {
            var f = N(a, b[e], c || this.handleEvent, d || !1, this.handler_ || this);
            if (!f) break;
            this.goog_events_EventHandler$keys_[f.key] = f
        }
        return this
    };
    xg.prototype.unlisten = function(a, b, c, d, e) {
        if (ka(b))
            for (var f = 0; f < b.length; f++) this.unlisten(a, b[f], c, d, e);
        else c = c || this.handleEvent, d = ma(d) ? !!d.capture : !!d, e = e || this.handler_ || this, c = Rd(c), d = !!d, b = Dd(a) ? Md(a.eventTargetListeners_, String(b), c, d, e) : a ? (a = Td(a)) ? Md(a, b, c, d, e) : null : null, b && (Yd(b), delete this.goog_events_EventHandler$keys_[b.key]);
        return this
    };
    var zg = function(a) {
        Ta(a.goog_events_EventHandler$keys_, function(a, c) {
            this.goog_events_EventHandler$keys_.hasOwnProperty(c) && Yd(a)
        }, a);
        a.goog_events_EventHandler$keys_ = {}
    };
    xg.prototype.disposeInternal = function() {
        xg.superClass_.disposeInternal.call(this);
        zg(this)
    };
    xg.prototype.handleEvent = function() {
        throw Error("k");
    };
    var Ag = function(a, b, c, d, e) {
        xg.call(this);
        this.shareUrl_ = a;
        this.shareName_ = b;
        this.shareDescription_ = c;
        this.imageUrl_ = d;
        e && (this.actionHandler_ && this.unlisten(this.actionHandler_, "action", this.buttonListener_), e && (this.actionHandler_ = new tg(e), Cc(this, qa(Dc, this.actionHandler_)), this.buttonListener_ = pa(this.doodle_GPlus_prototype$show, this), this.listen(this.actionHandler_, "action", this.buttonListener_)))
    };
    n(Ag, xg);
    Ag.prototype.doodle_GPlus_prototype$show = function() {
        sc(7);
        Bg() && !x("Trident") && !x("MSIE") && window.gapi && window.gapi.load ? window.gapi.load("share", pa(this.handleShareBoxLoad_, this)) : window.open("https://plus.google.com/share?url=" + this.shareUrl_)
    };
    var Bg = function() {
        if (!window.gbar) return !1;
        var a = !!(window.gbar.sos && 0 < window.gbar.sos().length),
            b = !(!window.gbar.so || !window.gbar.so());
        return a || b
    };
    Ag.prototype.handleShareBoxLoad_ = function() {
        if (window.gapi && window.gapi.share) {
            var a = {
                    items: [{
                        type: "http://schema.org/WebPage",
                        id: location.protocol + "//" + location.host,
                        properties: {
                            url: [this.shareUrl_],
                            name: [this.shareName_],
                            image: [this.imageUrl_]
                        }
                    }]
                },
                b = window.location.toString().match(/[?&]authuser=(\d+)/),
                b = b && b[1],
                c = Bg() || !!window.google.doodle.sf;
            window.gapi.share.lightbox(a, {
                isLoggedInForGooglePlus: c,
                onLoginPopupBlocked: function() {
                    Kb("gplus,popupblocked")
                },
                onLoginStateChanged: pa(function() {
                    ra("google.doodle.sf", !0);
                    this.handleShareBoxLoad_()
                }, this),
                editorText: this.shareDescription_,
                sessionIndex: b || "",
                sourceForLogging: "doodle"
            })
        }
    };
    var Cg = function(a) {
            return 0 == a.indexOf("//") ? "https:" + a : a
        },
        Dg = function(a) {
            var b = Fe();
            sc(9);
            window.location = "http://www.google.com/doodles/_SHARE?description=" + encodeURIComponent(b) + "&url=" + encodeURIComponent(a)
        };
    var Eg = function() {
        this.requests_ = {};
        this.numRequests_ = 0;
        this.scriptParent_ = document.body
    };
    ia(Eg);
    var Fg = {},
        Gg = function(a, b) {
            var c = a.requests_[b];
            c && (c.timerId && window.clearTimeout(c.timerId), c.scriptTag && (c.scriptTag.parentNode && c.scriptTag.parentNode.removeChild(c.scriptTag), c.scriptTag = null), c.successCallback = null, c.failureCallback = null)
        },
        Hg = function(a, b, c, d) {
            var e = a.requests_[b];
            if (e) {
                if (e.shortUrl) {
                    c && c(e.shortUrl);
                    return
                }
                if (e.timerId) return
            } else e = {
                failureCallback: d,
                longUrl: b,
                scriptTag: null,
                successCallback: c,
                timerId: 0,
                shortUrl: null
            };
            e.scriptTag || (e.scriptTag = document.createElement("script"));
            c = "c" + ++a.numRequests_;
            Fg[c] = function(a) {
                var b = Eg.getInstance(),
                    c = e;
                c.shortUrl = a.id;
                c.shortUrl ? c.successCallback && c.successCallback(c.shortUrl) : c.failureCallback && c.failureCallback();
                Gg(b, c.longUrl)
            };
            c = "//google-doodles.appspot.com/?callback=google.doodle.lsc." + c + "&url=" + encodeURIComponent(b);
            e.scriptTag.src = c;
            e.timerId = window.setTimeout(function() {
                e.failureCallback && e.failureCallback();
                Gg(Eg.getInstance(), b)
            }, 4E3);
            a.scriptParent_.appendChild(e.scriptTag);
            a.requests_[b] = e
        };
    ra("google.doodle.lsc", Fg);
    var Ig = function() {};
    Ig.prototype.setup = function() {
        this.controlsElm = document.getElementById("controls");
        this.controlsUIElm = document.getElementById("controlsui");
        this.gridInstrumentButtonElm = document.getElementById("gridinstrumentbutton");
        this.shareButtonElm = document.getElementById("hpofsharebutton");
        this.changeInstrumentsInstructionsElm = document.getElementById("changeinstrumentsinstructions");
        this.newRecordingElm = document.getElementById("newrecording");
        this.controlsElm && this.controlsUIElm && this.gridInstrumentButtonElm && this.shareButtonElm &&
        this.changeInstrumentsInstructionsElm && this.newRecordingElm && (rf() && (this.shareButtonElm.getElementsByTagName("div")[0].className = "sprite ss-sharrow"), this.currentMode = 0, this.gridInstrumentButtonElmBgY = -117, Jg(this), this.shortlinkUrl = document.getElementById("shortlinkurl"), N(this.shortlinkUrl, ["focus", "click", "touchstart"], this.highlightShortLink, !1, this))
    };
    var Jg = function(a) {
            a.gridInstrumentButtonElm.style.backgroundPosition = "0px " + a.gridInstrumentButtonElmBgY + "px"
        },
        If = function() {
            var a = G;
            a.controlsUIElm.className = a.controlsElm.className = "record";
            a.gridInstrumentButtonElm.className = ""
        },
        Lf = function() {
            var a = G;
            a.changeInstrumentsInstructionTimeout = setTimeout(function() {
                a.gridInstrumentButtonElm.className = "pulse";
                a.changeInstrumentsInstructionsElm.className = ""
            }, 8E3)
        },
        Uc = function(a) {
            null != a.changeInstrumentsInstructionTimeout && (clearTimeout(a.changeInstrumentsInstructionTimeout),
                a.changeInstrumentsInstructionTimeout = null)
        },
        Hf = function() {
            var a = G;
            Kg(a);
            a.instrumentButtonClickHandler = function() {
                Ac(4);
                Uc(a);
                a.gridInstrumentButtonElm.className = "";
                a.changeInstrumentsInstructionsElm.className = "hide";
                F++;
                3 <= F && Ac(6);
                4 <= F && (F = 0);
                B.visible = !0;
                Zc();
                J(a); - 39 < a.gridInstrumentButtonElmBgY && (a.gridInstrumentButtonElmBgY = -156, Jg(a));
                L(a, 250, {
                    gridInstrumentButtonElmBgY: -117 + 39 * F,
                    onUpdate: function() {
                        Jg(a)
                    }
                })
            };
            a.gridInstrumentButtonElm.addEventListener("click", a.instrumentButtonClickHandler);
            Q.instrument.start();
            a.onNote = function(a) {
                0 == a.value.instrument ? Mf.get(a.value.x * (v || 600), a.value.y * (w || 220), null, a.value) : 1 == a.value.instrument ? Ze.get(a.value.x * (v || 600), a.value.y * (w || 220), null, a.value) : 2 == a.value.instrument ? Of.get(a.value.x * (v || 600), a.value.y * (w || 220), null, a.value) : Qf.get(a.value.x * (v || 600), a.value.y * (w || 220), null, a.value)
            };
            Qc(Rc, a.onNote);
            a.shareButtonClickHandler = function() {
                rf() ? Lg(a) : Mg(a)
            };
            a.shareButtonElm.addEventListener("click", a.shareButtonClickHandler);
            a.newRecordingClickHandler =
                function() {
                    H.clearMatrix();
                    jg(a)
                };
            a.newRecordingElm.addEventListener("click", a.newRecordingClickHandler)
        },
        jg = function(a) {
            a.shortlinkUrl.selectionStart = 0;
            a.shortlinkUrl.selectionEnd = 0;
            a.shortlinkUrl.blur();
            a.currentMode = 1;
            a.controlsUIElm.className = a.controlsElm.className = "record";
            Kf(H)
        };
    Ig.prototype.highlightShortLink = function() {
        this.shortlinkUrl.focus();
        this.shortlinkUrl.select();
        this.shortlinkUrl.selectionStart = 0;
        this.shortlinkUrl.selectionEnd = this.shortlinkUrl.value.length
    };
    var Mg = function(a) {
            var b = a.shortlinkUrl;
            b.value = De + Sc();
            Hg(Eg.getInstance(), b.value, function(a) {
                b.value = a
            }, function() {
                console.log("Failed to generate shortlink. Shortlink server only accepts prod links.")
            });
            mg();
            a.currentMode = 2;
            a.controlsUIElm.className = a.controlsElm.className = "hpofshare"
        },
        Lg = function(a) {
            var b = a.shortlinkUrl;
            b.value = De + Sc();
            Hg(Eg.getInstance(), b.value, function(a) {
                zc();
                Dg(a)
            }, function() {
                zc();
                Dg(b.value)
            })
        },
        Kg = function(a) {
            Uc(a);
            null != a.onNote && (I(Rc, a.onNote), a.onNote = null, I(Rc, a.onInstrument),
                a.onInstrument = null);
            null != a.instrumentButtonClickHandler && (a.gridInstrumentButtonElm.removeEventListener("click", a.instrumentButtonClickHandler), a.instrumentButtonClickHandler = null);
            null != a.shareButtonClickHandler && (a.shareButtonElm.removeEventListener("click", a.shareButtonClickHandler), a.shareButtonClickHandler = null);
            null != a.newRecordingClickHandler && (a.newRecordingElm.removeEventListener("click", a.newRecordingClickHandler), a.newRecordingClickHandler = null);
            Xd(a.shortlinkUrl, ["focus", "touchstart"],
                a.highlightShortLink, !1, a)
        };
    Ig.prototype.cleanup = function() {
        this.controlsElm && this.controlsUIElm && (this.controlsUIElm.className = this.controlsElm.className = "", Kg(this))
    };
    var Ng = function(a, b) {
        this.fischinger_ProgressIcon$canvas = document.createElement("canvas");
        this.fischinger_ProgressIcon$canvas.width = 80;
        this.fischinger_ProgressIcon$canvas.height = 80;
        this.ctx = this.fischinger_ProgressIcon$canvas.getContext("2d");
        // this.imgElement = b.lastChild;
        this.imgElement = b.lastElementChild;
        this.imgElement.style.opacity = 0;
        this.circleStartAngle = -Math.PI / 2;
        this.domElement = b;
        this.domElement.appendChild(this.fischinger_ProgressIcon$canvas);
        this.progress = 0;
        this.radius = 30
    };
    Ng.prototype.setup = function() {
        this.update()
    };
    var ag = function(a, b, c) {
        a.onUpdate = function() {
            a.update()
        };
        L(a, c, {
            onUpdate: a.onUpdate,
            progress: b,
            radius: 30 + 8 * b
        })
    };
    Ng.prototype.update = function() {
        1 <= this.progress || null == this.ctx || (this.ctx.clearRect(0, 0, this.fischinger_ProgressIcon$canvas.width, this.fischinger_ProgressIcon$canvas.height), this.ctx.save(), .9 >= this.progress ? this.ctx.lineWidth = 4 : (this.imgElement.style.opacity = 1 - 10 * (1 - this.progress), this.ctx.lineWidth = 40 * (1 - this.progress)), this.ctx.translate(.5 * this.fischinger_ProgressIcon$canvas.width, .5 * this.fischinger_ProgressIcon$canvas.height), this.ctx.beginPath(), this.ctx.arc(0, 0, this.radius, 2 * Math.PI, !1), this.ctx.fillStyle =
            "rgba(255,255,255," + .2 * (1.5 - this.progress) + ")", this.ctx.fill(), this.ctx.closePath(), 0 < this.progress && (this.ctx.beginPath(), this.ctx.arc(0, 0, this.radius, this.circleStartAngle, 2 * Math.PI * this.progress + this.circleStartAngle, !1), this.ctx.strokeStyle = "#beebf9", this.ctx.stroke(), this.ctx.closePath()), this.ctx.restore())
    };
    Ng.prototype.cleanup = function() {
        J(this);
        this.domElement.removeChild(this.fischinger_ProgressIcon$canvas);
        this.fischinger_ProgressIcon$canvas = this.ctx = null
    };
    var Og = function() {};
    Og.prototype.setup = function() {
        this.introProgressElem = document.getElementById("introprogress");
        this.loadedCountElem = document.getElementById("loadedcount");
        if (this.introProgressElem || this.loadedCountElem) {
            var a = document.getElementById("introprogress").children;
            this.introProgressIcons = [];
            for (var b = 0; b < a.length; b++) this.introProgressIcons.push(new Ng(0, a[b])), this.introProgressIcons[b].setup()
        }
    };
    var cg = function(a) {
        if (null != a.introProgressIcons) {
            for (var b = 0; b < a.introProgressIcons.length; b++) a.introProgressIcons[b].cleanup();
            a.introProgressIcons = null;
            a.introProgressElem && (a.introProgressElem.style.display = "none");
            a.loadedCountElem && (a.loadedCountElem.style.display = "none")
        }
    };
    Og.prototype.cleanup = function() {
        cg(this)
    };
    var Pg = function() {		//google背景logo
        PIXI.Container.call(this)
    };
    n(Pg, PIXI.Container);
    Pg.prototype.setup = function() {
        if (null == this.backgroundSprite) {
            var a = this;
            this.backgroundSprite = new PIXI.Sprite(O.textures["bg.png"]);
            this.backgroundSprite.height = this.backgroundSprite.width = 600;
            this.backgroundTintColor = new sa(0, 0, 0);
            this.backgroundTintColorTarget = new sa(82 / 255, 111 / 255, 187 / 255);
            this.backgroundTintLerpSpeed = .005;
            this.addChild(this.backgroundSprite);
            this.touchHandler = new hg;
            C = new fg;
            C.setup();
            null == this.cta && (this.cta = new sf, this.cta.setup(), this.addChild(this.cta));
            we && (Qg(this), this.canvasBackgroundTintInterval =
                setInterval(function() {
                    Qg(a)
                }, 100))
        }
    };
    var vf = function(a) {
            me.style.display = "none";
            if (null != a.cta) {
                a.removeChild(a.cta);
                a.cta.cleanup();
                a.cta = null;
                if (a = document.getElementById("hplogo")) a.title = "";
                ce = new ng;
                H = new kg;
                de = new Og;
                G = new Ig;
                ce.setup();
                H.setup();
                de.setup();
                G.setup()
            }
        },
        xf = function(a) {
            Q.alpha = 1;
            null == a.bgSpriteMask && (a.bgSpriteMask = new PIXI.Graphics, a.bgSpriteMask.beginFill(0, 1), a.bgSpriteMask.drawCircle(0, 0, 200), a.bgSpriteMask.endFill());
            te(window.innerWidth, window.innerHeight);
            a.bgSpriteMask.x = .5 * v;
            a.bgSpriteMask.y = .5 * w;
            a.addChild(a.bgSpriteMask);
            a.mask = a.bgSpriteMask;
            a.bgSpriteMask.scale.x = 0;
            a.bgSpriteMask.scale.y = 0;
            setTimeout(function() {
                a.intro.setup();
                me.style.display = "";
                ue()
            }, 100);
            L(a.bgSpriteMask.scale, 1E3, {
                x: 5,
                y: 5,
                ease: wd,
                onComplete: function() {
                    a.mask = null;
                    a.removeChild(a.bgSpriteMask);
                    a.bgSpriteMask.destroy();
                    a.bgSpriteMask = null
                }
            });
            re || (re = !0, window.addEventListener("resize", ue))
        },
        bg = function(a) {
            if (null != a.intro && (a.removeChild(a.intro), a.intro.cleanup(), a.intro = null, Nb.backgroundColor = 0, ta && (!ha || ha(!1)))) try {
                window.localStorage.setItem("doodle-fischinger-first",
                    JSON.stringify(!1))
            } catch (b) {}
        };
    Pg.prototype.cleanup = function() {
        vf(this);
        bg(this);
        null != this.instrument && (this.removeChild(this.instrument), this.instrument.cleanup(), this.instrument = null);
        this.touchHandler = null;
        this.midiHandler && (this.midiHandler.cleanup(), this.midiHandler = null);
        null != ce && (ce.cleanup(), H.cleanup(), de.cleanup(), G.cleanup(), C.cleanup());
        null != this.canvasBackgroundTintInterval && (clearInterval(this.canvasBackgroundTintInterval), this.canvasBackgroundTintInterval = null);
        this.destroy()
    };
    Pg.prototype.update = function() {
        if (!t || window.innerWidth == v && window.innerHeight == w) var a = !1;
        else ue(), a = !0;
        null != this.cta && (this.cta.update(), a && this.cta.orientationHandler && this.cta.orientationHandler());
        null != this.intro && this.intro.update();
        Hc.update();
        A.getInstance().update();
        V && -1 <= V.red[0] && (V.red[0] -= .5);
        U && 0 <= U.blurY && U.blurY--;
        a = u * this.backgroundTintLerpSpeed;
        this.backgroundTintColor.r = Qa(this.backgroundTintColor.r, this.backgroundTintColorTarget.r, Math.min(Math.max(a, 0), 1));
        this.backgroundTintColor.g =
            Qa(this.backgroundTintColor.g, this.backgroundTintColorTarget.g, Math.min(Math.max(a, 0), 1));
        this.backgroundTintColor.b = Qa(this.backgroundTintColor.b, this.backgroundTintColorTarget.b, Math.min(Math.max(a, 0), 1));
        we || Qg(this);
        for (var b in ve)
            if (ve.hasOwnProperty(b)) {
                a = ve[b].activeShapes;
                for (var c = 0; c < a.length; c++) a[c].update()
            }
    };
    var Qg = function(a) {
        if (a.backgroundTintColor) {
            var b = a.backgroundSprite;
            a = a.backgroundTintColor;
            a = PIXI.utils.rgb2hex([a.r, a.g, a.b]);
            b.tint = a
        }
    };
    var Ug = function(a, b, c) {
        E.call(this);
        this.sleepTime_ = a;
        this.sleepCallback_ = b;
        this.wakeCallback_ = c;
        this.lastInteractTime_ = m();
        this.vendorHidden_ = Cb("hidden");
        this.vendorVisibilityChange_ = (this.vendorVisibilityState_ = Cb("visibilityState")) ? this.vendorVisibilityState_.replace(/state$/i, "change").toLowerCase() : null;
        this.isHidden_ = Rg(this);
        this.isIdle_ = !1;
        this.isSleeping_ = this.isHidden_;
        Sg(this);
        Tg(this)
    };
    n(Ug, E);
    var Sg = function(a) {
            a.vendorVisibilityChange_ ? Vg(a) : yb && Wg(a, function() {
                    Vg(a)
                })
        },
        Vg = function(a) {
            a.visibilityChangeCallback_ = function() {
                a.isHidden_ = Rg(a);
                a.isHidden_ ? Xg(a) : ig(a)
            };
            var b = window.agsa_ext;
            a.vendorVisibilityChange_ ? document.addEventListener(a.vendorVisibilityChange_, a.visibilityChangeCallback_, !1) : b && b.registerPageVisibilityListener && (google.doodle || (google.doodle = {}), google.doodle.pvc = function() {
                    a.visibilityChangeCallback_ && a.visibilityChangeCallback_()
                }, b.registerPageVisibilityListener("google.doodle.pvc();"))
        },
        Wg = function(a, b) {
            window.agsa_ext ? b() : a.agsaExtTimeout_ = window.setTimeout(function() {
                Sg(a)
            }, 100)
        };
    Ug.prototype.disposeInternal = function() {
        window.clearTimeout(this.timeout_);
        window.clearTimeout(this.agsaExtTimeout_);
        this.visibilityChangeCallback_ && (this.vendorVisibilityChange_ && document.removeEventListener ? document.removeEventListener(this.vendorVisibilityChange_, this.visibilityChangeCallback_, !1) : window.agsa_ext && window.agsa_ext.registerPageVisibilityListener && (this.visibilityChangeCallback_ = null));
        Ug.superClass_.disposeInternal.call(this)
    };
    var Rg = function(a) {
            if (!a.vendorHidden_ && !a.vendorVisibilityState_ && window.agsa_ext && window.agsa_ext.getPageVisibility) return "hidden" == window.agsa_ext.getPageVisibility();
            var b = document[a.vendorVisibilityState_];
            return document[a.vendorHidden_] || "hidden" == b
        },
        Xg = function(a) {
            var b = a.isHidden_ || a.isIdle_;
            a.isSleeping_ && !b ? (a.isSleeping_ = !1, a.wakeCallback_(), Tg(a)) : !a.isSleeping_ && b && (a.isSleeping_ = !0, a.sleepCallback_())
        },
        Tg = function(a) {
            a.timeout_ && window.clearTimeout(a.timeout_);
            var b = Math.max(100, a.sleepTime_ -
                Yg(a));
            a.timeout_ = window.setTimeout(function() {
                a.timeout_ = null;
                a.isIdle_ = Yg(a) >= a.sleepTime_;
                a.isIdle_ || Tg(a);
                Xg(a)
            }, b)
        },
        Yg = function(a) {
            return m() - a.lastInteractTime_
        },
        ig = function(a) {
            a.lastInteractTime_ = m();
            a.isIdle_ = !1;
            Xg(a)
        };
    var Zg = function(a, b) {
            window.google && google.doodle && (b && (google.doodle.cpDestroy = b), google.doodle.cpInit = function() {
                b && b();
                a()
            })
        },
        $g = function(a, b, c) {
            if (window.google) {
                var d = function() {
                        var a = google.msg && google.msg.unlisten;
                        a && (a(106, d), c && a(94, c));
                        b();
                        return !0
                    },
                    e = function() {
                        var a = document.getElementById("hplogo");
                        a && "hidden" != a.style.visibility && (a = google.msg && google.msg.listen, google.psy && google.psy.q && a && (a(106, d), c && a(94, c)))
                    };
                e();
                google.doodle && google.doodle.jesr || (ra("google.doodle.jesr", !0), google.raas &&
                google.raas("doodle", {
                    init: function() {
                        e();
                        google.doodle.jesrd && (a(), google.doodle.jesrd = !1)
                    },
                    dispose: function() {
                        d();
                        google.doodle.jesrd = !0
                    }
                }))
            }
        };
    var ah = function() {
        this.eventHandler_ = new xg(this);
        Cc(this, qa(Dc, this.eventHandler_));
        this.setup()
    };
    n(ah, E);
    ah.prototype.setup = function() {
        if (!this.renderer) {
            var a = document.getElementById("hplogocanvasdiv");			//画布
            if (a) {
                t && (document.body.className += " mobile");
                O = PIXI.loader.resources["spritesheets/cta.json"];
                var b = {
                    antialias: !1,
                    resolution: Lb(),
                    transparent: !1
                };
                this.renderer = ya ? new PIXI.CanvasRenderer(a.offsetWidth, a.offsetHeight, b) : PIXI.autoDetectRenderer(a.offsetWidth, a.offsetHeight, b);
                me = this.renderer.view;
                we = 1 == this.renderer instanceof PIXI.CanvasRenderer;
                this.stage = new Pg;
                ze(this.renderer,
                    this.stage);
                Ce();
                (b = document.getElementById("searchquery")) && this.eventHandler_.listen(b, "click", function() {
                    A.getInstance().log(3);
                    var a = google.doodle ? google.doodle.url : "";
                    a && Db(a, void 0)
                });
                this.renderer.autoResize = !0;
                document.getElementById("fpdoodle") || (this.renderer.backgroundColor = 16777215);
                this.renderer.render(this.stage);		//渲染器渲染一个舞台
                id();
                a.appendChild(me);
                qe = a;
                var c = document.getElementById("preset0"),		//预设音乐1
                    d = document.getElementById("preset1"),
                    e = document.getElementById("preset2"),
                    f = document.getElementById("tempoinput"),
                    g = document.getElementById("temposlider"),
                    a = function(a) {
                        a = parseInt(a.target.value, 10);
                        a = Math.min(Math.max(a, 1), 500);
                        yc = f.value = g.value = a;
                        B && Yc(B, a);
                        Bc(103)
                    };
                this.eventHandler_.listen(c, "click", function() {		//点击播放预设音乐1
                    var a = c.getAttribute("source");
                    Wc(he, 0, a);
                    uc(A.getInstance(), 0)
                });
                this.eventHandler_.listen(d, "click", function() {		//点击播放预设音乐2
                    var a = d.getAttribute("source");
                    Wc(he, 1, a);
                    uc(A.getInstance(), 1)
                });
                this.eventHandler_.listen(e, "click", function() {		//点击播放预设音乐3
                    var a = e.getAttribute("source");
                    Wc(he, 2, a);
                    uc(A.getInstance(), 2)
                });
                this.eventHandler_.listen(g, ["input", "change"], a);
                this.eventHandler_.listen(f, "change", a);
                var h = document.getElementById("bitcrusheffecton"),		//三个效果器
                    p = document.getElementById("delayeffecton"),
                    D = document.getElementById("phasereffecton");
                this.eventHandler_.listen(h, "click", function() {
                    h.checked ? (bd(), $c(), ad(), ed(), p.checked = !1, D.checked = !1, fd()) : (id(), ad());
                    Bc(103)
                });
                this.eventHandler_.listen(p, "click", function() {
                    p.checked ? (bd(), $c(), ad(), cd(), h.checked = !1, D.checked = !1, dd()) : (id(), $c());
                    Bc(103)
                });
                this.eventHandler_.listen(D, "click", function() {
                    D.checked ?
                        (bd(), $c(), ad(), gd(), p.checked = !1, h.checked = !1, hd()) : (id(), bd());
                    Bc(103)
                });
                var a = document.getElementById("twitter_share"),		//分享
                    b = document.getElementById("gplus_share"),
                    aa = document.getElementById("email_share");
                this.eventHandler_.listen(document.getElementById("facebook_share"), "click", function() {
                    zc();
                    var a = Ee(),
                        a = Cg(a),
                        b = new ab("http://www.facebook.com/sharer.php"),
                        c = new db;
                    c.add("u", a);
                    eb(b, c);
                    window.open(b.toString());
                    sc(5)
                });
                this.eventHandler_.listen(a, "click", function() {
                    zc();
                    var a = Ee(),
                        b = Fe(),
                        a = Cg(a),
                        a = "text=" + encodeURIComponent(String(b + "\n" + a));
                    window.open("http://twitter.com/intent/tweet?" + a);
                    sc(6)
                });
                this.eventHandler_.listen(b, "click", function() {
                    zc();
                    var a = Ee(),
                        b = Fe(),
                        a = Cg(a);
                    (new Ag(a, window.google.doodle.alt || "", b, "img/share.png")).doodle_GPlus_prototype$show()
                });
                this.eventHandler_.listen(aa, "click", function() {
                    zc();
                    var a = Ee(),
                        b = Fe();
                    sc(8);
                    var c = window.location,
                        a = Cg(a),
                        a = {
                            subject: Fb,
                            body: b + "\n" + a
                        },
                        b = new db;
                    for (d in a) b.add(d, a[d]);
                    var d = new ab("mailto:");
                    eb(d, b);
                    c.href = d.toString()
                });
                var Jd = document.getElementById("hpofclose"),			//关闭
                    a = document.getElementById("hpoffullscreen");		//全屏
                pf();
                b = af.name;
                vb || 3 == b || 4 == b || 5 == b ? Jd.style.visibility = "hidden" : this.eventHandler_.listen(Jd, "click", function() {
                    Fc() && Ec();
                    t ? Jd.style.visibility = "hidden" : Ge()
                });
                this.eventHandler_.listen(a, "click", function() {
                    Fc() ? Ec() : Ic()
                });
                var Ff = this;
                je = ke = !1;
                le = new Ug(24E4, function() {
                    ke = !0;
                    td = m();
                    B && B.fischinger_Keyboard_prototype$hide()
                }, function() {
                    ne = m();
                    ke = !1;
                    if (td) {
                        var a, b = K.length,
                            c = m() -
                                td;
                        for (a = 0; a < b; a++) K[a].start += c;
                        td = 0
                    }
                    B && (B.fischinger_Keyboard_prototype$show(), Nc());
                    je || bh(Ff);
                    0 <= r.indexOf("Firefox") && Jb(rd)
                });
                Jb(function() {
                    bh(Ff)
                })
            }
        }
    };
    ah.prototype.disposeInternal = function() {
        if (this.renderer) {
            var a = document.getElementById("hplogocanvasdiv");
            a && a.removeChild(me);
            B && B.fischinger_Keyboard_prototype$hide();
            ke = !0;
            je = !1;
            ld = [];
            qd = !1;
            K = [];
            Ae(S);
            Ae(T);
            Ae(U);
            Ae(V);
            S && S.cleanup();
            T && T.cleanup();
            V = U = T = S = null;
            xe = [];
            for (var b in ve) ve[b].cleanup();
            re && window.removeEventListener("resize", ue);
            te(600, 220);
            if (!t) {
                if (a = document.getElementById("lga")) a.style.marginTop = se;
                if (a = document.getElementById("hplogo")) a.style.left = "", a.style.position = "", a.style.zIndex =
                    ""
            }
            ie = nd({
                name: "doodleResize"
            });
            fe = nd({
                name: "tap"
            });
            ge = nd({
                name: "swipe"
            });
            nd({
                name: "instrument"
            });
            Rc = nd({
                name: "note"
            });
            u = ne = 0;
            oe = xa;
            P = O = null;
            Q.cleanup();
            me = Q = Q.filters = null;
            R = 1;
            w = v = 0;
            C = de = H = ce = qe = Nb = null;
            he.cleanup();
            he = new Pc;
            le.dispose();
            re = !1;
            Hc.dispose();
            for (var c in PIXI.utils.BaseTextureCache) delete PIXI.utils.BaseTextureCache[c];
            for (c in PIXI.utils.TextureCache) delete PIXI.utils.TextureCache[c];
            for (c in ee.resources) delete ee.resources[c].data, delete ee.resources[c];
            ee.reset();
            this.renderer =
                ee = null;
            t || Ka();
            ah.superClass_.disposeInternal.call(this)
        }
    };
    var bh = function(a) {
            if (ke) je = !1;
            else {
                je = !0;
                var b = m(),
                    c = b - (ne || b);
                if (0 == c || c > oe) u = Math.min(c, 40), ne = b, a.stage.update(), a.renderer.render(a.stage);		//渲染器渲染一个舞台
                requestAnimationFrame(function() {
                    bh(a)
                })
            }
        },
        ch = null,
        dh = function() {
            ee = PIXI.loader.add("img/scratches.png").add("spritesheets/cta.png").add("spritesheets/cta.json").load(function() {
                ch = new ah
            })
        };
    (function(a, b, c) {
        var d = function() {
                a();
                window.lol && window.lol()
            },
            e = function() {
                $g(d, b, c);
                Zg(d, b);
                d()
            };
        window.google && google.x ? google.x({
            id: "DOODLE"
        }, e) : e()
    })(function() {
        var a = document.getElementById("hplogo");
        if (a)
            if (a.lang = Gb, Ac(0), pf(), af.shouldLogFirstClickOnLoad && Bc(10), qf()) dh();
            else {
                var b = document.getElementById("hplogocanvasdiv");
                b && N(b, "click", function() {
                    dh();
                    if (b)
                        if (Dd(b)) b.eventTargetListeners_ && Ld(b.eventTargetListeners_, "click");
                        else {
                            var a = Td(b);
                            if (a) {
                                var d = 0,
                                    e = "click".toString(),
                                    f;
                                for (f in a.goog_events_ListenerMap$listeners)
                                    if (!e ||
                                        f == e)
                                        for (var g = a.goog_events_ListenerMap$listeners[f].concat(), h = 0; h < g.length; ++h) Yd(g[h]) && ++d
                            }
                        }
                });
                if (a = document.getElementById("lga")) a.style.paddingTop = window.getComputedStyle(a).marginTop, a.style.marginTop = "0"
            }
    }, function() {
        Dc(ch);
        ch = null;
        var a = document.getElementById("lst-ib");
        a && Xd(a, "keydown", He)
    });
    var fh = function() {
        Y.call(this, eh)
    };
    n(fh, Y);
    fh.prototype.init = function() {
        if (fh.superClass_.init.call(this)) return !0;
        this.NUM_DIAMONDS_ = 4;
        this.SPACING_ = 80;
        this.MAX_OFFSET_ = this.SPACING_ * this.NUM_DIAMONDS_;
        this.diamonds_ = [];
        for (var a = 0; a < this.NUM_DIAMONDS_; a++) {
            var b = new PIXI.Sprite(O.textures["diamond.png"]);
            b.blendMode = PIXI.BLEND_MODES.ADD;
            this.diamonds_[a] = b;
            this.addChild(b)
        }
        return !1
    };
    fh.prototype.onSpawn = function(a, b, c, d) {
        fh.superClass_.onSpawn.call(this, a, b, c, d);
        this.speed = .02;
        for (a = 0; a < this.NUM_DIAMONDS_; a++) b = this.diamonds_[a], b.scale.x = b.scale.y = .5, b.x = -b.width / 2, b.y = a * this.SPACING_;
        return this
    };
    fh.prototype.update = function() {
        fh.superClass_.update.call(this);
        for (var a = 0; a < this.NUM_DIAMONDS_; a++) {
            var b = this.diamonds_[a];
            b.y += u * this.speed;
            b.y >= this.MAX_OFFSET_ && (b.y = 0);
            b.alpha = b.y / this.MAX_OFFSET_
        }
    };
    var eh = new X("DiamondAntsShape", function() {
        return new fh
    }, 4);
}).call(this);

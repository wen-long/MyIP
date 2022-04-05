const $$ = document;
let random = parseInt(Math.random() * 100000000);
let IP = {
    get: (url, type) => fetch(url, { method: 'GET' })
        .then((resp) => {
            if (type === 'text')
                return Promise.all([resp.ok, resp.status, resp.text(), resp.headers]);
            else {
                return Promise.all([resp.ok, resp.status, resp.json(), resp.headers]);
            }
        })
        .then(([ok, status, data, headers]) => {
            if (ok) {
                let json = { ok, status, data, headers }
                return json;
            } else {
                throw new Error(JSON.stringify(json.error));
            }
        }).catch(error => {
            throw error;
        }),
    getJsonp: (url) => {
        var script = document.createElement('script');
        script.src = url
        document.head.appendChild(script);
    },
    parseIPMoeip: (ip, elID) => {
        IP.get(`https://ip.mcr.moe/?ip=${ip}&unicode&z=${random}`, 'json')
            .then(resp => {
                $$.getElementById(elID).innerHTML = `${resp.data.country} ${resp.data.area} ${resp.data.provider}`;
            })
    },
    parseIPIpapi: (ip, elID) => {
        IP.get(`https://ipapi.co/${ip}/json?z=${random}`, 'json')
            .then(resp => {
                $$.getElementById(elID).innerHTML = `${resp.data.country_name} ${resp.data.city} ${resp.data.org}`;
            })
    },
    getMyipIP: function() {
        IP.get(`https://api4.my-ip.io/ip.json?z=${random}`, 'json')
            .then(resp => {
                $$.getElementById('ip-myip').innerHTML = resp.data.ip;
            })
        IP.get(`https://api6.my-ip.io/ip.json?z=${random}`, 'json')
            .then(resp => {
                $$.getElementById('ip-myip-geo').innerHTML = resp.data.ip;
            })
    },

    getSpeedtestcnIP: () => {
        IP.get(`https://forge.speedtest.cn/api/location/info?z=${random}`, 'json')
            .then(resp => {
                $$.getElementById('ip-speedtestcn').innerHTML = resp.data.full_ip;
                $$.getElementById('ip-speedtestcn-geo').innerHTML = `${resp.data.country} ${resp.data.city} ${resp.data.isp}`;
            })
    },
    getIpinfoIP: () => {
        IP.get(`https://ipinfo.io/json?z=${random}`, 'json')
            .then(resp => {
                $$.getElementById('ip-ipinfo').innerHTML = resp.data.ip;
                $$.getElementById('ip-ipinfo-geo').innerHTML = `${resp.data.country} ${resp.data.city} ${resp.data.org}`;
            })
    },
    getIpgsIP: () => {
        IP.get(`https://ip.gs/json?z=${random}`, 'json')
            .then(resp => {
                $$.getElementById('ip-ipgs').innerHTML = resp.data.ip;
                $$.getElementById('ip-ipgs-geo').innerHTML = `${resp.data.country} ${resp.data.city} ${resp.data.asn_org}`;
            })
    },
    getIpipnetIPSimple: () => {
        IP.get(`https://myip.ipip.net/?z=${random}`, 'text')
        .then((resp) => {
            let data = resp.data.replace('当前 IP：', '').split(' 来自于：');
            $$.getElementById('ip-ipipnet').innerHTML = `${data[0]} ${data[1]}`;
        });
    },
    getCfnsIP: () => {

        IP.get(`https://cf-ns.com/cdn-cgi/trace?z=${random}`, 'text')
        .then((resp) => {
            prefix = 'ip='
            titleStart = resp.data.indexOf(prefix)
            titleEnd = resp.data.indexOf('ts=')
            ip = resp.data.substr(titleStart+prefix.length, titleEnd-titleStart-prefix.length)
            loc = resp.data.substr(titleStart+prefix.length)
            $$.getElementById('ip-cfns').innerHTML = `${ip}`;
        });

    },
    get138IP: () => {

        IP.get(`https://2022.ip138.com?z=${random}`, 'text')
        .then((resp) => {
            prefix = '<title>您的IP地址是：'
            titleStart = resp.data.indexOf(prefix)
            titleEnd = resp.data.indexOf('</title>')
            ip = resp.data.substr(titleStart+prefix.length, titleEnd-titleStart-prefix.length)
            loc = resp.data.substr(titleStart+prefix.length)
            locationPrefix = '来自：'
            locationStart = loc.indexOf('来自：')
            locationEnd = loc.indexOf('</p>')
            loc = loc.substr(locationStart+locationPrefix.length, locationEnd-locationStart-locationPrefix.length)
            $$.getElementById('ip-138').innerHTML = `${ip}`;
            $$.getElementById('ip-138-geo').innerHTML = `${loc}`;
        });

    },
    getIpsbv4IP: () => {
        IP.get(`https://api-ipv4.ip.sb/geoip?z=${random}`, 'json')
            .then(resp => {
                $$.getElementById('ip-ipsbv4').innerHTML = resp.data.ip;
                $$.getElementById('ip-ipsbv4-geo').innerHTML = `${resp.data.country} ${resp.data.city} ${resp.data.organization}`;
            })
    },

    getIpsbv6IP: () => {
        IP.get(`https://api-ipv6.ip.sb/geoip?z=${random}`, 'json')
            .then(resp => {
                $$.getElementById('ip-ipsbv6').innerHTML = resp.data.ip;
                $$.getElementById('ip-ipsbv6-geo').innerHTML = `${resp.data.country} ${resp.data.city} ${resp.data.organization}`;
            })
    },

    getIpapiIP: () => {
        IP.get(`https://ipapi.co/json?z=${random}`, 'json')
            .then(resp => {
                $$.getElementById('ip-ipapi').innerHTML = resp.data.ip;
                IP.parseIPIpapi(resp.data.ip, 'ip-ipapi-geo');
            })
            .catch(e => {
                console.log('Failed to load resource: ipapi.co')
            })
    }
};

let HTTP = {
    checker: (domain, cbElID) => {
        let img = new Image;
        let timeout = setTimeout(() => {
            img.onerror = img.onload = null;
            img.src = '';
            $$.getElementById(cbElID).innerHTML = '<span class="sk-text-error">连接超时</span>'
        }, 6000);

        img.onerror = () => {
            clearTimeout(timeout);
            $$.getElementById(cbElID).innerHTML = '<span class="sk-text-error">无法访问</span>'
        }

        img.onload = () => {
            clearTimeout(timeout);
            $$.getElementById(cbElID).innerHTML = '<span class="sk-text-success">连接正常</span>'
        }

        img.src = `https://${domain}/favicon.ico?${+(new Date)}`
    },
    runcheck: () => {
        HTTP.checker('www.baidu.com', 'http-baidu');
        HTTP.checker('s1.music.126.net/style', 'http-163');
        HTTP.checker('github.com', 'http-github');
        HTTP.checker('www.youtube.com', 'http-youtube');
    }
};

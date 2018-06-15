直接上代码:

```js
    var Observer = (function() {
        var _message = {};
        return {
            subscribe(type, fn) {
                if (_message[type]) {
                    _message[type].push(fn);
                } else {
                    _message[type] = [fn];
                }

            },
            publish(type, ...args) {
                if (!_message[type]) {
                    return;
                }
                _message[type].forEach(item => {
                    item.apply(this, args)
                })
            },
            unsubscribe(type, fn) { // fn不传，清楚type上所有的订阅，否则只清除传递的订阅
                if (!_message[type]) {
                    return;
                }
                if (fn) {
                    _message[type].forEach(function(item, index) {
                        item === fn && _message[type].splice(index, 1);
                    });
                } else {
                    _message[type] = null;
                }
            }

        }
    })()
```

    

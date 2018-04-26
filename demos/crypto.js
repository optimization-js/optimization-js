/*A simple wrapper around a cryptography library used.
In this case it is triplesec.
This is possibly quite horrible from the security point
of view. Any suggestions are very welcome and are greatly
appreciated if sent to iaroslav.github@gmail.com!
*/

function Crypt(pasw, log_fnc){
    this.pasw = pasw;
    this.log_fnc = log_fnc;

    this.encrypt = function (data, on_done){
        var self = this;
        triplesec.encrypt ({

            data:          new triplesec.Buffer(data),
            key:           new triplesec.Buffer(self.pasw),

            progress_hook: function (obj) { self.log_fnc(obj) }

        }, function(err, buff) {
            if (! err) {
                var ciphertext = buff.toString('hex');
                self.log_fnc('');
                on_done(ciphertext)
            }
        });
    }

    this.decrypt = function (data, on_done){
        var self = this;
        triplesec.decrypt ({
            data:          new triplesec.Buffer(data, "hex"),
            key:           new triplesec.Buffer(self.pasw),
            progress_hook: function (obj) { self.log_fnc(obj) }

        }, function (err, buff) {
            if (! err) {
                self.log_fnc('');
                on_done(buff.toString());
            }
        });
    }

}
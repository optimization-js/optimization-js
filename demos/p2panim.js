/*Just some silly animation of p2p.*/



function P2PAnimation(elem_id){
    this.h2 = document.getElementById(elem_id)
    this.buffer = ""
    this.connected = false
    this.databaseup = false

    this.visloc = -1
    this.direction = 1
    this.vismax = 7
    this.renderer = null;

    this.render = function(){
        if(this.renderer == null){
            return;
        }
        this.renderer();
    }

    this.online = function (){
        this.connected = true;
        this.render();
    }

    this.dbloaded = function (){
        this.databaseup = true;
        this.render();
    }

    this.offline = function (){
        this.connected = false;
        this.visloc = -1
        this.direction = 1
        this.render();
    }

    this.run = function (){
        var self = this;
        var renderer = function (){
            var asciimage = ""

            for(var i=0; i<self.vismax; i++){
                if(self.connected){
                    asciimage += i == self.visloc ? '*' : '-'
                }else{
                    asciimage += "&nbsp;"
                }
            }
            if(self.connected){
                if(self.databaseup){
                    self.visloc += self.direction;
                }

                if(self.visloc == 0){
                    self.direction = 1
                }

                if(self.visloc == self.vismax){
                    self.visloc -= 2;
                    self.direction = -1
                }
            }

            self.h2.innerHTML = ' P >' + asciimage + '< P'

        }

        this.renderer = renderer;
        setInterval(renderer, 500)
    }


}

    function Async(address) {
        this.req = new XMLHttpRequest();
        this.address = address
        this.lists = {}
    }

    Async.prototype = {

        constructor : Async,

        create : function(callback) {
            var self = this;
            this.req.open('GET', this.address, true);
            this.req.onreadystatechange = function(e) {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        //dump(this.responseText);
                        if (callback != null) callback()
                    } else {
                        //dump("COULD NOT LOAD \n");
                    }
                }
            }
            this.req.send(null);
            this.progress();
        },

        progress : function() {
            var self = this;

            this.req.addEventListener("progress", updateProgress, false);
            this.req.addEventListener("load", transferComplete, false);

            function updateProgress(e) {
                if (e.lengthComputable) {
                    var percentComplete = e.loaded / e.total;
                    console.log(percentComplete)
                } else {
                    //console.log("SIZE UNKNOWN: "+self.address)
                }
            }

            function transferComplete(e) {
                console.log(self.address+" COMPLETE!")
            }
        },

        response : function(json) {
            return json == true ? JSON.parse(this.req.responseText) : this.req.responseText    
        },

        createList : function(location,target,callback) {
            var self = this
            var bits = []

                if (location != null){
                    var group = self.response(true)[location[0]]
                    for (i = 0; i<location.length-1; i++){
                    group = group[location[i+1]] 
                    }
                } else {
                    var group = self.response(true)                 
                }
                for (x in group){
                    if (target.length > 1){
                        var element = group[x][target[0]]
                        for (i = 0; i<target.length-1; i++){
                        element = element[target[i+1]]
                        }
                        bits.push(element)                        
                    } else {
                        bits.push(group[x][target[0]]) 
                    }
                }
                self.lists[target[target.length-1]] = bits
                if (callback != null) callback()   
        },

    }



